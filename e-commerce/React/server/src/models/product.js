import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
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
    },
    productImage: {
      trim: true,
      type: String,
      required: true,
      default: '/images/default.jpg'
    }
  },
  {
    timestamps: true
  }
);

export const ProductModel = mongoose.model('Product', productSchema);
