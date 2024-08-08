import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  user: { type: String, required: true },
  products: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
  }],
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  orderStauts: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);
export default Order;