import axios from "axios";
import { Request, Response } from "express";
import BRI_service from "../helper/bank.service";
import PaymentModel from "../models/payment.model";
import TransactionModel from "../models/transaction.model";

class TransactionController {
  static fetch = (req: Request, res: Response) => {
    const districtId = req.body.districtId;
    const userId = req.body.userId;
    const limit = parseInt(process.env.limit!);
    const page = !req.query.page
      ? 1
      : Math.max(1, parseInt(req.query.page.toString()));
    const offset = (page - 1) * limit;
    const mode = !req.query.mode ? 1 : parseInt(req.query.mode?.toString());

    Promise.all([
      TransactionModel.fetch(mode, userId, districtId, offset, limit),
      TransactionModel.count(mode, userId, districtId),
    ])
      .then((result) => {
        return res.status(200).send({
          data: result[0],
          count: result[1],
        });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  };

  static create = (req: Request, res: Response) => {
    /*
        Route to create a new transaction
        There area several available transaction
        1. PLN
        2. Phone
        3. BPJS
    */

    const productCodeName = req.body.code_name;
    const paymentMethod = parseInt(req.body.payment_method);
    const purchaseReference = req.body.purchase_reference;

    // When purchasing PLN, the purchase_reference is refered as PLN Customer number
    // When purchasing BPJS, the purchase_reference is refered as BPJS Customer number
    // When purchasing Phone bill, the purchase_reference is refered as Customer's phone number

    /* Check availble payment */
    PaymentModel.fetchById(paymentMethod)
      .then((payment) => {
        if (payment == null || payment.is_delete) {
          return res.status(405).send("Metode pembayaran tidak dikenal.");
        } else {
          /* First, get value, service, and discount of a product based on RajaBiller */
          try {
            axios
              .post(process.env.RAJABILLER_URL!, {
                method: "rajabiller.info_produk",
                uid: process.env.RAJABILLER_UID,
                pin: process.env.RAJABILLER_PIN,
                kode_produk: productCodeName,
              })
              .then((result) => {
                const status = result.data.STATUS;
                if (status !== "00") {
                  return res.status(500).send("Produk tidak ditemukan.");
                }

                const user_transaction = new TransactionModel(
                  req.body.userId,
                  parseFloat(result.data.HARGA) + parseFloat(result.data.ADMIN),
                  parseInt(process.env.ADMINISTRATION_FEE!),
                  parseFloat(result.data.KOMISI),
                  productCodeName,
                  purchaseReference,
                  result.data.REF2,
                  paymentMethod,
                  req.body.districtId,
                  req.body.note
                );

                user_transaction
                  .create()
                  .then((transaction) => {
                    const value = parseFloat(transaction.value.toString());
                    const discount = parseFloat(
                      transaction.discount.toString()
                    );
                    const service = parseFloat(transaction.service.toString());
                    const expired = new Date(transaction.payment_expired_date);

                    switch (payment.id) {
                      case 1:
                        // Create BRI Virtual Account
                        BRI_service.createVirtualAccount(
                          transaction.user.id.toString().padStart(10, "0"),
                          transaction.user.name,
                          value + service - discount,
                          `Transaksi AbangKu #${transaction.id.toString().padStart(10, "0")}`,
                          expired
                        )
                          .then((result) => {
                            console.log(result.data);
                          })
                          .catch(() => {
                            res
                              .status(500)
                              .send(
                                "Gagal membuat billing, mohon coba kembali dalam beberapa saat."
                              );
                          });
                        break;
                    }
                  })
                  .catch((error) => {
                    console.error(`[error]: Error creating user transaction ${new Date()}`);
                    console.error(`[error]: ${error}`);

                    return res.status(500).send(error);
                  });
              }).catch(error => {
                return res.status(500).send(error);
              })
          } catch (error) {
            console.error(`[error]: Error fetching product ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
          }
        }
      })
      .catch((error) => {
        console.error(`[error]: Fetching payment method by ID ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };
  
  static topUp = (req: Request, res: Response) => {
    const value = parseFloat(req.body.value);
    const paymentMethod = parseInt(req.body.payment_method);

    if(!req.body.value || value == 0){
      return res.status(400).send("Mohon input nominal yang sesuai.");
    } else {
      const user_transaction = new TransactionModel(
        req.body.userId,
        value,
        parseInt(process.env.ADMINISTRATION_FEE!),
        0,
        "TOPUP",
        "",
        "",
        paymentMethod,
        req.body.districtId,
        req.body.note
      );

      user_transaction.create().then(result => {
        return res.status(201).send(result);
      }).catch(error => {
        console.error(`[error]: Error createing transaction ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      })
    }
  }
}

export default TransactionController;
