// src/features/cloud/model/cloudFile.types.ts

export type CloudFileMeta = {
  fileId: string;

  originalName: string;
  title: string;

  ownerId: string;

  storageProvider: "firebase-old" | "firebase-new" | "supabase";
  storageBucket: string;
  storagePath: string;

  fileSize: number;
  mimeType: string;

  kind: "video" | "document" | "other";

  status: "uploading" | "ready" | "failed" | "trashed" | "deleted";

  createdAt: Date;
  updatedAt: Date;
};
