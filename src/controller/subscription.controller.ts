import { Request, Response } from "express";
import { validationResult } from "express-validator";
import QueryTransactionHelper from "../helper/transaction.helper";
import SubscriptionModel from "../models/subscription.model";
import TransactionModel from "../models/transaction.model";

class SubscriptionController {
  static getPrice = (req: Request, res: Response) => {
    SubscriptionModel.checkPrice()
      .then((result) => {
        SubscriptionModel.checkSubscription(req.body.userId)
          .then((user_subscription) => {
            if (user_subscription == null) {
              // User has never paid the first subscription
              return res.status(200).send({
                price: parseFloat(result!.price!.toString()),
                membership: parseFloat(result!.membership.toString()),
                service: parseFloat(result!.service.toString()),
                effective_date: result?.effective_date,
              });
            } else {
              // User has paid the first subscription
              return res.status(200).send({
                price: 0,
                membership: result?.membership,
                service: result?.service,
                effective_date: result?.effective_date,
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

  static create = (req: Request, res: Response) => {
    const val_result = validationResult(req);
    if (!val_result.isEmpty()) {
      return res.status(500).send(val_result.array()[0].msg);
    }

    const userId = req.body.userId;
    const payment_method = parseInt(req.body.payment_method);

    // Check if there is a transaction that is not expired
    QueryTransactionHelper.create([
      SubscriptionModel.checkRunningTransaction(userId),
      TransactionModel.checkRunningTransaction(userId),
    ]).then((result) => {
      if (result[0] == 0 && result[1] == 0) {
        // Everything has been paid / expired
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);

        let monthAfterDate = new Date();
        monthAfterDate.setDate(monthAfterDate.getDate() + 1);

        SubscriptionModel.checkPrice()
          .then((subscription_price) => {
            SubscriptionModel.checkSubscription(userId)
              .then((user_subscription) => {
                if (user_subscription == null) {
                  // User has never paid the first subscription
                  const subscriptionDate = monthAfterDate;
                  subscriptionDate.setDate(subscriptionDate.getDate() + 1);

                  const subscriptionExpireDate = subscriptionDate;
                  subscriptionExpireDate.setDate(date.getDate() + 30);
                  subscriptionExpireDate.setHours(23, 59, 59, 99);

                  const _price =
                    subscription_price == null ||
                    subscription_price.price == null
                      ? 0
                      : parseFloat(subscription_price.price.toString());
                  const _membership =
                    subscription_price == null ||
                    subscription_price.membership == null
                      ? 0
                      : parseFloat(subscription_price.membership.toString());
                  const _service =
                    subscription_price == null ||
                    subscription_price.service == null
                      ? 0
                      : parseFloat(subscription_price.service.toString());

                  const subscription = new SubscriptionModel(
                    _price,
                    _membership,
                    _service,
                    req.body.userId,
                    subscriptionDate,
                    subscriptionExpireDate,
                    payment_method
                  );

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
                          .send(
                            "Pembayaran tidak dapat dilakukan dengan metode ini."
                          );
                      case 2:
                        // Payment using Mandiri Virtual account
                        // TODO:
                        // Create virtual account from BRI banking service
                        return res
                          .status(405)
                          .send(
                            "Pembayaran tidak dapat dilakukan dengan metode ini."
                          );
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
                } else {
                  // User has paid the first subscription
                  const subscriptionDate = user_subscription.valid_until!;
                  subscriptionDate.setDate(subscriptionDate.getDate() + 1);

                  const subscriptionExpireDate = subscriptionDate;
                  subscriptionExpireDate.setDate(date.getDate() + 30);
                  subscriptionExpireDate.setHours(23, 59, 59, 99);

                  const _membership =
                    subscription_price == null ||
                    subscription_price.membership == null
                      ? 0
                      : parseFloat(subscription_price.membership.toString());
                  const _service =
                    subscription_price == null ||
                    subscription_price.service == null
                      ? 0
                      : parseFloat(subscription_price.service.toString());

                  const subscription = new SubscriptionModel(
                    0,
                    _membership,
                    _service,
                    req.body.userId,
                    subscriptionDate,
                    subscriptionExpireDate,
                    payment_method
                  );
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
                          .send(
                            "Pembayaran tidak dapat dilakukan dengan metode ini."
                          );

                        break;
                      case 2:
                        // Payment using Mandiri Virtual account
                        // TODO:
                        // Create virtual account from BRI banking service
                        return res
                          .status(405)
                          .send(
                            "Pembayaran tidak dapat dilakukan dengan metode ini."
                          );

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
                console.error(
                  `[error]: Getting user subscription ${new Date()}`
                );
                console.error(`[error]: ${error}`);

                return res.status(500).send(error);
              });
          })
          .catch((error) => {
            console.error(`[error]: Fetching subscription price ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
          });
      } else {
        return res.status(400).send("Masih terdapat transaksi berlangsung.");
      }
    }).catch(error => {
      console.error(`[error]: Checking running transaction ${new Date()}`);
      console.error(`[error]: ${error}`);

      return res.status(500).send(error);
    })
  };
}

export default SubscriptionController;
