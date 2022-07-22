"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserManagementModel {
    constructor(user_id, management_level, district_id, id = null) {
        this.is_approved = false;
        if (id != null) {
            this.id = id;
        }
        this.user_id = user_id;
        this.management_level = management_level;
        this.district_id = district_id;
        this.created_at = new Date();
    }
    create() {
        return prisma.user_management.create({
            data: {
                user_id: this.user_id,
                management_level: this.management_level,
                district_id: this.district_id,
                created_at: this.created_at,
            },
        });
    }
    static fetchById(id) {
        return prisma.user_management.findUnique({
            where: {
                id: id,
            },
            select: {
                user: {
                    select: {
                        name: true,
                        uid: true,
                        profile_image_url: true,
                        nik: true,
                        gender: true,
                        phone_number: true,
                    },
                },
                district: {
                    select: {
                        id: true,
                        name: true,
                        provinsi_id: true,
                        kecamatan_id: true,
                        kelurahan_id: true,
                        kota_id: true,
                    },
                },
                management_level: true,
                is_approved: true,
                is_delete: true,
            },
        });
    }
    static fetchStaffSubmission(provinsi_id, kota_id = null, kecamatan_id = null, kelurahan_id) {
        return prisma.user_management.findMany({
            where: {
                district: {
                    provinsi_id: provinsi_id,
                    kota_id: kota_id,
                    kecamatan_id: kecamatan_id,
                    kelurahan_id: kelurahan_id,
                },
                is_approved: false,
                is_delete: false,
                management_level: {
                    not: 1,
                },
            },
            select: {
                id: true,
                created_at: true,
                user: {
                    select: {
                        uid: true,
                        name: true,
                        profile_image_url: true,
                        nik: true,
                        gender: true,
                        phone_number: true,
                    },
                },
            },
        });
    }
    static fetchChildrenSubmission(provinsi_id = null, kota_id = null, kecamatan_id = null, kelurahan_id) {
        if (provinsi_id != null &&
            kota_id != null &&
            kecamatan_id != null &&
            kelurahan_id != null) {
            // User is on kelurahan account
            // Return promise of empty array
            return Promise.resolve([]);
        }
        else if (provinsi_id != null &&
            kota_id != null &&
            kecamatan_id != null &&
            kelurahan_id == null) {
            // User is on kecamatan account
            // Return submission on kelurahan kevel
            return prisma.user_management.findMany({
                where: {
                    district: {
                        provinsi_id: provinsi_id,
                        kota_id: kota_id,
                        kecamatan_id: kecamatan_id,
                        kelurahan_id: {
                            not: null,
                        },
                    },
                    is_approved: false,
                    is_delete: false,
                    management_level: 1,
                },
                select: {
                    id: true,
                    created_at: true,
                    user: {
                        select: {
                            uid: true,
                            name: true,
                            profile_image_url: true,
                            nik: true,
                            gender: true,
                            phone_number: true,
                        },
                    },
                },
            });
        }
        else if (provinsi_id != null &&
            kota_id != null &&
            kecamatan_id == null &&
            kelurahan_id == null) {
            return prisma.user_management.findMany({
                where: {
                    district: {
                        provinsi_id: provinsi_id,
                        kota_id: kota_id,
                        kecamatan_id: {
                            not: null,
                        },
                        kelurahan_id: null,
                    },
                    is_approved: false,
                    is_delete: false,
                    management_level: 1,
                },
                select: {
                    id: true,
                    created_at: true,
                    user: {
                        select: {
                            uid: true,
                            name: true,
                            profile_image_url: true,
                            nik: true,
                            gender: true,
                            phone_number: true,
                        },
                    },
                },
            });
        }
        else if (provinsi_id != null &&
            kota_id == null &&
            kecamatan_id == null &&
            kelurahan_id == null) {
            return prisma.user_management.findMany({
                where: {
                    district: {
                        provinsi_id: provinsi_id,
                        kota_id: {
                            not: null,
                        },
                        kecamatan_id: null,
                        kelurahan_id: null,
                    },
                    is_approved: false,
                    is_delete: false,
                    management_level: 1,
                },
                select: {
                    id: true,
                    created_at: true,
                    user: {
                        select: {
                            uid: true,
                            name: true,
                            profile_image_url: true,
                            nik: true,
                            gender: true,
                            phone_number: true,
                        },
                    },
                },
            });
        }
        else if (provinsi_id == null &&
            kota_id == null &&
            kecamatan_id == null &&
            kelurahan_id == null) {
            return prisma.user_management.findMany({
                where: {
                    district: {
                        provinsi_id: {
                            not: null,
                        },
                        kota_id: null,
                        kecamatan_id: null,
                        kelurahan_id: null,
                    },
                    is_approved: false,
                    is_delete: false,
                    management_level: 1,
                },
                select: {
                    id: true,
                    created_at: true,
                    user: {
                        select: {
                            uid: true,
                            name: true,
                            profile_image_url: true,
                            nik: true,
                            gender: true,
                            phone_number: true,
                        },
                    },
                },
            });
        }
    }
    static approve(id, created_by) {
        return prisma.user_management.update({
            where: {
                id: id,
            },
            data: {
                is_approved: true,
                approved_at: new Date(),
                approved_by: created_by,
            },
            select: {
                id: true,
                management_level: true,
                district: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        uid: true,
                        name: true,
                    },
                },
            },
        });
    }
    static fetchStructureByDistrictId(district_id) {
        return prisma.user_management.findMany({
            where: {
                is_approved: true,
                is_delete: false,
                district_id: district_id
            },
            select: {
                user: {
                    select: {
                        uid: true,
                        profile_image_url: true,
                        nik: true
                    }
                },
                management_level: true
            }
        });
    }
    static fetchMemberCount(provinsi_id = null, kota_id = null, kecamatan_id = null) {
        if (provinsi_id == null) {
            return prisma.user.count({
                where: {
                    user_subscription: {
                        some: {
                            is_paid: true
                        }
                    }
                }
            });
        }
        else if (provinsi_id != null && kota_id == null) {
            return prisma.user.count({
                where: {
                    district: {
                        provinsi_id: provinsi_id,
                    },
                    user_subscription: {
                        some: {
                            is_paid: true
                        }
                    }
                }
            });
        }
        else if (provinsi_id != null && kota_id != null && kecamatan_id == null) {
            return prisma.user.count({
                where: {
                    district: {
                        provinsi_id: provinsi_id,
                        kota_id: kota_id
                    },
                    user_subscription: {
                        some: {
                            is_paid: true
                        }
                    }
                }
            });
        }
        else {
            return prisma.user.count({
                where: {
                    district: {
                        provinsi_id: provinsi_id,
                        kota_id: kota_id,
                        kecamatan_id: kecamatan_id
                    },
                    user_subscription: {
                        some: {
                            is_paid: true
                        }
                    }
                }
            });
        }
    }
}
exports.default = UserManagementModel;
