import { useEffect, useRef, useState } from "react";
import { useDriveInfiniteFiles } from "../hooks/useDriveInfiniteFiles";
import FileThumbnail from "../components/FileThumbnail";
import type { MeResponse } from "@/shared/types/auth";
import { uploadSingleDriveFile } from "../service/uploadSingleDriveFile";
import { useTranslation } from "react-i18next";
import { flushClientErrorLogs } from "../utils/clientErrorLog";

type PendingUpload = {
  id: string;
  name: string;
  progress: number;
  size: number;
};

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

function mapUploadError(code: string) {
  switch (code) {
    case "UNAUTHORIZED":
    case "MISSING_AUTH_HEADER":
    case "INVALID_AUTH_HEADER":
    case "INVALID_TOKEN":
      return "로그인이 필요합니다.";
    case "MISSING_FILE":
      return "업로드할 파일이 없습니다.";
    case "DUPLICATE_FILE":
      return "같은 이름과 크기의 파일이 이미 존재합니다.";
    case "FAILED_TO_UPLOAD_FILE":
      return "파일 업로드 중 문제가 발생했습니다.";
    default:
      return "알 수 없는 업로드 오류가 발생했습니다.";
  }
}

export default function DrivePage() {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [meError, setMeError] = useState<string | null>(null);

  const { t } = useTranslation();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 앱 시작
  useEffect(() => {
    flushClientErrorLogs();
  }, []);

  // 네트워크 복구
  useEffect(() => {
    const handleOnline = () => {
      flushClientErrorLogs();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // 🔥 서버 복구 대비 (핵심)
  useEffect(() => {
    const interval = setInterval(() => {
      flushClientErrorLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  const { files, loading, loadingMore, error, hasMore, loadMore, reload } =
    useDriveInfiniteFiles({
      token,
      pageSize: 12,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loadingMore, loadMore]);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    setUploadError(null);

    const uploadTasks = selectedFiles.map(async (file) => {
      const uploadId = `${file.name}-${Date.now()}-${Math.random()}`;

      setPendingUploads((prev) => [
        ...prev,
        {
          id: uploadId,
          name: file.name,
          progress: 0,
          size: file.size,
        },
      ]);

      try {
        await uploadSingleDriveFile({
          file,
          onProgress: (progress) => {
            setPendingUploads((prev) =>
              prev.map((item) =>
                item.id === uploadId ? { ...item, progress } : item,
              ),
            );
          },
        });
      } catch (err) {
        const code = err instanceof Error ? err.message : "UNKNOWN_ERROR";
        setUploadError(mapUploadError(code));
      } finally {
        setPendingUploads((prev) =>
          prev.filter((item) => item.id !== uploadId),
        );
      }
    });

    try {
      await Promise.all(uploadTasks);
      await reload();
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-white">{t("app.name")}</h1>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={handleOpenFilePicker}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60 disabled:opacity-50"
          >
            파일 업로드
          </button>
        </div>
      </div>

      {uploadError ? (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {uploadError}
        </div>
      ) : null}

      {files.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 p-6 text-sm text-slate-400">
          표시할 파일이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {files.map((file, index) => {
            const itemKey =
              file.id || file.id || file.path || `fallback-${index}`;
            return (
              <article
                key={itemKey}
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
            );
          })}
        </div>
      )}

      {files.length > 0 && <div ref={loadMoreRef} className="h-10" />}

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

      {pendingUploads.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-3 text-sm font-medium text-slate-200">
            업로드 중
          </div>

          <div className="space-y-3">
            {pendingUploads.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate text-slate-200">{item.name}</span>
                  <span className="shrink-0 text-slate-400">
                    {item.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-500">
                  {(item.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
