import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// import { BRI_service } from './helper/bank.service';
// import { initializeApp } from 'firebase-admin/app';

import authRoutes from './routes/auth.route';
import districtRoutes from './routes/district.route';
import postRoutes from './routes/post.route';
import commentRoutes from './routes/comment.route';

import productRoutes from './routes/products.route';
import transactionRoutes from './routes/transaction.route';
import paymentRoutes from './routes/payment.route';
import managementRoutes from './routes/management.route';
import subscriptionRoutes from './routes/subscription.route';
import authHelper from './helper/auth.helper';
import profileRoutes from './routes/profile.route';
import socialMediaRoutes from './routes/social_media.route';
import reportRoutes from './routes/report.route';

dotenv.config();

const app = express();

let JSONParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(JSONParser, urlencodedParser);
app.use('/public', express.static(__dirname + '/public'));

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/auth", authRoutes);
app.use("/district", districtRoutes);

app.use("/post", authHelper.authMiddleware, postRoutes);
app.use("/comment", authHelper.authMiddleware, commentRoutes);
app.use("/social", authHelper.authMiddleware, socialMediaRoutes);

app.use("/product", authHelper.authMiddleware, productRoutes);
app.use('/transaction', authHelper.authMiddleware, transactionRoutes);
app.use('/payment', authHelper.authMiddleware, paymentRoutes);
app.use('/membership', authHelper.authMiddleware, subscriptionRoutes);

app.use('/profile', authHelper.authMiddleware, profileRoutes);

app.use('/management', authHelper.authMiddleware, managementRoutes);
app.use("/report", authHelper.authMiddleware, reportRoutes);

app.listen(port, () => {
  console.log(`[server] Server is running at https://localhost:${port}`);
  // Referesh Banking token
  // BRI_service.scheduleRefreshBRIToken();
});