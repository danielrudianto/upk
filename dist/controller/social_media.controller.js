"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../models/post.model"));
const firebase_helper_1 = __importDefault(require("../helper/firebase.helper"));
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const post_media_model_1 = __importDefault(require("../models/post_media.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const post_reaction_model_1 = __importDefault(require("../models/post_reaction.model"));
const express_validator_1 = require("express-validator");
class socialMediaController {
}
socialMediaController.createPost = (req, res) => {
    var _a, _b;
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
    var decoded = (_b = (0, jsonwebtoken_1.decode)(token, { complete: true })) === null || _b === void 0 ? void 0 : _b.payload;
    const user_id = decoded.id;
    const post = new post_model_1.default(caption, user_id);
    post.create().then(result => {
        // If there is file exist on request
        if (files) {
            const bucket = firebase_helper_1.default.storage().bucket("gs://abangku-apps.appspot.com");
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const uid = (0, uuid_1.v4)();
                const file_name = file.filename;
                const file_name_split = file_name.split('.');
                const file_name_extension = file_name_split[file_name_split.length - 1];
                const path = file.path;
                bucket.upload(path, {
                    destination: `${uid}.${file_name_extension}`
                }).then(() => {
                    const post_media = new post_media_model_1.default(file_name, `${uid}.${file_name_extension}`, result.id);
                    post_media.create().then(() => {
                        // fs.unlinkSync(path);
                    }).catch(error => {
                        console.error(`[error]: Error on deleting local file ${new Date()}`);
                        console.error(`[error]: ${error}`);
                    });
                }).catch(error => {
                    console.error(`[error]: Error on uploading file to firebase ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(`Media ${file_name} gagal terunggah.`);
                });
            }
            return res.status(201).send("Upload post berhasil.");
        }
    });
};
socialMediaController.deletePost = (req, res) => {
    const post_uid = req.params.postId;
    post_model_1.default.getPostByUID(post_uid).then(post => {
        if (post == null || post.is_delete) {
            return res.status(404).send("Post tidak ditemukan.");
        }
        else {
            post_model_1.default.delete(post.id).then(() => {
                return res.status(200).send("Post berhasil dihapus.");
            }).catch(error => {
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
    const post_uid = req.body.post_id;
    const comment = req.body.comment;
    post_model_1.default.getPostByUID(post_uid).then(result => {
        if (result == null) {
            return res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
        }
        else {
            const commentModel = new comment_model_1.default(comment, result.id, req.body.userId);
            commentModel.createComment().then(result => {
                return res.status(201).send(result);
            }).catch(error => {
                console.error(`[error]: Creating comment ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
    }).catch(error => {
        console.error(`[error]:Fetching post ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
socialMediaController.react = (req, res) => {
    const post_uid = req.body.post_id;
    post_model_1.default.getPostByUID(post_uid).then(post => {
        if (post == null || post.is_delete) {
            return res.status(404).send("Post tidak ditemukan.");
        }
        else {
            post_reaction_model_1.default.checkReaction(post.id, req.body.userId).then(reaction => {
                if (reaction == 0) {
                    // User has not react to this post
                    const post_reaction = new post_reaction_model_1.default(post.id, req.body.userId);
                    post_reaction.create().then(() => {
                        return res.status(201).send("Reaksi berhasil dibuat.");
                    }).catch(error => {
                        console.error(`[error]: Failed createing reaction ${new Date()}`);
                        console.error(`[error]: ${error}`);
                        return res.status(500).send(error);
                    });
                }
                else {
                    // User has react to this post
                    const post_reaction = new post_reaction_model_1.default(post.id, req.body.userId);
                    post_reaction.delete().then(() => {
                        return res.status(201).send("Reaksi berhasil dihapus.");
                    }).catch(error => {
                        console.error(`[error]: Failed deleting reaction ${new Date()}`);
                        console.error(`[error]: ${error}`);
                        return res.status(500).send(error);
                    });
                }
            });
        }
    });
};
socialMediaController.fetch = (req, res) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post.toString();
    let post = null;
    if (last_fetched != null) {
        post_model_1.default.getPostByUID(last_fetched).then(last_post => {
            post = last_post;
        });
    }
    post_model_1.default.get((post == null) ? null : post.id).then(posts => {
        posts.forEach((post, index) => {
            posts[index].post_media.forEach((media, i) => {
                posts[index].post_media[i].url = `${process.env.STORAGE_URL}${media.url}`;
            });
            const post_reaction = {
                count: post.reaction.length,
                has_reacted: post.reaction.filter(x => x.created_by == req.body.userId).length == 0 ? false : true
            };
            posts[index].reaction = post_reaction;
        });
        return res.status(200).send(posts);
    }).catch(error => {
        console.error(`[error]: Fetching posts ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
exports.default = socialMediaController;
