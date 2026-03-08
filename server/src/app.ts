import express from "express";
import cors from "cors";
import cloudFilesRouter from "./features/cloud/routes/cloudFiles.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/cloud-files", cloudFilesRouter);

export default app;
