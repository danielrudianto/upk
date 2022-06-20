import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post("/approve", 
    body("request_id").not().isEmpty().withMessage("ID Pengajuan mohon diisi.")
);

router.post("/");

export default router;