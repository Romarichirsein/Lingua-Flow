import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Student,
  School,
  Program,
  Lesson,
  CourseModule,
  AIWritingSubmission,
  UILocale,
  Announcement,
  ThemeMode,
} from "../../types";
import { translations } from "../../lib/translations";
import { StudentLayout, StudentTab } from "../layouts/StudentLayout";
import { StudentBlockedScreen } from "./StudentBlockedScreen";
import { getEffectiveStatus, isLessonAccessible, calculateProgression } from "../../lib/syncEngine";
import { ProgressionService } from "../../lib/progressionService";
import {
  unlockedModule,
  quizSuccess,
  lessonUnlockVariant,
  isReducedMotion,
} from "../../lib/motionVariants";
import { StudentDashboardTab } from "./StudentDashboardTab";
import { StudentProgramsTab } from "./StudentProgramsTab";
import { InteractiveLessonPlayer } from "./InteractiveLessonPlayer";
import { AIChatTutor } from "./AIChatTutor";
import { StudentPrufungTab } from "./StudentPrufungTab";
import { StudentProgressTab } from "./StudentProgressTab";
import { StudentNotificationsTab } from "./StudentNotificationsTab";
import { StudentProfileTab } from "./StudentProfileTab";
import { ModuleUnlockedModal } from "../common/CelebrationEffects";
import { navigateTo } from "../../lib/router";
import {
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Lock,
  PlayCircle,
  Layers,
  HelpCircle,
  Award,
  ChevronRight,
  Unlock,
  Check,
} from "lucide-react";

