// src/services/cloud-files/mapFirestoreDocToCloudFileInput.ts
import {
  CloudFileInput,
  CloudFileKind,
  CloudFileSource,
} from "../../types/cloudFile.types.js";

type FirestoreSourceDoc = Record<string, unknown>;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}

function guessKindFromUrls(video?: string, thumbnail?: string): CloudFileKind {
  if (video) return "video";
  if (thumbnail) return "image";
  return "file";
}

function extractFilenameFromUrl(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/\/o\/([^?]+)/);
    if (!match) return undefined;

    const path = match[1];
    const parts = path.split("/");
    return parts[parts.length - 1];
  } catch {
    return undefined;
  }
}

function normalizeSource(value: unknown): CloudFileSource {
  if (
    value === "firebase-storage-temp" ||
    value === "firebase-storage" ||
    value === "new-upload"
  ) {
    return value;
  }
  return "firebase-storage-temp";
}

export function mapFirestoreDocToCloudFileInput(
  firestoreDocId: string,
  data: FirestoreSourceDoc,
): CloudFileInput {
  const title = asString(data.title);
  const subtitle = asString(data.subtitle);
  const video = asString(data.video);
  const thumbnail = asString(data.thumbnail);
  const reel = asString(data.reel);
  const genre = asString(data.genre);
  const season = asString(data.season);
  const episode = asString(data.episode);
  const dateText = asString(data.date);
  const actors = asStringArray(data.actor) ?? [];

  const path =
    asString(data.path) ??
    asString(data.storagePath) ??
    asString(data.fullPath) ??
    "";

  const originalName =
    asString(data.originalName) ??
    asString(data.name) ??
    extractFilenameFromUrl(video) ??
    extractFilenameFromUrl(thumbnail) ??
    title ??
    firestoreDocId;

  const kind =
    (asString(data.kind) as CloudFileKind | undefined) ??
    guessKindFromUrls(video, thumbnail);

  const episodeNumber = asNumber(data.episode) ?? null;

  const memoParts = [
    subtitle ? `subtitle: ${subtitle}` : null,
    reel ? `reel: ${reel}` : null,
    season ? `season: ${season}` : null,
    episode ? `episode: ${episode}` : null,
    dateText ? `date: ${dateText}` : null,
  ].filter(Boolean);

  const memo = memoParts.length ? memoParts.join("\n") : undefined;

  const tags = [
    ...(genre ? [genre] : []),
    ...(season ? [`season-${season}`] : []),
    ...(episode ? [`episode-${episode}`] : []),
    ...actors.slice(0, 20),
  ];

  return {
    fileId: asString(data.fileId) ?? firestoreDocId,

    ownerUid: asString(data.ownerUid) ?? null,
    userId: asString(data.userId) ?? null,
    allowedUserUids: [],

    provider: "firebase",
    projectKey: asString(data.projectKey),
    bucket: asString(data.bucket),
    path,
    storageKey: asString(data.storageKey),

    originalName,
    name: subtitle ?? title,

    mimeType:
      kind === "video"
        ? "video/mp4"
        : kind === "image"
          ? "image/jpeg"
          : "application/octet-stream",
    contentType: undefined,

    size: asNumber(data.size) ?? 0,
    kind,

    title: title ?? originalName,
    seriesTitle: title,
    episodeNumber,
    isPlayable: kind === "video",
    displayOrder: asNumber(data.displayOrder) ?? null,
    memo,
    tags,

    status: data.status === "trashed" ? "trashed" : "ready",
    metadataStatus: "temp",
    migrationState: "migrated-from-firestore-loose",
    source: normalizeSource(data.source),
    sourceFileRef: firestoreDocId,

    downloadURL: video ?? thumbnail ?? null,
    url: video ?? thumbnail ?? null,

    isTrashed: false,
    trashedAt: null,

    createdAtStorage: null,
    updatedAtStorage: null,
    syncedAt: new Date(),
    updatedAt: new Date(),
  };
}
