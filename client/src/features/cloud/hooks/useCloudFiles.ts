import { useEffect, useState } from "react";
import { fetchCloudFiles } from "../api/cloudFilesApi";
import type { CloudFileMeta } from "../model/cloudFile.types";

console.log("useCloudFiles module loaded");

export function useCloudFiles() {
  console.log("useCloudFiles called");

  const [files, setFiles] = useState<CloudFileMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        console.log("useCloudFiles load started");
        const data = await fetchCloudFiles();
        console.log("fetched data", data);
        setFiles(data);
      } catch (err) {
        console.error("useCloudFiles error", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { files, loading, error };
}
