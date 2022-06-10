import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { BRI_service } from '../helper/bank.service';

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

// Checking user subscription status
router.get("/", (req, res, next) => {
    const start_date = new Date(req.body.date);
})

router.post("/", async(req, res, next) => {
    const userId = req.body.userId;
    const payment_method = parseInt(req.body.payment_method);

    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    let monthAfterDate = new Date();

    const subscription = await prisma.subscription_price.findFirst({
        where: {
            effective_date: {
                lte: date
            }
        },
        orderBy: {
            effective_date: "desc"
        },
        take: 1,
        skip: 0
    });

    const subscriptionPrice = (subscription == null || subscription.price == null) ? 0 : parseInt(subscription.price.toString());

    const expiration = new Date();
    expiration.setHours(expiration.getHours(), expiration.getMinutes() + 30, expiration.getSeconds(), 0);

    // Check last subscription of a user
    const lastSubscription = await prisma.user_subscription.findFirst({
        where: {
            is_paid: true
        },
        select: {
            valid_until: true
        },
        orderBy: {
            valid_from: "desc"
        },
        take: 1,
        skip: 0
    });
    
    const subscriptionExpireDate = (lastSubscription == null || lastSubscription.valid_until == null) ? monthAfterDate : new Date(lastSubscription.valid_until);
    subscriptionExpireDate.setDate(date.getDate() + 30);
    subscriptionExpireDate.setHours(23, 59, 59, 99);

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
                const userId = user.id;
                const userUid = userId.toString().padStart(10, "0");

                BRI_service.createVirtualAccount(userUid, user.name, subscriptionPrice, `Biaya keanggotaan tetap hingga ${subscriptionExpireDate?.getDay()}`, expiration).then(() => {
                    return res.status(201).send("Virtual account berhasil dibuat.");
                }).catch(error => {
                    return res.status(500).send(error);
                });
            }

            return res.status(401).send("User tidak ditemukan.");
        case 2:
            // Payment using Mandiri Virtual account
            break;
    }

})

export default router;