interface StudentPortalProps {
  locale: UILocale;
  student: Student;
  school: School;
  programs: Program[];
  activeSubpath?: string;
  submissions?: AIWritingSubmission[];
  announcements?: Announcement[];
  theme?: ThemeMode;
  onUpdateTheme?: (theme: ThemeMode) => void;
  onUpdateStudent: (student: Student) => void;
  onUpdateLocale?: (locale: UILocale) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
  onSaveSubmission?: (submission: AIWritingSubmission) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  locale,
  student,
  school,
  programs,
  activeSubpath = "dashboard",
  submissions = [],
  announcements = [],
  theme = "dark",
  onUpdateTheme,
  onUpdateStudent,
  onUpdateLocale = () => {},
  onAddLog,
  onSaveSubmission,
}) => {
  const t = translations[locale];
  const studentSlug = student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Determine initial tab from route
  const validTabs: StudentTab[] = [
    "dashboard",
    "programs",
    "courses",
    "chat",
    "evaluations",
    "progress",
    "notifications",
    "profile",
  ];

  const initialTab: StudentTab = validTabs.includes(activeSubpath as StudentTab)
    ? (activeSubpath as StudentTab)
    : "dashboard";

  const [activeTab, setActiveTab] = useState<StudentTab>(initialTab);

  const switchTab = (tab: StudentTab) => {
    setActiveTab(tab);
    navigateTo(`/eleve/${studentSlug}/${tab}`);
  };

  // Get current program assigned to this student
  const activeProgram =
    programs.find((p) => p.id === student.enrolledProgramId) ||
    programs.find((p) => p.schoolId === school.id) ||
    programs[0];

  // Flatten all lessons in program
  const allLessons: Lesson[] = activeProgram
    ? (activeProgram.modules || []).flatMap((m) => m.lessons || [])
    : [];

  // Active selected lesson for courses tab
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    student.lastActiveLessonId || allLessons[0]?.id || ""
  );

  const currentLesson =
    allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];

  // Expiration / Suspension check
  const schoolEffective = getEffectiveStatus(school);
  const studentEffective = getEffectiveStatus(student);
  const isSchoolLocked = schoolEffective !== "active";
  const isStudentLocked = studentEffective !== "active";
  const isAccessLocked = isSchoolLocked || isStudentLocked;

  // Module Unlocking Modal State
  const [unlockedModuleModal, setUnlockedModuleModal] = useState<{
    isOpen: boolean;
    moduleTitle: string;
    moduleOrder: number;
    totalLessons: number;
  }>({
    isOpen: false,
    moduleTitle: "",
    moduleOrder: 1,
    totalLessons: 0,
  });

  // Complete a lesson handler with ProgressionService, server sync & module unlock detection
  const handleCompleteLesson = (lessonId: string) => {
    if (!activeProgram) return;

    // Use ProgressionService to recalculate percentages, generate notifications, and update progress
    const result = ProgressionService.completeLesson({
      student,
      program: activeProgram,
      lessonId,
      locale,
    });

    // Update state and logs
    onUpdateStudent(result.student);
    onAddLog(result.activityLog.action, result.activityLog.details);

    // Save personal completion notifications strictly isolated to this student
    if (result.newNotifications && result.newNotifications.length > 0) {
      try {
        const notifKey = `linguaflow_student_completed_notifs_${student.id}`;
        const existingNotifs = JSON.parse(localStorage.getItem(notifKey) || "[]");
        const updated = [...result.newNotifications, ...existingNotifs].slice(0, 20);
        localStorage.setItem(notifKey, JSON.stringify(updated));
      } catch {}
    }

    // Call server endpoint asynchronously for persistent server calculation
    fetch("/api/progression/complete-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.id,
        schoolId: school.id,
        programId: activeProgram.id,
        lessonId,
        completedLessons: result.student.completedLessons,
        totalProgramLessonsCount: allLessons.length,
      }),
    }).catch((err) => console.log("Progression server sync:", err.message));

    // If a module was newly completed, display celebration modal
    if (result.isModuleCompleted && result.completedModule) {
      const activeMods = activeProgram.modules || [];
      const currentModIndex = activeMods.findIndex(
        (m) => m.id === result.completedModule?.id
      );
      if (currentModIndex !== -1 && currentModIndex < activeMods.length - 1) {
        const nextMod = activeMods[currentModIndex + 1];
        setUnlockedModuleModal({
          isOpen: true,
          moduleTitle: nextMod.title,
          moduleOrder: currentModIndex + 2,
          totalLessons: (nextMod.lessons || []).length,
        });
      }
    }
  };

  // Dynamic robot logo and tab title for LinguaFlow AI tab
  React.useEffect(() => {
    if (activeTab === "chat") {
      document.title = "LinguaFlow AI 🤖 | Tuteur Intelligent";
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) link.href = "/robot.svg";
    } else {
      document.title = "LinguaFlow - Plateforme E-Learning B2B Multi-Écoles";
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) link.href = "/logo.png";
    }
  }, [activeTab]);

  const currentIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const hasPrevLesson = currentIndex > 0;
  const hasNextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1;

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const nextLesson = allLessons[currentIndex + 1];
      // Sequential lock check: only advance if next lesson is accessible
      if (nextLesson && isLessonAccessible(nextLesson, allLessons, student.completedLessons || [])) {
        setSelectedLessonId(nextLesson.id);
      }
    }
  };

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      setSelectedLessonId(allLessons[currentIndex - 1].id);
    }
  };

  const handleOpenSpecificLesson = (lessonId: string) => {
    const target = allLessons.find((l) => l.id === lessonId);
    if (target && isLessonAccessible(target, allLessons, student.completedLessons || [])) {
      setSelectedLessonId(lessonId);
    }
    switchTab("courses");
  };

  // If the student's or school's access is locked, display the dedicated blocked screen
  if (isAccessLocked) {
    const lockReason = isSchoolLocked
      ? (schoolEffective as "expired" | "suspended" | "blocked")
      : (studentEffective as "expired" | "suspended" | "blocked");

    return (
      <StudentBlockedScreen
        student={student}
        school={school}
        locale={locale}
        reason={lockReason}
        onLogout={() => navigateTo("/login")}
      />
    );
  }

  return (
    <>
      <StudentLayout
        student={student}
        school={school}
        activeTab={activeTab}
        onTabChange={switchTab}
        completedLessonsCount={(student.completedLessons || []).length}
        totalLessonsCount={allLessons.length}
        locale={locale}
      >
        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <StudentDashboardTab
            student={student}
            school={school}
            program={activeProgram}
            allLessons={allLessons}
            locale={locale}
            announcements={announcements}
            onResumeCourse={(lessonId) => {
              if (lessonId) setSelectedLessonId(lessonId);
              switchTab("courses");
            }}
            onOpenPrograms={() => switchTab("programs")}
            onOpenEvaluations={() => switchTab("evaluations")}
            onOpenChat={() => switchTab("chat")}
          />
        )}

        {/* 2. PROGRAMS TAB */}
        {activeTab === "programs" && (
          <StudentProgramsTab
            student={student}
            school={school}
            programs={programs}
            locale={locale}
            onSelectProgram={(programId) => {
              const updatedStudent: Student = {
                ...student,
                enrolledProgramId: programId,
              };
              onUpdateStudent(updatedStudent);
            }}
            onOpenLesson={handleOpenSpecificLesson}
          />
        )}

        {/* 3. COURSES & LESSON PLAYER TAB */}
        {activeTab === "courses" && (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Syllabus: on mobile it shows below the video player for instant lesson access */}
            <div className="order-2 lg:order-1 lg:col-span-4 space-y-4 w-full min-w-0">
              <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={18} className="text-indigo-500" />
                    {locale === "en" ? "Program Syllabus" : "Plan du Programme"}
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 uppercase">
                    {t.student.levelBadge} {student.level}
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {(activeProgram?.modules || []).map((mod, mIdx) => {
                    const studentCompleted = student.completedLessons || [];
                    const modLessons = mod.lessons || [];
                    const isModCompleted =
                      modLessons.length > 0 &&
                      modLessons.every((l) => studentCompleted.includes(l.id));
                    const completedCountInMod = modLessons.filter((l) =>
                      studentCompleted.includes(l.id)
                    ).length;

                    return (
                      <motion.div
                        key={mod.id}
                        variants={unlockedModule}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-2 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 p-3 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {t.student.module} {mIdx + 1}: {mod.title}
                          </p>
                          {isModCompleted ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <Check size={11} /> {t.student.validated}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">
                              {completedCountInMod}/{modLessons.length}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {modLessons.map((les) => {
                            const isSelected = selectedLessonId === les.id;
                            const isDone = studentCompleted.includes(les.id);
                            const isAccessible = isLessonAccessible(les, allLessons, studentCompleted);

                            return (
                              <motion.button
                                key={les.id}
                                type="button"
                                disabled={!isAccessible}
                                variants={lessonUnlockVariant}
                                initial="locked"
                                animate={isReducedMotion() ? "unlockedReduced" : "unlocked"}
                                whileHover={isAccessible ? { x: 2 } : {}}
                                whileTap={isAccessible ? { scale: 0.98 } : {}}
                                onClick={() => {
                                  if (isAccessible) {
                                    setSelectedLessonId(les.id);
                                  }
                                }}
                                title={
                                  !isAccessible
                                    ? (locale === "en" ? "Locked: Complete previous lessons and quizzes" : "Verrouillée : Terminez les leçons précédentes et leurs quiz")
                                    : les.title
                                }
                                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                                  !isAccessible
                                    ? "border-slate-100 dark:border-white/5 opacity-50 cursor-not-allowed bg-slate-50/50 dark:bg-white/[0.02] text-slate-400"
                                    : isSelected
                                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs cursor-pointer"
                                    : isDone
                                    ? "border-slate-200/60 dark:border-slate-800 bg-emerald-500/5 text-slate-700 dark:text-slate-300 cursor-pointer"
                                    : "border-slate-100 dark:border-white/5 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 cursor-pointer"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {!isAccessible ? (
                                    <Lock
                                      size={14}
                                      className="text-slate-400 shrink-0"
                                    />
                                  ) : isDone ? (
                                    <CheckCircle2
                                      size={15}
                                      className="text-emerald-500 shrink-0"
                                    />
                                  ) : isSelected ? (
                                    <PlayCircle
                                      size={15}
                                      className="text-indigo-500 shrink-0 animate-pulse"
                                    />
                                  ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                                  )}
                                  <span className="truncate">{les.title}</span>
                                </div>

                                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                  {!isAccessible ? (
                                    <Lock size={12} className="inline text-slate-400" />
                                  ) : (
                                    `${les.durationMinutes}m`
                                  )}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Interactive Lesson Player: order-1 on mobile for immediate access */}
            <div className="order-1 lg:order-2 lg:col-span-8 w-full min-w-0">
              {currentLesson ? (
                <InteractiveLessonPlayer
                  lesson={currentLesson}
                  student={student}
                  school={school}
                  locale={locale}
                  onCompleteLesson={handleCompleteLesson}
                  onNextLesson={handleNextLesson}
                  onPrevLesson={handlePrevLesson}
                  isAlreadyCompleted={(student.completedLessons || []).includes(currentLesson.id)}
                  hasPrevLesson={hasPrevLesson}
                  hasNextLesson={hasNextLesson}
                />
              ) : (
                <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center text-slate-400">
                  {locale === "en" ? "No lesson available for this program." : "Aucune leçon disponible pour ce programme."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. AI CHAT TUTOR TAB */}
        {activeTab === "chat" && (
          <AIChatTutor student={student} school={school} locale={locale} />
        )}

        {/* 6. PRÜFUNG & ZERTIFIZIERUNG TAB */}
        {activeTab === "evaluations" && (
          <StudentPrufungTab
            student={student}
            school={school}
            program={activeProgram}
            allLessons={allLessons}
            locale={locale}
            onCompleteLesson={handleCompleteLesson}
            onOpenLesson={handleOpenSpecificLesson}
          />
        )}

        {/* 7. CERTIFICATE & PROGRESS TAB */}
        {activeTab === "progress" && (
          <StudentProgressTab
            student={student}
            school={school}
            program={activeProgram}
            allLessons={allLessons}
            locale={locale}
          />
        )}

        {/* 8. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <StudentNotificationsTab
            student={student}
            school={school}
            locale={locale}
            announcements={announcements}
            onNavigateTab={(tab) => switchTab(tab)}
          />
        )}

        {/* 9. PROFILE & SETTINGS TAB */}
        {activeTab === "profile" && (
          <StudentProfileTab
            student={student}
            school={school}
            program={activeProgram}
            locale={locale}
            theme={theme}
            onUpdateTheme={onUpdateTheme}
            onUpdateLocale={onUpdateLocale}
            onUpdateStudent={onUpdateStudent}
            onAddLog={onAddLog}
          />
        )}
      </StudentLayout>

      {/* Module Unlocked Celebration Modal */}
      <ModuleUnlockedModal
        isOpen={unlockedModuleModal.isOpen}
        moduleTitle={unlockedModuleModal.moduleTitle}
        moduleOrder={unlockedModuleModal.moduleOrder}
        totalLessons={unlockedModuleModal.totalLessons}
        language={school.language}
        onClose={() =>
          setUnlockedModuleModal((prev) => ({ ...prev, isOpen: false }))
        }
        onContinue={() => {
          setUnlockedModuleModal((prev) => ({ ...prev, isOpen: false }));
          switchTab("courses");
        }}
      />
    </>
  );
};
