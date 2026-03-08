// src/components/LanguageSwitcher.tsx
import { useTranslation } from "react-i18next";

const LANG_LABELS: Record<string, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
  zh: "中文",
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language || "ja";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem("cloudbox_lang", lng);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200"
    >
      {Object.entries(LANG_LABELS).map(([code, label]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
