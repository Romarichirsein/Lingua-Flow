import React, { useState, useEffect } from "react";
import {
  School,
  Student,
  Program,
  UILocale,
  AuditLog,
  AIWritingSubmission,
  Announcement,
} from "../../types";
import { SchoolLayout } from "../layouts/SchoolLayout";
import { navigateTo } from "../../lib/router";
import { getEffectiveStatus } from "../../lib/syncEngine";
import { SchoolBlockedScreen } from "./SchoolBlockedScreen";

// Extracted Modular School Components
import { SchoolOverviewTab } from "./SchoolOverviewTab";
import { SchoolStudentsTab } from "./SchoolStudentsTab";
import { SchoolStudentDetailModal } from "./SchoolStudentDetailModal";
import { SchoolProgramsTab } from "./SchoolProgramsTab";
import { SchoolCourseBuilderTab } from "./SchoolCourseBuilderTab";
import { SchoolEvaluationsTab } from "./SchoolEvaluationsTab";
import { SchoolAnalyticsTab } from "./SchoolAnalyticsTab";
import { SchoolSettingsTab } from "./SchoolSettingsTab";
import { SchoolAuditTab } from "./SchoolAuditTab";

interface SchoolDashboardProps {
  locale: UILocale;
  school: School;
  students: Student[];
  programs: Program[];
  auditLogs?: AuditLog[];
  submissions?: AIWritingSubmission[];
  announcements?: Announcement[];
  activeSubpath?: string;
  config?: any;
  onUpdateStudents: (students: Student[]) => void;
  onUpdatePrograms: (programs: Program[]) => void;
  onUpdateSchool: (school: School) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error", extra?: any) => void;
  onSelectStudentTab?: (studentId: string) => void;
}

