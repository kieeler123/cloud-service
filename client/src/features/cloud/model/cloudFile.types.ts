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

export type CloudFileItem = {
  id: string;
  name: string;
  size: number;
  path: string;
  downloadURL: string | null;
  contentType: string;
  createdAt: string | null;
  isTrashed: boolean;
  metadataStatus?: "temp" | "complete";
};

export type CloudFilesPageResponse = {
  ok: boolean;
  items: CloudFileItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
