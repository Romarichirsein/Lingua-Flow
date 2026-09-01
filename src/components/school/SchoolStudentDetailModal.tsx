import React, { useState } from "react";
import {
  Student,
  School,
  Program,
  UILocale,
  AIWritingSubmission,
} from "../../types";
import { Modal } from "../common/Modal";
import { ProgressBar } from "../common/ProgressBar";
import { NeonButton } from "../common/NeonButton";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  ShieldAlert,
  GraduationCap,
  Layers,
  ChevronRight,
} from "lucide-react";

interface SchoolStudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: UILocale;
  student: Student | null;
  school: School;
  programs: Program[];
  submissions?: AIWritingSubmission[];
  onToggleStatus: (student: Student, newStatus: "active" | "suspended" | "blocked") => void;
  onExtendAccess: (student: Student, months: number) => void;
  onResetProgress?: (student: Student) => void;
  onSelectStudentTab?: (studentId: string) => void;
}

export const SchoolStudentDetailModal: React.FC<SchoolStudentDetailModalProps> = ({
  isOpen,
  onClose,
  locale,
  student,
  school,
  programs,
  submissions = [],
  onToggleStatus,
  onExtendAccess,
  onResetProgress,
  onSelectStudentTab,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "quizzes" | "ai_writing">("overview");
  const [extendMonths, setExtendMonths] = useState<number>(3);
  const isEn = locale === "en";

  if (!student) return null;

  const enrolledProgram = programs.find((p) => p.id === student.enrolledProgramId) || programs.find(p => p.schoolId === school.id);
  const studentSubmissions = submissions.filter((sub) => sub.studentId === student.id);

  // Calculate days remaining
  const now = new Date();
  const endDate = new Date(student.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0 || student.status === "expired";

  const completedCount = (student.completedLessons || []).length;
  let totalLessonsInProgram = 0;
  if (enrolledProgram) {
    (enrolledProgram.modules || []).forEach((m) => {
      totalLessonsInProgram += (m.lessons || []).length;
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEn ? "Student Dossier" : "Fiche Pédagogique Élève"} • ${student.name}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Student Identity Header */}
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] flex items-center justify-center text-white text-xl font-black shadow-md shadow-[#6D5DFC]/20 shrink-0">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                student.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {student.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30">
                  Niveau {student.level}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.status === "active"
                      ? "bg-[#20E3A2]/10 text-[#20E3A2] border border-[#20E3A2]/30"
                      : student.status === "suspended"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      : student.status === "blocked"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                  }`}
                >
                  {student.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-white/60 mt-1">
                <span className="flex items-center gap-1">
                  <Mail size={13} /> {student.email}
                </span>
                {student.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} /> {student.phone}
                  </span>
                )}
                <span className="font-semibold text-slate-700 dark:text-white/80">
                  {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-center">
            {onSelectStudentTab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectStudentTab(student.id);
                }}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                title="Tester l'interface en tant qu'élève"
              >
                <ExternalLink size={14} />
                <span>{isEn ? "Student Portal View" : "Aperçu Espace Élève"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation in Modal */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#6D5DFC] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            {isEn ? "Overview & Progress" : "Vue d'ensemble & Progression"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "curriculum"
                ? "bg-[#6D5DFC] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            {isEn ? "Course Breakdown" : "Détail des Modules & Leçons"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai_writing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "ai_writing"
                ? "bg-[#6D5DFC] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Sparkles size={13} className="text-[#00D9FF]" />
            <span>{isEn ? "AI Homework Corrections" : "Devoirs & Rédactions IA"}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#00D9FF]/20 text-[#00D9FF] font-mono">
              {studentSubmissions.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Progress & Days Remaining Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider">
                    {isEn ? "Course Progress" : "Progression Globale"}
                  </span>
                  <Award size={16} className="text-[#00D9FF]" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {student.progressPercent}%
                </div>
                <ProgressBar progress={student.progressPercent} color="cyan" size="sm" />
                <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-2">
                  {completedCount} / {totalLessonsInProgram} {isEn ? "lessons validated" : "leçons validées"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider">
                    {isEn ? "Access Expiration" : "Période d'Accès"}
                  </span>
                  <Clock size={16} className="text-amber-400" />
                </div>
                <div
                  className={`text-2xl font-black font-mono ${
                    daysRemaining <= 10
                      ? "text-rose-400"
                      : daysRemaining <= 30
                      ? "text-amber-400"
                      : "text-[#20E3A2]"
                  }`}
                >
                  {isExpired ? (isEn ? "Expired" : "Expiré") : `${daysRemaining} ${isEn ? "days" : "jours"}`}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-white/50 block mt-2">
                  {student.startDate} &rarr; {student.endDate}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider">
                    {isEn ? "Assigned Program" : "Programme Affecté"}
                  </span>
                  <GraduationCap size={16} className="text-[#6D5DFC]" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {enrolledProgram ? enrolledProgram.title : (isEn ? "None" : "Aucun")}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-2">
                  {enrolledProgram ? `${(enrolledProgram.modules || []).length} modules` : "—"}
                </span>
              </div>
            </div>

            {/* Quick Extension & Status Actions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-white/60">
                {isEn ? "Access Management & Extensions" : "Gestion de la Période de Formation"}
              </h4>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <select
                    value={extendMonths}
                    onChange={(e) => setExtendMonths(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white"
                  >
                    <option value={1}>+ 1 {isEn ? "month" : "mois"}</option>
                    <option value={3}>+ 3 {isEn ? "months" : "mois"}</option>
                    <option value={6}>+ 6 {isEn ? "months" : "mois"}</option>
                    <option value={12}>+ 12 {isEn ? "months" : "mois"}</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onExtendAccess(student, extendMonths)}
                    className="px-3.5 py-2 rounded-xl bg-[#20E3A2]/15 hover:bg-[#20E3A2]/25 text-[#20E3A2] border border-[#20E3A2]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                  >
                    <Calendar size={14} />
                    <span>{isEn ? "Prolong Training" : "Prolonger l'accès"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {student.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(student, "suspended")}
                      className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer min-h-[38px]"
                    >
                      {isEn ? "Suspend Access" : "Suspendre"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(student, "active")}
                      className="px-3 py-2 rounded-xl bg-[#20E3A2]/15 hover:bg-[#20E3A2]/25 text-[#20E3A2] border border-[#20E3A2]/30 text-xs font-bold transition cursor-pointer min-h-[38px]"
                    >
                      {isEn ? "Reactivate Student" : "Réactiver"}
                    </button>
                  )}

                  {student.status !== "blocked" && (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(student, "blocked")}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition cursor-pointer min-h-[38px]"
                    >
                      {isEn ? "Block" : "Bloquer"}
                    </button>
                  )}

                  {onResetProgress && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm ? window.confirm(isEn ? "Reset all progress for this student?" : "Réinitialiser toute la progression de cet élève ?") : true) {
                          onResetProgress(student);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[38px]"
                      title="Remettre la progression à zéro"
                    >
                      <RefreshCw size={13} />
                      <span>{isEn ? "Reset Progress" : "Remise à zéro"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum & Lessons Breakdown */}
        {activeTab === "curriculum" && (
          <div className="space-y-4">
            {!enrolledProgram ? (
              <div className="py-8 text-center text-slate-500 dark:text-white/50 text-xs">
                {isEn ? "No program assigned to this student." : "Aucun programme affecté à cet élève."}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/60 mb-1">
                  <span>Programme : <b className="text-slate-800 dark:text-white">{enrolledProgram.title}</b></span>
                  <span>{enrolledProgram.level} • {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}</span>
                </div>

                {(enrolledProgram.modules || []).map((module, mIdx) => {
                  const moduleLessons = module.lessons || [];
                  const moduleCompletedLessons = moduleLessons.filter((l) =>
                    (student.completedLessons || []).includes(l.id)
                  );
                  const modulePct =
                    moduleLessons.length > 0
                      ? Math.round((moduleCompletedLessons.length / moduleLessons.length) * 100)
                      : 0;

                  return (
                    <div
                      key={module.id}
                      className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] font-bold text-xs flex items-center justify-center font-mono">
                            {mIdx + 1}
                          </span>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {module.title}
                          </h5>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-white/80">
                          {modulePct}%
                        </span>
                      </div>

                      <ProgressBar progress={modulePct} color={modulePct === 100 ? "green" : "cyan"} size="sm" />

                      {/* Lesson list inside module */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {moduleLessons.map((lesson) => {
                          const isDone = (student.completedLessons || []).includes(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                                isDone
                                  ? "bg-[#20E3A2]/5 border-[#20E3A2]/20 text-slate-800 dark:text-white"
                                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-[#20E3A2] shrink-0" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20 shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 dark:text-white/40 shrink-0 ml-2">
                                {lesson.durationMinutes} min
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: AI Homework & Written Submissions */}
        {activeTab === "ai_writing" && (
          <div className="space-y-4">
            {studentSubmissions.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-white/50 text-xs bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                <Sparkles size={24} className="mx-auto mb-2 text-[#00D9FF] opacity-60" />
                <p className="font-bold text-slate-700 dark:text-white/80">
                  {isEn ? "No AI writing submissions yet." : "Aucune rédaction soumise pour le moment."}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-white/40 mt-1">
                  {isEn
                    ? "When the student submits essays in the AI Assistant, Gemini corrections and scores will appear here."
                    : "Dès que l'élève soumettra des compositions dans l'assistant IA, les analyses Gemini s'afficheront ici."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {sub.topic}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
                            {sub.level}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-white/40">
                          {sub.submissionDate}
                        </span>
                      </div>

                      {sub.result?.score && (
                        <div className="flex items-center gap-1.5 bg-[#20E3A2]/10 text-[#20E3A2] px-2.5 py-1 rounded-xl text-xs font-bold font-mono">
                          <span>{sub.result.score.grammar}/100</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 text-xs font-mono text-slate-700 dark:text-white/80 leading-relaxed border border-slate-200 dark:border-white/5">
                      {sub.studentText}
                    </div>

                    {sub.result?.correctedVersion && (
                      <div className="p-3 rounded-xl bg-emerald-500/5 text-xs text-slate-800 dark:text-white/90 border border-emerald-500/20">
                        <span className="font-bold text-emerald-500 block mb-1">
                          {isEn ? "AI Corrected Version:" : "Version corrigée optimale par l'IA :"}
                        </span>
                        {sub.result.correctedVersion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-white/50">
            ID Élève : <span className="font-mono">{student.id}</span>
          </span>
          <NeonButton variant="ghost" size="sm" onClick={onClose}>
            {isEn ? "Close Dossier" : "Fermer"}
          </NeonButton>
        </div>
      </div>
    </Modal>
  );
};
