import { errorHandler } from '../utils/error.js';
import Cart from '../models/cart.model.js';

export const getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};

export const addCart = async (req, res, next) => {
  try {
    const { userId, id, title, price, image, slug, category, quantity } = req.body;

    if (!userId || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ id, title, price, image, slug, category, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items } = req.body; // Expecting entire cart data

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find and update user's cart in the database
    const userCart = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { new: true } // Return the updated document
    );

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { userId, itemId } = req.params;

    if (!userId || !itemId) {
      return res.status(400).json({ message: "Missing userId or itemId parameter" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.id !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    next(error);
  }
};
