import React from "react";
import { School, Student, Program, ActivityLog, Announcement, UILocale } from "../../types";
import { ProgressBar } from "../common/ProgressBar";
import {
  Building2,
  Users,
  GraduationCap,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Megaphone,
  MessageCircle,
  Plus,
  Sparkles,
  Activity,
} from "lucide-react";

interface SuperAdminOverviewTabProps {
  schools: School[];
  students: Student[];
  programs: Program[];
  logs: ActivityLog[];
  announcements: Announcement[];
  locale: UILocale;
  onNavigateToTab: (tab: any) => void;
  onOpenCreateSchool: () => void;
  onOpenDiagnostic?: () => void;
}

export const SuperAdminOverviewTab: React.FC<SuperAdminOverviewTabProps> = ({
  schools,
  students,
  programs,
  logs,
  announcements,
  locale,
  onNavigateToTab,
  onOpenCreateSchool,
  onOpenDiagnostic,
}) => {
  const isEn = locale === "en";

  // Statistics calculations
  const activeSchools = schools.filter((s) => s.status === "active").length;
  const suspendedSchools = schools.filter((s) => s.status === "suspended" || s.status === "blocked").length;
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;

  const germanSchools = schools.filter((s) => s.language === "german");
  const italianSchools = schools.filter((s) => s.language === "italian");

  const germanSchoolIds = new Set(germanSchools.map((s) => s.id));
  const italianSchoolIds = new Set(italianSchools.map((s) => s.id));

  const germanStudents = students.filter((st) => germanSchoolIds.has(st.schoolId)).length;
  const italianStudents = students.filter((st) => italianSchoolIds.has(st.schoolId)).length;

  const publishedPrograms = programs.filter((p) => p.isPublished).length;

  // Expiring schools within 30 days
  const now = new Date();
  const expiringSchools = schools.filter((s) => {
    const end = new Date(s.endDate);
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  // Total Quota capacity
  const totalQuota = schools.reduce((acc, s) => acc + (s.studentQuota || 0), 0);
  const quotaUtilizationPct = Math.min(100, Math.round((totalStudents / Math.max(1, totalQuota)) * 100));

  return (
    <div className="space-y-6">
      {/* Top 8 Key Metrics Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Schools */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50">{isEn ? "Partner Schools" : "Écoles Partenaires"}</span>
            <div className="w-9 h-9 rounded-2xl bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {schools.length}
            </span>
            <span className="text-xs font-bold text-[#20E3A2]">{activeSchools} {isEn ? "active" : "actives"}</span>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={Math.round((activeSchools / Math.max(1, schools.length)) * 100)}
              color="primary"
              height="sm"
            />
          </div>
        </div>

        {/* Metric 2: Total Students */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50">{isEn ? "Total Students" : "Élèves Globaux"}</span>
            <div className="w-9 h-9 rounded-2xl bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalStudents}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {totalQuota} {isEn ? "seats" : "places"}</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={quotaUtilizationPct} color="cyan" height="sm" />
          </div>
        </div>

        {/* Metric 3: German vs Italian Learners */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50">{isEn ? "Language Split" : "Répartition Langues"}</span>
            <div className="flex items-center gap-1 text-base">
              <span>🇩🇪</span>
              <span>🇮🇹</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between text-xs font-bold">
            <span className="text-slate-900 dark:text-white font-mono">
              🇩🇪 {germanStudents} {isEn ? "German" : "Allemand"}
            </span>
            <span className="text-slate-900 dark:text-white font-mono">
              🇮🇹 {italianStudents} {isEn ? "Italian" : "Italien"}
            </span>
          </div>
          <div className="mt-3 flex h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10">
            <div
              style={{
                width: `${Math.round((germanStudents / Math.max(1, totalStudents)) * 100)}%`,
              }}
              className="bg-[#6D5DFC]"
            />
            <div
              style={{
                width: `${Math.round((italianStudents / Math.max(1, totalStudents)) * 100)}%`,
              }}
              className="bg-[#00D9FF]"
            />
          </div>
        </div>

        {/* Metric 4: Expiring Licenses */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50">{isEn ? "Expiration Alerts" : "Alertes Échéances"}</span>
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                expiringSchools.length > 0
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-[#20E3A2]/10 text-[#20E3A2]"
              }`}
            >
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                expiringSchools.length > 0 ? "text-amber-500" : "text-slate-900 dark:text-white"
              }`}
            >
              {expiringSchools.length}
            </span>
            <span className="text-xs font-bold text-slate-400">{isEn ? "schools < 30d" : "écoles < 30j"}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-white/40 mt-3 truncate">
            {expiringSchools.length > 0
              ? `${expiringSchools.map((s) => s.name).join(", ")}`
              : (isEn ? "All licenses are up to date" : "Toutes les licences sont à jour")}
          </p>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Schools & Language Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Partner Schools List Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isEn ? "Recent Partner Schools" : "Écoles Partenaires Récentes"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  {isEn ? "Latest language centers onboarded on LinguaFlow" : "Derniers centres déployés sur LinguaFlow"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab("schools")}
                className="flex items-center gap-1 text-xs font-bold text-[#00D9FF] hover:underline cursor-pointer"
              >
                <span>{isEn ? `View all (${schools.length})` : `Voir toutes (${schools.length})`}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="space-y-2.5">
              {schools.slice(0, 4).map((school) => {
                const enrolled = students.filter((s) => s.schoolId === school.id).length;
                const quotaPct = Math.min(
                  100,
                  Math.round((enrolled / Math.max(1, school.studentQuota)) * 100)
                );

                return (
                  <div
                    key={school.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 text-xs hover:border-[#6D5DFC]/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
                        {school.logo || (school.language === "german" ? "🇩🇪" : "🇮🇹")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {school.name}
                          </h4>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
                            {school.language === "german" ? (isEn ? "German" : "Allemand") : (isEn ? "Italian" : "Italien")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {isEn ? "Director:" : "Directeur :"} {school.managerName} • /{school.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-white">
                          {enrolled} / {school.studentQuota} {isEn ? "students" : "élèves"}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {isEn ? "Expiry:" : "Échéance :"} {school.endDate}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          school.status === "active"
                            ? "bg-[#20E3A2]/15 text-[#20E3A2]"
                            : "bg-amber-500/15 text-amber-500"
                        }`}
                      >
                        {school.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onOpenCreateSchool}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] text-xs font-bold transition min-h-[40px] cursor-pointer"
              >
                <Plus size={16} />
                <span>{isEn ? "Create New School Tenant" : "Créer une nouvelle école"}</span>
              </button>

              {onOpenDiagnostic && (
                <button
                  type="button"
                  onClick={onOpenDiagnostic}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D5DFC]/10 to-[#00D9FF]/10 hover:from-[#6D5DFC]/20 hover:to-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold border border-[#00D9FF]/30 transition min-h-[40px] cursor-pointer shadow-sm"
                >
                  <Activity size={15} className="animate-pulse text-[#00D9FF]" />
                  <span>{isEn ? "Run State Diagnostic" : "Lancer Diagnostic Flux"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Matrix & Multi-tenant Shortcuts */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isEn ? "Super Admin Quick Actions" : "Actions Rapides Super Admin"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => onNavigateToTab("students")}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition cursor-pointer space-y-1.5"
              >
                <Users size={18} className="text-[#00D9FF]" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">{isEn ? "Student Roster" : "Annuaire Élèves"}</p>
                <p className="text-[10px] text-slate-400">{isEn ? "All learners" : "Tous les apprenants"}</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab("announcements")}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition cursor-pointer space-y-1.5"
              >
                <Megaphone size={18} className="text-amber-400" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">{isEn ? "Broadcast News" : "Diffuser Annonce"}</p>
                <p className="text-[10px] text-slate-400">{isEn ? "Global banner" : "Message global"}</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab("whatsapp")}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition cursor-pointer space-y-1.5"
              >
                <MessageCircle size={18} className="text-[#20E3A2]" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">{isEn ? "WhatsApp Hub" : "WhatsApp Hub"}</p>
                <p className="text-[10px] text-slate-400">{isEn ? "Direct support" : "Support direct"}</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab("reports")}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left transition cursor-pointer space-y-1.5"
              >
                <TrendingUp size={18} className="text-[#6D5DFC]" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">{isEn ? "Reports & KPIs" : "Rapports & KPIs"}</p>
                <p className="text-[10px] text-slate-400">{isEn ? "Exports & stats" : "Exports et stats"}</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Live Activity Stream & System Alerts */}
        <div className="space-y-6">
          {/* Active System Announcements Alert Box */}
          {announcements.length > 0 && (
            <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Megaphone size={16} />
                <span>{isEn ? "Active Broadcast Announcement" : "Annonce Active en Diffusion"}</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {announcements[0].title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-white/70 line-clamp-2">
                {announcements[0].content}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                <span>{isEn ? "Target:" : "Cible :"} {announcements[0].target}</span>
                <button
                  type="button"
                  onClick={() => onNavigateToTab("announcements")}
                  className="font-bold underline cursor-pointer"
                >
                  {isEn ? "Manage" : "Gérer"}
                </button>
              </div>
            </div>
          )}

          {/* Live Activity Stream Feed */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isEn ? "Live Activity Audit Log" : "Journal d'Activité en Direct"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  {isEn ? "Traceability of recent platform actions" : "Traçabilité des actions récentes"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab("security-logs")}
                className="text-xs font-bold text-[#00D9FF] hover:underline cursor-pointer"
              >
                {isEn ? "All logs" : "Tous les logs"}
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {logs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                        log.status === "success"
                          ? "bg-[#20E3A2]/10 text-[#20E3A2]"
                          : log.status === "warning"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-white/60 line-clamp-2">
                    {log.details}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-white/5">
                    <span>{log.actorName}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
