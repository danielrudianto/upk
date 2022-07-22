"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const firebase_helper_1 = __importDefault(require("../helper/firebase.helper"));
const media_helper_1 = __importDefault(require("../helper/media.helper"));
const district_model_1 = __importDefault(require("../models/district.model"));
const user_model_ts_1 = __importDefault(require("../models/user.model.ts"));
class UserController {
}
UserController.update = (req, res) => {
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    const name = req.body.name;
    const uid = req.body.uid;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    let formatted_phone_number = phone_number;
    switch (phone_number.substring(0, 2)) {
        case "08":
            formatted_phone_number = "62" + phone_number.substring(1);
            break;
        case "62":
            formatted_phone_number = phone_number;
            break;
        default:
            return res.status(500).send("Format nomor telepon tidak dikenal.");
    }
    if (!req.body.profile_image) {
        // User do not update profile picture
        user_model_ts_1.default.fetchByUID(uid)
            .then((user) => {
            if (user == null) {
                return res.status(404).send("Pengguna tidak ditemukan.");
            }
            else {
                const userModel = new user_model_ts_1.default(name, user.nik, formatted_phone_number, user.district_id, (0, bcrypt_1.hashSync)(password, 12), user.gender, user.profile_image_url, user.id);
                userModel.update().then((update_result) => {
                    firebase_helper_1.default.auth().updateUser(update_result.uid, {
                        phoneNumber: `+${formatted_phone_number}`,
                        displayName: name,
                        password: password,
                    });
                });
            }
        })
            .catch((error) => {
            console.error(`[error]: Error fetching profile ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }
    else if (req.body.profile_image == null) {
        user_model_ts_1.default.fetchByUID(uid)
            .then((user) => {
            if (user == null) {
                return res.status(404).send("Pengguna tidak ditemukan.");
            }
            else {
                const userModel = new user_model_ts_1.default(name, user.nik, formatted_phone_number, user.district_id, (0, bcrypt_1.hashSync)(password, 12), user.gender, null, user.id);
                userModel.update().then((update_result) => {
                    // Update firebase user
                    firebase_helper_1.default
                        .auth()
                        .updateUser(update_result.uid, {
                        phoneNumber: `+${formatted_phone_number}`,
                        displayName: name,
                        password: password,
                    })
                        .then(() => {
                        // Update firebase image URL
                        const bucket = firebase_helper_1.default
                            .storage()
                            .bucket(process.env.USER_STORAGE_REFERENCE);
                        bucket
                            .file(update_result.profile_image_url)
                            .delete()
                            .then(() => {
                            return res.status(200).send(update_result);
                        })
                            .catch((error) => {
                            console.error(`[error]: Error updating firebase profile ${new Date()}`);
                            console.error(`[error]: ${error}`);
                            return res.status(500).send(error);
                        });
                    })
                        .catch((error) => {
                        console.error(`[error]: Error updating firebase profile ${new Date()}`);
                        console.error(`[error]: ${error}`);
                        return res.status(500).send(error);
                    });
                });
            }
        })
            .catch((error) => {
            console.error(`[error]: Error fetching profile ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }
    else {
        user_model_ts_1.default.fetchByUID(uid)
            .then((user) => {
            if (user == null) {
                return res.status(404).send("Pengguna tidak ditemukan.");
            }
            else {
                const file = media_helper_1.default.toFile(req.body.profile_image);
                const file_name = req.body.profile_image_name;
                const names = file_name.split(".");
                const extension = names[names.length - 1];
                const new_file_name = (0, uuid_1.v4)();
                const full_file_name = `${new_file_name}.${extension}`;
                const bucket = firebase_helper_1.default
                    .storage()
                    .bucket(process.env.USER_STORAGE_REFERENCE);
                const promises = [];
                if (user.profile_image_url != null) {
                    promises.push(bucket.file(user.profile_image_url).delete());
                }
                promises.push(bucket.file(full_file_name).save(file));
                const userModel = new user_model_ts_1.default(name, user.nik, formatted_phone_number, user.district_id, (0, bcrypt_1.hashSync)(password, 12), user.gender, full_file_name, user.id);
                promises.push(userModel.update());
                promises.push(firebase_helper_1.default.auth().updateUser(uid, {
                    phoneNumber: `+${formatted_phone_number}`,
                    displayName: name,
                    password: password,
                }));
                Promise.all(promises).then((update_result) => {
                    // Sudah update mau relogin / ganti token saja / Update saat itu saja?
                }).catch(error => {
                    console.error(`[error]: Error updating firebase profile ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
        })
            .catch((error) => {
            console.error(`[error]: Error fetching profile ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }
};
UserController.fetch = (req, res) => {
    const user_id = req.body.userId;
    const district_id = req.body.districtId;
    if (district_id != null) {
        // Fetch office profile
        district_model_1.default.fetchProfileById(district_id).then(result => {
            return res.status(200).send(Object.assign(Object.assign({}, result[0]), { "user_subscription": undefined, "follower": result[1], "following": result[2], "post": result[3] }));
        }).catch(error => {
            console.error(`[error]: Failed to fetch profile ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }
    else {
        user_model_ts_1.default.fetchProfileById(user_id).then(result => {
            var _a;
            return res.status(200).send(Object.assign(Object.assign({}, result[0]), { "user_subscription": undefined, "is_active": (result[0] == null || ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.user_subscription.length) == 0) ? false : true, "member": result[4] > 0, "follower": result[1], "following": result[2], "post": result[3] }));
        }).catch(error => {
            console.error(`[error]: Failed to fetch profile ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    }
};
exports.default = UserController;
