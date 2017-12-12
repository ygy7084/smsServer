import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Push = new Schema({
  sms: { type: mongoose.Schema.Types.ObjectId, ref: 'sms' },
  webPush: { type: mongoose.Schema.Types.ObjectId, ref: 'webPush' },
  status: { type: Number, default: 0 },
  datetime: Date,
});
const model = mongoose.model('push', Push);
export default model;
