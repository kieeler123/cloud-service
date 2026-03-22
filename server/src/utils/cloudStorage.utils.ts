import { CloudFileMeta, DriveFileKind } from "../types/cloudStorage.types.js";
import path from "node:path";

export function detectDriveFileKind(mimeType: string): DriveFileKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation") ||
    mimeType === "text/plain"
  ) {
    return "document";
  }
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  ) {
    return "archive";
  }
  return "other";
}

export function sanitizeFilename(filename: string) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  const safeBase = base
    .normalize("NFC")
    .replace(/[^\w가-힣.\-() ]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80);

  const safeExt = ext.replace(/[^\w.]/g, "").toLowerCase();

  return `${safeBase || "file"}${safeExt}`;
}

export function createCloudFileMeta(input: {
  id: string;
  ownerUid: string;
  name: string;
  size: number;
  mimeType: string;
  provider: "firebase" | "supabase";
  storagePath: string;
  downloadURL: string;
}): CloudFileMeta {
  const now = new Date().toISOString();

  return {
    id: input.id,
    ownerUid: input.ownerUid,
    name: input.name,
    size: input.size,
    mimeType: input.mimeType,
    kind: detectDriveFileKind(input.mimeType),
    provider: input.provider,
    storagePath: input.storagePath,
    downloadURL: input.downloadURL,
    isTrashed: false,
    createdAt: now,
    updatedAt: now,
  };
}
