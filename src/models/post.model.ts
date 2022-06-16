import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import CommentModel from "./comment.model";
import ReactionModel from "./reaction.model";

const prisma = new PrismaClient();

class PostModel {
    id?: number;
    uid?: string;
    caption: string;
    created_by: number;
    created_at?: Date;
    post_comment?: CommentModel[];
    post_reaction?: ReactionModel[];

    constructor(caption: string, created_by: number){
        this.caption = caption;
        this.created_by = created_by;
        this.created_at = new Date();
    }

    create(){
        return prisma.post.create({
            data: {
                caption: this.caption,
                created_by: this.created_by,
                created_at: this.created_at,
                uid: v4()
            }
        });
    }

    static getPostByUID(uid: string){
        return prisma.post.findUnique({
            where:{
                uid: uid
            },
            select: {
                id: true,
                is_delete: true,
                user: {
                    select: {
                        profile_image_url: true,
                        name: true,
                    }
                },
                created_at: true,
                post_media: {
                    select: {
                        url: true,
                        name: true
                    }
                }
            }
        })
    }

    static delete(id: number){
        return prisma.post.update({
            where:{
                id: id
            },
            data: {
                is_delete: true,
                deleted_at: new Date()
            }
        });
    }
}

export default PostModel;