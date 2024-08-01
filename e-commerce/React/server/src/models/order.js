import mongoose from 'mongoose';
import { UserModel } from './user.js';

const orderSchema = new mongoose.Schema(
  {
    totalAmount: {
      trim: true,
      type: Number,
      required: true
    },
    userId: {
      ref: 'User',
      required: true,
      type: mongoose.Schema.Types.ObjectId
    },
    products: [
      {
        _id: {
          trim: true,
          required: true,
          type: mongoose.Schema.Types.ObjectId
        },
        name: {
          trim: true,
          type: String,
          required: true
        },
        price: {
          trim: true,
          type: Number,
          required: true
        },
        description: {
          trim: true,
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Delete order from user orders
orderSchema.pre('remove', async function (next) {
  const order = this;
  const user = await UserModel.findOne({ _id: order.userId });

  user.orders.filter(savedOrder => savedOrder._id !== order._id);
  await user.save();

  next();
});

export const OrderModel = mongoose.model('Order', orderSchema);
