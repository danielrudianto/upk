import { Request, Response } from "express";
import BRI_service from "../helper/bank.service";
import SubscriptionModel from "../models/subscription.model";
import UserModel from "../models/user.model.ts";

class SubscriptionController {
    static getPrice = (req: Request, res: Response) => {
        SubscriptionModel.checkPrice().then(result => {
            SubscriptionModel.checkSubscription(req.body.userId).then(user_subscription => {
                if(user_subscription == null){
                    // User has never paid the first subscription
                    return res.status(200).send({
                        price: parseFloat(result!.price!.toString()),
                        membership: parseFloat(result!.membership.toString()),
                        service: parseFloat(result!.service.toString()),
                        effective_date: result?.effective_date
                    })
                } else {
                    // User has paid the first subscription
                    return res.status(200).send({
                        price: 0,
                        membership: result?.membership,
                        service: result?.service,
                        effective_date: result?.effective_date
                    })
                }
            }).catch(error => {
                console.error(`[error]: Getting user subscription ${new Date()}`);
                console.error(`[error]: ${error}`);

                return res.status(500).send(error);
            })
        }).catch(error => {
            console.error(`[error]: Fetching subscription price ${new Date()}`)
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
                if(user_subscription == null){
                    // User has never paid the first subscription
                    const subscriptionDate = monthAfterDate;
                    subscriptionDate.setDate(subscriptionDate.getDate() + 1);

                    const subscriptionExpireDate = subscriptionDate;
                    subscriptionExpireDate.setDate(date.getDate() + 30);
                    subscriptionExpireDate.setHours(23, 59, 59, 99);

                    const _price = (subscription_price == null || subscription_price.price == null) ? 0 : parseFloat(subscription_price.price.toString());
                    const _membership = (subscription_price == null || subscription_price.membership == null) ? 0 : parseFloat(subscription_price.membership.toString());
                    const _service = (subscription_price == null || subscription_price.service == null) ? 0 : parseFloat(subscription_price.service.toString());

                    const subscription = new SubscriptionModel(_price, _membership, _service, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                    subscription.create().then(result => {
                        switch(payment_method){
                            case 1:
                                // Payment using BRI Virtual account
                                // Create BRI Virtual account for user
                                UserModel.getUserById(userId).then(user => {
                                    const userUID = userId.toString().padStart(10, "0");
                                    const value = _price + _membership + _service;
                                    // TODO:
                                    // Create virtual account from BRI banking service
                                }).catch(error => {
                                    console.error(`[error]: Fetching user ${new Date()}`);
                                    console.error(`[error]: ${error}`);

                                    return res.status(500).send(error);
                                })
                            case 2:
                                // Payment using Mandiri Virtual account
                                UserModel.getUserById(userId).then(user => {
                                    const userUID = userId.toString().padStart(10, "0");
                                    const value = _price + _membership + _service;
                                    // TODO:
                                    // Create virtual account from BRI banking service
                                }).catch(error => {
                                    console.error(`[error]: Fetching user ${new Date()}`);
                                    console.error(`[error]: ${error}`);

                                    return res.status(500).send(error);
                                })
                                break;
                        }
                    })
                } else {
                    // User has paid the first subscription
                    const subscriptionDate = user_subscription.valid_until!;
                    subscriptionDate.setDate(subscriptionDate.getDate() + 1);

                    const subscriptionExpireDate = subscriptionDate;
                    subscriptionExpireDate.setDate(date.getDate() + 30);
                    subscriptionExpireDate.setHours(23, 59, 59, 99);

                    const _membership = (subscription_price == null || subscription_price.membership == null) ? 0 : parseFloat(subscription_price.membership.toString());
                    const _service = (subscription_price == null || subscription_price.service == null) ? 0 : parseFloat(subscription_price.service.toString());

                    const subscription = new SubscriptionModel(0, _membership, _service, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                    subscription.create().then(result => {
                        switch(payment_method){
                            case 1:
                                // Payment using BRI Virtual account
                                // Create BRI Virtual account for user
                                UserModel.getUserById(userId).then(user => {
                                    const userUID = userId.toString().padStart(10, "0");
                                    const value = _membership + _service;
                                    // TODO:
                                    // Create virtual account from BRI banking service
                                }).catch(error => {
                                    console.error(`[error]: Fetching user ${new Date()}`);
                                    console.error(`[error]: ${error}`);

                                    return res.status(500).send(error);
                                });

                                break;
                            case 2:
                                // Payment using Mandiri Virtual account
                                UserModel.getUserById(userId).then(user => {
                                    const userUID = userId.toString().padStart(10, "0");
                                    const value = _membership + _service;
                                    // TODO:
                                    // Create virtual account from BRI banking service
                                }).catch(error => {
                                    console.error(`[error]: Fetching user ${new Date()}`);
                                    console.error(`[error]: ${error}`);

                                    return res.status(500).send(error);
                                });

                                break;
                        }
                    })
                }
            }).catch(error => {
                console.error(`[error]: Getting user subscription ${new Date()}`);
                console.error(`[error]: ${error}`);

                return res.status(500).send(error);
            })
        }).catch(error => {
            console.error(`[error]: Fetching subscription price ${new Date()}`)
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
        })
    }
}

export default SubscriptionController;