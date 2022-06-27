"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const district_controller_1 = __importDefault(require("../controller/district.controller"));
const router = (0, express_1.Router)();
router.get("/provinsi", [
    (0, express_validator_1.query)("keyword")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Mohon masukkan 3 karakter atau lebih."),
], district_controller_1.default.getProvinceAutocomplete);
router.get("/kota/:province_id", [
    (0, express_validator_1.query)("keyword")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Mohon masukkan 3 karakter atau lebih."),
], district_controller_1.default.getCityAutocomplete);
router.get("/kecamatan/:city_id", [
    (0, express_validator_1.query)("keyword")
        .isString()
        .isLength({ min: 2 })
        .withMessage("Mohon masukkan 2 karakter atau lebih."),
], district_controller_1.default.getKecamatanAutocomplete);
router.get("/kelurahan/:kecamatan_id", [
    (0, express_validator_1.query)("keyword")
        .isString()
        .isLength({ min: 2 })
        .withMessage("Mohon masukkan 3 karakter atau lebih."),
], district_controller_1.default.getKelurahanAutocomplete);
exports.default = router;
