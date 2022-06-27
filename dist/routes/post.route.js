"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const social_media_controller_1 = __importDefault(require("../controller/social_media.controller"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/:postId", social_media_controller_1.default.fetchByUID);
router.get("/comment/:postId", social_media_controller_1.default.fetchComments);
router.get("/", social_media_controller_1.default.fetch);
router.post("/", social_media_controller_1.default.createPost);
router.delete("/:postId", social_media_controller_1.default.deletePost);
router.post("/reaction", (0, express_validator_1.body)("post_uid").not().isEmpty().withMessage("Mohon isikan post UID."), social_media_controller_1.default.react);
exports.default = router;
