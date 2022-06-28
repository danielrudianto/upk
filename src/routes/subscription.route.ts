import { Router } from "express";
import { BRI_service } from "../helper/bank.service";
import SubscriptionController from "../controller/subscription.controller";
import { body } from "express-validator";

const router = Router();

/* Route untuk menentukan biaya berlangganan dalam satuan Rupiah / bulan */

router.get("/price", SubscriptionController.getPrice);
router.get("/", SubscriptionController.fetch);
router.post(
  "/",
  body("districtId").isEmpty().withMessage("Kepengurusan tidak membutuhkan biaya keanggotaan."),
  body("payment_method").not().isEmpty().withMessage("Mohon isikan metode pembayaran."),
  SubscriptionController.create
);

export default router;
