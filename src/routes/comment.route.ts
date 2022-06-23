import { Router } from "express";
import { body } from "express-validator";
import socialMediaController from "../controller/social_media.controller";
import { authMiddleware } from "../helper/auth.helper";

const router = Router();

router.post(
    "/", 
    authMiddleware, 
    body('post_uid').not().isEmpty().withMessage("Mohon pilih post yang akan dikomentari."),
    body('comment').not().isEmpty().withMessage("Kolom komentar tidak boleh kosong."),
    socialMediaController.createComment);

export default router;