import { Router } from "express";
import SocialMediaController from "../controller/social_media.controller";

const router = Router();

router.post("/follow", SocialMediaController.follow);
router.delete("/follow/:user_uid", SocialMediaController.unfollow)

export default router;