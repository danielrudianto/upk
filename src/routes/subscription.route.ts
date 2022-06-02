import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/* Route untuk menentukan biaya berlangganan dalam satuan Rupiah / bulan */
router.get("/price", (req, res, next) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    prisma.subscription_price.findFirst({
        where: {
            effective_date: {
                lte: date
            }
        },
        orderBy: {
            effective_date: "desc"
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
})

router.get("/", (req, res, next) => {
    const start_date = new Date(req.body.date);
})

router.post("/", async(req, res, next) => {
    const userId = req.body.userId;
    const payment_method = parseInt(req.body.payment_method);
    switch(payment_method){
        case 1:
            // Payment using BRI Virtual account
            // Create BRI Virtual account for user
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if(user != null){
                
            }
            break;
        case 2:
            // Payment using Mandiri Virtual account
            break;
    }

})

export default router;