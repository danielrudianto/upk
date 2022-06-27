"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
class SubscriptionController {
}
SubscriptionController.getPrice = (req, res) => {
    subscription_model_1.default.checkPrice()
        .then((result) => {
        subscription_model_1.default.checkSubscription(req.body.userId)
            .then((user_subscription) => {
            if (user_subscription == null) {
                // User has never paid the first subscription
                return res.status(200).send({
                    price: parseFloat(result.price.toString()),
                    membership: parseFloat(result.membership.toString()),
                    service: parseFloat(result.service.toString()),
                    effective_date: result === null || result === void 0 ? void 0 : result.effective_date,
                });
            }
            else {
                // User has paid the first subscription
                return res.status(200).send({
                    price: 0,
                    membership: result === null || result === void 0 ? void 0 : result.membership,
                    service: result === null || result === void 0 ? void 0 : result.service,
                    effective_date: result === null || result === void 0 ? void 0 : result.effective_date,
                });
            }
        })
            .catch((error) => {
            console.error(`[error]: Getting user subscription ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    })
        .catch((error) => {
        console.error(`[error]: Fetching subscription price ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
SubscriptionController.create = (req, res) => {
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    const userId = req.body.userId;
    const payment_method = parseInt(req.body.payment_method);
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    let monthAfterDate = new Date();
    monthAfterDate.setDate(monthAfterDate.getDate() + 1);
    subscription_model_1.default.checkPrice()
        .then((subscription_price) => {
        subscription_model_1.default.checkSubscription(userId)
            .then((user_subscription) => {
            if (user_subscription == null) {
                // User has never paid the first subscription
                const subscriptionDate = monthAfterDate;
                subscriptionDate.setDate(subscriptionDate.getDate() + 1);
                const subscriptionExpireDate = subscriptionDate;
                subscriptionExpireDate.setDate(date.getDate() + 30);
                subscriptionExpireDate.setHours(23, 59, 59, 99);
                const _price = subscription_price == null || subscription_price.price == null
                    ? 0
                    : parseFloat(subscription_price.price.toString());
                const _membership = subscription_price == null ||
                    subscription_price.membership == null
                    ? 0
                    : parseFloat(subscription_price.membership.toString());
                const _service = subscription_price == null || subscription_price.service == null
                    ? 0
                    : parseFloat(subscription_price.service.toString());
                const subscription = new subscription_model_1.default(_price, _membership, _service, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                subscription.create().then((result) => {
                    const userUID = userId.toString().padStart(10, "0");
                    const value = _membership + _service;
                    switch (payment_method) {
                        case 1:
                            // Payment using BRI Virtual account
                            // Create BRI Virtual account for user
                            // TODO:
                            // Create virtual account from BRI banking service
                            return res
                                .status(405)
                                .send("Pembayaran tidak dapat dilakukan dengan metode ini.");
                        case 2:
                            // Payment using Mandiri Virtual account
                            // TODO:
                            // Create virtual account from BRI banking service
                            return res
                                .status(405)
                                .send("Pembayaran tidak dapat dilakukan dengan metode ini.");
                        case 3:
                            // Payment using manual verification BRI
                            // TODO:
                            // Create virtual account from BRI banking service
                            return res.status(201).send({
                                id: result.id,
                                price: parseFloat(result.price.toString()),
                                membership: parseFloat(result.price.toString()),
                                service: parseFloat(result.price.toString()),
                                payment_method: result.payment_method,
                                created_at: result.created_at,
                                user: result.user,
                            });
                        // Alert someone about this transaction
                        case 4:
                            // Payment using manual verification Mandiri
                            // TODO:
                            // Create virtual account from BRI banking service
                            return res.status(201).send({
                                id: result.id,
                                price: parseFloat(result.price.toString()),
                                membership: parseFloat(result.price.toString()),
                                service: parseFloat(result.price.toString()),
                                payment_method: result.payment_method,
                                created_at: result.created_at,
                                user: result.user,
                            });
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
                const _membership = subscription_price == null ||
                    subscription_price.membership == null
                    ? 0
                    : parseFloat(subscription_price.membership.toString());
                const _service = subscription_price == null || subscription_price.service == null
                    ? 0
                    : parseFloat(subscription_price.service.toString());
                const subscription = new subscription_model_1.default(0, _membership, _service, req.body.userId, subscriptionDate, subscriptionExpireDate, payment_method);
                subscription.create().then((result) => {
                    const userUID = userId.toString().padStart(10, "0");
                    const value = _membership + _service;
                    switch (payment_method) {
                        case 1:
                            // Payment using BRI Virtual account
                            // Create BRI Virtual account for user
                            // TODO:
                            // Create virtual account from BRI banking service
                            return res
                                .status(405)
                                .send("Pembayaran tidak dapat dilakukan dengan metode ini.");
                            break;
                        case 2:
                            // Payment using Mandiri Virtual account
                            // TODO:
                            // Create virtual account from BRI banking service
                            return res
                                .status(405)
                                .send("Pembayaran tidak dapat dilakukan dengan metode ini.");
                            break;
                        case 3:
                        // Payment using manual verification BRI
                        // TODO:
                        // Create virtual account from BRI banking service
                        case 4:
                        // Payment using manual verification Mandiri
                        // TODO:
                        // Create virtual account from BRI banking service
                    }
                });
            }
        })
            .catch((error) => {
            console.error(`[error]: Getting user subscription ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    })
        .catch((error) => {
        console.error(`[error]: Fetching subscription price ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
exports.default = SubscriptionController;
