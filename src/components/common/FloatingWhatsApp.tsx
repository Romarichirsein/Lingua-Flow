import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, ExternalLink, ShieldCheck, X } from "lucide-react";
import { UserRole, UILocale } from "../../types";
import { translations } from "../../lib/translations";

interface FloatingWhatsAppProps {
  role: UserRole;
  whatsappUrl: string;
  recipientName: string;
  customLabel?: string;
  locale?: UILocale;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  role,
  whatsappUrl,
  recipientName,
  customLabel,
  locale = "fr",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const t = translations[locale];

  // Super Admin is the platform owner/creator: NEVER show floating WhatsApp button
  if (role === "super_admin" || (role as string) === "superadmin") {
    return null;
  }

  // Validate and sanitize WhatsApp link
  const cleanUrl = whatsappUrl?.trim() || "https://chat.whatsapp.com/LinguaFlowCommunity";
  
  const defaultLabel =
    role === "student"
      ? (locale === "en" ? "Join School WhatsApp Group" : "Rejoindre le Groupe WhatsApp de l'École")
      : (locale === "en" ? "Contact Super Admin on WhatsApp" : "Contacter le Super Admin sur WhatsApp");

  const label = customLabel || defaultLabel;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmOpen = () => {
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Hover Pill Label */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md border border-emerald-500/30 dark:bg-slate-900"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{label}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Floating Button */}
        <motion.button
          id="floating-whatsapp-btn"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={handleClick}
          aria-label={label}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.4)] transition hover:bg-[#20bd5a] cursor-pointer"
        >
          <MessageCircle size={28} className="transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-white dark:border-[#070A12]"></span>
          </span>
        </motion.button>
      </div>

      {/* Direct WhatsApp Transition Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setShowConfirmation(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-emerald-500/30 bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border-white/10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {role === "student" ? t.student.whatsappModalTitle : t.superAdmin.whatsappSupportTitle}
                    </h4>
                    <p className="text-xs text-slate-500">{recipientName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="my-4 rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/15">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={16} />
                  {locale === "en" ? "Official secure link:" : "Lien officiel sécurisé :"}
                </div>
                <code className="mt-1 block text-xs text-slate-700 dark:text-slate-300 break-all font-mono">
                  {cleanUrl}
                </code>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                {role === "student"
                  ? t.student.whatsappModalDesc
                  : t.superAdmin.whatsappSupportDesc}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  {t.common.close}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOpen}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition cursor-pointer"
                >
                  <span>{t.student.openWhatsapp}</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
