"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
class UserModel {
    constructor(name, nik, phone_number, district_id, password, gender, profile_image_url = null, id = null) {
        if (id != null) {
            this.id = id;
        }
        this.name = name;
        this.nik = nik;
        this.phone_number = phone_number;
        this.district_id = district_id;
        this.password = password;
        this.profile_image_url =
            profile_image_url != null ? profile_image_url : null;
        this.uid = (0, uuid_1.v4)();
        this.created_at = new Date();
        this.gender = gender;
    }
    create() {
        return prisma.user.create({
            data: this,
            select: {
                uid: true,
                name: true,
                phone_number: true,
                nik: true,
                gender: true,
            },
        });
    }
    update() {
        return prisma.user.update({
            where: {
                id: this.id,
            },
            data: {
                name: this.name,
                phone_number: this.phone_number,
                password: this.password,
                updated_at: new Date(),
            },
        });
    }
    /* Get a user by Nomor Induk Kependudukan number */
    static getUserByNIK(nik) {
        return prisma.user.findUnique({
            where: {
                nik: nik,
            },
            select: {
                id: true,
                name: true,
                nik: true,
                phone_number: true,
                gender: true,
                uid: true
            },
        });
    }
    /* Get a user by phone number */
    static getUserByPhoneNumber(phone_number) {
        return prisma.user.findUnique({
            where: {
                phone_number: phone_number,
            },
            select: {
                id: true,
                uid: true,
                name: true,
                nik: true,
                gender: true,
                phone_number: true,
                district: {
                    select: {
                        name: true,
                    },
                },
                password: true,
                role: true,
                user_management: {
                    select: {
                        district: {
                            select: {
                                name: true,
                                provinsi_id: true,
                                kota_id: true,
                                kecamatan_id: true,
                                kelurahan_id: true,
                            },
                        },
                        management_level: true,
                    },
                    where: {
                        is_approved: true,
                    },
                },
            },
        });
    }
    /* Get a user by ID */
    static fetchById(id) {
        return prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                uid: true,
                name: true,
                nik: true,
                gender: true,
                phone_number: true,
                district: {
                    select: {
                        name: true,
                    },
                },
                password: true,
                role: true,
                user_management: {
                    where: {
                        is_approved: true,
                        is_delete: false,
                    },
                    select: {
                        management_level: true,
                        district_id: true,
                    },
                },
            },
        });
    }
    /* Get a user by it's UID */
    static fetchByUID(uid) {
        return prisma.user.findUnique({
            where: {
                uid: uid,
            },
        });
    }
    /* Get user profile by user ID */
    static fetchProfileById(id) {
        return prisma.$transaction([
            prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    name: true,
                    profile_image_url: true,
                    nik: true,
                    gender: true,
                    uid: true,
                    created_at: true,
                    phone_number: true,
                    user_subscription: {
                        select: {
                            valid_from: true,
                            valid_until: true,
                            payment_method: {
                                select: {
                                    name: true,
                                    logo: true,
                                },
                            },
                        },
                        where: {
                            is_paid: true,
                        },
                    },
                },
            }),
            prisma.user_follow.count({
                where: {
                    user_id_target: id,
                    deleted_at: null,
                },
            }),
            prisma.user_follow.count({
                where: {
                    user_id: id,
                    deleted_at: null,
                },
            }),
            prisma.post.count({
                where: {
                    created_by: id,
                    is_delete: false,
                },
            }),
            prisma.user_subscription.count({
                where: {
                    created_by: id,
                    is_paid: true,
                },
            }),
        ]);
    }
}
exports.default = UserModel;
