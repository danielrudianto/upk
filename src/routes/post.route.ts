import { PrismaClient } from '@prisma/client';
import e, { Router } from 'express';
import { v4 } from 'uuid';
import fs from 'fs';

import { authMiddleware } from '../helper/auth.helper';
import upload from '../helper/upload.helper.ts';
import socialMediaController from '../controller/social_media.controller';

const router = Router();
const prisma = new PrismaClient();

router.get("/", authMiddleware, async(req, res, next) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post.toString();
    
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
                    result[index].post_media[i].url = `${process.env.STORAGE_URL}${media.url}`
                })
            })
            res.status(200).send(result);
        }).catch(error => {
            res.status(500).send(error);
        })
    } else {
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
        })
    }
})

router.post("/", upload.array("file"), socialMediaController.createPost)
router.delete("/:postId", authMiddleware, socialMediaController.deletePost);

router.post("/reaction", authMiddleware, (req, res, next) => {
    const post_uid = req.body.post_id;
    if(post_uid != null){
        prisma.post.findUnique({
            where:{
                uid: post_uid
            }
        }).then(post => {
            if(post != null && !post.is_delete){
                prisma.reaction.count({
                    where:{
                        created_by: req.body.userId,
                        post_id: post.id
                    }
                }).then(count => {
                    // User already react to this post
                    // Delete the reaction
                    if(count > 0){
                        prisma.reaction.deleteMany({
                            where:{
                                post_id: post.id,
                                created_by: req.body.userId
                            }
                        }).then(result => {
                            return res.status(201).send("Reaksi berhasil dihapus.");
                        }).catch(error => {
                            return res.status(500).send(error);
                        })
                    } else {
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
                        })
                    }
                }).catch(error => {
                    res.status(500).send(error);
                })
                
            } else {
                return res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
            }
        }).catch(error => {
            res.status(500).send(error);
        })
        
    }
})

export default router;