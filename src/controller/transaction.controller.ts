import { Request, Response } from "express";
import QueryTransactionHelper from "../helper/transaction.helper";
import TransactionModel from "../models/transaction.model";

class TransactionController {
    static fetch = (req: Request, res: Response) => {
        const districtId = req.body.districtId;
        const userId = req.body.userId;
        const limit = parseInt(process.env.limit!);
        const page = (!req.query.page) ? 1 : Math.max(1, parseInt(req.query.page.toString()));
        const offset = (page - 1) * limit;
        const mode = (!req.query.mode) ? 1 : parseInt(req.query.mode?.toString());

        QueryTransactionHelper.create([
            TransactionModel.fetch(mode, userId, districtId, offset, limit),
            TransactionModel.count(mode, userId, districtId)
        ]).then(result => {
            return res.status(200).send({
                data: result[0],
                count: result[1]
            });
        }).catch(error => {
            return res.status(500).send(error);
        })
    }
}

export default TransactionController;