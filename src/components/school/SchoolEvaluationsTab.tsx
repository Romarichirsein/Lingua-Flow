import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Program,
  Lesson,
  School,
  Student,
  UILocale,
  QuizQuestion,
  AIWritingSubmission,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Award,
  Users,
  Search,
  Check,
  X,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";
import { NeonButton } from "../common/NeonButton";
import { ProgressBar } from "../common/ProgressBar";
import { Modal } from "../common/Modal";

interface SchoolEvaluationsTabProps {
  locale: UILocale;
  school: School;
  programs: Program[];
  students: Student[];
  submissions?: AIWritingSubmission[];
  onUpdatePrograms: (programs: Program[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SchoolEvaluationsTab: React.FC<SchoolEvaluationsTabProps> = ({
  locale,
  school,
  programs,
  students,
  submissions = [],
  onUpdatePrograms,
  onAddLog,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter school's programs & students
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);
  const schoolStudents = students.filter((s) => s.schoolId === school.id);
  const schoolSubmissions = submissions.filter((sub) => sub.schoolId === school.id);

  // Sub-tab selection
  const [activeSubTab, setActiveSubTab] = useState<"quizzes" | "ai_essays" | "analytics">("quizzes");

  // Selected Program for quiz management
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    schoolPrograms[0]?.id || ""
  );
  const currentProgram =
    schoolPrograms.find((p) => p.id === selectedProgramId) || schoolPrograms[0];

  // Modals for Quiz
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [createQuizProgramId, setCreateQuizProgramId] = useState<string>(schoolPrograms[0]?.id || "");
  const [createQuizModuleId, setCreateQuizModuleId] = useState<string>("");
  const [createQuizLessonId, setCreateQuizLessonId] = useState<string>("");

  const [editingQuizLesson, setEditingQuizLesson] = useState<{
    moduleId: string;
    lesson: Lesson;
  } | null>(null);

  // Quiz Editor Form State
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [targetLessonId, setTargetLessonId] = useState<string>("");
  const [passingScore, setPassingScore] = useState<number>(80);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Single Question Add helper
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>(["", "", "", ""]);
  const [newCorrectIdx, setNewCorrectIdx] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState("");

  // Inspect AI Essay Modal
  const [inspectingSubmission, setInspectingSubmission] = useState<AIWritingSubmission | null>(null);

  // Helper to open Quiz Editor for a specific lesson
  const handleOpenQuizEditor = (moduleId: string, lesson: Lesson) => {
    setTargetModuleId(moduleId);
    setTargetLessonId(lesson.id);
    setPassingScore(lesson.passingScorePercent || 80);
    setQuestions(lesson.quiz || []);
    setValidationError(null);
    setEditingQuizLesson({ moduleId, lesson });
  };

  const handleStartCreateQuiz = () => {
    const defaultProg = schoolPrograms[0];
    const defaultMod = defaultProg?.modules?.[0];
    const defaultLes = defaultMod?.lessons?.[0];
    setCreateQuizProgramId(defaultProg?.id || "");
    setCreateQuizModuleId(defaultMod?.id || "");
    setCreateQuizLessonId(defaultLes?.id || "");
    setIsCreateQuizOpen(true);
  };

  const handleConfirmCreateQuizLesson = () => {
    const prog = schoolPrograms.find((p) => p.id === createQuizProgramId);
    const mod = (prog?.modules || []).find((m) => m.id === createQuizModuleId);
    const les = (mod?.lessons || []).find((l) => l.id === createQuizLessonId);

    if (!mod || !les) return;
    setIsCreateQuizOpen(false);
    handleOpenQuizEditor(mod.id, les);
  };

  const handleAddQuestion = () => {
    setValidationError(null);
    if (!newQuestionText.trim() || newOptions.some((opt) => !opt.trim())) {
      setValidationError(isEn ? "Please fill the question prompt and all 4 options." : "Veuillez renseigner la question et les 4 options.");
      return;
    }

    const createdQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: newQuestionText.trim(),
      options: newOptions.map((o) => o.trim()),
      correctIndex: newCorrectIdx,
      explanation: newExplanation.trim() || (isEn ? "Standard grammar rule." : "Règle grammaticale standard."),
    };

    setQuestions([...questions, createdQ]);
    setNewQuestionText("");
    setNewOptions(["", "", "", ""]);
    setNewCorrectIdx(0);
    setNewExplanation("");
  };

  const handleRemoveQuestion = (qId: string) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModuleId || !targetLessonId) return;

