import express from 'express';
import Nexmo from 'nexmo';
import {
  SmsPush,
} from '../models';

const router = express.Router();

const nexmo = new Nexmo({
  apiKey: '54f4e745',
  apiSecret: '911f9d784cc679a2',
});

const SmsSample = {
  phone: '01030261963',
  message: 'smstest',
  pushStatus: 0,
  sendTime: new Date(),
};

router.get('/testGet', (req, res) => {
  const phone = SmsSample.phone;
  const message = SmsSample.message;
  const pushStatus = SmsSample.pushStatus;
  const sendTime = SmsSample.sendTime;

  const push = new SmsPush({
    phone,
    message,
    pushStatus,
    sendTime,
  });

  const from = 'Nexmo';
  const to = '821030261963';
  const text = message;

  push.save((err, result) => {
    if (err) {
      return res.status(500).json({
        message: '에러',
        error: err,
      });
    }
    return nexmo.message.sendSms(from, to, text, () => {
      SmsPush.findOneAndUpdate(
        { _id: result.id },
        { $set: { pushStatus: 1 } },
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'smsPush 수정오류' });
          }
        }
      );
      return res.json({ data:'success' });
    });
  });
});
export default router;
