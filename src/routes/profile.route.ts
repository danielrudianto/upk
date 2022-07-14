import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controller/user.controller";

const router = Router();

router.put(
  "/",
  body("uid").not().isEmpty().withMessage("Mohon isikan UID pengguna."),
  body("name").not().isEmpty().withMessage("Mohon isikan nama pengguna."),
  body("phone_number").not().isEmpty().withMessage("Mohon isikan nomor telepon pengguna."),
  UserController.update
);

router.get("/", UserController.fetch)

export default router;
