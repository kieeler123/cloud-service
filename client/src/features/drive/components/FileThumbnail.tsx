type Props = {
  file: {
    name: string;
    downloadURL: string;
    contentType?: string;
  };
};

function inferKindByName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(ext))
    return "image";
  if (["mp4", "webm", "mov", "m4v", "avi"].includes(ext)) return "video";
  return "file";
}

export default function FileThumbnail({ file }: Props) {
  const kind = file.contentType?.startsWith("image/")
    ? "image"
    : file.contentType?.startsWith("video/")
    ? "video"
    : inferKindByName(file.name);

  if (kind === "image") {
    return (
      <img
        src={file.downloadURL}
        alt={file.name}
        className="h-32 w-full object-cover rounded-lg"
        loading="lazy"
      />
    );
  }

  // 그 외 파일
  return (
    <div className="h-32 w-full flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 text-xs">
      FILE
    </div>
  );
}
