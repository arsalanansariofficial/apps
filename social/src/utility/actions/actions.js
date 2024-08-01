'use server';
import fs from 'node:fs';
import mongoose from 'mongoose';
import PostModel from '@/models/post-model';
import { revalidatePath } from 'next/cache';

function connectDb() {
  return mongoose.connect(process.env.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
}

export async function getPosts() {
  await connectDb();
  const result = await PostModel.find();
  return result.map(function (post) {
    return {
      id: post._id.toString(),
      image: post.image,
      caption: post.caption,
      username: post.username,
      likes: post.likes,
      comments: post.comments
    };
  });
}

export async function getPost(postId) {
  await connectDb();
  const post = await PostModel.findOne({ _id: postId });
  return {
    id: post._id.toString(),
    image: post.image,
    caption: post.caption,
    username: post.username,
    likes: post.likes,
    comments: post.comments
  };
}

export async function likePost(postId, like = true) {
  await connectDb();
  const post = await PostModel.findOne({ _id: postId });
  if (like) post.likes.push(post.likes.length + 1);
  else post.likes.pop();
  const newPost = new PostModel(post);
  newPost.save();
  revalidatePath('/');
}

export async function commentPost(postId, formData) {
  await connectDb();
  const comment = {
    username: formData.get('post-username'),
    comment: formData.get('post-comment')
  };
  const post = await PostModel.findOne({ _id: postId });
  post.comments.push(comment);
  await post.save();
  revalidatePath('/');
}

export default async function uploadPost(formData) {
  await connectDb();
  const file = formData.get('post-picture');
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);
  const postBody = {
    image: file.size ? `/img/${file.name}` : '/img/profile-picture.png',
    username: formData.get('post-username'),
    caption: formData.get('post-caption'),
    likes: [],
    comments: []
  };
  if (file.size) fs.writeFileSync(`public/img/${file.name}`, fileBuffer);
  const post = new PostModel(postBody);
  await post.save();
  revalidatePath('/', 'layout');
}
