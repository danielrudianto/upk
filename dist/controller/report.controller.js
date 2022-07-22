"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const district_model_1 = __importDefault(require("../models/district.model"));
const management_model_1 = __importDefault(require("../models/management.model"));
class ReportController {
}
ReportController.fetchStructure = (req, res) => {
    const district_id = parseInt(req.body.districtId);
    management_model_1.default.fetchStructureByDistrictId(district_id)
        .then((result) => {
        return res.status(200).send(result);
    })
        .catch((error) => {
        console.error(`[error]: Error fetching structure ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
ReportController.fetchBranchStructure = (req, res) => {
    const district_id = parseInt(req.body.districtId);
    district_model_1.default.fetchById(district_id).then((district) => {
        if (district == null) {
            return res.status(404).send("Area tidak ditemukan.");
        }
        else if (district.provinsi_id == null) {
            // Kantor pusat
            if (req.params.child_1 == undefined &&
                req.params.child_2 == undefined) {
                // First take
                // Return provinces
                district_model_1.default.fetchChildren()
                    .then((result) => {
                    return res.status(200).send(result);
                })
                    .catch((error) => {
                    console.error(`[error]: Error fetching district offices ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
            else if (req.params.child_2 == undefined) {
                // Second take
                // Return cities in certain province
                district_model_1.default.fetchChildren(req.params.child_1)
                    .then((result) => {
                    return res.status(200).send(result);
                })
                    .catch((error) => {
                    console.error(`[error]: Error fetching district offices ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
            else {
                // Third take
                // Return kecamatan in certain city
                district_model_1.default.fetchChildren(req.params.child_1, req.params.child_2)
                    .then((result) => {
                    return res.status(200).send(result);
                })
                    .catch((error) => {
                    console.error(`[error]: Error fetching district offices ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
        }
        else if (district.kota_id == null) {
            // Kantor provinsi
            // First take
            // Return kota
            if (req.params.child_1 == undefined) {
                district_model_1.default.fetchChildren(district.provinsi_id)
                    .then((result) => {
                    return res.status(200).send(result);
                })
                    .catch((error) => {
                    console.error(`[error]: Error fetching district offices ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
            else {
                district_model_1.default.fetchChildren(district.provinsi_id, req.params.child_1)
                    .then((result) => {
                    return res.status(200).send(result);
                })
                    .catch((error) => {
                    console.error(`[error]: Error fetching district offices ${new Date()}`);
                    console.error(`[error]: ${error}`);
                    return res.status(500).send(error);
                });
            }
        }
        else if (district.kecamatan_id == null) {
            // Kantor kota
            district_model_1.default.fetchChildren(district.provinsi_id, district.kota_id)
                .then((result) => {
                return res.status(200).send(result);
            })
                .catch((error) => {
                console.error(`[error]: Error fetching district offices ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
        else {
            // Kantor kecamatan
            return res.status(200).send([]);
        }
    });
};
ReportController.fetchMemberCount = (req, res) => {
    const district_id = parseInt(req.body.districtId);
    district_model_1.default.fetchById(district_id).then((district) => {
        if (district == null) {
            return res.status(404).send("Area tidak ditemukan.");
        }
        else if ((district === null || district === void 0 ? void 0 : district.provinsi_id) == null) {
            // Kantor pusat mengambil data member aktif
            management_model_1.default.fetchMemberCount().then(count => {
                return res.status(200).send({
                    count: count
                });
            }).catch(error => {
                console.error(`[error]: Error fetching active member count: ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
        else if (district.provinsi_id != null && district.kota_id == null) {
            management_model_1.default.fetchMemberCount(district.provinsi_id).then(count => {
                return res.status(200).send({
                    count: count
                });
            }).catch(error => {
                console.error(`[error]: Error fetching active member count: ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
        else if (district.provinsi_id != null && district.kota_id != null && district.kecamatan_id == null) {
            management_model_1.default.fetchMemberCount(district.provinsi_id, district.kota_id).then(count => {
                return res.status(200).send({
                    count: count
                });
            }).catch(error => {
                console.error(`[error]: Error fetching active member count: ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
        else {
            management_model_1.default.fetchMemberCount(district.provinsi_id, district.kota_id, district.kecamatan_id).then(count => {
                return res.status(200).send({
                    count: count
                });
            }).catch(error => {
                console.error(`[error]: Error fetching active member count: ${new Date()}`);
                console.error(`[error]: ${error}`);
                return res.status(500).send(error);
            });
        }
    });
};
exports.default = ReportController;
