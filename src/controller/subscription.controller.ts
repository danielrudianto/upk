import { Request, Response } from "express";
import BRI_service from "../helper/bank.service";
import SubscriptionModel from "../models/subscription.model";
import UserModel from "../models/user.model.ts";

class SubscriptionController {
    static getPrice = (req: Request, res: Response) => {
        SubscriptionModel.checkPrice().then(result => {
            return res.status(200).send(result);
        }).catch(error => {
            console.error(`[error]: Peroleh harga keanggotaan ${new Date()}`)
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
        })
    }

    static create = (req: Request, res: Response) => {
        const userId = req.body.userId;
        const payment_method = parseInt(req.body.payment_method);

        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);

        let monthAfterDate = new Date();
        monthAfterDate.setDate(monthAfterDate.getDate() + 1);

        SubscriptionModel.checkPrice().then(subscription_price => {
            SubscriptionModel.checkSubscription(userId).then(user_subscription => {
                const subscriptionDate = (user_subscription == null || user_subscription.valid_until == null) ? monthAfterDate : user_subscription.valid_until;
                subscriptionDate.setDate(subscriptionDate.getDate() + 1);

                const subscriptionExpireDate = subscriptionDate;
                subscriptionExpireDate.setDate(date.getDate() + 30);
                subscriptionExpireDate.setHours(23, 59, 59, 99);

                const subscription = new SubscriptionModel(subscription_price?.price?, subscription_price?.membership?, subscription_price?.service?, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                subscription.create().then(result => {
                    switch(payment_method){
                        case 1:
                            // Payment using BRI Virtual account
                            // Create BRI Virtual account for user
                            UserModel.getUserById(userId).then(user => {
                                const userUid = userId.toString().padStart(10, "0");
                                
                                BRI_service.createVirtualAccount(userUid, user.name, subscriptionPrice, `Biaya keanggotaan tetap hingga ${subscriptionExpireDate?.getDay()}`, expiration).then(() => {
                                    return res.status(201).send("Virtual account berhasil dibuat.");
                                }).catch(error => {
                                    return res.status(500).send(error);
                                });
                            })
                            const user = await prisma.user.findUnique({
                                where: {
                                    id: userId
                                }
                            });
                
                            if(user != null){
                                const userId = user.id;
                                const userUid = userId.toString().padStart(10, "0");
                
                                
                            }
                
                            return res.status(401).send("User tidak ditemukan.");
                        case 2:
                            // Payment using Mandiri Virtual account
                            break;
                    }
                })
            })
        })
    }
}

export default SubscriptionController;