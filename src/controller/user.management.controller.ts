import { Request, Response } from "express";
import DistrictModel from "../models/district.model";
import UserManagementModel from "../models/management.model";
import UserModel from "../models/user.model.ts";

class ManagementController {
  static submission = (req: Request, res: Response) => {
    // Route to create submission
    // To become part of management
    const user_id = req.body.userId;
    const management_level = req.body.management_level;
    const district_id = req.body.district_id;

    // Position
    // 1. Ketua
    // 2. Bendahara
    // 3. Sekretaris
    // 4. Staff

    // TODO
    // Validation

    const user_management = new UserManagementModel(
      user_id,
      management_level,
      district_id
    );
    user_management
      .create()
      .then((result) => {
        return res.status(201).send(result);
      })
      .catch((error) => {
        console.error(`[error]: Error creating user management ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };

  static approve = (req: Request, res: Response) => {
    const user_id = req.body.userId;
    const id = req.body.request_id;

    UserManagementModel.fetchById(id)
      .then((submission) => {
        if (submission == null) {
          return res
            .status(404)
            .send("Pengajuan kepengurusan tidak ditemukan.");
        }

        if (submission.is_approved || submission.is_delete) {
          return res
            .status(410)
            .send("Pengajuan telah disetujui / dibatalkan.");
        }

        // TODO
        // Check whether the user is able to approve this request or not
        UserModel.fetchById(user_id)
          .then((user) => {
            if (user == null || user.user_management.length == 0) {
              return res
                .status(400)
                .send("Status kepengurusan tidak ditemukan.");
            } else {
              const user_district = user?.user_management[0].district_id;
              const user_management = user?.user_management[0].management_level;

              DistrictModel.getById(user_district!)
                .then((district) => {
                  if (submission.management_level == 1) {
                    // Request to become a "Ketua" managemenent level
                    if (
                      submission.district?.provinsi_id != null &&
                      submission.district.kota_id != null &&
                      submission.district.kecamatan_id != null &&
                      submission.district.kelurahan_id != null
                    ) {
                      // Submission to become the head of Kelurahan office
                      // Approved by head of kecamatan office
                      if (
                        user_management == 1 &&
                        district?.provinsi_id ==
                          submission.district.provinsi_id &&
                        district.kota_id == submission.district.kota_id &&
                        district.kecamatan_id ==
                          submission.district.kecamatan_id
                      ) {
                        UserManagementModel.approve(id, user_id)
                          .then((result) => {
                            return res.status(201).send(result);
                          })
                          .catch((error) => {
                            console.error(
                              `[error]: Error updating management submission ${new Date()}`
                            );
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                          });
                      } else {
                        return res
                          .status(400)
                          .send(
                            "Pengguna tidak dapat melakukan approval terhadap request ini."
                          );
                      }
                    } else if (
                      submission.district?.provinsi_id != null &&
                      submission.district.kota_id != null &&
                      submission.district.kecamatan_id != null &&
                      submission.district.kelurahan_id == null
                    ) {
                      // Submission to become the head of Kecamatan office.
                      // Approved by head of Kota office
                      if (
                        user_management == 1 &&
                        district?.provinsi_id ==
                          submission.district.provinsi_id &&
                        district.kota_id == submission.district.kota_id
                      ) {
                        UserManagementModel.approve(id, user_id)
                          .then((result) => {
                            return res.status(201).send(result);
                          })
                          .catch((error) => {
                            console.error(
                              `[error]: Error updating management submission ${new Date()}`
                            );
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                          });
                      } else {
                        return res
                          .status(400)
                          .send(
                            "Pengguna tidak dapat melakukan approval terhadap request ini."
                          );
                      }
                    } else if (
                      submission.district?.provinsi_id != null &&
                      submission.district.kota_id != null &&
                      submission.district.kecamatan_id == null &&
                      submission.district.kelurahan_id == null
                    ) {
                      // Submission to become the head of Kota office.
                      // Approved by head of Province office
                      if (
                        user_management == 1 &&
                        district?.provinsi_id ==
                          submission.district.provinsi_id
                      ) {
                        UserManagementModel.approve(id, user_id)
                          .then((result) => {
                            return res.status(201).send(result);
                          })
                          .catch((error) => {
                            console.error(
                              `[error]: Error updating management submission ${new Date()}`
                            );
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                          });
                      } else {
                        return res
                          .status(400)
                          .send(
                            "Pengguna tidak dapat melakukan approval terhadap request ini."
                          );
                      }
                    } else if (
                      submission.district?.provinsi_id != null &&
                      submission.district.kota_id == null &&
                      submission.district.kecamatan_id == null &&
                      submission.district.kelurahan_id == null
                    ) {
                      // Submission to become the head of Province office.
                      // Approved by head of Pusat office
                      if (
                        user_management == 1 &&
                        district?.provinsi_id == null && district?.kecamatan_id == null && district?.kelurahan_id == null && district?.kota_id == null
                      ) {
                        UserManagementModel.approve(id, user_id)
                          .then((result) => {
                            return res.status(201).send(result);
                          })
                          .catch((error) => {
                            console.error(
                              `[error]: Error updating management submission ${new Date()}`
                            );
                            console.error(`[error]: ${error}`);

                            return res.status(500).send(error);
                          });
                      } else {
                        return res
                          .status(400)
                          .send(
                            "Pengguna tidak dapat melakukan approval terhadap request ini."
                          );
                      }
                    }
                  } else {
                    // Request to become staff management level
                    if (
                      district?.provinsi_id ==
                        submission.district.provinsi_id &&
                      district?.kota_id == submission.district.kota_id &&
                      district?.kecamatan_id ==
                        submission.district.kecamatan_id &&
                      district?.kelurahan_id ==
                        submission.district.kelurahan_id &&
                      user_management == 1
                    ) {
                      UserManagementModel.approve(id, user_id)
                        .then((result) => {
                          return res.status(201).send(result);
                        })
                        .catch((error) => {
                          console.error(
                            `[error]: Error updating management submission ${new Date()}`
                          );
                          console.error(`[error]: ${error}`);

                          return res.status(500).send(error);
                        });
                    } else {
                      return res
                        .status(400)
                        .send(
                          "Pengguna tidak dapat melakukan approval terhadap request ini."
                        );
                    }
                  }
                })
                .catch((error) => {
                  console.error(
                    `[error]: Error on fetching district ${new Date()}`
                  );
                  console.error(`[error]: ${error}`);

                  return res.status(500).send(error);
                });
            }
          })
          .catch((error) => {
            console.error(`[error]: Error on fetching user ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
          });
      })
      .catch((error) => {
        console.error(`[error]: Error createing user management ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };

  static fetch = (req: Request, res: Response) => {
    const district_id = req.body.districtId;
    DistrictModel.getById(district_id)
      .then((district) => {
        // Get the user's district account
        // Then get user management submission

        Promise.all([
          UserManagementModel.fetchStaffSubmission(
            district?.provinsi_id!,
            district?.kota_id,
            district?.kecamatan_id,
            district?.kecamatan_id!
          ),
          UserManagementModel.fetchChildrenSubmission(
            district?.provinsi_id,
            district?.kota_id,
            district?.kecamatan_id,
            district?.kelurahan_id!
          ),
        ])
          .then((result) => {
            return res.status(200).send({
              staff: result[0],
              branch: result[1],
            });
          })
          .catch((error) => {
            console.error(`[error]: Error fetching submission ${new Date()}`);
            console.error(`[error]: ${error.toString()}`);

            return res.status(500).send(error);
          });
      })
      .catch((error) => {
        console.error(`[error]: Error fetching submission ${new Date()}`);
        console.error(`[error]: ${error.toString()}`);

        return res.status(500).send(error);
      });
  };

  static fetchById = (req: Request, res: Response) => {
    const id = parseInt(req.params.requestId);
    UserManagementModel.fetchById(id).then(result => {
      return res.status(200).send(result);
    }).catch(error => {
      return res.status(500).send(error);
    })
  }
}

export default ManagementController;
