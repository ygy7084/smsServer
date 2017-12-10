import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SmsPush = new Schema({
  phone: String,
  message: String,
  pushStatus: Number,
  sendTime: Date,
});
const model = mongoose.model('smsPush', SmsPush);
export default model;
