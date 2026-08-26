import React, { useState } from "react";
import { ActivityLog, UILocale } from "../../types";
import {
  ShieldCheck,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  Terminal,
} from "lucide-react";

interface SuperAdminLogsTabProps {
  logs: ActivityLog[];
  locale: UILocale;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminLogsTab: React.FC<SuperAdminLogsTabProps> = ({
  logs,
  locale,
  onAddLog,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.schoolName && log.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesRole = roleFilter === "all" || log.actorRole === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Timestamp", "Action", "Details", "Acteur", "Role", "Ecole", "Statut", "IP"];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      l.actorRole,
      `"${l.schoolName || ""}"`,
      l.status,
      l.ipAddress || "127.0.0.1",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `linguaflow_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddLog("Export Audit", "Export CSV du journal des activités de sécurité.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par action, mot-clé, acteur, école..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">Tous statuts</option>
            <option value="success">Succès</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="school_admin">Directeur École</option>
            <option value="student">Élève</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold transition min-h-[40px] cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-4">Date & Heure</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Détails de l'Opération</th>
                <th className="py-3.5 px-4">Acteur & Rôle</th>
                <th className="py-3.5 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    Aucun log de sécurité correspondant.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-white/70 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-800 dark:text-white">{log.actorName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === "success"
                            ? "bg-[#20E3A2]/15 text-[#20E3A2]"
                            : log.status === "warning"
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
