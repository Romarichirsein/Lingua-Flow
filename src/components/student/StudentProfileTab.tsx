import React, { useState } from "react";
import { Student, School, Program, UILocale, ThemeMode, ActivityLog } from "../../types";
import { translations } from "../../lib/translations";
import { computeDaysRemaining } from "../../lib/syncEngine";
import { NeonButton } from "../common/NeonButton";
import {
  User,
  Shield,
  KeyRound,
  Globe,
  Sun,
  Moon,
  Monitor,
  Bell,
  MessageCircle,
  Mail,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Lock,
  History,
  ChevronRight,
  Clock,
} from "lucide-react";

interface StudentProfileTabProps {
  student: Student;
  school: School;
  program: Program | undefined;
  auditLogs?: ActivityLog[];
  locale: UILocale;
  theme?: ThemeMode;
  onUpdateTheme?: (theme: ThemeMode) => void;
  onUpdateLocale: (locale: UILocale) => void;
  onUpdateStudent: (student: Student) => void;
  onAddLog: (action: string, details: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const StudentProfileTab: React.FC<StudentProfileTabProps> = ({
  student,
  school,
  program,
  auditLogs = [],
  locale,
  theme = "dark",
  onUpdateTheme,
  onUpdateLocale,
  onUpdateStudent,
  onAddLog,
  onNavigateTab,
}) => {
  const t = translations[locale];

  // Calculate days remaining safely
  const daysRemaining = computeDaysRemaining(student.endDate);

  // Notification toggles state
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inactivityAlerts, setInactivityAlerts] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <User size={22} className="text-indigo-500" />
          {t.student.profileTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.student.profileSubtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: Personal Info & Administrative Contract */}
        <div className="md:col-span-6 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-indigo-500" />
              {t.student.personalInfo}
            </h3>

            <div className="flex items-center gap-4 pb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {student.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500">
                  {locale === "en" ? "Level" : "Niveau"} {student.level} • {school.language === "german" ? (locale === "en" ? "German 🇩🇪" : "Allemand 🇩🇪") : (locale === "en" ? "Italian 🇮🇹" : "Italien 🇮🇹")}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{locale === "en" ? "Phone / WhatsApp:" : "Téléphone / WhatsApp :"}</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {student.phone || (locale === "en" ? "Not set" : "Non renseigné")}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{locale === "en" ? "Enrollment Date:" : "Date d'inscription :"}</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {student.accessStartDate || student.startDate || (locale === "en" ? "Active session" : "Session active")}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{locale === "en" ? "Account Status:" : "Statut du compte :"}</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 size={13} /> {t.student.activeAccount}
                </span>
              </div>
            </div>
          </div>

          {/* School Contract Metadata Card */}
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building size={16} className="text-cyan-500" />
              {t.student.schoolContractInfo}
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{locale === "en" ? "School Center:" : "Établissement :"}</span>
                <span className="font-bold text-slate-900 dark:text-white">{school.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">{t.student.schoolTaughtLanguage} :</span>
                <span className="font-bold text-indigo-500">
                  {school.language === "german" ? (locale === "en" ? "German (Deutsch) 🇩🇪" : "Allemand (Deutsch) 🇩🇪") : (locale === "en" ? "Italian (Italiano) 🇮🇹" : "Italien (Italiano) 🇮🇹")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">{locale === "en" ? "Assigned Curriculum:" : "Programme attribué :"}</span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                  {program?.title || (locale === "en" ? "Standard Curriculum" : "Cursus Standard")}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200/60 dark:border-white/5 pt-2">
                <span className="text-slate-500">{t.student.contractExpires} :</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {student.endDate}
                </span>
              </div>

              <div className="flex justify-between items-center bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {t.student.daysRemainingLabel} :
                </span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {daysRemaining} {locale === "en" ? "days" : "jours"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security Password & Language / UI Preferences */}
        <div className="md:col-span-6 space-y-6">
          {/* Security & Access Management (Managed exclusively by School Admin) */}
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                {locale === "en" ? "Account Security & Credentials" : "Sécurité & Accès au Compte"}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Lock size={11} />
                {locale === "en" ? "School Managed" : "Géré par votre école"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                  <KeyRound size={16} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {locale === "en" ? "Password Modification Restricted" : "Modification de mot de passe restreinte"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {locale === "en"
                      ? `For institutional security and compliance, student login credentials and passwords are strictly managed by your partner school administration (${school.name}). Students cannot alter passwords directly.`
                      : `Pour des raisons de sécurité académique et de conformité, vos identifiants et mot de passe sont exclusivement gérés et administrés par l'administration de votre école partenaire (${school.name}). L'élève ne peut pas modifier son mot de passe directement.`}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  {locale === "en" ? "Need a password reset?" : "Besoin d'une réinitialisation ?"}
                </span>
                <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                  {school.managerEmail || school.professionalEmail || school.name}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences (Language, Notifications) */}
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={16} className="text-indigo-500" />
              {t.student.interfaceLanguage}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateLocale("fr")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  locale === "fr"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <span>🇫🇷 Français</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateLocale("en")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  locale === "en"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>

            {/* Theme Mode Switcher */}
            {onUpdateTheme && (
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sun size={15} className="text-amber-500" />
                  {locale === "en" ? "Appearance & Theme:" : "Apparence & Thème d'affichage :"}
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateTheme("light")}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                      theme === "light"
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <Sun size={14} className="text-amber-500" />
                    <span>{locale === "en" ? "Light" : "Clair"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateTheme("dark")}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                      theme === "dark"
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <Moon size={14} className="text-violet-400" />
                    <span>{locale === "en" ? "Dark" : "Sombre"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateTheme("system")}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                      theme === "system"
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-xs"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <Monitor size={14} className="text-cyan-400" />
                    <span>{locale === "en" ? "Auto" : "Système"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notification checkboxes */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {t.student.notificationPreferences} :
              </span>

              <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>{t.student.whatsappAlerts}</span>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>{t.student.emailReminders}</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>{t.student.inactivityAlerts}</span>
                <input
                  type="checkbox"
                  checked={inactivityAlerts}
                  onChange={(e) => setInactivityAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Personal Audit & Activity Card */}
      <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <History size={17} className="text-indigo-500" />
              {locale === "en" ? "Recent Activity & Personal Audit Trail" : "Journal d'Activité & Audit de l'Espace"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === "en"
                ? "Certified timeline of your lessons, quizzes, exam simulations, and session logins."
                : "Traçabilité certifiée de vos leçons validées, scores aux quiz, examens et sessions."}
            </p>
          </div>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab("audit")}
              className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>{locale === "en" ? "View Full Audit Trail" : "Accéder à l'Audit Complet"}</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {(() => {
          const recentLogs = (auditLogs || []).filter((log) => {
            return (
              log.targetId === student.id ||
              log.entityId === student.id ||
              log.actorName === student.name ||
              (log.details && log.details.includes(student.name)) ||
              (log.action && log.action.includes(student.name))
            );
          }).slice(0, 4);

          if (recentLogs.length === 0) {
            return (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
                {locale === "en"
                  ? "No activity logged yet. Your coursework progress will be recorded here automatically."
                  : "Aucune activité récente enregistrée pour le moment. Vos validations de cours apparaîtront ici."}
              </div>
            );
          }

          return (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{log.action}</p>
                      <p className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{log.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
