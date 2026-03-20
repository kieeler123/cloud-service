import type { CloudSyncResult } from "../model/cloudSync.types";

export async function runCloudSync(): Promise<CloudSyncResult> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/cloud-sync/sync`,
  );

  if (!res.ok) {
    throw new Error("FAILED_TO_RUN_SYNC");
  }

  return {
    ok: true,
    scannedCount: 0,
    insertedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    beforeCount: 0,
    afterCount: 0,
    results: [],
  };
}
