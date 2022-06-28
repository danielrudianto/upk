import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import BRI_service from "../helper/bank.service";
import TransactionController from "../controller/transaction.controller";

const router = Router();
const prisma = new PrismaClient();


router.get("/", TransactionController.fetch);
router.post("/", TransactionController.create);

router.delete("/:transactionId", (req, res, next) => {
  const id = parseInt(req.params.transactionId);
});

export default router;
