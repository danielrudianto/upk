import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Jwt, sign } from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/register", async(req, res, next) => {
    /* 
        Get the following data to proceed registration
        1. NIK
        2. Phone number (format: 08XXXXXXXX or 628XXXXXXX)
        3. Name
        4. Password
        5. Kelurahan ID
    */

    // Check if phone number or NIK has been registered
    const phone_number = req.body.phone_number;
    let formatted_phone_number = "";

    const nik = req.body.nik.toString();
    const name = req.body.name;

    switch(phone_number){
        case phone_number.substring(0, 2) == "08":
            formatted_phone_number = "62" + phone_number.substring(2, phone_number.length - 2);
            break;
        case phone_number.substring(0,3) == "62":
            formatted_phone_number = "62" + phone_number.substring(2, phone_number.length - 2);
            break;
        case phone_number.substring(0,1) == "8":
            formatted_phone_number = "62" + phone_number.substring(1, phone_number.length - 1);
            break;
        default: {
            return res.status(500).send("Format nomor telepon tidak dikenal.")
        }
    }

    const count = await prisma.user.count({
        where:{
            OR: [
                {
                    phone_number: formatted_phone_number
                },
                {
                    nik: nik
                }
            ]
        }
    });

    if(count > 0){
        return res.status(500).send("NIK atau nomor telepon sudah terdaftar.");
    }

    // Validating NIK number
    // 1. Validating Date of Birth
    // 2. Validating Location
    
    let _gender = null;

    const _provinsi_id = nik.substring(0, 2);
    const _city_id = nik.substring(2,4);
    const _kecamatan_id = nik.substring(4, 6);
    const _kelurahan_id = nik.substring(6, 8);
    
    const _date_dob = nik.substring(8, 10);
    const _month_dob = nik.substring(10, 12);
    const _year_dob = nik.substring(12,14);

    const dob_input = new Date(req.body.date_of_birth);
    dob_input.setHours(0, 0, 0, 0);

    const dob = new Date(_year_dob, _month_dob, _date_dob, 0, 0, 0, 0);

    // If date of birth mentioned in NIK and field is different
    // Return error
    if(dob.getTime() != dob_input.getTime()){
        return res.status(500).send("Format NIK tidak dikenal.");
    }

    // If date mentioned in NIK is more than 40, then gender is female
    if(_date_dob > 40 && _date_dob <= 71){
        _gender = 2;
    } else if(_date_dob > 0 && _date_dob <= 31) {
        _gender = 1;
    } else {
        return res.status(500).send("Format NIK tidak dikenal.");
    }

    // If gender mentioned in NIK and field is different
    // Return error
    const gender = req.body.gender;
    if(_gender != gender){
        return res.status(500).send("Format NIK tidak dikenal.");
    }

    const password = req.body.password;
    const pattern = /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[a-zA-Z]).{8,}/;
    const regex = new RegExp(pattern, 'g');
    if(!regex.test(password)){
        return res.status(500).send("Password tidak sesuai kriteria.")
    }

    const district_id = req.body.kelurahan_id;

    // Comparing NIK based location with filled location

    prisma.district.findUnique({
        where:{
            id: district_id
        },
        select: {
            provinsi_id: true,
            kota_id: true,
            kecamatan_id: true,
            kelurahan_id: true
        }
    }).then(async(result) => {
        if(result == null){
            return res.status(404).send("Kelurahan tidak ditemukan.");
        }

        const hashedPassword = await hash(password, 12);

        // Everything matches up
        if(result?.provinsi_id == _provinsi_id && result.kota_id == _city_id && result.kecamatan_id == _kecamatan_id && result.kelurahan_id == _kelurahan_id){
            prisma.user.create({
                data: {
                    name: name,
                    nik: nik,
                    phone_number: phone_number,
                    password: hashedPassword,
                    district_id: district_id
                }
            }).then(() => {
                res.status(201).send("Pendaftaran pengguna berhasil.");
            })
        } else {
            return res.status(500).send("Format NIK tidak dikenal.");
        }
    }).catch(error => {
        res.status(500).send(error);
    })
})

router.post("/login", (req, res, next) => {
    /*
        Get the following data to proceed login
        1. Phone number
        2. Password
    */
   const phone_number = req.body.phone_number;
   let formatted_phone_number = "";

    switch(phone_number){
        case phone_number.substring(0, 2) == "08":
            formatted_phone_number = "62" + phone_number.substring(2, phone_number.length - 2);
            break;
        case phone_number.substring(0,3) == "62":
            formatted_phone_number = "62" + phone_number.substring(2, phone_number.length - 2);
            break;
        case phone_number.substring(0,1) == "8":
            formatted_phone_number = "62" + phone_number.substring(1, phone_number.length - 1);
            break;
        default: {
            return res.status(500).send("Format nomor telepon tidak dikenal.")
        }
    }


    prisma.user.findFirst({
        where:{
            phone_number: formatted_phone_number
        },
        select: {
            id: true,
            name: true,
            district: {
                select: {
                    name: true
                }
            },
            password: true,
            phone_number: true,
            nik: true
        }
    }).then(async(result) => {
        if(result == null){
            return res.status(404).send("Nomor telepon atau password salah, mohon periksa kembali.");
        } else if(!await compare(result.password, req.body.password.toString())){
            return res.status(404).send("Nomor telepon atau password salah, mohon periksa kembali."); 
        } else {
            const expiration = new Date();
            expiration.setDate(expiration.getTime() + parseInt(process.env.expiration!) * 60 * 60 * 1000)
            const token = sign(
                {
                    id: result.id,
                    name: result.name,
                    district: result.district.name,
                    phone_number: result.phone_number,
                    nik: result.nik
                },
                process.env.TOKEN_KEY!,
                {
                    expiresIn: expiration.getTime()
                }
            )

            res.status(201).send({
                token: token,
                expiration: expiration.getTime(),
                user: {
                    name: result.name,
                    district: result.district.name,
                    phone_number: result.phone_number,
                    nik: result.nik
                }
            })
        }
    }).catch(error => {
        return res.status(500).send(error);
    })
})

export default router;