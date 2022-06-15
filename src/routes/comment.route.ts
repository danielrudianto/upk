import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/", (req, res, next) => {
    const post_id = req.body.post_id;
    const comment =req.body.comment;

    prisma.post.findUnique({
        where: {
            uid: post_id
        }
    }).then(post => {
        if(post == null || post.is_delete){
            return res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
        } else {
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
            })
        }
    }).catch(error => {
        res.status(500).send(error);
    })
})

router.delete("/:commentId", async(req, res, next) => {
    const commentId = parseInt(req.params.commentId);
    const comment = await prisma.post_comment.findUnique({
        where:{
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

    if(comment == null || comment.is_delete || comment.post?.is_delete){
        return res.status(404).send("Komentar tidak ditemukan.");
    }

    prisma.post_comment.update({
        where:{
            id: commentId
        },
        data: {
            is_delete: true
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
})

export default router;