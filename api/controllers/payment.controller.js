import Stripe from 'stripe';
import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import cookieParser from 'cookie-parser';
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
    const { products, userId } = req.body;
    // return;
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://mern-blog-erf7.onrender.com/payment-complete',
      cancel_url: 'https://mern-blog-erf7.onrender.com/payment-cancel',
      metadata: {
        userId,
        products: JSON.stringify(products.map(p => ({ productId: p.id, title: p.title, quantity: p.quantity })))
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
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        await handleChargeSucceeded(chargeSucceeded, req, res);
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
async function handleChargeSucceeded(charge, req, res) {
  try {
    // 1. Extract Cookie Data:
    // (You'll need a way to access the request object in this function; adjust this part based on your framework or setup)

    // Assuming 'req' is available in this function's scope (if not, you'll need to pass it in)
    const cartCookie = req.cookies.cart; // Replace 'cart' with your actual cookie name

    if (!cartCookie) {
      throw new Error('Cart information not found in cookies');
    }

    const products = JSON.parse(cartCookie); // Parse the cookie string into an array of products

    // 2. Create Payment and Order Records:
    const payment = new Payment({
      name: charge.billing_details.name,
      user: charge.billing_details.email,
      sessionId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      paymentMethod: charge.payment_method_details.type,
      receipt_url: charge.receipt_url,
      status: charge.status,
      createdAt: new Date(charge.created * 1000),
    });

    await payment.save();

    const order = new Order({
      orderId: charge.id,
      name: charge.billing_details.name,
      user: charge.billing_details.email,
      products: products.map(p => ({ productId: p.id, title: p.title, quantity: p.quantity })),
      amount: charge.amount,
      currency: charge.currency,
      paymentStatus: charge.status,
      createdAt: new Date(charge.created * 1000),
    });
    await order.save();
    logger.info('Payment and order saved successfully');

    // 3. (Optional) Clear Cart Cookie:
    // If you want to clear the cart after a successful purchase, you can do it here.
    res.clearCookie('cart'); // Or however you clear cookies in your framework

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