import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const pushModel = new Schema({
  phone: String,
  endpoint: String,
  keys: {
    key: String,
    authSecret: String,
  },
  message: String,
  sendTime: Date,
  pushStatus: Number,
  webPushStatus: Number,
  smsPushStatus: Number,
  kakaoPushStatus: Number,
});
const model = mongoose.model('pushModel', pushModel);
export default model;
