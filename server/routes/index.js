import express from 'express';
import smsPush from './smsPush';
import push from './push';

const router = express.Router();

router.use('/smsPush', smsPush);
router.use('/push', push);

export default router;