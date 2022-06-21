"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const management_model_1 = __importDefault(require("../models/management.model"));
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
    user_management.create().then(result => {
        return res.status(201).send(result);
    }).catch(error => {
        return res.status(500).send(error);
    });
};
ManagementController.approve = (req, res) => {
    const user_id = req.body.userId;
    // TODO
    // Check whether the user is able to approve this request or not
};
exports.default = ManagementController;
