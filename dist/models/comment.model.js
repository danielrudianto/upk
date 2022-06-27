"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CommentModel {
    constructor(comment, post_id, created_by, created_by_district_id = null) {
        this.comment = comment;
        this.post_id = post_id;
        this.created_by = created_by;
        this.district_id = created_by_district_id;
        this.created_at = new Date();
    }
    createComment() {
        return prisma.post_comment.create({
            data: {
                created_by: this.created_by,
                comment: this.comment,
                post_id: this.post_id,
                district_id: this.district_id,
            },
            select: {
                id: true,
                comment: true,
                user: {
                    select: {
                        profile_image_url: true,
                        uid: true,
                        name: true,
                    },
                },
                district: {
                    select: {
                        name: true,
                    },
                },
                created_at: true,
            },
        });
    }
    static fetchByPostUID(uid, offset = 0, limit = 10) {
        return prisma.post_comment.findMany({
            where: {
                post: {
                    uid: uid,
                },
                is_delete: false,
            },
            select: {
                comment: true,
                user: {
                    select: {
                        name: true,
                        uid: true,
                        profile_image_url: true,
                    },
                },
                district: {
                    select: {
                        name: true,
                    },
                },
                created_at: true,
            },
            orderBy: {
                created_at: "desc",
            },
            take: limit,
            skip: offset,
        });
    }
}
exports.default = CommentModel;
