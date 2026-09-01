import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Program,
  School,
  Student,
  UILocale,
  CEFRLevel,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Layers,
  Video,
  Users,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { NeonButton } from "../common/NeonButton";
import { Modal } from "../common/Modal";

interface SchoolProgramsTabProps {
  locale: UILocale;
  school: School;
  programs: Program[];
  students: Student[];
  onUpdatePrograms: (programs: Program[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
  onOpenCourseBuilder: (programId: string) => void;
}

export const SchoolProgramsTab: React.FC<SchoolProgramsTabProps> = ({
  locale,
  school,
  programs,
  students,
  onUpdatePrograms,
  onAddLog,
  onOpenCourseBuilder,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter school's programs
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);
  const schoolStudents = students.filter((s) => s.schoolId === school.id);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    level: "A1" as CEFRLevel,
    description: "",
    thumbnail: "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=600&auto=format&fit=crop&q=80",
    startDate: "2026-08-01",
    endDate: "2026-11-30",
    isPublished: true,
  });

  const filteredPrograms = schoolPrograms.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === "all" || p.level === levelFilter;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && p.isPublished) ||
      (statusFilter === "draft" && !p.isPublished);
    return matchSearch && matchLevel && matchStatus;
  });

  // Create Program Handler
  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newProgram: Program = {
      id: `prog_${school.slug}_${Date.now()}`,
      schoolId: school.id,
      language: school.language, // Strictly locked to school's authorized language
      title: formData.title.trim(),
      level: formData.level,
      description: formData.description.trim() || `Programme officiel de langue ${school.language === "german" ? "Allemand" : "Italien"} - Niveau ${formData.level}.`,
      thumbnail: formData.thumbnail,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isPublished: formData.isPublished,
      status: formData.isPublished ? "published" : "draft",
      modules: [
        {
          id: `mod_init_${Date.now()}`,
          programId: `prog_${school.slug}_${Date.now()}`,
          title: "Module 1 : Fondations & Notions Essentielles",
          order: 1,
          description: "Introduction aux bases grammaticales et lexicales du niveau.",
          lessons: [
            {
              id: `les_init_${Date.now()}`,
              moduleId: `mod_init_${Date.now()}`,
              title: "Leçon 1 : Salutations & Présentation",
              order: 1,
              durationMinutes: 15,
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              summary: "Apprenez les formules usuelles de salutation et l'intonation correcte.",
              theoryContent: "### Notions Clés\nLes salutations varient selon le moment de la journée.",
              vocabulary: [
                { id: "v1", term: school.language === "german" ? "Guten Tag" : "Buongiorno", translation: "Bonjour", exampleSentence: school.language === "german" ? "Guten Tag, wie geht es Ihnen?" : "Buongiorno, come sta?" },
              ],
              quiz: [
                {
                  id: "q1",
                  question: school.language === "german" ? "Que signifie 'Guten Morgen' ?" : "Que signifie 'Buongiorno' ?",
                  options: ["Bonjour (matin)", "Bonsoir", "Au revoir", "Merci"],
                  correctIndex: 0,
                  explanation: "C'est la salutation standard matinale.",
                }
              ],
              passingScorePercent: 80,
              isUnlocked: true,
            }
          ]
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onUpdatePrograms([newProgram, ...programs]);
    onAddLog(
      "Création de programme",
      `Nouveau programme ${newProgram.title} (${newProgram.level} - ${school.language}) créé.`,
      "success"
    );
    setIsCreateModalOpen(false);
  };

  // Edit Program Handler
  const handleEditProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    const updated = programs.map((p) => {
      if (p.id === editingProgram.id) {
        return {
          ...p,
          title: formData.title.trim(),
          level: formData.level,
          description: formData.description.trim(),
          thumbnail: formData.thumbnail,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isPublished: formData.isPublished,
          status: formData.isPublished ? ("published" as const) : ("draft" as const),
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    onUpdatePrograms(updated);
    onAddLog(
      "Modification de programme",
      `Programme ${formData.title} mis à jour.`,
      "success"
    );
    setEditingProgram(null);
  };

  // Duplicate Program Handler
  const handleDuplicateProgram = (programToClone: Program) => {
    const cloneId = `prog_${school.slug}_copy_${Date.now()}`;
    const clonedProgram: Program = {
      ...programToClone,
      id: cloneId,
      title: `${programToClone.title} (Copie)`,
      isPublished: false,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modules: (programToClone.modules || []).map((m, mIdx) => ({
        ...m,
        id: `mod_${cloneId}_${mIdx}_${Date.now()}`,
        programId: cloneId,
        lessons: (m.lessons || []).map((l, lIdx) => ({
          ...l,
          id: `les_${cloneId}_${mIdx}_${lIdx}_${Date.now()}`,
          moduleId: `mod_${cloneId}_${mIdx}_${Date.now()}`,
        })),
      })),
    };

    onUpdatePrograms([clonedProgram, ...programs]);
    onAddLog(
      "Duplication de programme",
      `Programme dupliqué avec succès sous le titre : ${clonedProgram.title}.`,
      "success"
    );
  };

  // Toggle Publish Status
  const handleTogglePublish = (p: Program) => {
    const nextPublished = !p.isPublished;
    const updated = programs.map((item) =>
      item.id === p.id
        ? {
            ...item,
            isPublished: nextPublished,
            status: nextPublished ? ("published" as const) : ("draft" as const),
          }
        : item
    );
    onUpdatePrograms(updated);
    onAddLog(
      "Statut de publication",
      `Programme ${p.title} passé en ${nextPublished ? "PUBLIÉ" : "BROUILLON"}.`,
      "success"
    );
  };

  // Delete Program Handler
  const handleDeleteProgram = () => {
    if (!deletingProgram) return;
    const updated = programs.filter((p) => p.id !== deletingProgram.id);
    onUpdatePrograms(updated);
    onAddLog(
      "Suppression de programme",
      `Programme ${deletingProgram.title} supprimé.`,
      "warning"
    );
    setDeletingProgram(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Curriculum & Programs" : "Programmes Pédagogiques & Filières"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {schoolPrograms.length} {isEn ? "curricula" : "programmes"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
            {isEn
              ? `Authorized Language: ${school.language === "german" ? "German 🇩🇪" : "Italian 🇮🇹"}. Structure modules, video lessons and quizzes.`
              : `Langue autorisée : ${school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}. Structurez vos modules, capsules vidéo et quiz.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NeonButton
            variant="cyan"
            size="md"
            onClick={() => {
              setFormData({
                title: "",
                level: "A1",
                description: "",
                thumbnail:
                  school.language === "german"
                    ? "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=600&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop&q=80",
                startDate: "2026-08-01",
                endDate: "2026-11-30",
                isPublished: true,
              });
              setIsCreateModalOpen(true);
            }}
            icon={<Plus size={16} />}
          >
            {isEn ? "Create Program" : "Créer un Programme"}
          </NeonButton>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEn ? "Search programs..." : "Rechercher un programme..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white font-medium"
          >
            <option value="all">{isEn ? "All Levels" : "Tous les Niveaux"}</option>
            <option value="A1">Niveau A1</option>
            <option value="A2">Niveau A2</option>
            <option value="B1">Niveau B1</option>
            <option value="B2">Niveau B2</option>
            <option value="C1">Niveau C1</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white font-medium"
          >
            <option value="all">{isEn ? "All Statuses" : "Tous les Statuts"}</option>
            <option value="published">{isEn ? "Published" : "Publié"}</option>
            <option value="draft">{isEn ? "Draft" : "Brouillon"}</option>
          </select>
        </div>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-white/50 text-xs bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10">
            <BookOpen size={28} className="mx-auto mb-2 opacity-50 text-[#00D9FF]" />
            <p className="font-bold text-slate-700 dark:text-white/80">
              {isEn ? "No programs found." : "Aucun programme trouvé."}
            </p>
            <p className="text-[11px] mt-1 text-slate-400 dark:text-white/40">
              {isEn ? "Click 'Create Program' to build a new syllabus." : "Cliquez sur 'Créer un Programme' pour configurer un nouveau cursus."}
            </p>
          </div>
        ) : (
          filteredPrograms.map((program) => {
            const enrolled = schoolStudents.filter((s) => s.enrolledProgramId === program.id);
            let totalLessons = 0;
            (program.modules || []).forEach((m) => {
              totalLessons += (m.lessons || []).length;
            });

            return (
              <motion.div
                key={program.id}
                layout
                className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#6D5DFC]/40 transition-all"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                    <img
                      src={program.thumbnail}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-black border border-white/20">
                        {program.level}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-[#6D5DFC]/80 backdrop-blur-md text-white text-[11px] font-bold">
                        {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(program)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md transition flex items-center gap-1 cursor-pointer ${
                          program.isPublished
                            ? "bg-[#20E3A2]/20 text-[#20E3A2] border border-[#20E3A2]/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {program.isPublished ? (
                          <>
                            <Eye size={12} /> {isEn ? "Published" : "Publié"}
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> {isEn ? "Draft" : "Brouillon"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#00D9FF] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/60 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Counters */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                        <span className="text-[10px] text-slate-400 dark:text-white/40 block">Modules</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">
                          {(program.modules || []).length}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                        <span className="text-[10px] text-slate-400 dark:text-white/40 block">Leçons</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">
                          {totalLessons}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                        <span className="text-[10px] text-slate-400 dark:text-white/40 block">Élèves</span>
                        <span className="text-xs font-bold text-[#00D9FF] font-mono">
                          {enrolled.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-white/5 mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          title: program.title,
                          level: program.level,
                          description: program.description,
                          thumbnail: program.thumbnail,
                          startDate: program.startDate,
                          endDate: program.endDate,
                          isPublished: program.isPublished,
                        });
                        setEditingProgram(program);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                      title="Modifier les détails"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicateProgram(program)}
                      className="p-2 rounded-xl text-slate-400 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition"
                      title="Dupliquer le programme"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingProgram(program)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Supprimer le programme"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCourseBuilder(program.id)}
                    className="px-3 py-2 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isEn ? "Course Builder" : "Gérer les Cours"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* MODAL: Create Program */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={isEn ? "Create New Curriculum" : "Créer un Nouveau Programme"}
        size="lg"
      >
        <form onSubmit={handleCreateProgram} className="space-y-4">
          <div className="p-3 rounded-2xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 text-xs text-slate-700 dark:text-white/80 flex items-center justify-between">
            <span>Langue d'enseignement :</span>
            <span className="font-bold text-[#6D5DFC] dark:text-[#a399ff]">
              {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"} (Héritée de l'école)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Program Title *" : "Titre du Programme *"}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={school.language === "german" ? "Ex: Allemand Professionnel - Niveau B1" : "Ex: Corso di Italiano Generale - Livello A2"}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "CEFR Level" : "Niveau CECRL"}
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold"
              >
                <option value="A1">A1 - Débutant</option>
                <option value="A2">A2 - Élémentaire</option>
                <option value="B1">B1 - Intermédiaire</option>
                <option value="B2">B2 - Intermédiaire Avancé</option>
                <option value="C1">C1 - Autonome</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Thumbnail Image URL" : "URL Image de Couverture"}
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Pedagogical Description" : "Description Pédagogique & Objectifs"}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez les compétences acquises par l'apprenant au terme de ce programme..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <input
              type="checkbox"
              id="isPublishedCheck"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-[#00D9FF] accent-[#00D9FF]"
            />
            <label htmlFor="isPublishedCheck" className="text-xs text-slate-800 dark:text-white cursor-pointer font-bold">
              {isEn ? "Publish immediately (Visible to assigned students)" : "Publier immédiatement (Visible pour les élèves affectés)"}
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Create Curriculum" : "Créer le Programme"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Edit Program */}
      <Modal
        isOpen={Boolean(editingProgram)}
        onClose={() => setEditingProgram(null)}
        title={isEn ? "Edit Program Details" : "Modifier le Programme"}
        size="lg"
      >
        <form onSubmit={handleEditProgram} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Program Title *" : "Titre du Programme *"}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "CEFR Level" : "Niveau CECRL"}
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Thumbnail URL" : "URL Vignette"}
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Description" : "Description"}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <input
              type="checkbox"
              id="editPublishedCheck"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-[#00D9FF] accent-[#00D9FF]"
            />
            <label htmlFor="editPublishedCheck" className="text-xs text-slate-800 dark:text-white cursor-pointer font-bold">
              {isEn ? "Published" : "Publier le programme"}
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" type="button" onClick={() => setEditingProgram(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Save Changes" : "Enregistrer"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Delete Program Confirmation */}
      <Modal
        isOpen={Boolean(deletingProgram)}
        onClose={() => setDeletingProgram(null)}
        title={isEn ? "Confirm Program Deletion" : "Confirmation de Suppression"}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-500 dark:text-rose-300">
              <span className="font-bold block mb-1">
                {isEn ? "Warning: Permanent Deletion" : "Attention : Suppression Totale"}
              </span>
              <span>
                {isEn
                  ? `Are you sure you want to delete the program "${deletingProgram?.title}"? All its internal modules, lesson videos and associated quizzes will be removed.`
                  : `Êtes-vous certain de vouloir supprimer le programme "${deletingProgram?.title}" ? Tous ses modules, leçons vidéo et quiz associés seront supprimés.`}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setDeletingProgram(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="danger" size="sm" onClick={handleDeleteProgram}>
              {isEn ? "Delete Program" : "Supprimer le Programme"}
            </NeonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
