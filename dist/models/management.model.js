"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserManagementModel {
    constructor(user_id, management_level, district_id, id = null) {
        this.is_approved = false;
        if (id != null) {
            this.id = id;
        }
        this.user_id = user_id;
        this.management_level = management_level;
        this.district_id = district_id;
        this.created_at = new Date();
    }
    create() {
        return prisma.user_management.create({
            data: {
                user_id: this.user_id,
                management_level: this.management_level,
                district_id: this.district_id,
                created_at: this.created_at,
            },
        });
    }
    static fetchById(id) {
        return prisma.user_management.findUnique({
            where: {
                id: id,
            },
            select: {
                district: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                management_level: true,
                is_approved: true,
                is_delete: true,
            },
        });
    }
}
exports.default = UserManagementModel;
