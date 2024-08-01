import { Schema, model, models } from 'mongoose';

const postSchema = new Schema(
  {
    image: {
      type: String,
      trim: true,
      required: true
    },
    username: {
      type: String,
      trim: true,
      required: true
    },
    caption: {
      type: String,
      trim: true,
      required: true
    },
    likes: {
      type: Array
    },
    comments: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

const PostModel = models.Post || model('Post', postSchema);

export default PostModel;
