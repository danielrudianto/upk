import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PaymentModel {
    id?: number;
    name: string;

    constructor(name: string){
        this.name = name;
    }

    static fetch(){
        return prisma.payment_method
        .findMany({
          where: {
            is_delete: false,
          },
          orderBy: {
            name: "asc",
          },
          select: {
              id: true,
              name: true,
              logo: true,
          }
        })
    }
}

export default PaymentModel;