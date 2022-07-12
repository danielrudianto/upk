import { Request, Response } from "express";
import { v4 } from "uuid";
import TransactionModel from "../models/transaction.model";

class CallbackController {
  static approvePayment = (req: Request, res: Response) => {
    const transaction_id = !req.body.transaction_id
      ? null
      : req.body.transaction_id;
    const subscription_id = !req.body.subscription_id
      ? null
      : req.body.subscription_id;

    if (transaction_id != null) {
      // Approving PPOB transaction payment
      TransactionModel.fetchById(transaction_id)
        .then((result) => {
          if (result == null) {
            return res.status(404).send("Transaksi tidak ditemukan.");
          } else if (result.is_paid) {
          } else {
          }
          TransactionModel.approvePayment(transaction_id, v4())
            .then((result) => {})
            .catch((error) => {
              console.error(
                `[error]: Error approving transaction payment ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        })
        .catch((error) => {
          console.error(
            `[error]: Error fetching transaction detail ${new Date()}`
          );
          console.error(`[error]: ${error}`);

          return res.status(500).send(error);
        });
    } else if (subscription_id == null) {
      // Approving membership transaction payment
    }
  };
}

export default CallbackController;
