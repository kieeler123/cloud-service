export function detectDriveFileKind(
  file: File,
): "video" | "document" | "other" {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("application/") || file.type.startsWith("text/")) {
    return "document";
  }
  return "other";
}
