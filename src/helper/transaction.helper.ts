import { PrismaClient, PrismaPromise } from "@prisma/client";

const prisma = new PrismaClient();

class QueryTransactionHelper{
    static create(querys: PrismaPromise<any>[]){
        return prisma.$transaction(querys);
    }
}

export default QueryTransactionHelper;