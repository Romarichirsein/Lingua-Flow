import React, { useState, useMemo } from "react";
import { School, UILocale, AuditLog } from "../../types";
import { translations } from "../../lib/translations";
import {
  History,
  ShieldCheck,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  Shield,
  RefreshCw,
  Plus,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { NeonButton } from "../common/NeonButton";
import { Modal } from "../common/Modal";

interface SchoolAuditTabProps {
  locale: UILocale;
  school: School;
  auditLogs?: AuditLog[];
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error", extra?: any) => void;
}

export const SchoolAuditTab: React.FC<SchoolAuditTabProps> = ({
  locale,
  school,
  auditLogs = [],
  onAddLog,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter logs for this school
  const schoolLogs = useMemo(() => {
    return auditLogs.filter(
      (log) =>
        log.schoolId === school.id ||
        log.targetId === school.id ||
        (log.schoolName && log.schoolName.toLowerCase() === school.name.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(school.name.toLowerCase()))
    );
  }, [auditLogs, school.id, school.name]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Manual Checkpoint Modal
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [checkpointAction, setCheckpointAction] = useState("Vérification d'accès & quotas");
  const [checkpointDetails, setCheckpointDetails] = useState("");
  const [checkpointStatus, setCheckpointStatus] = useState<"success" | "warning" | "error">("success");

  // Filtered logs
  const filteredLogs = useMemo(() => {
    const now = new Date().getTime();
    return schoolLogs.filter((log) => {
      // Search
      const matchesSearch =
        !searchTerm.trim() ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress && log.ipAddress.includes(searchTerm)) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Status
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;

      // Category
      let matchesCat = true;
      if (categoryFilter === "students") {
        matchesCat =
          log.action.toLowerCase().includes("élève") ||
          log.action.toLowerCase().includes("student") ||
          log.action.toLowerCase().includes("inscription") ||
          log.action.toLowerCase().includes("accès") ||
          log.action.toLowerCase().includes("statut");
      } else if (categoryFilter === "courses") {
        matchesCat =
          log.action.toLowerCase().includes("cursus") ||
          log.action.toLowerCase().includes("programme") ||
          log.action.toLowerCase().includes("leçon") ||
          log.action.toLowerCase().includes("cours") ||
          log.action.toLowerCase().includes("module");
      } else if (categoryFilter === "evaluations") {
        matchesCat =
          log.action.toLowerCase().includes("quiz") ||
          log.action.toLowerCase().includes("devoir") ||
          log.action.toLowerCase().includes("évaluation") ||
          log.action.toLowerCase().includes("rédaction");
      } else if (categoryFilter === "security") {
        matchesCat =
          log.action.toLowerCase().includes("sécurité") ||
          log.action.toLowerCase().includes("mot de passe") ||
          log.action.toLowerCase().includes("authentification") ||
          log.action.toLowerCase().includes("filigrane") ||
          log.action.toLowerCase().includes("audit") ||
          log.action.toLowerCase().includes("contrôle");
      } else if (categoryFilter === "settings") {
        matchesCat =
          log.action.toLowerCase().includes("paramètre") ||
          log.action.toLowerCase().includes("logo") ||
          log.action.toLowerCase().includes("whatsapp") ||
          log.action.toLowerCase().includes("collaborateur");
      }

      // Time filter
      let matchesTime = true;
      if (timeFilter !== "all") {
        const logTime = new Date(log.timestamp).getTime();
        const diffHours = (now - logTime) / (1000 * 60 * 60);
        if (timeFilter === "today") matchesTime = diffHours <= 24;
        else if (timeFilter === "week") matchesTime = diffHours <= 24 * 7;
        else if (timeFilter === "month") matchesTime = diffHours <= 24 * 30;
      }

      return matchesSearch && matchesStatus && matchesCat && matchesTime;
    });
  }, [schoolLogs, searchTerm, statusFilter, categoryFilter, timeFilter]);

  // Statistics
  const successCount = schoolLogs.filter((l) => l.status === "success").length;
  const warningCount = schoolLogs.filter((l) => l.status === "warning").length;
  const errorCount = schoolLogs.filter((l) => l.status === "error").length;
  const lastLogDate = schoolLogs[0]?.timestamp;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date_Heure",
      "Action",
      "Details",
      "Acteur_Nom",
      "Acteur_Role",
      "Ecole",
      "Statut",
      "Adresse_IP",
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      l.actorRole,
      `"${(l.schoolName || school.name).replace(/"/g, '""')}"`,
      l.status,
      l.ipAddress || "127.0.0.1",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `linguaflow_audit_${school.slug}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddLog(
      "Export du journal d'audit",
      `Exportation CSV de ${filteredLogs.length} événements d'audit pour l'école ${school.name}.`,
      "success"
    );
  };

  // Create Checkpoint Handler
  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpointAction.trim()) return;

    onAddLog(
      checkpointAction.trim(),
      checkpointDetails.trim() || `Contrôle de conformité et vérification administrative validés pour ${school.name}.`,
      checkpointStatus,
      {
        schoolId: school.id,
        schoolName: school.name,
      }
    );

    setIsCheckpointModalOpen(false);
    setCheckpointDetails("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "School Audit & Traceability Log" : "Journal d'Audit & Traçabilité de l'École"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {school.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
            {isEn
              ? "Comprehensive, immutable audit trail of administrative modifications, student access events, curriculum updates and security authorizations."
              : "Traçabilité complète et horodatée des actions administratives, gestion des élèves, modifications de cursus et événements de sécurité."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <NeonButton
            variant="ghost"
            size="sm"
            onClick={() => setIsCheckpointModalOpen(true)}
            icon={<Plus size={15} />}
          >
            {isEn ? "New Audit Checkpoint" : "Nouveau Contrôle"}
          </NeonButton>

          <NeonButton
            variant="cyan"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download size={15} />}
            disabled={filteredLogs.length === 0}
          >
            {isEn ? "Export Audit CSV" : "Exporter l'Audit CSV"}
          </NeonButton>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Total Audit Events" : "Total Événements"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#6D5DFC]/10 text-[#6D5DFC] flex items-center justify-center">
              <History size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {schoolLogs.length}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-white/40">
            {filteredLogs.length} {isEn ? "matching filters" : "correspondant aux filtres"}
          </span>
        </div>

        {/* Success */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Successful Operations" : "Actions Conformes"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#20E3A2]/10 text-[#20E3A2] flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#20E3A2] font-mono">
            {successCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-white/40">
            {Math.round((successCount / Math.max(1, schoolLogs.length)) * 100)}% {isEn ? "conformity rate" : "taux de conformité"}
          </span>
        </div>

        {/* Warnings */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Warnings / Alerts" : "Avertissements"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {warningCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-white/40">
            {errorCount} {isEn ? "critical alerts" : "alertes critiques"}
          </span>
        </div>

        {/* Last Event */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              {isEn ? "Latest Verification" : "Dernière Activité"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {lastLogDate
              ? new Date(lastLogDate).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Aucune"}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-white/40">
            {isEn ? "Real-time sync" : "Synchronisation instantanée"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isEn
                ? "Search action, actor, details, IP..."
                : "Rechercher par action, acteur, détail, IP..."
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D9FF]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{isEn ? "All Categories" : "Toutes les catégories"}</option>
            <option value="students">{isEn ? "Students & Enrollments" : "Élèves & Inscriptions"}</option>
            <option value="courses">{isEn ? "Curriculum & Courses" : "Programmes & Cours"}</option>
            <option value="evaluations">{isEn ? "Quizzes & Essays" : "Quiz & Évaluations"}</option>
            <option value="security">{isEn ? "Security & Access" : "Sécurité & Accès"}</option>
            <option value="settings">{isEn ? "Settings & Team" : "Paramètres & Équipe"}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{isEn ? "All Statuses" : "Tous les statuts"}</option>
            <option value="success">{isEn ? "Success" : "Succès"}</option>
            <option value="warning">{isEn ? "Warnings" : "Avertissements"}</option>
            <option value="error">{isEn ? "Errors" : "Erreurs"}</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">{isEn ? "All Time" : "Toutes les dates"}</option>
            <option value="today">{isEn ? "Last 24 Hours" : "Dernières 24h"}</option>
            <option value="week">{isEn ? "Last 7 Days" : "7 derniers jours"}</option>
            <option value="month">{isEn ? "Last 30 Days" : "30 derniers jours"}</option>
          </select>

          {(searchTerm || statusFilter !== "all" || categoryFilter !== "all" || timeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setTimeFilter("all");
              }}
              className="px-2.5 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
            >
              {isEn ? "Reset" : "Réinitialiser"}
            </button>
          )}
        </div>
      </div>

      {/* Main Audit Table & Log Stream */}
      <div className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Activity Logs Records" : "Enregistrements du Journal de Sécurité"}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D9FF]/10 text-[#00D9FF] font-mono">
              {filteredLogs.length} {isEn ? "records" : "lignes"}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-white/40 font-medium">
            {isEn ? "Strict tamper-proof storage" : "Stockage horodaté inaltérable"}
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
              <History size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-white/80">
              {isEn ? "No audit logs matching your criteria." : "Aucun événement d'audit ne correspond à vos filtres."}
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isEn
                ? "Actions performed by school administrators, teachers, and students will appear here automatically."
                : "Toutes les actions d'inscriptions, modifications de cours, accès et contrôles de sécurité apparaîtront ici automatiquement."}
            </p>
            <div className="pt-2">
              <NeonButton
                variant="cyan"
                size="sm"
                onClick={() => setIsCheckpointModalOpen(true)}
              >
                {isEn ? "Create Test Audit Entry" : "Créer une entrée d'audit test"}
              </NeonButton>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredLogs.map((log) => {
              const statusColor =
                log.status === "success"
                  ? "bg-[#20E3A2]/10 text-[#20E3A2] border-[#20E3A2]/30"
                  : log.status === "warning"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30";

              const statusIcon =
                log.status === "success" ? (
                  <CheckCircle2 size={13} className="text-[#20E3A2]" />
                ) : log.status === "warning" ? (
                  <AlertTriangle size={13} className="text-amber-400" />
                ) : (
                  <XCircle size={13} className="text-rose-400" />
                );

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">{statusIcon}</div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {log.action}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}
                        >
                          {log.status.toUpperCase()}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
                          {log.actorRole === "school_admin"
                            ? isEn ? "School Admin" : "Directeur École"
                            : log.actorRole === "super_admin"
                            ? "Super Admin"
                            : log.actorRole === "student"
                            ? isEn ? "Student" : "Élève"
                            : log.actorRole}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-white/70 text-xs leading-relaxed break-words">
                        {log.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 dark:text-white/40 pt-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <User size={12} />
                          {log.actorName}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">
                          IP: {log.ipAddress || "127.0.0.1"}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400/70">
                          ID: {log.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-slate-700 dark:text-white/80">
                        {new Date(log.timestamp).toLocaleTimeString(
                          locale === "en" ? "en-US" : "fr-FR",
                          { hour: "2-digit", minute: "2-digit", second: "2-digit" }
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.timestamp).toLocaleDateString(
                          locale === "en" ? "en-US" : "fr-FR",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition cursor-pointer"
                      title={isEn ? "View details" : "Voir les détails"}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Detailed Log Inspection */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={isEn ? "Audit Event Inspection" : "Inspection Détaillée de l'Événement"}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
                  {isEn ? "Action Record" : "Opération Enregistrée"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedLog.status === "success"
                      ? "bg-[#20E3A2]/10 text-[#20E3A2]"
                      : selectedLog.status === "warning"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {selectedLog.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedLog.action}
              </h3>

              <p className="text-slate-700 dark:text-white/80 leading-relaxed bg-white dark:bg-[#0D1220] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                {selectedLog.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isEn ? "Actor & Role" : "Acteur Responsable"}
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedLog.actorName}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedLog.actorRole}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isEn ? "Timestamp" : "Horodatage Précis"}
                </span>
                <p className="font-bold text-slate-900 dark:text-white font-mono">
                  {new Date(selectedLog.timestamp).toLocaleString(locale === "en" ? "en-US" : "fr-FR")}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  ISO: {selectedLog.timestamp}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isEn ? "School Associated" : "École Associée"}
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedLog.schoolName || school.name}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  ID: {selectedLog.schoolId || school.id}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isEn ? "Network & Security" : "Réseau & IP"}
                </span>
                <p className="font-bold text-slate-900 dark:text-white font-mono">
                  {selectedLog.ipAddress || "127.0.0.1"}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  Log ID: {selectedLog.id}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                {isEn ? "Close" : "Fermer"}
              </NeonButton>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Create Manual Audit Checkpoint */}
      <Modal
        isOpen={isCheckpointModalOpen}
        onClose={() => setIsCheckpointModalOpen(false)}
        title={isEn ? "Record Audit Checkpoint" : "Enregistrer un Point de Contrôle d'Audit"}
        size="md"
      >
        <form onSubmit={handleCreateCheckpoint} className="space-y-4 text-xs">
          <p className="text-slate-500 dark:text-white/60">
            {isEn
              ? "Register a formal administrative verification entry in the school's permanent security ledger."
              : "Enregistrez une vérification administrative formelle dans le journal de sécurité permanent de l'école."}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Checkpoint Action / Object *" : "Objet du Contrôle *"}
            </label>
            <input
              type="text"
              required
              value={checkpointAction}
              onChange={(e) => setCheckpointAction(e.target.value)}
              placeholder="Ex: Audit conformité des licences élèves"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Detailed Observation Notes" : "Observations & Détails du Contrôle"}
            </label>
            <textarea
              rows={3}
              value={checkpointDetails}
              onChange={(e) => setCheckpointDetails(e.target.value)}
              placeholder="Ex: Vérification de l'intégrité des 42 comptes élèves. Aucun accès suspect détecté."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Audit Result Status" : "Résultat du Contrôle"}
            </label>
            <select
              value={checkpointStatus}
              onChange={(e) => setCheckpointStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="success">{isEn ? "Success / Compliant" : "Succès / Conforme"}</option>
              <option value="warning">{isEn ? "Warning / Attention Required" : "Avertissement / Attention requise"}</option>
              <option value="error">{isEn ? "Error / Anomaly Detected" : "Anomalie / Déviation détectée"}</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <NeonButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCheckpointModalOpen(false)}
            >
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton
              type="submit"
              variant="cyan"
              size="sm"
            >
              {isEn ? "Register Entry" : "Enregistrer dans l'Audit"}
            </NeonButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
