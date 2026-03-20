import { adminDb } from "../../../lib/firebaseAdmin.js";

type CreateCloudFileMetaParams = {
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

  title: string;
  seriesTitle: string;
  episodeNumber: number | null;
  contentType: string;
  isPlayable: boolean;
  displayOrder: number | null;
  memo: string;
  tags: string[];

  status: string;
  migrationState: string;
  source: string;
  sourceFileRef: string;

  createdAt: string;
  updatedAt: string;
};

export async function createCloudFileMeta(params: CreateCloudFileMetaParams) {
  await adminDb.collection("cloudFileMeta").doc(params.fileId).set(params);
}
