// src/pages/TrashPage.tsx
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
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useTranslation } from "react-i18next";

type DriveFile = {
  id: string;
  name: string;
  size: number;
  downloadURL: string;
  path: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  trashedAt?: { seconds: number; nanoseconds: number } | null;
};

export default function TrashPage() {
  const { t } = useTranslation();
  const user = auth.currentUser;

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-sm text-slate-300">로그인 상태가 아닙니다.</div>
    );
  }

  // 🔥 휴지통: isTrashed == true
  useEffect(() => {
    const q = query(
      collection(db, "files"),
      where("ownerUid", "==", user.uid),
      where("isTrashed", "==", true),
      orderBy("trashedAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: DriveFile[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          name: data.name,
          size: data.size,
          downloadURL: data.downloadURL,
          path: data.path,
          createdAt: data.createdAt ?? null,
          trashedAt: data.trashedAt ?? null,
        };
      });
      setFiles(list);
    });

    return () => unsub();
  }, [user.uid]);

  // 🔥 복원 기능: isTrashed → false
  const restoreFile = async (file: DriveFile) => {
    try {
      await updateDoc(doc(db, "files", file.id), {
        isTrashed: false,
      });
    } catch (err) {
      console.error(err);
      setError("복원 중 문제가 발생했습니다.");
    }
  };

  // 🔥 완전 삭제 (Firestore + Storage)
  const deleteForever = async (file: DriveFile) => {
    const ok = window.confirm(
      "이 파일을 완전히 삭제할까요? 복구할 수 없습니다."
    );
    if (!ok) return;

    try {
      // 1) Storage 파일 삭제
      await deleteObject(ref(storage, file.path));

      // 2) Firestore 문서 삭제
      await deleteDoc(doc(db, "files", file.id));
    } catch (err) {
      console.error(err);
      setError("완전 삭제 중 문제가 발생했습니다.");
    }
  };

  const formatDate = (ts?: { seconds: number; nanoseconds: number } | null) => {
    if (!ts) return "-";
    return new Date(ts.seconds * 1000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-base sm:text-lg font-semibold">
        {t("trash.title") ?? "휴지통"}
      </h1>

      {error && <div className="text-red-300 text-sm">{error}</div>}

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        {/* 헤더: sm 이상에서만 */}
        <div className="hidden sm:flex px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400">
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
            {files.map((file) => (
              <li key={file.id} className="px-4 py-3">
                {/* 모바일: 카드 레이아웃 */}
                <div className="sm:hidden space-y-2">
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
                      onClick={() => restoreFile(file)}
                      className="text-[11px] text-indigo-300 hover:text-indigo-200"
                    >
                      {t("trash.restore") ?? "복원"}
                    </button>
                    <button
                      onClick={() => deleteForever(file)}
                      className="text-[11px] text-red-300 hover:text-red-200"
                    >
                      {t("trash.deleteForever") ?? "완전 삭제"}
                    </button>
                  </div>
                </div>

                {/* 데스크톱: 테이블 행 */}
                <div className="hidden sm:flex items-center text-xs">
                  <div className="flex-1 min-w-0 truncate">{file.name}</div>

                  <div className="w-44 text-right text-slate-400">
                    {formatDate(file.trashedAt)}
                  </div>

                  <div className="w-40 text-right space-x-3">
                    <button
                      onClick={() => restoreFile(file)}
                      className="text-[11px] text-indigo-300 hover:text-indigo-200"
                    >
                      {t("trash.restore") ?? "복원"}
                    </button>
                    <button
                      onClick={() => deleteForever(file)}
                      className="text-[11px] text-red-300 hover:text-red-200"
                    >
                      {t("trash.deleteForever") ?? "완전 삭제"}
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
