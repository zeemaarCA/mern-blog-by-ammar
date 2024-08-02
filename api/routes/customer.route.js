import express from 'express'
import { addCustomer, getCustomer } from '../controllers/customer.controller.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()


router.post('/addcustomer', addCustomer)
router.get('/:email', getCustomer)



export default router