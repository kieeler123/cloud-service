export type DriveFile = {
  id: string;
  name: string;
  size: number;
  path: string;
  downloadURL: string | null;
  contentType: string;
  createdAt: string | null;
  isTrashed: boolean;
};

export type FetchDriveFilesPageParams = {
  token?: string;
  pageSize: number;
  cursor?: string | null;
};

export type FetchDriveFilesPageResult = {
  ok: boolean;
  items: DriveFile[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type UseDriveInfiniteFilesParams = {
  token: string;
  pageSize?: number;
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

export type TrashFile = {
  id: string;
  name: string;
  size: number;
  downloadURL: string | null;
  path: string;
  createdAt?: string | null;
  trashedAt?: string | null;
};

export type FetchTrashFilesResult = {
  ok: boolean;
  items: TrashFile[];
};

export type RestoreDriveFileParams = {
  token: string;
  fileId: string;
};

export type DeleteDriveFileForeverParams = {
  token: string;
  fileId: string;
};
