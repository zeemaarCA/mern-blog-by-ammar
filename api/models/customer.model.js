import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
