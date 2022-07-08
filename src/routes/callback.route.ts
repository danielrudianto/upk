import { Router } from 'express';
import CallbackController from '../controller/callback.controller';

const router = Router();

// Development purpose only
router.post("/approve", CallbackController.approvePayment)

export default router;