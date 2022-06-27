"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
class UserModel {
    constructor(name, nik, phone_number, district_id, password, gender) {
        this.name = name;
        this.nik = nik;
        this.phone_number = phone_number;
        this.district_id = district_id;
        this.password = password;
        this.profile_image_url = null;
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
                name: true,
                nik: true,
                phone_number: true,
                district: {
                    select: {
                        name: true,
                    },
                },
                password: true,
                role: true
            },
        });
    }
}
exports.default = UserModel;
