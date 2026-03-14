export type DriveFile = {
  id: string;
  name: string;
  size: number;
  path: string;
  downloadURL: string;
  contentType?: string;
  createdAt?: string | null;
  isTrashed?: boolean;
};

export type FetchDriveFilesPageParams = {
  pageSize: number;
  cursor?: string | null;
};

export type FetchDriveFilesPageResult = {
  ok: boolean;
  items: DriveFile[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type TrashDuplicateDriveFilesParams = {
  ownerUid: string;
  name: string;
  size: number;
};

export type TrashDuplicateDriveFilesResult = {
  ok: boolean;
  count: number;
  ids: string[];
};

export type FindDriveFilesPageParams = {
  ownerUid: string;
  pageSize: number;
  cursor?: string | null;
};

export type RestoreCloudFileParams = {
  ownerUid: string;
  fileId: string;
};

export type DeleteCloudFileForeverParams = {
  ownerUid: string;
  fileId: string;
};
