import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createCheckoutSession, handleWebhook } from '../controllers/payment.controller.js';


const router = express.Router();



router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', handleWebhook);



export default router