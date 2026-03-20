import type {
  CloudFilesPageResponse,
  CloudFileItem,
} from "../../cloud/model/cloudFile.types";

type FetchDriveFilesPageParams = {
  token: string;
  pageSize: number;
  cursor?: string | null;
};

type RawMongoCloudFile = {
  _id?: string;
  fileId?: string;
  originalName?: string;
  name?: string;
  size?: number;
  path?: string;
  downloadURL?: string | null;
  mimeType?: string;
  contentType?: string;
  createdAt?: string | null;
  isTrashed?: boolean;
  metadataStatus?: "temp" | "complete";
};

type RawCloudFilesResponse = {
  ok: boolean;
  items: RawMongoCloudFile[];
  nextCursor?: string | null;
  hasMore?: boolean;
};

function mapMongoFileToUi(file: RawMongoCloudFile): CloudFileItem {
  return {
    id: file.fileId ?? file._id ?? "",
    name: file.originalName ?? file.name ?? "untitled",
    size: file.size ?? 0,
    path: file.path ?? "",
    downloadURL: file.downloadURL ?? null,
    contentType:
      file.mimeType ?? file.contentType ?? "application/octet-stream",
    createdAt: file.createdAt ?? null,
    isTrashed: file.isTrashed ?? false,
    metadataStatus: file.metadataStatus,
  };
}

export async function fetchDriveFilesPage({
  token,
  pageSize,
  cursor,
}: FetchDriveFilesPageParams): Promise<CloudFilesPageResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const query = new URLSearchParams();

  query.set("limit", String(pageSize));
  if (cursor) query.set("cursor", cursor);

  const res = await fetch(`${baseUrl}/api/cloud-files?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cloud files");
  }

  const json = (await res.json()) as RawCloudFilesResponse;

  return {
    ok: json.ok,
    items: (json.items ?? []).map(mapMongoFileToUi),
    nextCursor: json.nextCursor ?? null,
    hasMore: json.hasMore ?? false,
  };
}
