"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
class PostModel {
    constructor(caption, created_by, created_by_district_id = null) {
        this.caption = caption;
        this.created_by = created_by;
        this.created_at = new Date();
        this.district_id = created_by_district_id;
    }
    create() {
        return prisma.post.create({
            data: {
                caption: this.caption,
                created_by: this.created_by,
                created_at: this.created_at,
                uid: (0, uuid_1.v4)(),
                district_id: this.district_id,
            },
        });
    }
    static fetchPostByUID(uid) {
        return prisma.post.findUnique({
            where: {
                uid: uid,
            },
            select: {
                id: true,
                is_delete: true,
                user: {
                    select: {
                        profile_image_url: true,
                        name: true,
                        uid: true,
                    },
                },
                created_at: true,
                post_media: {
                    select: {
                        url: true,
                        name: true,
                    },
                },
            },
        });
    }
    static delete(id) {
        return prisma.post.update({
            where: {
                id: id,
            },
            data: {
                is_delete: true,
                deleted_at: new Date(),
            },
        });
    }
    static fetch(last_post_id = null) {
        if (last_post_id == null) {
            // Start from the beginning
            return prisma.post.findMany({
                select: {
                    uid: true,
                    caption: true,
                    user: {
                        select: {
                            name: true,
                            uid: true,
                            profile_image_url: true
                        },
                    },
                    post_media: {
                        select: {
                            url: true,
                        },
                    },
                    post_comment: {
                        orderBy: {
                            created_at: "desc",
                        },
                        where: {
                            is_delete: false,
                        },
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    profile_image_url: true,
                                    uid: true,
                                },
                            },
                            comment: true,
                        },
                        take: 5,
                        skip: 0,
                    },
                    district: {
                        select: {
                            name: true,
                        },
                    },
                    reaction: {
                        select: {
                            id: true,
                            created_by: true,
                        },
                        where: {
                            is_delete: false,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
                where: {
                    is_delete: false,
                },
                skip: 0,
                take: 10,
            });
        }
        else {
            return prisma.post.findMany({
                where: {
                    id: {
                        gt: last_post_id,
                    },
                    is_delete: false,
                },
                select: {
                    uid: true,
                    caption: true,
                    user: {
                        select: {
                            name: true,
                            uid: true,
                            profile_image_url: true,
                        },
                    },
                    post_media: {
                        select: {
                            url: true,
                        },
                    },
                    post_comment: {
                        orderBy: {
                            created_at: "desc",
                        },
                        where: {
                            is_delete: false,
                        },
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    profile_image_url: true,
                                    uid: true,
                                },
                            },
                            comment: true,
                        },
                        take: 5,
                        skip: 0,
                    },
                    reaction: {
                        select: {
                            id: true,
                            created_by: true,
                        },
                        where: {
                            is_delete: false,
                        },
                    },
                    district: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
                skip: 0,
                take: 10,
            });
        }
    }
}
exports.default = PostModel;
