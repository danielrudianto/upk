import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import DistrictModel from "../models/district.model";

class DistrictController {
    static getProvinceAutocomplete = (req: Request, res: Response) => {
        const val_result = validationResult(req);
        if(!val_result.isEmpty()){
            return res.status(500).send(val_result.array()[0].msg);
        }

        //    Get the following data to proceed province autocomplete
        //    1. Keyword

        const keyword = (!req.query.keyword) ? "" : req.query.keyword?.toString();
        DistrictModel.getProvince(keyword).then(result => {
            return res.status(200).send(result);
        }).catch(error => {
            console.error(`[error]: Get province autocomplete ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
        })
    }

    static getCityAutocomplete = (req: Request, res: Response) => {
        const val_result = validationResult(req);
        if(!val_result.isEmpty()){
            return res.status(500).send(val_result.array()[0].msg);
        }

        //    Get the following data to proceed kota autocomplete
        //    1. Keyword
        //    2. ID Provinsi

        const id = parseInt(req.params.province_id);
        const keyword = (!req.query.keyword) ? "" : req.query.keyword?.toString();
        if(keyword.length < 3){
            return res.status(500).send("Mohon masukkan 3 karakter atau lebih.");
        }

        DistrictModel.fetchById(id).then(district => {
            if(district == null || district.kota_id != null || district.kecamatan_id != null || district.kelurahan_id != null){
                return res.status(404).send("Provinsi tidak ditemukan.");
            }

            DistrictModel.getCity(keyword, district.provinsi_id!).then(result => {
                return res.status(200).send(result);
            }).catch(error => {
                console.error(`[error]: Get city autocomplete ${new Date()}`);
                console.error(`[error]: ${error}`);

                return res.status(500).send(error);
            })
        })
    }

    static getKecamatanAutocomplete = (req: Request, res: Response) => {
        const val_result = validationResult(req);
        if(!val_result.isEmpty()){
            return res.status(500).send(val_result.array()[0].msg);
        }

        //    Get the following data to proceed kecamatan autocomplete
        //    1. Keyword
        //    2. ID Kota

        const id = parseInt(req.params.city_id);
        const keyword = (!req.query.keyword) ? "" : req.query.keyword?.toString();
        if(keyword.length < 2){
            return res.status(500).send("Mohon masukkan 2 karakter atau lebih.");
        }

        DistrictModel.fetchById(id).then(district => {
            if(district == null || district.kecamatan_id != null || district.kelurahan_id != null){
                return res.status(404).send("Kota tidak ditemukan.");
            }

            DistrictModel.getKecamatan(keyword, district.provinsi_id!, district.kota_id!).then(result => {
                return res.status(200).send(result);
            }).catch(error => {
                console.error(`[error]: Get kecamatan autocomplete ${new Date()}`);
                console.error(`[error]: ${error}`);

                return res.status(500).send(error);
            })
        })
    };

    static getKelurahanAutocomplete = (req: Request, res: Response) => {
        const val_result = validationResult(req);
        if(!val_result.isEmpty()){
            return res.status(500).send(val_result.array()[0].msg);
        }

        //    Get the following data to proceed kelurahan autocomplete
        //    1. Keyword
        //    2. ID Kecamatan

        const id = parseInt(req.params.kecamatan_id);
        const keyword = (!req.query.keyword) ? "" : req.query.keyword?.toString();
        if(keyword.length < 2){
            return res.status(500).send("Mohon masukkan 2 karakter atau lebih.");
        }

        DistrictModel.fetchById(id).then(district => {
            if(district == null || district.kelurahan_id != null){
                return res.status(404).send("Kecamatan tidak ditemukan.");
            }

            DistrictModel.getKelurahan(keyword, district.provinsi_id!, district.kota_id!, district.kecamatan_id!).then(result => {
                return res.status(200).send(result);
            }).catch(error => {
                console.error(`[error]: Get kelurahan autocomplete ${new Date()}`);
                console.error(`[error]: ${error}`);

                return res.status(500).send(error);
            })
        })
    }
}

export default DistrictController;