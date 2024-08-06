import Order from '../models/order.model.js'; // Import your Order model

export const orders = async (req, res, next) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the order by userId
    const order = await Order.findOne({ userId }).sort({ createdAt: -1 });

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


export const allorders = async (req, res, next) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find all orders by userId
    const orders = await Order.find({ userId });

    // If no orders are found, return a 404 error
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    // Return the orders
    res.json(orders);
  } catch (error) {
    // Handle unexpected errors
    next(error);
  }
};