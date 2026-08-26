import React from "react";
import { Languages } from "lucide-react";
import { UILocale } from "../../types";

interface LanguageSwitcherProps {
  locale: UILocale;
  onLocaleChange: (locale: UILocale) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  locale,
  onLocaleChange,
}) => {
  return (
    <div className="relative shrink-0">
      <select
        id="language-switcher-select"
        value={locale}
        onChange={(e) => onLocaleChange(e.target.value as UILocale)}
        aria-label="Choisir la langue de l'interface"
        className="h-9 sm:h-10 rounded-xl border border-slate-200 bg-white pl-2.5 pr-7 sm:px-3 sm:pr-8 text-xs font-bold text-slate-700 outline-none transition hover:border-[#6D5DFC] dark:border-white/10 dark:bg-white/5 dark:text-white cursor-pointer appearance-none"
      >
        <option value="fr" className="dark:bg-[#0D1220] dark:text-white">FR</option>
        <option value="en" className="dark:bg-[#0D1220] dark:text-white">EN</option>
      </select>
      <Languages
        size={13}
        className="pointer-events-none absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40"
      />
    </div>
  );
};
