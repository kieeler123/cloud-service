import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { syncFirebaseStorageToMongo } from "../../../services/cloud-files/syncFirebaseStorageToMongo.js";
import { insertManyIgnoreDuplicate } from "../repo/cloudFilesRepo.js";

const cloudSyncRoutes = express.Router();

cloudSyncRoutes.post("/storage-temp-sync", requireAuth, async (req, res) => {
  try {
    const prefix = typeof req.body?.prefix === "string" ? req.body.prefix : "";
    const limit = typeof req.body?.limit === "number" ? req.body.limit : 1000;

    const result = await syncFirebaseStorageToMongo({
      prefix,
      limit,
    });

    return res.json(result);
  } catch (error) {
    console.error("storage temp sync failed:", error);

    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_SYNC_STORAGE_FILES",
      message: error instanceof Error ? error.message : "Unknown sync error",
    });
  }
});

// 🔥 Firebase → Mongo sync
cloudSyncRoutes.get("/sync", async (_req, res) => {
  try {
    const result = await syncFirebaseStorageToMongo();

    const message =
      result.scannedCount === 0
        ? "이관할 파일이 없습니다."
        : result.insertedCount === 0 && result.failedCount === 0
          ? "이미 모두 이관된 상태입니다."
          : "이관 완료";

    return res.send(`
      <html>
        <body style="font-family:sans-serif;padding:24px">
          <h1>Cloud Sync Result</h1>
          <p><strong>${message}</strong></p>
          <ul>
            <li>scannedCount: ${result.scannedCount}</li>
            <li>insertedCount: ${result.insertedCount}</li>
            <li>skippedCount: ${result.skippedCount}</li>
            <li>failedCount: ${result.failedCount}</li>
            <li>beforeCount: ${result.beforeCount}</li>
            <li>afterCount: ${result.afterCount}</li>
          </ul>
          <p>브라우저 콘솔을 열면 파일별 결과를 볼 수 있습니다.</p>
          <script>
            console.log("sync summary", ${JSON.stringify({
              scannedCount: result.scannedCount,
              insertedCount: result.insertedCount,
              skippedCount: result.skippedCount,
              failedCount: result.failedCount,
              beforeCount: result.beforeCount,
              afterCount: result.afterCount,
            })});
            console.table(${JSON.stringify(result.results)});
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("sync route error:", error);

    return res.status(500).send(`
      <html>
        <body style="font-family:sans-serif;padding:24px">
          <h1>Sync Failed</h1>
          <pre>${error instanceof Error ? error.message : "Unknown sync error"}</pre>
        </body>
      </html>
    `);
  }
});

cloudSyncRoutes.post("/sync", async (req, res) => {
  try {
    const files = req.body.files;

    if (!Array.isArray(files)) {
      return res.status(400).json({ message: "Invalid files payload" });
    }

    const result = await insertManyIgnoreDuplicate(files);

    res.json({
      ok: true,
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to sync files" });
  }
});

cloudSyncRoutes.get("/sync.json", async (_req, res) => {
  try {
    const result = await syncFirebaseStorageToMongo();
    return res.json(result);
  } catch (error) {
    console.error("sync json route error:", error);
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : "Unknown sync error",
    });
  }
});

export default cloudSyncRoutes;
