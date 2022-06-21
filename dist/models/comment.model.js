"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CommentModel {
    constructor(comment, post_id, created_by) {
        this.comment = comment;
        this.post_id = post_id;
        this.created_by = created_by;
    }
    createComment() {
        return prisma.post_comment.create({
            data: {
                created_by: this.created_by,
                comment: this.comment,
                post_id: this.post_id
            },
            select: {
                id: true,
                comment: true,
                user: {
                    select: {
                        profile_image_url: true,
                        uid: true,
                        name: true
                    }
                },
                created_at: true
            }
        });
    }
}
exports.default = CommentModel;
