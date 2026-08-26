import React, { useState } from "react";
import { School, Student, Program, ActivityLog, UILocale } from "../../types";
import { ProgressBar } from "../common/ProgressBar";
import {
  TrendingUp,
  Download,
  Calendar,
  Building2,
  Users,
  GraduationCap,
  Award,
  BarChart3,
  PieChart,
  FileSpreadsheet,
} from "lucide-react";

interface SuperAdminReportsTabProps {
  schools: School[];
  students: Student[];
  programs: Program[];
  logs: ActivityLog[];
  locale: UILocale;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminReportsTab: React.FC<SuperAdminReportsTabProps> = ({
  schools,
  students,
  programs,
  logs,
  locale,
  onAddLog,
}) => {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "90d" | "ytd">("30d");

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const averageProgress =
    totalStudents > 0
      ? Math.round(students.reduce((acc, s) => acc + s.progressPercent, 0) / totalStudents)
      : 0;

  const germanSchools = schools.filter((s) => s.language === "german");
  const italianSchools = schools.filter((s) => s.language === "italian");

  const germanStudents = students.filter((st) =>
    germanSchools.some((gs) => gs.id === st.schoolId)
  ).length;
  const italianStudents = students.filter((st) =>
    italianSchools.some((is) => is.id === st.schoolId)
  ).length;

  // School performance ranking
  const schoolRankings = schools
    .map((school) => {
      const schoolStudents = students.filter((s) => s.schoolId === school.id);
      const avgProg =
        schoolStudents.length > 0
          ? Math.round(
              schoolStudents.reduce((acc, s) => acc + s.progressPercent, 0) /
                schoolStudents.length
            )
          : 0;
      return {
        school,
        studentsCount: schoolStudents.length,
        avgProgress: avgProg,
        quotaPct: Math.min(
          100,
          Math.round((schoolStudents.length / Math.max(1, school.studentQuota)) * 100)
        ),
      };
    })
    .sort((a, b) => b.avgProgress - a.avgProgress);

  const handleExportAnalyticsReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      periodSelected: period,
      totals: {
        schoolsCount: schools.length,
        studentsCount: students.length,
        programsCount: programs.length,
        averageProgressPercent: averageProgress,
        germanLearners: germanStudents,
        italianLearners: italianStudents,
      },
      schoolsBreakdown: schoolRankings.map((r) => ({
        schoolName: r.school.name,
        language: r.school.language,
        enrolledStudents: r.studentsCount,
        studentQuota: r.school.studentQuota,
        averageProgress: `${r.avgProgress}%`,
        status: r.school.status,
      })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `linguaflow_rapport_analytique_${period}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onAddLog("Export Données", `Génération du rapport analytique de performance (${period}).`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar with Period Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            Analyses & Statistiques de Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-white/50">
            Rapports de fréquentation, taux de complétion et croissance multi-écoles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector buttons */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            {[
              { id: "today", label: "Aujourd'hui" },
              { id: "7d", label: "7 jours" },
              { id: "30d", label: "30 jours" },
              { id: "90d", label: "90 jours" },
              { id: "ytd", label: "Année" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[34px] ${
                  period === p.id
                    ? "bg-[#6D5DFC] text-white shadow-xs"
                    : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportAnalyticsReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00D9FF]/15 hover:bg-[#00D9FF]/25 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-bold transition min-h-[40px] cursor-pointer"
          >
            <Download size={14} />
            <span>Export Rapport JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Progression Moyenne</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{averageProgress}%</p>
          <div className="pt-2">
            <ProgressBar value={averageProgress} color="cyan" height="sm" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Taux d'Élèves Actifs</span>
          <p className="text-2xl font-black text-[#20E3A2]">
            {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%
          </p>
          <p className="text-[11px] text-slate-400">
            {activeStudents} sur {totalStudents} apprenants
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Filière Allemande 🇩🇪</span>
          <p className="text-2xl font-black text-[#6D5DFC]">{germanStudents}</p>
          <p className="text-[11px] text-slate-400">
            {germanSchools.length} centres partenaires
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Filière Italienne 🇮🇹</span>
          <p className="text-2xl font-black text-[#00D9FF]">{italianStudents}</p>
          <p className="text-[11px] text-slate-400">
            {italianSchools.length} centres partenaires
          </p>
        </div>
      </div>

      {/* School Performance Ranking Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Classement de Performance des Écoles
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Trié par taux de complétion pédagogique et assiduité
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 font-bold text-[10px] uppercase">
                <th className="py-3 px-3">Rang</th>
                <th className="py-3 px-3">École</th>
                <th className="py-3 px-3">Langue</th>
                <th className="py-3 px-3">Élèves / Quota</th>
                <th className="py-3 px-3">Progrès Moyen</th>
                <th className="py-3 px-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {schoolRankings.map((rank, idx) => (
                <tr key={rank.school.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {rank.school.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC]">
                      {rank.school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-white">
                    {rank.studentsCount} / {rank.school.studentQuota} ({rank.quotaPct}%)
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#00D9FF]">{rank.avgProgress}%</span>
                      <div className="w-20">
                        <ProgressBar value={rank.avgProgress} color="cyan" height="sm" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rank.school.status === "active"
                          ? "bg-[#20E3A2]/10 text-[#20E3A2]"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {rank.school.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
