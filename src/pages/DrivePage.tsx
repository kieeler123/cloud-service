// src/pages/DrivePage.tsx
import { useEffect, useState } from "react";
import { auth, db, storage } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import FileThumbnail from "../components/FileThumbnail";

type DriveFile = {
  id: string;
  name: string;
  size: number;
  path: string;
  downloadURL: string;
  contentType?: string; // ✅ 썸네일 분기용
  createdAt?: { seconds: number; nanoseconds: number } | null;
  isTrashed?: boolean;
};

export default function DrivePage() {
  const { t } = useTranslation();
  const user = auth.currentUser;

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-sm text-slate-300">로그인 상태가 아닙니다.</div>
    );
  }

  // Firestore에서 ownerUid 기준으로 가져오고, JS에서 휴지통 제외 필터
  useEffect(() => {
    const q = query(
      collection(db, "files"),
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: DriveFile[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as any;
            return {
              id: docSnap.id,
              name: data.name,
              size: data.size,
              path: data.path,
              downloadURL: data.downloadURL,
              contentType: data.contentType ?? "", // ✅ 추가
              createdAt: data.createdAt ?? null,
              isTrashed: data.isTrashed ?? false,
            };
          })
          .filter((f) => !f.isTrashed);

        setFiles(list);
      },
      (err) => {
        console.error(err);
        setError(
          t("drive.loadError") ?? "데이터를 불러오는 중 오류가 발생했습니다."
        );
      }
    );

    return () => unsub();
  }, [user.uid, t]);

  // 파일 업로드
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const path = `uploads/${user.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (err) => {
        console.error(err);
        setError(t("drive.uploadError") ?? "업로드 중 오류가 발생했습니다.");
        setUploading(false);
        setUploadProgress(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const newFileRef = doc(collection(db, "files"));

          await setDoc(newFileRef, {
            ownerUid: user.uid,
            name: file.name,
            size: file.size,
            path,
            downloadURL,
            contentType: file.type, // ✅ 핵심: 이미지/영상 구분 정보 저장
            createdAt: serverTimestamp(),
            isTrashed: false,
          });
        } catch (err) {
          console.error(err);
          setError(
            t("drive.saveError") ??
              "업로드 후 데이터 저장 중 오류가 발생했습니다."
          );
        } finally {
          setUploading(false);
          setUploadProgress(null);
          // 같은 파일 다시 선택 가능하게 input 초기화
          e.target.value = "";
        }
      }
    );
  };

  // 휴지통으로 보내기
  const moveToTrash = async (file: DriveFile) => {
    if (!window.confirm("이 파일을 휴지통으로 이동할까요?")) return;

    try {
      await updateDoc(doc(db, "files", file.id), {
        isTrashed: true,
        trashedAt: new Date(),
      });
    } catch (err) {
      console.error(err);
      setError("휴지통 이동 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (ts?: { seconds: number; nanoseconds: number } | null) => {
    if (!ts) return "-";
    return new Date(ts.seconds * 1000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 타이틀 + 업로드 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base sm:text-lg font-semibold">
          {t("drive.title") ?? "내 드라이브"}
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <label className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-indigo-400 cursor-pointer disabled:opacity-60 w-full sm:w-auto">
            <span>
              {uploading
                ? t("drive.uploading") ?? "업로드 중..."
                : `+ ${t("drive.uploadButton") ?? "Upload"}`}
            </span>
            <input
              type="file"
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
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - uploadProgress}% 0 0)` }}
              >
                <span className="text-[10px] font-semibold text-slate-900">
                  {uploadProgress}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-red-300 text-sm">{error}</div>}

      {/* 파일 리스트 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        {/* 헤더: sm 이상 */}
        <div className="hidden sm:flex px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex-1">{t("drive.columnName") ?? "파일 이름"}</div>
          <div className="w-24 text-right">
            {t("drive.columnSize") ?? "크기"}
          </div>
          <div className="w-44 text-right">
            {t("drive.columnCreatedAt") ?? "업로드 시간"}
          </div>
          <div className="w-40 text-right">
            {t("drive.columnActions") ?? "작업"}
          </div>
        </div>

        {files.length === 0 ? (
          <div className="px-4 py-6 text-xs text-slate-500">
            {t("drive.empty") ??
              "아직 업로드된 파일이 없습니다. 업로드 버튼을 눌러 파일을 추가하세요."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {files.map((file) => (
              <li key={file.id} className="px-4 py-3">
                {/* 모바일: 썸네일 카드 */}
                <div className="sm:hidden space-y-2">
                  <div className="grid grid-cols-[96px_1fr] gap-3 items-start">
                    <div className="w-24">
                      <FileThumbnail file={file} />
                    </div>

                    <div className="min-w-0">
                      <span className="block truncate text-sm text-slate-100">
                        {file.name}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                        <span>{((file.size ?? 0) / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{formatDate(file.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <a
                      href={file.downloadURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-300 hover:text-indigo-200"
                    >
                      {t("drive.download") ?? "다운로드"}
                    </a>
                    <button
                      onClick={() => moveToTrash(file)}
                      className="text-[11px] text-red-300 hover:text-red-200"
                    >
                      {t("drive.moveToTrash") ?? "휴지통"}
                    </button>
                  </div>
                </div>

                {/* 데스크톱: 테이블 행 */}
                <div className="hidden sm:flex items-center text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{file.name}</span>
                  </div>

                  <div className="w-24 text-right">
                    {((file.size ?? 0) / 1024).toFixed(1)} KB
                  </div>

                  <div className="w-44 text-right text-slate-400">
                    {formatDate(file.createdAt)}
                  </div>

                  <div className="w-40 text-right space-x-3">
                    <a
                      href={file.downloadURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-300 hover:text-indigo-200"
                    >
                      {t("drive.download") ?? "다운로드"}
                    </a>
                    <button
                      onClick={() => moveToTrash(file)}
                      className="text-[11px] text-red-300 hover:text-red-200"
                    >
                      {t("drive.moveToTrash") ?? "휴지통"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
