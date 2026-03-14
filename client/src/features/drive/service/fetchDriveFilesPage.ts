import type {
  FetchDriveFilesPageParams,
  FetchDriveFilesPageResult,
} from "@/shared/types/drive";

export async function fetchDriveFilesPage({
  token,
  pageSize,
  cursor,
}: FetchDriveFilesPageParams): Promise<FetchDriveFilesPageResult> {
  if (!token || token === "undefined") {
    throw new Error("Missing auth token");
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const qs = new URLSearchParams({
    limit: String(pageSize),
  });

  if (cursor) {
    qs.set("cursor", cursor);
  }

  const res = await fetch(`${baseUrl}/api/cloud-files?${qs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch drive files");
  }

  return res.json();
}
