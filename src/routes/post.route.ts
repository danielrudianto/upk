import { Router } from 'express';
import firebase from '../helper/firebase';
import upload from '../helper/upload';

const router = Router();

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
    const bucket = firebase.storage().bucket("gs://abangku-apps.appspot.com");

    if(files){
        (files as any[]).map(
            file => {
                const path = file.path;
                bucket.upload(path);
            }
        )
    }
    
    return res.status(201).send("sudah dibuat.");
    
    
    // TODO:
    // Upload file to firebase storage

    
})

router.delete("/:postId", (req, res, next) => {
    
})

export default router;