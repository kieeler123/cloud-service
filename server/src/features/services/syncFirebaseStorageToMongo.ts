import path from "node:path";
import { adminStorage } from "../../lib/firebaseAdmin.js";
import { CloudFileModel } from "../cloud/models/CloudFile.js";
import type { CloudFileInput } from "../../types/cloudFile.types.js";

type SyncFileResult = {
  path: string;
  status: "inserted" | "skipped" | "failed";
  reason?: string;
};

type SyncResult = {
  ok: true;
  scannedCount: number;
  insertedCount: number;
  skippedCount: number;
  failedCount: number;
  beforeCount: number;
  afterCount: number;
  results: SyncFileResult[];
};

function safeDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function detectKindByMimeOrName(params: {
  mimeType?: string | null;
  name?: string | null;
}) {
  const mime = params.mimeType ?? "";
  const name = params.name ?? "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (ext === "pdf") return "pdf";

  return "file";
}

function makeTempFileId(bucket: string, filePath: string) {
  return `firebase|${bucket}|${filePath}`;
}

type SyncFirebaseStorageToMongoParams = {
  prefix?: string;
  limit?: number;
};

export async function syncFirebaseStorageToMongo({
  prefix = "",
  limit = 1000,
}: SyncFirebaseStorageToMongoParams = {}): Promise<SyncResult> {
  const bucket = adminStorage.name;

  console.log(
    "sync start - bucket:",
    bucket,
    "prefix:",
    prefix,
    "limit:",
    limit,
  );

  const [files] = await adminStorage.getFiles({
    prefix,
    autoPaginate: false,
    maxResults: limit,
  });

  console.log("storage files found:", files.length);
  console.log("db name:", CloudFileModel.db.name);
  console.log("collection name:", CloudFileModel.collection.name);

  const docs: CloudFileInput[] = [];
  const results: SyncFileResult[] = [];

  for (const file of files) {
    if (!file.name || file.name.endsWith("/")) continue;

    type StorageMeta = {
      contentType?: string;
      size?: string | number;
      timeCreated?: string;
      updated?: string;
    };

    let meta: StorageMeta | null = null;

    try {
      const [m] = await file.getMetadata();
      meta = m;
    } catch (error) {
      console.warn("metadata 실패:", file.name, error);
    }

    const originalName = path.basename(file.name);
    const mimeType = meta?.contentType ?? "application/octet-stream";
    const size = Number(meta?.size ?? 0);
    const kind = detectKindByMimeOrName({
      mimeType,
      name: originalName,
    });

    docs.push({
      fileId: makeTempFileId(bucket, file.name),
      ownerUid: null,
      userId: null,
      allowedUserUids: [],
      provider: "firebase",
      projectKey: "firebase-old",
      bucket,
      path: file.name,
      storageKey: `firebase|${bucket}|${file.name}`,
      originalName,
      name: originalName,
      mimeType,
      contentType: kind,
      size,
      kind,
      title: "",
      seriesTitle: "",
      episodeNumber: null,
      isPlayable: kind === "video",
      displayOrder: null,
      memo: "",
      tags: [],
      status: "ready",
      metadataStatus: meta ? "complete" : "temp",
      migrationState: "not_required",
      source: "firebase-storage-temp",
      sourceFileRef: "",
      downloadURL: null,
      url: null,
      isTrashed: false,
      trashedAt: null,
      syncedAt: new Date(),
      createdAtStorage: safeDate(meta?.timeCreated),
      updatedAtStorage: safeDate(meta?.updated),
      createdAt: safeDate(meta?.timeCreated) ?? new Date(),
      updatedAt: safeDate(meta?.updated) ?? new Date(),
    });
  }

  console.log("docs prepared:", docs.length);

  const beforeCount = await CloudFileModel.countDocuments({});
  console.log("before count:", beforeCount);

  const existingDocs = await CloudFileModel.find(
    { fileId: { $in: docs.map((doc) => doc.fileId) } },
    { fileId: 1, _id: 0 },
  ).lean<{ fileId: string }[]>();

  const existingSet = new Set(existingDocs.map((doc) => doc.fileId));

  const docsToInsert = docs.filter((doc) => !existingSet.has(doc.fileId));
  const docsToSkip = docs.filter((doc) => existingSet.has(doc.fileId));

  for (const doc of docsToSkip) {
    results.push({
      path: doc.path,
      status: "skipped",
      reason: "DUPLICATE_FILE_ID",
    });
  }

  console.log("docs to insert:", docsToInsert.length);

  for (const doc of docsToInsert) {
    try {
      const result = await CloudFileModel.updateOne(
        { fileId: doc.fileId },
        { $setOnInsert: doc },
        { upsert: true },
      );

      if (result.upsertedCount > 0) {
        results.push({
          path: doc.path,
          status: "inserted",
          reason:
            doc.metadataStatus === "temp"
              ? "INSERTED_AS_TEMP"
              : "INSERTED_AS_COMPLETE",
        });
      } else {
        results.push({
          path: doc.path,
          status: "skipped",
          reason: "ALREADY_EXISTS",
        });
      }
    } catch (error) {
      results.push({
        path: doc.path,
        status: "failed",
        reason: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      });
    }
  }

  const afterCount = await CloudFileModel.countDocuments({});
  console.log("after count:", afterCount);

  const insertedCount = results.filter((r) => r.status === "inserted").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return {
    ok: true,
    scannedCount: docs.length,
    insertedCount,
    skippedCount,
    failedCount,
    beforeCount,
    afterCount,
    results,
  };
}
