type Params = {
  ownerUid: string;
  name: string;
  size: number;
};

export async function trashDuplicateDriveFiles(params: Params) {
  const res = await fetch("/api/cloud-files/trash-duplicates", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to trash duplicate files");
  }

  return res.json();
}
