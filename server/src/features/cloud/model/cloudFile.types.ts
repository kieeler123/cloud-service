export type CloudFile = {
  fileId: string;
  ownerUid: string;

  allowedUserUids: string[];

  provider: string;
  projectKey: string;
  bucket: string;
  path: string;
  storageKey: string;

  originalName: string;
  mimeType: string;
  size: number;
  kind: string;

  title?: string;
  seriesTitle?: string;
  episodeNumber?: number;

  contentType?: string;
  isPlayable?: boolean;
  displayOrder?: number;

  memo?: string;
  tags?: string[];

  status: "ready" | "trashed" | "deleted";

  createdAt: string;
  updatedAt: string;
  trashedAt?: string;
};
