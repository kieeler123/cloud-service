import "dotenv/config";
import express from "express";
import cors from "cors";
import cloudFilesRoutes from "./features/cloud/routes/cloudFiles.routes.js";
import authRoutes from "./features/cloud/routes/authRoutes.js";

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/auth/test", (_req, res) => {
  res.json({ ok: true, route: "auth-test" });
});

app.use("/api/cloud-files", cloudFilesRoutes);

export default app;
