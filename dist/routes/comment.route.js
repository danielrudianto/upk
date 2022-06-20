"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const social_media_controller_1 = __importDefault(require("../controller/social_media.controller"));
const auth_helper_1 = require("../helper/auth.helper");
const router = (0, express_1.Router)();
router.post("/", auth_helper_1.authMiddleware, (0, express_validator_1.body)('post_id').not().isEmpty().withMessage("Mohon pilih post yang akan dikomentari."), (0, express_validator_1.body)('comment').not().isEmpty().withMessage("Kolom komentar tidak boleh kosong."), social_media_controller_1.default.createComment);
exports.default = router;
