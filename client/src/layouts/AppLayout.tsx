// src/layouts/AppLayout.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { LanguageSwitcher } from "../components/LanguageSwitcher";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useTheme } from "../contexts/ThemeContext";

type MeUser = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

type AppLayoutProps = {
  children: ReactNode;
};

async function fetchMe(token: string): Promise<MeUser> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch me");
  }

  const data = await res.json();
  return data.user;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("idToken") ?? "";

    if (!token) {
      setUser(null);
      return;
    }

    fetchMe(token)
      .then((me) => {
        setUser(me);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("idToken");
        setUser(null);
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("idToken");
    setUser(null);
    window.location.href = "/login";
  };

  const baseBg =
    theme === "dark"
      ? "bg-slate-950 text-slate-50"
      : theme === "light"
        ? "bg-slate-50 text-slate-900"
        : "bg-sky-950 text-sky-50";

  const sidebarBg =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800"
      : theme === "light"
        ? "bg-white/80 border-slate-200"
        : "bg-sky-900/80 border-sky-700";

  const headerBg =
    theme === "dark"
      ? "border-slate-800 bg-slate-900/60"
      : theme === "light"
        ? "border-slate-200 bg-white/80"
        : "border-sky-700 bg-sky-900/60";

  const cardBg =
    theme === "dark"
      ? "bg-slate-900/60 border-slate-800"
      : theme === "light"
        ? "bg-white border-slate-200"
        : "bg-sky-900/70 border-sky-700";

  const displayName = user?.name || user?.email || "?";
  const initial = displayName[0] || "?";

  return (
    <div className={`flex h-screen ${baseBg}`}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col border-r p-4",
          "transform transition-transform duration-200 ease-out",
          "sm:static sm:w-60 sm:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          sidebarBg,
        ].join(" ")}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-semibold">
            {t("app.name") ?? "cloudbox"}
          </div>

          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            닫기
          </button>
        </div>

        <nav className="flex-1 space-y-2 text-sm">
          <button
            className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/60"
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
          >
            {t("layout.myDrive") ?? "My Drive"}
          </button>

          <button
            className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/60"
            onClick={() => {
              navigate("/trash");
              setSidebarOpen(false);
            }}
          >
            {t("layout.trash") ?? "Trash"}
          </button>

          <button
            className="mt-4 w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-800/60"
            onClick={() => {
              navigate("/account");
              setSidebarOpen(false);
            }}
          >
            {t("layout.account") ?? "Account"}
          </button>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`flex h-14 items-center gap-3 border-b px-3 sm:px-4 ${headerBg}`}
        >
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 sm:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            메뉴
          </button>

          <div className="hidden flex-1 truncate text-xs text-slate-500 sm:block">
            {t("app.tagline") ?? "A simple cloud storage for you"}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {user && (
              <div className="flex items-center gap-2">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="avatar"
                    className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200">
                    {initial.toUpperCase()}
                  </div>
                )}

                <div className="hidden flex-col sm:flex">
                  <span className="max-w-[160px] truncate text-xs font-medium text-slate-100">
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/account")}
                    className="text-left text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    {t("layout.profile") ?? "Profile"}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-300"
            >
              {t("layout.logout") ?? "Logout"}
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-auto p-4 sm:p-6 ${cardBg}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
