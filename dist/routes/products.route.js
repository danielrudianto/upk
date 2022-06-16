"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../products");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get("/getByCodeName/:codeName", (req, res, next) => {
    const codeName = req.params.codeName;
    axios_1.default.post(process.env.RAJABILLER_URL, {
        "method": "rajabiller.info_produk",
        "uid": process.env.RAJABILLER_UID,
        "pin": process.env.RAJABILLER_PIN,
        "kode_produk": codeName
    }).then(result => {
        const status = result.data.STATUS;
        // Code name tersedia
        if (status === "00") {
            return res.status(200).send({
                code_product: codeName,
                price: parseFloat(result.data.HARGA),
                admin: parseFloat(result.data.ADMIN),
                comission: parseFloat(result.data.KOMISI),
            });
        }
        // Ada error
        return res.status(500).send({
            status: status,
            description: result.data.KET
        });
    }).catch(error => {
        return res.status(500).send(error);
    });
});
router.get("/:groupName/:childGroupName", (req, res, next) => {
    try {
        const result = [];
        const groupIndex = products_1.products.findIndex(x => x.group == req.params.groupName);
        if (groupIndex >= 0) {
            // Group exist
            const group = products_1.products[groupIndex].children;
            const children = group;
            const childIndex = children.findIndex(x => x.group == req.params.childGroupName);
            if (childIndex >= 0) {
                return res.status(200).send(products_1.products[groupIndex].children[childIndex].children);
            }
        }
        return res.status(404).send("Produk tidak ditemukan.");
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
router.get("/:groupName", (req, res, next) => {
    /*
        Get products children based on a group
    */
    try {
        const groupIndex = products_1.products.findIndex(x => x.group == req.params.groupName);
        if (groupIndex >= 0) {
            // Group exist
            const result = [];
            products_1.products[groupIndex].children.map(x => {
                if (x.hasOwnProperty("group")) {
                    result.push({
                        group: x.group,
                        logo: x.logo,
                    });
                }
                else {
                    result.push({
                        code_product: x.code_product,
                        description: x.description
                    });
                }
            });
            return res.status(200).send(result);
        }
        else {
            return res.status(404).send("Produk tidak ditemukan.");
        }
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
const prisma = new client_1.PrismaClient();
router.get("/", (req, res, next) => {
    /*
        Get product groups from our list
    */
    try {
        const result = [];
        products_1.products.map((x, index) => {
            result.push({
                group: x.group,
                image: (x.logo == null) ? null : x.logo
            });
        });
        return res.status(200).send(result);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
exports.default = router;
