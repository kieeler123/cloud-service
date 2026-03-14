// src/features/cloud/api/cloudFilesApi.ts

console.log("cloudFilesApi module loaded");

export async function fetchCloudFiles() {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/cloud-files`,
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.code || "UNKNOWN_ERROR");
  }

  return res.json();
}

export async function createCloudFileMeta(payload: unknown) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/cloud-files`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to create cloud file meta");
  }

  return res.json();
}

export async function trashCloudFilesMeta(fileIds: string[]) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/cloud-files/trash`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileIds }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to trash cloud file meta");
  }

  return res.json();
}
