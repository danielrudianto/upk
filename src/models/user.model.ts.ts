import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import DistrictModel from "./district.model";

const prisma = new PrismaClient();

class UserModel {
    id?: number | null;
    name: string;
    nik: string;
    phone_number: string;
    district_id: number;
    password?: string;
    uid?: string;
    profile_image_url?: string | null;
    created_at?: Date;
    gender: string;

    district?: DistrictModel;

    constructor(name: string, nik: string, phone_number: string, district_id: number, password: string, gender: string) {
        this.name = name;
        this.nik = nik;
        this.phone_number = phone_number;
        this.district_id = district_id;
        this.password = password;
        this.profile_image_url = null;
        this.uid = v4();
        this.created_at = new Date();
        this.gender = gender;
    }

    create() {
        return prisma.user.create({
            data: this as any,
            select: {
                uid: true,
                name: true,
                phone_number: true,
                nik: true
            }
        });
    }

    /* Get a user by Nomor Induk Kependudukan number */
    static getUserByNIK(nik: string) {
        return prisma.user.findUnique({
            where: {
                nik: nik
            },
            select: {
                id: true,
                name: true,
                nik: true,
                phone_number: true
            }
        })
    }

    /* Get a user by phone number */
    static getUserByPhoneNumber(phone_number: string) {
        return prisma.user.findUnique({
            where: {
                phone_number: phone_number
            },
            select: {
                id: true,
                name: true,
                nik: true,
                phone_number: true,
                district: {
                    select: {
                        name: true
                    }
                },
                password: true
            }
        })
    }

    /* Get a user by ID */
    static getUserById(id: number) {
        return prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                nik: true,
                phone_number: true,
                district: {
                    select: {
                        name: true
                    }
                },
                password: true
            }
        })
    }
}

export default UserModel;