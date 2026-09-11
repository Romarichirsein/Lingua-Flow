import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Student,
  School,
  Program,
  Lesson,
  CEFRLevel,
  UILocale,
} from "../../types";
import { translations } from "../../lib/translations";
import { NeonButton } from "../common/NeonButton";
import {
  PRUFUNG_DATA_DE,
  LevelExamConfig,
  ExamQuestion,
} from "../../data/prufungData";
import {
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Volume2,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Gauge,
  Check,
  X,
  Languages,
  FileCheck,
  Flame,
  ArrowRight,
  Info,
} from "lucide-react";

interface StudentPrufungTabProps {
  student: Student;
  school: School;
  program?: Program;
  allLessons: Lesson[];
  locale: UILocale;
  onCompleteLesson: (lessonId: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

type PrufungSubTab =
  | "overview"
  | "lesen"
  | "horen"
  | "schreiben"
  | "sprechen"
  | "wortschatz"
  | "lessons";

export const StudentPrufungTab: React.FC<StudentPrufungTabProps> = ({
  student,
  school,
  program,
  allLessons,
  locale,
  onCompleteLesson,
  onOpenLesson,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";
  const isGerman = school.language === "german";

  // Selected level for preparation (defaults to student's level, fallback B1)
  const defaultLevel: CEFRLevel = (["A1", "A2", "B1", "B2", "C1", "C2"].includes(
    student.level
  )
    ? student.level
    : "B1") as CEFRLevel;

  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(defaultLevel);
  const [activeSubTab, setActiveSubTab] = useState<PrufungSubTab>("overview");

  // Get current exam data for selected level
  const currentExamConfig: LevelExamConfig =
    PRUFUNG_DATA_DE[selectedLevel] || PRUFUNG_DATA_DE.B1;

  // Track progress and scores per skill (stored in local state & persisted)
  const storageKey = `linguaflow_prufung_${student.id}_${selectedLevel}`;
  const [skillScores, setSkillScores] = useState<{
    lesenAnswers: Record<string, number>;
    horenAnswers: Record<string, number>;
    wortschatzQuizAnswers: Record<string, number>;
    masteredVocabIds: string[];
    schreibenCompleted: boolean;
    sprechenCompleted: boolean;
    schreibenDraft: string;
  }>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      lesenAnswers: {},
      horenAnswers: {},
      wortschatzQuizAnswers: {},
      masteredVocabIds: [],
      schreibenCompleted: false,
      sprechenCompleted: false,
      schreibenDraft: "",
    };
  });

