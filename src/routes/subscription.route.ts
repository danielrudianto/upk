import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { BRI_service } from '../helper/bank.service';
import SubscriptionController from '../controller/subscription.controller';

const router = Router();
const prisma = new PrismaClient();

/* Route untuk menentukan biaya berlangganan dalam satuan Rupiah / bulan */

router.get("/price", SubscriptionController.getPrice);
router.post("/", SubscriptionController.create)

// Checking user subscription status
router.get("/", (req, res, next) => {
    const start_date = new Date(req.body.date);
})

export default router;