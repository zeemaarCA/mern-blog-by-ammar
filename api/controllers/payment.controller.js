import Stripe from 'stripe';
import { MongoClient } from 'mongodb';
import Order from '../models/order.model.js'; // Import your Order model
import Payment from '../models/payment.model.js'; // Import your Payment model
import dotenv from 'dotenv';

const stripe = new Stripe('sk_test_N9GrXRSMB1nazlDElS0f6QLC'); // Replace with your Stripe secret key
const endpointSecret = 'whsec_udCxeeAqzk1CVE71Q571qB6qNGRFRxLL';

// Connect to MongoDB
async function connectToDatabase() {
  const client = await MongoClient.connect('process.env.MONGO', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db('mern-blog');
}

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100, // amount in cents
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
  const db = await connectToDatabase();
  const paymentsCollection = db.collection('payments');
  const ordersCollection = db.collection('orders');

  await paymentsCollection.insertOne({
    paymentId: session.payment_intent,
    amount: session.amount_total,
    currency: session.currency,
    customer: session.customer,
    payment_status: session.payment_status,
    created: session.created,
  });

  await ordersCollection.insertOne({
    orderId: session.id,
    paymentId: session.payment_intent,
    customer: session.customer,
    amount: session.amount_total,
    currency: session.currency,
    items: session.display_items,
    created: session.created,
  });
}
