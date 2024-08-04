import Stripe from 'stripe';
import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import Cart from '../models/cart.model.js';
dotenv.config();
const stripe = new Stripe('sk_test_N9GrXRSMB1nazlDElS0f6QLC');
const endpointSecret = 'whsec_e1kCDRL8xyrpFAEjF6Lc6V8gR2JgWktQ';
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  logger.error('MongoDB connection error:', err);
});
export const createCheckoutSession = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
    // return;
    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
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
    res.json({ id: session.id });
    return
  } catch (error) {
    logger.error('Error creating checkout session:', error);
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
      name: session.customer_details.name,
      user: session.customer_details.email,
      products: cart.items.map(p => ({ productId: p.id, title: p.title, quantity: p.quantity })),
      amount: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
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