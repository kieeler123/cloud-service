type Props = {
  file: {
    name: string;
    downloadURL: string | null;
    contentType?: string;
  };
};

function inferKindByName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(ext)) {
    return "image";
  }
  if (["mp4", "webm", "mov", "m4v", "avi"].includes(ext)) {
    return "video";
  }
  if (["pdf"].includes(ext)) {
    return "pdf";
  }
  return "file";
}

export default function FileThumbnail({ file }: Props) {
  const kind = file.contentType?.startsWith("image/")
    ? "image"
    : file.contentType?.startsWith("video/")
      ? "video"
      : inferKindByName(file.name);

  if (kind === "image" && file.downloadURL) {
    return (
      <img
        src={file.downloadURL}
        alt={file.name}
        className="h-32 w-full rounded-lg object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-32 w-full items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-400">
      FILE
    </div>
  );
}
