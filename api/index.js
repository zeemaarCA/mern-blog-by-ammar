import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import productRoutes from './routes/product.route.js';
import paymentRoutes from './routes/payment.route.js';
import orderRoutes from './routes/order.route.js';
import cartRoutes from './routes/cart.route.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log(err);
});

const __dirname = path.resolve();
const app = express();

// Use body-parser middleware for raw body needed by Stripe
app.use('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());

app.use('/img', express.static(path.join(__dirname, 'src/assets/img')));

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/product', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});
