import express from "express";
import {
  findCloudFiles,
  trashCloudFilesByFileIds,
} from "../repo/cloudFilesRepo.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const items = await findCloudFiles();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cloud files" });
  }
});

router.patch("/trash", async (req, res) => {
  try {
    const { fileIds } = req.body;

    const result = await trashCloudFilesByFileIds(fileIds);

    res.json({
      ok: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to trash cloud files" });
  }
});

export default router;
