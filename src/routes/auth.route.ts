import { Router } from "express";
import { authMiddleware } from "../helper/auth.helper";
import authController from '../controller/auth.controller';
import { body, check } from "express-validator";

const router = Router();

router.post(
    "/register",
    body('name').not().isEmpty().withMessage("Mohon isikan nama."),
    body('nik').isLength({ min: 16, max: 16 }).withMessage("Mohon isikan nomor induk kependudukan."),
    body('phone_number').not().isEmpty().withMessage("Mohon isikan nomor telepon."),
    body('password').not().isEmpty().withMessage("Mohon isikan kata sandi."),
    body('gender').not().isEmpty().withMessage("Mohon isikan jenis kelamin."),
    body('gender').isString().matches(/^[M|F]{1}$/).withMessage("Mohon isikan jenis kelamin."),
    body('date_of_birth').not().isEmpty().withMessage("Mohon isikan tanggal lahir."),
    body('kelurahan_id').not().isEmpty().withMessage("Mohon isikan area."),
    authController.register
);

router.post(
    "/login",
    body('phone_number').not().isEmpty(),
    body('password').not().isEmpty(),
    authController.login)
router.post("/token", authMiddleware, authController.register_token);

export default router;