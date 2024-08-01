import express from 'express';
import cors from './middleware/cors.js';
import userRouter from './routers/user-router.js';
import orderRouter from './routers/order-router.js';
import connectDatabase from './database/mongoose.js';
import productRouter from './routers/product-router.js';

const app = express();

try {
  await connectDatabase();
  app.use(cors);
  app.use(express.json());
  app.use(express.static('public'));
  app.use(userRouter);
  app.use(productRouter);
  app.use(orderRouter);
} catch (error) {
  console.error('Error connecting to database:', error.message);
}

export default app;
