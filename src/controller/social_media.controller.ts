import { NextFunction, Request, Response } from "express";
import PostModel from "../models/post.model";
import firebase from '../helper/firebase.helper';
import { decode } from "jsonwebtoken";
import { v4 } from "uuid";
import PostMediaModel from "../models/post_media.model";
import CommentModel from "../models/comment.model";

class socialMediaController {
    static createPost = (req: Request, res: Response, next: NextFunction) => {
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
                            console.error(`[error]: Hapus file terunggah ${new Date()}`);
                            console.error(`[error]: ${error}`);
                        })
                    }).catch(error => {
                        console.error(`[error]: Mengunggah file ${new Date()}`);
                        console.error(`[error]: ${error}`);
                        return res.status(500).send(`Media ${file_name} gagal terunggah.`);
                    });
                }

                return res.status(201).send("Upload post berhasil.");
            }
            
        })
    }

    static deletePost = (req: Request, res: Response, next: NextFunction) => {
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

    static createComment = (req: Request, res: Response, next: NextFunction) => {
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

    static react = (req: Request, res: Response, next: NextFunction) => {
        const post_uid = req.body.post_id;
        PostModel.getPostByUID(post_uid).then(post => {
            if(post == null || post.is_delete){
                return res.status(404).send("Post tidak ditemukan.");
            } else {
                
            }
        })
    }
}

export default socialMediaController;