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

type DriveFile = {
  id: string;
  name: string;
  size: number;
  path: string;
  downloadURL: string;
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

  // 🔥 Firestore에서 ownerUid 기준으로만 가져오고, JS에서 필터링
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
              createdAt: data.createdAt ?? null,
              isTrashed: data.isTrashed ?? false,
            };
          })
          .filter((f) => !f.isTrashed); // 🔥 휴지통 아닌 파일만 표시

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

  // 🔥 파일 업로드
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
        }
      }
    );
  };

  // 🔥 휴지통으로 보내기
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
      <h1 className="text-lg font-semibold">
        {t("drive.title") ?? "내 드라이브"}
      </h1>

      {error && <div className="text-red-300 text-sm">{error}</div>}

      {/* 업로드 박스 */}
      <div className="inline-flex items-center gap-4">
        <label className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-indigo-400 cursor-pointer disabled:opacity-60">
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
          <div className="mt-2 w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
            {/* 채워지는 바 */}
            <div
              className="h-full bg-indigo-400 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />

            {/* 1층: 전체 영역에 깔리는 밝은 글자 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-slate-200">
                {uploadProgress}%
              </span>
            </div>

            {/* 2층: '채워진 부분'만 보이는 어두운 글자 */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                // 오른쪽을 (100 - 진행률)% 만큼 잘라서,
                // 왼쪽 = 바가 찬 부분에만 이 레이어가 보이게 됨
                clipPath: `inset(0 ${100 - uploadProgress}% 0 0)`,
              }}
            >
              <span className="text-[10px] font-semibold text-slate-900">
                {uploadProgress}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 파일 리스트 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400 flex">
          <div className="flex-1">{t("drive.columnName") ?? "파일 이름"}</div>
          <div className="w-32 text-right">
            {t("drive.columnSize") ?? "크기"}
          </div>
          <div className="w-48 text-right">
            {t("drive.columnCreatedAt") ?? "업로드 시간"}
          </div>
          <div className="w-32 text-right">
            {t("drive.columnActions") ?? "작업"}
          </div>
        </div>

        {files.length === 0 ? (
          <div className="px-4 py-6 text-xs text-slate-500">
            {t("drive.empty") ??
              "아직 업로드된 파일이 없습니다. 오른쪽 상단의 업로드 버튼을 눌러 파일을 추가하세요."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-800 text-xs">
            {files.map((file) => (
              <div className="flex-1 min-w-0">
                <span className="block truncate">{file.name}</span>
                <div className="w-32 text-right">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
                <div className="w-48 text-right text-slate-400">
                  {formatDate(file.createdAt)}
                </div>

                <div className="w-32 text-right space-x-3">
                  <a
                    href={file.downloadURL}
                    target="_blank"
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
