import { Router } from "express";
import socialMediaController from "../controller/social_media.controller";
import { authMiddleware } from "../helper/auth.helper";

const router = Router();

router.post("/", authMiddleware, socialMediaController.createComment);

export default router;