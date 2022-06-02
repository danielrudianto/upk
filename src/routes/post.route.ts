import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { v4 } from 'uuid';
import fs from 'fs';
import firebase from '../helper/firebase';
import upload from '../helper/upload';

const router = Router();
const prisma = new PrismaClient();

router.get("/", (req, res, next) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post;
    const page = req.query.page;
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
            // created_by: req.body.userId
            created_by: 1,
            uid: v4(),
        }
    }).then(result => {
        const bucket = firebase.storage().bucket("gs://abangku-apps.appspot.com");
        if(files){
            const transactions: any[] = [];
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
                    }, (err, file) => {
                        transactions.push(
                            prisma.post_media.create({
                                data: {
                                    name: _name,
                                    url: `https://firebasestorage.googleapis.com/v0/b/gs://abangku-apps.appspot.com/o/${uid}.${extension}`,
                                    post_id: result.id
                                }
                            }
                        ))
                        fs.unlinkSync(path);
                    });
                }
            )
        }
        
    })
    
    
    // TODO:
    // Upload file to firebase storage

    
})

router.delete("/:postId", (req, res, next) => {
    
})

export default router;