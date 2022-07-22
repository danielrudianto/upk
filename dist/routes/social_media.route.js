"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const social_media_controller_1 = __importDefault(require("../controller/social_media.controller"));
const router = (0, express_1.Router)();
router.post("/follow", social_media_controller_1.default.follow);
router.delete("/follow/:user_uid", social_media_controller_1.default.unfollow);
exports.default = router;
