import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { BRI_service } from "../helper/bank.service";
import SubscriptionController from "../controller/subscription.controller";
import { body } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

/* Route untuk menentukan biaya berlangganan dalam satuan Rupiah / bulan */

router.get("/price", SubscriptionController.getPrice);
router.post(
  "/",
  body("districtId").isEmpty().withMessage("Kepengurusan tidak membutuhkan biaya keanggotaan."),
  body("payment_method").not().isEmpty().withMessage("Mohon isikan metode pembayaran."),
  SubscriptionController.create
);

export default router;
