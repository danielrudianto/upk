import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserManagementModel {
  id?: number;
  user_id: number;
  management_level: number;
  district_id: number;
  created_at: Date;
  is_approved: boolean = false;
  approved_by?: number;
  approved_at?: Date;

  constructor(
    user_id: number,
    management_level: number,
    district_id: number,
    id: number | null = null
  ) {
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

  static fetchById(id: number) {
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

  static fetchStaffSubmission(
    provinsi_id: string,
    kota_id: string | null = null,
    kecamatan_id: string | null = null,
    kelurahan_id: string | null
  ) {
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

  static fetchChildrenSubmission(
    provinsi_id: string | null = null,
    kota_id: string | null = null,
    kecamatan_id: string | null = null,
    kelurahan_id: string | null
  ) {
    if (
      provinsi_id != null &&
      kota_id != null &&
      kecamatan_id != null &&
      kelurahan_id != null
    ) {
      // User is on kelurahan account
      // Return promise of empty array
      return Promise.resolve([]);
    } else if (
      provinsi_id != null &&
      kota_id != null &&
      kecamatan_id != null &&
      kelurahan_id == null
    ) {
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
    } else if (
      provinsi_id != null &&
      kota_id != null &&
      kecamatan_id == null &&
      kelurahan_id == null
    ) {
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
    } else if (
      provinsi_id != null &&
      kota_id == null &&
      kecamatan_id == null &&
      kelurahan_id == null
    ) {
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
    } else if (
      provinsi_id == null &&
      kota_id == null &&
      kecamatan_id == null &&
      kelurahan_id == null
    ) {
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

  static approve(id: number, created_by: number) {
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
}

export default UserManagementModel;
