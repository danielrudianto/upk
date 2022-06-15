"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const bank_service_1 = __importDefault(require("../helper/bank.service"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res, next) => {
    /* Route to get historical transactions */
});
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*
          Route to create a new transaction
          There area several available transaction
          1. PLN
          2. Phone
          3. BPJS
      */
    const productCodeName = req.body.code_name;
    const branchTransaction = req.body.branch_transaction == 1 ? true : false;
    const paymentMethod = parseInt(req.body.payment_method);
    const purchaseReference = req.body.purchase_reference;
    // When purchasing PLN, the purchase_reference is refered as PLN Customer number 
    // When purchasing BPJS, the purchase_reference is refered as BPJS Customer number 
    // When purchasing Phone bill, the purchase_reference is refered as Customer's phone number
    /* Check availble payment */
    const payment = yield prisma.payment_method.findUnique({
        where: {
            id: paymentMethod,
        },
    });
    if (payment == null || payment.is_delete) {
        return res.status(500).send("Metode pembayaran tidak dikenal.");
    }
    /* First, get value, service, and discount of a product based on RajaBiller */
    try {
        axios_1.default
            .post(process.env.RAJABILLER_URL, {
            method: "rajabiller.info_produk",
            uid: process.env.RAJABILLER_UID,
            pin: process.env.RAJABILLER_PIN,
            kode_produk: productCodeName,
        })
            .then((result) => {
            const status = result.data.STATUS;
            if (status !== "00") {
                return res.status(500).send("Produk tidak ditemukan.");
            }
            prisma.user_transaction
                .create({
                data: {
                    created_by: req.body.userId,
                    value: parseFloat(result.data.HARGA) + parseFloat(result.data.ADMIN),
                    service: parseInt(process.env.ADMINISTRATION_FEE),
                    discount: parseFloat(result.data.KOMISI),
                    product_code_name: productCodeName,
                    branch_transaction: branchTransaction,
                    payment_method_id: paymentMethod,
                    purchase_reference: purchaseReference,
                },
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    value: true,
                    service: true,
                    discount: true,
                    purchase_reference: true,
                    id: true
                }
            })
                .then((result) => {
                // TODO Create Virtual account based on payment method
                const value = parseFloat(result.value.toString());
                const discount = parseFloat(result.discount.toString());
                const service = parseFloat(result.service.toString());
                const expired = new Date();
                expired.setHours(expired.getHours(), expired.getMinutes() + 30, expired.getSeconds(), expired.getMilliseconds());
                switch (payment.id) {
                    case 1:
                        // Create BRI Virtual Account
                        bank_service_1.default.createVirtualAccount(result.user.id.toString().padStart(10, "0"), result.user.name, (value + service - discount), `Transaksi AbangKu #${result.id}`, expired).then(result => {
                            console.log(result.data);
                        }).catch(error => {
                            res.status(500).send("Gagal membuat billing, mohon coba kembali dalam beberapa saat.");
                        });
                        break;
                }
            })
                .catch((error) => {
                return res
                    .status(500)
                    .send("Gagal membuat transaksi. Mohon coba kembali.");
            });
        })
            .catch((error) => {
            return res.status(500).send(error);
        });
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.delete("/:transactionId", (req, res, next) => {
    const id = parseInt(req.params.transactionId);
});
exports.default = router;
