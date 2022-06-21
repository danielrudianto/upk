"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const user_model_ts_1 = __importDefault(require("../models/user.model.ts"));
class SubscriptionController {
}
SubscriptionController.getPrice = (req, res) => {
    subscription_model_1.default.checkPrice().then(result => {
        subscription_model_1.default.checkSubscription(req.body.userId).then(user_subscription => {
            if (user_subscription == null) {
                // User has never paid the first subscription
                return res.status(200).send({
                    price: result === null || result === void 0 ? void 0 : result.price,
                    membership: result === null || result === void 0 ? void 0 : result.membership,
                    service: result === null || result === void 0 ? void 0 : result.service
                });
            }
            else {
                // User has paid the first subscription
                return res.status(200).send({
                    price: 0,
                    membership: result === null || result === void 0 ? void 0 : result.membership,
                    service: result === null || result === void 0 ? void 0 : result.service
                });
            }
        }).catch(error => {
            console.error(`[error]: Getting user subscription ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
        return res.status(200).send(result);
    }).catch(error => {
        console.error(`[error]: Fetching subscription price ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
SubscriptionController.create = (req, res) => {
    const userId = req.body.userId;
    const payment_method = parseInt(req.body.payment_method);
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    let monthAfterDate = new Date();
    monthAfterDate.setDate(monthAfterDate.getDate() + 1);
    subscription_model_1.default.checkPrice().then(subscription_price => {
        subscription_model_1.default.checkSubscription(userId).then(user_subscription => {
            if (user_subscription == null) {
                // User has never paid the first subscription
                const subscriptionDate = monthAfterDate;
                subscriptionDate.setDate(subscriptionDate.getDate() + 1);
                const subscriptionExpireDate = subscriptionDate;
                subscriptionExpireDate.setDate(date.getDate() + 30);
                subscriptionExpireDate.setHours(23, 59, 59, 99);
                const _price = (subscription_price == null || subscription_price.price == null) ? 0 : parseFloat(subscription_price.price.toString());
                const _membership = (subscription_price == null || subscription_price.membership == null) ? 0 : parseFloat(subscription_price.membership.toString());
                const _service = (subscription_price == null || subscription_price.service == null) ? 0 : parseFloat(subscription_price.service.toString());
                const subscription = new subscription_model_1.default(_price, _membership, _service, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                subscription.create().then(result => {
                    switch (payment_method) {
                        case 1:
                            // Payment using BRI Virtual account
                            // Create BRI Virtual account for user
                            user_model_ts_1.default.getUserById(userId).then(user => {
                                const userUID = userId.toString().padStart(10, "0");
                                const value = _price + _membership + _service;
                                // TODO:
                                // Create virtual account from BRI banking service
                            }).catch(error => {
                                console.error(`[error]: Fetching user ${new Date()}`);
                                console.error(`[error]: ${error}`);
                                return res.status(500).send(error);
                            });
                        case 2:
                            // Payment using Mandiri Virtual account
                            user_model_ts_1.default.getUserById(userId).then(user => {
                                const userUID = userId.toString().padStart(10, "0");
                                const value = _price + _membership + _service;
                                // TODO:
                                // Create virtual account from BRI banking service
                            }).catch(error => {
                                console.error(`[error]: Fetching user ${new Date()}`);
                                console.error(`[error]: ${error}`);
                                return res.status(500).send(error);
                            });
                            break;
                    }
                });
            }
            else {
                // User has paid the first subscription
                const subscriptionDate = user_subscription.valid_until;
                subscriptionDate.setDate(subscriptionDate.getDate() + 1);
                const subscriptionExpireDate = subscriptionDate;
                subscriptionExpireDate.setDate(date.getDate() + 30);
                subscriptionExpireDate.setHours(23, 59, 59, 99);
                const _membership = (subscription_price == null || subscription_price.membership == null) ? 0 : parseFloat(subscription_price.membership.toString());
                const _service = (subscription_price == null || subscription_price.service == null) ? 0 : parseFloat(subscription_price.service.toString());
                const subscription = new subscription_model_1.default(0, _membership, _service, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                subscription.create().then(result => {
                    switch (payment_method) {
                        case 1:
                            // Payment using BRI Virtual account
                            // Create BRI Virtual account for user
                            user_model_ts_1.default.getUserById(userId).then(user => {
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
                            user_model_ts_1.default.getUserById(userId).then(user => {
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
                });
            }
        }).catch(error => {
            console.error(`[error]: Getting user subscription ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }).catch(error => {
        console.error(`[error]: Fetching subscription price ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
exports.default = SubscriptionController;
