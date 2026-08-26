import React from "react";
import { UILocale } from "../../types";
import { translations } from "../../lib/translations";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Megaphone,
  MessageCircle,
  Cpu,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { SidebarTabs, TabDefinition } from "../common/SidebarTabs";

export type SuperAdminTab =
  | "dashboard"
  | "schools"
  | "students"
  | "programs"
  | "reports"
  | "announcements"
  | "whatsapp"
  | "platform"
  | "security-logs"
  | "profile";

interface SuperAdminLayoutProps {
  activeTab: SuperAdminTab;
  onTabChange: (tab: SuperAdminTab) => void;
  children: React.ReactNode;
  schoolCount?: number;
  studentCount?: number;
  programsCount?: number;
  activeAnnouncementsCount?: number;
  locale?: UILocale;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
  schoolCount = 0,
  studentCount = 0,
  programsCount = 0,
  activeAnnouncementsCount = 0,
  locale = "fr",
}) => {
  const t = translations[locale];

  const tabs: TabDefinition<SuperAdminTab>[] = [
    {
      id: "dashboard",
      label: t.superAdmin.tabs.dashboard.label,
      shortLabel: "Dashboard",
      description: t.superAdmin.tabs.dashboard.desc,
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "schools",
      label: t.superAdmin.tabs.schools.label,
      shortLabel: locale === "en" ? "Schools" : "Écoles",
      description: t.superAdmin.tabs.schools.desc,
      icon: <Building2 size={18} />,
      badge: schoolCount > 0 ? schoolCount : undefined,
      badgeColor: "cyan",
    },
    {
      id: "students",
      label: t.superAdmin.tabs.students.label,
      shortLabel: locale === "en" ? "Students" : "Élèves",
      description: t.superAdmin.tabs.students.desc,
      icon: <Users size={18} />,
      badge: studentCount > 0 ? studentCount : undefined,
      badgeColor: "emerald",
    },
    {
      id: "programs",
      label: t.superAdmin.tabs.programs.label,
      shortLabel: locale === "en" ? "Programs" : "Programmes",
      description: t.superAdmin.tabs.programs.desc,
      icon: <GraduationCap size={18} />,
      badge: programsCount > 0 ? programsCount : undefined,
      badgeColor: "primary",
    },
    {
      id: "reports",
      label: t.superAdmin.tabs.reports.label,
      shortLabel: locale === "en" ? "Reports" : "Rapports",
      description: t.superAdmin.tabs.reports.desc,
      icon: <TrendingUp size={18} />,
    },
    {
      id: "announcements",
      label: t.superAdmin.tabs.announcements.label,
      shortLabel: locale === "en" ? "Announcements" : "Annonces",
      description: t.superAdmin.tabs.announcements.desc,
      icon: <Megaphone size={18} />,
      badge: activeAnnouncementsCount > 0 ? activeAnnouncementsCount : undefined,
      badgeColor: "amber",
    },
    {
      id: "whatsapp",
      label: t.superAdmin.tabs.whatsapp.label,
      shortLabel: "WhatsApp",
      description: t.superAdmin.tabs.whatsapp.desc,
      icon: <MessageCircle size={18} />,
    },
    {
      id: "platform",
      label: t.superAdmin.tabs.platform.label,
      shortLabel: locale === "en" ? "Settings" : "Paramètres",
      description: t.superAdmin.tabs.platform.desc,
      icon: <Cpu size={18} />,
    },
    {
      id: "security-logs",
      label: t.superAdmin.tabs.securityLogs.label,
      shortLabel: "Logs",
      description: t.superAdmin.tabs.securityLogs.desc,
      icon: <ShieldCheck size={18} />,
    },
    {
      id: "profile",
      label: t.superAdmin.tabs.profile.label,
      shortLabel: locale === "en" ? "Profile" : "Profil",
      description: t.superAdmin.tabs.profile.desc,
      icon: <UserCheck size={18} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Identity Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DFC] to-[#00D9FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(109,93,252,0.45)] shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                {t.superAdmin.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30 uppercase tracking-wider">
                {t.common.fullAccess}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">
              {t.superAdmin.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/60 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-[#20E3A2] animate-pulse" />
          <span>{t.common.operational}</span>
        </div>
      </div>

      {/* Shared Reusable SidebarTabs Component */}
      <SidebarTabs<SuperAdminTab>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileTitle={t.roles.super_admin}
        storageKey="linguaflow_superadmin_tab"
      />

      {/* Main Content View */}
      <div className="relative min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
