import { Request, Response } from "express";
import { v4 } from "uuid";
import firebaseHelper from "../helper/firebase.helper";
import PaymentModel from "../models/payment.model";

class PaymentController {
    static getMethods = (req: Request, res: Response) => {
        PaymentModel.fetch().then(result => {
            return res.status(200).send(result);
        }).catch(error => {
            console.error(`[error]: Fetch payment error ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
        })
    }

    static fetch = (req: Request, res: Response) => {
        
    }

    static createProof = (req: Request, res: Response) => {
        const user_id = req.body.userId;
        const user_subscription_id = req.body.user_subscription_id;
        const user_transaction_id = req.body.user_transaction_id;
        const base64string = req.body.file;
        const name = req.body.name;
        const uid = v4();

        const bucket = firebaseHelper.storage().bucket("gs://abangku-apps.appspot.com");
        bucket.file(uid)
    }
}

export default PaymentController;