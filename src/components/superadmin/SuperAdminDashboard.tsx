import React, { useState, useEffect } from "react";
import {
  School,
  Student,
  Program,
  ActivityLog,
  GlobalPlatformConfig,
  UILocale,
  Announcement,
  NotificationTemplate,
  ThemeMode,
} from "../../types";
import { SuperAdminLayout, SuperAdminTab } from "../layouts/SuperAdminLayout";
import { SuperAdminOverviewTab } from "./SuperAdminOverviewTab";
import { SuperAdminSchoolsTab } from "./SuperAdminSchoolsTab";
import { SuperAdminStudentsTab } from "./SuperAdminStudentsTab";
import { SuperAdminProgramsTab } from "./SuperAdminProgramsTab";
import { SuperAdminReportsTab } from "./SuperAdminReportsTab";
import { SuperAdminAnnouncementsTab } from "./SuperAdminAnnouncementsTab";
import { SuperAdminWhatsAppTab } from "./SuperAdminWhatsAppTab";
import { SuperAdminSettingsTab } from "./SuperAdminSettingsTab";
import { SuperAdminLogsTab } from "./SuperAdminLogsTab";
import { SuperAdminProfileTab } from "./SuperAdminProfileTab";
import { SuperAdminDiagnosticModal } from "./SuperAdminDiagnosticModal";
import { navigateTo } from "../../lib/router";

interface SuperAdminDashboardProps {
  locale: UILocale;
  theme?: ThemeMode;
  schools: School[];
  students: Student[];
  programs?: Program[];
  logs: ActivityLog[];
  config: GlobalPlatformConfig;
  announcements?: Announcement[];
  templates?: NotificationTemplate[];
  activeSubpath?: string;
  onUpdateSchools: (schools: School[]) => void;
  onUpdateStudents?: (students: Student[]) => void;
  onUpdatePrograms?: (programs: Program[]) => void;
  onUpdateConfig: (config: GlobalPlatformConfig) => void;
  onUpdateAnnouncements?: (announcements: Announcement[]) => void;
  onUpdateTemplates?: (templates: NotificationTemplate[]) => void;
  onUpdateLocale?: (locale: UILocale) => void;
  onUpdateTheme?: (theme: ThemeMode) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
  onSelectSchoolTab?: (schoolId: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  locale,
  theme = "dark",
  schools,
  students,
  programs = [],
  logs,
  config,
  announcements = [],
  templates = [],
  activeSubpath = "dashboard",
  onUpdateSchools,
  onUpdateStudents = () => {},
  onUpdatePrograms = () => {},
  onUpdateConfig,
  onUpdateAnnouncements = () => {},
  onUpdateTemplates = () => {},
  onUpdateLocale = () => {},
  onUpdateTheme = () => {},
  onAddLog,
  onSelectSchoolTab,
}) => {
  // Map valid tabs
  const validTabs: SuperAdminTab[] = [
    "dashboard",
    "schools",
    "students",
    "programs",
    "reports",
    "announcements",
    "whatsapp",
    "platform",
    "security-logs",
    "profile",
  ];

  const getInitialTab = (): SuperAdminTab => {
    if (validTabs.includes(activeSubpath as SuperAdminTab)) {
      return activeSubpath as SuperAdminTab;
    }
    const saved = localStorage.getItem("linguaflow_superadmin_tab");
    if (saved && validTabs.includes(saved as SuperAdminTab)) {
      return saved as SuperAdminTab;
    }
    return "dashboard";
  };

  const [activeTab, setActiveTab] = useState<SuperAdminTab>(getInitialTab);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  useEffect(() => {
    if (validTabs.includes(activeSubpath as SuperAdminTab) && activeSubpath !== activeTab) {
      setActiveTab(activeSubpath as SuperAdminTab);
    }
  }, [activeSubpath]);

  const handleTabChange = (tab: SuperAdminTab) => {
    setActiveTab(tab);
    localStorage.setItem("linguaflow_superadmin_tab", tab);
    navigateTo(`/superadmin/${tab}`);
  };

  return (
    <>
      <SuperAdminLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        schoolCount={schools.length}
        studentCount={students.length}
        programsCount={programs.length}
        activeAnnouncementsCount={announcements.filter((a) => a.isActive).length}
        locale={locale}
      >
        {activeTab === "dashboard" && (
          <SuperAdminOverviewTab
            schools={schools}
            students={students}
            programs={programs}
            logs={logs}
            announcements={announcements}
            locale={locale}
            onNavigateToTab={handleTabChange}
            onOpenCreateSchool={() => handleTabChange("schools")}
            onOpenDiagnostic={() => setIsDiagnosticModalOpen(true)}
          />
        )}

        {activeTab === "schools" && (
          <SuperAdminSchoolsTab
            schools={schools}
            students={students}
            programs={programs}
            logs={logs}
            locale={locale}
            onUpdateSchools={onUpdateSchools}
            onAddLog={onAddLog}
            onSelectSchoolTab={onSelectSchoolTab}
            onOpenDiagnostic={() => setIsDiagnosticModalOpen(true)}
          />
        )}

        {activeTab === "students" && (
          <SuperAdminStudentsTab
            students={students}
            schools={schools}
            locale={locale}
            onUpdateStudents={onUpdateStudents}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "programs" && (
          <SuperAdminProgramsTab
            programs={programs}
            schools={schools}
            locale={locale}
            onUpdatePrograms={onUpdatePrograms}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "reports" && (
          <SuperAdminReportsTab
            schools={schools}
            students={students}
            programs={programs}
            logs={logs}
            locale={locale}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "announcements" && (
          <SuperAdminAnnouncementsTab
            announcements={announcements}
            schools={schools}
            locale={locale}
            onUpdateAnnouncements={onUpdateAnnouncements}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "whatsapp" && (
          <SuperAdminWhatsAppTab
            config={config}
            locale={locale}
            onUpdateConfig={onUpdateConfig}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "platform" && (
          <SuperAdminSettingsTab
            config={config}
            locale={locale}
            onUpdateConfig={onUpdateConfig}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "security-logs" && (
          <SuperAdminLogsTab
            logs={logs}
            locale={locale}
            onAddLog={onAddLog}
          />
        )}

        {activeTab === "profile" && (
          <SuperAdminProfileTab
            locale={locale}
            theme={theme}
            onUpdateLocale={onUpdateLocale}
            onUpdateTheme={onUpdateTheme}
            onAddLog={onAddLog}
          />
        )}
      </SuperAdminLayout>

      {/* Super Admin Management Flow Diagnostic Modal */}
      <SuperAdminDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        locale={locale}
        schools={schools}
        students={students}
        onAddLog={onAddLog}
      />
    </>
  );
};
