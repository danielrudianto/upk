"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    const id = req.body.id;
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
        user_model_ts_1.default.fetchById(user_id)
            .then((user) => {
            // Ensure that user exist and has administrator / superadministrator
            if (user != null && user.role > 0) {
            }
        })
            .catch((error) => {
            console.error(`[error]: Error approving user management ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    })
        .catch((error) => {
        console.error(`[error]: Error createing user management ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
    // TODO
    // Check whether the user is able to approve this request or not
};
exports.default = ManagementController;
