"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const district_model_1 = __importDefault(require("../models/district.model"));
class DistrictController {
}
DistrictController.getProvinceAutocomplete = (req, res) => {
    var _a;
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    //    Get the following data to proceed province autocomplete
    //    1. Keyword
    const keyword = (!req.query.keyword) ? "" : (_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.toString();
    district_model_1.default.getProvince(keyword).then(result => {
        return res.status(200).send(result);
    }).catch(error => {
        console.error(`[error]: Get province autocomplete ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
DistrictController.getCityAutocomplete = (req, res) => {
    var _a;
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    //    Get the following data to proceed kota autocomplete
    //    1. Keyword
    //    2. ID Provinsi
    const id = parseInt(req.params.province_id);
    const keyword = (!req.query.keyword) ? "" : (_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.toString();
    if (keyword.length < 3) {
        return res.status(500).send("Mohon masukkan 3 karakter atau lebih.");
    }
    district_model_1.default.getById(id).then(district => {
        if (district == null || district.kota_id != null || district.kecamatan_id != null || district.kelurahan_id != null) {
            return res.status(404).send("Provinsi tidak ditemukan.");
        }
        district_model_1.default.getCity(keyword, district.provinsi_id).then(result => {
            return res.status(200).send(result);
        }).catch(error => {
            console.error(`[error]: Get city autocomplete ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    });
};
DistrictController.getKecamatanAutocomplete = (req, res) => {
    var _a;
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    //    Get the following data to proceed kecamatan autocomplete
    //    1. Keyword
    //    2. ID Kota
    const id = parseInt(req.params.city_id);
    const keyword = (!req.query.keyword) ? "" : (_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.toString();
    if (keyword.length < 2) {
        return res.status(500).send("Mohon masukkan 2 karakter atau lebih.");
    }
    district_model_1.default.getById(id).then(district => {
        if (district == null || district.kecamatan_id != null || district.kelurahan_id != null) {
            return res.status(404).send("Kota tidak ditemukan.");
        }
        district_model_1.default.getKecamatan(keyword, district.provinsi_id, district.kota_id).then(result => {
            return res.status(200).send(result);
        }).catch(error => {
            console.error(`[error]: Get kecamatan autocomplete ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    });
};
DistrictController.getKelurahanAutocomplete = (req, res) => {
    var _a;
    const val_result = (0, express_validator_1.validationResult)(req);
    if (!val_result.isEmpty()) {
        return res.status(500).send(val_result.array()[0].msg);
    }
    //    Get the following data to proceed kelurahan autocomplete
    //    1. Keyword
    //    2. ID Kecamatan
    const id = parseInt(req.params.kecamatan_id);
    const keyword = (!req.query.keyword) ? "" : (_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.toString();
    if (keyword.length < 2) {
        return res.status(500).send("Mohon masukkan 2 karakter atau lebih.");
    }
    district_model_1.default.getById(id).then(district => {
        if (district == null || district.kelurahan_id != null) {
            return res.status(404).send("Kecamatan tidak ditemukan.");
        }
        district_model_1.default.getKelurahan(keyword, district.provinsi_id, district.kota_id, district.kecamatan_id).then(result => {
            return res.status(200).send(result);
        }).catch(error => {
            console.error(`[error]: Get kelurahan autocomplete ${new Date()}`);
            console.error(`[error]: ${error}`);
            return res.status(500).send(error);
        });
    });
};
exports.default = DistrictController;
