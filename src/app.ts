import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route';


dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`[server] Server is running at https://localhost:${port}`);
});