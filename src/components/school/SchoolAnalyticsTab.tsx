import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Program,
  School,
  Student,
  UILocale,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Download,
  Send,
  Sparkles,
  BarChart3,
  Filter,
} from "lucide-react";
import { ProgressBar } from "../common/ProgressBar";
import { NeonButton } from "../common/NeonButton";

interface SchoolAnalyticsTabProps {
  locale: UILocale;
  school: School;
  programs: Program[];
  students: Student[];
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
  onOpenStudentDetail?: (student: Student) => void;
}

export const SchoolAnalyticsTab: React.FC<SchoolAnalyticsTabProps> = ({
  locale,
  school,
  programs,
  students,
  onAddLog,
  onOpenStudentDetail,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter school students & programs
  const schoolStudents = students.filter((s) => s.schoolId === school.id);
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);

  // Filters
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>("all");

  const filteredStudents = schoolStudents.filter((s) =>
    selectedProgramFilter === "all" ? true : s.enrolledProgramId === selectedProgramFilter
  );

  // Calculations
  const totalStudents = filteredStudents.length;
  const avgProgress = totalStudents > 0
    ? Math.round(
        filteredStudents.reduce((acc, s) => acc + (s.progressPercent || 0), 0) /
          totalStudents
      )
    : 0;

  const atRiskStudents = filteredStudents.filter(
    (s) => (s.progressPercent || 0) < 25 && s.status === "active"
  );
  const highPerformers = filteredStudents.filter(
    (s) => (s.progressPercent || 0) >= 80
  );

  // Export Analytics CSV
  const handleExportAnalyticsCSV = () => {
    const headers = ["ID", "Nom", "Email", "Progression (%)", "Statut", "Dernière Connexion"];
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      s.email,
      s.progressPercent || 0,
      s.status,
      s.lastLoginAt || s.lastLoginDate || "Jamais",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `suivi_pedagogique_${school.slug}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddLog(
      "Export du rapport pédagogique",
      `Rapport de performance de ${schoolStudents.length} élèves exporté en CSV.`,
      "success"
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Pedagogical Analytics & Tracking" : "Suivi Pédagogique & Analytique"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
            {isEn
              ? "Real-time metrics on student engagement, syllabus completion rates and dropout prevention."
              : "Suivez la progression en temps réel de vos cohortes, les taux de complétion et prévenez le décrochage."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Program filter */}
          <select
            value={selectedProgramFilter}
            onChange={(e) => setSelectedProgramFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="all">{isEn ? "All Programs" : "Tous les Programmes"}</option>
            {schoolPrograms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.level})
              </option>
            ))}
          </select>

          <NeonButton
            variant="cyan"
            size="sm"
            onClick={handleExportAnalyticsCSV}
            icon={<Download size={14} />}
          >
            {isEn ? "Export CSV" : "Exporter CSV"}
          </NeonButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Average Progress" : "Progression Moyenne"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {avgProgress}%
          </div>
          <ProgressBar progress={avgProgress} color="cyan" height="sm" />
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Total Enrolled" : "Effectif Total"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#6D5DFC]/10 text-[#6D5DFC] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {totalStudents}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-white/40">
            {isEn ? "Active licenses in cohort" : "Licences actives dans la cohorte"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "At-Risk (<25%)" : "À Risque de Décrochage"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-500 dark:text-rose-400 font-mono">
            {atRiskStudents.length}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-white/40">
            {isEn ? "Need teacher intervention" : "Nécessitent une relance"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Near Completion (≥80%)" : "Prêts pour Certification"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#20E3A2]/10 text-[#20E3A2] flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#20E3A2] font-mono">
            {highPerformers.length}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-white/40">
            {isEn ? "Eligible for final exam" : "Éligibles à l'examen final"}
          </p>
        </div>
      </div>

      {/* Cohort Progress Breakdown & At-Risk Alert Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Students Action List */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              <span>{isEn ? "Alert: Students needing follow-up" : "Élèves nécessitant un suivi"}</span>
            </h3>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
              {atRiskStudents.length} {isEn ? "learners" : "apprenants"}
            </span>
          </div>

          {atRiskStudents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-[#20E3A2]" />
              <p className="font-bold text-slate-700 dark:text-white/80">
                {isEn ? "Excellent! No student is lagging behind." : "Excellent ! Aucun élève n'est en situation de décrochage."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {atRiskStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {student.name}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-white/40">
                      {student.email} • {isEn ? "Progression:" : "Progression :"} <b className="text-rose-400">{student.progressPercent || 0}%</b>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(student.whatsappNumber || student.phone) && (
                      <a
                        href={`https://wa.me/${(student.whatsappNumber || student.phone || "").replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(student.name)},%20votre%20école%20${encodeURIComponent(school.name)}%20vous%20invite%20à%20poursuivre%20votre%20programme.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <Send size={12} />
                        <span>Relance WA</span>
                      </a>
                    )}
                    {onOpenStudentDetail && (
                      <button
                        type="button"
                        onClick={() => onOpenStudentDetail(student)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] text-[11px] font-bold transition cursor-pointer"
                      >
                        Dossier
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level Distribution & Certification Readiness */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-[#00D9FF]" />
            <span>{isEn ? "Programs Engagement Overview" : "Répartition Pédagogique par Programme"}</span>
          </h3>

          <div className="space-y-3">
            {schoolPrograms.map((prog) => {
              const count = schoolStudents.filter((s) => s.enrolledProgramId === prog.id).length;
              const progStudents = schoolStudents.filter((s) => s.enrolledProgramId === prog.id);
              const pAvg = progStudents.length > 0
                ? Math.round(
                    progStudents.reduce((a, b) => a + (b.progressPercent || 0), 0) /
                      progStudents.length
                  )
                : 0;

              return (
                <div
                  key={prog.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {prog.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] font-mono text-[10px] font-bold">
                        {prog.level}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500 dark:text-white/60">
                      {count} élèves ({pAvg}% moy.)
                    </span>
                  </div>
                  <ProgressBar progress={pAvg} color="violet" height="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
