export type CloudFileStatus = "ready" | "trashed";
export type CloudFileMetadataStatus = "temp" | "complete";
export type CloudFileSource =
  | "firebase-storage-temp"
  | "firebase-storage"
  | "new-upload";

export type CloudFileKind = "image" | "video" | "audio" | "pdf" | "file";

export type CloudFileDoc = {
  fileId: string;

  ownerUid?: string | null;
  userId?: string | null;
  allowedUserUids?: string[];

  provider?: string;
  projectKey?: string;
  bucket?: string;
  path: string;
  storageKey?: string;

  originalName: string;
  name?: string;

  mimeType: string;
  contentType?: string;

  size: number;
  kind: CloudFileKind;

  title?: string;
  seriesTitle?: string;
  episodeNumber?: number | null;
  isPlayable?: boolean;
  displayOrder?: number | null;
  memo?: string;
  tags?: string[];

  status: CloudFileStatus;
  metadataStatus: CloudFileMetadataStatus;
  migrationState?: string;
  source: CloudFileSource;
  sourceFileRef?: string;

  downloadURL?: string | null;
  url?: string | null;

  isTrashed: boolean;
  trashedAt?: Date | null;

  createdAtStorage?: Date | null;
  updatedAtStorage?: Date | null;
  syncedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export type CloudFileInput = Omit<CloudFileDoc, "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type FirestoreCloudFileSourceDoc = {
  ownerUid?: string | null;
  userId?: string | null;
  allowedUserUids?: string[];
  provider?: string;
  projectKey?: string;
  bucket?: string;
  path?: string;
  storageKey?: string;
  originalName?: string;
  name?: string;
  mimeType?: string;
  contentType?: string;
  size?: number;
  kind?: CloudFileKind;
  title?: string;
  seriesTitle?: string;
  episodeNumber?: number | null;
  isPlayable?: boolean;
  displayOrder?: number | null;
  memo?: string;
  tags?: string[];
  status?: CloudFileStatus;
  metadataStatus?: CloudFileMetadataStatus;
  migrationState?: string;
  source?: CloudFileSource;
  sourceFileRef?: string;
  downloadURL?: string | null;
  url?: string | null;
  isTrashed?: boolean;
  trashedAt?: Date | string | null;
  createdAtStorage?: Date | string | null;
  updatedAtStorage?: Date | string | null;
  syncedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  [key: string]: unknown;
};
