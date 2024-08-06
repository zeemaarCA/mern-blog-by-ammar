import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, expires: '10m', default: Date.now } // Code expires in 10 minutes
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode;
