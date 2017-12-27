import express from 'express';
import {
  sendSms,
} from '../modules';

const router = express.Router();

router.post('/', (req, res) => {
  const { to, message } = req.body.data;
  sendSms({
    to,
    message,
  })
    .then((info) => {
      res.json({ info });
    })
    .catch((error) => {
      res.status(500).json({ message: '메세지 전송에 에러가 있습니다.' , error });
    });
});

export default router;
