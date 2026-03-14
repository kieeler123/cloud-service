import express from "express";
import multer from "multer";
import {
  trashCloudFilesByFileIds,
  trashDuplicateDriveFiles,
  findDriveFilesPageByOwnerUid,
  findTrashFilesByOwnerUid,
  restoreCloudFileById,
  deleteCloudFileForeverById,
  uploadCloudFile,
} from "../repo/cloudFilesRepo.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const cloudRoutes = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
  },
});

cloudRoutes.get("/", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const limit = Number(req.query.limit ?? 10);
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : null;

    const result = await findDriveFilesPageByOwnerUid({
      ownerUid,
      pageSize: limit,
      cursor,
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("cloud-files route error:", error);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_FETCH_FILES",
      message: "Failed to fetch files",
    });
  }
});

cloudRoutes.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      const ownerUid = req.user!.uid;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          ok: false,
          code: "MISSING_FILE",
          message: "File is required",
        });
      }

      const result = await uploadCloudFile({
        ownerUid,
        file,
      });

      res.status(201).json({
        ok: true,
        ...result,
      });
    } catch (error) {
      console.error("upload route error:", error);

      if (error instanceof Error && error.message === "DUPLICATE_FILE") {
        return res.status(409).json({
          ok: false,
          code: "DUPLICATE_FILE",
          message: "Duplicate file already exists",
        });
      }

      res.status(500).json({
        ok: false,
        code: "FAILED_TO_UPLOAD_FILE",
        message: "Failed to upload file",
      });
    }
  },
);

cloudRoutes.get("/trash", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const items = await findTrashFilesByOwnerUid(ownerUid);

    res.json({
      ok: true,
      items,
    });
  } catch (error) {
    console.error("trash route error:", error);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_FETCH_TRASH_FILES",
      message: "Failed to fetch trash files",
    });
  }
});

cloudRoutes.patch("/:fileId/restore", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const rawFileId = req.params.fileId;

    if (!rawFileId || Array.isArray(rawFileId)) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_FILE_ID",
        message: "Invalid fileId",
      });
    }

    await restoreCloudFileById({
      ownerUid,
      fileId: rawFileId,
    });

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error("restore route error:", error);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_RESTORE_FILE",
      message: "Failed to restore file",
    });
  }
});

cloudRoutes.delete("/:fileId", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const rawFileId = req.params.fileId;

    if (!rawFileId || Array.isArray(rawFileId)) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_FILE_ID",
        message: "Invalid fileId",
      });
    }

    await deleteCloudFileForeverById({
      ownerUid,
      fileId: rawFileId,
    });

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error("delete forever route error:", error);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_DELETE_FILE",
      message: "Failed to delete file forever",
    });
  }
});

cloudRoutes.patch("/trash", requireAuth, async (req, res) => {
  try {
    const { fileIds } = req.body;

    const result = await trashCloudFilesByFileIds(fileIds);

    res.json({
      ok: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_TRASH_FILES",
      message: "Failed to trash cloud files",
    });
  }
});

cloudRoutes.patch("/trash-duplicates", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const { name, size } = req.body;

    const result = await trashDuplicateDriveFiles({
      ownerUid,
      name,
      size,
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_TRASH_DUPLICATES",
      message: "Failed to trash duplicate files",
    });
  }
});

export default cloudRoutes;
