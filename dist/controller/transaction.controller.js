"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_helper_1 = __importDefault(require("../helper/transaction.helper"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
class TransactionController {
}
TransactionController.fetch = (req, res) => {
    var _a;
    const districtId = req.body.districtId;
    const userId = req.body.userId;
    const limit = parseInt(process.env.limit);
    const page = (!req.query.page) ? 1 : Math.max(1, parseInt(req.query.page.toString()));
    const offset = (page - 1) * limit;
    const mode = (!req.query.mode) ? 1 : parseInt((_a = req.query.mode) === null || _a === void 0 ? void 0 : _a.toString());
    transaction_helper_1.default.create([
        transaction_model_1.default.fetch(mode, userId, districtId, offset, limit),
        transaction_model_1.default.count(mode, userId, districtId)
    ]).then(result => {
        return res.status(200).send({
            data: result[0],
            count: result[1]
        });
    }).catch(error => {
        return res.status(500).send(error);
    });
};
exports.default = TransactionController;
