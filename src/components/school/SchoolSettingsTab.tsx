import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  School,
  AuditLog,
  UILocale,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  Settings,
  Shield,
  Palette,
  MessageSquare,
  Users,
  History,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Phone,
  Mail,
  Globe,
  Upload,
  UserPlus,
  Trash2,
  Eye,
  ExternalLink,
  ImageIcon,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Award,
} from "lucide-react";
import { NeonButton } from "../common/NeonButton";
import { Modal } from "../common/Modal";

interface SchoolSettingsTabProps {
  locale: UILocale;
  school: School;
  auditLogs?: AuditLog[];
  onUpdateSchool: (updatedSchool: School) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

// Pre-curated educational academy logos
const PRESET_LOGOS = [
  {
    name: "Académie Germanique",
    url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
    lang: "german",
  },
  {
    name: "Institut Linguistique Européen",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80",
    lang: "all",
  },
  {
    name: "Centro Studio Dante",
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80",
    lang: "italian",
  },
  {
    name: "Excellence Polyglotte",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80",
    lang: "all",
  },
];

export const SchoolSettingsTab: React.FC<SchoolSettingsTabProps> = ({
  locale,
  school,
  auditLogs = [],
  onUpdateSchool,
  onAddLog,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-sections
  const [activeSection, setActiveSection] = useState<"branding" | "whatsapp" | "team" | "audit">("branding");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // School General & Branding Form State
  const [formData, setFormData] = useState({
    name: school.name,
    logo: school.logo || "",
    primaryColor: school.primaryColor || "#6D5DFC",
    contactEmail: school.contactEmail || "",
    contactPhone: school.contactPhone || "",
    address: school.address || "",
    website: school.website || "",
    whatsappSupportUrl: school.whatsappSupportUrl || "https://chat.whatsapp.com/LinguaFlowPromo2025",
    whatsappNumber: school.whatsappNumber || "",
    whatsappWelcomeTemplate:
      school.whatsappWelcomeTemplate ||
      `Bonjour {student_name} ! Bienvenue sur l'espace d'apprentissage de ${school.name}. Vos identifiants de connexion ont été activés.`,
  });

  // Handle Logo File Upload (FileReader Base64)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(isEn ? "Image file is too large. Maximum size is 2MB." : "Le fichier est trop volumineux. Taille maximale : 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, logo: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Team collaborators (Local state for the school)
  const [teamMembers, setTeamMembers] = useState<
    { id: string; name: string; email: string; role: "teacher" | "coordinator" | "admin" }[]
  >([
    {
      id: "mem_1",
      name: school.contactPerson || "Directeur Pédagogique",
      email: school.contactEmail || "admin@ecole.com",
      role: "admin",
    },
    {
      id: "mem_2",
      name: school.language === "german" ? "Prof. Hans Schmidt" : "Prof. Marco Rossi",
      email: school.language === "german" ? "h.schmidt@ecole.com" : "m.rossi@ecole.com",
      role: "teacher",
    },
  ]);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "teacher" as "teacher" | "coordinator" | "admin",
  });

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: School = {
      ...school,
      name: formData.name.trim(),
      logo: formData.logo.trim(),
      primaryColor: formData.primaryColor,
      contactEmail: formData.contactEmail.trim(),
      contactPhone: formData.contactPhone.trim(),
      address: formData.address.trim(),
      website: formData.website.trim(),
      whatsappSupportUrl: formData.whatsappSupportUrl.trim(),
      whatsappNumber: formData.whatsappNumber.trim(),
      whatsappWelcomeTemplate: formData.whatsappWelcomeTemplate.trim(),
    };

    onUpdateSchool(updated);
    onAddLog(
      "Mise à jour des paramètres",
      `Paramètres, logo et configuration WhatsApp de l'école '${updated.name}' enregistrés et synchronisés.`,
      "success"
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    setTeamMembers([
      ...teamMembers,
      {
        id: `mem_${Date.now()}`,
        name: newMember.name.trim(),
        email: newMember.email.trim(),
        role: newMember.role,
      },
    ]);
    onAddLog(
      "Ajout de collaborateur",
      `Collaborateur ${newMember.name} (${newMember.role}) invité.`,
      "success"
    );
    setNewMember({ name: "", email: "", role: "teacher" });
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    onAddLog("Retrait de collaborateur", "Accès révoqué pour un membre de l'équipe.", "warning");
  };

