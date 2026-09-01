import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  ShieldCheck,
  Server,
  Clock,
  Layers,
  Database,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Terminal,
} from "lucide-react";
import { runSuperAdminDiagnostic, DiagnosticReport, DiagnosticAssertion } from "../../lib/diagnostics/superAdminDiagnostic";
import { School, Student, ActivityLog, UILocale } from "../../types";
import { saveStoredData, getStoredData } from "../../lib/mockData";

interface SuperAdminDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: UILocale;
  schools: School[];
  students: Student[];
  onAddLog?: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminDiagnosticModal: React.FC<SuperAdminDiagnosticModalProps> = ({
  isOpen,
  onClose,
  locale,
  schools,
  students,
  onAddLog,
}) => {
  const isEn = locale === "en";
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | "all">("all");
  const [expandedAssertionId, setExpandedAssertionId] = useState<string | null>(null);

  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    try {
      // Simulate real browser storage adapter
      const browserStorage = {
        getStored: () => {
          const raw = getStoredData();
          return {
            schools: raw.schools,
            students: raw.students,
            logs: raw.logs,
          };
        },
        saveStored: (data: { schools?: School[]; students?: Student[]; logs?: ActivityLog[] }) => {
          saveStoredData(data);
        },
      };

      // Slight delay for animation effect
      await new Promise((r) => setTimeout(r, 600));
      const res = await runSuperAdminDiagnostic(browserStorage);
      setReport(res);
      if (onAddLog) {
        onAddLog(
          "Diagnostic Système Super Admin",
          `Exécution complète : ${res.passedCount}/${res.totalTests} assertions validées en ${res.totalDurationMs}ms.`,
          res.isHealthy ? "success" : "warning"
        );
      }
    } catch (err) {
      console.error("Diagnostic execution error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report && !isRunning) {
      handleRunDiagnostic();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAssertions = report
    ? selectedStep === "all"
      ? report.assertions
      : report.assertions.filter((a) => a.step === selectedStep)
    : [];

  const uniqueSteps = report
    ? Array.from(new Set(report.assertions.map((a) => a.step)))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans"
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] text-white shadow-[0_0_15px_rgba(109,93,252,0.4)] shrink-0">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {isEn ? "Super Admin Diagnostic" : "Diagnostic Super Admin"}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 uppercase tracking-wider">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {isEn
                  ? "Verifies school creation, student assignment, status cascades & sync"
                  : "Vérifie les flux d'écoles, élèves, statuts et synchronisation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleRunDiagnostic}
              disabled={isRunning}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white text-xs font-bold shadow-lg shadow-[#6D5DFC]/20 hover:opacity-90 active:scale-95 transition disabled:opacity-50 cursor-pointer min-h-[40px]"
            >
              <RefreshCw size={14} className={isRunning ? "animate-spin" : ""} />
              <span>{isRunning ? (isEn ? "Running..." : "En cours...") : (isEn ? "Rerun Tests" : "Relancer le test")}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-950/30 border-b border-white/5">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <ShieldCheck size={14} className="text-[#20E3A2]" />
                <span>{isEn ? "Health Status" : "Santé Globale"}</span>
              </div>
              <p className={`text-base font-black ${report.isHealthy ? "text-[#20E3A2]" : "text-rose-400"}`}>
                {report.isHealthy ? (isEn ? "100% HEALTHY" : "100% OPÉRATIONNEL") : (isEn ? "DEGRADED" : "DÉGRADÉ")}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <CheckCircle2 size={14} className="text-indigo-400" />
                <span>{isEn ? "Assertions Passed" : "Tests Réussis"}</span>
              </div>
              <p className="text-base font-black text-white">
                {report.passedCount} <span className="text-xs text-slate-500 font-normal">/ {report.totalTests}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock size={14} className="text-amber-400" />
                <span>{isEn ? "Latency" : "Temps d'exécution"}</span>
              </div>
              <p className="text-base font-black text-white">
                {report.totalDurationMs} <span className="text-xs text-slate-500 font-normal">ms</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Database size={14} className="text-cyan-400" />
                <span>{isEn ? "Entities Monitored" : "Entités Actives"}</span>
              </div>
              <p className="text-base font-black text-white">
                {schools.length} <span className="text-xs text-slate-400 font-normal">écoles</span> • {students.length} <span className="text-xs text-slate-400 font-normal">élèves</span>
              </p>
            </div>
          </div>
        )}

        {/* Step Filter Tabs */}
        {uniqueSteps.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 overflow-x-auto scrollbar-none bg-slate-950/20">
            <button
              onClick={() => setSelectedStep("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStep === "all"
                  ? "bg-[#6D5DFC] text-white shadow-sm"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isEn ? "All Steps" : "Toutes les étapes"} ({report?.assertions.length})
            </button>
            {uniqueSteps.map((step) => {
              const count = report?.assertions.filter((a) => a.step === step).length;
              return (
                <button
                  key={step}
                  onClick={() => setSelectedStep(step)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedStep === step
                      ? "bg-[#6D5DFC] text-white shadow-sm"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {step} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Assertions Roster */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="p-4 rounded-full bg-gradient-to-tr from-[#6D5DFC]/20 to-[#00D9FF]/20 border border-[#6D5DFC]/30 animate-pulse">
                <Terminal size={32} className="text-[#00D9FF] animate-spin" />
              </div>
              <p className="text-sm font-bold text-white">
                {isEn ? "Executing deep diagnostic assertions..." : "Exécution des assertions de diagnostic en cours..."}
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                {isEn
                  ? "Iterating over creation models, quota tracking, status cascades, and isolation rules."
                  : "Vérification des modèles de création, du suivi des quotas, des cascades de statuts et des règles d'isolation."}
              </p>
            </div>
          ) : (
            filteredAssertions.map((assertion) => {
              const isExpanded = expandedAssertionId === assertion.id;
              const isPass = assertion.status === "passed";

              return (
                <div
                  key={assertion.id}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isPass
                      ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                      : "bg-rose-500/10 border-rose-500/30"
                  }`}
                >
                  <div
                    onClick={() => setExpandedAssertionId(isExpanded ? null : assertion.id)}
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5">
                        {isPass ? (
                          <CheckCircle2 size={18} className="text-[#20E3A2]" />
                        ) : (
                          <XCircle size={18} className="text-rose-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-400">{assertion.step}</span>
                          <span className="text-xs text-slate-600 dark:text-slate-500">•</span>
                          <h4 className="font-bold text-sm text-white">{assertion.name}</h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{assertion.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-[11px] font-mono text-slate-400">{assertion.durationMs}ms</span>
                      {assertion.details && (
                        <div className="text-slate-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assertion Extended Details / Params */}
                  {isExpanded && assertion.details && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-black/40">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-2">
                        <Terminal size={12} className="text-[#00D9FF]" />
                        <span>Assertion Telemetry & Evaluated Context:</span>
                      </div>
                      <pre className="p-3 rounded-xl bg-black/60 border border-white/5 text-[11px] font-mono text-[#20E3A2] overflow-x-auto">
                        {JSON.stringify(assertion.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#20E3A2] animate-ping" />
            <span>{isEn ? "Reactive State Engine v1.0.4" : "Moteur de Synchronisation Réactive v1.0.4"}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition cursor-pointer"
            >
              {isEn ? "Close" : "Fermer"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
