"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = __importDefault(require("../firebase"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post;
    const page = req.query.page;
});
router.post("/", (req, res, next) => {
    // Upload file to server directory
    // Get the uploaded path
    // Upload the file in that particular path to firestore
    // Delete file in that particular path
    const bucket = firebase_1.default.storage().bucket();
    // TODO:
    // Upload file to firebase storage
});
router.delete("/:postId", (req, res, next) => {
});
exports.default = router;
