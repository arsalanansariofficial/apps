import express from 'express';
import mongoose from 'mongoose';
import { dbOptions } from './utils/utils.js';
import userRouter from './routers/user-router.js';
import allowCORS from './middlewares/allow-cors.js';
import ratingRouter from './routers/rating-router.js';
import doctorRouter from './routers/doctor-router.js';
import appointmentRouter from './routers/appointment-router.js';

function run(port) {
  console.log(`Server is running on port ${port}`);
}

async function connectDB() {
  mongoose.set('strictQuery', true);
  return await mongoose.connect(process.env.databaseURL, dbOptions);
}

async function main() {
  try {
    const port = process.env.PORT;
    const app = express();
    app.use(express.static('public'));
    app.use(allowCORS);
    app.use(express.json());
    app.use(userRouter);
    app.use(doctorRouter);
    app.use(ratingRouter);
    app.use(appointmentRouter);
    connectDB();
    app.listen(port, run.bind(this, port));
  } catch (error) {}
}

main();
