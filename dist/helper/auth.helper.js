"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
function authMiddleware(req, res, next) {
    var _a;
    let tokenHeader = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.toString();
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
    (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send(err);
        }
        else {
            const id = parseInt(decoded.id);
            prisma.user.findUnique({
                where: {
                    id: id
                }
            }).then(result => {
                if (result == null) {
                    return res.status(404).json({
                        auth: false,
                        message: "User tidak ditemukan.",
                    });
                }
                else {
                    req.body.userId = result.id;
                    next();
                }
            }).catch(() => {
                return res.status(401).send("Pengguna tidak terotorisasi.");
            });
        }
    });
}
exports.authMiddleware = authMiddleware;
