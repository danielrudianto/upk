import { Router } from "express";
import socialMediaController from "../controller/social_media.controller";
import { body } from "express-validator";

const router = Router();

router.get("/:postId", socialMediaController.fetchByUID);

router.get("/comment/:post_uid", socialMediaController.fetchComments);

router.get("/", socialMediaController.fetch);

router.post("/", socialMediaController.createPost);

router.delete("/:post_uid", socialMediaController.deletePost);

router.post(
  "/reaction",
  body("post_uid").not().isEmpty().withMessage("Mohon isikan post UID."),
  socialMediaController.react
);

export default router;
