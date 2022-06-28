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
            is_available: true
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

    static fetchById(id: number){
      return prisma.payment_method.findUnique({
        where:{
          id: id
        }
      })
    }

    static fetchUnconfirmedMembershipPayment(offset: number, limit: number){
      return prisma.$transaction([
        prisma.user_subscription.findMany({
          where:{
            is_paid: false
          },
          include: {
            payment_proof: {
              select: {
                url: true,
              }
            }
          }
        }),
        prisma.user_subscription.count({
          where:{
            is_paid: false
          }
        })
      ])
    }
}

export default PaymentModel;