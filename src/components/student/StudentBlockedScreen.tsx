import React from "react";
import { Student, School, UILocale } from "../../types";
import { translations } from "../../lib/translations";
import { Lock, AlertOctagon, Phone, Mail, MessageCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { NeonButton } from "../common/NeonButton";

interface StudentBlockedScreenProps {
  student: Student;
  school: School;
  locale: UILocale;
  reason: "expired" | "suspended" | "blocked";
  onLogout?: () => void;
}

export const StudentBlockedScreen: React.FC<StudentBlockedScreenProps> = ({
  student,
  school,
  locale,
  reason,
  onLogout,
}) => {
  const t = translations[locale];

  const isExpired = reason === "expired";
  const title = isExpired
    ? t.student.expiredBannerTitle
    : t.student.suspendedBannerTitle;

  const desc = isExpired
    ? t.student.expiredBannerDesc
    : t.student.suspendedBannerDesc;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-[#0D1220] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Warning Icon Badge */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg">
          {isExpired ? <Lock size={40} /> : <AlertOctagon size={40} />}
        </div>

        {/* Header Titles */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            {isExpired ? (locale === "en" ? "Access Expired" : "Accès Expiré") : (locale === "en" ? "Access Suspended" : "Accès Suspendu")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            {desc}
          </p>
        </div>

        {/* Student & School Status Card */}
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">{locale === "en" ? "Student:" : "Élève :"}</span>
            <span className="font-bold text-slate-900 dark:text-white">{student.name} ({student.email})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">{locale === "en" ? "School:" : "École :"}</span>
            <span className="font-bold text-slate-900 dark:text-white">{school.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">{locale === "en" ? "Language taught:" : "Langue enseignée :"}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {school.language === "german" ? t.common.german : t.common.italian}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">{locale === "en" ? "Expiration Date:" : "Date d'expiration :"}</span>
            <span className="font-bold text-rose-500">{student.endDate}</span>
          </div>
        </div>

        {/* Assistance Contacts */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {locale === "en" ? "To reactivate your access, contact your school administration:" : "Pour réactiver votre accès, contactez le secrétariat de votre école :"}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {school.whatsappSupportUrl && (
              <a
                href={school.whatsappSupportUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow-md"
              >
                <MessageCircle size={16} />
                <span>{locale === "en" ? "WhatsApp Support" : "Assistance WhatsApp"}</span>
              </a>
            )}

            {(school.contactEmail || school.professionalEmail || school.managerEmail) && (
              <a
                href={`mailto:${school.contactEmail || school.professionalEmail || school.managerEmail}?subject=Demande de réactivation d'accès - ${student.name}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                <Mail size={16} />
                <span>{school.contactEmail || school.professionalEmail || school.managerEmail}</span>
              </a>
            )}

            {(school.contactPhone || school.phone || school.managerPhone) && (
              <a
                href={`tel:${school.contactPhone || school.phone || school.managerPhone}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                <Phone size={16} />
                <span>{school.contactPhone || school.phone || school.managerPhone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Back / Logout */}
        {onLogout && (
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-center">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{t.auth.logout}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
