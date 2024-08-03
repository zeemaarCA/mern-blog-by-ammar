import mongoose from 'mongoose';


// Define a sub-schema for products
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  // Add any other fields relevant to your product
}, { _id: false }); // Prevents creating a unique _id for each sub-document

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  name: { type: String, required: true },
  user: { type: String, required: true },
  products: [productSchema], // Use the product schema
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
