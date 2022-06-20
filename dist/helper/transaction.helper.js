"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QueryTransactionHelper {
    static create(querys) {
        return prisma.$transaction(querys);
    }
}
exports.default = QueryTransactionHelper;
