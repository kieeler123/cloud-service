// src/layouts/AppLayout.tsx
import type { ReactNode } from "react";
import { auth } from "../lib/firebase";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useState } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = auth.currentUser;

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (모바일: 슬라이드 / 데스크톱: 고정) */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 w-72 max-w-[80vw] border-r p-4 flex flex-col",
          "transform transition-transform duration-200 ease-out",
          "sm:static sm:translate-x-0 sm:w-60",
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          sidebarBg,
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold">
            {t("app.name") ?? "cloudbox"}
          </div>

          {/* 모바일 닫기 버튼 */}
          <button
            type="button"
            className="sm:hidden text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-800/60"
            onClick={() => setSidebarOpen(false)}
          >
            닫기
          </button>
        </div>

        <nav className="text-sm space-y-2 flex-1">
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60"
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
          >
            {t("layout.myDrive") ?? "My Drive"}
          </button>

          {/* NOTE: /recent 라우트가 실제로 없으면 이 버튼은 지우거나 라우트를 추가해야 함 */}
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60"
            onClick={() => {
              navigate("/recent");
              setSidebarOpen(false);
            }}
          >
            {t("layout.recent") ?? "Recent"}
          </button>

          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60"
            onClick={() => {
              navigate("/trash");
              setSidebarOpen(false);
            }}
          >
            {t("layout.trash") ?? "Trash"}
          </button>

          {/* 계정 */}
          <button
            className="mt-4 w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300"
            onClick={() => {
              navigate("/account");
              setSidebarOpen(false);
            }}
          >
            {t("layout.account") ?? "Account"}
          </button>
        </nav>
      </aside>

      {/* Main 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={`h-14 border-b flex items-center px-3 sm:px-4 gap-3 ${headerBg}`}
        >
          {/* 모바일 햄버거 */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60"
            onClick={() => setSidebarOpen(true)}
          >
            메뉴
          </button>

          {/* 태그라인: 모바일에서는 숨김 */}
          <div className="hidden sm:block flex-1 text-xs text-slate-500 truncate">
            {t("app.tagline") ?? "A simple cloud storage for you"}
          </div>

          {/* 오른쪽 영역 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* 프로필 미니 카드: 모바일에서는 이름 숨기고 아바타만 */}
            {user && (
              <div className="flex items-center gap-2">
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

                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-medium text-slate-100 truncate max-w-[160px]">
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

            {/* 로그아웃: mt-4 제거(헤더에선 부자연스러움) */}
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-300"
            >
              {t("layout.logout") ?? "Logout"}
            </button>
          </div>
        </header>

        {/* main padding도 반응형 */}
        <main className={`flex-1 overflow-auto p-4 sm:p-6 ${cardBg}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
