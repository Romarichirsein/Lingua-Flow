import React from "react";
import { motion } from "motion/react";
import { Student, School, Program, Lesson, UILocale } from "../../types";
import { translations } from "../../lib/translations";
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
  onResumeCourse,
  onOpenPrograms,
  onOpenWriting,
  onOpenChat,
}) => {
  const t = translations[locale];

  // Calculate remaining days
  const today = new Date();
  const endDate = new Date(student.accessEndDate);
  const diffTime = endDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  // Active or Next Lesson
  const lastActiveLesson =
    allLessons.find((l) => l.id === student.lastActiveLessonId) ||
    allLessons.find((l) => !student.completedLessons.includes(l.id)) ||
    allLessons[0];

  // Calculate completed modules
  const completedModulesCount = program?.modules.filter((m) =>
    m.lessons.every((l) => student.completedLessons.includes(l.id))
  ).length || 0;

  const totalModulesCount = program?.modules.length || 0;

  // School announcements
  const progLangLabel = (program?.language || (school.language === "italian" ? "italian" : "german")) === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹";
  const progLangLabelEn = (program?.language || (school.language === "italian" ? "italian" : "german")) === "german" ? "German 🇩🇪" : "Italian 🇮🇹";

  const announcements = [
    {
      id: "ann-1",
      date: locale === "en" ? "Today" : "Aujourd'hui",
      title: locale === "en"
        ? `Welcome to the intensive ${progLangLabelEn} session!`
        : `Bienvenue à la session intensive ${progLangLabel} !`,
      content: locale === "en"
        ? "Remember to practice 15 minutes a day with the LinguaBot conversation tutor and writing assistant."
        : "Pensez à pratiquer 15 minutes par jour avec le tuteur conversationnel LinguaBot et l'assistant rédaction.",
      important: true,
    },
    {
      id: "ann-2",
      date: locale === "en" ? "3 days ago" : "Il y a 3 jours",
      title: locale === "en"
        ? "New interactive vocabulary cards unlocked"
        : "Nouvelles fiches de vocabulaire interactives débloquées",
      content: locale === "en"
        ? "Modules 1 and 2 now feature flashcards with native voice audio synthesis."
        : "Les modules 1 et 2 disposent désormais de cartes mémoires avec synthèse vocale native.",
      important: false,
    },
  ];

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
                <strong>{student.accessEndDate}</strong> ({daysRemaining} {locale === "en" ? "days left" : "jours restants"})
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              {student.completedLessons.length}
            </span>
            <span className="text-xs text-slate-400">/ {allLessons.length} {locale === "en" ? "lessons" : "leçons"}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {allLessons.length - student.completedLessons.length} {locale === "en" ? "lessons left" : "leçons restantes"}
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
              {program?.modules.map((mod, idx) => {
                const modCompleted = mod.lessons.every((l) =>
                  student.completedLessons.includes(l.id)
                );
                const modInProgress =
                  !modCompleted &&
                  mod.lessons.some((l) => student.completedLessons.includes(l.id));

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
                          {mod.lessons.length} {locale === "en" ? "lessons" : "leçons"}
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
                  <span className="font-bold text-xs">{t.student.tabs.writing}</span>
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
                  <span className="font-bold text-xs">{t.student.tabs.chat}</span>
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
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3 rounded-2xl text-xs space-y-1 ${
                    ann.important
                      ? "bg-indigo-500/5 border border-indigo-500/20"
                      : "bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">
                      {ann.title}
                    </p>
                    <span className="text-[9px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
