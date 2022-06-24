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
        district: {
          select: {
            id: true,
            name: true,
          },
        },
        management_level: true,
        is_approved: true,
        is_delete: true,
      },
    });
  }
}

export default UserManagementModel;
