import Nexmo from 'nexmo';
import configure from '../configure';

export default function sendSms({ to, message }) {
  return new Promise((resolve, reject) => {
    new Nexmo({
      apiKey: configure.SMS_API_KEY,
      apiSecret: configure.SMS_API_SECRET,
      type: 'unicode',
    })
      .message.sendSms(configure.SMS_SENDER, to, message, { type: 'unicode' }, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
  });
}
