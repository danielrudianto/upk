import { user } from "@prisma/client";

export interface post {
    id?: number;
    user: user;
}