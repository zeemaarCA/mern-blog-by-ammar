import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  name: { type: String, required: true },
  user: { type: String, required: true },
  products: [productSchema],
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);
export default Order;