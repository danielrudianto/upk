import { hashSync } from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { v4 } from "uuid";
import firebaseHelper from "../helper/firebase.helper";
import MediaHelper from "../helper/media.helper";
import DistrictModel from "../models/district.model";
import UserModel from "../models/user.model.ts";

class UserController {
  static update = (req: Request, res: Response) => {
    const val_result = validationResult(req);
    if (!val_result.isEmpty()) {
      return res.status(500).send(val_result.array()[0].msg);
    }

    const name = req.body.name;
    const uid = req.body.uid;
    const phone_number = req.body.phone_number;
    const password = req.body.password;

    let formatted_phone_number = phone_number;

    switch (phone_number.substring(0, 2)) {
      case "08":
        formatted_phone_number = "62" + phone_number.substring(1);
        break;
      case "62":
        formatted_phone_number = phone_number;
        break;
      default:
        return res.status(500).send("Format nomor telepon tidak dikenal.");
    }

    if (!req.body.profile_image) {
      // User do not update profile picture
      UserModel.fetchByUID(uid)
        .then((user) => {
          if (user == null) {
            return res.status(404).send("Pengguna tidak ditemukan.");
          } else {
            const userModel = new UserModel(
              name,
              user.nik,
              formatted_phone_number,
              user.district_id,
              hashSync(password, 12),
              user.gender!,
              user.profile_image_url,
              user.id
            );

            userModel.update().then((update_result) => {
              firebaseHelper.auth().updateUser(update_result.uid, {
                phoneNumber: `+${formatted_phone_number}`,
                displayName: name,
                password: password,
              });
            });
          }
        })
        .catch((error) => {
          console.error(`[error]: Error fetching profile ${new Date()}`);
          console.error(`[error]: ${error}`);

          return res.status(500).send(error);
        });
    } else if (req.body.profile_image == null) {
      UserModel.fetchByUID(uid)
        .then((user) => {
          if (user == null) {
            return res.status(404).send("Pengguna tidak ditemukan.");
          } else {
            const userModel = new UserModel(
              name,
              user.nik,
              formatted_phone_number,
              user.district_id,
              hashSync(password, 12),
              user.gender!,
              null,
              user.id
            );

            userModel.update().then((update_result) => {
              // Update firebase user
              firebaseHelper
                .auth()
                .updateUser(update_result.uid, {
                  phoneNumber: `+${formatted_phone_number}`,
                  displayName: name,
                  password: password,
                })
                .then(() => {
                  // Update firebase image URL
                  const bucket = firebaseHelper
                    .storage()
                    .bucket(process.env.USER_STORAGE_REFERENCE);
                  bucket
                    .file(update_result.profile_image_url!)
                    .delete()
                    .then(() => {
                      return res.status(200).send(update_result);
                    })
                    .catch((error) => {
                      console.error(
                        `[error]: Error updating firebase profile ${new Date()}`
                      );
                      console.error(`[error]: ${error}`);

                      return res.status(500).send(error);
                    });
                })
                .catch((error) => {
                  console.error(
                    `[error]: Error updating firebase profile ${new Date()}`
                  );
                  console.error(`[error]: ${error}`);

                  return res.status(500).send(error);
                });
            });
          }
        })
        .catch((error) => {
          console.error(`[error]: Error fetching profile ${new Date()}`);
          console.error(`[error]: ${error}`);

          return res.status(500).send(error);
        });
    } else {
      UserModel.fetchByUID(uid)
        .then((user) => {
          if (user == null) {
            return res.status(404).send("Pengguna tidak ditemukan.");
          } else {
            const file = MediaHelper.toFile(req.body.profile_image);
            const file_name = req.body.profile_image_name;
            const names = file_name.split(".");
            const extension = names[names.length - 1];
            const new_file_name = v4();
            const full_file_name = `${new_file_name}.${extension}`;

            const bucket = firebaseHelper
              .storage()
              .bucket(process.env.USER_STORAGE_REFERENCE);

            const promises: Promise<any>[] = [];

            if (user.profile_image_url != null) {
              promises.push(bucket.file(user.profile_image_url).delete());
            }
            promises.push(bucket.file(full_file_name).save(file));
            const userModel = new UserModel(
              name,
              user.nik,
              formatted_phone_number,
              user.district_id,
              hashSync(password, 12),
              user.gender!,
              full_file_name,
              user.id
            );

            promises.push(userModel.update());
            promises.push(
              firebaseHelper.auth().updateUser(uid, {
                phoneNumber: `+${formatted_phone_number}`,
                displayName: name,
                password: password,
              })
            );
            Promise.all(promises).then((update_result) => {
              // Sudah update mau relogin / ganti token saja / Update saat itu saja?
            }).catch(error => {
              console.error(
                `[error]: Error updating firebase profile ${new Date()}`
              );
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            })
          }
        })
        .catch((error) => {
          console.error(`[error]: Error fetching profile ${new Date()}`);
          console.error(`[error]: ${error}`);

          return res.status(500).send(error);
        });
    }
  };

  static fetch = (req: Request, res: Response) => {
    const user_id = req.body.userId;
    const district_id = req.body.districtId;
    
    if(district_id != null){
      // Fetch office profile
      DistrictModel.fetchProfileById(district_id).then(result => {
        return res.status(200).send({
          ...result[0],
          "user_subscription": undefined,
          "follower": result[1],
          "following": result[2],
          "post": result[3]
        })
      }).catch(error => {
        console.error(
          `[error]: Failed to fetch profile ${new Date()}`
        );
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      })
    } else {
      UserModel.fetchProfileById(user_id).then(result => {
        return res.status(200).send({
          ...result[0],
          "user_subscription": undefined,
          "is_active": (result[0] == null || result[0]?.user_subscription.length == 0) ? false : true,
          "member": result[4] > 0,
          "follower": result[1],
          "following": result[2],
          "post": result[3]
        })
      }).catch(error => {
        console.error(
          `[error]: Failed to fetch profile ${new Date()}`
        );
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      })
    }
  }
}

export default UserController;
