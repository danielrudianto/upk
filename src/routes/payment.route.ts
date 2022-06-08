import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

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
})

export default router;
