import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { initializeApp } from 'firebase-admin/app';

import authRoutes from './routes/auth.route';
import districtRoutes from './routes/district.route';

dotenv.config();

const firebaseConfig = {
  //...
};

const app = express();
let JSONParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(JSONParser, urlencodedParser);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/auth", authRoutes);
app.use("/district", districtRoutes);

app.listen(port, () => {
  console.log(`[server] Server is running at https://localhost:${port}`);
});