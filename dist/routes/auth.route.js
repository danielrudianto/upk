"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const express_validator_1 = require("express-validator");
const auth_helper_1 = __importDefault(require("../helper/auth.helper"));
const router = (0, express_1.Router)();
router.post("/register", (0, express_validator_1.body)("name").not().isEmpty().withMessage("Mohon isikan nama."), (0, express_validator_1.body)("nik")
    .isLength({ min: 16, max: 16 })
    .withMessage("Mohon isikan nomor induk kependudukan."), (0, express_validator_1.body)("phone_number")
    .not()
    .isEmpty()
    .withMessage("Mohon isikan nomor telepon."), (0, express_validator_1.body)("password").not().isEmpty().withMessage("Mohon isikan kata sandi."), (0, express_validator_1.body)("gender").not().isEmpty().withMessage("Mohon isikan jenis kelamin."), (0, express_validator_1.body)("gender")
    .isString()
    .matches(/^[M|F]{1}$/)
    .withMessage("Mohon isikan jenis kelamin."), (0, express_validator_1.body)("date_of_birth")
    .not()
    .isEmpty()
    .withMessage("Mohon isikan tanggal lahir."), (0, express_validator_1.body)("kelurahan_id").not().isEmpty().withMessage("Mohon isikan area."), auth_controller_1.default.register);
router.post("/login", (0, express_validator_1.body)("phone_number").not().isEmpty(), (0, express_validator_1.body)("password").not().isEmpty(), auth_controller_1.default.login);
router.post("/token", auth_helper_1.default.authMiddleware, auth_controller_1.default.register_token);
exports.default = router;
