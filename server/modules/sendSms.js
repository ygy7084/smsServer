import Nexmo from 'nexmo';
import configure from '../configure';

export default function sendSms({ from, to, message }) {
  return new Promise((resolve, reject) => {
    new Nexmo({
      apiKey: configure.SMS_API_KEY,
      apiSecret: configure.SMS_API_SECRET,
      type: 'unicode',
    })
      .message.sendSms(from, to, message,{ type: 'unicode' }, (err, info) => {
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
