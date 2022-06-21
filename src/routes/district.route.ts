import { Router } from "express";
import { query } from "express-validator";
import DistrictController from "../controller/district.controller";

const router = Router();

router.get(
    "/provinsi",
    [
        query("keyword").isString().isLength({ min: 3 }).withMessage("Mohon masukkan 3 karakter atau lebih.")
    ],
    DistrictController.getProvinceAutocomplete
);

router.get(
    "/kota/:province_id",
    [
        query("keyword").isString().isLength({ min: 3 }).withMessage("Mohon masukkan 3 karakter atau lebih.")
    ],
    DistrictController.getCityAutocomplete
);

router.get(
    "/kecamatan/:city_id", 
    [
        query("keyword").isString().isLength({ min: 2 }).withMessage("Mohon masukkan 2 karakter atau lebih.")
    ],
    DistrictController.getKecamatanAutocomplete
);

router.get(
    "/kelurahan/:kecamatan_id", 
    [
        query("keyword").isString().isLength({ min: 2 }).withMessage("Mohon masukkan 3 karakter atau lebih.")
    ],
    DistrictController.getKelurahanAutocomplete
);

export default router;