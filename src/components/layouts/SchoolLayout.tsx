import React, { useState } from "react";
import { School, Student, Program, UILocale } from "../../types";
import { translations } from "../../lib/translations";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Settings,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { SidebarTabs, TabDefinition } from "../common/SidebarTabs";

export type SchoolTab =
  | "dashboard"
  | "students"
  | "programs"
  | "courses"
  | "evaluations"
  | "pedagogy"
  | "settings";

interface SchoolLayoutProps {
  school: School;
  students: Student[];
  programs?: Program[];
  activeTab: SchoolTab;
  onTabChange: (tab: SchoolTab) => void;
  children: React.ReactNode;
  locale?: UILocale;
}

export const SchoolLayout: React.FC<SchoolLayoutProps> = ({
  school,
  students,
  activeTab,
  onTabChange,
  children,
  locale = "fr",
}) => {
  const t = translations[locale];
  const [copiedLink, setCopiedLink] = useState(false);

  const schoolStudents = students.filter((s) => s.schoolId === school.id);
  const quotaUsedPercent = Math.min(
    100,
    Math.round((schoolStudents.length / Math.max(1, school.studentQuota)) * 100)
  );

  const tabs: TabDefinition<SchoolTab>[] = [
    {
      id: "dashboard",
      label: t.schoolAdmin.tabs.dashboard.label,
      shortLabel: "Dashboard",
      description: t.schoolAdmin.tabs.dashboard.desc,
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "students",
      label: t.schoolAdmin.tabs.students.label,
      shortLabel: locale === "en" ? "Students" : "Élèves",
      description: t.schoolAdmin.tabs.students.desc,
      icon: <Users size={18} />,
      badge: `${schoolStudents.length}/${school.studentQuota}`,
      badgeColor: quotaUsedPercent >= 90 ? "amber" : "cyan",
    },
    {
      id: "programs",
      label: t.schoolAdmin.tabs.programs.label,
      shortLabel: locale === "en" ? "Programs" : "Programmes",
      description: t.schoolAdmin.tabs.programs.desc,
      icon: <GraduationCap size={18} />,
    },
    {
      id: "courses",
      label: t.schoolAdmin.tabs.courses.label,
      shortLabel: locale === "en" ? "Courses" : "Cours",
      description: t.schoolAdmin.tabs.courses.desc,
      icon: <BookOpen size={18} />,
    },
    {
      id: "evaluations",
      label: t.schoolAdmin.tabs.evaluations.label,
      shortLabel: locale === "en" ? "Evaluations" : "Évaluations",
      description: t.schoolAdmin.tabs.evaluations.desc,
      icon: <HelpCircle size={18} />,
    },
    {
      id: "pedagogy",
      label: t.schoolAdmin.tabs.pedagogy.label,
      shortLabel: locale === "en" ? "Pedagogy" : "Pédagogie",
      description: t.schoolAdmin.tabs.pedagogy.desc,
      icon: <TrendingUp size={18} />,
    },
    {
      id: "settings",
      label: t.schoolAdmin.tabs.settings.label,
      shortLabel: locale === "en" ? "Settings" : "Paramètres",
      description: t.schoolAdmin.tabs.settings.desc,
      icon: <Settings size={18} />,
    },
  ];

  const handleCopySchoolUrl = () => {
    const fullUrl = `${window.location.origin}/#/ecole/${school.slug}/${activeTab}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* School Header Identity Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
            {school.logo || (school.language === "german" ? "🇩🇪" : "🇮🇹")}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {school.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30">
                {school.language === "german" ? t.common.german : t.common.italian}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  school.status === "active"
                    ? "bg-[#20E3A2]/10 text-[#20E3A2] border border-[#20E3A2]/30"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                }`}
              >
                {school.status === "active" ? t.common.activeLicense : t.common.restrictedLicense}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-white/50 font-medium">
              <span>{t.schoolAdmin.director} : {school.managerName || t.roles.schoolManager}</span>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span>/ecole/{school.slug}</span>
                <button
                  type="button"
                  onClick={handleCopySchoolUrl}
                  className="text-slate-400 hover:text-[#00D9FF] cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center rounded-md"
                  title={t.common.copyLink}
                >
                  {copiedLink ? <Check size={12} className="text-[#20E3A2]" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Promo group shortcut & Quota counter */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          {school.whatsappSupportUrl && (
            <a
              href={school.whatsappSupportUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold transition shadow-sm min-h-[44px]"
              title={t.schoolAdmin.whatsappPromoGroup}
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">{t.schoolAdmin.whatsappPromoGroup}</span>
            </a>
          )}

          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs min-h-[44px]">
            <span className="text-slate-500 dark:text-white/50">{t.schoolAdmin.studentQuota} :</span>
            <span
              className={`font-bold font-mono ${
                quotaUsedPercent >= 90 ? "text-amber-400" : "text-[#00D9FF]"
              }`}
            >
              {schoolStudents.length}/{school.studentQuota}
            </span>
          </div>
        </div>
      </div>

      {/* Shared Reusable SidebarTabs */}
      <SidebarTabs<SchoolTab>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileTitle={t.roles.school_admin}
        storageKey={`linguaflow_school_${school.slug}_tab`}
      />

      {/* Main Content Pane */}
      <div className="relative min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
