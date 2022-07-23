import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import UserManagementModel from "../models/management.model";
import UserModel from "../models/user.model.ts";

class authHelper {
  static authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let tokenHeader = req.headers["authorization"]?.toString();
    if (!tokenHeader || tokenHeader.split(" ")[0] !== "Bearer") {
      return res.status(401).json({
        auth: false,
        message: "Format token tidak sesuai. Mohon coba login ulang.",
      });
    }

    let token = tokenHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        auth: false,
        message: "Token tidak tersedia. Mohon coba login ulang.",
      });
    }

    verify(token, process.env.TOKEN_KEY!, (err, decoded) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        if ((decoded as any).hasOwnProperty("user_management_id")) {
          // Logged in user is from office account
          const id = parseInt((decoded as any).id);
          const user_management_id = (decoded as any).user_management_id;

          Promise.all([
            UserModel.fetchById(id),
            UserManagementModel.fetchById(user_management_id),
          ])
            .then((result) => {
              const user = result[0];
              const management = result[1];

              if (user == null) {
                return res.status(401).send("Pengguna tidak ditemukan.");
              }

              if (
                management == null ||
                !management.is_approved ||
                management.is_delete
              ) {
                return res
                  .status(401)
                  .send("Status kepengurusan tidak ditemukan.");
              }

              req.body.userId = user.id;
              req.body.districtId = management.district.id;

              next();
            })
            .catch((error) => {
              console.error(`[error]: Login user personal ${new Date()}`);
              console.error(`[error]: ${error}`);

              return res.status(401).send("Pengguna tidak terotorisasi.");
            });
        } else {
          // Logged in user is from personal account
          const id = parseInt((decoded as any).id);
          UserModel.fetchById(id)
            .then((user) => {
              if (user == null) {
                return res.status(401).send("Pengguna tidak ditemukan.");
              } else {
                req.body.userId = user.id;
                req.body.districtId = null;

                next();
              }
            })
            .catch((error) => {
              console.error(`[error]: Login user personal ${new Date()}`);
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        }
      }
    });
  };
}

export default authHelper;
