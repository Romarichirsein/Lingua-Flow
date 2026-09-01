import React from "react";
import { motion } from "motion/react";
import { Student, School, Program, Lesson, UILocale, Announcement } from "../../types";
import { translations } from "../../lib/translations";
import { computeDaysRemaining } from "../../lib/syncEngine";
import { ProgressBar } from "../common/ProgressBar";
import { NeonButton } from "../common/NeonButton";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Clock,
  Calendar,
  Award,
  Layers,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Bell,
  Check,
  ChevronRight,
} from "lucide-react";

interface StudentDashboardTabProps {
  student: Student;
  school: School;
  program: Program | undefined;
  allLessons: Lesson[];
  locale: UILocale;
  announcements: Announcement[];
  onResumeCourse: (lessonId?: string) => void;
  onOpenPrograms: () => void;
  onOpenWriting: () => void;
  onOpenChat: () => void;
}

export const StudentDashboardTab: React.FC<StudentDashboardTabProps> = ({
  student,
  school,
  program,
  allLessons,
  locale,
  announcements,
  onResumeCourse,
  onOpenPrograms,
  onOpenWriting,
  onOpenChat,
}) => {
  const t = translations[locale];

  // Calculate remaining days safely
  const daysRemaining = computeDaysRemaining(student.endDate);
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  const completedLessons = student.completedLessons || [];
  const safeLessons = allLessons || [];

  // Active or Next Lesson
  const lastActiveLesson =
    safeLessons.find((l) => l.id === student.lastActiveLessonId) ||
    safeLessons.find((l) => !completedLessons.includes(l.id)) ||
    safeLessons[0];

  // Calculate completed modules
  const completedModulesCount = (program?.modules || []).filter((m) =>
    (m.lessons || []).every((l) => completedLessons.includes(l.id))
  ).length || 0;

  const totalModulesCount = (program?.modules || []).length || 0;

  // Filter actual school announcements for this student
  const relevantAnnouncements = (announcements || [])
    .filter(
      (a) =>
        a.target === "all" ||
        a.target === "students" ||
        a.targetSchoolId === school.id
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3); // show latest 3

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: Welcome + Quick Resume */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-[#0D1220] p-6 sm:p-8 text-white border border-indigo-500/20 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {school.language === "german" ? (locale === "en" ? "🇩🇪 German" : "🇩🇪 Allemand") : (locale === "en" ? "🇮🇹 Italian" : "🇮🇹 Italien")} • {t.student.levelBadge} {student.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90">
                {school.name}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t.student.welcome}, {student.name.split(" ")[0]} ! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {locale === "en"
                ? "Continue your learning right where you left off. Every completed module brings you closer to your official certificate."
                : "Continuez votre apprentissage là où vous vous étiez arrêté. Chaque module validé vous rapproche de votre attestation officielle."}
            </p>

            {/* Expiration alert pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs text-white/90 backdrop-blur-xs border border-white/10">
              <Calendar size={14} className="text-cyan-400" />
              <span>
                {locale === "en" ? "Access valid until " : "Accès valide jusqu'au "}
                <strong>{student.endDate}</strong> ({daysRemaining} {locale === "en" ? "days left" : "jours restants"})
              </span>
            </div>
          </div>

          {/* Hero Action Card */}
          {lastActiveLesson && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3 shrink-0 lg:w-80 shadow-lg">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  {locale === "en" ? "Current Lesson" : "Leçon en cours"}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock size={12} /> {lastActiveLesson.durationMinutes} min
                </span>
              </div>

              <h4 className="font-bold text-sm text-white line-clamp-2">
                {lastActiveLesson.title}
              </h4>

              <button
                type="button"
                onClick={() => onResumeCourse(lastActiveLesson.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <PlayCircle size={16} />
                <span>{t.student.continueLessonBtn}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. KEY METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Overall Progress */}
        <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.student.overallProgress}
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {student.progressPercent}%
            </span>
            <span className="text-xs text-slate-400">{locale === "en" ? "completed" : "complété"}</span>
          </div>
          <ProgressBar value={student.progressPercent} color="cyan" height="sm" />
        </div>

        {/* Metric 2: Completed Lessons */}
        <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.student.completedLessons}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {completedLessons.length}
            </span>
            <span className="text-xs text-slate-400">/ {safeLessons.length} {locale === "en" ? "lessons" : "leçons"}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {Math.max(0, safeLessons.length - completedLessons.length)} {locale === "en" ? "lessons left" : "leçons restantes"}
          </p>
        </div>

        {/* Metric 3: Modules Completed */}
        <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.student.completedModules}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {completedModulesCount}
            </span>
            <span className="text-xs text-slate-400">/ {totalModulesCount} {locale === "en" ? "modules" : "modules"}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {locale === "en" ? "CEFR structured curriculum" : "Parcours structuré CECRL"}
          </p>
        </div>

        {/* Metric 4: Days Remaining */}
        <div className={`border rounded-3xl p-5 shadow-xs space-y-3 ${
          isExpiringSoon
            ? "bg-amber-500/5 border-amber-500/30"
            : "bg-white dark:bg-[#0D1220] border-slate-200 dark:border-white/10"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.student.daysRemainingLabel}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isExpiringSoon ? "bg-amber-500/10 text-amber-500" : "bg-purple-500/10 text-purple-500"
            }`}>
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${
              isExpiringSoon ? "text-amber-500" : "text-slate-900 dark:text-white"
            }`}>
              {daysRemaining}
            </span>
            <span className="text-xs text-slate-400">{locale === "en" ? "days" : "jours"}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isExpiringSoon ? (locale === "en" ? "⚠️ Expiring soon" : "⚠️ Fin proche") : (locale === "en" ? "Active status" : "Statut actif")}
          </p>
        </div>
      </div>

      {/* 3. ACTIVE PROGRAM OVERVIEW & AI TOOLS SHORTCUTS */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 cols: Active Program Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                {t.student.currentProgram}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {program?.title || (locale === "en" ? "General Program" : "Programme Général")}
              </h3>
            </div>

            <button
              type="button"
              onClick={onOpenPrograms}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>{locale === "en" ? "View Syllabus" : "Voir le syllabus"}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {program?.description}
          </p>

          {/* Module Breakdown List */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {locale === "en" ? "Modules Overview:" : "Aperçu des modules :"}
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(program?.modules || []).map((mod, idx) => {
                const modLessons = mod.lessons || [];
                const modCompleted = modLessons.length > 0 && modLessons.every((l) =>
                  completedLessons.includes(l.id)
                );
                const modInProgress =
                  !modCompleted &&
                  modLessons.some((l) => completedLessons.includes(l.id));

                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {modCompleted ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      ) : modInProgress ? (
                        <PlayCircle size={16} className="text-cyan-500 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {t.student.module} {idx + 1} : {mod.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {modLessons.length} {locale === "en" ? "lessons" : "leçons"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        modCompleted
                          ? "bg-emerald-500/10 text-emerald-500"
                          : modInProgress
                          ? "bg-cyan-500/10 text-cyan-500"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {modCompleted ? (locale === "en" ? "Completed" : "Validé") : modInProgress ? (locale === "en" ? "In Progress" : "En cours") : (locale === "en" ? "To Unlock" : "À débloquer")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 cols: AI Practice Tools & School Announcements */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Tools Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* AI Writing card */}
            <div
              onClick={onOpenWriting}
              className="group bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 hover:from-indigo-500/10 hover:to-cyan-500/10 border border-indigo-500/20 rounded-3xl p-5 transition cursor-pointer shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-500">
                  <Sparkles size={18} />
                  <span className="font-bold text-xs">{t.student.tabs.writing.label}</span>
                </div>
                <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {locale === "en"
                  ? "Write texts and receive instant feedback, corrections, and CEFR-aligned scoring."
                  : "Rédigez des paragraphes et recevez une correction immédiate des fautes avec score CECRL."}
              </p>
            </div>

            {/* AI Tutor card */}
            <div
              onClick={onOpenChat}
              className="group bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 hover:from-cyan-500/10 hover:to-emerald-500/10 border border-cyan-500/20 rounded-3xl p-5 transition cursor-pointer shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-500">
                  <MessageCircle size={18} />
                  <span className="font-bold text-xs">{t.student.tabs.chat.label}</span>
                </div>
                <ArrowRight size={14} className="text-cyan-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {locale === "en"
                  ? "Converse in native immersion with LinguaBot and practice listening with real-time audio playback."
                  : "Dialoguez en immersion native avec LinguaBot et bénéficiez de l'écoute audio en direct."}
              </p>
            </div>
          </div>

          {/* School Announcements */}
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Bell size={14} className="text-amber-500" />
                {t.student.schoolAnnouncements}
              </h4>
              <span className="text-[10px] text-slate-400">{school.name}</span>
            </div>

            <div className="space-y-2.5">
              {relevantAnnouncements.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-4">
                  {locale === "en" ? "No new announcements" : "Aucune nouvelle annonce"}
                </div>
              ) : (
                relevantAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      ann.priority === "urgent" || ann.priority === "warning"
                        ? "bg-indigo-500/5 border border-indigo-500/20"
                        : "bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900 dark:text-white text-[11px] truncate">
                        {ann.title}
                      </p>
                      <span className="text-[9px] text-slate-400 shrink-0">
                        {new Date(ann.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
