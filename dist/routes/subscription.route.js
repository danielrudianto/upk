"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const subscription_controller_1 = __importDefault(require("../controller/subscription.controller"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/* Route untuk menentukan biaya berlangganan dalam satuan Rupiah / bulan */
router.get("/price", subscription_controller_1.default.getPrice);
router.post("/", subscription_controller_1.default.create);
// Checking user subscription status
router.get("/", (req, res, next) => {
    const start_date = new Date(req.body.date);
});
exports.default = router;
