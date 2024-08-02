import Stripe from 'stripe';
import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe('sk_test_N9GrXRSMB1nazlDElS0f6QLC');
const endpointSecret = 'whsec_e1kCDRL8xyrpFAEjF6Lc6V8gR2JgWktQ';

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

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
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

async function handleCheckoutSessionCompleted(session) {
  const payment = new Payment({
    user: session.metadata.userId,
    sessionId: session.id,
    amount: session.amount_total,
    currency: session.currency,
    status: session.payment_status,
    createdAt: new Date(session.created * 1000),
  });

  await payment.save();

  const order = new Order({
    user: session.metadata.userId,
    products: session.display_items, // Adjust according to how you store products
    amount: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
    createdAt: new Date(session.created * 1000),
  });

  await order.save();
}
