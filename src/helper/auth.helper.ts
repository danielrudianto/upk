import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import firebaseHelper from "./firebase.helper";

const prisma = new PrismaClient();

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    let tokenHeader = req.headers['authorization']?.toString();
    if (!tokenHeader || tokenHeader.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({
            auth: false,
            message: "Format token tidak sesuai. Mohon coba login ulang.",
        });
    }

    let token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            auth: false,
            message: "Token tidak tersedia. Mohon coba login ulang.",
        });
    }

    firebaseHelper.auth().verifyIdToken(token).then(decodedToken => {
        const uid = decodedToken.uid;
        prisma.user.findUnique({
            where: {
                uid: uid
            }
        }).then(result => {
            if(result == null){
                return res.status(404).json({
                    auth: false,
                    message: "User tidak ditemukan.",
                });
            } else {
                req.body.userId = result?.id
                next();
            }
            
        }).catch(() => {
            return res.status(401).send("Pengguna tidak terotorisasi.");
        })
    }).catch(error => {
        return res.status(401).send(error);
    })
}