import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DistrictModel {
  static getById(id: number) {
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
}

export default DistrictModel;
