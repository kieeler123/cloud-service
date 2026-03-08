import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { useTranslation } from "react-i18next";
import FileThumbnail from "../components/FileThumbnail";
import {
  buildDuplicateNamesText,
  dedupeSelectedFilesKeepLast,
  findDuplicateFiles,
  findDuplicatesWithinSelection,
} from "../utils/fileDuplicate";
import { uploadSingleDriveFile } from "../service/uploadSingleDriveFile";
import { useDriveInfiniteFiles } from "../hooks/useDriveInfiniteFiles";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trashDuplicateDriveFiles } from "../service/trashDuplicateDriveFiles";
import { trashCloudFilesMeta } from "@/features/cloud/api/cloudFilesApi";

export default function DrivePage() {
  const { t } = useTranslation();
  const user = auth.currentUser;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-sm text-slate-300">로그인 상태가 아닙니다.</div>
    );
  }

  const { files, loading, loadingMore, error, hasMore, loadMore, reload } =
    useDriveInfiniteFiles({
      ownerUid: user.uid,
      pageSize: 10,
    });

  const { targetRef } = useInfiniteScroll({
    onIntersect: loadMore,
    enabled: hasMore && !loadingMore,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    // 1) 선택 목록 내부 중복 검사
    const duplicatesInSelection = findDuplicatesWithinSelection(selectedFiles);

    let filesToProcess = selectedFiles;

    if (duplicatesInSelection.length > 0) {
      const names = buildDuplicateNamesText(duplicatesInSelection);

      const shouldKeepLatestOnly = window.confirm(
        `선택한 파일 목록 안에 중복 파일이 있습니다.\n\n${names}\n\n같은 파일은 마지막으로 선택된 것만 남기고 계속 진행할까요?`,
      );

      if (!shouldKeepLatestOnly) {
        e.target.value = "";
        return;
      }

      filesToProcess = dedupeSelectedFilesKeepLast(selectedFiles);
    }

    // 2) 이미 업로드된 파일과 중복 검사
    const duplicatesInDrive = findDuplicateFiles(filesToProcess, files);

    if (duplicatesInDrive.length > 0) {
      const names = buildDuplicateNamesText(duplicatesInDrive);

      const shouldTrashExisting = window.confirm(
        `이미 업로드된 중복 파일이 있습니다.\n\n${names}\n\n기존 파일을 휴지통으로 보내고 새 파일로 대체할까요?`,
      );

      if (!shouldTrashExisting) {
        const shouldSkipDuplicates = window.confirm(
          `기존 중복 파일은 유지하고, 중복되지 않은 새 파일만 업로드할까요?`,
        );

        if (!shouldSkipDuplicates) {
          e.target.value = "";
          return;
        }

        const duplicateSet = new Set(
          duplicatesInDrive.map((f) => `${f.name}__${f.size}`),
        );

        filesToProcess = filesToProcess.filter(
          (file) => !duplicateSet.has(`${file.name}__${file.size}`),
        );
      } else {
        for (const duplicate of duplicatesInDrive) {
          const trashedResult = await trashDuplicateDriveFiles({
            ownerUid: user.uid,
            name: duplicate.name,
            size: duplicate.size,
          });

          if (trashedResult.ids.length > 0) {
            await trashCloudFilesMeta(trashedResult.ids);
          }
        }
      }
    }

    if (filesToProcess.length === 0) {
      setUploadError("업로드할 새 파일이 없습니다.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < filesToProcess.length; i += 1) {
        const file = filesToProcess[i];

        try {
          await uploadSingleDriveFile({
            file,
            ownerUid: user.uid,
            onProgress: (progress) => setUploadProgress(progress),
          });

          successCount += 1;
        } catch (err) {
          console.error("[handleUpload] failed file =", file.name, err);
          failCount += 1;
        }
      }

      if (failCount > 0) {
        setUploadError(
          `업로드 완료: 성공 ${successCount}개 / 실패 ${failCount}개`,
        );
      }

      await reload();
    } catch (err) {
      console.error(err);
      setUploadError(
        t("drive.uploadError") ?? "업로드 중 오류가 발생했습니다.",
      );
    } finally {
      setUploading(false);
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-400">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base sm:text-lg font-semibold">
          {t("drive.title") ?? "내 드라이브"}
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <label className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-indigo-400 cursor-pointer disabled:opacity-60 w-full sm:w-auto">
            <span>
              {uploading
                ? (t("drive.uploading") ?? "업로드 중...")
                : `+ ${t("drive.uploadButton") ?? "Upload"}`}
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>

          {uploading && uploadProgress !== null && (
            <div className="w-full sm:w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-indigo-400 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-semibold text-slate-200">
                  {uploadProgress}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {uploadError && <div className="text-red-300 text-sm">{uploadError}</div>}
      {error && <div className="text-red-300 text-sm">{error}</div>}

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        {files.length === 0 ? (
          <div className="px-4 py-6 text-xs text-slate-500">
            {t("drive.empty") ?? "파일이 없습니다."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {files.map((file) => (
              <li key={file.id} className="px-4 py-3">
                <div className="grid grid-cols-[96px_1fr] gap-3 items-start sm:hidden">
                  <div className="w-24">
                    <FileThumbnail file={file} />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate text-sm text-slate-100">
                      {file.name}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{file.name}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div ref={targetRef} className="h-10 flex items-center justify-center">
          {loadingMore ? (
            <span className="text-xs text-slate-400">더 불러오는 중...</span>
          ) : !hasMore ? (
            <span className="text-xs text-slate-500">마지막 파일입니다.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
