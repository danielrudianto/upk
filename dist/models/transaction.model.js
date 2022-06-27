"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TransactionModel {
    constructor(created_by, value, service, discount, product_code_name, purchase_reference, purchase_number_reference, payment_method_id, district_id, note, id = null) {
        if (id != null) {
            this.id = id;
        }
        this.created_at = new Date();
        this.created_by = created_by;
        this.value = value;
        this.service = service;
        this.discount = discount;
        this.product_code_name = product_code_name;
        this.purchase_number_reference = purchase_number_reference;
        this.purchase_reference = purchase_reference;
        this.district_id = district_id;
        this.note = note;
        this.payment_method_id = payment_method_id;
        this.is_delete = false;
        this.is_paid = false;
        this.paid_at = null;
        this.payment_reference = null;
    }
    create() {
        return prisma.user_transaction.create({
            data: {
                value: this.value,
                discount: this.discount,
                service: this.service,
                product_code_name: this.product_code_name,
                purchase_number_reference: this.purchase_number_reference,
                purchase_reference: this.purchase_reference,
                district_id: this.district_id,
                note: this.note,
                payment_method_id: this.payment_method_id,
                paid_at: this.paid_at,
                is_paid: this.is_paid,
                is_delete: this.is_delete,
                payment_reference: this.payment_reference,
                created_by: this.created_by,
                created_at: this.created_at,
            },
            select: {
                id: true,
                value: true,
                discount: true,
                service: true,
                product_code_name: true,
                purchase_number_reference: true,
                purchase_reference: true,
                district: {
                    select: {
                        name: true,
                    },
                },
                note: true,
                payment_method: {
                    select: {
                        name: true,
                        logo: true,
                    },
                },
            },
        });
    }
    static fetch(mode, user_id = null, district_id = null, offset, limit) {
        // 1 is for All transactions
        // 2 is for unpaid transactions
        // 3 is for paid transactions
        if (district_id != null) {
            switch (mode) {
                default:
                    return prisma.user_transaction.findMany({
                        where: {
                            district_id: {
                                not: null,
                            },
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            created_at: true,
                            product_code_name: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                            user: {
                                select: {
                                    name: true,
                                    uid: true,
                                    profile_image_url: true,
                                },
                            },
                            district: {
                                select: {
                                    name: true,
                                },
                            },
                            purchase_reference: true,
                            note: true,
                            payment_reference: true,
                            payment_proof: {
                                select: {
                                    created_at: true,
                                    url: true,
                                },
                            },
                        },
                        take: limit,
                        skip: offset
                    });
                case 2:
                    return prisma.user_transaction.findMany({
                        where: {
                            district_id: {
                                not: null,
                            },
                            is_paid: false,
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            created_at: true,
                            product_code_name: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                            user: {
                                select: {
                                    name: true,
                                    uid: true,
                                    profile_image_url: true,
                                },
                            },
                            district: {
                                select: {
                                    name: true,
                                },
                            },
                            purchase_reference: true,
                            note: true,
                            payment_reference: true,
                            payment_proof: {
                                select: {
                                    created_at: true,
                                    url: true,
                                },
                            },
                        },
                        take: limit,
                        skip: offset
                    });
                case 3:
                    return prisma.user_transaction.findMany({
                        where: {
                            district_id: {
                                not: null,
                            },
                            is_paid: true,
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            created_at: true,
                            product_code_name: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                            user: {
                                select: {
                                    name: true,
                                    uid: true,
                                    profile_image_url: true,
                                },
                            },
                            district: {
                                select: {
                                    name: true,
                                },
                            },
                            purchase_reference: true,
                            note: true,
                            payment_reference: true,
                            payment_proof: {
                                select: {
                                    created_at: true,
                                    url: true,
                                },
                            },
                        },
                        take: limit,
                        skip: offset
                    });
            }
        }
        else if (user_id != null && district_id == null) {
            switch (mode) {
                default:
                    return prisma.user_transaction.findMany({
                        where: {
                            district_id: null,
                            created_by: user_id,
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            created_at: true,
                            product_code_name: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                            user: {
                                select: {
                                    name: true,
                                    uid: true,
                                    profile_image_url: true,
                                },
                            },
                            district: {
                                select: {
                                    name: true,
                                },
                            },
                            purchase_reference: true,
                            note: true,
                            payment_reference: true,
                            payment_proof: {
                                select: {
                                    created_at: true,
                                    url: true,
                                },
                            },
                        },
                        take: limit,
                        skip: offset
                    });
                case 2:
                    return prisma.user_transaction.findMany({
                        where: {
                            district_id: null,
                            created_by: user_id,
                            is_paid: false,
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            created_at: true,
                            product_code_name: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                            user: {
                                select: {
                                    name: true,
                                    uid: true,
                                    profile_image_url: true,
                                },
                            },
                            district: {
                                select: {
                                    name: true,
                                },
                            },
                            purchase_reference: true,
                            note: true,
                            payment_reference: true,
                            payment_proof: {
                                select: {
                                    created_at: true,
                                    url: true,
                                },
                            },
                        },
                        take: limit,
                        skip: offset
                    });
                case 3:
                    return prisma.user_transaction.findMany({
                        where: {
                            district_id: null,
                            created_by: user_id,
                            is_paid: true,
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                        select: {
                            created_at: true,
                            product_code_name: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                            user: {
                                select: {
                                    name: true,
                                    uid: true,
                                    profile_image_url: true,
                                },
                            },
                            district: {
                                select: {
                                    name: true,
                                },
                            },
                            purchase_reference: true,
                            note: true,
                            payment_reference: true,
                            payment_proof: {
                                select: {
                                    created_at: true,
                                    url: true,
                                },
                            },
                        },
                        take: limit,
                        skip: offset
                    });
            }
        }
        else {
            throw Error("Request tidak valid.");
        }
    }
    static count(mode, user_id = null, district_id = null) {
        if (district_id != null) {
            switch (mode) {
                default:
                    return prisma.user_transaction.count({
                        where: {
                            district_id: {
                                not: null,
                            },
                        }
                    });
                case 2:
                    return prisma.user_transaction.count({
                        where: {
                            district_id: {
                                not: null,
                            },
                            is_paid: false,
                        }
                    });
                case 3:
                    return prisma.user_transaction.count({
                        where: {
                            district_id: {
                                not: null,
                            },
                            is_paid: true,
                        }
                    });
            }
        }
        else if (user_id != null && district_id == null) {
            switch (mode) {
                default:
                    return prisma.user_transaction.count({
                        where: {
                            district_id: null,
                            created_by: user_id,
                        }
                    });
                case 2:
                    return prisma.user_transaction.count({
                        where: {
                            district_id: null,
                            created_by: user_id,
                            is_paid: false,
                        }
                    });
                case 3:
                    return prisma.user_transaction.count({
                        where: {
                            district_id: null,
                            created_by: user_id,
                            is_paid: true,
                        }
                    });
            }
        }
        else {
            throw Error("Request tidak valid.");
        }
    }
}
exports.default = TransactionModel;
