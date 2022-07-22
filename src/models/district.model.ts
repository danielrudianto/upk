import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DistrictModel {
  static fetchById(id: number) {
    return prisma.district.findUnique({
      where: {
        id: id,
      },
      select: {
        provinsi_id: true,
        kota_id: true,
        kecamatan_id: true,
        kelurahan_id: true,
        name: true,
      },
    });
  }

  static getProvince(keyword: string) {
    return prisma.district.findMany({
      where: {
        name: {
          contains: keyword,
        },
        kota_id: null,
        kecamatan_id: null,
        kelurahan_id: null,
        provinsi_id: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      skip: 0,
    });
  }

  static getCity(keyword: string, province_id: string) {
    return prisma.district.findMany({
      where: {
        name: {
          contains: keyword,
        },
        provinsi_id: province_id,
        NOT: {
          kota_id: null,
        },
        kecamatan_id: null,
        kelurahan_id: null,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      skip: 0,
    });
  }

  static getKecamatan(keyword: string, province_id: string, city_id: string) {
    return prisma.district.findMany({
      where: {
        name: {
          contains: keyword,
        },
        provinsi_id: province_id,
        kota_id: city_id,
        NOT: {
          kecamatan_id: null,
        },
        kelurahan_id: null,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      skip: 0,
    });
  }

  static getKelurahan(
    keyword: string,
    province_id: string,
    city_id: string,
    kecamatan_id: string
  ) {
    return prisma.district.findMany({
      where: {
        name: {
          contains: keyword,
        },
        provinsi_id: province_id,
        kota_id: city_id,
        kecamatan_id: kecamatan_id,
        NOT: {
          kelurahan_id: null,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      skip: 0,
    });
  }

  static fetchProfileById(id: number) {
    return prisma.$transaction([
      prisma.district.findUnique({
        where: {
          id: id,
        },
        select: {
          profile_image_url: true,
          provinsi_id: true,
          kota_id: true,
          kecamatan_id: true,
          kelurahan_id: true,
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
    ]);
  }

  static fetchChildren(provinsi_id: string | null = null, kota_id: string | null = null, kecamatan_id: string | null = null){
    if(provinsi_id != null && kota_id == null) {
      return prisma.district.findMany({
        where:{
          AND: [
            {
              provinsi_id: provinsi_id
            },
            {
              kota_id: {
                not: null
              }
            }, 
            {
              kecamatan_id: null
            },
            {
              kelurahan_id: null
            }
          ]
        },
        select: {
          id: true,
          name: true,
          profile_image_url: true,
          provinsi_id: true,
          kota_id: true,
          kecamatan_id: true,
        },
        orderBy: {
          name: "asc"
        }
      })
    } else if(provinsi_id != null && kota_id != null && kecamatan_id == null){
      return prisma.district.findMany({
        where:{
          AND: [
            {
              provinsi_id: provinsi_id
            },
            {
              kota_id: kota_id
            }, 
            {
              kecamatan_id: {
                not: null
              }
            },
            {
              kelurahan_id: null
            }
          ]
        },
        select: {
          id: true,
          name: true,
          profile_image_url: true,
          provinsi_id: true,
          kota_id: true,
          kecamatan_id: true,
        },
        orderBy: {
          name: "asc"
        }
      })
    } else {
      return prisma.district.findMany({
        where:{
          AND: [
            {
              provinsi_id: {
                not: null
              }
            }, 
            {
              kota_id: null
            }, 
            {
              kecamatan_id: null
            },
            {
              kelurahan_id: null
            }
          ]
        },
        select: {
          id: true,
          name: true,
          profile_image_url: true,
          provinsi_id: true,
          kota_id: true,
          kecamatan_id: true,
        },
        orderBy: {
          name: "asc"
        }
      })
    }
  }

}

export default DistrictModel;
