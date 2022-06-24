import { Router } from "express";
import ProductController from "../controller/product.controller";
import { param } from "express-validator";

const router = Router();

router.get(
  "/getByCodeName/:codeName",
  param("codeName").not().isEmpty(),
  ProductController.getByCodeName
);

router.get("/:groupName", ProductController.fetch);

router.get("/:groupName/:childGroupName", ProductController.fetch);

router.get("/", ProductController.fetch);

export default router;
