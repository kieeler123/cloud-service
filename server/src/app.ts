import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./features/cloud/routes/authRoutes.js";
import cloudFilesRoutes from "./features/cloud/routes/cloudFiles.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_APP_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/cloud-files", (req, _res, next) => {
  console.log("app cloud-files middleware hit:", req.method, req.originalUrl);
  next();
});

app.use("/api/cloud-files", cloudFilesRoutes);

export default app;
