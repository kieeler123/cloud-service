import express from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  uploadCloudFile,
  findTrashFilesByOwnerUid,
  restoreCloudFileById,
  deleteCloudFileForeverById,
  trashDuplicateDriveFiles,
  trashCloudFilesByFileIds,
} from "../../../services/cloud-files/cloudStorageService.js";
import { CloudFileModel } from "../models/CloudFile.model.js";

const cloudRoutes = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
});

cloudRoutes.get("/", requireAuth, async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 12);
    const cursor = req.query.cursor as string | undefined;

    const query: any = {
      $or: [{ isTrashed: false }, { isTrashed: { $exists: false } }],
    };

    if (cursor) {
      query._id = { $lt: cursor }; // cursor pagination
    }

    const items = await CloudFileModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1) // ⭐ 핵심
      .lean();

    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;

    const nextCursor = hasMore
      ? sliced[sliced.length - 1]._id.toString()
      : null;

    return res.json({
      ok: true,
      items: sliced,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
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

    if (error instanceof Error && error.message === "FILE_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        code: "FILE_NOT_FOUND",
        message: "File not found",
      });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({
        ok: false,
        code: "FORBIDDEN",
        message: "You do not have permission to restore this file",
      });
    }

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

    if (error instanceof Error && error.message === "FILE_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        code: "FILE_NOT_FOUND",
        message: "File not found",
      });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({
        ok: false,
        code: "FORBIDDEN",
        message: "You do not have permission to delete this file",
      });
    }

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

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_FILE_IDS",
        message: "fileIds must be a non-empty array",
      });
    }

    const result = await trashCloudFilesByFileIds(fileIds);

    res.json({
      ok: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("trash files route error:", error);
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

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_NAME",
        message: "name is required",
      });
    }

    if (typeof size !== "number") {
      return res.status(400).json({
        ok: false,
        code: "INVALID_SIZE",
        message: "size must be a number",
      });
    }

    const result = await trashDuplicateDriveFiles({
      ownerUid,
      name,
      size,
    });

    res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("trash duplicate route error:", error);
    res.status(500).json({
      ok: false,
      code: "FAILED_TO_TRASH_DUPLICATES",
      message: "Failed to trash duplicate files",
    });
  }
});

export default cloudRoutes;