export const SchoolDashboard: React.FC<SchoolDashboardProps> = ({
  locale,
  school,
  students,
  programs,
  auditLogs = [],
  submissions = [],
  announcements = [],
  activeSubpath = "dashboard",
  config = { superAdminWhatsapp: "https://wa.me/33612345678" },
  onUpdateStudents,
  onUpdatePrograms,
  onUpdateSchool,
  onAddLog,
  onSelectStudentTab,
}) => {
  const effectiveStatus = getEffectiveStatus(school);
  const isSchoolRestricted = effectiveStatus !== "active";

  // Dedicated School Logger guaranteeing schoolId and schoolName
  const handleSchoolAddLog = (
    action: string,
    details: string,
    status: "success" | "warning" | "error" = "success",
    extra?: any
  ) => {
    onAddLog(action, details, status, {
      schoolId: school.id,
      schoolName: school.name,
      ...extra,
    });
  };

  // Active School Tab state
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "students" | "programs" | "courses" | "evaluations" | "pedagogy" | "audit" | "settings"
  >(
    activeSubpath === "students" ||
    activeSubpath === "programs" ||
    activeSubpath === "courses" ||
    activeSubpath === "evaluations" ||
    activeSubpath === "pedagogy" ||
    activeSubpath === "audit" ||
    activeSubpath === "settings"
      ? (activeSubpath as any)
      : "dashboard"
  );

  // Sync when activeSubpath prop changes from router
  useEffect(() => {
    if (
      activeSubpath &&
      ["dashboard", "students", "programs", "courses", "evaluations", "pedagogy", "audit", "settings"].includes(activeSubpath)
    ) {
      setActiveTab(activeSubpath as any);
    }
  }, [activeSubpath]);

  const switchTab = (
    tab: "dashboard" | "students" | "programs" | "courses" | "evaluations" | "pedagogy" | "audit" | "settings"
  ) => {
    setActiveTab(tab);
    navigateTo(`/ecole/${school.slug}/${tab}`);
  };

  // Selected Program ID for Course Builder transition
  const [builderProgramId, setBuilderProgramId] = useState<string>("");

  // Detailed Modal for a specific Student
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);

  const handleOpenCourseBuilder = (programId: string) => {
    setBuilderProgramId(programId);
    switchTab("courses");
  };

  const handleOpenStudentDetail = (student: Student) => {
    setSelectedDetailStudent(student);
  };

  if (isSchoolRestricted) {
    return (
      <SchoolBlockedScreen
        school={school}
        config={config}
        locale={locale}
        reason={effectiveStatus as "suspended" | "blocked" | "expired"}
      />
    );
  }

  return (
    <SchoolLayout
      locale={locale}
      school={school}
      students={students}
      programs={programs}
      auditLogs={auditLogs}
      activeTab={activeTab}
      onTabChange={switchTab}
    >
      {/* 1. OVERVIEW TAB */}
      {activeTab === "dashboard" && (
        <SchoolOverviewTab
          locale={locale}
          school={school}
          students={students}
          programs={programs}
          announcements={announcements}
          onNavigateTab={switchTab}
          onOpenAddStudent={() => switchTab("students")}
          onOpenCreateProgram={() => switchTab("programs")}
        />
      )}

      {/* 2. STUDENTS TAB */}
      {activeTab === "students" && (
        <SchoolStudentsTab
          locale={locale}
          school={school}
          students={students}
          programs={programs}
          submissions={submissions}
          onUpdateStudents={onUpdateStudents}
          onAddLog={handleSchoolAddLog}
          onOpenStudentDetail={handleOpenStudentDetail}
          onSelectStudentTab={onSelectStudentTab}
        />
      )}

      {/* 3. PROGRAMS TAB */}
      {activeTab === "programs" && (
        <SchoolProgramsTab
          locale={locale}
          school={school}
          programs={programs}
          students={students}
          onUpdatePrograms={onUpdatePrograms}
          onAddLog={handleSchoolAddLog}
          onOpenCourseBuilder={handleOpenCourseBuilder}
        />
      )}

      {/* 4. COURSES / MEDIA BUILDER TAB */}
      {activeTab === "courses" && (
        <SchoolCourseBuilderTab
          locale={locale}
          school={school}
          programs={programs}
          selectedProgramId={builderProgramId}
          onUpdatePrograms={onUpdatePrograms}
          onAddLog={handleSchoolAddLog}
        />
      )}

      {/* 5. EVALUATIONS / QUIZZES TAB */}
      {activeTab === "evaluations" && (
        <SchoolEvaluationsTab
          locale={locale}
          school={school}
          programs={programs}
          students={students}
          submissions={submissions}
          onUpdatePrograms={onUpdatePrograms}
          onAddLog={handleSchoolAddLog}
        />
      )}

      {/* 6. PEDAGOGY & ANALYTICS TAB */}
      {activeTab === "pedagogy" && (
        <SchoolAnalyticsTab
          locale={locale}
          school={school}
          programs={programs}
          students={students}
          onAddLog={handleSchoolAddLog}
          onOpenStudentDetail={handleOpenStudentDetail}
        />
      )}

      {/* 7. AUDIT & TRACEABILITY TAB */}
      {activeTab === "audit" && (
        <SchoolAuditTab
          locale={locale}
          school={school}
          auditLogs={auditLogs}
          onAddLog={handleSchoolAddLog}
        />
      )}

      {/* 8. SETTINGS TAB */}
      {activeTab === "settings" && (
        <SchoolSettingsTab
          locale={locale}
          school={school}
          auditLogs={auditLogs}
          onUpdateSchool={onUpdateSchool}
          onAddLog={handleSchoolAddLog}
        />
      )}

      {/* Global Student Deep-dive Modal */}
      {selectedDetailStudent && (
        <SchoolStudentDetailModal
          isOpen={Boolean(selectedDetailStudent)}
          locale={locale}
          school={school}
          student={selectedDetailStudent}
          programs={programs}
          submissions={submissions}
          onClose={() => setSelectedDetailStudent(null)}
          onUpdateStudent={(updated) => {
            const updatedList = students.map((s) => (s.id === updated.id ? updated : s));
            onUpdateStudents(updatedList);
            setSelectedDetailStudent(updated);
            handleSchoolAddLog(
              "Mise à jour élève",
              `Profil et identifiants de l'élève ${updated.name} mis à jour.`,
              "success"
            );
          }}
          onToggleStatus={(student, newStatus) => {
            const updatedList = students.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s));
            onUpdateStudents(updatedList);
            if (selectedDetailStudent?.id === student.id) {
              setSelectedDetailStudent({ ...selectedDetailStudent, status: newStatus });
            }
            handleSchoolAddLog(
              "Statut élève mis à jour",
              `Statut de ${student.name} modifié : ${newStatus.toUpperCase()}`,
              "success"
            );
          }}
          onExtendAccess={(student, months) => {
            const currentEnd = new Date(student.endDate);
            const newEnd = new Date(currentEnd);
            newEnd.setMonth(newEnd.getMonth() + months);
            const formatted = newEnd.toISOString().split("T")[0];
            const updatedList = students.map((s) =>
              s.id === student.id ? { ...s, endDate: formatted, status: "active" as const } : s
            );
            onUpdateStudents(updatedList);
            if (selectedDetailStudent?.id === student.id) {
              setSelectedDetailStudent({ ...selectedDetailStudent, endDate: formatted, status: "active" });
            }
            handleSchoolAddLog(
              "Prolongation accès",
              `Accès de ${student.name} prolongé jusqu'au ${formatted}.`,
              "success"
            );
          }}
          onResetProgress={(student) => {
            const updatedList = students.map((s) =>
              s.id === student.id ? { ...s, progressPercent: 0, completedLessons: [] } : s
            );
            onUpdateStudents(updatedList);
            if (selectedDetailStudent?.id === student.id) {
              setSelectedDetailStudent({ ...selectedDetailStudent, progressPercent: 0, completedLessons: [] });
            }
            handleSchoolAddLog(
              "Réinitialisation progression",
              `Progression de l'élève ${student.name} remise à zéro.`,
              "warning"
            );
          }}
          onSelectStudentTab={onSelectStudentTab}
        />
      )}
    </SchoolLayout>
  );
};
