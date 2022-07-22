"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PaymentModel {
    constructor(name) {
        this.name = name;
    }
    static fetch() {
        return prisma.payment_method
            .findMany({
            where: {
                is_delete: false,
                is_available: true
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                logo: true,
            }
        });
    }
    static fetchById(id) {
        return prisma.payment_method.findUnique({
            where: {
                id: id
            }
        });
    }
    static fetchUnconfirmedMembershipPayment(offset, limit) {
        return prisma.$transaction([
            prisma.user_subscription.findMany({
                where: {
                    is_paid: false
                },
                include: {
                    payment_proof: {
                        select: {
                            url: true,
                        }
                    }
                }
            }),
            prisma.user_subscription.count({
                where: {
                    is_paid: false
                }
            })
        ]);
    }
}
exports.default = PaymentModel;
