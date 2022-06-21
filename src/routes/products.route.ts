import { Router } from 'express';
import { product, productGroup, products } from '../data/products'
import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import ProductController from '../controller/product.controller';
import { param } from 'express-validator';

const router = Router();

router.get(
    "/getByCodeName/:codeName",
    param("codeName").not().isEmpty(), 
    ProductController.getByCodeName
);

router.get("/:groupName/:childGroupName", (req, res, next) => {
    try {
        const groupIndex = products.findIndex(x => x.group == req.params.groupName);
        if(groupIndex >= 0){
            // Group exist
            const group = products[groupIndex].children;
            const children = group;
            const childIndex = (children as productGroup[]).findIndex(x => x.group == req.params.childGroupName);
            if(childIndex >= 0){
                return res.status(200).send((products[groupIndex].children[childIndex] as productGroup).children);
            }
        }

        return res.status(404).send("Produk tidak ditemukan.");
    }
    catch(error) {
        return res.status(500).send(error);
    }
})

router.get("/:groupName", (req, res, next) => {
    /*
        Get products children based on a group
    */
    try {
        const groupIndex = products.findIndex(x => x.group == req.params.groupName);
        if(groupIndex >= 0){
            // Group exist
            const result: any[] = [];
            products[groupIndex].children.map(x => {
                if(x.hasOwnProperty("group")){
                    result.push({
                        group: (x as productGroup).group,
                        logo: (x as productGroup).logo,
                    })
                } else {
                    result.push({
                        code_product: (x as product).code_product,
                        description: (x as product).description
                    })
                }
            });

            return res.status(200).send(result);
        } else {
            return res.status(404).send("Produk tidak ditemukan.");
        }
    }
    catch(error) {
        return res.status(500).send(error);
    }
});
const prisma = new PrismaClient();

router.get("/", (req, res, next) => {
    /*
        Get product groups from our list
    */
    try {
        const result: any[] = [];
        products.map((x, index) => {
        result.push({
            group: x.group,
            image: (x.logo == null) ? null : x.logo
        });        
        })

        return res.status(200).send(result);
    }
    catch(error) {
        return res.status(500).send(error);
    }
});

export default router;