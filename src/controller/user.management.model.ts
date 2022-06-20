import { Request, Response } from "express";
import UserManagementModel from "../models/management.model";

class ManagementController {
    static submission = (req: Request, res: Response) => {
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

        const user_management = new UserManagementModel(user_id, management_level, district_id);
        user_management.create().then(result => {
            return res.status(201).send(result);
        }).catch(error => {
            return res.status(500).send(error);
        })
    }

    static approve = (req: Request, res: Response) => {
        const user_id = req.body.userId;
        // TODO
        // Check whether the user is able to approve this request or not
    }
}

export default ManagementController;