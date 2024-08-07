import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";


// Handle image upload
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No file uploaded'));
    }
    const filePath = `src/assets/img/${req.file.filename}`;
    res.status(200).json({ filePath });
  } catch (error) {
    next(error);
  }
};
export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a product'))
  }
  if (!req.body.title || !req.body.price || !req.body.category || !req.body.image || !req.body.description) {
    return next(errorHandler(400, 'All feilds are required'))
  }

  const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, '');

  const newProduct = new Product({
    ...req.body, slug
  })

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    next(error);
  }
}

export const getproducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const products = await Product.find({
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { description: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      products,
      totalProducts,
      lastMonthProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteproduct = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You are not allowed to delete this post'))
  }
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json('Product has been deleted');
  } catch (error) {
    next(error)
  }
}

export const updateproduct = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You are not allowed to update this post'))
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
          price: req.body.price
        },
      },
      { new: true }
    );
    if (!updatedProduct) {
      return next(errorHandler(404, 'Product not found'));
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }

}