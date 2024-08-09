import Order from '../models/order.model.js';
import { errorHandler } from "../utils/error.js";

export const allorders = async (req, res, next) => {

  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all orders'))
  }

  try {
    // Fetch all orders without filtering by userId
    const allorders = await Order.find();

    // If no orders are found, return a 404 error
    if (allorders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    // Return the orders
    res.json(allorders);
  } catch (error) {
    // Handle unexpected errors
    next(error);
  }
};



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


export const userorders = async (req, res, next) => {
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

export const updateOrderStatus = async (req, res, next) => {

  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this order'))
  }
  try {
    const updatedStatus = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: {
          orderStatus: req.body.orderStatus
        },
      },
      { new: true }
    );
    if (!updatedStatus) {
      return next(errorHandler(404, 'Order not found'));
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
}

export const deleteorder = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this order'))
  }
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.status(200).json('Order has been deleted');
  } catch (error) {
    next(error)
  }
}


