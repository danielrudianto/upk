import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CommentModel {
    id?: number;
    uid?: string;
    comment: string;
    post_id: number;
    created_by: number;
    created_at?: Date;
    is_delete?: boolean;

    constructor(comment: string, post_id: number, created_by: number){
        this.comment = comment;
        this.post_id = post_id;
        this.created_by = created_by;
    }

    createComment(){
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

export default CommentModel;