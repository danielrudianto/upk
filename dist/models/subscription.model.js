"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SubscriptionModel {
    constructor(price = 0, membership = 0, service = 0, created_by, valid_from, valid_until, payment_method_id) {
        this.paid_at = null;
        this.payment_id = null;
        this.price = price;
        this.membership = membership;
        this.service = service;
        this.created_by = created_by;
        (this.created_at = new Date()), (this.valid_from = valid_from);
        this.valid_until = valid_until;
        this.is_paid = false;
        this.payment_method_id = payment_method_id;
    }
    static checkPrice(date = new Date()) {
        return prisma.subscription_price.findFirst({
            orderBy: {
                effective_date: "desc",
            },
            where: {
                effective_date: {
                    lte: date,
                },
            },
        });
    }
    static checkSubscription(user_id) {
        return prisma.user_subscription.findFirst({
            where: {
                is_paid: true,
                created_by: user_id,
            },
            select: {
                valid_until: true,
            },
            orderBy: {
                valid_from: "desc",
            },
        });
    }
    create() {
        return prisma.user_subscription.create({
            data: {
                created_by: this.created_by,
                created_at: this.created_at,
                membership: this.membership,
                price: this.price,
                service: this.service,
                valid_from: this.valid_from,
                valid_until: this.valid_until,
                is_paid: false,
                payment_id: null,
                payment_method_id: this.payment_method_id,
            },
            select: {
                id: true,
                price: true,
                membership: true,
                service: true,
                created_at: true,
                valid_from: true,
                valid_until: true,
                user: {
                    select: {
                        uid: true,
                        profile_image_url: true,
                        name: true
                    }
                },
                is_paid: true,
                payment_id: true,
                payment_method: {
                    select: {
                        name: true,
                        logo: true,
                    }
                }
            }
        });
    }
}
exports.default = SubscriptionModel;
