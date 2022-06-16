"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billerService = void 0;
const axios_1 = __importDefault(require("axios"));
class billerService {
    static createPhoneBill(phone_number, product_code, transaction_id) {
        const request = {
            method: "rajabiller.pulsa",
            uid: process.env.RAJABILLER_UID,
            pin: process.env.RAJABILLER_PIN,
            no_hp: phone_number,
            kode_produk: product_code,
            ref1: transaction_id
        };
        return axios_1.default.post(process.env.RAJABILLER_URL, request, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    static checkElectricityBill(customer_number, product_code, transaction_id) {
        const request = {
            method: "rajabiller.pulsa",
            uid: process.env.RAJABILLER_UID,
            pin: process.env.RAJABILLER_PIN,
            idpel1: customer_number,
            idpel2: "",
            idpel3: "",
            kode_produk: product_code,
            ref1: transaction_id
        };
        return axios_1.default.post(process.env.RAJABILLER_URL, request, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    static createElectricityBill(customer_number, product_code, transaction_id) {
    }
}
exports.billerService = billerService;
