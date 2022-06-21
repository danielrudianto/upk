"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_helper_1 = require("../helper/auth.helper");
const upload_helper_ts_1 = __importDefault(require("../helper/upload.helper.ts"));
const social_media_controller_1 = __importDefault(require("../controller/social_media.controller"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", auth_helper_1.authMiddleware, social_media_controller_1.default.fetch);
router.post("/", upload_helper_ts_1.default.array("file"), social_media_controller_1.default.createPost);
router.delete("/:postId", social_media_controller_1.default.deletePost);
router.post("/reaction", social_media_controller_1.default.react);
exports.default = router;
