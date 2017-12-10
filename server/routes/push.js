import express from 'express';
import web_push from 'web-push';
import Nexmo from 'nexmo';
import {
  PushModel,
} from '../models'

const router = express.Router();

web_push.setGCMAPIKey('AIzaSyAFs9QXNkl6GYUK88GNHVDPYd0-idtPm9E');
const nexmo = new Nexmo({
  apiKey: '54f4e745',
  apiSecret: '911f9d784cc679a2',
  type: 'unicode',
});

const pushsample = {
  endPoint : "https://android.googleapis.com/gcm/send/eDPnMwhewm8:APA91bHILdPTOFC-9V-5LhdiF71wd2BzVulvDgr2bGm3DxdI9fu6SOzYbQZAsmCbcLmdIw7XT4Pg5Brjzr3cauxx9TAfN1Sr4iBck853AcQEtpgXFQhrGcg74aTJWYI3g00ipRIMc-i6",
  pushStatus : 0,
  keys: {
    key: "BM1ck0hsdRoWAtqqfboekMKPSueLw1P/bSrfmdswjVohJmn6pa2T5c3B5bP5iqzMkAGgvicsFI1Jmhh6NQqwOVs=",
    authSecret: "GO8Xpz4UP7StzOHk6s/1Ew=="
  },
  phone: '01030261963',
  message: "check체크",
};

router.get('/testGet', (req, res) => {

  const keys = pushsample.keys;
  const endPoint = pushsample.endPoint;
  const message = pushsample.message;
  const pushStatus = pushsample.pushStatus;
  const phone = pushsample.phone;
  const text2 = phone.substring(1,phone.length);
  const text1 = '82';
  const to = text1.concat(text2);
  const from = 'Mamre';
  const push = new PushModel({
    endPoint: endPoint,
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
    console.log(result.keys);
    if (keys!== undefined){
      return web_push.sendNotification({
        endpoint: endPoint,
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
          return nexmo.message.sendSms(from, to, result.message, () => {
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
      return nexmo.message.sendSms(from, to, result.message, () => {
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
router.post('/', (req, res) => {
  const endPoint = req.body.data.endPoint;
  const keys = req.body.data.keys;
  const message = req.body.data.message;
  const pushStatus = req.body.data.pushStatus;
  const phone = req.body.data.phone;
  const text2 = phone.substring(1,phone.length);
  const text1 = '82';
  const to = text1.concat(text2);
  const from = 'Mamre';
   const push = new PushModel({
    endPoint: endPoint,
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
        endpoint: endPoint,
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
          return nexmo.message.sendSms(from, to,'unicode',result.message, () => {
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
      return nexmo.message.sendSms(from, to,'unicode',result.message, () => {
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