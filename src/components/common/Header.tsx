import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, UILocale, ThemeMode, School, Student } from "../../types";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { translations } from "../../lib/translations";
import { LinguaFlowLogo } from "./LinguaFlowLogo";
import { getEffectiveStatus } from "../../lib/syncEngine";
import { isReducedMotion } from "../../lib/motionVariants";
import {
  Shield,
  Building2,
  GraduationCap,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Globe,
  SunMoon,
} from "lucide-react";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  locale: UILocale;
  onLocaleChange: (locale: UILocale) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentSchool?: School;
  currentStudent?: Student;
  availableSchools?: School[];
  onSelectSchool?: (schoolId: string) => void;
  availableStudents?: Student[];
  onSelectStudent?: (studentId: string) => void;
  currentUserName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
  currentSchool,
  currentStudent,
  currentUserName,
  onLogout,
}) => {
  const t = translations[locale];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getEffectiveStatusInfo = () => {
    if (currentRole === "super_admin") return null;

    const status =
      currentRole === "school_admin"
        ? currentSchool
          ? getEffectiveStatus(currentSchool)
          : undefined
        : currentStudent
        ? getEffectiveStatus(currentStudent)
        : undefined;
    if (!status) return null;

    const config = {
      active: {
        bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
        dot: "bg-emerald-500",
        icon: <CheckCircle2 size={12} />,
        label: t.common.active,
      },
      suspended: {
        bg: "bg-amber-500/10 text-amber-500 border-amber-500/30",
        dot: "bg-amber-500",
        icon: <AlertTriangle size={12} />,
        label: t.common.suspended,
      },
      blocked: {
        bg: "bg-rose-500/10 text-rose-500 border-rose-500/30",
        dot: "bg-rose-500",
        icon: <XCircle size={12} />,
        label: t.common.blocked,
      },
      expired: {
        bg: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        dot: "bg-slate-400",
        icon: <Clock size={12} />,
        label: t.common.expired,
      },
    }[status] || {
      bg: "bg-slate-500/10 text-slate-400 border-slate-500/30",
      dot: "bg-slate-400",
      icon: <Clock size={12} />,
      label: status,
    };

    return { status, config };
  };

  const statusInfo = getEffectiveStatusInfo();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-white/5 dark:bg-[#070A12]/95">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Brand & Multi-Tenant Info */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="Lingua Flow"
              className="h-8 sm:h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="rounded-md bg-[#6D5DFC]/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/20 uppercase tracking-wider shrink-0">
                  SaaS B2B
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-white/40 hidden sm:block font-medium truncate max-w-[200px] md:max-w-none">
                {currentRole === "super_admin"
                  ? t.common.centralPlatform
                  : currentSchool
                  ? `${currentSchool.name} • ${
                      currentSchool.language === "german" ? t.common.german : t.common.italian
                    }`
                  : t.common.languageCentre}
              </p>
            </div>
          </div>

          {statusInfo && (
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.config.bg}`}
            >
              {statusInfo.config.icon}
              {statusInfo.config.label}
            </span>
          )}
        </div>

        {/* DESKTOP Controls: Language, Theme & User Profile */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Active Space / Role Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 text-xs font-semibold text-[#6D5DFC] dark:text-[#a399ff]">
            {currentRole === "super_admin" ? (
              <>
                <Shield size={14} className="text-[#6D5DFC] dark:text-[#a399ff]" />
                <span>{t.roles.super_admin}</span>
              </>
            ) : currentRole === "school_admin" ? (
              <>
                <Building2 size={14} className="text-[#6D5DFC] dark:text-[#a399ff]" />
                <span className="max-w-[150px] truncate">{currentSchool?.name || t.roles.school_admin}</span>
              </>
            ) : (
              <>
                <GraduationCap size={14} className="text-[#6D5DFC] dark:text-[#a399ff]" />
                <span className="max-w-[150px] truncate">{currentStudent?.name || t.roles.student}</span>
              </>
            )}
          </div>

          {/* User Profile & Logout Button */}
          {onLogout && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-2 sm:pl-3">
              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6D5DFC] text-white text-[10px] font-bold">
                  {currentUserName ? currentUserName.charAt(0).toUpperCase() : <User size={12} />}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 dark:text-white max-w-[140px] truncate leading-tight">
                    {currentUserName ||
                      (currentRole === "super_admin"
                        ? t.roles.super_admin
                        : currentRole === "school_admin"
                        ? currentSchool?.managerName
                        : currentStudent?.name)}
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-white/40 uppercase font-medium">
                    {currentRole === "super_admin"
                      ? t.roles.centralAdmin
                      : currentRole === "school_admin"
                      ? t.roles.schoolManager
                      : t.roles.learner}
                  </p>
                </div>
              </div>

              <button
                id="header-logout-btn"
                type="button"
                onClick={onLogout}
                title={t.common.logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF4D8D]/10 hover:bg-[#FF4D8D]/20 text-[#FF4D8D] border border-[#FF4D8D]/30 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden lg:inline">{t.common.logout}</span>
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher locale={locale} onLocaleChange={onLocaleChange} />

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>

        {/* MOBILE Right Controls: Quick Theme Toggle & Hamburger Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />

          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition cursor-pointer ${
              isMobileMenuOpen
                ? "bg-[#6D5DFC] text-white border-[#6D5DFC] shadow-[0_0_15px_rgba(109,93,252,0.4)]"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN & OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isReducedMotion() ? 0 : 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Slide-down Menu Drawer */}
            <motion.div
              key="mobile-menu-drawer"
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{
                duration: isReducedMotion() ? 0.1 : 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#070A12]/98 md:hidden"
            >
              <div className="space-y-4">
                {/* User Identity Card */}
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D5DFC] to-[#00F5D4] text-white font-black text-sm shadow-md">
                      {currentUserName ? currentUserName.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        {currentUserName ||
                          (currentRole === "super_admin"
                            ? t.roles.super_admin
                            : currentRole === "school_admin"
                            ? currentSchool?.managerName
                            : currentStudent?.name)}
                      </p>
                      <p className="text-[10px] text-[#6D5DFC] dark:text-[#a399ff] font-semibold mt-0.5">
                        {currentRole === "super_admin"
                          ? t.roles.centralAdmin
                          : currentRole === "school_admin"
                          ? `${currentSchool?.name || ""} • ${t.roles.schoolManager}`
                          : `${currentSchool?.name || ""} • ${t.roles.learner}`}
                      </p>
                    </div>
                  </div>

                  {statusInfo && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.config.bg}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.config.dot}`} />
                      {statusInfo.config.label}
                    </span>
                  )}
                </div>

                {/* Language Switcher Section */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider px-1">
                    {locale === "en" ? "Interface Language" : "Langue de l'interface"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["fr", "en"] as UILocale[]).map((loc) => {
                      const labels: Record<UILocale, { flag: string; label: string }> = {
                        fr: { flag: "🇫🇷", label: "Français (FR)" },
                        en: { flag: "🇬🇧", label: "English (EN)" },
                      };
                      const isSel = locale === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            onLocaleChange(loc);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            isSel
                              ? "bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff] border-[#6D5DFC]/40 shadow-sm"
                              : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60"
                          }`}
                        >
                          <span>{labels[loc].flag}</span>
                          <span>{labels[loc].label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logout Action Button */}
                {onLogout && (
                  <button
                    id="mobile-logout-btn"
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FF4D8D]/10 hover:bg-[#FF4D8D]/20 text-[#FF4D8D] border border-[#FF4D8D]/30 text-xs font-bold transition cursor-pointer mt-2"
                  >
                    <LogOut size={15} />
                    <span>{t.common.logout}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

