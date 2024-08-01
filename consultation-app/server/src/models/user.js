import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppointmentModel from '../models/appointment.js';
import {
  generateError,
  responseCodes,
  usersExceptions
} from '../utils/utils.js';

const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    dob: {
      type: String,
      trim: true
    },
    mobile: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    tokens: [
      {
        token: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

userSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'userId'
});

// Modify user object
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.tokens;
  delete user.password;
  return user;
};

// Verify the details of the user by credentials
userSchema.statics.findByCredentials = async function (emailId, password) {
  const user = await UserModel.findOne({ emailId });
  if (!user)
    throw generateError(
      responseCodes.UN_AUTHORIZED,
      usersExceptions.INVALID_EMAIL
    );

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword)
    throw generateError(
      responseCodes.UN_AUTHORIZED,
      usersExceptions.INVALID_PASSWORD
    );

  return user;
};

// Generates the token for authenticated users
userSchema.methods.generateAuthenticationToken = async function () {
  const secret = process.env.secret;
  const payload = { _id: this._id.toString() };
  const expirationTime = { expiresIn: '1 hour' };
  const token = jwt.sign(payload, secret, expirationTime);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  const removeTokenAt = 60 * 60 * 1000;
  async function removeToken() {
    const user = await UserModel.findById(this._id);
    user.tokens = user.tokens.filter(
      tokenObject => tokenObject.token !== token
    );
    await user.save();
  }
  setTimeout(removeToken.bind(this), removeTokenAt);
  return token;
};

// Hashes password from the user credentials
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

// Delete tasks created by the user when the user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await AppointmentModel.deleteMany({ userId: user._id });
  next();
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
