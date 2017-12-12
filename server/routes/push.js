import express from 'express';
import {
  Push, Sms, WebPush,
} from '../models'
import {
  sendSms,
  sendWebPush,
} from '../modules';

const router = express.Router();

// router.post('/onlyweb', (req, res) => {
//
// });
router.post('/', (req, res) => {
  console.log(req.body.data);
  const {webPush, sms} = req.body.data;
  if (!webPush && !sms) {
    return res.status(500).json({message: '푸시 서버로의 입력이 잘못되었습니다.'});
  }
  const push = new Push({
    datetime: new Date(),
    status: 1, // 상위 push는 시작과 동시에 전송 중
  });
  push.save((err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'push db 저장에 문제가 있습니다.',
        err,
      });
    }
    const pushId = result._id;
    new Promise((resolve, reject) => {
      if (!webPush || !webPush.endpoint || webPush.keys) {
        reject();
      }
      return new WebPush({
        endpoint: webPush.endpoint,
        keys: webPush.keys,
        message: webPush.message,
        sentDatetime: new Date(),
      })
        .save((err, result) => {
          if (err) {
            reject();
          }
          const webPushId = result._id;
          return Push.findOneAndUpdate({
            _id: pushId,
          }, {
            webPush: webPushId,
          }, (err) => {
            if (err) {
              return res.status(500).json({message: '푸시 DB 수정 실패'});
            }
            return sendWebPush({
              endpoint: webPush.endpoint,
              authSecret: webPush.keys.authSecret,
              key: webPush.keys.key,
              message: webPush.message,
              _id: webPushId,
              sentDatetime: new Date(),
            })
              .then(() => {
                return WebPush.findOneAndUpdate({
                  _id: webPushId
                }, {
                  status: 2, // 전송 중 없이 바로 전송 완료 (향후 보완)
                }, (err) => {
                  if (err) {
                    return res.status(500).json({message: '웹 푸시 DB 수정 실패'});
                  }
                  return resolve()
                });
              });
          })
        })
    })
      .then(() => {
        return Push.findOneAndUpdate({
          _id: pushId,
        }, {
          status: 2,
        }, (err) => {
          if (err) {
            return res.status(500).json({message: '푸시 DB 수정 실패'});
          }
          return res.json({data: true});
        })
      })
        .catch((e) => {
          console.error(e);
          if (!sms || !sms.phone || !sms.message) {
            return res.status(500).json({message: '푸시 알림 실패 - SMS 정보가 없습니다.'});
          }
          new Sms({
            phone: sms.phone,
            message: sms.message,
            sentDatetime: new Date(),
          })
            .save((err, result) => {
              if (err) {
                return res.status(500).json({message: 'SMS DB 저장 실패'});
              }
              const smsId = result._id;
              Push.findOneAndUpdate({
                _id: pushId,
              }, {
                sms: smsId,
              }, (err) => {
                if (err) {
                  return res.status(500).json({message: '푸시 DB 수정 실패'});
                }
                sendSms({
                  from: 'Mamre',
                  to: sms.phone,
                  message: sms.message,
                })
                  .then(() => {
                    Sms.findOneAndUpdate({
                      _id: smsId
                    }, {
                      status: 2, // 전송 중 없이 바로 전송 완료 (향후 보완)
                    }, (err) => {
                      if (err) {
                        return res.status(500).json({message: 'SMS DB 수정 실패'});
                      }
                      Push.findOneAndUpdate({
                        _id: pushId,
                      }, {
                        status: 2,
                      }, (err) => {
                        if (err) {
                          return res.status(500).json({message: '푸시 DB 수정 실패'});
                        }
                        return res.json({data: true});
                      });
                    })
                      .catch(() => {
                        Sms.findOneAndUpdate({
                          _id: smsId
                        }, {
                          status: 3, // 실패
                        }, (err) => {
                          if (err) {
                            return res.status(500).json({message: 'SMS DB 수정 실패'});
                          }
                          return res.state(500).json({message: '푸시 실패'});
                        });
                      });
                  })
              })
            });
        });
      });
});
export default router;
