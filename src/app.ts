import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { BRI_service } from './helper/bank.service';

import { initializeApp } from 'firebase-admin/app';

import authRoutes from './routes/auth.route';
import districtRoutes from './routes/district.route';
import postRoutes from './routes/post.route';
import commentRoutes from './routes/comment.route';

import productRoutes from './routes/products.route';
import transactionRoutes from './routes/transaction.route';
import paymentRoutes from './routes/payment.route';
import { hash, hashSync } from 'bcrypt';

dotenv.config();

const app = express();

let JSONParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(JSONParser, urlencodedParser);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/auth", authRoutes);
app.use("/district", districtRoutes);

app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

app.use("/product", productRoutes);
app.use('/transaction', transactionRoutes);
app.use('/payment', paymentRoutes);

app.listen(port, () => {
  console.log(`[server] Server is running at https://localhost:${port}`);
  // Referesh Banking token
  BRI_service.scheduleRefreshBRIToken();
});