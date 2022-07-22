"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
class CallbackController {
}
CallbackController.approvePayment = (req, res) => {
    const transaction_id = !req.body.transaction_id
        ? null
        : req.body.transaction_id;
    const subscription_id = !req.body.subscription_id
        ? null
        : req.body.subscription_id;
    if (transaction_id != null) {
        // Approving PPOB transaction payment
        transaction_model_1.default.fetchById(transaction_id)
            .then((result) => {
            if (result == null) {
                return res.status(404).send("Transaksi tidak ditemukan.");
            }
            else if (result.is_paid) {
            }
            else {
            }
            transaction_model_1.default.approvePayment(transaction_id, (0, uuid_1.v4)())
                .then((result) => { })
                .catch((error) => {
                console.error(`[error]: Error approving transaction payment ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        })
            .catch((error) => {
            console.error(`[error]: Error fetching transaction detail ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }
    else if (subscription_id == null) {
        // Approving membership transaction payment
    }
};
exports.default = CallbackController;
