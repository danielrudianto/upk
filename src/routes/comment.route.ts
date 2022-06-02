import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async(req, res, next) => {
    const post_id = req.body.post_id;
    const comment =req.body.comment;

    const post = await prisma.post.findUnique({
        where: {
            id: post_id
        }
    });

    if(post == null || post.is_delete){
        res.status(404).send("Post tidak ditemukan atau sudah dihapus.");
    } else {
        prisma.post_comment.create({
            data: {
                comment: comment,
                post_id: post_id,
                created_by: req.body.userId
            }
        }).then(result => {
            res.status(200).send(result);
        }).catch(error => {
            res.status(500).send(error);
        })
    }
})

export default router;