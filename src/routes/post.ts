import { Router } from 'express';
import firebase from '../firebase';

const router = Router();

router.get("/", (req, res, next) => {
    const last_fetched = (!req.query.last_fetched_post) ? null : req.query.last_fetched_post;
    const page = req.query.page;
})

router.post("/", (req, res, next) => {
    // Upload file to server directory
    // Get the uploaded path
    
    
    // Upload the file in that particular path to firestore
    // Delete file in that particular path
    const bucket = firebase.storage().bucket();
    
    // TODO:
    // Upload file to firebase storage

    
})

router.delete("/:postId", (req, res, next) => {
    
})

export default router;