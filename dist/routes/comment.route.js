"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post("/", (req, res, next) => {
    const post_id = req.body.post_id;
    const comment = req.body.comment;
    prisma.post.findUnique({
        where: {
            uid: post_id
        }
    }).then(post => {
        if (post == null || post.is_delete) {
            return res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
        }
        else {
            prisma.post_comment.create({
                data: {
                    comment: comment,
                    post_id: post_id,
                    created_by: req.body.userId
                },
                select: {
                    id: true,
                    comment: true,
                    user: {
                        select: {
                            profile_image_url: true,
                            uid: true,
                            name: true
                        }
                    },
                    created_at: true
                }
            }).then(result => {
                return res.status(201).send(result);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
    }).catch(error => {
        res.status(500).send(error);
    });
});
router.delete("/:commentId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const commentId = parseInt(req.params.commentId);
    const comment = yield prisma.post_comment.findUnique({
        where: {
            id: commentId
        },
        select: {
            is_delete: true,
            post: {
                select: {
                    is_delete: true
                }
            }
        }
    });
    if (comment == null || comment.is_delete || ((_a = comment.post) === null || _a === void 0 ? void 0 : _a.is_delete)) {
        return res.status(404).send("Komentar tidak ditemukan.");
    }
    prisma.post_comment.update({
        where: {
            id: commentId
        },
        data: {
            is_delete: true
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    });
}));
exports.default = router;
