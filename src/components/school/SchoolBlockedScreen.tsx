import React from "react";
import { School, UILocale, GlobalPlatformConfig } from "../../types";
import { Lock, AlertOctagon, MessageCircle, Clock, ShieldAlert } from "lucide-react";
import { buildSuperAdminWhatsAppUrl, computeDaysRemaining } from "../../lib/syncEngine";

interface SchoolBlockedScreenProps {
  school: School;
  config: GlobalPlatformConfig;
  locale: UILocale;
  reason: "suspended" | "blocked" | "expired";
}

export const SchoolBlockedScreen: React.FC<SchoolBlockedScreenProps> = ({
  school,
  config,
  locale,
  reason,
}) => {
  const isEn = locale === "en";
  const daysLeft = computeDaysRemaining(school.endDate);
  const whatsappUrl = buildSuperAdminWhatsAppUrl(config, school, locale);

  const getTitle = () => {
    if (reason === "expired") {
      return isEn ? "School SaaS Subscription Expired" : "Abonnement SaaS de l'École Expiré";
    }
    if (reason === "suspended") {
      return isEn ? "School Account Suspended" : "Compte École Temporairement Suspendu";
    }
    return isEn ? "School Account Blocked" : "Accès École Bloqué";
  };

  const getDesc = () => {
    if (reason === "expired") {
      return isEn
        ? `Your school's access period ended on ${school.endDate}. Content creation, student enrollments, and student course access are currently paused. Please contact Super Admin to renew your license.`
        : `La période d'accès de votre établissement a pris fin le ${school.endDate}. La création de contenus, les inscriptions et l'accès de vos élèves sont momentanément suspendus. Veuillez contacter le Super Admin pour prolonger votre licence.`;
    }
    if (reason === "suspended") {
      return isEn
        ? `Your school account has been suspended by the platform administration. ${school.suspensionReason ? `Reason: "${school.suspensionReason}". ` : ""}Pedagogical operations and student access are on hold. Contact Super Admin to reactivate.`
        : `Votre espace école a été suspendu par l'administration centrale. ${school.suspensionReason ? `Motif : "${school.suspensionReason}". ` : ""}Les opérations pédagogiques et l'accès des élèves sont mis en pause. Contactez le Super Admin pour réactiver.`;
    }
    return isEn
      ? "Access has been restricted by Super Admin due to administrative compliance. Contact platform support via WhatsApp for resolution."
      : "L'accès à cet établissement a été restreint par le Super Admin pour conformité administrative. Contactez le support de la plateforme sur WhatsApp.";
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-[#0D1220] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-md">
        {/* Status Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg">
          {reason === "expired" ? (
            <Clock size={40} className="animate-pulse" />
          ) : reason === "suspended" ? (
            <ShieldAlert size={40} />
          ) : (
            <Lock size={40} />
          )}
        </div>

        {/* Title and Explanation */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
            {reason === "expired"
              ? isEn
                ? "Status: Expired"
                : "Statut : Expiré"
              : reason === "suspended"
              ? isEn
                ? "Status: Suspended"
                : "Statut : Suspendu"
              : isEn
              ? "Status: Blocked"
              : "Statut : Bloqué"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {getTitle()}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            {getDesc()}
          </p>
        </div>

        {/* School Summary Details */}
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">{isEn ? "School Name:" : "Nom de l'école :"}</span>
            <span className="font-bold text-slate-900 dark:text-white">{school.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">{isEn ? "School ID:" : "Identifiant École :"}</span>
            <span className="font-mono font-bold text-[#6D5DFC]">{school.id}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">{isEn ? "Taught Language:" : "Langue enseignée :"}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {school.language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">{isEn ? "End of Access:" : "Fin de validité :"}</span>
            <span className="font-bold text-rose-500">{school.endDate} ({daysLeft} {isEn ? "days remaining" : "jours restants"})</span>
          </div>
        </div>

        {/* Call to action for Super Admin WhatsApp support */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isEn
              ? "To renew your license or resolve this suspension, contact Super Admin directly:"
              : "Pour renouveler votre licence ou lever cette suspension, contactez directement le Super Admin :"}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow-lg w-full sm:w-auto cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>{isEn ? "Contact Super Admin on WhatsApp" : "Contacter le Super Admin sur WhatsApp"}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
