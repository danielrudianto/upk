"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_management_controller_1 = __importDefault(require("../controller/user.management.controller"));
const router = (0, express_1.Router)();
router.get("/", user_management_controller_1.default.fetch);
router.post("/approve", (0, express_validator_1.body)("request_id").not().isEmpty().withMessage("ID Pengajuan mohon diisi."), user_management_controller_1.default.approve);
router.post("/", user_management_controller_1.default.submission);
router.get("/request/:requestId", user_management_controller_1.default.fetchById);
exports.default = router;
