import { supabaseAdmin } from "@/lib/supabaseAdmin.js";
import { adminDb } from "@/lib/firebaseAdmin.js"; // Mongo 쓰는 부분 유지
import { UploadCloudFileParams } from "@/types/cloudStorage.types.js";
import { detectDriveFileKind } from "@/utils/cloudStorage.utils.js";
import { createCloudFileMeta } from "@/features/cloud/controllers/cloudFilesApi.js";

export async function uploadCloudFileSupabase({
  ownerUid,
  file,
}: UploadCloudFileParams) {
  const duplicateSnapshot = await adminDb
    .collection("files")
    .where("ownerUid", "==", ownerUid)
    .where("name", "==", file.originalname)
    .where("size", "==", file.size)
    .where("isTrashed", "==", false)
    .limit(1)
    .get();

  if (!duplicateSnapshot.empty) {
    throw new Error("DUPLICATE_FILE");
  }

  const safeName = file.originalname.replace(/[^\w.\-가-힣]/g, "_");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET!;
  const path = `${ownerUid}/${Date.now()}_${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file.buffer, {
      contentType: file.mimetype || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    console.error("❌ Supabase upload error:", error);
    throw new Error("FAILED_TO_UPLOAD_FILE");
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  const downloadURL = publicUrlData.publicUrl;

  const newDocRef = adminDb.collection("files").doc();

  await newDocRef.set({
    ownerUid,
    name: file.originalname,
    size: file.size,
    path,
    bucket,
    downloadURL,
    provider: "supabase",
    contentType: file.mimetype || "application/octet-stream",
    createdAt: new Date(),
    isTrashed: false,
  });

  const kind = detectDriveFileKind(file.mimetype || "application/octet-stream");

  await createCloudFileMeta({
    fileId: newDocRef.id,
    ownerUid,
    allowedUserUids: [ownerUid],

    provider: "supabase",
    projectKey: "supabase-main",
    bucket,
    path,
    storageKey: `supabase|${bucket}|${path}`,

    originalName: file.originalname,
    mimeType: file.mimetype || "application/octet-stream",
    size: file.size,
    kind,

    title: "",
    seriesTitle: "",
    episodeNumber: null,
    contentType: kind,
    isPlayable: kind === "video",
    displayOrder: null,
    memo: "",
    tags: [],

    status: "ready",
    migrationState: "not_required",
    source: "new-upload",
    sourceFileRef: "",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    fileId: newDocRef.id,
    path,
    downloadURL,
  };
}
