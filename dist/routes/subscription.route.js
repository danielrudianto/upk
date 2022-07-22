"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = __importDefault(require("../controller/subscription.controller"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
/* Route untuk menentukan biaya berlangganan dalam satuan Rupiah / bulan */
router.get("/price", subscription_controller_1.default.getPrice);
router.get("/", subscription_controller_1.default.fetch);
router.post("/", (0, express_validator_1.body)("districtId").isEmpty().withMessage("Kepengurusan tidak membutuhkan biaya keanggotaan."), (0, express_validator_1.body)("payment_method").not().isEmpty().withMessage("Mohon isikan metode pembayaran."), subscription_controller_1.default.create);
exports.default = router;
