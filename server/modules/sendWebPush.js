import webPush from 'web-push';
import configure from '../configure';

webPush.setGCMAPIKey(configure.WEB_PUSH_GCMAPI_KEY);

export default function sendWebPush ({ endpoint, authSecret, key, message, _id }) {
  return new Promise((resolve, reject) => {
    if (
      !endpoint ||
      !authSecret ||
      !key ||
      !message ||
      !_id
    ) {
      return reject();
    }
    // return promise
    return webPush.sendNotification({
      endpoint,
      TTL: 0,
      keys: {
        auth: authSecret,
        p256dh: key,
      },
    }, JSON.stringify({
      message,
      _id,
    }))
      .then(() => resolve())
      .catch((e) => reject(e));
  });
}
