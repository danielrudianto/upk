import { Router } from "express";
import { authMiddleware } from "../helper/auth.helper";
import authController from '../controller/auth.controller';

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/token", authMiddleware, authController.register_token);

export default router;