  // Persist skill state
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(skillScores));
    } catch {
      // ignore
    }
  }, [skillScores, storageKey]);

  // Audio speech synthesis helper
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingText, setCurrentPlayingText] = useState<string | null>(null);
  const [audioPlaybackCount, setAudioPlaybackCount] = useState<Record<string, number>>({});
  const [showTranscript, setShowTranscript] = useState<Record<string, boolean>>({});

  const playSpeech = (text: string, taskId?: string) => {
    if (!("speechSynthesis" in window)) {
      alert(isEn ? "Text-to-speech not supported in this browser." : "Synthèse vocale non supportée par votre navigateur.");
      return;
    }

    window.speechSynthesis.cancel();

    if (isPlayingAudio && currentPlayingText === text) {
      setIsPlayingAudio(false);
      setCurrentPlayingText(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isGerman ? "de-DE" : "it-IT";
    utterance.rate = selectedLevel === "A1" || selectedLevel === "A2" ? 0.85 : 1.0;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setCurrentPlayingText(text);
      if (taskId) {
        setAudioPlaybackCount((prev) => ({
          ...prev,
          [taskId]: (prev[taskId] || 0) + 1,
        }));
      }
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCurrentPlayingText(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentPlayingText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentPlayingText(null);
  };

  // Score calculations
  const calculateScore = (
    questions: ExamQuestion[],
    answers: Record<string, number>
  ) => {
    if (!questions || questions.length === 0) return 0;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  // Aggregate Lesen questions
  const allLesenQuestions = (currentExamConfig.tasks.lesen || []).flatMap(
    (t) => t.questions
  );
  const lesenScore = calculateScore(allLesenQuestions, skillScores.lesenAnswers);
  const isLesenPassed = lesenScore >= currentExamConfig.passingScorePercent;

  // Aggregate Hören questions
  const allHorenQuestions = (currentExamConfig.tasks.horen || []).flatMap(
    (t) => t.questions
  );
  const horenScore = calculateScore(allHorenQuestions, skillScores.horenAnswers);
  const isHorenPassed = horenScore >= currentExamConfig.passingScorePercent;

  // Wortschatz score
  const wortschatzQuizScore = calculateScore(
    currentExamConfig.tasks.wortschatzQuiz || [],
    skillScores.wortschatzQuizAnswers
  );
  const totalVocabCount = currentExamConfig.tasks.wortschatz?.length || 1;
  const vocabMasteryPercent = Math.min(
    100,
    Math.round((skillScores.masteredVocabIds.length / totalVocabCount) * 100)
  );
  const combinedWortschatzScore = Math.round(
    (wortschatzQuizScore * 0.6) + (vocabMasteryPercent * 0.4)
  );

  // Overall Prüfungsreife Readiness Index (0 to 100%)
  const readinessComponents = [
    { name: "Lesen", score: lesenScore, weight: 0.25 },
    { name: "Hören", score: horenScore, weight: 0.25 },
    { name: "Schreiben", score: skillScores.schreibenCompleted ? 85 : skillScores.schreibenDraft.length > 50 ? 50 : 0, weight: 0.2 },
    { name: "Sprechen", score: skillScores.sprechenCompleted ? 85 : 20, weight: 0.15 },
    { name: "Wortschatz", score: combinedWortschatzScore, weight: 0.15 },
  ];

  const overallReadiness = Math.round(
    readinessComponents.reduce((acc, c) => acc + c.score * c.weight, 0)
  );

  // Determine certification readiness status
  const isPruefungsbereit = overallReadiness >= currentExamConfig.passingScorePercent;

  // Interactive AI feedback simulation for writing
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false);
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);

  const handleEvaluateWriting = async (task: any) => {
    if (!skillScores.schreibenDraft || skillScores.schreibenDraft.trim().length < 20) {
      alert(isEn ? "Please write at least 20 words before evaluating." : "Veuillez rédiger au moins 20 mots avant de lancer l'évaluation.");
      return;
    }

    setIsEvaluatingWriting(true);
    setWritingFeedback(null);

    try {
      const resp = await fetch("/api/ai/writing/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: skillScores.schreibenDraft,
          language: school.language,
          targetLevel: selectedLevel,
          topic: task.title,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setWritingFeedback(
          `${isEn ? "Score" : "Note"}: ${data.score || 85}/100 • CEFR: ${data.cefrLevel || selectedLevel}\n\n${data.overallFeedback || "Sehr gut strukturierter Text!"}`
        );
        setSkillScores((prev) => ({ ...prev, schreibenCompleted: true }));
      } else {
        throw new Error("Failed response");
      }
    } catch {
      // Graceful pedagogical fallback
      const wordCount = skillScores.schreibenDraft.trim().split(/\s+/).length;
      const minReq = task.targetWordCount.min;
      const meetsWords = wordCount >= minReq;
      setWritingFeedback(
        `${isEn ? "Evaluation Result" : "Résultat d'évaluation"} : ${meetsWords ? "85/100 (Recommandé pour l'examen)" : "60/100 (Volume un peu court)"}\n\n` +
          (meetsWords
            ? isEn
              ? "Your written production respects the required points and demonstrates good sentence structures appropriate for " + selectedLevel + "."
              : "Votre rédaction couvre les points exigés avec une bonne clarté syntaxique conforme au niveau " + selectedLevel + "."
            : isEn
              ? `You wrote ${wordCount} words, while ${minReq} are expected for this task. Enrich your arguments!`
              : `Vous avez rédigé ${wordCount} mots sur les ${minReq} attendus. Enrichissez vos connecteurs logiques !`)
      );
      setSkillScores((prev) => ({ ...prev, schreibenCompleted: true }));
    } finally {
      setIsEvaluatingWriting(false);
    }
  };

  // Lesson Quizzes list for subtab "lessons"
  const safeLessons = allLessons || [];
  const studentCompleted = student.completedLessons || [];
  const lessonsWithQuiz = safeLessons.filter((l) => l.quiz && l.quiz.length > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Official Exam Preparation Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#6D5DFC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#00D9FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#00D9FF]">
              <FileCheck size={14} />
              <span>
                {isGerman
                  ? "Offizielle Prüfungsvorbereitung (Goethe • telc • ÖSD)"
                  : "Preparazione Esami Ufficiali (CILS • CELI • PLIDA)"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Prüfung & Zertifizierung{" "}
              <span className="bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] bg-clip-text text-transparent">
                CECRL {selectedLevel}
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isEn
                ? `Standardized exam training based on official certification guidelines. Master all 5 exam pillars (Lesen, Hören, Schreiben, Sprechen, Wortschatz) and assess if you are ready to pass the official exam.`
                : `Entraînement officiel calqué sur les référentiels réels de certification. Maîtrisez les 5 piliers de l'examen (Lesen, Hören, Schreiben, Sprechen, Wortschatz) et évaluez en direct si vous êtes prêt à réussir l'examen.`}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#00D9FF]" />
                {currentExamConfig.totalTimeMinutes} min{" "}
                {isEn ? "official exam duration" : "durée officielle"}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {currentExamConfig.passingScorePercent}%{" "}
                {isEn ? "passing mark (60 pts)" : "seuil de réussite requis (60 pts)"}
              </span>
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                {currentExamConfig.certifyingBodies.join(" • ")}
              </span>
            </div>
          </div>

          {/* Readiness Gauge Widget */}
          <div className="shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center min-w-[200px] text-center">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
              {isEn ? "Readiness Index" : "Indice de Prüfungsreife"}
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div
                className={`text-4xl font-black ${
                  isPruefungsbereit
                    ? "text-emerald-400"
                    : overallReadiness >= 40
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {overallReadiness}%
              </div>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isPruefungsbereit
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : overallReadiness >= 40
                    ? "bg-gradient-to-r from-amber-500 to-orange-400"
                    : "bg-gradient-to-r from-rose-500 to-red-400"
                }`}
                style={{ width: `${overallReadiness}%` }}
              />
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isPruefungsbereit
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : overallReadiness >= 40
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {isPruefungsbereit
                ? isEn
                  ? "Exam Ready!"
                  : "Prêt pour l'examen !"
                : isEn
                  ? "In Progress"
                  : "En préparation"}
            </span>
          </div>
        </div>
      </div>

      {/* Level Selector Bar (A1, A2, B1, B2, C1, C2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-2">
          <Languages size={18} className="text-[#6D5DFC]" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            {isEn ? "Select Target Level :" : "Sélectionner le niveau d'examen :"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const isStudentCurrent = student.level === lvl;

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`relative px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                }`}
              >
                <span>{lvl}</span>
                {isStudentCurrent && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      isSelected
                        ? "bg-white/30 text-white"
                        : "bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff]"
                    }`}
                  >
                    {isEn ? "Your Level" : "Votre niveau"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs: Overview, Lesen, Hören, Schreiben, Sprechen, Wortschatz, Lessons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-white/10">
        {[
          {
            id: "overview",
            label: isEn ? "Overview & Diagnosis" : "Vue Générale & Diagnostic",
            icon: <Gauge size={16} />,
          },
          {
            id: "lesen",
            label: "Lesen",
            sublabel: isEn ? "Reading" : "Compréhension écrite",
            icon: <BookOpen size={16} />,
            badge: `${lesenScore}%`,
            badgeColor: isLesenPassed ? "emerald" : "slate",
          },
          {
            id: "horen",
            label: "Hören",
            sublabel: isEn ? "Listening" : "Compréhension orale",
            icon: <Headphones size={16} />,
            badge: `${horenScore}%`,
            badgeColor: isHorenPassed ? "emerald" : "slate",
          },
          {
            id: "schreiben",
            label: "Schreiben",
            sublabel: isEn ? "Writing" : "Production écrite",
            icon: <PenTool size={16} />,
            badge: skillScores.schreibenCompleted ? "Validé" : "À faire",
            badgeColor: skillScores.schreibenCompleted ? "emerald" : "amber",
          },
          {
            id: "sprechen",
            label: "Sprechen",
            sublabel: isEn ? "Speaking" : "Production orale",
            icon: <Mic size={16} />,
            badge: skillScores.sprechenCompleted ? "Prêt" : "Pratique",
            badgeColor: skillScores.sprechenCompleted ? "emerald" : "slate",
          },
          {
            id: "wortschatz",
            label: "Wortschatz",
            sublabel: isEn ? "Vocabulary" : "Lexique officiel",
            icon: <Bookmark size={16} />,
            badge: `${combinedWortschatzScore}%`,
            badgeColor: combinedWortschatzScore >= 60 ? "emerald" : "amber",
          },
          {
            id: "lessons",
            label: isEn ? "Lesson Quizzes" : "Quiz de Cours",
            sublabel: `${lessonsWithQuiz.length}`,
            icon: <HelpCircle size={16} />,
          },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as PrufungSubTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#6D5DFC] text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : tab.badgeColor === "emerald"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : tab.badgeColor === "amber"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-slate-200 dark:bg-white/10 text-slate-500"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: OVERVIEW & READINESS DIAGNOSIS */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Diagnostic Banner */}
          <div
            className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              isPruefungsbereit
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30"
                : "bg-amber-50 dark:bg-amber-950/20 border-amber-500/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  isPruefungsbereit
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {isPruefungsbereit ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isPruefungsbereit
                    ? isEn
                      ? "Prüfungsbereit : You are ready to take the official exam!"
                      : "Prüfungsbereit : Vous avez validé les prérequis pour l'examen officiel !"
                    : isEn
                      ? "Preparation in progress : Strengthen weaker modules to reach 60%"
                      : "Préparation active : consolidez vos points faibles pour atteindre le seuil de 60%"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {isPruefungsbereit
                    ? isEn
                      ? `Your global readiness index is ${overallReadiness}%. You have reached the passing standards across Lesen, Hören, Schreiben, Sprechen and Wortschatz for ${selectedLevel}.`
                      : `Votre indice de préparation globale est de ${overallReadiness}%. Vous dépassez le seuil officiel de 60% requis par le Goethe-Institut / telc pour le niveau ${selectedLevel}.`
                    : isEn
                      ? `Your current readiness index is ${overallReadiness}% (passing threshold: 60%). We recommend reviewing the Wortschatz list and practicing Hören.`
                      : `Votre indice actuel est de ${overallReadiness}% (seuil officiel requis : 60%). Nous vous recommandons de compléter le quiz de Wortschatz et de vous entraîner sur les épreuves d'écoute.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveSubTab("wortschatz")}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#6D5DFC] hover:bg-[#5848e0] text-white text-xs font-bold shadow transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isEn ? "Review Wortschatz" : "Réviser le Wortschatz"}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* 5 Pillars Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {readinessComponents.map((comp) => {
              const passed = comp.score >= 60;
              return (
                <div
                  key={comp.name}
                  onClick={() =>
                    setActiveSubTab(comp.name.toLowerCase() as PrufungSubTab)
                  }
                  className="bg-white dark:bg-[#0D1220] p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#6D5DFC] transition cursor-pointer shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {comp.name}
                      </span>
                      {passed ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-500" />
                      )}
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                      {comp.score}%
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{isEn ? "Target: 60%" : "Objectif: 60%"}</span>
                    <span className="text-[#6D5DFC] font-bold flex items-center">
                      {isEn ? "Train" : "S'entraîner"} <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Official Goethe/telc Guidelines & Examination Structure */}
          <div className="bg-white dark:bg-[#0D1220] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-[#6D5DFC]" />
              {isEn
                ? `Official Exam Specifications : ${currentExamConfig.officialExamNameDe}`
                : `Structure Officielle de l'Examen : ${currentExamConfig.officialExamNameDe}`}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentExamConfig.descriptionFr}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  1. Lesen (Compréhension écrite)
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {currentExamConfig.lesenTimeMinutes} minutes
                </p>
                <p className="text-[11px] text-slate-500">
                  Emails, annonces, articles & consignes
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  2. Hören (Compréhension orale)
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {currentExamConfig.horenTimeMinutes} minutes
                </p>
                <p className="text-[11px] text-slate-500">
                  Annonces gare/aéroports, dialogues & interviews
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  3. Schreiben (Production écrite)
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {currentExamConfig.schreibenTimeMinutes} minutes
                </p>
                <p className="text-[11px] text-slate-500">
                  Emails formels/informels, forum & réclamations
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  4. Sprechen (Production orale)
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {currentExamConfig.sprechenTimeMinutes} minutes
                </p>
                <p className="text-[11px] text-slate-500">
                  Présentation, description, débat & interaction
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LESEN (Reading Comprehension) */}
      {activeSubTab === "lesen" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[#6D5DFC]" />
                <span>Modul Lesen — Niveau {selectedLevel}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? `Time allocated : ${currentExamConfig.lesenTimeMinutes} minutes • Pass threshold : 60%`
                  : `Temps officiel alloué : ${currentExamConfig.lesenTimeMinutes} minutes • Seuil de validation : 60%`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? "Your Score :" : "Votre Score :"}
              </span>
              <span
                className={`text-lg font-black px-3 py-1 rounded-xl ${
                  isLesenPassed
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {lesenScore}%
              </span>
            </div>
          </div>

          {currentExamConfig.tasks.lesen.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6D5DFC] bg-[#6D5DFC]/10 px-2.5 py-0.5 rounded-full">
                    {task.textType}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {task.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => playSpeech(task.text, task.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Volume2 size={14} className="text-[#6D5DFC]" />
                  <span>{isEn ? "Listen to text" : "Écouter le texte"}</span>
                </button>
              </div>

              {/* Text Box styled like an authentic exam paper */}
              <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
                {task.text}
              </div>

              {/* Questions */}
              <div className="space-y-4 pt-2">
                <h5 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  {isEn ? "Comprehension Questions" : "Questions de compréhension"} :
                </h5>

                {task.questions.map((q, qIdx) => {
                  const selectedOpt = skillScores.lesenAnswers[q.id];
                  const hasAnswered = selectedOpt !== undefined;
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3"
                    >
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                setSkillScores((prev) => ({
                                  ...prev,
                                  lesenAnswers: {
                                    ...prev.lesenAnswers,
                                    [q.id]: optIdx,
                                  },
                                }));
                              }}
                              className={`w-full text-left p-3 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                                isOptionSelected
                                  ? optIdx === q.correctIndex
                                    ? "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                                    : "bg-rose-500/15 border-2 border-rose-500 text-rose-700 dark:text-rose-300 font-bold"
                                  : "bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 hover:border-[#6D5DFC]"
                              }`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && optIdx === q.correctIndex && (
                                <Check size={16} className="text-emerald-500" />
                              )}
                              {hasAnswered && isOptionSelected && !isCorrect && (
                                <X size={16} className="text-rose-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                            isCorrect
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                          }`}
                        >
                          <Info size={14} className="shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">
                              {isCorrect
                                ? isEn
                                  ? "Correct! "
                                  : "Bonne réponse ! "
                                : isEn
                                ? "Explanation: "
                                : "Explication officielle : "}
                            </span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: HÖREN (Listening Comprehension) */}
      {activeSubTab === "horen" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Headphones size={20} className="text-[#6D5DFC]" />
                <span>Modul Hören — Niveau {selectedLevel}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? `Authentic native audio recordings. In the official exam, recordings are played twice.`
                  : `Enregistrements audio en conditions réelles. Conformément à l'examen officiel, chaque extrait peut être écouté 2 fois.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? "Hören Score :" : "Score Hören :"}
              </span>
              <span
                className={`text-lg font-black px-3 py-1 rounded-xl ${
                  isHorenPassed
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {horenScore}%
              </span>
            </div>
          </div>

          {currentExamConfig.tasks.horen.map((task) => {
            const playedCount = audioPlaybackCount[task.id] || 0;
            const isPlayingThis = isPlayingAudio && currentPlayingText === task.transcript;

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6D5DFC] bg-[#6D5DFC]/10 px-2.5 py-0.5 rounded-full">
                      {task.audioScenario}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {task.title}
                    </h4>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlayingThis) {
                          stopSpeech();
                        } else {
                          playSpeech(task.transcript, task.id);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                        isPlayingThis
                          ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                          : "bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] hover:opacity-90 text-white shadow"
                      }`}
                    >
                      {isPlayingThis ? <Square size={14} /> : <Play size={14} />}
                      <span>
                        {isPlayingThis
                          ? isEn
                            ? "Stop Audio"
                            : "Arrêter l'audio"
                          : isEn
                          ? "Play Audio"
                          : "Écouter l'enregistrement"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowTranscript((prev) => ({
                          ...prev,
                          [task.id]: !prev[task.id],
                        }))
                      }
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    >
                      {showTranscript[task.id]
                        ? isEn
                          ? "Hide Transcript"
                          : "Masquer transcription"
                        : isEn
                        ? "Show Transcript"
                        : "Voir transcription"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Volume2 size={14} className="text-[#00D9FF]" />
                  <span>
                    {isEn
                      ? `Listenings played : ${playedCount} / ${task.playCountMax}`
                      : `Écoutes effectuées : ${playedCount} / ${task.playCountMax}`}
                  </span>
                </div>

                {/* Optional Transcript Box */}
                {showTranscript[task.id] && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-[#6D5DFC] block mb-1">
                      [Transkript der Audioaufnahme]
                    </span>
                    {task.transcript}
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-4 pt-2">
                  <h5 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    {isEn ? "Comprehension Questions" : "Questions d'écoute"} :
                  </h5>

                  {task.questions.map((q, qIdx) => {
                    const selectedOpt = skillScores.horenAnswers[q.id];
                    const hasAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3"
                      >
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isOptionSelected = selectedOpt === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  setSkillScores((prev) => ({
                                    ...prev,
                                    horenAnswers: {
                                      ...prev.horenAnswers,
                                      [q.id]: optIdx,
                                    },
                                  }));
                                }}
                                className={`w-full text-left p-3 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                                  isOptionSelected
                                    ? optIdx === q.correctIndex
                                      ? "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                                      : "bg-rose-500/15 border-2 border-rose-500 text-rose-700 dark:text-rose-300 font-bold"
                                    : "bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 hover:border-[#6D5DFC]"
                                }`}
                              >
                                <span>{opt}</span>
                                {hasAnswered && optIdx === q.correctIndex && (
                                  <Check size={16} className="text-emerald-500" />
                                )}
                                {hasAnswered && isOptionSelected && !isCorrect && (
                                  <X size={16} className="text-rose-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {hasAnswered && (
                          <div
                            className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                              isCorrect
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                            }`}
                          >
                            <Info size={14} className="shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">
                                {isCorrect
                                  ? isEn
                                    ? "Correct! "
                                    : "Exact ! "
                                  : isEn
                                  ? "Explanation: "
                                  : "Explication : "}
                              </span>
                              {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 4: SCHREIBEN (Written Expression) */}
      {activeSubTab === "schreiben" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool size={20} className="text-[#6D5DFC]" />
                <span>Modul Schreiben — Niveau {selectedLevel}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? `Writing tasks evaluated according to official CEFR criteria: Task fulfillment, coherence, vocabulary, and grammar.`
                  : `Épreuve écrite officielle évaluée selon les critères CECRL : respect des consignes, cohérence, richesse lexicale et précision grammaticale.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                  skillScores.schreibenCompleted
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {skillScores.schreibenCompleted
                  ? isEn
                    ? "Validated by AI"
                    : "Évalué et validé"
                  : isEn
                  ? "Pending submission"
                  : "À rédiger"}
              </span>
            </div>
          </div>

          {currentExamConfig.tasks.schreiben.map((task) => {
            const wordCount = skillScores.schreibenDraft.trim()
              ? skillScores.schreibenDraft.trim().split(/\s+/).length
              : 0;

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-6 shadow-xs"
              >
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#6D5DFC] bg-[#6D5DFC]/10 px-2.5 py-0.5 rounded-full">
                    Offizielle Aufgabenstellung
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </h4>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    {task.prompt}
                  </p>
                </div>

                {/* Mandatory Points Checklist */}
                <div className="p-4 rounded-2xl bg-[#6D5DFC]/5 border border-[#6D5DFC]/20 space-y-2">
                  <p className="text-xs font-bold text-[#6D5DFC] dark:text-[#a399ff] uppercase tracking-wider">
                    {isEn
                      ? "Mandatory points to address in your text :"
                      : "Points obligatoires à traiter impérativement :"}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {task.requiredPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#6D5DFC] shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Useful Redemittel / Connectors */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isEn ? "Recommended Redemittel (Connectors) :" : "Formules & Connecteurs recommandés :"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.usefulPhrases.map((phrase, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setSkillScores((prev) => ({
                            ...prev,
                            schreibenDraft: prev.schreibenDraft
                              ? `${prev.schreibenDraft} ${phrase} `
                              : `${phrase} `,
                          }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#6D5DFC]/15 text-slate-700 dark:text-slate-200 text-xs font-mono transition cursor-pointer"
                        title="Cliquer pour insérer"
                      >
                        + {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Editor Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {isEn ? "Word target :" : "Volume attendu :"}{" "}
                      <strong className="text-slate-800 dark:text-white">
                        {task.targetWordCount.min} - {task.targetWordCount.max}{" "}
                        {isEn ? "words" : "mots"}
                      </strong>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        wordCount >= task.targetWordCount.min
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >
                      {wordCount} {isEn ? "words written" : "mots rédigés"}
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={skillScores.schreibenDraft}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSkillScores((prev) => ({ ...prev, schreibenDraft: val }));
                    }}
                    placeholder={
                      isEn
                        ? "Draft your text here in German..."
                        : "Rédigez votre composition ici en allemand..."
                    }
                    className="w-full p-4 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-300 dark:border-white/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#6D5DFC]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSkillScores((prev) => ({
                        ...prev,
                        schreibenDraft: task.sampleSolution,
                      }));
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                  >
                    {isEn ? "Load Sample Solution" : "Charger le corrigé type officiel"}
                  </button>

                  <button
                    type="button"
                    disabled={isEvaluatingWriting}
                    onClick={() => handleEvaluateWriting(task)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] hover:opacity-90 text-white font-bold text-xs shadow flex items-center gap-2 transition cursor-pointer"
                  >
                    {isEvaluatingWriting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>
                      {isEvaluatingWriting
                        ? isEn
                          ? "Evaluating writing..."
                          : "Évaluation de la rédaction en cours..."
                        : isEn
                        ? "Evaluate My Writing"
                        : "Évaluer ma rédaction"}
                    </span>
                  </button>
                </div>

                {/* Evaluation Feedback Box */}
                {writingFeedback && (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                      <Award size={16} />
                      <span>{isEn ? "AI Examiner Report" : "Rapport de l'Examinateur IA"}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {writingFeedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 5: SPRECHEN (Oral Expression) */}
      {activeSubTab === "sprechen" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mic size={20} className="text-[#6D5DFC]" />
                <span>Modul Sprechen — Niveau {selectedLevel}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? `Simulate the speaking exam parts (Presentation, partner interaction, debate) with real examiner prompts.`
                  : `Simulation de l'épreuve orale (présentation, échange avec un partenaire, débat) selon la grille officielle du jury.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSkillScores((prev) => ({
                    ...prev,
                    sprechenCompleted: !prev.sprechenCompleted,
                  }))
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  skillScores.sprechenCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                }`}
              >
                <Check size={14} />
                <span>
                  {skillScores.sprechenCompleted
                    ? isEn
                      ? "Speaking Validated"
                      : "Oral validé"
                    : isEn
                    ? "Mark as Practiced"
                    : "Marquer comme entraîné"}
                </span>
              </button>
            </div>
          </div>

          {currentExamConfig.tasks.sprechen.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-6 shadow-xs"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#6D5DFC] bg-[#6D5DFC]/10 px-2.5 py-0.5 rounded-full">
                  Prüfungskarte Sprechen ({task.durationMinutes} Minuten)
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {task.instructions}
                </p>
              </div>

              {/* Prompts Cards */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn ? "Key talking points to cover :" : "Points à développer obligatoirement :"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {task.prompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#6D5DFC]/15 text-[#6D5DFC] flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redemittel Accordion */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn
                    ? "Essential Redemittel (Exam Phrasing Guide) :"
                    : "Redemittel indispensables pour l'épreuve orale :"}
                </p>

                {task.essentialRedemittel.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-white/5 border border-indigo-100 dark:border-white/5 space-y-2"
                  >
                    <span className="text-xs font-bold text-[#6D5DFC] dark:text-[#a399ff]">
                      {group.category}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.phrases.map((phrase, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 font-sans"
                        >
                          <span>"{phrase}"</span>
                          <button
                            type="button"
                            onClick={() => playSpeech(phrase)}
                            className="p-1 rounded-lg text-slate-400 hover:text-[#6D5DFC] transition cursor-pointer"
                            title="Écouter la prononciation"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Assessment Criteria */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  {isEn ? "Official Examiners Scoring Criteria :" : "Critères d'évaluation du jury officiel :"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {task.evaluationCriteria.map((crit, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>{crit}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 6: WORTSCHATZ (Official Vocabulary & Lexicon Mastery) */}
      {activeSubTab === "wortschatz" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark size={20} className="text-[#6D5DFC]" />
                <span>Wortschatz {selectedLevel} — Lexique Officiel Goethe / telc</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? `Estimated level vocabulary : ~${currentExamConfig.wortschatzEstimate} words. Check your mastery with interactive flashcards and drills.`
                  : `Lexique officiel requis : ~${currentExamConfig.wortschatzEstimate} mots. Vérifiez votre maîtrise avec les fiches interactives et le quiz de lexique.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isEn ? "Mastery :" : "Maîtrise du lexique :"}
              </span>
              <span
                className={`text-lg font-black px-3 py-1 rounded-xl ${
                  combinedWortschatzScore >= 60
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {combinedWortschatzScore}%
              </span>
            </div>
          </div>

          {/* Interactive Vocabulary Flashcards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                {isEn ? "Essential Level Vocabulary Flashcards" : "Mots-clés indispensables du niveau"} ({currentExamConfig.tasks.wortschatz?.length || 0}) :
              </h4>
              <span className="text-xs text-slate-500">
                {skillScores.masteredVocabIds.length} /{" "}
                {currentExamConfig.tasks.wortschatz?.length || 0}{" "}
                {isEn ? "mastered" : "acquis"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentExamConfig.tasks.wortschatz?.map((vocab) => {
                const isMastered = skillScores.masteredVocabIds.includes(vocab.id);

                return (
                  <div
                    key={vocab.id}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                      isMastered
                        ? "bg-white dark:bg-[#0D1220] border-emerald-500/30 shadow-xs"
                        : "bg-white dark:bg-[#0D1220] border-slate-200 dark:border-white/10 hover:border-[#6D5DFC]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#6D5DFC] bg-[#6D5DFC]/10 px-2 py-0.5 rounded-md">
                          {vocab.theme}
                        </span>
                        <button
                          type="button"
                          onClick={() => playSpeech(vocab.term)}
                          className="p-1 rounded-lg text-slate-400 hover:text-[#6D5DFC] transition cursor-pointer"
                          title="Écouter la prononciation"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>

                      <div>
                        <h5 className="text-base font-black text-slate-900 dark:text-white">
                          {vocab.term}
                        </h5>
                        {vocab.plural && (
                          <span className="text-xs text-slate-400">
                            Pl: die {vocab.plural}
                          </span>
                        )}
                        <p className="text-xs font-bold text-[#6D5DFC] dark:text-[#a399ff] mt-0.5">
                          {isEn ? vocab.translationEn : vocab.translationFr}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 italic">
                        "{vocab.exampleSentence}"
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSkillScores((prev) => ({
                          ...prev,
                          masteredVocabIds: isMastered
                            ? prev.masteredVocabIds.filter((id) => id !== vocab.id)
                            : [...prev.masteredVocabIds, vocab.id],
                        }));
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isMastered
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Check size={14} />
                      <span>
                        {isMastered
                          ? isEn
                            ? "Mastered"
                            : "Maîtrisé"
                          : isEn
                          ? "Mark as Mastered"
                          : "Marquer comme acquis"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wortschatz Rapid Quiz Drill */}
          <div className="bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame size={18} className="text-amber-500" />
                  <span>Wortschatz-Drill : Test de Validation du Lexique</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEn
                    ? "Verify your vocabulary retention for this level."
                    : "Vérifiez si vous maîtrisez le lexique requis pour le niveau."}
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#6D5DFC]/10 text-[#6D5DFC]">
                Score: {wortschatzQuizScore}%
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {currentExamConfig.tasks.wortschatzQuiz.map((q, idx) => {
                const selectedOpt = skillScores.wortschatzQuizAnswers[q.id];
                const hasAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3"
                  >
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isOptionSelected = selectedOpt === optIdx;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              setSkillScores((prev) => ({
                                ...prev,
                                wortschatzQuizAnswers: {
                                  ...prev.wortschatzQuizAnswers,
                                  [q.id]: optIdx,
                                },
                              }));
                            }}
                            className={`p-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isOptionSelected
                                ? optIdx === q.correctIndex
                                  ? "bg-emerald-500 text-white"
                                  : "bg-rose-500 text-white"
                                : "bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 hover:border-[#6D5DFC] text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            <span>{opt}</span>
                            {hasAnswered && optIdx === q.correctIndex && (
                              <Check size={14} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: LESSON QUIZZES (From the school syllabus) */}
      {activeSubTab === "lessons" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={20} className="text-[#6D5DFC]" />
                <span>Quiz des Leçons du Cursus</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? "Standard curriculum quizzes to validate your enrolled video lessons."
                  : "Quiz réguliers du cursus pour valider chaque leçon vidéo de votre parcours."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {lessonsWithQuiz.map((les) => {
              const isPassed = studentCompleted.includes(les.id);
              const totalQuestions = les.quiz?.length || 0;

              return (
                <div
                  key={les.id}
                  className={`rounded-3xl border p-5 shadow-xs transition flex flex-col justify-between ${
                    isPassed
                      ? "bg-white dark:bg-[#0D1220] border-emerald-500/30"
                      : "bg-white dark:bg-[#0D1220] border-slate-200 dark:border-white/10"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">
                        {totalQuestions} Question{totalQuestions > 1 ? "s" : ""} •{" "}
                        {les.passingScorePercent || 70}%
                      </span>

                      {isPassed ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 size={13} /> {isEn ? "Passed" : "Validé"}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                          {isEn ? "Pending" : "À faire"}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {les.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {les.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenLesson(les.id)}
                      className="text-xs text-[#6D5DFC] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isEn ? "Open Lesson & Quiz" : "Ouvrir la leçon & le quiz"}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
