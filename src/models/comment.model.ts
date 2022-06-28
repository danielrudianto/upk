import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

class CommentModel {
  id?: number;
  uid?: string;
  comment: string;
  post_id: number;
  created_by: number;
  created_at: Date;
  is_delete?: boolean;
  district_id: number | null;

  constructor(
    comment: string,
    post_id: number,
    created_by: number,
    created_by_district_id: number | null = null
  ) {
    this.comment = comment;
    this.post_id = post_id;
    this.created_by = created_by;
    this.district_id = created_by_district_id;
    this.created_at = new Date();
  }

  createComment() {
    return prisma.post_comment.create({
      data: {
        created_by: this.created_by,
        comment: this.comment,
        post_id: this.post_id,
        district_id: this.district_id,
      },
      select: {
        id: true,
        comment: true,
        user: {
          select: {
            profile_image_url: true,
            uid: true,
            name: true,
          },
        },
        district: {
          select: {
            name: true,
          },
        },
        created_at: true,
      },
    });
  }

  static fetchById(id: number){
    return prisma.post_comment.findUnique({
      where:{
        id: id
      }
    })
  }

  static deleteById(id: number){
    return prisma.post_comment.update({
      where:{
        id: id
      },
      data: {
        is_delete: true,
        deleted_at: new Date()
      }
    });
  }

  static fetchByPostUID(uid: string, offset: number = 0, limit: number = 10) {
    return prisma.post_comment.findMany({
      where: {
        post: {
          uid: uid,
        },
        is_delete: false,
      },
      select: {
        comment: true,
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
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
      skip: offset,
    });
  }
}

export default CommentModel;
