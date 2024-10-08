import Stripe from 'stripe';
import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import Cart from '../models/cart.model.js';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

mongoose.connect(process.env.MONGO).then(() => {
}).catch((err) => {
  console.log(err);
});
export const createCheckoutSession = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the cart for the user
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Create line items from the cart items
    const createLineItems = (cartItems) => {
      return cartItems.map(item => {
        const productName = item.title;
        const productImage = item.image.replace(/\s+/g, '');
        const quantity = item.quantity;
        const unitAmount = Math.round(item.price * 100);

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${productName}`,
              images: [productImage],
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        };
      });
    };

    // Use the cart items to create line items
    const lineItems = createLineItems(cart.items);

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://mern-blog-erf7.onrender.com/payment-complete',
      cancel_url: 'https://mern-blog-erf7.onrender.com/payment-cancel',
      metadata: {
        userId,
      },
    });

    // Send the session ID to the client
    res.json({ id: session.id });
  } catch (error) {
    // Handle errors and log them
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'charge.failed':
        const chargeFailed = event.data.object;
        await handleChargeFailed(chargeFailed);
        break;
      default:
        logger.warn(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    logger.error('Error handling webhook event:', error);
    res.status(500).json({ error: error.message });
  }
};

async function handleCheckoutSessionCompleted(session) {
  try {
    const userId = session.metadata.userId;
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('User or cart information not found');
    }

    // Create Payment Record
    const payment = new Payment({
      userId: userId,
      name: session.customer_details.name,
      user: session.customer_details.email,
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      paymentMethod: session.payment_method_types[0], // Simplified assumption
      // receipt_url: session.receipt_url || '',
      status: session.payment_status,
      createdAt: new Date(session.created * 1000),
    });

    await payment.save();

    // Create Order Record
    const order = new Order({
      orderId: session.id,
      userId: userId,
      name: session.customer_details.name,
      user: session.customer_details.email,
      products: cart.items.map(p => ({ productId: p.id, title: p.title, quantity: p.quantity })),
      amount: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      orderStatus: 'Pending',
      createdAt: new Date(session.created * 1000),
    });

    await order.save();
    logger.info('Payment and order saved successfully');

    // Clear Cart after successful payment
    await Cart.deleteOne({ userId: new mongoose.Types.ObjectId(userId) });

  } catch (error) {
    logger.error('Error saving payment or order:', error);
    throw new Error(`Error saving payment or order: ${error.message}`);
  }
}

async function handleChargeFailed(charge) {
  try {
    logger.warn(`Charge failed for user ${charge.metadata.userId}`);
  } catch (error) {
    logger.error('Error handling charge failure:', error);
    throw new Error(`Error handling charge failure: ${error.message}`);
  }
}


export const getPaymentDetails = async (req, res, next) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the payment details by userId
    const payment = await Payment.findOne({ userId }).sort({ createdAt: -1 });

    // If no payment details are found, return a 404 error
    if (!payment) {
      return res.status(404).json({ error: 'Payment details not found' });
    }

    // Return the payment details
    res.json(payment);
  } catch (error) {
    // Handle unexpected errors
    console.error('Error retrieving payment details:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the payment details' });
  }
};


export const allpayments = async (req, res, next) => {

  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see payments'))
  }

  try {
    // Fetch all orders without filtering by userId
    const allpayments = await Payment.find();

    // If no orders are found, return a 404 error
    if (allpayments.length === 0) {
      return res.status(404).json({ error: 'No payments found' });
    }

    // Return the orders
    res.json(allpayments);
  } catch (error) {
    // Handle unexpected errors
    next(error);
  }
};