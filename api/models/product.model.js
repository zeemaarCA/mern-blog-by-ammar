import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png"
  },
  category: {
    type: String,
    default: "Uncategorized"
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
},
  { timestamps: true }

);

const Product = mongoose.model('Product', productSchema);
export default Product