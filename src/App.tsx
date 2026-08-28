/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserRole,
  UILocale,
  ThemeMode,
  School,
  Student,
  Program,
  ActivityLog,
  GlobalPlatformConfig,
} from "./types";
import {
  getStoredData,
  saveStoredData,
} from "./lib/mockData";
import {
  buildSuperAdminWhatsAppUrl,
  buildStudentSchoolWhatsAppUrl,
} from "./lib/syncEngine";
import {
  parseCurrentRoute,
  navigateTo,
  AppRoute,
  getSchoolSlug,
  getStudentSlug,
} from "./lib/router";
import { pageTransition } from "./lib/motionVariants";
import { SplashScreen } from "./components/common/SplashScreen";
import { LoginPage } from "./components/auth/LoginPage";
import { Header } from "./components/common/Header";
import { FloatingWhatsApp } from "./components/common/FloatingWhatsApp";
import { SuperAdminDashboard } from "./components/superadmin/SuperAdminDashboard";
import { SchoolDashboard } from "./components/school/SchoolDashboard";
import { StudentPortal } from "./components/student/StudentPortal";

export default function App() {
  // Persistence initialization
  const [data, setData] = useState(() => getStoredData());

  // App Lifecycle States: Direct instant render -> Login / Dashboard
  const [showSplash, setShowSplash] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const route = parseCurrentRoute();
    return route.type !== "login" && route.type !== "splash";
  });
  const [currentUserName, setCurrentUserName] = useState<string>("Romaric Hirsein");

  const [role, setRole] = useState<UserRole>("student");
  const [locale, setLocale] = useState<UILocale>("fr");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("linguaflow_theme_preference") as ThemeMode;
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    } catch {
      // fallback
    }
    return "dark";
  });

  const handleThemeChange = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("linguaflow_theme_preference", newTheme);
    } catch {
      // ignore
    }
  }, []);

  // Selected School & Student for testing isolation
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    data.schools[0]?.id || "school-berlin"
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    data.students[0]?.id || "stu-romaric"
  );

  // Active subpath for tabs
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => parseCurrentRoute());

  // Sync theme to DOM <html> class
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (current: ThemeMode) => {
      if (current === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else if (current === "light") {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      } else {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isSystemDark) {
          root.classList.add("dark");
          root.style.colorScheme = "dark";
        } else {
          root.classList.remove("dark");
          root.style.colorScheme = "light";
        }
      }
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  // Route Synchronization Effect
  const handleRouteChange = useCallback(() => {
    const route = parseCurrentRoute();
    setCurrentRoute(route);

    if (route.type === "login") {
      setIsAuthenticated(false);
      return;
    }

    if (route.type === "superadmin") {
      setRole("super_admin");
      setIsAuthenticated(true);
      setCurrentUserName("Super Admin LinguaFlow");
    } else if (route.type === "school" && route.slug) {
      const matchedSchool = data.schools.find(
        (s) => s.slug === route.slug || getSchoolSlug(s.name) === route.slug
      );
      if (matchedSchool) {
        setSelectedSchoolId(matchedSchool.id);
        setRole("school_admin");
        setIsAuthenticated(true);
        setCurrentUserName(matchedSchool.managerName || `Directeur ${matchedSchool.name}`);
      }
    } else if (route.type === "student" && route.slug) {
      const matchedStudent = data.students.find(
        (st) => getStudentSlug(st.name) === route.slug || st.id === route.slug
      );
      if (matchedStudent) {
        setSelectedStudentId(matchedStudent.id);
        setSelectedSchoolId(matchedStudent.schoolId);
        setRole("student");
        setIsAuthenticated(true);
        setCurrentUserName(matchedStudent.name);
      }
    }
  }, [data.schools, data.students]);

  useEffect(() => {
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    // Initial check if hash exists
    if (window.location.hash) {
      handleRouteChange();
    }

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [handleRouteChange]);

  // Persistent save helper
  const updateData = (partial: Partial<typeof data>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveStoredData(next);
      return next;
    });
  };

  // Add an audit log entry
  const handleAddLog = (
    action: string,
    details: string,
    status: "success" | "warning" | "error" = "success"
  ) => {
    const currentSchool = data.schools.find((s) => s.id === selectedSchoolId);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      actorRole: role,
      actorName: currentUserName || (role === "super_admin" ? "Super Admin" : "Utilisateur"),
      schoolName: currentSchool?.name,
      timestamp: new Date().toISOString(),
      status,
    };
    updateData({ logs: [newLog, ...data.logs] });
  };

  // Switch role handler with URL sync
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "super_admin") {
      navigateTo("/superadmin/dashboard");
      setCurrentUserName("Super Admin LinguaFlow");
    } else if (newRole === "school_admin") {
      const sch = data.schools.find((s) => s.id === selectedSchoolId) || data.schools[0];
      if (sch) {
        navigateTo(`/ecole/${sch.slug}/dashboard`);
        setCurrentUserName(sch.managerName || `Directeur ${sch.name}`);
      }
    } else if (newRole === "student") {
      const st = data.students.find((s) => s.id === selectedStudentId) || data.students[0];
      if (st) {
        navigateTo(`/eleve/${getStudentSlug(st.name)}/courses`);
        setCurrentUserName(st.name);
      }
    }
  };

  // Login handler
  const handleLoginSuccess = (params: {
    role: UserRole;
    schoolId?: string;
    studentId?: string;
    userName: string;
    userEmail: string;
  }) => {
    setRole(params.role);
    if (params.schoolId) setSelectedSchoolId(params.schoolId);
    if (params.studentId) setSelectedStudentId(params.studentId);
    setCurrentUserName(params.userName);
    setIsAuthenticated(true);

    if (params.role === "super_admin") {
      navigateTo("/superadmin/dashboard");
    } else if (params.role === "school_admin" && params.schoolId) {
      const sch = data.schools.find((s) => s.id === params.schoolId);
      if (sch) navigateTo(`/ecole/${sch.slug}/dashboard`);
    } else if (params.role === "student" && params.studentId) {
      const st = data.students.find((s) => s.id === params.studentId);
      if (st) navigateTo(`/eleve/${getStudentSlug(st.name)}/courses`);
    }

    // Record login log
    handleAddLog(
      "Connexion Utilisateur",
      `Session ouverte pour ${params.userName} (${params.userEmail}) avec le rôle ${params.role}.`,
      "success"
    );
  };

  // Logout handler
  const handleLogout = () => {
    handleAddLog(
      "Déconnexion Utilisateur",
      `Fermeture de la session de ${currentUserName}.`,
      "success"
    );
    setIsAuthenticated(false);
    navigateTo("/login");
  };

  // Current active school & student entities
  const currentSchool =
    data.schools.find((s) => s.id === selectedSchoolId) || data.schools[0];
  const currentStudent =
    data.students.find((s) => s.id === selectedStudentId) || data.students[0];

  // Dynamic WhatsApp routing:
  // - Super Admin: No floating WhatsApp widget
  // - School Admin: Direct WhatsApp contact to Super Admin
  // - Student: School WhatsApp Promo / Community Group link
  const activeWhatsappUrl =
    role === "student"
      ? currentSchool?.whatsappSupportUrl || "https://chat.whatsapp.com/LinguaFlowPromo2025"
      : role === "school_admin"
      ? buildSuperAdminWhatsAppUrl(data.config, currentSchool, locale)
      : "";

  const recipientName =
    role === "student"
      ? `${currentSchool?.name || "École"} (Groupe WhatsApp de la Promotion)`
      : "Support Technique Super Admin LinguaFlow";

  return (
    <AnimatePresence mode="wait">
      {/* 1. Initial Splash Screen with Circular Neon Dots animation */}
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : !isAuthenticated ? (
        /* 2. Authentication Login Page */
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <LoginPage
            locale={locale}
            onLocaleChange={setLocale}
            theme={theme}
            onThemeChange={handleThemeChange}
            schools={data.schools}
            students={data.students}
            onLoginSuccess={handleLoginSuccess}
          />
        </motion.div>
      ) : (
        /* 3. Dedicated Dashboard for authenticated user */
        <motion.div
          key="dashboard-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070A12] dark:text-slate-100 flex flex-col font-sans"
        >
          {/* Top Global Navigation & Tenant Context Switcher */}
          <Header
            currentRole={role}
            onRoleChange={handleRoleChange}
            locale={locale}
            onLocaleChange={setLocale}
            theme={theme}
            onThemeChange={handleThemeChange}
            currentSchool={currentSchool}
            currentStudent={currentStudent}
            availableSchools={data.schools}
            onSelectSchool={(schoolId) => {
              setSelectedSchoolId(schoolId);
              const sch = data.schools.find((s) => s.id === schoolId);
              if (sch && role === "school_admin") {
                navigateTo(`/ecole/${sch.slug}/dashboard`);
              }
            }}
            availableStudents={data.students}
            onSelectStudent={(studentId) => {
              setSelectedStudentId(studentId);
              const st = data.students.find((s) => s.id === studentId);
              if (st) {
                setSelectedSchoolId(st.schoolId);
                if (role === "student") {
                  navigateTo(`/eleve/${getStudentSlug(st.name)}/dashboard`);
                }
              }
            }}
            currentUserName={currentUserName}
            onLogout={handleLogout}
          />

          {/* Main Multi-Role Portal Views with Fluid Transitions */}
          <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
            <AnimatePresence mode="wait">
              {role === "super_admin" && (
                <motion.div
                  key="super-admin-view"
                  variants={pageTransition}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SuperAdminDashboard
                    locale={locale}
                    theme={theme}
                    schools={data.schools}
                    students={data.students}
                    programs={data.programs}
                    logs={data.logs}
                    config={data.config}
                    announcements={data.announcements}
                    templates={data.templates}
                    activeSubpath={currentRoute.subpath || "dashboard"}
                    onUpdateSchools={(schools) => updateData({ schools })}
                    onUpdateStudents={(students) => updateData({ students })}
                    onUpdatePrograms={(programs) => updateData({ programs })}
                    onUpdateConfig={(config) => updateData({ config })}
                    onUpdateAnnouncements={(announcements) => updateData({ announcements })}
                    onUpdateTemplates={(templates) => updateData({ templates })}
                    onUpdateLocale={setLocale}
                    onUpdateTheme={handleThemeChange}
                    onAddLog={handleAddLog}
                    onSelectSchoolTab={(schoolId) => {
                      setSelectedSchoolId(schoolId);
                      setRole("school_admin");
                    }}
                  />
                </motion.div>
              )}

              {role === "school_admin" && currentSchool && (
                <motion.div
                  key={`school-admin-view-${currentSchool.id}`}
                  variants={pageTransition}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SchoolDashboard
                    locale={locale}
                    school={currentSchool}
                    students={data.students}
                    programs={data.programs}
                    auditLogs={data.logs}
                    submissions={data.aiSubmissions || []}
                    announcements={data.announcements || []}
                    activeSubpath={currentRoute.subpath || "dashboard"}
                    config={data.config}
                    onUpdateStudents={(students) => updateData({ students })}
                    onUpdatePrograms={(programs) => updateData({ programs })}
                    onUpdateSchool={(updatedSchool) =>
                      updateData({
                        schools: data.schools.map((s) =>
                          s.id === updatedSchool.id ? updatedSchool : s
                        ),
                      })
                    }
                    onAddLog={handleAddLog}
                    onSelectStudentTab={(studentId) => {
                      setSelectedStudentId(studentId);
                      setRole("student");
                    }}
                  />
                </motion.div>
              )}

              {role === "student" && currentStudent && currentSchool && (
                <motion.div
                  key={`student-view-${currentStudent.id}`}
                  variants={pageTransition}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <StudentPortal
                    locale={locale}
                    theme={theme}
                    onUpdateTheme={handleThemeChange}
                    student={currentStudent}
                    school={currentSchool}
                    programs={data.programs}
                    submissions={data.aiSubmissions || []}
                    announcements={data.announcements || []}
                    activeSubpath={currentRoute.subpath || "dashboard"}
                    onUpdateStudent={(updatedStudent) =>
                      updateData({
                        students: data.students.map((s) =>
                          s.id === updatedStudent.id ? updatedStudent : s
                        ),
                      })
                    }
                    onSaveSubmission={(newSub) => {
                      updateData({
                        aiSubmissions: [newSub, ...(data.aiSubmissions || []).filter((s) => s.id !== newSub.id)],
                      });
                      handleAddLog(
                        "Rédaction IA Validée",
                        `L'élève ${currentStudent.name} a soumis un texte sur "${newSub.topic}" (Score: ${newSub.result.overallScore || newSub.result.score?.grammar || 80}/100).`
                      );
                    }}
                    onUpdateLocale={setLocale}
                    onAddLog={handleAddLog}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Floating Dynamic WhatsApp Support Button */}
          <FloatingWhatsApp
            role={role}
            whatsappUrl={activeWhatsappUrl}
            recipientName={recipientName}
            locale={locale}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
