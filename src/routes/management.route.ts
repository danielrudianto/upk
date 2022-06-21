import { Router } from "express";
import { body } from "express-validator";
import ManagementController from "../controller/user.management.model";

const router = Router();

router.post(
  "/approve",
  body("request_id").not().isEmpty().withMessage("ID Pengajuan mohon diisi.")
);

router.post(
    "/", 
    ManagementController.submission
);

export default router;
