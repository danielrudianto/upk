import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PaymentProof {
    id?: number;
    user_subscription_id: number | null;
    user_transaction_id: number | null;
    url: string;
    created_by: number;
    created_at: Date;

    constructor(
        user_subscription_id: number | null,
        user_transaction_id: number | null,
        url: string,
        created_by: number
    ) {
        this.user_subscription_id = user_subscription_id;
        this.user_transaction_id = user_transaction_id;
        this.url = url;
        this.created_by = created_by;
        this.created_at = new Date();
    }

    create(){
        return prisma.payment_proof.create({
            data: {
                user_subscription_id: this.user_subscription_id,
                user_transaction_id: this.user_transaction_id,
                url: this.url,
                created_by: this.created_by,
                created_at: this.created_at
            }
        });
    }
}

export default PaymentProof;