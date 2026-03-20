export type SyncFileResult = {
  path: string;
  status: "inserted" | "skipped" | "failed";
  reason?: string;
};

export type CloudSyncResult = {
  ok: true;
  scannedCount: number;
  insertedCount: number;
  skippedCount: number;
  failedCount: number;
  beforeCount: number;
  afterCount: number;
  results: SyncFileResult[];
};
