import { PrismaClient } from '@prisma/client';
import e, { Router } from 'express';
import { v4 } from 'uuid';
import fs from 'fs';
import firebase from '../helper/firebase.helper';
import upload from '../helper/upload.helper.ts';

const router = Router();
const prisma = new PrismaClient();

router.get("/", async(req, res, next) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post.toString();
    let page = (!req.query.page) ? 1 : Math.max(1, parseInt(req.query.page.toString()));
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const last_post = (last_fetched == null) ? null : await prisma.post.findUnique({
        where:{
            uid: last_fetched
        },
        select: {
            id: true
        }
    });

    if(last_post == null){
        // Start from the beginning
        page = 1;
    } else {
        prisma.post.findMany({
            where: {
                id: {
                    lt: last_post.id
                }
            },
            select: {
                post_media: {
                    select: {
                        url: true,

                    }
                }
            }
        })
    }
})

router.post("/", upload.array("file"), (req, res, next) => {
    // Upload the file in that particular path to firestore
    // Delete file in that particular path
    const files = req.files;
    const object = JSON.parse(JSON.stringify(req.body));
    const caption = object.caption;

    prisma.post.create({
        data: {
            caption: caption,
            created_by: req.body.userId,
            uid: v4(),
        }
    }).then(result => {
        const bucket = firebase.storage().bucket("gs://abangku-apps.appspot.com");
        if(files){
            (files as any[]).forEach(
                file => {
                    const path = file.path as string;
                    const name = file.originalname as string;
                    const _name = name.replace(/\.[^/.]+$/, "");
                    const extension = name.split('.').pop();

                    const uid = v4();
                    bucket.upload(path, {
                        destination: `${uid}.${extension}`,
                        resumable: true,
                        public: true
                    }, async(err, file) => {
                        await prisma.post_media.create({
                            data: {
                                name: _name,
                                url: `${uid}.${extension}`,
                                post_id: result.id
                            }
                        })
                        
                        fs.unlinkSync(path);
                    });
                }
            )
        }

        prisma.post.findUnique({
            where:{
                id: result.id
            },
            select: {
                id: true,
                caption: true,
                post_media: {
                    select: {
                        name: true,
                        url: true
                    }
                },
                uid: true
            }
        }).then(post => {
            return res.status(201).send(post);
        }).catch(error => {
            res.status(500).send(error);
        })
        
    }).catch(error => {
        return res.status(500).send(error);
    })    
})

router.delete("/:postId", async(req, res, next) => {
    const postId = parseInt(req.params.postId);
    const post = await prisma.post.findUnique({
        where:{
            id: postId
        }
    });

    if(post == null || post.is_delete){
        return res.status(404).send("Post tidak ditemukan.");
    } else {
        prisma.post.update({
            where:{
                id: postId
            },
            data: {
                is_delete: true,
            }
        }).then(() => {
            return res.status(200).send("Post berhasil dihapus.");
        }).catch(error => {
            return res.status(500).send(error);
        })
    }
})

export default router;