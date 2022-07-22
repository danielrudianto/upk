"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PaymentProofModel {
    constructor(user_subscription_id, user_transaction_id, url, created_by) {
        this.user_subscription_id = user_subscription_id;
        this.user_transaction_id = user_transaction_id;
        this.url = url;
        this.created_by = created_by;
        this.created_at = new Date();
    }
    create() {
        return prisma.payment_proof.create({
            data: {
                user_subscription_id: this.user_subscription_id,
                user_transaction_id: this.user_transaction_id,
                url: this.url,
                created_by: this.created_by,
                created_at: this.created_at
            }
        });
    }
}
exports.default = PaymentProofModel;
