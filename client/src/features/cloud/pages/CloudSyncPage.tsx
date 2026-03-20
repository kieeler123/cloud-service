import { useState } from "react";
import type { CloudSyncResult } from "../model/cloudSync.types";
import { runCloudSync } from "../api/cloudSyncApi";

export default function CloudSyncPage() {
  const [result, setResult] = useState<CloudSyncResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    try {
      setLoading(true);
      setError(null);
      const data = await runCloudSync();
      console.log("sync summary", data);
      console.table(data.results);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="mb-4 text-xl font-semibold">Cloud Sync</h1>

      <button
        type="button"
        onClick={handleSync}
        className="rounded-xl border border-slate-700 px-4 py-2"
      >
        {loading ? "동기화 중..." : "동기화 실행"}
      </button>

      {error ? <div className="mt-4 text-red-400">{error}</div> : null}

      {result ? (
        <div className="mt-6 space-y-2 text-sm">
          <div>scannedCount: {result.scannedCount}</div>
          <div>insertedCount: {result.insertedCount}</div>
          <div>skippedCount: {result.skippedCount}</div>
          <div>failedCount: {result.failedCount}</div>
          <div>beforeCount: {result.beforeCount}</div>
          <div>afterCount: {result.afterCount}</div>
        </div>
      ) : null}
    </div>
  );
}
