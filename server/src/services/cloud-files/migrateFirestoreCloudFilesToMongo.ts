// src/services/cloud-files/migrateFirestoreCloudFilesToMongo.ts

import { CloudFileModel } from "@/features/cloud/models/CloudFile.model.js";
import { mapFirestoreDocToCloudFileInput } from "./mapFirestoreDocToCloudFileInput.js";
import { firestore } from "../../lib/firebaseAdmin.js";

export type MigrateFirestoreCloudFilesOptions = {
  collectionName: string;
  dryRun?: boolean;
  limit?: number;
};

export type MigrateFirestoreCloudFilesResultItem = {
  firestoreDocId: string;
  fileId?: string;
  status: "inserted" | "updated" | "skipped" | "failed";
  reason?: string;
};

export type MigrateFirestoreCloudFilesResult = {
  scannedCount: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  results: MigrateFirestoreCloudFilesResultItem[];
};

export async function migrateFirestoreCloudFilesToMongo(
  options: MigrateFirestoreCloudFilesOptions,
): Promise<MigrateFirestoreCloudFilesResult> {
  const { collectionName, dryRun = false, limit } = options;

  let query: FirebaseFirestore.Query = firestore.collection(collectionName);
  if (typeof limit === "number" && limit > 0) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();

  console.log("sample doc count:", snapshot.size);

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const results: MigrateFirestoreCloudFilesResultItem[] = [];

  for (const doc of snapshot.docs) {
    console.log("doc id:", doc.id);
    console.log("doc data:", doc.data());
    try {
      const sourceData = doc.data() as Record<string, unknown>;
      const mapped = mapFirestoreDocToCloudFileInput(doc.id, sourceData);

      console.log("mapped preview:", {
        firestoreDocId: doc.id,
        fileId: mapped.fileId,
        path: mapped.path,
        originalName: mapped.originalName,
        mimeType: mapped.mimeType,
        size: mapped.size,
      });

      const hasRenderableContent =
        Boolean(mapped.title) ||
        Boolean(mapped.url) ||
        Boolean(mapped.downloadURL) ||
        Boolean(mapped.seriesTitle);

      if (!hasRenderableContent) {
        skippedCount += 1;
        results.push({
          firestoreDocId: doc.id,
          fileId: mapped.fileId,
          status: "skipped",
          reason: "화면에 쓸 최소 정보가 없음",
        });
        continue;
      }

      if (dryRun) {
        skippedCount += 1;
        results.push({
          firestoreDocId: doc.id,
          fileId: mapped.fileId,
          status: "skipped",
          reason: "dryRun",
        });
        continue;
      }

      const existing = await CloudFileModel.findOne({
        fileId: mapped.fileId,
      }).lean();

      if (!existing) {
        await CloudFileModel.create({
          ...mapped,
          createdAt: mapped.createdAt ?? new Date(),
          updatedAt: new Date(),
        });

        insertedCount += 1;
        results.push({
          firestoreDocId: doc.id,
          fileId: mapped.fileId,
          status: "inserted",
        });
      } else {
        await CloudFileModel.updateOne(
          { fileId: mapped.fileId },
          {
            $set: {
              ...mapped,
              updatedAt: new Date(),
              syncedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: mapped.createdAt ?? new Date(),
            },
          },
          { upsert: true },
        );

        updatedCount += 1;
        results.push({
          firestoreDocId: doc.id,
          fileId: mapped.fileId,
          status: "updated",
        });
      }
    } catch (error) {
      failedCount += 1;
      results.push({
        firestoreDocId: doc.id,
        status: "failed",
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    scannedCount: snapshot.size,
    insertedCount,
    updatedCount,
    skippedCount,
    failedCount,
    results,
  };
}
