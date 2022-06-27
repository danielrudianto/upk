"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post.model"));
const firebase_helper_1 = __importDefault(require("../helper/firebase.helper"));
const uuid_1 = require("uuid");
const post_media_model_1 = __importDefault(require("../models/post_media.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const post_reaction_model_1 = __importDefault(require("../models/post_reaction.model"));
const express_validator_1 = require("express-validator");
const media_helper_1 = __importDefault(require("../helper/media.helper"));
const transaction_helper_1 = __importDefault(require("../helper/transaction.helper"));
class socialMediaController {
}
socialMediaController.createPost = (req, res) => {
    const post = new post_model_1.default(req.body.caption, req.body.userId, req.body.districtId);
    post
        .create()
        .then((result) => {
        const files = [];
        req.body.media.forEach((file) => {
            const base64string = file.file;
            const name = file.name;
            const names = name.split(".");
            const extension = names[names.length - 1];
            const uid = (0, uuid_1.v4)();
            const fileName = `${uid}.${extension}`;
            try {
                files.push({
                    file: media_helper_1.default.toFile(base64string),
                    fileName: fileName,
                    name: name,
                });
            }
            catch (error) {
                return res.status(500).send(error);
            }
        });
        if (files.length > 0) {
            const bucket = firebase_helper_1.default
                .storage()
                .bucket("gs://abangku-apps.appspot.com");
            files.forEach((x, index) => {
                bucket
                    .file(x.fileName)
                    .save(x.file)
                    .then(() => {
                    const post_media = new post_media_model_1.default(files[index].name, files[index].fileName, result.id);
                    post_media.create().then(() => {
                        if (index == files.length - 1) {
                            post_model_1.default.fetchPostByUID(result.uid)
                                .then((post) => {
                                return res.status(201).send(post);
                            })
                                .catch((error) => {
                                return res.status(500).send(error);
                            });
                        }
                    });
                })
                    .catch((error) => {
                    return res.status(500).send(error);
                });
            });
        }
    })
        .catch((error) => {
        return res.status(500).send(error);
    });
};
socialMediaController.deletePost = (req, res) => {
    const post_uid = req.params.postId;
    post_model_1.default.fetchPostByUID(post_uid).then((post) => {
        if (post == null || post.is_delete) {
            return res.status(404).send("Post tidak ditemukan.");
        }
        else {
            post_model_1.default.delete(post.id)
                .then(() => {
                return res.status(200).send("Post berhasil dihapus.");
            })
                .catch((error) => {
                console.error(`[error]: Delete post ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
    });
};
socialMediaController.createComment = (req, res) => {
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    //    Get the following data to proceed comment
    //    1. Post UID
    //    2. Comment
    const post_uid = req.body.post_uid;
    const comment = req.body.comment;
    post_model_1.default.fetchPostByUID(post_uid)
        .then((result) => {
        if (result == null) {
            return res
                .status(404)
                .send("Post tidak ditemukan atau sudah dihapus.");
        }
        else {
            const commentModel = new comment_model_1.default(comment, result.id, req.body.userId);
            commentModel
                .createComment()
                .then((result) => {
                return res.status(201).send(result);
            })
                .catch((error) => {
                console.error(`[error]: Creating comment ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
    })
        .catch((error) => {
        console.error(`[error]:Fetching post ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
socialMediaController.react = (req, res) => {
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    const post_uid = req.body.post_uid;
    post_model_1.default.fetchPostByUID(post_uid).then((post) => {
        if (post == null || post.is_delete) {
            return res.status(404).send("Post tidak ditemukan.");
        }
        else {
            post_reaction_model_1.default.checkReaction(post.id, req.body.userId).then((reaction) => {
                if (reaction == 0) {
                    // User has not react to this post
                    const post_reaction = new post_reaction_model_1.default(post.id, req.body.userId);
                    post_reaction
                        .create()
                        .then(() => {
                        return res.status(201).send("Reaksi berhasil dibuat.");
                    })
                        .catch((error) => {
                        console.error(`[error]: Failed createing reaction ${new Date()}`);
                        console.error(`[error]: ${error}`);
                        return res.status(500).send(error);
                    });
                }
                else {
                    // User has react to this post
                    const post_reaction = new post_reaction_model_1.default(post.id, req.body.userId);
                    post_reaction
                        .delete()
                        .then(() => {
                        return res.status(201).send("Reaksi berhasil dihapus.");
                    })
                        .catch((error) => {
                        console.error(`[error]: Failed deleting reaction ${new Date()}`);
                        console.error(`[error]: ${error}`);
                        return res.status(500).send(error);
                    });
                }
            });
        }
    });
};
socialMediaController.fetchByUID = (req, res) => {
    const uid = req.params.postId;
    const fetch_posts = post_model_1.default.fetchPostByUID(uid);
    const fetch_comments = comment_model_1.default.fetchByPostUID(uid);
    transaction_helper_1.default.create([
        fetch_posts,
        fetch_comments
    ]).then(result => {
        if (result[0] == null || result[0].is_delete) {
            return res.status(404).send("Post tidak ditemukan.");
        }
        return res.status(200).send(Object.assign(Object.assign({}, result[0]), { post_comment: result[1] }));
    }).catch(error => {
        console.error(`[error]: Fetching post by UID ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
socialMediaController.fetch = (req, res) => {
    const last_fetched = !req.query.last_fetched_post
        ? null
        : req.query.last_fetched_post.toString();
    let post = null;
    if (last_fetched != null) {
        post_model_1.default.fetchPostByUID(last_fetched).then((last_post) => {
            post = last_post;
        });
    }
    post_model_1.default.fetch(post == null ? null : post.id)
        .then((posts) => {
        posts.forEach((post, index) => {
            posts[index].post_media.forEach((media, i) => {
                posts[index].post_media[i].url = `${process.env.STORAGE_URL}${media.url}`;
            });
            const post_reaction = {
                count: post.reaction.length,
                has_reacted: post.reaction.filter((x) => x.created_by == req.body.userId)
                    .length == 0
                    ? false
                    : true,
            };
            posts[index].reaction = post_reaction;
        });
        return res.status(200).send(posts);
    })
        .catch((error) => {
        console.error(`[error]: Fetching posts ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
socialMediaController.fetchComments = (req, res) => {
    const post_uid = req.params.postId;
    const page = (!req.query.page) ? 1 : Math.max(parseInt(req.query.page.toString()), 1);
    const limit = 10;
    const offset = (page - 1) * 10;
    comment_model_1.default.fetchByPostUID(post_uid, offset, limit).then(result => {
        return res.status(200).send(result);
    }).catch(error => {
        return res.status(500).send(error);
    });
};
exports.default = socialMediaController;
