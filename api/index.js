import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import productRoutes from './routes/product.route.js';
import paymentRoutes from './routes/payment.route.js';
import customerRoutes from './routes/customer.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from 'body-parser';


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
}).catch((err) => {
  console.log(err);
})
const __dirname = path.resolve();
const app = express();

app.use('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());

app.use('/img', express.static(path.join(__dirname, 'src/assets/img')));



app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/product', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/customer', customerRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(bodyParser.raw({ type: 'application/json' }));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});