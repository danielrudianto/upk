import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SubscriptionModel {
  id?: number;
  price: number;
  membership: number;
  service: number;
  created_by: number;
  created_at: Date;
  valid_from: Date;
  valid_until: Date;
  is_paid: boolean;
  paid_at: Date | null = null;
  payment_id: string | null = null;
  payment_method_id: number;
  payment_expired_date: Date;

  constructor(
    price: number = 0,
    membership: number = 0,
    service: number = 0,
    created_by: number,
    valid_from: Date,
    valid_until: Date,
    payment_method_id: number
  ) {
    this.price = price;
    this.membership = membership;
    this.service = service;
    this.created_by = created_by;
    this.created_at = new Date();
    this.valid_from = valid_from;
    this.valid_until = valid_until;
    this.is_paid = false;
    this.payment_method_id = payment_method_id;

    const date = this.created_at;
    date.setHours(date.getHours() + parseInt(process.env.PAYMENT_EXPIRE!));

    this.payment_expired_date = date;
  }

  create() {
    return prisma.user_subscription.create({
      data: {
        created_by: this.created_by,
        created_at: this.created_at,
        membership: this.membership,
        price: this.price,
        service: this.service,
        valid_from: this.valid_from,
        valid_until: this.valid_until,
        is_paid: false,
        payment_id: null,
        payment_method_id: this.payment_method_id,
        payment_expired_date: this.payment_expired_date
      },
      select: {
        id: true,
        price: true,
        membership: true,
        service: true,
        created_at: true,
        valid_from: true,
        valid_until: true,
        user: {
          select: {
            uid: true,
            profile_image_url: true,
            name: true,
          },
        },
        is_paid: true,
        payment_id: true,
        payment_method: {
          select: {
            name: true,
            logo: true,
          },
        },
        payment_expired_date: true
      },
    });
  }

  static checkPrice(date: Date = new Date()) {
    return prisma.subscription_price.findFirst({
      orderBy: {
        effective_date: "desc",
      },
      where: {
        effective_date: {
          lte: date,
        },
      },
    });
  }

  static checkSubscription(user_id: number) {
    return prisma.user_subscription.findFirst({
      where: {
        is_paid: true,
        created_by: user_id,
      },
      select: {
        valid_until: true,
      },
      orderBy: {
        valid_from: "desc",
      },
    });
  }

  static checkRunningTransaction(user_id: number){
    return prisma.user_subscription.count({
      where:{
        payment_expired_date: {
          lt: new Date()
        },
        is_paid: false
      }
    });
  }
  
}

export default SubscriptionModel;
