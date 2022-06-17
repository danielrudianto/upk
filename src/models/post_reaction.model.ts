import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostReactionModel {
    id?: number;
    reaction: number;
    post_id: number;
    created_by: number;
    created_at: Date;

    constructor(post_id: number, created_by: number, reaction: number = 1){
        this.reaction = reaction;
        this.post_id = post_id;
        this.created_by = created_by;
        this.created_at = new Date();
    }

    static checkReaction(post_id: number, created_by: number){
        return prisma.reaction.count({
            where:{
                post_id: post_id,
                created_by: created_by
            }
        });
    }

    create(){
        return prisma.reaction.create({
            data: {
                post_id: this.post_id,
                reaction: this.reaction,
                created_by: this.created_by,
                created_at: this.created_at
            }
        })
    }

    delete(){
        return prisma.reaction.deleteMany({
            where:{
                post_id: this.post_id,
                created_by: this.created_by,
            }
        })
    }
}

export default PostReactionModel;