  // Filter school logs
  const schoolLogs = auditLogs.filter(
    (log) => log.schoolId === school.id || log.targetId === school.id
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "School Configuration & Branding" : "Configuration de l'École, Logo & WhatsApp"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {isEn
              ? "Customize your white-label portal, upload your official logo, configure student WhatsApp groups, and manage team permissions."
              : "Personnalisez votre portail en marque blanche, configurez votre logo officiel, paramétrez le groupe WhatsApp des élèves et gérez les accès de votre équipe."}
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveSection("branding")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === "branding"
                ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette size={13} className="text-[#6D5DFC]" />
            <span>{isEn ? "Logo & Branding" : "Logo & Identité"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("whatsapp")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === "whatsapp"
                ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare size={13} className="text-emerald-500" />
            <span>{isEn ? "WhatsApp Group" : "Groupe WhatsApp"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("team")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === "team"
                ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users size={13} />
            <span>{isEn ? "Team" : "Équipe"} ({teamMembers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("audit")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === "audit"
                ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History size={13} />
            <span>{isEn ? "Audit Logs" : "Journal d'Audit"}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Notification */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold shadow-md"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>
                {isEn
                  ? "Changes successfully saved and synchronized across all student portals!"
                  : "Modifications enregistrées et synchronisées en direct sur les espaces élèves et l'administration !"}
              </span>
            </div>
            <span className="text-[10px] font-mono opacity-70">SYNCED</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. BRANDING & LOGO */}
      {activeSection === "branding" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Logo Upload & Customization Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#00D9FF]" />
                    <span>{isEn ? "Official School Logo" : "Logo Officiel de l'École"}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    PNG, JPG, SVG, WebP (Max 2 Mo)
                  </span>
                </div>

                {/* Logo Upload & Preview Interactive Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Current Logo Display */}
                  <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 min-h-[120px] text-center">
                    {formData.logo ? (
                      formData.logo.startsWith("http") || formData.logo.startsWith("data:") ? (
                        <img
                          src={formData.logo}
                          alt="Logo École"
                          className="max-h-20 max-w-full object-contain rounded-xl shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl">{formData.logo}</span>
                      )
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <ImageIcon size={32} className="opacity-40 mb-1" />
                        <span className="text-[10px]">{isEn ? "No logo uploaded" : "Aucun logo"}</span>
                      </div>
                    )}
                    {formData.logo && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: "" })}
                        className="mt-2 text-[10px] text-rose-500 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Trash2 size={10} />
                        <span>{isEn ? "Remove logo" : "Supprimer"}</span>
                      </button>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="sm:col-span-2 space-y-3">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] hover:opacity-90 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Upload size={14} />
                        <span>{isEn ? "Upload Logo Image" : "Téléverser une image"}</span>
                      </button>

                      <span className="text-xs text-slate-400">{isEn ? "or direct URL" : "ou URL directe"}</span>
                    </div>

                    {/* URL Input */}
                    <div>
                      <input
                        type="url"
                        value={formData.logo.startsWith("data:") ? "" : formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://mon-ecole.com/logo.png"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Educational Logos for instant setup */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-white/60 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>{isEn ? "Choose from pre-made academy emblems:" : "Exemples de badges et logos pré-définis :"}</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_LOGOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: preset.url })}
                        className={`p-2 rounded-xl border text-left text-[11px] font-medium transition flex items-center gap-2 cursor-pointer ${
                          formData.logo === preset.url
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-white/80"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-6 h-6 rounded-md object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* School Identity & Brand Color Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette size={16} className="text-[#6D5DFC]" />
                  <span>{isEn ? "School Identity & Visual Theme" : "Informations Générales & Thème Visuel"}</span>
                </h3>

                {/* Language Lock Alert */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-300">
                  <Lock size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      {isEn ? "Language is assigned & locked to:" : "Langue d'enseignement verrouillée :"}
                    </span>
                    <span>
                      {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"} (Configurée exclusivement par le Super Admin Lingua Flow).
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    {isEn ? "School Name *" : "Nom de l'École / Établissement *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                      {isEn ? "Primary Brand Color" : "Couleur Principale de l'École"}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                      {isEn ? "Website URL" : "Site Web Officiel"}
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://mon-ecole.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                      {isEn ? "Contact Email" : "Email Public / Secrétariat"}
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                      {isEn ? "Phone Number" : "Téléphone Public"}
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    {isEn ? "Campus Address" : "Adresse Physique de l'École"}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="12 Avenue des Langues, 75008 Paris"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <NeonButton variant="cyan" size="md" type="submit" icon={<Save size={16} />}>
                    {isEn ? "Save Visual Identity & Logo" : "Enregistrer l'Identité & le Logo"}
                  </NeonButton>
                </div>
              </div>
            </div>

            {/* Live Student Portal Preview Card */}
            <div className="space-y-6">
              {/* Preview Card 1: School Header */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye size={14} className="text-[#6D5DFC]" />
                  <span>{isEn ? "1. School Admin Header Preview" : "1. Aperçu En-tête Administration"}</span>
                </h4>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {formData.logo ? (
                        formData.logo.startsWith("http") || formData.logo.startsWith("data:") ? (
                          <img src={formData.logo} alt="Logo" className="w-8 h-8 object-contain rounded" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-xl">{formData.logo}</span>
                        )
                      ) : (
                        <span className="text-xl">{school.language === "german" ? "🇩🇪" : "🇮🇹"}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                        {formData.name || "Nom de l'École"}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        /ecole/{school.slug}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card 2: Student Portal Header */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye size={14} className="text-[#00D9FF]" />
                  <span>{isEn ? "2. Student Portal Header Preview" : "2. Aperçu Espace Élève"}</span>
                </h4>

                <div
                  className="p-3.5 rounded-2xl text-white shadow-md space-y-2 transition"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formData.logo ? (
                        formData.logo.startsWith("http") || formData.logo.startsWith("data:") ? (
                          <img src={formData.logo} alt="Logo" className="w-6 h-6 object-contain rounded bg-white p-0.5" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-sm">{formData.logo}</span>
                        )
                      ) : (
                        <span className="text-sm">{school.language === "german" ? "🇩🇪" : "🇮🇹"}</span>
                      )}
                      <span className="font-extrabold text-xs tracking-tight">
                        {formData.name || "Nom de l'École"}
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm font-mono">
                      Élève Connecté
                    </span>
                  </div>
                  <p className="text-[10px] text-white/80">
                    Vos élèves apprennent sous les couleurs exclusives et le logo de votre école.
                  </p>
                </div>
              </div>

              {/* Preview Card 3: Certificate Preview */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Award size={14} className="text-amber-500" />
                  <span>{isEn ? "3. Official Certificate Header" : "3. Sur l'Attestation Officielle"}</span>
                </h4>

                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-1.5">
                  {formData.logo && (formData.logo.startsWith("http") || formData.logo.startsWith("data:")) ? (
                    <img src={formData.logo} alt="Logo" className="h-8 mx-auto object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-2xl block">{formData.logo || "🎓"}</span>
                  )}
                  <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                    ATTESTATION OFFICIELLE CECRL
                  </p>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                    Délivrée par {formData.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 2. WHATSAPP & AUTOMATIONS */}
      {activeSection === "whatsapp" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main WhatsApp form */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-emerald-500" />
                  <span>{isEn ? "WhatsApp Promo Community & Support Setup" : "Configuration du Groupe WhatsApp des Élèves"}</span>
                </h3>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {isEn ? "Live Student Sync" : "Synchronisation en Direct"}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? "Configure your school's official WhatsApp community link. This link is automatically wired to the floating WhatsApp widget and banner on every student dashboard belonging to your school."
                  : "Renseignez ici le lien de votre groupe WhatsApp de promotion ou d'entraide. Ce lien sera automatiquement lié au bouton flottant WhatsApp et au bandeau de communauté dans l'espace de tous vos élèves."}
              </p>

              {/* Primary: School Students WhatsApp Group Link */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border-2 border-emerald-500/30 space-y-3">
                <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-emerald-500" />
                    <span>{isEn ? "School Students WhatsApp Group Link *" : "Lien d'Invitation du Groupe WhatsApp Élèves *"}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    {isEn ? "Auto-synced to student portal" : "Relié au bouton flottant de vos élèves"}
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="url"
                    required
                    value={formData.whatsappSupportUrl}
                    onChange={(e) => setFormData({ ...formData, whatsappSupportUrl: e.target.value })}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {formData.whatsappSupportUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(formData.whatsappSupportUrl, "_blank", "noopener,noreferrer")}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      <span>{isEn ? "Test Link" : "Tester le lien"}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>
                    Exemple : <code className="font-mono text-emerald-600 dark:text-emerald-400">https://chat.whatsapp.com/ABC123XYZ</code> ou <code className="font-mono text-emerald-600 dark:text-emerald-400">https://wa.me/33612345678</code>
                  </span>
                </div>
              </div>

              {/* School 1-on-1 Direct Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Direct School Administration WhatsApp / Phone Number *" : "Numéro WhatsApp / Téléphone de Contact Direct de l'École *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              {/* Canned Welcome Message Template */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Automated Welcome WhatsApp Template" : "Modèle de Message de Bienvenue WhatsApp Automatisé"}
                </label>
                <textarea
                  rows={3}
                  value={formData.whatsappWelcomeTemplate}
                  onChange={(e) => setFormData({ ...formData, whatsappWelcomeTemplate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 dark:text-white/40 block mt-1">
                  Balises disponibles : <code className="text-[#00D9FF]">{"{student_name}"}</code>, <code className="text-[#00D9FF]">{"{whatsapp_group_link}"}</code>
                </span>
              </div>

              {/* Reminder on Super Admin Help button */}
              <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <HelpCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {isEn
                    ? "In your School Dashboard, the floating WhatsApp widget connects you directly with the Super Admin technical support."
                    : "Dans votre tableau de bord École, le bouton flottant WhatsApp vous met directement en relation avec le support technique du Super Admin."}
                </p>
              </div>

              <div className="pt-3 flex justify-end">
                <NeonButton variant="emerald" size="md" type="submit" icon={<Save size={16} />}>
                  {isEn ? "Save WhatsApp Group Link" : "Enregistrer le Groupe WhatsApp"}
                </NeonButton>
              </div>
            </div>

            {/* Right column: Explanatory & Architecture card */}
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <MessageCircle size={14} className="text-emerald-500" />
                  <span>{isEn ? "How it works for your students" : "Fonctionnement pour vos Élèves"}</span>
                </h4>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>Bouton Flottant Élève</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Un bouton WhatsApp flottant en bas à droite de leur écran ouvre instantanément l'invitation à votre groupe de promo.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>En-tête & Tableau de Bord</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Le bouton vert "Groupe WhatsApp Promo" dans l'en-tête de leur portail redirige également vers ce lien.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">3</span>
                      <span>Synchronisation Immédiate</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Chaque modification enregistrée s'applique instantanément à tous les comptes élèves de votre école sans rechargement nécessaire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 3. TEAM COLLABORATORS */}
      {activeSection === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-[#6D5DFC]" />
              <span>{isEn ? "School Teachers & Coordinators" : "Professeurs & Équipe Pédagogique"}</span>
            </h3>

            <NeonButton
              variant="cyan"
              size="sm"
              onClick={() => setIsAddMemberOpen(true)}
              icon={<UserPlus size={14} />}
            >
              {isEn ? "Invite Member" : "Inviter un Collaborateur"}
            </NeonButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{member.email}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC]">
                    {member.role === "admin" ? "Directeur" : member.role === "teacher" ? "Professeur" : "Coordinateur"}
                  </span>
                </div>

                {member.role !== "admin" && (
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      {isEn ? "Revoke Access" : "Révoquer"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AUDIT LOGS */}
      {activeSection === "audit" && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History size={16} className="text-[#00D9FF]" />
            <span>{isEn ? "Security & Administrative Audit Logs" : "Journal d'Audit & Historique des Actions"}</span>
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {schoolLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {isEn ? "No audit events recorded yet." : "Aucun événement enregistré."}
              </div>
            ) : (
              schoolLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">
                      {log.action}
                    </span>
                    <span className="text-slate-500 dark:text-white/60">
                      {log.details}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString(locale === "en" ? "en-US" : "fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: Invite Team Member */}
      <Modal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        title={isEn ? "Invite Collaborator" : "Inviter un Collaborateur"}
        size="md"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Full Name *" : "Nom Complet *"}
            </label>
            <input
              type="text"
              required
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Email Address *" : "Adresse Email *"}
            </label>
            <input
              type="email"
              required
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Role & Permissions" : "Rôle & Permissions"}
            </label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold"
            >
              <option value="teacher">Professeur (Gestion des cours & quiz)</option>
              <option value="coordinator">Coordinateur (Suivi des élèves & inscriptions)</option>
              <option value="admin">Directeur (Tous les droits école)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" type="button" onClick={() => setIsAddMemberOpen(false)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Send Invite" : "Envoyer l'invitation"}
            </NeonButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
