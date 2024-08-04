import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    image: String,
    slug: String,
    category: String,
    quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
