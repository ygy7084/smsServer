import express from 'express';
import smsPush from './smsPush';
import push from './push';
import sms from './sms';

const router = express.Router();

router.use('/smsPush', smsPush);
router.use('/push', push);
router.use('/sms', sms);

export default router;
