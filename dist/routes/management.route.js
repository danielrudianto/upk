"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_management_model_1 = __importDefault(require("../controller/user.management.model"));
const router = (0, express_1.Router)();
router.post("/approve", (0, express_validator_1.body)("request_id").not().isEmpty().withMessage("ID Pengajuan mohon diisi."));
router.post("/", user_management_model_1.default.submission);
exports.default = router;
