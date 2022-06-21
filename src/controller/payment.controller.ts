import { Request, Response } from "express";
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
}

export default PaymentController;