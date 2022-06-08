import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const router = Router();
const prisma = new PrismaClient();

router.get("/history", (req, res, next) => {
  /*
        Get history of transaction based on user authorization
        Get the following data to proceed transaction history
        1. User ID by sending user authorization
        2. Date range
        3. Success status
        4. Page
    */

  const page = !req.query.page
    ? 1
    : Math.max(parseInt(req.query.page.toString()), 1);
  const limit = parseInt(process.env.LIMIT!);
  const offset = (page - 1) * limit;
  if (!req.query.start || !req.query.end) {
    // If date range is not specified, send all history data //
    prisma
      .$transaction([
        prisma.user_transaction.findMany({
          where: {
            created_by: req.body.userId,
          },
          orderBy: {
            created_at: "desc",
          },
          take: limit,
          skip: offset,
          select: {
            value: true,
            service: true,
            discount: true,
            payment_method: {
              select: {
                name: true,
              },
            },
            is_paid: true,
            is_delete: true,
            paid_at: true,
            branch_transaction: true,
            payment_reference: true,
            purchase_reference: true,
            user: {
              select: {
                name: true,
                nik: true,
              },
            },
          },
        }),
        prisma.user_transaction.count({
          where: {
            created_by: req.body.userId,
          },
        }),
      ])
      .then((result) => {
        res.status(200).send({
          data: result[0],
          count: result[1],
        });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } else {
    // If date range is specified, send all history data in the date range //
    const start = new Date(req.query.start?.toString());
    const end = new Date(req.query.end?.toString());
    start.setHours(0, 0, 0);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0);

    prisma
      .$transaction([
        prisma.user_transaction.findMany({
          where: {
            created_by: req.body.userId,
            AND: [
              {
                created_at: {
                  gte: start,
                },
              },
              {
                created_at: {
                  lt: end,
                },
              },
            ],
          },
          orderBy: {
            created_at: "desc",
          },
          take: limit,
          skip: offset,
          select: {
            value: true,
            service: true,
            discount: true,
            payment_method: {
              select: {
                name: true,
              },
            },
            is_paid: true,
            is_delete: true,
            paid_at: true,
            branch_transaction: true,
            payment_reference: true,
            purchase_reference: true,
            user: {
              select: {
                name: true,
                nik: true,
              },
            },
          },
        }),
        prisma.user_transaction.count({
          where: {
            created_by: req.body.userId,
          },
        }),
      ])
      .then((result) => {
        res.status(200).send({
          data: result[0],
          count: result[1],
        });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
});

router.get("/", (req, res, next) => {
  /* Route to get historical transactions */
});

router.post("/", async (req, res, next) => {
  /*
        Route to create a new transaction
        There area several available transaction
        1. PLN
        2. Phone
        3. BPJS
    */

  const productCodeName = req.body.code_name;
  const branchTransaction = req.body.branch_transaction == 1 ? true : false;
  const paymentMethod = parseInt(req.body.payment_method);
  const purchaseReference = req.body.purchase_reference;

  /* Check availble payment */

  const payment = await prisma.payment_method.findUnique({
    where: {
      id: paymentMethod,
    },
  });

  if (payment == null || payment.is_delete) {
    return res.status(500).send("Metode pembayaran tidak dikenal.");
  }

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
        console.log(result);
        const status = result.data.STATUS;
        if (status !== "00") {
          return res.status(500).send("Produk tidak ditemukan.");
        }

        prisma.user_transaction
          .create({
            data: {
              created_by: req.body.userId,
              value:
                parseFloat(result.data.HARGA) + parseFloat(result.data.ADMIN),
              service: parseInt(process.env.ADMINISTRATION_FEE!),
              discount: parseFloat(result.data.KOMISI),
              product_code_name: productCodeName,
              branch_transaction: branchTransaction,
              payment_method_id: paymentMethod,
              purchase_reference: purchaseReference,
            },
          })
          .then((result) => {
            // TODO Create Virtual account based on payment method
          })
          .catch((error) => {
            return res
              .status(500)
              .send("Gagal membuat transaksi. Mohon coba kembali.");
          });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/:transactionId", (req, res, next) => {
  const id = parseInt(req.params.transactionId);

})

export default router;