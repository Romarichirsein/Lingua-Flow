import React, { useState } from "react";
import { Announcement, School, UILocale } from "../../types";
import { Modal } from "../common/Modal";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Globe,
  Users,
  Building2,
} from "lucide-react";

interface SuperAdminAnnouncementsTabProps {
  announcements: Announcement[];
  schools: School[];
  locale: UILocale;
  onUpdateAnnouncements: (announcements: Announcement[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminAnnouncementsTab: React.FC<SuperAdminAnnouncementsTabProps> = ({
  announcements,
  schools,
  locale,
  onUpdateAnnouncements,
  onAddLog,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [previewAnnouncement, setPreviewAnnouncement] = useState<Announcement | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<"fr" | "en">("fr");

  const [form, setForm] = useState({
    title: "",
    titleEn: "",
    content: "",
    contentEn: "",
    target: "all" as "all" | "schools" | "students" | "specific_school",
    specificSchoolId: "",
    priority: "info" as "info" | "warning" | "urgent",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "2027-08-25",
  });

  const handleOpenCreate = () => {
    setForm({
      title: "",
      titleEn: "",
      content: "",
      contentEn: "",
      target: "all",
      specificSchoolId: schools[0]?.id || "",
      priority: "info",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2027-08-25",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setForm({
      title: ann.title,
      titleEn: ann.titleEn || "",
      content: ann.content,
      contentEn: ann.contentEn || "",
      target: ann.target,
      specificSchoolId: ann.targetSchoolId || "",
      priority: ann.priority === "success" ? "info" : ann.priority,
      startDate: ann.createdAt || new Date().toISOString().split("T")[0],
      endDate: "2027-08-25",
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnouncement) {
      const updated = announcements.map((a) =>
        a.id === editingAnnouncement.id
          ? {
              ...a,
              title: form.title,
              titleEn: form.titleEn,
              content: form.content,
              contentEn: form.contentEn,
              target: form.target,
              targetSchoolId: form.specificSchoolId,
              priority: form.priority,
            }
          : a
      );
      onUpdateAnnouncements(updated);
      onAddLog("Modification Annonce", `Annonce '${form.title}' mise à jour.`, "success");
      setEditingAnnouncement(null);
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: form.title,
        titleEn: form.titleEn,
        content: form.content,
        contentEn: form.contentEn,
        target: form.target,
        targetSchoolId: form.specificSchoolId,
        priority: form.priority,
        createdAt: form.startDate,
        authorName: "Super Admin",
        isActive: true,
      };
      onUpdateAnnouncements([newAnn, ...announcements]);
      onAddLog("Création Annonce", `Diffusion de l'annonce '${form.title}' (${form.target}).`, "success");
      setIsCreateOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    onUpdateAnnouncements(updated);
    onAddLog("Suppression Annonce", "Suppression d'une annonce globale.", "warning");
  };

  const handleToggleActive = (ann: Announcement) => {
    const updated = announcements.map((a) =>
      a.id === ann.id ? { ...a, isActive: !a.isActive } : a
    );
    onUpdateAnnouncements(updated);
    onAddLog(
      "Statut Annonce",
      `Annonce '${ann.title}' ${!ann.isActive ? "activée" : "désactivée"}.`,
      "success"
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            Annonces Globales & Communication
          </h3>
          <p className="text-xs text-slate-500 dark:text-white/50">
            Diffusions bilingues ciblées pour les écoles partenaires et apprenants
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition min-h-[42px] cursor-pointer"
        >
          <Plus size={16} />
          <span>Nouvelle Annonce</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
            Aucune annonce n'a été créée pour le moment.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border shadow-sm space-y-3 transition ${
                ann.priority === "urgent"
                  ? "border-rose-500/40"
                  : ann.priority === "warning"
                  ? "border-amber-500/40"
                  : "border-slate-200 dark:border-white/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ann.priority === "urgent"
                        ? "bg-rose-500/15 text-rose-500"
                        : ann.priority === "warning"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-[#6D5DFC]/15 text-[#6D5DFC]"
                    }`}
                  >
                    {ann.priority}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    Cible :{" "}
                    <strong className="text-slate-700 dark:text-white">
                      {ann.target === "all"
                        ? "Toutes les écoles & élèves"
                        : ann.target === "schools"
                        ? "Écoles uniquement"
                        : ann.target === "students"
                        ? "Élèves uniquement"
                        : "École spécifique"}
                    </strong>
                  </span>

                  <span className="text-xs text-slate-400">• {ann.createdAt}</span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setPreviewAnnouncement(ann)}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#00D9FF] hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                    title="Aperçu du rendu utilisateur"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ann)}
                    className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-[#6D5DFC] transition cursor-pointer"
                    title="Modifier l'annonce"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(ann)}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      ann.isActive
                        ? "text-[#20E3A2] hover:bg-[#20E3A2]/10"
                        : "text-slate-400 hover:bg-slate-100"
                    }`}
                    title={ann.isActive ? "Désactiver la diffusion" : "Activer la diffusion"}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                    title="Supprimer l'annonce"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {ann.title}
                </h4>
                {ann.titleEn && (
                  <p className="text-xs text-slate-400 italic">EN: {ann.titleEn}</p>
                )}
                <p className="text-xs text-slate-600 dark:text-white/70 mt-1">{ann.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateOpen || !!editingAnnouncement}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingAnnouncement(null);
        }}
        title={editingAnnouncement ? "Modifier l'Annonce" : "Nouvelle Annonce Globale"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Titre en Français *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ex: Maintenance planifiée"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Titre en Anglais (Optionnel)
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="ex: Scheduled maintenance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Audience Cible *
              </label>
              <select
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="all">Toutes les écoles & élèves</option>
                <option value="schools">Écoles & Directeurs uniquement</option>
                <option value="students">Élèves uniquement</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Niveau de Priorité *
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="info">Information (Bleu/Violet)</option>
                <option value="warning">Avertissement (Orange)</option>
                <option value="urgent">Urgent / Alerte (Rouge)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
              Contenu du Message en Français *
            </label>
            <textarea
              required
              rows={3}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Saisissez votre annonce détaillée..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
              Contenu du Message en Anglais (Optionnel)
            </label>
            <textarea
              rows={3}
              value={form.contentEn}
              onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
              placeholder="English translation..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingAnnouncement(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold min-h-[42px] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white font-bold shadow-md hover:opacity-95 min-h-[42px] cursor-pointer"
            >
              {editingAnnouncement ? "Sauvegarder" : "Publier l'Annonce"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Live Preview Modal */}
      <Modal
        isOpen={!!previewAnnouncement}
        onClose={() => setPreviewAnnouncement(null)}
        title="Simulateur d'Aperçu Utilisateur"
        maxWidth="max-w-md"
      >
        {previewAnnouncement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">Langue du rendu :</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewLanguage("fr")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    previewLanguage === "fr" ? "bg-[#6D5DFC] text-white" : "text-slate-600"
                  }`}
                >
                  Français 🇫🇷
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLanguage("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    previewLanguage === "en" ? "bg-[#6D5DFC] text-white" : "text-slate-600"
                  }`}
                >
                  English 🇬🇧
                </button>
              </div>
            </div>

            {/* Simulated Banner */}
            <div
              className={`p-4 rounded-2xl border ${
                previewAnnouncement.priority === "urgent"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                  : previewAnnouncement.priority === "warning"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "bg-[#6D5DFC]/10 border-[#6D5DFC]/30 text-[#6D5DFC]"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <Megaphone size={16} />
                <span>
                  {previewLanguage === "en" && previewAnnouncement.titleEn
                    ? previewAnnouncement.titleEn
                    : previewAnnouncement.title}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-white/80">
                {previewLanguage === "en" && previewAnnouncement.contentEn
                  ? previewAnnouncement.contentEn
                  : previewAnnouncement.content}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
