import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { orders } from '../controllers/order.controller.js';


const router = express.Router();


router.get('/:userId', verifyToken, orders);



export default router