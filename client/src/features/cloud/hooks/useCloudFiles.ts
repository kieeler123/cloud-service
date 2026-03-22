import { useEffect, useState } from "react";
import { fetchCloudFiles } from "../api/cloudFilesApi";
import type { CloudFileMeta } from "../model/cloudFile.types";
import { createClientErrorLog } from "@/features/drive/utils/clientErrorLog";

console.log("useCloudFiles module loaded");

export function useCloudFiles() {
  console.log("useCloudFiles called");

  const [files, setFiles] = useState<CloudFileMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const result = await fetchCloudFiles();

        setFiles(result.items ?? []);
        setError(null);
      } catch (error) {
        console.error("fetch failed:", error);

        setError("Failed to fetch files");

        createClientErrorLog({
          action: "LIST_FILES",
          code: "CLIENT_FETCH_FAILED",
          message: "Failed to fetch files",
          rawMessage: error instanceof Error ? error.message : String(error),
          meta: {
            endpoint: "/api/cloud-files",
          },
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { files, loading, error };
}
