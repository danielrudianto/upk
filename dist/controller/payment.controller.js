"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const firebase_helper_1 = __importDefault(require("../helper/firebase.helper"));
const media_helper_1 = __importDefault(require("../helper/media.helper"));
const payment_model_1 = __importDefault(require("../models/payment.model"));
const payment_proof_model_1 = __importDefault(require("../models/payment_proof.model"));
class PaymentController {
}
PaymentController.getMethods = (req, res) => {
    payment_model_1.default.fetch()
        .then((result) => {
        return res.status(200).send(result.map(payment => {
            return {
                id: payment.id,
                name: payment.name,
                logo: `${process.env.PUBLIC_URL}${payment.logo}`,
            };
        }));
    })
        .catch((error) => {
        console.error(`[error]: Fetch payment error ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
PaymentController.fetchUnconfirmed = (req, res) => {
    const page = !req.query.page
        ? 1
        : Math.max(parseInt(req.query.page.toString()), 1);
    const limit = parseInt(process.env.LIMIT);
    const offset = (page - 1) * limit;
    const mode = req.query.mode;
    switch (mode) {
        case "Membership":
            payment_model_1.default.fetchUnconfirmedMembershipPayment(offset, limit).then((result) => {
                return res.status(200).send(result);
            }).catch(error => {
                return res.status(500).send(error);
            });
            break;
        default:
            return res.status(404).send("Transaksi tidak ditemukan.");
    }
};
PaymentController.createProof = (req, res) => {
    const user_id = req.body.userId;
    const user_subscription_id = req.body.user_subscription_id;
    const user_transaction_id = req.body.user_transaction_id;
    const base64string = req.body.file;
    const name = req.body.name;
    const names = name.split(".");
    const extension = names[names.length - 1];
    const uid = (0, uuid_1.v4)();
    const fileName = `${uid}.${extension}`;
    const file = media_helper_1.default.toFile(base64string);
    const bucket = firebase_helper_1.default
        .storage()
        .bucket(process.env.STORAGE_REFERENCE);
    bucket
        .file(uid)
        .save(file)
        .then((media) => {
        const payment_proof = new payment_proof_model_1.default(user_subscription_id, user_transaction_id, fileName, user_id);
        payment_proof
            .create()
            .then((result) => {
            return res.status(201).send(result);
        })
            .catch((error) => {
            console.error(`[error]: Error creating payment proof ${new Date()}`);
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
exports.default = PaymentController;
