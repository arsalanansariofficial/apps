import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
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
    speciality: {
      type: String,
      trim: true,
      required: true
    },
    dob: {
      type: String,
      trim: true,
      required: true
    },
    address: {
      _id: {
        type: ObjectId,
        trim: true,
        required: true,
        unique: true
      },
      addressLine1: {
        type: String,
        trim: true,
        required: true
      },
      addressLine2: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true,
        required: true
      },
      state: {
        type: String,
        trim: true,
        required: true
      },
      postcode: {
        type: String,
        trim: true,
        required: true
      }
    },
    mobile: {
      type: String,
      trim: true,
      required: true
    },
    emailId: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    pan: {
      type: String,
      trim: true,
      required: true
    },
    highestQualification: {
      type: String,
      trim: true,
      required: true
    },
    college: {
      type: String,
      trim: true,
      required: true
    },
    totalYearsOfExp: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      trim: true,
      required: true
    }
  },
  { timestamps: true }
);

doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctorId'
});

doctorSchema.methods.toJSON = function () {
  const doctor = this.toObject();
  doctor.id = doctor._id;
  doctor.address.id = doctor.address._id;
  delete doctor._id;
  delete doctor.address._id;
  return doctor;
};

const DoctorModel = mongoose.model('Doctor', doctorSchema);

export default DoctorModel;