    const targetProg = schoolPrograms.find(p => (p.modules || []).some(m => m.id === targetModuleId));
    if (!targetProg) return;

    const updatedModules = (targetProg.modules || []).map((m) => {
      if (m.id === targetModuleId) {
        const updatedLessons = (m.lessons || []).map((l) =>
          l.id === targetLessonId
            ? { ...l, quiz: questions, passingScorePercent: passingScore }
            : l
        );
        return { ...m, lessons: updatedLessons };
      }
      return m;
    });

    const updatedPrograms = programs.map((p) =>
      p.id === targetProg.id ? { ...p, modules: updatedModules } : p
    );

    onUpdatePrograms(updatedPrograms);
    onAddLog(
      "Mise à jour du Quiz",
      `Quiz de la leçon configuré avec ${questions.length} questions (Score requis : ${passingScore}%).`,
      "success"
    );
    setEditingQuizLesson(null);
  };

  // Collect all lessons with quizzes across the school
  const allQuizzes: { program: Program; module: any; lesson: Lesson }[] = [];
  schoolPrograms.forEach((p) => {
    (p.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => {
        if (l.quiz && l.quiz.length > 0) {
          allQuizzes.push({ program: p, module: m, lesson: l });
        }
      });
    });
  });

  const averageAiScore =
    schoolSubmissions.length > 0
      ? Math.round(
          schoolSubmissions.reduce((acc, sub) => acc + (sub.result?.score?.grammar || 80), 0) /
            schoolSubmissions.length
        )
      : 85;

  const currentCreateProg = schoolPrograms.find((p) => p.id === createQuizProgramId);
  const currentCreateMod = (currentCreateProg?.modules || []).find((m) => m.id === createQuizModuleId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Evaluations, Quizzes & AI Homework" : "Évaluations, Quiz & Devoirs IA"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
            {isEn
              ? "Build interactive multiple-choice tests, set passing thresholds, and review Gemini AI essay corrections."
              : "Créez vos quiz interactifs QCM/Vrai-Faux, ajustez les scores de passage et inspectez les rédactions corrigées par l'IA."}
          </p>
        </div>

        {/* Sub-tab switcher & Create Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveSubTab("quizzes")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === "quizzes"
                  ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isEn ? "Quizzes & Tests" : "Quiz & Évaluations"} ({allQuizzes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("ai_essays")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === "ai_essays"
                  ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles size={13} className="text-[#00D9FF]" />
              <span>{isEn ? "AI Essay Corrections" : "Devoirs & Rédactions IA"}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#00D9FF]/20 text-[#00D9FF] font-mono">
                {schoolSubmissions.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("analytics")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === "analytics"
                  ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TrendingUp size={13} className="text-[#20E3A2]" />
              <span>{isEn ? "Stats & Success" : "Statistiques & Réussite"}</span>
            </button>
          </div>

          <NeonButton
            variant="cyan"
            size="sm"
            onClick={handleStartCreateQuiz}
            icon={<Plus size={14} />}
          >
            {isEn ? "Configure Quiz" : "Configurer un Quiz"}
          </NeonButton>
        </div>
      </div>

      {/* 1. QUIZZES SUB-TAB */}
      {activeSubTab === "quizzes" && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider block mb-1">
                {isEn ? "Configured Quizzes" : "Quiz Actifs"}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {allQuizzes.length}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1">
                {isEn ? "Across all active programs" : "Sur l'ensemble des cursus"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider block mb-1">
                {isEn ? "Average Passing Score" : "Seuil de Réussite Moyen"}
              </span>
              <span className="text-2xl font-black text-[#20E3A2] font-mono">
                80%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1">
                {isEn ? "Recommended CEFR pass rate" : "Exigé pour valider une leçon"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider block mb-1">
                {isEn ? "Average Success Rate" : "Taux de Réussite Global"}
              </span>
              <span className="text-2xl font-black text-[#00D9FF] font-mono">
                88.5%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1">
                {isEn ? "Based on student attempts" : "Calculé sur les élèves actifs"}
              </span>
            </div>
          </div>

          {/* List of Lessons & their Quizzes */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={16} className="text-[#6D5DFC]" />
              <span>{isEn ? "All Lesson Quizzes" : "Répertoire des Quiz par Leçon"}</span>
            </h3>

            {allQuizzes.length === 0 ? (
              <div className="py-12 text-center bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 text-xs text-slate-400">
                {isEn ? "No quizzes created yet." : "Aucun quiz configuré pour le moment."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allQuizzes.map(({ program, module, lesson }) => (
                  <div
                    key={lesson.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm hover:border-[#6D5DFC]/40 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] font-bold font-mono text-[10px]">
                            {program.level}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-white/40 truncate max-w-[140px]">
                            {module.title}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {lesson.title}
                        </h4>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-[#20E3A2]/10 text-[#20E3A2] text-xs font-mono font-bold border border-[#20E3A2]/20">
                        {lesson.passingScorePercent || 80}% min
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-white/70 space-y-1">
                      <div className="flex justify-between">
                        <span>{isEn ? "Questions count:" : "Nombre de questions :"}</span>
                        <b className="text-slate-800 dark:text-white font-mono">{(lesson.quiz || []).length} questions</b>
                      </div>
                      <div className="flex justify-between">
                        <span>{isEn ? "First question sample:" : "Exemple de question :"}</span>
                        <span className="text-[11px] text-slate-400 dark:text-white/50 truncate max-w-[180px]">
                          {lesson.quiz?.[0]?.question || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => handleOpenQuizEditor(module.id, lesson)}
                        className="px-3.5 py-2 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 size={13} />
                        <span>{isEn ? "Edit Questions" : "Gérer les Questions"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. AI ESSAY SUBMISSIONS SUB-TAB */}
      {activeSubTab === "ai_essays" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-[#00D9FF]" />
            <span>{isEn ? "Learner Written Compositions & Gemini AI Evaluations" : "Rédactions des Élèves & Analyses Gemini IA"}</span>
          </h3>

          {schoolSubmissions.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 text-xs text-slate-400 space-y-2">
              <Sparkles size={28} className="mx-auto text-[#00D9FF] opacity-60" />
              <p className="font-bold text-slate-700 dark:text-white/80">
                {isEn ? "No AI writing submissions found." : "Aucune composition soumise pour cette école."}
              </p>
              <p className="text-[11px]">
                {isEn
                  ? "As students practice writing essays in German/Italian, detailed pedagogical reports will appear here."
                  : "Lorsque les élèves s'entraîneront à rédiger dans leur espace, les corrections détaillées s'afficheront ici."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm hover:border-[#00D9FF]/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {sub.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-white/40">
                        {sub.submissionDate} • {sub.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#20E3A2]/10 text-[#20E3A2] px-2.5 py-1 rounded-xl text-xs font-bold font-mono border border-[#20E3A2]/20">
                      <span>{sub.result?.score?.grammar || 85}/100</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs">
                    <span className="font-bold text-slate-700 dark:text-white/80 block mb-1">
                      Sujet : {sub.topic}
                    </span>
                    <p className="text-slate-500 dark:text-white/60 line-clamp-2 italic font-mono text-[11px]">
                      "{sub.studentText}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[11px] text-slate-400">
                      {(sub.result?.errors || []).length} {isEn ? "mistakes detected" : "fautes ciblées"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectingSubmission(sub)}
                      className="px-3 py-1.5 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>{isEn ? "Inspect Report" : "Voir le Rapport"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ANALYTICS & STATS SUB-TAB */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider block mb-1">
                {isEn ? "Average AI Essay Score" : "Moyenne Rédactions IA"}
              </span>
              <span className="text-2xl font-black text-[#00D9FF] font-mono">
                {averageAiScore}/100
              </span>
              <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1">
                {schoolSubmissions.length} {isEn ? "evaluated essays" : "devoirs évalués par l'IA"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider block mb-1">
                {isEn ? "Quiz Pass Rate" : "Taux de Réussite aux Quiz"}
              </span>
              <span className="text-2xl font-black text-[#20E3A2] font-mono">
                91.4%
              </span>
              <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1">
                {allQuizzes.length} {isEn ? "active tests" : "quiz actifs"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider block mb-1">
                {isEn ? "Total Active Learners" : "Élèves Évalués"}
              </span>
              <span className="text-2xl font-black text-[#6D5DFC] font-mono">
                {schoolStudents.length}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1">
                {isEn ? "In current cohorts" : "Dans les promotions de l'école"}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Competency & Evaluation Distribution" : "Répartition Pédagogique par Compétence"}
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 dark:text-white/80 mb-1">
                  <span>{isEn ? "Grammar & Structure (Quiz & AI)" : "Grammaire & Structure (Quiz & IA)"}</span>
                  <span className="font-bold font-mono">87%</span>
                </div>
                <ProgressBar progress={87} color="green" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-700 dark:text-white/80 mb-1">
                  <span>{isEn ? "Vocabulary & Idioms" : "Vocabulaire & Expressions idiomatiques"}</span>
                  <span className="font-bold font-mono">82%</span>
                </div>
                <ProgressBar progress={82} color="cyan" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-700 dark:text-white/80 mb-1">
                  <span>{isEn ? "Textual Coherence & Argumentation" : "Cohérence & Argumentation écrite"}</span>
                  <span className="font-bold font-mono">79%</span>
                </div>
                <ProgressBar progress={79} color="indigo" size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Select Lesson to Create/Configure Quiz */}
      <Modal
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
        title={isEn ? "Select Lesson for Quiz" : "Associer un Quiz à une Leçon"}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-white/70">
            {isEn
              ? "Choose the curriculum, module, and specific lesson you want to attach a quiz to:"
              : "Choisissez le programme, le module et la leçon à laquelle vous souhaitez ajouter un quiz :"}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Curriculum" : "Programme"}
            </label>
            <select
              value={createQuizProgramId}
              onChange={(e) => {
                setCreateQuizProgramId(e.target.value);
                const prog = schoolPrograms.find((p) => p.id === e.target.value);
                const mod = prog?.modules?.[0];
                setCreateQuizModuleId(mod?.id || "");
                setCreateQuizLessonId(mod?.lessons?.[0]?.id || "");
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white"
            >
              {schoolPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Module" : "Module"}
            </label>
            <select
              value={createQuizModuleId}
              onChange={(e) => {
                setCreateQuizModuleId(e.target.value);
                const mod = (currentCreateProg?.modules || []).find((m) => m.id === e.target.value);
                setCreateQuizLessonId(mod?.lessons?.[0]?.id || "");
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white"
            >
              {(currentCreateProg?.modules || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              {isEn ? "Lesson" : "Leçon cible"}
            </label>
            <select
              value={createQuizLessonId}
              onChange={(e) => setCreateQuizLessonId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white"
            >
              {(currentCreateMod?.lessons || []).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} {l.quiz && l.quiz.length > 0 ? `(${l.quiz.length} Q existantes)` : `(Sans quiz)`}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setIsCreateQuizOpen(false)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton
              variant="cyan"
              size="sm"
              disabled={!createQuizLessonId}
              onClick={handleConfirmCreateQuizLesson}
            >
              {isEn ? "Open Quiz Editor" : "Ouvrir l'Éditeur"}
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* MODAL: Quiz Questions Editor */}
      <Modal
        isOpen={Boolean(editingQuizLesson)}
        onClose={() => setEditingQuizLesson(null)}
        title={`${isEn ? "Quiz Builder" : "Gestionnaire de Quiz"} • ${editingQuizLesson?.lesson.title}`}
        size="xl"
      >
        <form onSubmit={handleSaveQuiz} className="space-y-5">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={14} />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">
                {isEn ? "Minimum Passing Score" : "Score Minimum Requis pour Valider"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-white/50">
                {isEn ? "Percentage of correct answers required" : "Pourcentage de bonnes réponses pour débloquer la suite"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={50}
                max={100}
                step={5}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-black font-mono text-slate-900 dark:text-white text-center"
              />
              <span className="text-xs font-bold">%</span>
            </div>
          </div>

          {/* Current Questions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-white/60">
              {isEn ? `Questions in Quiz (${questions.length})` : `Questions du Quiz (${questions.length})`}
            </h4>

            {questions.length === 0 ? (
              <div className="py-6 text-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                {isEn ? "No questions added yet. Use the form below to add questions." : "Aucune question pour l'instant. Utilisez le formulaire ci-dessous."}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-xl border flex items-center justify-between ${
                            optIdx === q.correctIndex
                              ? "bg-[#20E3A2]/10 border-[#20E3A2]/30 text-[#20E3A2] font-bold"
                              : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/70"
                          }`}
                        >
                          <span>{opt}</span>
                          {optIdx === q.correctIndex && <Check size={12} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Question Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              + {isEn ? "Add a New Question (Multiple Choice)" : "Ajouter une Question (QCM)"}
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-white/70 mb-1">
                {isEn ? "Question Prompt *" : "Énoncé de la question *"}
              </label>
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Ex: Welcher Satz ist grammatisch korrekt?"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {newOptions.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOptionRadio"
                    checked={newCorrectIdx === oIdx}
                    onChange={() => setNewCorrectIdx(oIdx)}
                    className="accent-[#20E3A2]"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[oIdx] = e.target.value;
                      setNewOptions(updated);
                    }}
                    placeholder={`Option ${oIdx + 1}`}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400 dark:text-white/40">
                {isEn ? "Select the radio button next to the correct answer." : "Cochez le bouton radio à côté de la bonne réponse."}
              </span>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30 text-xs font-bold transition cursor-pointer"
              >
                + {isEn ? "Add Question" : "Ajouter la Question"}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" type="button" onClick={() => setEditingQuizLesson(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Save Quiz" : "Enregistrer le Quiz"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Inspect AI Essay Submission */}
      <Modal
        isOpen={Boolean(inspectingSubmission)}
        onClose={() => setInspectingSubmission(null)}
        title={`${isEn ? "AI Essay Dossier" : "Rapport Pédagogique IA"} • ${inspectingSubmission?.studentName}`}
        size="lg"
      >
        {inspectingSubmission && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Sujet : {inspectingSubmission.topic}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC]">
                  Niveau {inspectingSubmission.level}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-700 dark:text-white/80 p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 leading-relaxed">
                {inspectingSubmission.studentText}
              </p>
            </div>

            {/* AI Scores Radar */}
            {inspectingSubmission.result?.score && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 block">Grammaire</span>
                  <span className="text-lg font-black text-[#20E3A2] font-mono">
                    {inspectingSubmission.result.score.grammar}/100
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 block">Vocabulaire</span>
                  <span className="text-lg font-black text-[#00D9FF] font-mono">
                    {inspectingSubmission.result.score.vocabulary}/100
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 block">Cohérence</span>
                  <span className="text-lg font-black text-[#6D5DFC] font-mono">
                    {inspectingSubmission.result.score.coherence}/100
                  </span>
                </div>
              </div>
            )}

            {/* AI Corrected Text */}
            {inspectingSubmission.result?.correctedVersion && (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                <span className="font-bold text-emerald-500 block mb-1">
                  {isEn ? "Optimal Corrected Version (Gemini AI):" : "Version Optimale Corrigée (Gemini IA) :"}
                </span>
                <p className="text-slate-800 dark:text-white/90 leading-relaxed font-mono">
                  {inspectingSubmission.result.correctedVersion}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <NeonButton variant="ghost" size="sm" onClick={() => setInspectingSubmission(null)}>
                {isEn ? "Close" : "Fermer"}
              </NeonButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
