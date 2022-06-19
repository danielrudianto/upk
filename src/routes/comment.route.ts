import { Router } from "express";
import { body } from "express-validator";
import socialMediaController from "../controller/social_media.controller";
import { authMiddleware } from "../helper/auth.helper";

const router = Router();

router.post("/", 
    authMiddleware, 
    body("comment").not().isEmpty().withMessage("Mohon isikan kolom komentar."),
    body("post_uid").not().isEmpty().withMessage("Mohon isikan ID post."),
    socialMediaController.createComment);

export default router;