import { Request, Response } from "express";
import DistrictModel from "../models/district.model";
import UserManagementModel from "../models/management.model";

class ReportController {
  static fetchStructure = (req: Request, res: Response) => {
    if(req.query.district_id == undefined){
      const district_id = parseInt(req.body.districtId.toString());
      UserManagementModel.fetchStructureByDistrictId(district_id)
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(`[error]: Error fetching structure ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
    } else {
      const district_id = parseInt(req.query.district_id.toString());
      Promise.all([
        DistrictModel.fetchById(req.body.districtId),
        DistrictModel.fetchById(district_id)
      ]).then(result => {
        const user_district = result[0];
        const view_district = result[1];

        // User district must be more superior than the view district
        if(view_district == null) {
          return res.status(404).send("Area tidak ditemukan.");
        } else if(view_district?.kecamatan_id != null && view_district.kota_id != null && view_district.provinsi_id != null){
          // View kecamatan office info
          if((user_district?.provinsi_id == null && user_district?.kota_id == null && user_district?.kecamatan_id == null && user_district?.kelurahan_id == null) || (user_district.provinsi_id == view_district.provinsi_id && user_district.kota_id == view_district.kota_id && user_district.kecamatan_id != null) || (user_district.provinsi_id == view_district.provinsi_id && user_district.kota_id != null)){
            UserManagementModel.fetchStructureByDistrictId(district_id).then(result => {
              return res.status(200).send(result);
            }).catch(error => {
              console.error(`[error]: Error on fetching district info ${new Date()}`);
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
          } else {
            // If user is not in Kantor Pusat or in Related Kantor Provinsi
            return res.status(405).send("Autorisasi tidak diijinkan.");
          }
        } else if(view_district.kecamatan_id == null && view_district.kota_id != null && view_district.provinsi_id != null){
          // View kota office info
          if((user_district?.provinsi_id == null && user_district?.kota_id == null && user_district?.kecamatan_id == null && user_district?.kelurahan_id == null) || (user_district.provinsi_id == view_district.provinsi_id && user_district.kota_id == null)){
            UserManagementModel.fetchStructureByDistrictId(district_id).then(result => {
              return res.status(200).send(result);
            }).catch(error => {
              console.error(`[error]: Error on fetching district info ${new Date()}`);
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
          } else {
            // If user is not in Kantor Pusat or in Related Kantor Provinsi
            return res.status(405).send("Autorisasi tidak diijinkan.");
          }
        } else if(view_district.kecamatan_id == null && view_district.kota_id == null && view_district.provinsi_id != null){
          // View provinsi office info
          if(user_district?.provinsi_id == null && user_district?.kota_id == null && user_district?.kecamatan_id == null && user_district?.kelurahan_id == null){
            // If user is in Kantor Pusat
            UserManagementModel.fetchStructureByDistrictId(district_id).then(result => {
              return res.status(200).send(result);
            }).catch(error => {
              console.error(`[error]: Error on fetching district info ${new Date()}`);
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
          } else {
            // If user is not in Kantor Pusat
            return res.status(405).send("Autorisasi tidak diijinkan.");
          }
        }
      });
    }
    
  };

  static fetchBranchStructure = (req: Request, res: Response) => {
    const district_id = parseInt(req.body.districtId);
    DistrictModel.fetchById(district_id).then((district) => {
      if (district == null) {
        return res.status(404).send("Area tidak ditemukan.");
      } else if (district.provinsi_id == null) {
        // Kantor pusat
        if (
          req.params.child_1 == undefined &&
          req.params.child_2 == undefined
        ) {
          // First take
          // Return provinces
          DistrictModel.fetchChildren()
            .then((result) => {
              return res.status(200).send(result);
            })
            .catch((error) => {
              console.error(
                `[error]: Error fetching district offices ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        } else if (req.params.child_2 == undefined) {
          // Second take
          // Return cities in certain province
          DistrictModel.fetchChildren(req.params.child_1)
            .then((result) => {
              return res.status(200).send(result);
            })
            .catch((error) => {
              console.error(
                `[error]: Error fetching district offices ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        } else {
          // Third take
          // Return kecamatan in certain city
          DistrictModel.fetchChildren(req.params.child_1, req.params.child_2)
            .then((result) => {
              return res.status(200).send(result);
            })
            .catch((error) => {
              console.error(
                `[error]: Error fetching district offices ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        }
      } else if (district.kota_id == null) {
        // Kantor provinsi
        // First take
        // Return kota
        if (req.params.child_1 == undefined) {
          DistrictModel.fetchChildren(district.provinsi_id)
            .then((result) => {
              return res.status(200).send(result);
            })
            .catch((error) => {
              console.error(
                `[error]: Error fetching district offices ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        } else {
          DistrictModel.fetchChildren(district.provinsi_id, req.params.child_1)
            .then((result) => {
              return res.status(200).send(result);
            })
            .catch((error) => {
              console.error(
                `[error]: Error fetching district offices ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        }
      } else if (district.kecamatan_id == null) {
        // Kantor kota
        DistrictModel.fetchChildren(district.provinsi_id, district.kota_id)
          .then((result) => {
            return res.status(200).send(result);
          })
          .catch((error) => {
            console.error(
              `[error]: Error fetching district offices ${new Date()}`
            );
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
          });
      } else {
        // Kantor kecamatan
        return res.status(200).send([]);
      }
    });    
  };

  static fetchMemberCount = (req: Request, res: Response) => {
    const district_id = parseInt(req.body.districtId);
    DistrictModel.fetchById(district_id).then((district) => {
      if(district == null){
        return res.status(404).send("Area tidak ditemukan.");
      } else if(district?.provinsi_id == null){
        // Kantor pusat mengambil data member aktif
        UserManagementModel.fetchMemberCount().then(count => {
          return res.status(200).send({
            count: count
          });
        }).catch(error => {
          console.error(`[error]: Error fetching active member count: ${new Date()}`);
          console.error(`[error]: ${error}`);
          
          return res.status(500).send(error);
        })
      } else if(district.provinsi_id != null && district.kota_id == null){
        UserManagementModel.fetchMemberCount(district.provinsi_id).then(count => {
          return res.status(200).send({
            count: count
          });
        }).catch(error => {
          console.error(`[error]: Error fetching active member count: ${new Date()}`);
          console.error(`[error]: ${error}`);
          
          return res.status(500).send(error);
        })
      } else if(district.provinsi_id != null && district.kota_id != null && district.kecamatan_id == null){
        UserManagementModel.fetchMemberCount(district.provinsi_id, district.kota_id).then(count => {
          return res.status(200).send({
            count: count
          });
        }).catch(error => {
          console.error(`[error]: Error fetching active member count: ${new Date()}`);
          console.error(`[error]: ${error}`);
          
          return res.status(500).send(error);
        })
      } else {
        UserManagementModel.fetchMemberCount(district.provinsi_id, district.kota_id, district.kecamatan_id).then(count => {
          return res.status(200).send({
            count: count
          });
        }).catch(error => {
          console.error(`[error]: Error fetching active member count: ${new Date()}`);
          console.error(`[error]: ${error}`);

          return res.status(500).send(error);
        })
      }
    });
  };
}

export default ReportController;
