import Stripe from 'stripe';
import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
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
        await handleChargeSucceeded(chargeSucceeded);
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
async function handleChargeSucceeded(charge) {
  try {
    let products = [];
    if (charge.metadata && charge.metadata.products) {
      try {
        products = JSON.parse(charge.metadata.products);
      } catch (parseError) {
        logger.error('Error parsing products from metadata:', parseError);
        // Handle the parsing error appropriately (e.g., log, send an alert, etc.)
        // Optionally, you might want to throw an error to stop processing the order
      }
    } else {
      logger.warn('No products found in metadata');
      // Decide how to handle the case where product data is missing
    }
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
      products,
      amount: charge.amount,
      currency: charge.currency,
      paymentStatus: charge.status,
      createdAt: new Date(charge.created * 1000),
    });
    await order.save();
    logger.info('Payment and order saved successfully');
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