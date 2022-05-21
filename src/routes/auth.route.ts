import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get("/register", (req, res, next) => {
    /* 
        Get the following data to proceed registration
        1. NIK
        2. Phone number (format: 08XXXXXXXX)
        3. Name
        4. Password
    */
   
    
})

router.get("/login", (req, res, next) => {
    /*
        Get the following data to proceed login
        1. NIK
        2. Password
    */
})

export default router;