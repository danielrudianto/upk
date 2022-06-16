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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const firebase_helper_1 = __importDefault(require("../helper/firebase.helper"));
const upload_helper_ts_1 = __importDefault(require("../helper/upload.helper.ts"));
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_helper_1 = require("../helper/auth.helper");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", auth_helper_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post.toString();
    const last_post = (last_fetched == null) ? null : yield prisma.post.findUnique({
        where: {
            uid: last_fetched
        },
        select: {
            id: true
        }
    });
    if (last_post == null) {
        // Start from the beginning
        prisma.post.findMany({
            select: {
                uid: true,
                caption: true,
                user: {
                    select: {
                        name: true
                    }
                },
                post_media: {
                    select: {
                        url: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            },
            where: {
                is_delete: false
            },
            skip: 0,
            take: 10
        }).then(result => {
            result.forEach((x, index) => {
                result[index].post_media.forEach((media, i) => {
                    result[index].post_media[i].url = `${process.env.STORAGE_URL}${media.url}`;
                });
            });
            res.status(200).send(result);
        }).catch(error => {
            res.status(500).send(error);
        });
    }
    else {
        prisma.post.findMany({
            where: {
                id: {
                    gt: last_post.id
                },
                is_delete: false
            },
            select: {
                uid: true,
                caption: true,
                user: {
                    select: {
                        name: true
                    }
                },
                post_media: {
                    select: {
                        url: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            },
            skip: 0,
            take: 10
        }).then(result => {
            res.status(200).send(result);
        }).catch(error => {
            res.status(500).send(error);
        });
    }
}));
router.post("/", upload_helper_ts_1.default.array("file"), (req, res, next) => {
    var _a;
    // Upload the file in that particular path to firestore
    // Delete file in that particular path
    const files = req.files;
    const object = JSON.parse(JSON.stringify(req.body));
    const caption = object.caption;
    let tokenHeader = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.toString();
    if (!tokenHeader || tokenHeader.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({
            auth: false,
            message: "Format token tidak sesuai. Mohon coba login ulang.",
        });
    }
    let token = tokenHeader.split(' ')[1];
    (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send(err);
        }
        else {
            const id = parseInt(decoded.id);
            prisma.post.create({
                data: {
                    caption: caption,
                    created_by: id,
                    uid: (0, uuid_1.v4)(),
                }
            }).then(result => {
                const bucket = firebase_helper_1.default.storage().bucket("gs://abangku-apps.appspot.com");
                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const path = file.path;
                        const name = file.originalname;
                        const _name = name.replace(/\.[^/.]+$/, "");
                        const extension = name.split('.').pop();
                        const uid = (0, uuid_1.v4)();
                        bucket.upload(path, {
                            destination: `${uid}.${extension}`,
                            resumable: true,
                            public: true
                        }).then(() => {
                            prisma.post_media.create({
                                data: {
                                    name: _name,
                                    url: `${uid}.${extension}`,
                                    post_id: result.id
                                }
                            }).then(() => {
                                fs_1.default.unlinkSync(path);
                            }).catch(() => {
                                return res.status(500).send("Error pada saat mengunggah media.");
                            });
                        });
                    }
                    return res.status(201).send("Upload post berhasil.");
                }
                else {
                    prisma.post.create({
                        data: {
                            caption: caption,
                            created_by: id,
                            uid: (0, uuid_1.v4)(),
                        }
                    }).then(post => {
                        return res.status(201).send(post);
                    }).catch(error => {
                        console.log(error);
                        return res.status(500).send(error);
                    });
                }
            }).catch(error => {
                console.log(error);
                return res.status(500).send(error);
            });
        }
    });
});
router.delete("/:postId", auth_helper_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(req.params.postId);
    const post = yield prisma.post.findUnique({
        where: {
            id: postId
        }
    });
    if (post == null || post.is_delete) {
        return res.status(404).send("Post tidak ditemukan.");
    }
    else {
        prisma.post.update({
            where: {
                id: postId
            },
            data: {
                is_delete: true,
            }
        }).then(() => {
            return res.status(200).send("Post berhasil dihapus.");
        }).catch(error => {
            return res.status(500).send(error);
        });
    }
}));
router.post("/reaction", auth_helper_1.authMiddleware, (req, res, next) => {
    const reaction = req.body.reaction;
    const post_uid = req.body.post_id;
    // Assuming there will be other type of reaction such as love, laugh, etc.
    // 0 is reserved for deleting reaction
    if (post_uid != null) {
        prisma.post.findUnique({
            where: {
                uid: post_uid
            }
        }).then(post => {
            if (post != null && !post.is_delete) {
                prisma.reaction.count({
                    where: {
                        created_by: req.body.userId,
                        post_id: post.id
                    }
                }).then(count => {
                    // User already react to this post
                    // Delete the reaction
                    if (count > 0) {
                        prisma.reaction.deleteMany({
                            where: {
                                post_id: post.id,
                                created_by: req.body.userId
                            }
                        }).then(result => {
                            return res.status(201).send("Reaksi berhasil dihapus.");
                        }).catch(error => {
                            return res.status(500).send(error);
                        });
                    }
                    else {
                        prisma.reaction.create({
                            data: {
                                post_id: post.id,
                                reaction: 1,
                                created_by: req.body.userId,
                                comment_id: null
                            },
                            select: {
                                id: true,
                                created_at: true,
                                user: {
                                    select: {
                                        name: true,
                                        uid: true,
                                        profile_image_url: true
                                    }
                                }
                            }
                        }).then(() => {
                            res.status(201).send("Reaksi berhasil ditambahkan.");
                        }).catch(error => {
                            res.status(500).send(error);
                        });
                    }
                }).catch(error => {
                    res.status(500).send(error);
                });
            }
            else {
                return res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
            }
        }).catch(error => {
            res.status(500).send(error);
        });
    }
});
exports.default = router;
