import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Program,
  CourseModule,
  Lesson,
  School,
  UILocale,
  VocabularyItem,
  QuizQuestion,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  BookOpen,
  Layers,
  Video,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Shield,
  Clock,
  ExternalLink,
  Volume2,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { NeonButton } from "../common/NeonButton";
import { Modal } from "../common/Modal";
import { VideoSourceInput } from "../common/VideoSourceInput";

interface SchoolCourseBuilderTabProps {
  locale: UILocale;
  school: School;
  programs: Program[];
  selectedProgramId?: string;
  onUpdatePrograms: (programs: Program[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SchoolCourseBuilderTab: React.FC<SchoolCourseBuilderTabProps> = ({
  locale,
  school,
  programs,
  selectedProgramId: initialProgramId,
  onUpdatePrograms,
  onAddLog,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter school programs
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);

  // Active Selected Program
  const [activeProgramId, setActiveProgramId] = useState<string>(
    initialProgramId || schoolPrograms[0]?.id || ""
  );

  const currentProgram =
    schoolPrograms.find((p) => p.id === activeProgramId) || schoolPrograms[0];

  // Accordion open states for modules
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: prev[modId] === undefined ? false : !prev[modId],
    }));
  };

  // Modals for Module
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [deletingModule, setDeletingModule] = useState<CourseModule | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });

  // Modals for Lesson
  const [isAddLessonOpen, setIsAddLessonOpen] = useState<string | null>(null); // moduleId
  const [editingLesson, setEditingLesson] = useState<{ lesson: Lesson; moduleId: string } | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<{ lesson: Lesson; moduleId: string } | null>(null);
  const [previewingLesson, setPreviewingLesson] = useState<Lesson | null>(null);

  // Lesson Form
  const [lessonForm, setLessonForm] = useState({
    title: "",
    durationMinutes: 15,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    summary: "",
    theoryContent: "",
    passingScorePercent: 80,
    vocabulary: [] as VocabularyItem[],
  });

  // Vocab Item add helper inside lesson form
  const [newVocabTerm, setNewVocabTerm] = useState("");
  const [newVocabTrans, setNewVocabTrans] = useState("");
  const [newVocabExample, setNewVocabExample] = useState("");

  const handleAddVocabToLesson = () => {
    if (!newVocabTerm.trim() || !newVocabTrans.trim()) return;
    setLessonForm((prev) => ({
      ...prev,
      vocabulary: [
        ...prev.vocabulary,
        {
          id: `v_${Date.now()}`,
          term: newVocabTerm.trim(),
          translation: newVocabTrans.trim(),
          exampleSentence: newVocabExample.trim() || undefined,
        },
      ],
    }));
    setNewVocabTerm("");
    setNewVocabTrans("");
    setNewVocabExample("");
  };

  const handleRemoveVocabFromLesson = (vId: string) => {
    setLessonForm((prev) => ({
      ...prev,
      vocabulary: prev.vocabulary.filter((v) => v.id !== vId),
    }));
  };

  // 1. MODULE CRUD HANDLERS
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProgram || !moduleForm.title.trim()) return;

    if (editingModule) {
      // Edit
      const updatedModules = (currentProgram.modules || []).map((m) =>
        m.id === editingModule.id
          ? { ...m, title: moduleForm.title.trim(), description: moduleForm.description.trim() }
          : m
      );
      const updatedPrograms = programs.map((p) =>
        p.id === currentProgram.id ? { ...p, modules: updatedModules } : p
      );
      onUpdatePrograms(updatedPrograms);
      onAddLog("Modification de module", `Module "${moduleForm.title}" modifié.`);
      setEditingModule(null);
    } else {
      // Create
      const newMod: CourseModule = {
        id: `mod_${Date.now()}`,
        programId: currentProgram.id,
        title: moduleForm.title.trim(),
        order: (currentProgram.modules || []).length + 1,
        description: moduleForm.description.trim(),
        lessons: [],
      };
      const updatedPrograms = programs.map((p) =>
        p.id === currentProgram.id
          ? { ...p, modules: [...(p.modules || []), newMod] }
          : p
      );
      onUpdatePrograms(updatedPrograms);
      onAddLog("Création de module", `Nouveau module "${newMod.title}" ajouté au cursus.`);
      setIsAddModuleOpen(false);
    }
    setModuleForm({ title: "", description: "" });
  };

  const handleDeleteModule = () => {
    if (!currentProgram || !deletingModule) return;
    const updatedModules = (currentProgram.modules || []).filter((m) => m.id !== deletingModule.id);
    const updatedPrograms = programs.map((p) =>
      p.id === currentProgram.id ? { ...p, modules: updatedModules } : p
    );
    onUpdatePrograms(updatedPrograms);
    onAddLog("Suppression de module", `Module "${deletingModule.title}" supprimé.`, "warning");
    setDeletingModule(null);
  };

  const handleMoveModule = (mIdx: number, direction: "up" | "down") => {
    if (!currentProgram) return;
    const modules = [...(currentProgram.modules || [])];
    const targetIdx = direction === "up" ? mIdx - 1 : mIdx + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    const temp = modules[mIdx];
    modules[mIdx] = modules[targetIdx];
    modules[targetIdx] = temp;

    const updated = modules.map((m, idx) => ({ ...m, order: idx + 1 }));
    const updatedPrograms = programs.map((p) =>
      p.id === currentProgram.id ? { ...p, modules: updated } : p
    );
    onUpdatePrograms(updatedPrograms);
  };

  // 2. LESSON CRUD HANDLERS
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProgram || !lessonForm.title.trim()) return;

    if (editingLesson) {
      // Edit Lesson
      const updatedModules = (currentProgram.modules || []).map((m) => {
        if (m.id === editingLesson.moduleId) {
          const updatedLessons = (m.lessons || []).map((l) =>
            l.id === editingLesson.lesson.id
              ? {
                  ...l,
                  title: lessonForm.title.trim(),
                  durationMinutes: Number(lessonForm.durationMinutes) || 15,
                  videoUrl: lessonForm.videoUrl,
                  summary: lessonForm.summary.trim(),
                  theoryContent: lessonForm.theoryContent,
                  passingScorePercent: lessonForm.passingScorePercent,
                  vocabulary: lessonForm.vocabulary,
                }
              : l
          );
          return { ...m, lessons: updatedLessons };
        }
        return m;
      });

      const updatedPrograms = programs.map((p) =>
        p.id === currentProgram.id ? { ...p, modules: updatedModules } : p
      );
      onUpdatePrograms(updatedPrograms);
      onAddLog("Modification de leçon", `Leçon "${lessonForm.title}" mise à jour.`);
      setEditingLesson(null);
    } else if (isAddLessonOpen) {
      // Create Lesson
      const targetModuleId = isAddLessonOpen;
      const updatedModules = (currentProgram.modules || []).map((m) => {
        if (m.id === targetModuleId) {
          const newLesson: Lesson = {
            id: `les_${Date.now()}`,
            moduleId: targetModuleId,
            title: lessonForm.title.trim(),
            order: (m.lessons || []).length + 1,
            durationMinutes: Number(lessonForm.durationMinutes) || 15,
            videoUrl: lessonForm.videoUrl,
            summary: lessonForm.summary.trim(),
            theoryContent: lessonForm.theoryContent,
            passingScorePercent: lessonForm.passingScorePercent,
            vocabulary: lessonForm.vocabulary,
            isUnlocked: true,
          };
          return { ...m, lessons: [...(m.lessons || []), newLesson] };
        }
        return m;
      });

      const updatedPrograms = programs.map((p) =>
        p.id === currentProgram.id ? { ...p, modules: updatedModules } : p
      );
      onUpdatePrograms(updatedPrograms);
      onAddLog("Ajout de leçon", `Nouvelle leçon "${lessonForm.title}" ajoutée.`);
      setIsAddLessonOpen(null);
    }
  };

  const handleDeleteLesson = () => {
    if (!currentProgram || !deletingLesson) return;
    const updatedModules = (currentProgram.modules || []).map((m) => {
      if (m.id === deletingLesson.moduleId) {
        return {
          ...m,
          lessons: (m.lessons || []).filter((l) => l.id !== deletingLesson.lesson.id),
        };
      }
      return m;
    });

    const updatedPrograms = programs.map((p) =>
      p.id === currentProgram.id ? { ...p, modules: updatedModules } : p
    );
    onUpdatePrograms(updatedPrograms);
    onAddLog("Suppression de leçon", `Leçon "${deletingLesson.lesson.title}" supprimée.`, "warning");
    setDeletingLesson(null);
  };

  const handleMoveLesson = (modId: string, lIdx: number, direction: "up" | "down") => {
    if (!currentProgram) return;
    const updatedModules = (currentProgram.modules || []).map((m) => {
      if (m.id === modId) {
        const lessons = [...(m.lessons || [])];
        const targetIdx = direction === "up" ? lIdx - 1 : lIdx + 1;
        if (targetIdx < 0 || targetIdx >= lessons.length) return m;

        const temp = lessons[lIdx];
        lessons[lIdx] = lessons[targetIdx];
        lessons[targetIdx] = temp;

        return { ...m, lessons: lessons.map((l, idx) => ({ ...l, order: idx + 1 })) };
      }
      return m;
    });

    const updatedPrograms = programs.map((p) =>
      p.id === currentProgram.id ? { ...p, modules: updatedModules } : p
    );
    onUpdatePrograms(updatedPrograms);
  };

  if (!currentProgram) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-white/50">
        {isEn ? "Please create a curriculum first before managing courses." : "Veuillez d'abord créer un programme pour structurer vos cours."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Curriculum Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Course Structure & Media Builder" : "Gestion des Modules, Leçons & Vidéos"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
            {isEn
              ? "Organize syllabus hierarchy: Curriculum -> Modules -> Lessons -> Video Streams & Lexicons."
              : "Structurez l'arborescence : Programme -> Modules -> Leçons -> Vidéos & Lexiques."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Program Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-white/50 font-medium">
              {isEn ? "Curriculum:" : "Programme :"}
            </span>
            <select
              value={activeProgramId}
              onChange={(e) => setActiveProgramId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
            >
              {schoolPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.level})
                </option>
              ))}
            </select>
          </div>

          <NeonButton
            variant="cyan"
            size="sm"
            onClick={() => {
              setModuleForm({ title: "", description: "" });
              setIsAddModuleOpen(true);
            }}
            icon={<Plus size={16} />}
          >
            {isEn ? "Add Module" : "Ajouter un Module"}
          </NeonButton>
        </div>
      </div>

      {/* Video Security Policy Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6D5DFC]/10 to-transparent border border-[#6D5DFC]/20 flex items-start gap-3">
        <Shield size={20} className="text-[#00D9FF] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-white/80">
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
            {isEn ? "Video Stream Security & Protection" : "Sécurité & Protection des Flux Vidéo"}
          </span>
          <span>
            {isEn
              ? "All video resources are served through signed URLs with dynamic learner watermark overlay during student playback."
              : "Tous les cours vidéo sont protégés par des flux sécurisés et un filigrane dynamique personnalisé (nom/email/IP de l'élève) incrusté pendant la lecture."}
          </span>
        </div>
      </div>

      {/* Modules List Accordion */}
      <div className="space-y-4">
        {(currentProgram.modules || []).length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 text-xs text-slate-400 dark:text-white/40 space-y-3">
            <Layers size={32} className="mx-auto text-[#6D5DFC] opacity-60" />
            <p className="font-bold text-slate-700 dark:text-white/80">
              {isEn ? "No modules in this curriculum." : "Aucun module dans ce programme."}
            </p>
            <p className="text-[11px]">
              {isEn ? "Click 'Add Module' to start building lessons." : "Cliquez sur 'Ajouter un Module' pour commencer la création."}
            </p>
          </div>
        ) : (
          (currentProgram.modules || []).map((module, mIdx) => {
            const isExpanded = expandedModules[module.id] !== false; // expanded by default
            const lessons = module.lessons || [];

            return (
              <div
                key={module.id}
                className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm transition-all"
              >
                {/* Module Header Bar */}
                <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleModuleExpand(module.id)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 flex items-center justify-center cursor-pointer hover:text-[#00D9FF] transition shrink-0"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <div className="w-8 h-8 rounded-xl bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff] font-black text-xs flex items-center justify-center font-mono shrink-0">
                      {mIdx + 1}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-white/50">
                        {lessons.length} {isEn ? "lessons" : "leçons"} • {module.description || (isEn ? "Core module objectives" : "Objectifs clés")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Reorder Module Up/Down */}
                    <button
                      type="button"
                      disabled={mIdx === 0}
                      onClick={() => handleMoveModule(mIdx, "up")}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition"
                      title="Monter le module"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={mIdx === (currentProgram.modules || []).length - 1}
                      onClick={() => handleMoveModule(mIdx, "down")}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition"
                      title="Descendre le module"
                    >
                      <MoveDown size={14} />
                    </button>

                    {/* Edit Module */}
                    <button
                      type="button"
                      onClick={() => {
                        setModuleForm({ title: module.title, description: module.description || "" });
                        setEditingModule(module);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
                      title="Modifier le module"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Delete Module */}
                    <button
                      type="button"
                      onClick={() => setDeletingModule(module)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Supprimer le module"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Add Lesson to this module */}
                    <button
                      type="button"
                      onClick={() => {
                        setLessonForm({
                          title: "",
                          durationMinutes: 15,
                          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                          summary: "",
                          theoryContent: "### Notions Clés\nExplication du cours...",
                          passingScorePercent: 80,
                          vocabulary: [],
                        });
                        setIsAddLessonOpen(module.id);
                      }}
                      className="ml-2 px-3 py-1.5 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{isEn ? "Add Lesson" : "Ajouter Leçon"}</span>
                    </button>
                  </div>
                </div>

                {/* Lessons inside Module (Accordion Content) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-3">
                    {lessons.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 dark:text-white/40 text-xs border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                        {isEn ? "No lessons yet in this module." : "Aucune leçon dans ce module. Cliquez sur 'Ajouter Leçon'."}
                      </div>
                    ) : (
                      lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#6D5DFC]/30 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center shrink-0">
                              <Video size={18} />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                  {lesson.title}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/70 font-mono">
                                  {lesson.durationMinutes} min
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-white/50 line-clamp-1 mt-0.5">
                                {lesson.summary || (isEn ? "Video lesson stream" : "Capsule vidéo & cours")} • {(lesson.vocabulary || []).length} {isEn ? "vocab words" : "termes lexique"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            {/* Reorder Lesson Up/Down */}
                            <button
                              type="button"
                              disabled={lIdx === 0}
                              onClick={() => handleMoveLesson(module.id, lIdx, "up")}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition"
                              title="Monter la leçon"
                            >
                              <MoveUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={lIdx === lessons.length - 1}
                              onClick={() => handleMoveLesson(module.id, lIdx, "down")}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition"
                              title="Descendre la leçon"
                            >
                              <MoveDown size={13} />
                            </button>

                            {/* Preview Lesson */}
                            <button
                              type="button"
                              onClick={() => setPreviewingLesson(lesson)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition"
                              title="Prévisualiser la leçon élève"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit Lesson */}
                            <button
                              type="button"
                              onClick={() => {
                                setLessonForm({
                                  title: lesson.title,
                                  durationMinutes: lesson.durationMinutes || 15,
                                  videoUrl: lesson.videoUrl,
                                  summary: lesson.summary || "",
                                  theoryContent: lesson.theoryContent || "",
                                  passingScorePercent: lesson.passingScorePercent || 80,
                                  vocabulary: lesson.vocabulary || [],
                                });
                                setEditingLesson({ lesson, moduleId: module.id });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
                              title="Modifier la leçon"
                            >
                              <Edit2 size={14} />
                            </button>

                            {/* Delete Lesson */}
                            <button
                              type="button"
                              onClick={() => setDeletingLesson({ lesson, moduleId: module.id })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Supprimer la leçon"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Add / Edit Module */}
      <Modal
        isOpen={isAddModuleOpen || Boolean(editingModule)}
        onClose={() => {
          setIsAddModuleOpen(false);
          setEditingModule(null);
        }}
        title={
          editingModule
            ? (isEn ? "Edit Module" : "Modifier le Module")
            : (isEn ? "Add New Module" : "Ajouter un Nouveau Module")
        }
        size="md"
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Module Title *" : "Titre du Module *"}
            </label>
            <input
              type="text"
              required
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              placeholder="Ex: Module 1 : Grammaire fondamentale & Déclinaisons"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Description & Objectives" : "Objectifs & Description"}
            </label>
            <textarea
              rows={3}
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              placeholder="Ex: Maîtriser les structures fondamentales et le vocabulaire usuel..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setIsAddModuleOpen(false);
                setEditingModule(null);
              }}
            >
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Save Module" : "Enregistrer le Module"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Delete Module */}
      <Modal
        isOpen={Boolean(deletingModule)}
        onClose={() => setDeletingModule(null)}
        title={isEn ? "Confirm Module Deletion" : "Confirmation de Suppression"}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 dark:text-rose-300">
            {isEn
              ? `Are you sure you want to delete module "${deletingModule?.title}" and all its lessons?`
              : `Voulez-vous supprimer le module "${deletingModule?.title}" et l'ensemble de ses leçons ?`}
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setDeletingModule(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="danger" size="sm" onClick={handleDeleteModule}>
              {isEn ? "Delete Module" : "Supprimer"}
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* MODAL: Add / Edit Lesson */}
      <Modal
        isOpen={Boolean(isAddLessonOpen) || Boolean(editingLesson)}
        onClose={() => {
          setIsAddLessonOpen(null);
          setEditingLesson(null);
        }}
        title={
          editingLesson
            ? (isEn ? "Edit Lesson" : "Modifier la Leçon")
            : (isEn ? "Add New Lesson" : "Créer une Nouvelle Leçon")
        }
        size="lg"
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Lesson Title *" : "Titre de la Leçon *"}
              </label>
              <input
                type="text"
                required
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                placeholder="Ex: Leçon 2 : Les verbes de modalité"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Estimated Duration (min)" : "Durée Estimée (min)"}
              </label>
              <input
                type="number"
                min={1}
                value={lessonForm.durationMinutes}
                onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Video URL Input with custom helper */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Protected Video Source URL *" : "URL de la Source Vidéo Protégée *"}
            </label>
            <VideoSourceInput
              value={lessonForm.videoUrl}
              onChange={(url) => setLessonForm({ ...lessonForm, videoUrl: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Summary / Key Takeaways" : "Résumé Pédagogique de la Leçon"}
            </label>
            <input
              type="text"
              value={lessonForm.summary}
              onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
              placeholder="Ex: Comprendre et utiliser können, müssen et dürfen dans des contextes réels."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Theory Content & Explanations (Markdown)" : "Contenu Théorique & Explications (Markdown)"}
            </label>
            <textarea
              rows={4}
              value={lessonForm.theoryContent}
              onChange={(e) => setLessonForm({ ...lessonForm, theoryContent: e.target.value })}
              placeholder="### Règle grammaticale..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Vocabulary List Builder */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{isEn ? "Vocabulary Lexicon Items" : "Lexique & Vocabulaire de la Leçon"}</span>
              <span className="text-[10px] font-mono text-slate-400">
                {(lessonForm.vocabulary || []).length} {isEn ? "items" : "mots"}
              </span>
            </h4>

            {(lessonForm.vocabulary || []).length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {(lessonForm.vocabulary || []).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 text-xs flex items-center justify-between"
                  >
                    <div>
                      <b className="text-slate-900 dark:text-white font-mono">{item.term}</b> :{" "}
                      <span className="text-slate-600 dark:text-white/70">{item.translation}</span>
                      {item.exampleSentence && (
                        <span className="text-[10px] text-slate-400 block italic">{item.exampleSentence}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVocabFromLesson(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <input
                type="text"
                value={newVocabTerm}
                onChange={(e) => setNewVocabTerm(e.target.value)}
                placeholder={school.language === "german" ? "Terme (ex: die Katze)" : "Terme (ex: il gatto)"}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newVocabTrans}
                onChange={(e) => setNewVocabTrans(e.target.value)}
                placeholder="Traduction (ex: le chat)"
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddVocabToLesson}
                className="px-3 py-2 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>+ Ajouter mot</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setIsAddLessonOpen(null);
                setEditingLesson(null);
              }}
            >
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Save Lesson" : "Enregistrer la Leçon"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Delete Lesson Confirmation */}
      <Modal
        isOpen={Boolean(deletingLesson)}
        onClose={() => setDeletingLesson(null)}
        title={isEn ? "Confirm Lesson Deletion" : "Supprimer la Leçon"}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 dark:text-rose-300">
            {isEn
              ? `Delete lesson "${deletingLesson?.lesson.title}"?`
              : `Voulez-vous supprimer définitivement la leçon "${deletingLesson?.lesson.title}" ?`}
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setDeletingLesson(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="danger" size="sm" onClick={handleDeleteLesson}>
              {isEn ? "Delete Lesson" : "Supprimer"}
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* MODAL: Interactive Lesson Preview */}
      <Modal
        isOpen={Boolean(previewingLesson)}
        onClose={() => setPreviewingLesson(null)}
        title={`${isEn ? "Student Preview" : "Prévisualisation Apprenant"} • ${previewingLesson?.title}`}
        size="xl"
      >
        {previewingLesson && (
          <div className="space-y-5">
            {/* Video Player Simulator with Dynamic Watermark */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                src={previewingLesson.videoUrl}
                controls
                className="w-full h-full object-contain"
              />
              {/* Dynamic Watermark Overlay Simulator */}
              <div className="absolute top-4 right-4 pointer-events-none opacity-40 bg-black/60 px-3 py-1 rounded-lg text-[11px] font-mono text-white select-none border border-white/10">
                <span>Directeur • {school.name} • {school.language.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {previewingLesson.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-white/70">
                {previewingLesson.summary}
              </p>

              {previewingLesson.theoryContent && (
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-white/90 whitespace-pre-wrap">
                  {previewingLesson.theoryContent}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <NeonButton variant="ghost" size="sm" onClick={() => setPreviewingLesson(null)}>
                {isEn ? "Close Preview" : "Fermer la prévisualisation"}
              </NeonButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
