"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserTokenModel {
    constructor(user_id, token) {
        this.user_id = user_id;
        this.token = token;
    }
    static checkToken(token) {
        return prisma.user_token.findUnique({
            where: {
                token: token,
            },
            select: {
                user_id: true,
            },
        });
    }
    registerToken() {
        return prisma.$transaction([
            prisma.user_token.delete({
                where: {
                    token: this.token,
                },
            }),
            prisma.user_token.create({
                data: {
                    user_id: this.user_id,
                    token: this.token,
                },
                select: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    token: true,
                },
            }),
        ]);
    }
}
exports.default = UserTokenModel;
