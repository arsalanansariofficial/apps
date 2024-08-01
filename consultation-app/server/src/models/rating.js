import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      trim: true,
      required: true
    },
    doctorId: {
      type: String,
      trim: true,
      required: true
    },
    rating: {
      type: Number,
      trim: true,
      required: true
    },
    comments: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

ratingSchema.methods.toJSON = function () {
  const rating = this.toObject();
  rating.id = rating._id;
  delete rating._id;
  return rating;
};

const RatingModel = mongoose.model('Rating', ratingSchema);

export default RatingModel;
