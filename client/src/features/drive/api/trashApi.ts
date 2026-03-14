import type { TrashFile } from "@/shared/types/drive";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

type FetchTrashFilesResult = {
  ok: boolean;
  items: TrashFile[];
};

export async function fetchTrashFiles(
  token: string,
): Promise<FetchTrashFilesResult> {
  const res = await fetch(`${baseUrl}/api/cloud-files/trash`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.code || "FAILED_TO_FETCH_TRASH_FILES");
  }

  return data;
}

export async function restoreDriveFile(token: string, fileId: string) {
  const res = await fetch(`${baseUrl}/api/cloud-files/${fileId}/restore`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.code || "FAILED_TO_RESTORE_FILE");
  }

  return data;
}

export async function deleteDriveFileForever(token: string, fileId: string) {
  const res = await fetch(`${baseUrl}/api/cloud-files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.code || "FAILED_TO_DELETE_FILE");
  }

  return data;
}
