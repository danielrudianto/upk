import { PrismaClient } from "@prisma/client";
import PostModel from "./post.model";

const prisma = new PrismaClient();

class PostMediaModel {
  id?: number;
  name: string;
  url: string;
  post_id: number;
  post?: PostModel;

  constructor(name: string, url: string, post_id: number) {
    this.name = name;
    this.url = url;
    this.post_id = post_id;
  }

  create() {
    return prisma.post_media.create({
      data: {
        name: this.name,
        url: this.url,
        post_id: this.post_id,
      },
    });
  }
}

export default PostMediaModel;
