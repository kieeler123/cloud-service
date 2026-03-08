import { useCallback, useEffect, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  fetchDriveFilesPage,
  type DriveFile,
} from "../service/fetchDriveFilesPage";

type Params = {
  ownerUid: string;
  pageSize?: number;
};

export function useDriveInfiniteFiles({ ownerUid, pageSize = 10 }: Params) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchDriveFilesPage({
        ownerUid,
        pageSize,
      });

      setFiles(result.items);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [ownerUid, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastVisible) return;

    try {
      setLoadingMore(true);
      setError(null);

      const result = await fetchDriveFilesPage({
        ownerUid,
        pageSize,
        lastVisible,
      });

      setFiles((prev) => [...prev, ...result.items]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastVisible, ownerUid, pageSize]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

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
