import { Router } from 'express';
import { product, productGroup, products } from '../products'
import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import ProductController from '../controller/product.controller';

const router = Router();

router.get(
    "/getByCodeName/:codeName", 
    ProductController.getByCodeName
);

router.get(
    "/:groupName", 
    ProductController.fetch
);

router.get(
    "/:groupName/:childGroupName", 
    ProductController.fetch
);

router.get(
    "/",
    ProductController.fetch
)

export default router;