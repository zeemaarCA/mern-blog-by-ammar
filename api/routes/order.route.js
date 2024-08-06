import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { allorders, orders } from '../controllers/order.controller.js';


const router = express.Router();


router.get('/:userId', verifyToken, orders);
router.get('/allorders/:userId', verifyToken, allorders);



export default router