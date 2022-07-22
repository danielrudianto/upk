"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const transaction_controller_1 = __importDefault(require("../controller/transaction.controller"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", transaction_controller_1.default.fetch);
router.post("/", transaction_controller_1.default.create);
router.delete("/:transactionId", (req, res, next) => {
    const id = parseInt(req.params.transactionId);
});
exports.default = router;
