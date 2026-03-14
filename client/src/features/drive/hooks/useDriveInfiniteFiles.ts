import { useCallback, useEffect, useState } from "react";
import { fetchDriveFilesPage } from "../service/fetchDriveFilesPage";
import type {
  DriveFile,
  UseDriveInfiniteFilesParams,
} from "@/shared/types/drive";

export function useDriveInfiniteFiles({
  token,
  pageSize = 10,
}: UseDriveInfiniteFilesParams) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    if (!token || token === "undefined") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchDriveFilesPage({
        token,
        pageSize,
        cursor: null,
      });

      setFiles(result.items);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [token, pageSize]);

  const loadMore = useCallback(async () => {
    if (!token || token === "undefined") return;
    if (!hasMore || loadingMore || !nextCursor) return;

    try {
      setLoadingMore(true);
      setError(null);

      const result = await fetchDriveFilesPage({
        token,
        pageSize,
        cursor: nextCursor,
      });

      setFiles((prev) => [...prev, ...result.items]);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingMore(false);
    }
  }, [token, hasMore, loadingMore, nextCursor, pageSize]);

  useEffect(() => {
    if (!token || token === "undefined") return;
    loadInitial();
  }, [token, loadInitial]);

  return {
    files,
    loading,
    loadingMore,
    error,
    hasMore,
    reload: loadInitial,
    loadMore,
  };
}
