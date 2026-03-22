import { NextFunction, Request, Response } from "express-serve-static-core";
import { createOperationErrorLog } from "../../utils/createOperationErrorLog.js";
import multer from "multer";
import { randomUUID } from "node:crypto";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 예: 50MB
  },
});

export const uploadSingleFileWithErrorLog = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, async (error: any) => {
      if (!error) return next();

      const requestId = randomUUID();

      if (error instanceof multer.MulterError) {
        const code =
          error.code === "LIMIT_FILE_SIZE" ? "FILE_TOO_LARGE" : "MULTER_ERROR";

        await createOperationErrorLog({
          ownerUid: req.user?.uid,
          action: "UPLOAD_FILE",
          resourceType: "file",
          route: req.originalUrl,
          method: req.method,
          code,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "File size exceeds upload limit"
              : "Multer upload error",
          rawMessage: error.message,
          stack: error.stack ?? "",
          provider: "server",
          statusCode: 400,
          requestId,
          meta: {
            multerCode: error.code,
          },
        });

        return res.status(400).json({
          ok: false,
          code,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "File size exceeds upload limit"
              : "Upload middleware failed",
          requestId,
        });
      }

      await createOperationErrorLog({
        ownerUid: req.user?.uid,
        action: "UPLOAD_FILE",
        resourceType: "file",
        route: req.originalUrl,
        method: req.method,
        code: "UPLOAD_MIDDLEWARE_ERROR",
        message: "Upload middleware failed",
        rawMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? (error.stack ?? "") : "",
        provider: "server",
        statusCode: 500,
        requestId,
      });

      return res.status(500).json({
        ok: false,
        code: "UPLOAD_MIDDLEWARE_ERROR",
        message: "Upload middleware failed",
        requestId,
      });
    });
  };
};
