import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { ThemeMode } from "../../types";

interface ThemeToggleProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const nextTheme: ThemeMode =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={18} className="text-amber-500 animate-pulse" />;
      case "dark":
        return <Moon size={18} className="text-violet-400" />;
      case "system":
        return <Monitor size={18} className="text-cyan-400" />;
    }
  };

  const label =
    theme === "light"
      ? "Thème clair"
      : theme === "dark"
      ? "Thème sombre"
      : "Thème système";

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={() => onThemeChange(nextTheme)}
      title={label}
      aria-label={`Changer le thème (${label})`}
      className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200 cursor-pointer"
    >
      {getIcon()}
    </button>
  );
};
