import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { BRI_service } from './helper/bank.helper';

import { initializeApp } from 'firebase-admin/app';

import authRoutes from './routes/auth.route';
import districtRoutes from './routes/district.route';
import postRoutes from './routes/post.route';
dotenv.config();

const app = express();

let JSONParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(JSONParser, urlencodedParser);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/auth", authRoutes);
app.use("/district", districtRoutes);
app.use("/post", postRoutes);



app.listen(port, () => {
  console.log(`[server] Server is running at https://localhost:${port}`);
  // Referesh Banking token
  BRI_service.scheduleRefreshBRIToken();
});