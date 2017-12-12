import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Sms = new Schema({
  phone: String,
  message: String,
  sentDatetime: Date,
  status: { type: Number, default: 0 },
});
const model = mongoose.model('sms', Sms);
export default model;
