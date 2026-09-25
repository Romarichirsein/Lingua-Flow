import React, { useState } from "react";
import { Student, School, UILocale } from "../../types";
import { StudentCountdownBanner } from "../student/StudentCountdownBanner";
import { ProgressBar } from "../common/ProgressBar";
import { translations } from "../../lib/translations";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Award,
  Bell,
  User,
  Copy,
  Check,
  MessageCircle,
  FileCheck,
  Sparkles,
  Bot,
} from "lucide-react";
import { SidebarTabs, TabDefinition } from "../common/SidebarTabs";
import { SchoolLogo } from "../common/SchoolLogo";

export type StudentTab =
  | "dashboard"
  | "programs"
  | "courses"
  | "chat"
  | "evaluations"
  | "progress"
  | "notifications"
  | "profile";

interface StudentLayoutProps {
  student: Student;
  school: School;
  activeTab: StudentTab;
  onTabChange: (tab: StudentTab) => void;
  children: React.ReactNode;
  completedLessonsCount: number;
  totalLessonsCount: number;
  locale?: UILocale;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  student,
  school,
  activeTab,
  onTabChange,
  children,
  completedLessonsCount,
  totalLessonsCount,
  locale = "fr",
}) => {
  const t = translations[locale];
  const [copiedLink, setCopiedLink] = useState(false);
  const studentSlug = student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const computedProgressPercent = totalLessonsCount > 0
    ? Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100))
    : (student.progressPercent || 0);

  const tabs: TabDefinition<StudentTab>[] = [
    {
      id: "dashboard",
      label: t.student.tabs.dashboard.label,
      shortLabel: locale === "en" ? "Home" : "Accueil",
      description: t.student.tabs.dashboard.desc,
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "programs",
      label: t.student.tabs.programs.label,
      shortLabel: locale === "en" ? "Programs" : "Programmes",
      description: t.student.tabs.programs.desc,
      icon: <Layers size={18} />,
    },
    {
      id: "courses",
      label: t.student.tabs.courses.label,
      shortLabel: locale === "en" ? "Courses" : "Cours",
      description: t.student.tabs.courses.desc,
      icon: <BookOpen size={18} />,
      badge: `${completedLessonsCount}/${totalLessonsCount}`,
      badgeColor: "cyan",
    },
    {
      id: "chat",
      label: "LinguaFlow AI",
      shortLabel: "LinguaFlow AI",
      description: t.student.tabs.chat.desc,
      icon: <Bot size={18} className="text-cyan-400" />,
    },
    {
      id: "evaluations",
      label: "Prüfung",
      shortLabel: "Prüfung",
      description: t.student.tabs.evaluations.desc,
      icon: <FileCheck size={18} />,
    },
    {
      id: "progress",
      label: t.student.tabs.progress.label,
      shortLabel: locale === "en" ? "Certificate" : "Certificat",
      description: t.student.tabs.progress.desc,
      icon: <Award size={18} />,
    },
    {
      id: "notifications",
      label: t.student.tabs.notifications.label,
      shortLabel: locale === "en" ? "Alerts" : "Alertes",
      description: t.student.tabs.notifications.desc,
      icon: <Bell size={18} />,
    },
    {
      id: "profile",
      label: t.student.tabs.profile.label,
      shortLabel: locale === "en" ? "Profile" : "Profil",
      description: t.student.tabs.profile.desc,
      icon: <User size={18} />,
    },
  ];

  const handleCopyDirectLink = () => {
    const fullUrl = `${window.location.origin}/#/eleve/${studentSlug}/${activeTab}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Access Countdown & Expiration Banner */}
      <StudentCountdownBanner student={student} locale={locale} />

      {/* Main Student Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30">
              {t.student.portalTitle} • {t.student.levelBadge} {student.level}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-white/60">
              <span>/eleve/{studentSlug}/{activeTab}</span>
              <button
                type="button"
                onClick={handleCopyDirectLink}
                className="hover:text-[#00D9FF] cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center rounded-md"
                title={t.common.copyLink}
              >
                {copiedLink ? <Check size={12} className="text-[#20E3A2]" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SchoolLogo
              logo={school.logo}
              name={school.name}
              language={school.language}
              size="md"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {t.student.welcome}, {student.name} !
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 mt-1 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{school.name}</span>
                <span>•</span>
                <span>{school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Pill & WhatsApp Support */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-white/5 p-3 border border-slate-200 dark:border-white/10 shadow-xs w-full md:w-56 min-h-[44px]">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-white/50">{t.common.progress}</span>
                <span className="text-[#00D9FF]">{computedProgressPercent}%</span>
              </div>
              <ProgressBar value={computedProgressPercent} color="cyan" height="sm" />
            </div>
          </div>

          {school.whatsappSupportUrl && (
            <a
              href={school.whatsappSupportUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow-sm min-h-[44px]"
              title={t.student.whatsappFloating}
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">{t.schoolAdmin.whatsappPromoGroup}</span>
            </a>
          )}
        </div>
      </div>

      {/* Shared Reusable SidebarTabs */}
      <SidebarTabs<StudentTab>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileTitle={t.student.portalTitle}
        storageKey={`linguaflow_student_${studentSlug}_tab`}
      />

      {/* Active Tab View */}
      <div className="relative min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
