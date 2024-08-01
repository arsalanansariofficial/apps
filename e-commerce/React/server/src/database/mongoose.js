import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export default async function connectDatabase() {
  return await mongoose.connect(process.env.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
}
