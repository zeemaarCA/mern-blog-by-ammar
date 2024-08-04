import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, required: true },
  sessionId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
  // receipt_url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;