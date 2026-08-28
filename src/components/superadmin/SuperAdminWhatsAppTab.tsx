import React, { useState } from "react";
import { GlobalPlatformConfig, UILocale } from "../../types";
import {
  MessageCircle,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Save,
  Sparkles,
  QrCode,
  ShieldCheck,
  Sliders,
} from "lucide-react";

interface SuperAdminWhatsAppTabProps {
  config: GlobalPlatformConfig;
  locale: UILocale;
  onUpdateConfig: (newConfig: GlobalPlatformConfig) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminWhatsAppTab: React.FC<SuperAdminWhatsAppTabProps> = ({
  config,
  locale,
  onUpdateConfig,
  onAddLog,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(
    config.superAdminWhatsapp?.replace(/[^0-9]/g, "") || "33612345678"
  );
  const [defaultMessageFr, setDefaultMessageFr] = useState(
    "Bonjour Support LinguaFlow, je suis directeur d'école et j'ai une question concernant nos quotas."
  );
  const [defaultMessageEn, setDefaultMessageEn] = useState(
    "Hello LinguaFlow Support, I am a school director and I have a question regarding our quotas."
  );
  const [enableFloatingButton, setEnableFloatingButton] = useState(true);
  const [floatingButtonText, setFloatingButtonText] = useState("Support Super Admin");

  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const generatedUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessageFr)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GlobalPlatformConfig = {
      ...config,
      superAdminWhatsapp: `https://wa.me/${cleanPhone}`,
    };
    onUpdateConfig(updated);
    onAddLog(
      "Configuration WhatsApp",
      `Mise à jour du support WhatsApp officiel (+${cleanPhone}).`,
      "success"
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
            <MessageCircle size={26} />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Support WhatsApp Super Admin & Centres
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Canal de communication direct entre les directeurs d'écoles et le Super Admin
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-bold font-mono">
            <Check size={14} />
            <span>Paramètres enregistrés</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: WhatsApp Form & Generator */}
        <form
          onSubmit={handleSaveConfig}
          className="lg:col-span-2 space-y-6 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm text-xs"
        >
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Numéro Officiel & Messages Types
            </h4>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Numéro International WhatsApp (sans +, ni espaces) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                  +
                </span>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="33612345678 ou 491512345678"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Exemple pour l'Allemagne : 491512345678 • France : 33612345678
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Message Pré-rempli par défaut (Français)
              </label>
              <textarea
                rows={2}
                value={defaultMessageFr}
                onChange={(e) => setDefaultMessageFr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Message Pré-rempli par défaut (Anglais)
              </label>
              <textarea
                rows={2}
                value={defaultMessageEn}
                onChange={(e) => setDefaultMessageEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Generated Direct URL Card */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Lien Direct WhatsApp Généré :
            </span>
            <div className="flex items-center gap-2 bg-white dark:bg-black/30 p-2.5 rounded-xl border border-emerald-500/20 font-mono text-[11px] break-all">
              <span className="flex-1 text-slate-700 dark:text-white/80">{generatedUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition cursor-pointer shrink-0"
                title="Copier le lien"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-md transition min-h-[42px] cursor-pointer"
            >
              <Save size={16} />
              <span>Sauvegarder les Paramètres WhatsApp</span>
            </button>
          </div>
        </form>

        {/* Right 1 col: Live Simulator Card */}
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Simulateur Bouton Flottant
            </h4>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Aperçu du déclencheur d'assistance affiché dans les consoles des écoles
            </p>

            <div className="relative h-48 rounded-2xl bg-slate-100 dark:bg-[#080B14] border border-slate-200 dark:border-white/10 flex flex-col justify-end p-4 overflow-hidden">
              <div className="text-[10px] text-slate-400 text-center mb-auto pt-2">
                Interface console de l'école (simulation)
              </div>

              {/* Floating WhatsApp Bubble */}
              <a
                href={generatedUrl}
                target="_blank"
                rel="noreferrer"
                className="self-end flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>{floatingButtonText}</span>
              </a>
            </div>

            <div className="pt-2">
              <a
                href={generatedUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition min-h-[40px]"
              >
                <ExternalLink size={14} />
                <span>Tester le lien WhatsApp en réel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
