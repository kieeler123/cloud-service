// src/contexts/ThemeContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light" | "sky";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "cloud-drive-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // 처음 로드할 때 localStorage에서 테마 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (saved === "dark" || saved === "light" || saved === "sky") {
        setThemeState(saved);
      }
    } catch {
      // localStorage 사용이 불가한 환경일 수도 있으므로 조용히 무시
    }
  }, []);

  const setTheme = (next: Theme | ((prev: Theme) => Theme)) => {
    setThemeState((prev) => {
      const value = typeof next === "function" ? (next as any)(prev) : next;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch {
        // 저장 실패해도 앱이 깨지지는 않게 무시
      }
      return value;
    });
  };

  const cycleTheme = () => {
    setTheme((prev) =>
      prev === "dark" ? "light" : prev === "light" ? "sky" : "dark"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
