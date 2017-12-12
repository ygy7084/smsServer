import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const WebPush = new Schema({
  endpoint: String,
  keys: {
    key: String,
    authSecret: String,
  },
  message: String,
  sentDatetime: Date,
  receivedDatetime: Date,
  status: { type: Number, default: 0 },
});
const model = mongoose.model('webPush', WebPush);
export default model;
