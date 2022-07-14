import { Router } from "express";
import { body } from "express-validator";
import ManagementController from "../controller/user.management.controller";

const router = Router();

router.get("/", ManagementController.fetch)

router.post(
  "/approve",
  body("request_id").not().isEmpty().withMessage("ID Pengajuan mohon diisi."),
  ManagementController.approve
);

router.post(
    "/", 
    ManagementController.submission
);

router.get("/request/:requestId", ManagementController.fetchById)

export default router;
