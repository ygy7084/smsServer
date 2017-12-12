import express from 'express';
import web_push from 'web-push';
import Nexmo from 'nexmo';
import configure from '../configure';
import {
  PushModel,
} from '../models'

const router = express.Router();

web_push.setGCMAPIKey('AIzaSyAFs9QXNkl6GYUK88GNHVDPYd0-idtPm9E');
const nexmo = new Nexmo({
  apiKey: configure.apiKey,
  apiSecret: configure.apiSecret,
  type: 'unicode',
});
router.post('/', (req, res) => {
  console.log(req.body.data);
  const endpoint = req.body.data.endpoint;
  const keys = req.body.data.keys;
  const message = req.body.data.message;
  const pushStatus = req.body.data.pushStatus;
  const phone = req.body.data.phone;
  const text2 = phone.substring(1,phone.length);
  const text1 = '82';
  const to = text1.concat(text2);
  const from = 'Mamre';
   const push = new PushModel({
    endpoint: endpoint,
    keys: keys,
    message: message,
    pushStatus: pushStatus,
    webPushStatus: 0,
    sendTime: new Date(),
  });
  push.save((err, result) => {
    if (err) {
      return res.status(500).json({
        message: '에러',
        error: err,
      });
    }
    if (keys!== undefined){
      return web_push.sendNotification({
        endpoint: endpoint,
        TTL: 0,
        keys: {
          auth: keys.authSecret,
          p256dh: keys.key,
        },
      }, JSON.stringify({
        message: message,
        id: result._id,
      }))
        .then(() => {
          PushModel.findOneAndUpdate(
            {_id: result.id},
            { $set: {"webPushStatus": 2, "pushStatus": 2}},
            (err) => {
              if(err) {
                return res.status(500).json({message: 'push 수정오류'});
              }
            }
          );
          return res.json({ data: true });
        })
        .catch((error) => {
          PushModel.findOneAndUpdate(
            {_id: result.id},
            { $set: {"webPushStatus" : 3}},
            (err) => {
              if(err) {
                return res.status(500).json({message: 'push 수정오류'});
              }
            }
          );
          console.log(error);
          return nexmo.message.sendSms(from, to,result.message,{type: 'unicode'}, (err, info) => {
            console.log(info);
            PushModel.findOneAndUpdate(
              {_id: result.id},
              {$set: {"pushStatus": 2,"smsPushStatus":2}},
              (err) => {
                if(err) {
                  return res.status(500).json({message: 'PushModel 수정오류'});
                }
              }
            );
            return res.json({data:'success'});
          });
        });
    } else {
      return nexmo.message.sendSms(from, to,result.message,{type:'unicode'}, (err, info) => {
        console.log(info);
        PushModel.findOneAndUpdate(
          {_id: result.id},
          {$set: {"pushStatus": 2,"smsPushStatus":2}},
          (err) => {
            if(err) {
              return res.status(500).json({message: 'PushModel 수정오류'});
            }
          }
        );
        return res.json({data:'success'});
      })
    }
  });
});

router.get('/:_id', (req, res) => {
  PushModel.findOneAndUpdate(
    {_id: req.params._id},
    { $set: {"pushStatus" : 2}},
    (err) => {
      if(err) {
        return res.status(500).json({message: 'push 수정오류'});
      }
    }
  );
  return res.json({ data: true });
});

export default router;