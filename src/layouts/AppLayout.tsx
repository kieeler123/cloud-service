// src/layouts/AppLayout.tsx
import type { ReactNode } from "react";
import { auth } from "../lib/firebase";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // 🔥 테마별 클래스 정의
  const baseBg =
    theme === "dark"
      ? "bg-slate-950 text-slate-50"
      : theme === "light"
      ? "bg-slate-50 text-slate-900"
      : "bg-sky-950 text-sky-50"; // sky

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

  // 간단한 아바타용 이니셜
  const initial = user?.displayName?.[0] || user?.email?.[0] || "?";

  return (
    <div className={`flex h-screen ${baseBg}`}>
      {/* Sidebar */}
      <aside className={`w-60 border-r p-4 flex flex-col ${sidebarBg}`}>
        <div className="text-lg font-semibold mb-6">
          {t("app.name") ?? "cloudbox"}
        </div>

        <nav className="text-sm space-y-2 flex-1">
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60"
            onClick={() => navigate("/")}
          >
            {t("layout.myDrive") ?? "My Drive"}
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60"
            onClick={() => navigate("/recent")}
          >
            {t("layout.recent") ?? "Recent"}
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60"
            onClick={() => navigate("/trash")}
          >
            {t("layout.trash") ?? "Trash"}
          </button>

          {/* 계정 설정 페이지 이동 */}
          <button
            className="mt-4 w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300"
            onClick={() => navigate("/account")}
          >
            {t("layout.account") ?? "Account"}
          </button>
        </nav>
      </aside>

      {/* Main 영역 */}
      <div className="flex-1 flex flex-col">
        <header
          className={`h-14 border-b flex items-center px-4 gap-3 ${headerBg}`}
        >
          <div className="flex-1 text-xs text-slate-500">
            {t("app.tagline") ?? "A simple cloud storage for you"}
          </div>

          {/* 오른쪽: 언어 + 프로필 + 로그아웃 */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher /> {/* ← 이 줄 추가 */}
            <LanguageSwitcher />
            {/* 프로필 미니 카드 (아바타 + 이름) */}
            {user && (
              <div className="flex items-center gap-2">
                {/* 아바타 */}
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-200 border border-slate-700">
                    {initial.toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-100 truncate max-w-[130px]">
                    {user.displayName || user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/account")}
                    className="text-[11px] text-slate-400 hover:text-slate-200 text-left"
                  >
                    {t("layout.profile") ?? "Profile"}
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="mt-4 text-xs text-slate-400 hover:text-red-300"
            >
              {t("layout.logout") ?? "Logout"}
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-auto p-6 ${cardBg}`}>{children}</main>
      </div>
    </div>
  );
}
