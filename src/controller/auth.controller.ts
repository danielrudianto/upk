import { compare, hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import DistrictModel from "../models/district.model";
import UserModel from "../models/user.model.ts";

import firebase from '../helper/firebase.helper';
import { sign, verify } from "jsonwebtoken";
import UserTokenModel from "../models/user_token.model";

class authController {
    static register = (req: Request, res: Response, next: NextFunction) => {
        // Get the following data to proceed registration
        // 1. NIK
        // 2. Phone number (format: 08XXXXXXXX or 628XXXXXXX)
        // 3. Name
        // 4. Password
        // 5. Kelurahan ID
        // 6. Gender
        // 7. Date of birth
    
        // Check if phone number or NIK has been registered
        const phone_number = req.body.phone_number;
        let formatted_phone_number = "";
    
        const nik = req.body.nik.toString();
        const name = req.body.name;
    
        switch(phone_number.substring(0, 2)){
            case "08":
                formatted_phone_number = "62" + phone_number.substring(1);
                break;
            case "62":
                formatted_phone_number = phone_number;
                break;
            default: 
                return res.status(500).send("Format nomor telepon tidak dikenal.")
        }
    
        const user_by_nik = UserModel.getUserByNIK(nik);
        const user_by_phone_number = UserModel.getUserByPhoneNumber(formatted_phone_number);
    
        if(user_by_nik != null || user_by_phone_number != null){
            return res.status(500).send("NIK atau nomor telepon sudah terdaftar.");
        }
    
        // Validating NIK number
        // 1. Validating Date of Birth
        // 2. Validating Location
    
        const _provinsi_id = nik.substring(0, 2);
        const _city_id = nik.substring(2,4);
        const _kecamatan_id = nik.substring(4, 6);
        const district_id = parseInt(req.body.kelurahan_id);
        
        const _date_dob = (parseInt(nik.substring(6, 8)) > 40) ? (parseInt(nik.substring(6, 8)) - 40) : parseInt(nik.substring(6, 8));
        const _gender = (parseInt(nik.substring(6, 8)) > 40) ? "F" : "M";
        const _month_dob = parseInt(nik.substring(8, 10));
        const _year_dob = parseInt(nik.substring(10,12));
    
        // Assuming has to be 18 years old to register
        // At minimum
        const year = parseInt((new Date()).getFullYear().toString().substring(0, 2));
        const minimum = year - 18;
        const year_dob = (_year_dob > minimum) ? _year_dob : (2000 + _year_dob);
    
        const dob_input = new Date(req.body.date_of_birth);
        dob_input.setHours(8, 0, 0, 0);
        dob_input.setDate(dob_input.getDate() - 1);
    
        const dob = new Date(year_dob, _month_dob - 1, _date_dob, 8, 0, 0, 0);
    
        // If date of birth mentioned in NIK and field is different
        // Return error
        if(dob.getTime() != dob_input.getTime()){
            return res.status(500).send("Format NIK tidak dikenal.");
        }
    
        // If gender mentioned in NIK and field is different
        // Return error
        const gender = req.body.gender;
        if(_gender != gender){
            return res.status(500).send("Format NIK tidak dikenal.");
        }
    
        const password = req.body.password;
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const regex = new RegExp(pattern, 'g');
        if(!regex.test(password)){
            return res.status(500).send("Password tidak sesuai kriteria.")
        }
    
        // Comparing NIK based location with filled location
        DistrictModel.getById(district_id).then(async(result) => {
            if(result == null){
                return res.status(404).send("Kelurahan tidak ditemukan.");
            }
    
            if(result.provinsi_id == _provinsi_id && result.kota_id == _city_id && result.kecamatan_id == _kecamatan_id){
                const hashedPassword = await hash(password, 12);
                if(result?.provinsi_id == _provinsi_id && result.kota_id == _city_id && result.kecamatan_id == _kecamatan_id){
                    const user = new UserModel(name, nik, phone_number, district_id, hashedPassword, gender);
                    user.create().then(result => {
                        firebase.auth().createUser({
                            uid: result.uid,
                            phoneNumber: result.phone_number,
                            displayName: result.name,
                            password: password,
                            disabled: false,
                        }).then(() => {
                            return res.status(201).send("Pendaftaran pengguna berhasil.");
                        }).catch(error => {
                            console.error(`[error]: Gagal registrasi - Firebase ${new Date()}`)
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                        })
                    }).catch(error => {
                        console.error(`[error]: Gagal registrasi ${new Date()}`)
                        console.error(`[error]: ${error}`);
                        
                        return res.status(500).send(error);
                    })
                } else {
                    return res.status(500).send("Format NIK tidak dikenal. Mohon isikan lokasi sesuai dengan KTP terdaftar.");
                }
            } else {
    
            }
        })
    }

    static login = (req: Request, res: Response, next: NextFunction) => {
        //
        //    Get the following data to proceed login
        //    1. Phone number
        //    2. Password
        //
        const phone_number = req.body.phone_number;
        let formatted_phone_number = "";

        switch(phone_number.substring(0, 2)){
            case "08":
                formatted_phone_number = "62" + phone_number.substring(1);
                break;
            case "62":
                formatted_phone_number = phone_number;
                break;
            default: 
                return res.status(500).send("Format nomor telepon tidak dikenal.")
        }
        
        UserModel.getUserByPhoneNumber(formatted_phone_number).then(async(result) => {
            if(result == null){
                return res.status(404).send("Nomor telepon atau password salah, mohon periksa kembali.");
            }
            
            if(!await compare(req.body.password.toString(), result.password)){
                return res.status(404).send("Nomor telepon atau password salah, mohon periksa kembali."); 
            } 
    
            const expiration = new Date();
            expiration.setTime(expiration.getTime() + parseInt(process.env.expiration!) * 60 * 60 * 1000);
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
                    expiresIn: `24h`
                }
            )
    
            return res.status(200).send({
                token: token,
                expiration: expiration.getTime(),
                user: {
                    name: result.name,
                    district: result.district.name,
                    phone_number: result.phone_number,
                    nik: result.nik
                }
            })
        }).catch(error => {
            console.error(error);
            return res.status(500).send(error);
        })
    }

    static register_token = (req: Request, res: Response, next: NextFunction) => {
        const token = req.body.token;
        const userId = req.body.userId;

        // Check if other user has this token
        UserTokenModel.checkToken(token).then(result => {
            if(result?.user_id != null && result.user_id != userId){
                const userToken = new UserTokenModel(userId, token);
                userToken.registerToken().then(result => {
                    return res.status(201).send(result[1])
                }).catch(error => {
                    return res.status(500).send(error);
                });
            } else if(result?.user_id == userId){
                return res.status(200).send("Pengguna sudah terdaftar.");
            } else {
                const userToken = new UserTokenModel(userId, token);
                userToken.registerToken().then(result => {
                    return res.status(201).send(result[1])
                }).catch(error => {
                    return res.status(500).send(error);
                });
            }
        })
    }
}

export default authController;
