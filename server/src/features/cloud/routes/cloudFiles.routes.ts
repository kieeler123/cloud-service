import express from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  deleteCloudFileForeverById,
  findDriveFilesPageByOwnerUid,
  findTrashFilesByOwnerUid,
  restoreCloudFileById,
  trashDuplicateDriveFiles,
} from "../../../services/cloud-files/cloudStorageService.firebase.js";
import { trashCloudFilesByFileIds } from "../repo/cloudFilesRepo.js";
import { uploadCloudFileSupabase } from "../../../services/cloud-files/cloudStorageService.supabase.js";
import { randomUUID } from "node:crypto";
import { createOperationErrorLog } from "../../../utils/createOperationErrorLog.js";
import { uploadSingleFileWithErrorLog } from "../../../services/cloud-files/uploadSingleFileWithErrorLog.js";

const cloudRoutes = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
});

cloudRoutes.get("/", requireAuth, async (req, res) => {
  const requestId = crypto.randomUUID();

  try {
    const ownerUid = req.user!.uid;
    const limit = Number(req.query.limit ?? 12);
    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const result = await findDriveFilesPageByOwnerUid({
      ownerUid,
      pageSize: limit,
      cursor,
    });

    return res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("list route error:", error);

    await createOperationErrorLog({
      ownerUid: req.user?.uid,
      action: "LIST_FILES",
      resourceType: "file",
      route: "/api/cloud-files",
      method: "GET",
      code: "FAILED_TO_FETCH_FILES",
      message: "Failed to fetch files",
      rawMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : "",
      provider: "mongodb",
      requestId,
      statusCode: 500,
      meta: {
        query: req.query,
      },
    });

    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_FETCH_FILES",
      message: "Failed to fetch files",
      requestId,
    });
  }
});

cloudRoutes.post(
  "/upload",
  requireAuth,
  uploadSingleFileWithErrorLog("file"),
  async (req, res) => {
    const requestId = randomUUID();

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

      const result = await uploadCloudFileSupabase({
        ownerUid,
        file,
      });

      return res.status(201).json({
        ok: true,
        ...result,
      });
    } catch (error) {
      console.error("upload route error:", error);

      await createOperationErrorLog({
        ownerUid: req.user?.uid,
        action: "UPLOAD_FILE",
        resourceType: "file",
        route: "/api/cloud-files/upload",
        method: "POST",
        code: "FAILED_TO_UPLOAD_FILE",
        message: "Failed to upload file",
        rawMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "",
        provider: "supabase",
        fileName: req.file?.originalname,
        mimeType: req.file?.mimetype,
        fileSize: req.file?.size,
        bucket: process.env.SUPABASE_STORAGE_BUCKET,
        requestId,
        statusCode: 500,
        meta: {
          ownerUid: req.user?.uid,
        },
      });

      if (error instanceof Error && error.message === "DUPLICATE_FILE") {
        return res.status(409).json({
          ok: false,
          code: "DUPLICATE_FILE",
          message: "Duplicate file already exists",
          requestId,
        });
      }

      return res.status(500).json({
        ok: false,
        code: "FAILED_TO_UPLOAD_FILE",
        message: "Failed to upload file",
        requestId,
      });
    }
  },
);

cloudRoutes.get("/trash", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const items = await findTrashFilesByOwnerUid(ownerUid);

    return res.json({
      ok: true,
      items,
    });
  } catch (error) {
    console.error("trash route error:", error);
    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_FETCH_TRASH_FILES",
      message: "Failed to fetch trash files",
    });
  }
});

cloudRoutes.patch("/:fileId/restore", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const fileId =
      typeof req.query.fileId === "string" ? req.query.fileId : undefined;

    if (!fileId) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_FILE_ID",
        message: "Invalid fileId",
      });
    }

    await restoreCloudFileById({
      ownerUid,
      fileId,
    });

    return res.json({
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

    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_RESTORE_FILE",
      message: "Failed to restore file",
    });
  }
});

cloudRoutes.delete("/:fileId", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const fileId =
      typeof req.query.fileId === "string" ? req.query.fileId : undefined;

    if (!fileId) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_FILE_ID",
        message: "Invalid fileId",
      });
    }

    await deleteCloudFileForeverById({
      ownerUid,
      fileId,
    });

    return res.json({
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

    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_DELETE_FILE",
      message: "Failed to delete file forever",
    });
  }
});

cloudRoutes.patch("/trash", requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user!.uid;
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_FILE_IDS",
        message: "fileIds must be a non-empty array",
      });
    }

    const result = await trashCloudFilesByFileIds({
      ownerUid,
      fileIds,
    });

    return res.json({
      ok: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("trash files route error:", error);
    return res.status(500).json({
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

    return res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("trash duplicate route error:", error);
    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_TRASH_DUPLICATES",
      message: "Failed to trash duplicate files",
    });
  }
});

cloudRoutes.post("/client-error-logs/bulk", async (req, res) => {
  try {
    const logs = Array.isArray(req.body.logs) ? req.body.logs : [];

    console.log("🔥 client logs received:", logs);

    for (const log of logs) {
      await createOperationErrorLog({
        ownerUid:
          typeof log?.meta?.ownerUid === "string" ? log.meta.ownerUid : null,

        action: typeof log.action === "string" ? log.action : "UNKNOWN_ACTION",

        resourceType:
          typeof log.resourceType === "string" ? log.resourceType : "file",

        route:
          typeof log?.meta?.endpoint === "string"
            ? log.meta.endpoint
            : "CLIENT",

        method: "CLIENT",

        code: typeof log.code === "string" ? log.code : "CLIENT_ERROR",

        message: typeof log.message === "string" ? log.message : "Client error",

        rawMessage: typeof log.rawMessage === "string" ? log.rawMessage : "",

        provider: "client",

        statusCode: 0,

        meta: log,
      });
    }

    return res.json({
      ok: true,
      insertedCount: logs.length,
    });
  } catch (error) {
    console.error("client error logs bulk route error:", error);

    return res.status(500).json({
      ok: false,
      code: "FAILED_TO_SAVE_CLIENT_ERROR_LOGS",
      message: "Failed to save client error logs",
    });
  }
});

export default cloudRoutes;
