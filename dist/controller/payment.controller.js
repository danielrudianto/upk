"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const firebase_helper_1 = __importDefault(require("../helper/firebase.helper"));
const payment_model_1 = __importDefault(require("../models/payment.model"));
class PaymentController {
}
PaymentController.getMethods = (req, res) => {
    payment_model_1.default.fetch().then(result => {
        return res.status(200).send(result);
    }).catch(error => {
        console.error(`[error]: Fetch payment error ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
PaymentController.fetch = (req, res) => {
};
PaymentController.createProof = (req, res) => {
    const user_id = req.body.userId;
    const user_subscription_id = req.body.user_subscription_id;
    const user_transaction_id = req.body.user_transaction_id;
    const base64string = req.body.file;
    const name = req.body.name;
    const uid = (0, uuid_1.v4)();
    const bucket = firebase_helper_1.default.storage().bucket("gs://abangku-apps.appspot.com");
    bucket.file(uid);
};
exports.default = PaymentController;
