import { PrismaClient } from '@prisma/client';
import e, { Router } from 'express';
import { v4 } from 'uuid';
import fs from 'fs';

import { authMiddleware } from '../helper/auth.helper';
import upload from '../helper/upload.helper.ts';
import socialMediaController from '../controller/social_media.controller';
import { query } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

router.get(
    "/", 
    authMiddleware,
    socialMediaController.fetch
);

router.post(
    "/", 
    upload.array("file"), 
    socialMediaController.createPost
);

router.delete(
    "/:postId", 
    socialMediaController.deletePost
);

router.post(
    "/reaction", 
    socialMediaController.react
);

export default router;