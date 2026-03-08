// FileGrid.tsx
type FileItem = {
  id: string;
  name: string;
  size: number; // bytes
  createdAt: string;
  type: "file" | "folder";
};

interface FileGridProps {
  items: FileItem[];
}

export function FileGrid({ items }: FileGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">My Drive</h1>
        <span className="text-xs text-slate-400">
          {items.length} item{items.length !== 1 && "s"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <FileCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function FileCard({ item }: { item: FileItem }) {
  const isFolder = item.type === "folder";

  return (
    <button className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-indigo-500 hover:bg-slate-900 transition">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs">
          {isFolder ? "📁" : "📄"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-medium">{item.name}</div>
          <div className="text-[11px] text-slate-400">
            {isFolder ? "Folder" : formatSize(item.size)} ·{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </button>
  );
}

function formatSize(size: number) {
  if (size > 1024 * 1024 * 1024)
    return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + " MB";
  if (size > 1024) return (size / 1024).toFixed(1) + " KB";
  return size + " B";
}
