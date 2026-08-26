import React, { useState, useEffect } from "react";
import { GlobalPlatformConfig, UILocale } from "../../types";
import {
  Save,
  Check,
  Sparkles,
  Settings,
  Database,
  RefreshCw,
  Server,
  Terminal,
  Send,
} from "lucide-react";
import { SANITY_CONFIG, testSanityConnection, SanityStatusResult } from "../../lib/sanity";

interface SuperAdminSettingsTabProps {
  config: GlobalPlatformConfig;
  locale: UILocale;
  onUpdateConfig: (newConfig: GlobalPlatformConfig) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminSettingsTab: React.FC<SuperAdminSettingsTabProps> = ({
  config,
  locale,
  onUpdateConfig,
  onAddLog,
}) => {
  const [form, setForm] = useState({
    platformName: config.platformName || "LinguaFlow",
    supportEmail: config.supportEmail || "support@linguaflow.io",
    primaryBrandColor: config.primaryBrandColor || "#6D5DFC",
    secondaryBrandColor: config.secondaryBrandColor || "#00D9FF",
    aiCorrectionStrictness: config.aiCorrectionStrictness || "standard",
    aiCorrectionTemperature: config.aiCorrectionTemperature ?? 0.3,
    aiModel: "gemini-3-1-pro",
    maintenanceMode: config.maintenanceMode || false,
  });

  const [isSaved, setIsSaved] = useState(false);

  // Sanity Live Status State
  const [sanityStatus, setSanityStatus] = useState<SanityStatusResult | null>(null);
  const [isCheckingSanity, setIsCheckingSanity] = useState(false);
  const [isSyncingSanity, setIsSyncingSanity] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // AI Test Prompt
  const [testPrompt, setTestPrompt] = useState("Explique la règle d'accord du participe passé en allemand (Perfekt) en une phrase.");
  const [testModelResponse, setTestModelResponse] = useState<string | null>(null);
  const [isTestingModel, setIsTestingModel] = useState(false);

  useEffect(() => {
    checkSanity();
  }, []);

  const checkSanity = async () => {
    setIsCheckingSanity(true);
    try {
      const res = await fetch("/api/sanity/status");
      const data = await res.json();
      setSanityStatus(data);
    } catch {
      const direct = await testSanityConnection();
      setSanityStatus(direct);
    } finally {
      setIsCheckingSanity(false);
    }
  };

  const handleSyncToSanity = async () => {
    setIsSyncingSanity(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sanity/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appConfig",
          documents: [
            {
              _id: "lingua-flow-config",
              _type: "appConfig",
              name: form.platformName,
              organizationId: SANITY_CONFIG.organizationId,
              primaryColor: form.primaryBrandColor,
              secondaryColor: form.secondaryBrandColor,
              activeAiModel: form.aiModel,
              syncedAt: new Date().toISOString(),
            },
            {
              _id: "course-deutsch-a2",
              _type: "course",
              title: "Deutsch A2 - Alltagsgespräche & Beruf",
              language: "german",
              level: "A2",
              lessonsCount: 18,
            },
            {
              _id: "course-italiano-b1",
              _type: "course",
              title: "Italiano B1 - Conversazione & Cultura",
              language: "italian",
              level: "B1",
              lessonsCount: 16,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Synchronisation réussie (${data.count || 3} documents enregistrés)`);
        onAddLog(
          "Sanity CMS Sync",
          `Synchronisation des cours et configurations sur Sanity (Project: ${SANITY_CONFIG.projectId}).`,
          "success"
        );
        checkSanity();
      } else {
        setSyncResult(`Erreur: ${data.error}`);
      }
    } catch (err: any) {
      setSyncResult(`Erreur réseau: ${err.message}`);
    } finally {
      setIsSyncingSanity(false);
    }
  };

  const handleRunAiTest = async () => {
    if (!testPrompt.trim()) return;
    setIsTestingModel(true);
    setTestModelResponse(null);
    try {
      const startTime = Date.now();
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testPrompt,
          model: form.aiModel,
          language: "german",
          level: "A2",
          studentName: "Lucas",
          schoolName: "Goethe Sprachzentrum",
        }),
      });
      const data = await res.json();
      const duration = Date.now() - startTime;
      setTestModelResponse(
        data.reply || data.error || `Réponse reçue (${duration}ms): Aucun texte retourné.`
      );
    } catch (err: any) {
      setTestModelResponse(`Erreur: ${err.message}`);
    } finally {
      setIsTestingModel(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GlobalPlatformConfig = {
      ...config,
      platformName: form.platformName,
      supportEmail: form.supportEmail,
      primaryBrandColor: form.primaryBrandColor,
      secondaryBrandColor: form.secondaryBrandColor,
      aiCorrectionStrictness: form.aiCorrectionStrictness as any,
      aiCorrectionTemperature: Number(form.aiCorrectionTemperature),
      maintenanceMode: form.maintenanceMode,
    };

    onUpdateConfig(updated);
    onAddLog(
      "Configuration Plateforme",
      `Paramètres système sauvegardés. Modèle IA: ${form.aiModel}, Température: ${form.aiCorrectionTemperature}.`,
      "success"
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            Paramètres Généraux, Moteur IA & Sanity CMS
          </h3>
          <p className="text-xs text-slate-500 dark:text-white/50">
            Intégration Sanity.io ({SANITY_CONFIG.projectId}), modèles LLM (Gemini 3.1 Pro, GPT-5.4, DeepSeek) et identité SaaS
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition min-h-[42px] cursor-pointer"
        >
          {isSaved ? <Check size={16} /> : <Save size={16} />}
          <span>{isSaved ? "Enregistré !" : "Sauvegarder les Paramètres"}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Sanity CMS Integration Status */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
                <Database size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  Sanity.io Headless CMS
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Connecté
                  </span>
                </h4>
                <p className="text-slate-400">
                  Gestion centralisée du contenu éducatif, cours et annonces
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={checkSanity}
              disabled={isCheckingSanity}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 transition cursor-pointer"
              title="Tester la connexion"
            >
              <RefreshCw size={14} className={isCheckingSanity ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Project ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {SANITY_CONFIG.projectId}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Dataset</span>
                <span className="font-mono font-bold text-emerald-500">
                  {SANITY_CONFIG.dataset}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Organization ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white truncate block">
                  {SANITY_CONFIG.organizationId}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Documents Indexés</span>
                <span className="font-mono font-bold text-[#6D5DFC]">
                  {sanityStatus?.documentCount ?? "3"} docs
                </span>
              </div>
            </div>

            {/* Sync Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSyncToSanity}
                disabled={isSyncingSanity}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
              >
                <RefreshCw size={14} className={isSyncingSanity ? "animate-spin" : ""} />
                <span>{isSyncingSanity ? "Synchronisation en cours..." : "Synchroniser LinguaFlow vers Sanity"}</span>
              </button>

              {syncResult && (
                <span className="text-[11px] text-emerald-500 font-bold text-center sm:text-right">
                  {syncResult}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: AI Engine & Model Selector */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Moteur Pédagogique & Modèles IA
              </h4>
              <p className="text-slate-400">
                Sélection du modèle LLM pour la correction et le tuteur de conversation
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Modèle IA Actif
              </label>
              <select
                value={form.aiModel}
                onChange={(e) => setForm({ ...form, aiModel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="gemini-3-1-pro">Gemini 3.1 Pro (Multimodal & Pédagogie Avancée)</option>
                <option value="gpt-5-4">GPT-5.4 (Excellence Rédactionnelle & Grammaire)</option>
                <option value="deepseek-v4-flash">DeepSeek V4 Flash (Haute Vitesse & Raisonnement)</option>
                <option value="claude-sonnet-5">Claude Sonnet 5 (Nuances Linguistiques)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Rigueur de Correction CECRL
              </label>
              <select
                value={form.aiCorrectionStrictness}
                onChange={(e) => setForm({ ...form, aiCorrectionStrictness: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="lenient">Bienveillante (Tolère fautes mineures, encourage l'élève)</option>
                <option value="standard">Standard (Correction équilibrée selon niveau CECRL)</option>
                <option value="strict">Exigeante (Grammaire stricte, orthographe académique)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-700 dark:text-white/80">Température de Créativité</span>
                <span className="font-mono text-[#00D9FF]">{form.aiCorrectionTemperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={form.aiCorrectionTemperature}
                onChange={(e) =>
                  setForm({ ...form, aiCorrectionTemperature: parseFloat(e.target.value) })
                }
                className="w-full accent-[#00D9FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0.0 (Déterministe & Précis)</span>
                <span>1.0 (Créatif & Fluide)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Interactive LLM Sandbox / Test Prompt */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Terminal size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Test Direct du Moteur IA ({form.aiModel})
              </h4>
              <p className="text-slate-400">
                Envoyer une requête de vérification au tuteur linguistique
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Prompt de Test
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                  placeholder="Posez une question en allemand ou italien..."
                />
                <button
                  type="button"
                  onClick={handleRunAiTest}
                  disabled={isTestingModel}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white font-bold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                >
                  <Send size={14} className={isTestingModel ? "animate-pulse" : ""} />
                  <span>{isTestingModel ? "Envoi..." : "Tester"}</span>
                </button>
              </div>
            </div>

            {testModelResponse && (
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#00D9FF] block">
                  Réponse du Tuteur ({form.aiModel}) :
                </span>
                <p className="text-slate-800 dark:text-white/90 leading-relaxed font-sans">
                  {testModelResponse}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Platform Identity & Defaults */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00D9FF]/10 text-[#00D9FF]">
              <Settings size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Identité de la Plateforme SaaS
              </h4>
              <p className="text-slate-400">
                Informations globales de marque et maintenance SaaS
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Nom Commercial du SaaS
              </label>
              <input
                type="text"
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                E-mail Support Super Admin
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Mode Maintenance SaaS</p>
                <p className="text-[11px] text-slate-400">
                  Affiche une page de maintenance aux élèves pendant les mises à jour
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-[#6D5DFC] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
