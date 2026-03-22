import path from "node:path";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";

type UploadCloudFileParams = {
  userId: string;
  fileBuffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
};

type UploadCloudFileResult = {
  ok: boolean;
  fileId: string;
  path: string;
  downloadURL: string;
};

function sanitizeFilename(filename: string) {
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

export async function uploadCloudFile({
  userId,
  fileBuffer,
  originalName,
  mimeType,
  size,
}: UploadCloudFileParams): Promise<UploadCloudFileResult> {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  if (!fileBuffer || size <= 0) {
    throw new Error("INVALID_FILE");
  }

  const fileId = randomUUID();
  const safeName = sanitizeFilename(originalName);
  const ext = path.extname(safeName);
  const finalPath = `users/${userId}/${fileId}${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(finalPath, fileBuffer, {
      contentType: mimeType || "application/octet-stream",
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("FAILED_TO_UPLOAD_FILE");
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(finalPath);

  return {
    ok: true,
    fileId,
    path: finalPath,
    downloadURL: data.publicUrl,
  };
}
