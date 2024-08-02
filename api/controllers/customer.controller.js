import { errorHandler } from '../utils/error.js'
import Customer from '../models/customer.model.js';

export const addCustomer = async (req, res, next) => {

  try {
    const { fullName, email, phone, city, country, address, deliveryMethod } = req.body;
    if (!fullName || !email || !phone || !city || !country || !address || !deliveryMethod) {
      return next(errorHandler(400, 'All fields are required'));
    }
    const customer = new Customer({
      fullName,
      email,
      phone,
      city,
      country,
      address,
      deliveryMethod,
    });

    await customer.save();

    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    next(error);
  }
}

export const getCustomer = async (req, res, next) => {

  try {
    const customer = await Customer.findOne({ email: req.params.email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
}