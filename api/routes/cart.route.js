import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getCart, addCart, updateCart, removeItem } from '../controllers/cart.controller.js';

const router = express.Router();

// Get cart items for a user
router.get('/:userId', verifyToken, getCart);

// Add or update cart item
router.post('/addcart', verifyToken, addCart);

// Update entire cart
router.put('/:userId/', verifyToken, updateCart);

// Remove item from cart
router.delete('/:userId/:itemId', verifyToken, removeItem);

export default router;
