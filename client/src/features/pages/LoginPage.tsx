// src/pages/LoginPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type Mode = "login" | "signup";

type AuthResponse = {
  ok: boolean;
  token: string;
  user: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
};

type AuthRequestBody = {
  email: string;
  password: string;
};

async function loginWithEmail(body: AuthRequestBody): Promise<AuthResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "LOGIN_FAILED");
  }

  return data;
}

async function signupWithEmail(body: AuthRequestBody): Promise<AuthResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "SIGNUP_FAILED");
  }

  return data;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const body = {
        email: email.trim(),
        password,
      };

      const result = isLogin
        ? await loginWithEmail(body)
        : await signupWithEmail(body);

      localStorage.setItem("idToken", result.token);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? mapAuthError(t, err.message)
          : t("errors.default"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
    window.location.href = `${baseUrl}/api/auth/google/start`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="fixed right-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
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

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">
                {t("auth.emailLabel")}
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
              className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-slate-50 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? t("common.loading")
                : isLogin
                  ? t("auth.loginButton")
                  : t("auth.signupButton")}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-[11px] text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white">
              <span className="text-[12px] font-bold text-slate-900">G</span>
            </span>
            <span>{t("auth.googleButton")}</span>
          </button>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-300 underline-offset-2 hover:text-indigo-200 hover:underline"
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

function mapAuthError(t: (key: string) => string, code: string): string {
  if (code.includes("INVALID_EMAIL")) return t("errors.invalidEmail");
  if (code.includes("USER_NOT_FOUND")) return t("errors.userNotFound");
  if (code.includes("WRONG_PASSWORD")) return t("errors.wrongPassword");
  if (code.includes("EMAIL_ALREADY_IN_USE")) return t("errors.emailInUse");
  if (code.includes("WEAK_PASSWORD")) return t("errors.weakPassword");

  if (code.includes("auth/invalid-email")) return t("errors.invalidEmail");
  if (code.includes("auth/user-not-found")) return t("errors.userNotFound");
  if (code.includes("auth/wrong-password")) return t("errors.wrongPassword");
  if (code.includes("auth/email-already-in-use")) return t("errors.emailInUse");
  if (code.includes("auth/weak-password")) return t("errors.weakPassword");

  return t("errors.default");
}
