import { useEffect, useState } from "react";
import { useDriveInfiniteFiles } from "../hooks/useDriveInfiniteFiles";
import FileThumbnail from "../components/FileThumbnail";
import type { MeResponse } from "@/shared/types/auth";

async function fetchMe(token: string): Promise<MeResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch me");
  }

  return res.json();
}

export default function DrivePage() {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [meError, setMeError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("idToken") ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      setReady(false);
      setMeError(null);
      return;
    }

    fetchMe(token)
      .then(() => {
        setReady(true);
        setMeError(null);
      })
      .catch((err) => {
        setReady(false);
        setMeError(err instanceof Error ? err.message : "Unknown error");
      });
  }, [token]);

  const { files, loading, loadingMore, error, hasMore, loadMore } =
    useDriveInfiniteFiles({
      token,
      pageSize: 12,
    });

  if (!token) {
    return (
      <div className="p-6 text-sm text-slate-400">로그인이 필요합니다.</div>
    );
  }

  if (meError) {
    return <div className="p-6 text-sm text-red-400">{meError}</div>;
  }

  if (!ready || loading) {
    return <div className="p-6 text-sm text-slate-400">불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-400">{error}</div>;
  }

  return (
    <section className="p-6">
      <h1 className="mb-4 text-xl font-semibold text-white">Drive</h1>

      {files.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 p-6 text-sm text-slate-400">
          표시할 파일이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <article
              key={file.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
            >
              <FileThumbnail file={file} />
              <div className="p-3">
                <div className="truncate text-sm text-white">{file.name}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-50"
          >
            {loadingMore ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
