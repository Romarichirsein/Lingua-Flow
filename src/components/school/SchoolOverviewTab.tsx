import React from "react";
import { motion } from "motion/react";
import {
  School,
  Student,
  Program,
  UILocale,
  Announcement,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Award,
} from "lucide-react";
import { ProgressBar } from "../common/ProgressBar";
import { NeonButton } from "../common/NeonButton";

interface SchoolOverviewTabProps {
  locale: UILocale;
  school: School;
  students: Student[];
  programs: Program[];
  announcements?: Announcement[];
  onNavigateTab: (tab: any) => void;
  onOpenAddStudent: () => void;
  onOpenCreateProgram: () => void;
}

export const SchoolOverviewTab: React.FC<SchoolOverviewTabProps> = ({
  locale,
  school,
  students,
  programs,
  announcements = [],
  onNavigateTab,
  onOpenAddStudent,
  onOpenCreateProgram,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter school's own data strictly
  const schoolStudents = students.filter((s) => s.schoolId === school.id);
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);

  // Active / Suspended / Expired / Blocked
  const activeStudents = schoolStudents.filter((s) => s.status === "active");
  const suspendedStudents = schoolStudents.filter((s) => s.status === "suspended");
  const blockedStudents = schoolStudents.filter((s) => s.status === "blocked");
  const expiredStudents = schoolStudents.filter((s) => s.status === "expired");

  // Recent enrollments (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const recentStudents = schoolStudents.filter((s) => {
    const created = s.createdAt ? new Date(s.createdAt) : new Date(s.startDate);
    return created >= thirtyDaysAgo;
  });

  // Calculate average progress
  const avgProgress =
    schoolStudents.length > 0
      ? Math.round(
          schoolStudents.reduce((acc, curr) => acc + (curr.progressPercent || 0), 0) /
            schoolStudents.length
        )
      : 0;

  // Total Modules & Lessons across published/draft programs
  let totalModules = 0;
  let totalLessons = 0;
  schoolPrograms.forEach((p) => {
    (p.modules || []).forEach((m) => {
      totalModules++;
      totalLessons += (m.lessons || []).length;
    });
  });

  // Students nearing expiration (< 15 days)
  const expiringSoonStudents = schoolStudents.filter((s) => {
    if (s.status === "expired" || s.status === "blocked") return false;
    const end = new Date(s.endDate);
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 15;
  });

  // Inactive students (> 7 days without login or low progress)
  const inactiveStudents = schoolStudents.filter((s) => {
    if (s.status !== "active") return false;
    if (!s.lastLoginDate) return true;
    const lastLogin = new Date(s.lastLoginDate);
    const diffDays = Math.ceil((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  });

  // School license remaining days
  const schoolEndDate = new Date(school.endDate);
  const schoolDaysRemaining = Math.max(
    0,
    Math.ceil((schoolEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  // CEFR Level breakdown
  const levels = ["A1", "A2", "B1", "B2", "C1"] as const;
  const levelCounts = levels.map((lvl) => ({
    level: lvl,
    count: schoolStudents.filter((s) => s.level === lvl).length,
  }));

  // Program completion metrics
  const programsSummary = schoolPrograms.map((p) => {
    const enrolled = schoolStudents.filter((s) => s.enrolledProgramId === p.id);
    const avgProg =
      enrolled.length > 0
        ? Math.round(
            enrolled.reduce((acc, curr) => acc + (curr.progressPercent || 0), 0) / enrolled.length
          )
        : 0;
    return {
      program: p,
      enrolledCount: enrolled.length,
      avgProgress: avgProg,
    };
  });

  // Quota percentage
  const quotaPercent = Math.min(
    100,
    Math.round((schoolStudents.length / Math.max(1, school.studentQuota)) * 100)
  );

  // Filter actual school announcements for this school admin
  const relevantAnnouncements = announcements
    .filter(
      (a) =>
        a.target === "all" ||
        a.target === "schools" ||
        a.targetSchoolId === school.id
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3); // show latest 3

  return (
    <div className="space-y-6">
      {/* 1. School Access License Banner */}
      <div className="bg-gradient-to-r from-[#6D5DFC]/10 via-[#00D9FF]/10 to-transparent p-5 sm:p-6 rounded-3xl border border-[#6D5DFC]/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] flex items-center justify-center text-white shadow-md shadow-[#6D5DFC]/20 shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {isEn ? "School SaaS License" : "Licence SaaS de l'École"} • {school.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#20E3A2]/15 text-[#20E3A2] border border-[#20E3A2]/30">
                {isEn ? "Official Tenant" : "Espace Agréé"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 mt-0.5">
              {isEn
                ? `Authorized Language: ${school.language === "german" ? "German 🇩🇪" : "Italian 🇮🇹"} | Valid until ${school.endDate}`
                : `Langue autorisée : ${school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"} | Valable jusqu'au ${school.endDate}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-right">
            <span className="text-[11px] text-slate-500 dark:text-white/50 block font-medium">
              {isEn ? "Days Remaining" : "Jours restants"}
            </span>
            <span
              className={`text-lg font-black font-mono ${
                schoolDaysRemaining <= 15
                  ? "text-rose-400"
                  : schoolDaysRemaining <= 45
                  ? "text-amber-400"
                  : "text-[#20E3A2]"
              }`}
            >
              {schoolDaysRemaining} {isEn ? "days" : "jours"}
            </span>
          </div>

          <NeonButton
            variant="cyan"
            size="sm"
            onClick={onOpenAddStudent}
            icon={<Plus size={16} />}
          >
            {isEn ? "Enroll Student" : "Inscrire un élève"}
          </NeonButton>
        </div>
      </div>

      {/* 2. Critical Alert Banners (if any) & Platform Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alerts Column */}
        <div className="space-y-4">
          {expiringSoonStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
            >
              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
              <div className="flex-1 text-xs">
                <span className="font-bold text-amber-500 dark:text-amber-300 block mb-0.5">
                  {isEn
                    ? `${expiringSoonStudents.length} student(s) expiring within 15 days`
                    : `${expiringSoonStudents.length} élève(s) proche(s) de l'expiration (< 15j)`}
                </span>
                <span className="text-slate-600 dark:text-white/70">
                  {isEn
                    ? "Review expiring cohorts to propose an access renewal or final certification."
                    : "Consultez les apprenants concernés pour planifier une prolongation ou la certification."}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateTab("students")}
                  className="mt-2 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isEn ? "View expiring students" : "Gérer les fins de formation"} &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {inactiveStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/30 flex items-start gap-3"
            >
              <Clock className="text-[#6D5DFC] dark:text-[#a399ff] shrink-0 mt-0.5" size={18} />
              <div className="flex-1 text-xs">
                <span className="font-bold text-[#6D5DFC] dark:text-[#a399ff] block mb-0.5">
                  {isEn
                    ? `${inactiveStudents.length} inactive student(s) (> 7 days)`
                    : `${inactiveStudents.length} élève(s) inactif(s) (> 7 jours sans connexion)`}
                </span>
                <span className="text-slate-600 dark:text-white/70">
                  {isEn
                    ? "Send motivation reminders via WhatsApp or in-app notifications."
                    : "Envoyez une relance par WhatsApp ou notification pour relancer leur dynamique d'étude."}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateTab("pedagogy")}
                  className="mt-2 text-[11px] font-bold text-[#6D5DFC] dark:text-[#a399ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isEn ? "Go to Pedagogy & Reminders" : "Accéder au Suivi Pédagogique"} &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {expiringSoonStudents.length === 0 && inactiveStudents.length === 0 && (
            <div className="p-4 rounded-2xl bg-[#20E3A2]/10 border border-[#20E3A2]/30 flex items-center justify-center text-center h-full min-h-[100px]">
              <div className="text-xs text-[#20E3A2] flex flex-col items-center gap-2">
                <CheckCircle2 size={24} />
                <span>{isEn ? "All students are active and on track." : "Tous vos élèves sont actifs et à jour."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Announcements Column */}
        <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle size={14} className="text-indigo-500" />
              {isEn ? "Platform Announcements" : "Annonces de la plateforme"}
            </h4>
          </div>

          <div className="space-y-2.5 h-[150px] overflow-y-auto pr-2">
            {relevantAnnouncements.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-4 h-full flex items-center justify-center">
                {isEn ? "No new announcements" : "Aucune nouvelle annonce"}
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

      {/* 3. Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students & Quota */}
        <div className="bg-white dark:bg-[#0D1220] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              {isEn ? "Students Quota" : "Quota Élèves"}
            </span>
            <div className="p-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {schoolStudents.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-white/50 font-mono">
              / {school.studentQuota} max
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-white/60 mb-1">
              <span>{isEn ? "Capacity" : "Capacité utilisée"}</span>
              <span className="font-bold font-mono">{quotaPercent}%</span>
            </div>
            <ProgressBar
              progress={quotaPercent}
              color={quotaPercent >= 90 ? "amber" : "cyan"}
              size="sm"
            />
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-white dark:bg-[#0D1220] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              {isEn ? "Active Learners" : "Élèves Actifs"}
            </span>
            <div className="p-2 rounded-xl bg-[#20E3A2]/10 text-[#20E3A2] border border-[#20E3A2]/20">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#20E3A2]">
              {activeStudents.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-white/50">
              ({Math.round((activeStudents.length / Math.max(1, schoolStudents.length)) * 100)}%)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-white/50 pt-2 border-t border-slate-100 dark:border-white/5">
            <span>{isEn ? "Suspended:" : "Suspendus :"} <b className="text-slate-700 dark:text-white">{suspendedStudents.length}</b></span>
            <span>{isEn ? "Expired:" : "Expirés :"} <b className="text-slate-700 dark:text-white">{expiredStudents.length}</b></span>
          </div>
        </div>

        {/* Average Progress */}
        <div className="bg-white dark:bg-[#0D1220] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              {isEn ? "Average Progress" : "Progression Moyenne"}
            </span>
            <div className="p-2 rounded-xl bg-[#6D5DFC]/10 text-[#6D5DFC] border border-[#6D5DFC]/20">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {avgProgress}%
            </span>
            <span className="text-xs text-slate-500 dark:text-white/50">
              {isEn ? "across cohort" : "sur la cohorte"}
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar progress={avgProgress} color="violet" size="sm" />
          </div>
        </div>

        {/* Total Programs & Content */}
        <div className="bg-white dark:bg-[#0D1220] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              {isEn ? "Programs & Content" : "Programmes & Cours"}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {schoolPrograms.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-white/50">
              {isEn ? "curricula" : "filières"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-white/50 pt-2 border-t border-slate-100 dark:border-white/5">
            <span><b>{totalModules}</b> {isEn ? "modules" : "modules"}</span>
            <span><b>{totalLessons}</b> {isEn ? "lessons" : "leçons"}</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Charts & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CEFR Level Breakdown Chart */}
        <div className="bg-white dark:bg-[#0D1220] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <Layers size={18} className="text-[#00D9FF]" />
                {isEn ? "CEFR Level Distribution" : "Répartition par Niveau CECRL"}
              </h3>
              <span className="text-xs font-bold text-slate-500 dark:text-white/50">
                {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
              </span>
            </div>

            <div className="space-y-3 my-4">
              {levelCounts.map((item) => {
                const pct =
                  schoolStudents.length > 0
                    ? Math.round((item.count / schoolStudents.length) * 100)
                    : 0;
                return (
                  <div key={item.level} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-white/90">
                        <span className="px-2 py-0.5 rounded-md bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] font-bold text-[11px]">
                          {item.level}
                        </span>
                        <span>{item.count} {isEn ? "students" : "élèves"}</span>
                      </span>
                      <span className="text-slate-500 dark:text-white/50 font-mono">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-white/50">
            <span>{isEn ? "Recent signups (30d):" : "Nouveaux inscrits (30j) :"}</span>
            <span className="font-bold text-[#20E3A2]">+{recentStudents.length}</span>
          </div>
        </div>

        {/* Program Performance & Completion Chart */}
        <div className="bg-white dark:bg-[#0D1220] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <BookOpen size={18} className="text-[#6D5DFC]" />
                {isEn ? "Programs & Progression Status" : "Programmes & Suivi de Progression"}
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab("programs")}
                className="text-xs font-bold text-[#6D5DFC] dark:text-[#a399ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isEn ? "Manage All" : "Gérer les filières"} <ArrowUpRight size={14} />
              </button>
            </div>

            {programsSummary.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-white/50 text-xs">
                {isEn ? "No programs created yet." : "Aucun programme créé pour le moment."}
              </div>
            ) : (
              <div className="space-y-4 my-2">
                {programsSummary.slice(0, 4).map(({ program, enrolledCount, avgProgress: progAvg }) => (
                  <div
                    key={program.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] font-bold flex items-center justify-center text-xs shrink-0 border border-[#6D5DFC]/20">
                        {program.level}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {program.title}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              program.isPublished
                                ? "bg-[#20E3A2]/10 text-[#20E3A2]"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {program.isPublished ? (isEn ? "Published" : "Publié") : (isEn ? "Draft" : "Brouillon")}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-white/50">
                          {enrolledCount} {isEn ? "students enrolled" : "élèves inscrits"} • {(program.modules || []).length} {isEn ? "modules" : "modules"}
                        </span>
                      </div>
                    </div>

                    <div className="sm:w-44 flex flex-col items-end gap-1">
                      <div className="flex justify-between w-full text-[11px] text-slate-500 dark:text-white/60">
                        <span>{isEn ? "Completion" : "Complétion"}</span>
                        <span className="font-bold font-mono text-slate-700 dark:text-white">{progAvg}%</span>
                      </div>
                      <ProgressBar progress={progAvg} color="cyan" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-white/50">
              {isEn ? "Total course syllabus:" : "Syllabus pédagogique :"} <b>{schoolPrograms.length} {isEn ? "programs" : "programmes"}</b>
            </span>
            <button
              type="button"
              onClick={onOpenCreateProgram}
              className="text-xs font-bold text-[#00D9FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              + {isEn ? "New Curriculum" : "Nouveau Programme"}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Quick Actions & Direct Support Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add Student Quick CTA */}
        <div
          onClick={onOpenAddStudent}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#6D5DFC]/15 to-[#6D5DFC]/5 border border-[#6D5DFC]/30 hover:border-[#6D5DFC]/60 transition-all cursor-pointer group shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#6D5DFC] text-white flex items-center justify-center shadow-md shadow-[#6D5DFC]/30 group-hover:scale-105 transition-transform">
            <Plus size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEn ? "Enroll New Student" : "Inscrire un Nouvel Élève"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
              {isEn ? "Assign level, curriculum & access period" : "Attribuer niveau, programme & période"}
            </p>
          </div>
        </div>

        {/* Evaluations & Quiz Hub CTA */}
        <div
          onClick={() => onNavigateTab("evaluations")}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#00D9FF]/15 to-[#00D9FF]/5 border border-[#00D9FF]/30 hover:border-[#00D9FF]/60 transition-all cursor-pointer group shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00D9FF] text-slate-900 flex items-center justify-center shadow-md shadow-[#00D9FF]/30 group-hover:scale-105 transition-transform">
            <HelpCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEn ? "Quizzes & AI Essays" : "Quiz & Rédactions IA"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
              {isEn ? "Inspect tests & AI corrections" : "Consulter les tests et devoirs corrigés"}
            </p>
          </div>
        </div>

        {/* WhatsApp School Community CTA */}
        <div
          onClick={() => onNavigateTab("settings")}
          className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer group shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <MessageCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEn ? "WhatsApp Promo Community" : "Groupe WhatsApp Promotion"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
              {isEn ? "Configure fast link for students" : "Gérer le lien d'entraide des élèves"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
