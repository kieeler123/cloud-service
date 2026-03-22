export type DriveFileKind =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "archive"
  | "other";

export type UploadCloudFileParams = {
  ownerUid: string;
  file: Express.Multer.File;
};

export type UploadCloudFileResult = {
  fileId: string;
  path: string;
  downloadURL: string;
};

export type CloudFileMeta = {
  id: string;
  ownerUid: string;
  name: string;
  size: number;
  mimeType: string;
  kind: DriveFileKind;
  provider: "firebase" | "supabase";
  storagePath: string;
  downloadURL: string;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
};
