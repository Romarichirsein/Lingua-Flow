import React from "react";
import { Student, School, Program, Lesson, UILocale } from "../../types";
import { translations } from "../../lib/translations";
import { ProgressBar } from "../common/ProgressBar";
import { NeonButton } from "../common/NeonButton";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Calendar,
  Clock,
  Layers,
  Award,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface StudentProgramsTabProps {
  student: Student;
  school: School;
  programs: Program[];
  locale: UILocale;
  onSelectProgram: (programId: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

export const StudentProgramsTab: React.FC<StudentProgramsTabProps> = ({
  student,
  school,
  programs,
  locale,
  onSelectProgram,
  onOpenLesson,
}) => {
  const t = translations[locale];

  // Programs belonging to this school
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);
  const displayPrograms = schoolPrograms.length > 0 ? schoolPrograms : programs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={22} className="text-indigo-500" />
            {t.student.myPrograms}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.student.allAssignedPrograms} ({school.language === "german" ? t.common.german : t.common.italian})
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 self-start sm:self-auto">
          {displayPrograms.length} {locale === "en" ? `program${displayPrograms.length > 1 ? "s" : ""} available` : `programme${displayPrograms.length > 1 ? "s" : ""} disponible${displayPrograms.length > 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Program Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {displayPrograms.map((prog) => {
          const isCurrent =
            prog.id === student.enrolledProgramId ||
            (displayPrograms.length === 1 && !student.enrolledProgramId);

          const studentCompleted = student.completedLessons || [];
          const progLessons: Lesson[] = (prog.modules || []).flatMap((m) => m.lessons || []);
          const completedCount = progLessons.filter((l) =>
            studentCompleted.includes(l.id)
          ).length;

          const progProgress =
            progLessons.length > 0
              ? Math.round((completedCount / progLessons.length) * 100)
              : 0;

          const firstLessonId = progLessons[0]?.id;

          return (
            <div
              key={prog.id}
              className={`relative overflow-hidden rounded-3xl border transition shadow-sm flex flex-col justify-between ${
                isCurrent
                  ? "bg-white dark:bg-[#0D1220] border-indigo-500/40 ring-1 ring-indigo-500/30"
                  : "bg-white/80 dark:bg-[#0D1220]/80 border-slate-200 dark:border-white/10"
              }`}
            >
              {/* Card Header with Level Badge */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {t.student.levelBadge} {prog.level || student.level}
                    </span>
                    <span className="text-xs text-slate-400">
                      {school.language === "german" ? t.common.german : t.common.italian}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      {locale === "en" ? "In Progress" : "En cours"}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>{locale === "en" ? "Progress" : "Progression"}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {progProgress}% ({completedCount}/{progLessons.length} {locale === "en" ? "lessons" : "leçons"})
                    </span>
                  </div>
                  <ProgressBar value={progProgress} color="cyan" height="sm" />
                </div>

                {/* Module breakdown pills */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    {(prog.modules || []).length} {locale === "en" ? "thematic modules:" : "modules thématiques :"}
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {(prog.modules || []).map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-slate-50 dark:bg-white/[0.02]"
                      >
                        <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                          {idx + 1}. {m.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {(m.lessons || []).length} {locale === "en" ? "lessons" : "leçons"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    onSelectProgram(prog.id);
                    if (firstLessonId) onOpenLesson(firstLessonId);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <PlayCircle size={16} />
                  <span>{isCurrent ? t.student.resumeProgram : t.student.openProgram}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
