"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/method", (req, res, next) => {
    prisma.payment_method
        .findMany({
        where: {
            is_delete: false,
        },
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            logo: true,
        }
    })
        .then((result) => {
        res.status(200).send(result);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
router.get("/", (req, res, next) => {
    /*
        Get history of payment of a user
    */
});
exports.default = router;
