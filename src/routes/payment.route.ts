import { Router } from "express";
import PaymentController from "../controller/payment.controller";

const router = Router();

router.get("/method", PaymentController.getMethods);

router.get("/unconfirmed", PaymentController.fetchUnconfirmed);

router.post("/proof", PaymentController.createProof);

router.get("/", (req, res, next) => {
  /*
        Get history of payment of a user
    */
});

export default router;
