"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserFollowModel {
    constructor(user_id, district_id = null, user_id_target = null, district_id_target = null) {
        this.user_id = user_id;
        this.user_id_target = user_id_target;
        this.district_id = district_id;
        this.district_id_target = district_id_target;
        this.created_at = new Date();
        this.deleted_at = null;
    }
    create() {
        return prisma.user_follow.create({
            data: {
                user_id: this.user_id,
                district_id: this.district_id,
                user_id_target: this.user_id_target,
                district_id_target: this.district_id_target,
                created_at: this.created_at,
            },
            select: {
                user: {
                    select: {
                        name: true,
                        uid: true,
                    }
                },
                user_target: {
                    select: {
                        name: true,
                        uid: true
                    }
                },
                created_at: true,
            }
        });
    }
    static countExisting(user_id, user_uid) {
        return prisma.user_follow.count({
            where: {
                user_id: user_id,
                user_target: {
                    uid: user_uid
                },
                deleted_at: null
            }
        });
    }
    static fetchExistingUser(user_id = null, district_id = null, user_id_target = null, district_id_target) {
        return prisma.user_follow.findFirst({
            where: {
                user_id: user_id,
                district_id: district_id,
                user_id_target: user_id_target,
                district_id_target: district_id_target,
                deleted_at: null
            }
        });
    }
    static delete(id) {
        return prisma.user_follow.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        });
    }
}
exports.default = UserFollowModel;
