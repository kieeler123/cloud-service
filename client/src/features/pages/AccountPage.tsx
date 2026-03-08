// src/pages/AccountPage.tsx
import { useEffect, useState, type FormEvent } from "react";
import { auth, storage } from "@/lib/firebase";
import { updateProfile, deleteUser } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 프로필 사진 관련
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoSaving, setPhotoSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoPreview(user.photoURL || null);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-sm text-slate-300">
        {t("errors.default") ?? "로그인 상태가 아닙니다."}
      </div>
    );
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);

    try {
      await updateProfile(user, {
        displayName: displayName.trim() || undefined,
      });
      setMessage(t("account.updated") ?? "프로필이 저장되었습니다.");
    } catch (err: any) {
      console.error(err);
      setError(
        t("account.updateError") ??
          "프로필 저장 중 문제가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);

    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !user) return;

    setPhotoSaving(true);
    setError(null);
    setMessage(null);

    try {
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, photoFile);
      const url = await getDownloadURL(avatarRef);

      await updateProfile(user, { photoURL: url });
      setPhotoPreview(url);
      setMessage(
        t("account.photoUpdated") ?? "프로필 사진이 업데이트되었습니다.",
      );
    } catch (err: any) {
      console.error(err);
      setError(
        t("account.photoUpdateError") ??
          "프로필 사진 업로드 중 문제가 발생했습니다.",
      );
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      t("account.deleteConfirm") ??
        "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    );
    if (!ok) return;

    setDeleting(true);
    setError(null);
    setMessage(null);

    try {
      await deleteUser(user);
      await auth.signOut().catch(() => {});
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error(err);
      if (err?.code === "auth/requires-recent-login") {
        setError(
          t("account.requiresRecentLogin") ??
            "보안을 위해 다시 로그인한 뒤 탈퇴할 수 있습니다. 로그아웃 후 다시 로그인하고 시도해주세요.",
        );
      } else {
        setError(
          t("account.deleteError") ??
            "탈퇴 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-semibold mb-4">
          {t("account.title") ?? "계정 설정"}
        </h1>
        <p className="text-xs text-slate-400">
          {t("account.subtitle") ??
            "닉네임을 수정하거나, 필요하다면 계정을 삭제할 수 있습니다."}
        </p>
      </div>

      {message && (
        <div className="mb-3 rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* 🔥 프로필 사진 섹션 */}
      <section className="flex items-center gap-4">
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="avatar"
              className="h-20 w-20 rounded-full object-cover border border-slate-700"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-sm text-slate-300 border border-slate-700">
              {user.displayName?.[0]?.toUpperCase() ||
                user.email?.[0]?.toUpperCase() ||
                "?"}
            </div>
          )}
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <label className="block">
            <span className="block mb-1">
              {t("account.photoLabel") ?? "프로필 사진"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-[11px] text-slate-300"
            />
          </label>
          <button
            type="button"
            onClick={handlePhotoUpload}
            disabled={!photoFile || photoSaving}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {photoSaving
              ? (t("common.loading") ?? "업로드 중...")
              : (t("account.photoSaveButton") ?? "사진 업로드")}
          </button>
        </div>
      </section>

      {/* 기본 정보 폼 */}
      <form onSubmit={handleSave} className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-300">
            {t("account.email") ?? "이메일"}
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-300">
            {t("account.displayName") ?? "표시 이름"}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-slate-50 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {saving
            ? (t("common.loading") ?? "저장 중...")
            : (t("account.saveButton") ?? "변경 사항 저장")}
        </button>
      </form>

      {/* 탈퇴 영역 */}
      <div className="border-t border-slate-800 pt-6">
        <h2 className="text-sm font-semibold text-red-300 mb-2">
          {t("account.dangerZone") ?? "위험 구역"}
        </h2>
        <p className="text-xs text-slate-400 mb-3">
          {t("account.dangerHint") ??
            "계정을 삭제하면 모든 데이터에 접근할 수 없게 됩니다. 이 작업은 되돌릴 수 없습니다."}
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="rounded-xl border border-red-500/70 bg-red-500/10 px-4 py-2 text-xs text-red-200 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {deleting
            ? (t("common.loading") ?? "처리 중...")
            : (t("account.deleteButton") ?? "계정 영구 삭제")}
        </button>
      </div>
    </div>
  );
}
