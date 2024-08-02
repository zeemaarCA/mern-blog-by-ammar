// payment.controller.js
import Stripe from 'stripe';
import Order from '../models/order.model.js'; // Import your Order model
import Payment from '../models/payment.model.js'; // Import your Payment model
const stripe = new Stripe('sk_test_N9GrXRSMB1nazlDElS0f6QLC'); // Replace with your Stripe secret key

export const createCheckoutSession = async (req, res) => {
  try {
    // Extract products from cookies or request body
    const { products } = req.body;

    // Create a line item array for Stripe
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

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/payment-complete', // Replace with your success URL
      cancel_url: 'http://localhost:5173/payment-cancel',   // Replace with your cancel URL
    });

    // Send the session ID to the client
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleCheckoutSuccess = async (req, res) => {
  const { sessionId } = req.body;

  try {
    // Fetch the session details
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    // Create a payment record
    const payment = new Payment({
      user: req.user._id,
      sessionId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
    await payment.save();

    // Create an order record
    const order = new Order({
      user: req.user._id,
      products: session.display_items, // Adjust according to how you store products
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentStatus: paymentIntent.status,
    });
    await order.save();

    res.status(200).json({ message: 'Payment and order created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
