import { NextFunction, Request, Response } from "express";
import PostModel from "../models/post.model";
import firebase from '../helper/firebase.helper';
import { decode } from "jsonwebtoken";
import { v4 } from "uuid";
import PostMediaModel from "../models/post_media.model";
import CommentModel from "../models/comment.model";
import PostReactionModel from "../models/post_reaction.model";
import { validationResult } from "express-validator";

class socialMediaController {
    static createPost = (req: Request, res: Response) => {
        const files = req.files;
        const object = JSON.parse(JSON.stringify(req.body));
        const caption = object.caption;
        
        let tokenHeader = req.headers['authorization']?.toString();
        if (!tokenHeader || tokenHeader.split(' ')[0] !== 'Bearer') {
            return res.status(401).json({
                auth: false,
                message: "Format token tidak sesuai. Mohon coba login ulang.",
            });
        }

        let token = tokenHeader.split(' ')[1];
        var decoded = decode(token, {complete: true})?.payload;

        const user_id = (decoded as any).id;
        const post = new PostModel(caption, user_id);
        post.create().then(result => {
            // If there is file exist on request
            if(files){
                const bucket = firebase.storage().bucket("gs://abangku-apps.appspot.com");
                for(let i = 0; i < files.length; i++){
                    const file: Express.Multer.File = (files as Express.Multer.File[])[i];
                    const uid = v4();

                    const file_name = file.filename;
                    const file_name_split = file_name.split('.');
                    const file_name_extension = file_name_split[file_name_split.length - 1];
                    const path = file.path as string;

                    bucket.upload(path, {
                        destination: `${uid}.${file_name_extension}`
                    }).then(() => {
                        const post_media = new PostMediaModel(file_name, `${uid}.${file_name_extension}`, result.id);
                        post_media.create().then(() => {
                            // fs.unlinkSync(path);
                        }).catch(error => {
                            console.error(`[error]: Error on deleting local file ${new Date()}`);
                            console.error(`[error]: ${error}`);
                        })
                    }).catch(error => {
                        console.error(`[error]: Error on uploading file to firebase ${new Date()}`);
                        console.error(`[error]: ${error}`);

                        return res.status(500).send(`Media ${file_name} gagal terunggah.`);
                    });
                }

                return res.status(201).send("Upload post berhasil.");
            }
            
        })
    }

    static deletePost = (req: Request, res: Response) => {
        const post_uid = req.params.postId;
        PostModel.getPostByUID(post_uid).then(post => {
            if(post == null || post.is_delete){
                return res.status(404).send("Post tidak ditemukan.");
            } else {
                PostModel.delete(post.id).then(() => {
                    return res.status(200).send("Post berhasil dihapus.");
                }).catch(error => {
                    console.error(`[error]: Delete post ${new Date()}`);
                    console.error(`[error]: ${error}`);

                    return res.status(500).send(error);
                })
            }
        })
    }

    static createComment = (req: Request, res: Response) => {
        const val_result = validationResult(req);
        if(!val_result.isEmpty()){
            return res.status(500).send(val_result.array()[0].msg);
        }

        //    Get the following data to proceed comment
        //    1. Post UID
        //    2. Comment

        const post_uid = req.body.post_id;
        const comment = req.body.comment;

        PostModel.getPostByUID(post_uid).then(result => {
            if(result == null){
                return res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
            } else {
                const commentModel = new CommentModel(comment, result.id, req.body.userId);
                commentModel.createComment().then(result => {
                    return res.status(201).send(result);
                }).catch(error => {
                    console.error(`[error]: Creating comment ${new Date()}`);
                    console.error(`[error]: ${error}`);

                    return res.status(500).send(error);
                })
            }
        }).catch(error => {
            console.error(`[error]:Fetching post ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
        })
    }

    static react = (req: Request, res: Response) => {
        const post_uid = req.body.post_id;
        PostModel.getPostByUID(post_uid).then(post => {
            if(post == null || post.is_delete){
                return res.status(404).send("Post tidak ditemukan.");
            } else {
                PostReactionModel.checkReaction(post.id, req.body.userId).then(reaction => {
                    if(reaction == 0){
                        // User has not react to this post
                        const post_reaction = new PostReactionModel(post.id, req.body.userId);
                        post_reaction.create().then(() => {
                            return res.status(201).send("Reaksi berhasil dibuat.");
                        }).catch(error => {
                            console.error(`[error]: Failed createing reaction ${new Date()}`);
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                        })
                    } else {
                        // User has react to this post
                        const post_reaction = new PostReactionModel(post.id, req.body.userId);
                        post_reaction.delete().then(() => {
                            return res.status(201).send("Reaksi berhasil dihapus.");
                        }).catch(error => {
                            console.error(`[error]: Failed deleting reaction ${new Date()}`);
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                        })
                    }
                })
            }
        })
    }

    static fetch = (req: Request, res: Response) => {
        const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post.toString();
        let post: any | null = null;
        if(last_fetched != null){
            PostModel.getPostByUID(last_fetched).then(last_post => {
                post = last_post;
            })
        }

        PostModel.get((post == null) ? null : post.id).then(posts => {
            posts.forEach((post, index) => {
                posts[index].post_media.forEach((media, i) => {
                    posts[index].post_media[i].url = `${process.env.STORAGE_URL}${media.url}`
                });

                const post_reaction: any = {
                    count: post.reaction.length,
                    has_reacted: post.reaction.filter(x => x.created_by == req.body.userId).length == 0 ? false : true
                }

                posts[index].reaction = post_reaction;
            })

            return res.status(200).send(posts);
        }).catch(error => {
            console.error(`[error]: Fetching posts ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
        })
    }
}

export default socialMediaController;