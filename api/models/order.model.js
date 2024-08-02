import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Object, required: true }], // Adjust as needed
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentStatus: { type: String, required: true },
},
  {
    timestamps: true
  });

const Order = mongoose.model('Order', orderSchema);
export default Order;
