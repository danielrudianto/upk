"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = PaymentController;
