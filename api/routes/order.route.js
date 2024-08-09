import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { userorders, orders, allorders, updateOrderStatus, deleteorder } from '../controllers/order.controller.js';


const router = express.Router();


router.get('/allorders', verifyToken, allorders);
router.get('/:userId', verifyToken, orders);
router.get('/userorders/:userId', verifyToken, userorders);
router.put('/updatestatus/:orderId', verifyToken, updateOrderStatus);
router.delete('/deleteorder/:orderId', verifyToken, deleteorder);



export default router