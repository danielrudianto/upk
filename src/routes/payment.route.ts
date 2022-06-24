import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import PaymentController from "../controller/payment.controller";

const router = Router();
const prisma = new PrismaClient();

router.get(
    "/method", 
    PaymentController.getMethods
);

router.post("/proof",
    PaymentController.createProof
)

router.get("/", (req, res, next) => {
    /*
        Get history of payment of a user
    */
})

export default router;
