// src/components/ThemeSwitcher.tsx
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

export default function ThemeSwitcher() {
  const { theme, cycleTheme } = useTheme();
  const { t } = useTranslation();

  // 테마별 아이콘 (Tailwind 기준)
  const icon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🌤️"; // sky theme

  return (
    <button
      onClick={cycleTheme}
      className="
        flex items-center gap-2 px-3 py-1.5
        rounded-lg text-xs font-medium
        hover:bg-slate-800/50 transition select-none
      "
      title={t("common.changeTheme") ?? "테마 변경"}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-slate-300">
        {t(`theme.${theme}`) ??
          (theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Sky")}
      </span>
    </button>
  );
}
