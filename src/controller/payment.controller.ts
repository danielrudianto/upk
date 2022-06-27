import { Request, Response } from "express";
import { v4 } from "uuid";
import firebaseHelper from "../helper/firebase.helper";
import MediaHelper from "../helper/media.helper";
import PaymentModel from "../models/payment.model";
import PaymentProofModel from "../models/payment_proof.model";

class PaymentController {
  static getMethods = (req: Request, res: Response) => {
    PaymentModel.fetch()
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(`[error]: Fetch payment error ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };

  static fetchUnconfirmed = (req: Request, res: Response) => {
    const page = !req.query.page
      ? 1
      : Math.max(parseInt(req.query.page.toString()), 1);
    const limit = parseInt(process.env.LIMIT!);
    const offset = (page - 1) * limit;
    const mode = req.query.mode;

    switch (mode) {
      case "Membership":
        PaymentModel.fetchUnconfirmedMembershipPayment(offset, limit).then((result) => {
          return res.status(200).send(result);
        }).catch(error => {
          return res.status(500).send(error);
        })
        break;
      default:
        return res.status(404).send("Transaksi tidak ditemukan.");
    }
  };

  static createProof = (req: Request, res: Response) => {
    const user_id = req.body.userId;
    const user_subscription_id = req.body.user_subscription_id;
    const user_transaction_id = req.body.user_transaction_id;
    const base64string = req.body.file;
    const name = req.body.name;

    const names = name.split(".");
    const extension = names[names.length - 1];

    const uid = v4();
    const fileName = `${uid}.${extension}`;
    const file = MediaHelper.toFile(base64string);

    const bucket = firebaseHelper
      .storage()
      .bucket("gs://abangku-apps.appspot.com");
    bucket
      .file(uid)
      .save(file)
      .then((media) => {
        const payment_proof = new PaymentProofModel(
          user_subscription_id,
          user_transaction_id,
          fileName,
          user_id
        );
        payment_proof
          .create()
          .then((result) => {
            return res.status(201).send(result);
          })
          .catch((error) => {
            console.error(
              `[error]: Error creating payment proof ${new Date()}`
            );
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
          });
      })
      .catch((error) => {
        console.error(`[error]: Error uploading payment proof ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };
}

export default PaymentController;
