import { Router } from "express";
import DistrictController from "../controller/district.controller";

const router = Router();

router.get("/provinsi", DistrictController.getProvinceAutocomplete);
router.get("/kota/:province_id", DistrictController.getCityAutocomplete);
router.get("/kecamatan/:city_id", DistrictController.getKecamatanAutocomplete);
router.get("/kelurahan/:kecamatan_id", DistrictController.getKelurahanAutocomplete)

export default router;