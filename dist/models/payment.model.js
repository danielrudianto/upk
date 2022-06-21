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
}
exports.default = PaymentModel;
