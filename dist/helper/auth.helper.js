"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const management_model_1 = __importDefault(require("../models/management.model"));
const user_model_ts_1 = __importDefault(require("../models/user.model.ts"));
const transaction_helper_1 = __importDefault(require("./transaction.helper"));
class authHelper {
}
authHelper.authMiddleware = (req, res, next) => {
    var _a;
    let tokenHeader = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.toString();
    if (!tokenHeader || tokenHeader.split(" ")[0] !== "Bearer") {
        return res.status(401).json({
            auth: false,
            message: "Format token tidak sesuai. Mohon coba login ulang.",
        });
    }
    let token = tokenHeader.split(" ")[1];
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
            if (decoded.hasOwnProperty("user_management_id")) {
                // Logged in user is from office account
                const id = parseInt(decoded.id);
                const user_management_id = decoded.user_management_id;
                transaction_helper_1.default.create([
                    user_model_ts_1.default.fetchById(id),
                    management_model_1.default.fetchById(user_management_id),
                ])
                    .then((result) => {
                    const user = result[0];
                    const management = result[1];
                    if (user == null) {
                        return res.status(401).send("Pengguna tidak ditemukan.");
                    }
                    if (management == null ||
                        !management.is_approved ||
                        management.is_delete) {
                        return res
                            .status(401)
                            .send("Status kepengurusan tidak ditemukan.");
                    }
                    req.body.userId = user.id;
                    req.body.districtId = management.district.id;
                    next();
                })
                    .catch((error) => {
                    console.error(`[error]: Login user personal ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(401).send("Pengguna tidak terotorisasi.");
                });
            }
            else {
                // Logged in user is from personal account
                const id = parseInt(decoded.id);
                user_model_ts_1.default.fetchById(id)
                    .then((user) => {
                    if (user == null) {
                        return res.status(401).send("Pengguna tidak ditemukan.");
                    }
                    else {
                        req.body.userId = user.id;
                        req.body.districtId = null;
                        next();
                    }
                })
                    .catch((error) => {
                    console.error(`[error]: Login user personal ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
        }
    });
};
exports.default = authHelper;
