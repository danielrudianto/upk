import { PrismaClient } from "@prisma/client";
import UserModel from "./user.model.ts";

const prisma = new PrismaClient();

class UserTokenModel {
    id?: number;
    user_id: number;
    token: string;
    user?: UserModel;

    constructor(user_id: number, token: string){
        this.user_id = user_id;
        this.token = token;
    }

    static checkToken(token: string){
        return prisma.user_token.findUnique({
            where:{
                token: token
            },
            select: {
                user_id: true
            }
        });
    }

    registerToken(){
        return prisma.$transaction([
            prisma.user_token.delete({
                where:{
                    token: this.token
                }
            }),
            prisma.user_token.create({
                data: {
                    user_id: this.user_id,
                    token: this.token
                },
                select: {
                    user: {
                        select: {
                            name: true
                        }
                    },
                    token: true
                }
            })
        ]);
    }
}

export default UserTokenModel;