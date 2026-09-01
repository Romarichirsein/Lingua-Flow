import React from "react";
import { Clock, AlertTriangle, CheckCircle, ShieldAlert, AlertCircle } from "lucide-react";
import { Student, UILocale } from "../../types";
import { translations } from "../../lib/translations";
import { computeDaysRemaining, getEffectiveStatus } from "../../lib/syncEngine";

interface StudentCountdownBannerProps {
  student: Student;
  locale?: UILocale;
}

export const StudentCountdownBanner: React.FC<StudentCountdownBannerProps> = ({
  student,
  locale = "fr",
}) => {
  const t = translations[locale];
  const daysRemaining = computeDaysRemaining(student.endDate);
  const effectiveStatus = getEffectiveStatus(student);

  const isExpired = effectiveStatus === "expired" || daysRemaining <= 0;
  const isSuspended = effectiveStatus === "suspended" || effectiveStatus === "blocked";
  const isCritical = daysRemaining > 0 && daysRemaining <= 3;
  const isWarning = daysRemaining > 3 && daysRemaining <= 14;

  if (isSuspended) {
    return (
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <ShieldAlert size={24} className="shrink-0 animate-bounce" />
          <div>
            <h4 className="font-bold text-sm">{t.student.suspendedBannerTitle}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {t.student.suspendedBannerDesc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <AlertTriangle size={24} className="shrink-0 animate-pulse" />
          <div>
            <h4 className="font-bold text-sm">{t.student.expiredBannerTitle}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {t.student.expiredBannerDesc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl p-5 shadow-lg backdrop-blur-md border transition-all ${
        isCritical
          ? "border-rose-500/40 bg-rose-500/10 dark:bg-rose-950/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
          : isWarning
          ? "border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          : "border-indigo-500/30 bg-indigo-500/5 dark:bg-slate-900/60"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              isCritical
                ? "bg-rose-500/20 text-rose-500 animate-pulse"
                : isWarning
                ? "bg-amber-500/20 text-amber-500"
                : "bg-emerald-500/20 text-emerald-500"
            }`}
          >
            {isCritical ? (
              <AlertCircle size={22} />
            ) : (
              <Clock size={22} className={isWarning ? "animate-pulse" : ""} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.student.activeAccount}
              </h4>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isCritical
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : isWarning
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                }`}
              >
                <CheckCircle size={10} /> {t.student.accountValidated}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {t.student.accessExpiresOn} <strong>{student.endDate}</strong>
            </p>
          </div>
        </div>

        {/* Days count badge */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div
            className={`rounded-2xl px-4 py-2 text-center border ${
              isCritical
                ? "bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                : isWarning
                ? "bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <span className="block text-2xl font-black leading-none">
              {daysRemaining}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {t.student.daysRemainingLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

