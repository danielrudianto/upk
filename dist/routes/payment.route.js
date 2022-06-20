"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controller/payment.controller"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/method", payment_controller_1.default.getMethods);
router.get("/", (req, res, next) => {
    /*
        Get history of payment of a user
    */
});
exports.default = router;
