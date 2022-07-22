"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const router = (0, express_1.Router)();
router.put("/", (0, express_validator_1.body)("uid").not().isEmpty().withMessage("Mohon isikan UID pengguna."), (0, express_validator_1.body)("name").not().isEmpty().withMessage("Mohon isikan nama pengguna."), (0, express_validator_1.body)("phone_number").not().isEmpty().withMessage("Mohon isikan nomor telepon pengguna."), user_controller_1.default.update);
router.get("/", user_controller_1.default.fetch);
exports.default = router;
