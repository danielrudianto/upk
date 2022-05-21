import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get("/history", (req, res, next) => {
    /*
        Get history of transaction based on user authorization
        Get the following data to proceed transaction history
        1. User ID by sending user authorization
        2. Date range
        3. Success status
        4. Page
    */

    const page = (!req.query.page) ? 1 : Math.max(parseInt(req.query.page.toString()), 1);
    const limit = parseInt(process.env.LIMIT!);
    const offset = (page - 1) * limit;
    if(!req.query.start || !req.query.end){
        // If date range is not specified, send all history data //
        prisma.$transaction([
            prisma.user_transaction.findMany({
                where:{
                    created_by: req.body.userId
                },
                orderBy: {
                    created_at: "desc"
                },
                take: limit,
                skip: offset,
                select: {
                    value: true,
                    service: true,
                    discount: true,
                    purchase_type: {
                        select: {
                            name: true,
                            description: true
                        }
                    },
                    payment_method: {
                        select: {
                            name: true,
                        }
                    },
                    is_paid: true,
                    is_delete: true,
                    paid_at: true,
                    branch_transaction: true,
                    payment_reference: true,
                    purchase_reference: true,
                    user: {
                        select: {
                            name: true,
                            nik: true
                        }
                    }
                }
            }),
            prisma.user_transaction.count({
                where:{
                    created_by: req.body.userId
                }
            })
        ]).then(result => {
            res.status(200).send({
                data: result[0],
                count: result[1]
            })
        }).catch(error => {
            res.status(500).send(error);
        })
    } else {
        // If date range is specified, send all history data in the date range //
        const start = new Date(req.query.start?.toString());
        const end = new Date(req.query.end?.toString());
        start.setHours(0, 0, 0);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0);

        prisma.$transaction([
            prisma.user_transaction.findMany({
                where:{
                    created_by: req.body.userId,
                    AND: [
                        {
                            created_at: {
                                gte: start
                            }
                        },
                        {
                            created_at: {
                                lt: end
                            }
                        }
                    ]
                },
                orderBy: {
                    created_at: "desc"
                },
                take: limit,
                skip: offset,
                select: {
                    value: true,
                    service: true,
                    discount: true,
                    purchase_type: {
                        select: {
                            name: true,
                            description: true
                        }
                    },
                    payment_method: {
                        select: {
                            name: true,
                        }
                    },
                    is_paid: true,
                    is_delete: true,
                    paid_at: true,
                    branch_transaction: true,
                    payment_reference: true,
                    purchase_reference: true,
                    user: {
                        select: {
                            name: true,
                            nik: true
                        }
                    }
                }
            }),
            prisma.user_transaction.count({
                where:{
                    created_by: req.body.userId
                }
            })
        ]).then(result => {
            res.status(200).send({
                data: result[0],
                count: result[1]
            })
        }).catch(error => {
            res.status(500).send(error);
        })
    }
})

router.post("/", (req, res, next) => {
    
})