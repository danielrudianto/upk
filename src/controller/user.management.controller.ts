import { Request, Response } from "express";
import UserManagementModel from "../models/management.model";
import UserModel from "../models/user.model.ts";

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
        const id = req.body.id;

        UserManagementModel.fetchById(id).then(submission => {
            if(submission == null){
                return res.status(404).send("Pengajuan kepengurusan tidak ditemukan.");
            }

            if(submission.is_approved || submission.is_delete){
                return res.status(410).send("Pengajuan telah disetujui / dibatalkan.");
            }

            UserModel.fetchById(user_id).then(user => {
                // Ensure that user exist and has administrator / superadministrator
                if(user != null && user.role > 0){
    
                }
            })
        })
        
        // TODO
        // Check whether the user is able to approve this request or not
    }
    
}

export default ManagementController;