import { Router } from "express";
import TransactionController from "../controller/transaction.controller";

const router = Router();


router.get("/", TransactionController.fetch);
router.post("/topup", TransactionController.topUp);
router.post("/", TransactionController.create);

router.delete("/:transactionId", (req, res, next) => {
  const id = parseInt(req.params.transactionId);
});

export default router;
