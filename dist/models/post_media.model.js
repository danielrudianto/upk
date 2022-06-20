"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PostMediaModel {
    constructor(name, url, post_id) {
        this.name = name;
        this.url = url;
        this.post_id = post_id;
    }
    create() {
        return prisma.post_media.create({
            data: {
                name: this.name,
                url: this.url,
                post_id: this.post_id
            }
        });
    }
}
exports.default = PostMediaModel;
