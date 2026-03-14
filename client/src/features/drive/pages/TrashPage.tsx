import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TrashFile } from "@/shared/types/drive";
import {
  fetchTrashFiles,
  restoreDriveFile,
  deleteDriveFileForever,
} from "../api/trashApi";

function mapTrashError(code: string) {
  switch (code) {
    case "UNAUTHORIZED":
    case "MISSING_AUTH_HEADER":
    case "INVALID_AUTH_HEADER":
    case "INVALID_TOKEN":
      return "로그인이 필요합니다.";
    case "FAILED_TO_FETCH_TRASH_FILES":
      return "휴지통 목록을 불러오지 못했습니다.";
    case "FAILED_TO_RESTORE_FILE":
      return "파일 복원 중 문제가 발생했습니다.";
    case "FAILED_TO_DELETE_FILE":
      return "파일 삭제 중 문제가 발생했습니다.";
    default:
      return "알 수 없는 오류가 발생했습니다.";
  }
}

export default function TrashPage() {
  const { t } = useTranslation();

  const [token, setToken] = useState("");
  const [files, setFiles] = useState<TrashFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("idToken") ?? "";
    setToken(savedToken);
  }, []);

  const loadTrash = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchTrashFiles(token);
      setFiles(result.items);
    } catch (err) {
      const code = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      setError(mapTrashError(code));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadTrash();
  }, [token, loadTrash]);

  const handleRestore = async (fileId: string) => {
    try {
      setBusyId(fileId);
      setError(null);
      await restoreDriveFile(token, fileId);
      await loadTrash();
    } catch (err) {
      const code = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      setError(mapTrashError(code));
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteForever = async (fileId: string) => {
    const ok = window.confirm(
      "이 파일을 완전히 삭제할까요? 복구할 수 없습니다.",
    );
    if (!ok) return;

    try {
      setBusyId(fileId);
      setError(null);
      await deleteDriveFileForever(token, fileId);
      await loadTrash();
    } catch (err) {
      const code = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      setError(mapTrashError(code));
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  if (!token) {
    return (
      <div className="text-sm text-slate-300">로그인 상태가 아닙니다.</div>
    );
  }

  if (loading) {
    return <div className="text-sm text-slate-400">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-base font-semibold sm:text-lg">
        {t("trash.title") ?? "휴지통"}
      </h1>

      {error && <div className="text-sm text-red-300">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="hidden border-b border-slate-800 px-4 py-2 text-[11px] text-slate-400 sm:flex">
          <div className="flex-1">{t("trash.columnName") ?? "파일 이름"}</div>
          <div className="w-44 text-right">
            {t("trash.columnTrashedAt") ?? "삭제된 시간"}
          </div>
          <div className="w-40 text-right">
            {t("trash.columnActions") ?? "작업"}
          </div>
        </div>

        {files.length === 0 ? (
          <div className="px-4 py-6 text-xs text-slate-500">
            {t("trash.empty") ?? "휴지통이 비어 있습니다."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {files.map((file) => {
              const busy = busyId === file.id;

              return (
                <li key={file.id} className="px-4 py-3">
                  <div className="space-y-2 sm:hidden">
                    <div className="min-w-0">
                      <div className="truncate text-sm text-slate-100">
                        {file.name}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {formatDate(file.trashedAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleRestore(file.id)}
                        disabled={busy}
                        className="text-[11px] text-indigo-300 hover:text-indigo-200 disabled:opacity-50"
                      >
                        {t("trash.restore") ?? "복원"}
                      </button>
                      <button
                        onClick={() => handleDeleteForever(file.id)}
                        disabled={busy}
                        className="text-[11px] text-red-300 hover:text-red-200 disabled:opacity-50"
                      >
                        {t("trash.deleteForever") ?? "완전 삭제"}
                      </button>
                    </div>
                  </div>

                  <div className="hidden items-center text-xs sm:flex">
                    <div className="min-w-0 flex-1 truncate">{file.name}</div>

                    <div className="w-44 text-right text-slate-400">
                      {formatDate(file.trashedAt)}
                    </div>

                    <div className="w-40 space-x-3 text-right">
                      <button
                        onClick={() => handleRestore(file.id)}
                        disabled={busy}
                        className="text-[11px] text-indigo-300 hover:text-indigo-200 disabled:opacity-50"
                      >
                        {t("trash.restore") ?? "복원"}
                      </button>
                      <button
                        onClick={() => handleDeleteForever(file.id)}
                        disabled={busy}
                        className="text-[11px] text-red-300 hover:text-red-200 disabled:opacity-50"
                      >
                        {t("trash.deleteForever") ?? "완전 삭제"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
