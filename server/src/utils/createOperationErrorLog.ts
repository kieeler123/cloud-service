import { OperationErrorLogModel } from "../features/cloud/models/operationErrorLogModel.js";

type CreateOperationErrorLogParams = {
  ownerUid?: string;
  action:
    | "UPLOAD_FILE"
    | "DOWNLOAD_FILE"
    | "DELETE_FILE"
    | "RESTORE_FILE"
    | "MOVE_FILE"
    | "RENAME_FILE"
    | "SYNC_FILE"
    | "UNKNOWN_ACTION"
    | "LIST_FILES";
  resourceType?: "file" | "folder" | "unknown";
  route: string;
  method?: string;
  code: string;
  message: string;
  rawMessage?: string;
  stack?: string;
  provider?:
    | "unknown"
    | "firebase"
    | "supabase"
    | "mongodb"
    | "server"
    | "client";
  fileId?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  bucket?: string;
  path?: string;
  statusCode?: number;
  requestId?: string;
  meta?: Record<string, unknown>;
};

export async function createOperationErrorLog(
  params: CreateOperationErrorLogParams,
) {
  try {
    await OperationErrorLogModel.create({
      ownerUid: params.ownerUid ?? null,
      action: params.action,
      resourceType: params.resourceType ?? "file",
      route: params.route,
      method: params.method ?? "POST",
      code: params.code,
      message: params.message,
      rawMessage: params.rawMessage ?? "",
      stack: params.stack ?? "",
      provider: params.provider ?? "unknown",
      fileId: params.fileId ?? "",
      fileName: params.fileName ?? "",
      mimeType: params.mimeType ?? "",
      fileSize: params.fileSize ?? 0,
      bucket: params.bucket ?? "",
      path: params.path ?? "",
      statusCode: params.statusCode ?? 500,
      requestId: params.requestId ?? "",
      meta: params.meta ?? {},
    });
  } catch (logError) {
    console.error("failed to save operation error log:", logError);
  }
}
