import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { OrderModel } from './order.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      trim: true,
      type: String,
      minLength: 7,
      required: true,
      validate(password) {
        if (password.toLowerCase().includes('password'))
          throw new Error('Password is invalid');
      }
    },
    tokens: [
      {
        token: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Create a one-to-many relationship between user --> task
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId'
});

// Modify user object
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

// Verify the details of the user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Failed to login');

  const matchPassword = await bcrypt.compare(password, user['password']);
  if (!matchPassword) throw new Error('Failed to login');

  return user;
};

// Generates the token for authenticated users
userSchema.methods.generateAuthenticationToken = async function () {
  const user = this;
  const privateKey = 'user_authentication_token';
  const token = jwt.sign({ _id: user._id.toString() }, privateKey, {
    expiresIn: '1 hour'
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  const removeTokenAt = 60 * 60 * 1000;

  setTimeout(async () => {
    const user = await UserModel.findById(this['_id']);
    user.tokens = user.tokens.filter(
      tokenObject => tokenObject.token !== token
    );
    await user['save']();
  }, removeTokenAt);

  return token;
};

// Hashes password from the user credentials
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Delete orders created by the user when the user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await OrderModel.deleteMany({ userId: user._id });
  next();
});

export const UserModel = mongoose.model('User', userSchema);
