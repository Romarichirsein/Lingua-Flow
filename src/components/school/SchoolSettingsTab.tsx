import React, { useState } from "react";
import { motion } from "motion/react";
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

export const SchoolSettingsTab: React.FC<SchoolSettingsTabProps> = ({
  locale,
  school,
  auditLogs = [],
  onUpdateSchool,
  onAddLog,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Sub-sections
  const [activeSection, setActiveSection] = useState<"branding" | "whatsapp" | "team" | "audit">("branding");

  // School General & Branding Form State
  const [formData, setFormData] = useState({
    name: school.name,
    logo: school.logo || "",
    primaryColor: school.primaryColor || "#6D5DFC",
    contactEmail: school.contactEmail || "",
    contactPhone: school.contactPhone || "",
    address: school.address || "",
    website: school.website || "",
    whatsappNumber: school.whatsappNumber || "",
    whatsappWelcomeTemplate:
      school.whatsappWelcomeTemplate ||
      `Bonjour {student_name} ! Bienvenue sur l'espace d'apprentissage de ${school.name}. Vos identifiants de connexion ont été activés.`,
  });

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
      whatsappNumber: formData.whatsappNumber.trim(),
      whatsappWelcomeTemplate: formData.whatsappWelcomeTemplate.trim(),
    };

    onUpdateSchool(updated);
    onAddLog(
      "Mise à jour des paramètres",
      `Paramètres et identité de l'école ${updated.name} mis à jour.`,
      "success"
    );
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
              {isEn ? "School Settings & Customization" : "Paramètres, Branding & Sécurité"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {school.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
            {isEn
              ? "Configure white-label branding, automated WhatsApp templates, collaborators and security audit logs."
              : "Personnalisez votre charte graphique en marque blanche, configurez WhatsApp et gérez vos accès pédagogiques."}
          </p>
        </div>

        {/* Section Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveSection("branding")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSection === "branding"
                ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette size={13} />
            <span>{isEn ? "Branding" : "Branding"}</span>
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
            <MessageSquare size={13} />
            <span>WhatsApp</span>
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

      {/* 1. BRANDING & IDENTITY */}
      {activeSection === "branding" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-4 p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette size={16} className="text-[#6D5DFC]" />
                <span>{isEn ? "White-label & Visual Identity" : "Identité Visuelle & Marque Blanche"}</span>
              </h3>

              {/* Language Lock Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-500 dark:text-amber-300">
                <Lock size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {isEn ? "Language is locked to:" : "Langue d'enseignement verrouillée :"}
                  </span>
                  <span>
                    {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"} (Attribuée exclusivement par le Super Admin Lingua Flow).
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "School Name *" : "Nom de l'École *"}
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
                    {isEn ? "Logo URL" : "URL du Logo"}
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    {isEn ? "Primary Brand Color" : "Couleur Primaire"}
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    {isEn ? "Contact Email" : "Email de Contact"}
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
                  {isEn ? "Website URL" : "Site Web Officiel"}
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://mon-ecole-langues.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <NeonButton variant="cyan" size="sm" type="submit" icon={<Save size={14} />}>
                  {isEn ? "Save Branding" : "Enregistrer les modifications"}
                </NeonButton>
              </div>
            </div>

            {/* Live Student Portal Preview Card */}
            <div className="space-y-4 p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye size={16} className="text-[#00D9FF]" />
                <span>{isEn ? "Student Portal Live Preview" : "Aperçu de la Marque Blanche"}</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4">
                {/* Student Header Live Preview */}
                <div
                  className="p-3.5 rounded-xl text-white flex items-center justify-between shadow-md"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <div className="flex items-center gap-2.5">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="w-6 h-6 rounded-md object-contain bg-white p-0.5"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center font-black text-xs">
                        {formData.name.slice(0, 1)}
                      </div>
                    )}
                    <span className="font-extrabold text-xs tracking-tight">
                      {formData.name}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm font-mono">
                    Espace Apprenant
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-white/50 leading-relaxed">
                  {isEn
                    ? "Your students will see this personalized header with your school's official color palette and custom logo."
                    : "Vos élèves verront ce bandeau personnalisé et votre logo lors de leur connexion sur leur espace dédié."}
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 2. WHATSAPP & AUTOMATIONS */}
      {activeSection === "whatsapp" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4 max-w-2xl">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500" />
              <span>{isEn ? "WhatsApp Automation & Direct Messaging" : "Configuration WhatsApp & Messages Automatisés"}</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Official WhatsApp Support Number *" : "Numéro WhatsApp Support de l'École *"}
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Automated Welcome Message Template" : "Modèle de Message de Bienvenue WhatsApp"}
              </label>
              <textarea
                rows={4}
                value={formData.whatsappWelcomeTemplate}
                onChange={(e) => setFormData({ ...formData, whatsappWelcomeTemplate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 dark:text-white/40 block mt-1">
                Variables disponibles : <code className="text-[#00D9FF]">{"{student_name}"}</code>, <code className="text-[#00D9FF]">{"{student_email}"}</code>
              </span>
            </div>

            <div className="pt-3 flex justify-end">
              <NeonButton variant="cyan" size="sm" type="submit" icon={<Save size={14} />}>
                {isEn ? "Save WhatsApp Config" : "Enregistrer la configuration"}
              </NeonButton>
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
