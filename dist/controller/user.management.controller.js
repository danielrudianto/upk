"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const district_model_1 = __importDefault(require("../models/district.model"));
const management_model_1 = __importDefault(require("../models/management.model"));
const user_model_ts_1 = __importDefault(require("../models/user.model.ts"));
class ManagementController {
}
ManagementController.submission = (req, res) => {
    // Route to create submission
    // To become part of management
    const user_id = req.body.userId;
    const management_level = req.body.management_level;
    const district_id = req.body.district_id;
    // Position
    // 1. Ketua
    // 2. Bendahara
    // 3. Sekretaris
    // 4. Staff
    // TODO
    // Validation
    const user_management = new management_model_1.default(user_id, management_level, district_id);
    user_management
        .create()
        .then((result) => {
        return res.status(201).send(result);
    })
        .catch((error) => {
        console.error(`[error]: Error creating user management ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
ManagementController.approve = (req, res) => {
    const user_id = req.body.userId;
    const id = req.body.request_id;
    management_model_1.default.fetchById(id)
        .then((submission) => {
        if (submission == null) {
            return res
                .status(404)
                .send("Pengajuan kepengurusan tidak ditemukan.");
        }
        if (submission.is_approved || submission.is_delete) {
            return res
                .status(410)
                .send("Pengajuan telah disetujui / dibatalkan.");
        }
        // TODO
        // Check whether the user is able to approve this request or not
        user_model_ts_1.default.fetchById(user_id)
            .then((user) => {
            if (user == null || user.user_management.length == 0) {
                return res
                    .status(400)
                    .send("Status kepengurusan tidak ditemukan.");
            }
            else {
                const user_district = user === null || user === void 0 ? void 0 : user.user_management[0].district_id;
                const user_management = user === null || user === void 0 ? void 0 : user.user_management[0].management_level;
                district_model_1.default.fetchById(user_district)
                    .then((district) => {
                    var _a, _b, _c, _d;
                    if (submission.management_level == 1) {
                        // Request to become a "Ketua" managemenent level
                        if (((_a = submission.district) === null || _a === void 0 ? void 0 : _a.provinsi_id) != null &&
                            submission.district.kota_id != null &&
                            submission.district.kecamatan_id != null &&
                            submission.district.kelurahan_id != null) {
                            // Submission to become the head of Kelurahan office
                            // Approved by head of kecamatan office
                            if (user_management == 1 &&
                                (district === null || district === void 0 ? void 0 : district.provinsi_id) ==
                                    submission.district.provinsi_id &&
                                district.kota_id == submission.district.kota_id &&
                                district.kecamatan_id ==
                                    submission.district.kecamatan_id) {
                                management_model_1.default.approve(id, user_id)
                                    .then((result) => {
                                    return res.status(201).send(result);
                                })
                                    .catch((error) => {
                                    console.error(`[error]: Error updating management submission ${new Date()}`);
                                    console.error(`[error]: ${error}`);
                                    return res.status(500).send(error);
                                });
                            }
                            else {
                                return res
                                    .status(400)
                                    .send("Pengguna tidak dapat melakukan approval terhadap request ini.");
                            }
                        }
                        else if (((_b = submission.district) === null || _b === void 0 ? void 0 : _b.provinsi_id) != null &&
                            submission.district.kota_id != null &&
                            submission.district.kecamatan_id != null &&
                            submission.district.kelurahan_id == null) {
                            // Submission to become the head of Kecamatan office.
                            // Approved by head of Kota office
                            if (user_management == 1 &&
                                (district === null || district === void 0 ? void 0 : district.provinsi_id) ==
                                    submission.district.provinsi_id &&
                                district.kota_id == submission.district.kota_id) {
                                management_model_1.default.approve(id, user_id)
                                    .then((result) => {
                                    return res.status(201).send(result);
                                })
                                    .catch((error) => {
                                    console.error(`[error]: Error updating management submission ${new Date()}`);
                                    console.error(`[error]: ${error}`);
                                    return res.status(500).send(error);
                                });
                            }
                            else {
                                return res
                                    .status(400)
                                    .send("Pengguna tidak dapat melakukan approval terhadap request ini.");
                            }
                        }
                        else if (((_c = submission.district) === null || _c === void 0 ? void 0 : _c.provinsi_id) != null &&
                            submission.district.kota_id != null &&
                            submission.district.kecamatan_id == null &&
                            submission.district.kelurahan_id == null) {
                            // Submission to become the head of Kota office.
                            // Approved by head of Province office
                            if (user_management == 1 &&
                                (district === null || district === void 0 ? void 0 : district.provinsi_id) ==
                                    submission.district.provinsi_id) {
                                management_model_1.default.approve(id, user_id)
                                    .then((result) => {
                                    return res.status(201).send(result);
                                })
                                    .catch((error) => {
                                    console.error(`[error]: Error updating management submission ${new Date()}`);
                                    console.error(`[error]: ${error}`);
                                    return res.status(500).send(error);
                                });
                            }
                            else {
                                return res
                                    .status(400)
                                    .send("Pengguna tidak dapat melakukan approval terhadap request ini.");
                            }
                        }
                        else if (((_d = submission.district) === null || _d === void 0 ? void 0 : _d.provinsi_id) != null &&
                            submission.district.kota_id == null &&
                            submission.district.kecamatan_id == null &&
                            submission.district.kelurahan_id == null) {
                            // Submission to become the head of Province office.
                            // Approved by head of Pusat office
                            if (user_management == 1 &&
                                (district === null || district === void 0 ? void 0 : district.provinsi_id) == null && (district === null || district === void 0 ? void 0 : district.kecamatan_id) == null && (district === null || district === void 0 ? void 0 : district.kelurahan_id) == null && (district === null || district === void 0 ? void 0 : district.kota_id) == null) {
                                management_model_1.default.approve(id, user_id)
                                    .then((result) => {
                                    return res.status(201).send(result);
                                })
                                    .catch((error) => {
                                    console.error(`[error]: Error updating management submission ${new Date()}`);
                                    console.error(`[error]: ${error}`);
                                    return res.status(500).send(error);
                                });
                            }
                            else {
                                return res
                                    .status(400)
                                    .send("Pengguna tidak dapat melakukan approval terhadap request ini.");
                            }
                        }
                    }
                    else {
                        // Request to become staff management level
                        if ((district === null || district === void 0 ? void 0 : district.provinsi_id) ==
                            submission.district.provinsi_id &&
                            (district === null || district === void 0 ? void 0 : district.kota_id) == submission.district.kota_id &&
                            (district === null || district === void 0 ? void 0 : district.kecamatan_id) ==
                                submission.district.kecamatan_id &&
                            (district === null || district === void 0 ? void 0 : district.kelurahan_id) ==
                                submission.district.kelurahan_id &&
                            user_management == 1) {
                            management_model_1.default.approve(id, user_id)
                                .then((result) => {
                                return res.status(201).send(result);
                            })
                                .catch((error) => {
                                console.error(`[error]: Error updating management submission ${new Date()}`);
                                console.error(`[error]: ${error}`);
                                return res.status(500).send(error);
                            });
                        }
                        else {
                            return res
                                .status(400)
                                .send("Pengguna tidak dapat melakukan approval terhadap request ini.");
                        }
                    }
                })
                    .catch((error) => {
                    console.error(`[error]: Error on fetching district ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
        })
            .catch((error) => {
            console.error(`[error]: Error on fetching user ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    })
        .catch((error) => {
        console.error(`[error]: Error createing user management ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
ManagementController.fetch = (req, res) => {
    const district_id = req.body.districtId;
    district_model_1.default.fetchById(district_id)
        .then((district) => {
        // Get the user's district account
        // Then get user management submission
        Promise.all([
            management_model_1.default.fetchStaffSubmission(district === null || district === void 0 ? void 0 : district.provinsi_id, district === null || district === void 0 ? void 0 : district.kota_id, district === null || district === void 0 ? void 0 : district.kecamatan_id, district === null || district === void 0 ? void 0 : district.kecamatan_id),
            management_model_1.default.fetchChildrenSubmission(district === null || district === void 0 ? void 0 : district.provinsi_id, district === null || district === void 0 ? void 0 : district.kota_id, district === null || district === void 0 ? void 0 : district.kecamatan_id, district === null || district === void 0 ? void 0 : district.kelurahan_id),
        ])
            .then((result) => {
            return res.status(200).send({
                staff: result[0],
                branch: result[1],
            });
        })
            .catch((error) => {
            console.error(`[error]: Error fetching submission ${new Date()}`);
            console.error(`[error]: ${error.toString()}`);
            return res.status(500).send(error);
        });
    })
        .catch((error) => {
        console.error(`[error]: Error fetching submission ${new Date()}`);
        console.error(`[error]: ${error.toString()}`);
        return res.status(500).send(error);
    });
};
ManagementController.fetchById = (req, res) => {
    const id = parseInt(req.params.requestId);
    management_model_1.default.fetchById(id).then(result => {
        return res.status(200).send(result);
    }).catch(error => {
        return res.status(500).send(error);
    });
};
exports.default = ManagementController;
