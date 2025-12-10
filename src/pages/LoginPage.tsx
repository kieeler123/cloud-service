// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup, // 👈 추가
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase"; // 👈 provider 같이 import
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

type Mode = "login" | "signup";

export default function LoginPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(mapFirebaseError(t, err?.code || err?.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  const isLogin = mode === "login";

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      // 취소(close popup) 같은 건 굳이 에러 안 띄워도 됨
      if (err?.code === "auth/popup-closed-by-user") {
        // 아무 메시지도 안 띄우고 그냥 무시
      } else {
        setError(mapFirebaseError(t, err?.code || err?.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <LanguageSwitcher />
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur p-8">
          {/* 상단 타이틀 */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{t("auth.welcomeBadge")}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              {isLogin ? t("auth.loginTitle") : t("auth.signupTitle")}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {isLogin ? t("auth.loginDesc") : t("auth.signupDesc")}
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">
                {t("auth.emailLabel")}
              </label>
              <input
                type="email"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">
                {t("auth.passwordLabel")}
              </label>
              <input
                type="password"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-slate-50 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting
                ? t("common.loading")
                : isLogin
                ? t("auth.loginButton")
                : t("auth.signupButton")}
            </button>
          </form>

          {/* 소셜 로그인 구분선 */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-[11px] text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Google 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {/* 간단한 G 아이콘 느낌 */}
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white">
              <span className="text-[12px] font-bold text-slate-900">G</span>
            </span>
            <span>{t("auth.googleButton")}</span>
          </button>

          {/* 아래 텍스트 */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline"
            >
              {isLogin ? t("auth.switchToSignup") : t("auth.switchToLogin")}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          {t("auth.footer")}
        </p>
      </div>
    </div>
  );
}

function mapFirebaseError(t: (key: string) => string, code: string): string {
  if (code.includes("auth/invalid-email")) return t("errors.invalidEmail");
  if (code.includes("auth/user-not-found")) return t("errors.userNotFound");
  if (code.includes("auth/wrong-password")) return t("errors.wrongPassword");
  if (code.includes("auth/email-already-in-use")) return t("errors.emailInUse");
  if (code.includes("auth/weak-password")) return t("errors.weakPassword");
  return t("errors.default");
}
