import type {
  DeleteDriveFileForeverParams,
  FetchTrashFilesResult,
  RestoreDriveFileParams,
} from "@/shared/types/drive";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchTrashFiles(
  token: string,
): Promise<FetchTrashFilesResult> {
  const res = await fetch(`${baseUrl}/api/cloud-files/trash`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trash files");
  }

  return res.json();
}

export async function restoreDriveFile({
  token,
  fileId,
}: RestoreDriveFileParams) {
  const res = await fetch(`${baseUrl}/api/cloud-files/${fileId}/restore`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to restore file");
  }

  return res.json();
}

export async function deleteDriveFileForever({
  token,
  fileId,
}: DeleteDriveFileForeverParams) {
  const res = await fetch(`${baseUrl}/api/cloud-files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete file forever");
  }

  return res.json();
}
