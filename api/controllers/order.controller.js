import Order from '../models/order.model.js'; // Import your Order model

export const orders = async (req, res, next) => {
  try {
    // Extract the session ID from the request parameters
    const { sessionId } = req.params;

    // Ensure sessionId is provided
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Find the order by session ID
    const order = await Order.findOne({ orderId: sessionId });

    // If no order is found, return a 404 error
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return the order details
    res.json(order);
  } catch (error) {
    // Handle unexpected errors
    console.error('Error retrieving order:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the order' });
  }
};
