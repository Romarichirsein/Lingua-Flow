import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  Lesson,
  Student,
  School,
  SupportedLanguage,
  UILocale,
} from "../../types";
import { translations } from "../../lib/translations";
import { NeonButton } from "../common/NeonButton";
import { ConfettiShower, playCelebrationSound } from "../common/CelebrationEffects";
import { UniversalVideoPlayer } from "../common/UniversalVideoPlayer";
import {
  quizSuccess,
  quizSuccessCelebration,
  scoreBadgePop,
  celebrationParticle,
  lessonUnlockVariant,
  isReducedMotion,
} from "../../lib/motionVariants";
import {
  Play,
  CheckCircle2,
  Volume2,
  HelpCircle,
  BookOpen,
  Award,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Flame,
  Star,
  Check,
} from "lucide-react";

interface InteractiveLessonPlayerProps {
  lesson: Lesson;
  student: Student;
  school: School;
  locale: UILocale;
  onCompleteLesson: (lessonId: string) => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  isAlreadyCompleted: boolean;
  hasPrevLesson?: boolean;
  hasNextLesson?: boolean;
}

// Framer motion variants for lesson transition
const lessonTransitionVariants: Variants = {
  initial: { opacity: 0, x: 25, scale: 0.98 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -25,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

export const InteractiveLessonPlayer: React.FC<InteractiveLessonPlayerProps> = ({
  lesson,
  student,
  school,
  locale,
  onCompleteLesson,
  onNextLesson,
  onPrevLesson,
  isAlreadyCompleted,
  hasPrevLesson = false,
  hasNextLesson = false,
}) => {
  const t = translations[locale];

  const vocabList = lesson.vocabulary || [];
  const quizList = lesson.quiz || [];
  const totalVocab = vocabList.length;
  const totalQuiz = quizList.length;

  // Active sub-tab in lesson: video | theory | vocabulary | quiz
  const [activeTab, setActiveTab] = useState<"video" | "theory" | "vocabulary" | "quiz">("video");

  // Dynamic Live Watermark Time & Floating position (shifts dynamically to prevent screen capture masking)
  const [currentTimeStr, setCurrentTimeStr] = useState(new Date().toISOString());
  const [watermarkOffset, setWatermarkOffset] = useState({ x: 10, y: 15 });
  const [showDrmWarning, setShowDrmWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }, 1000);

    const shiftTimer = setInterval(() => {
      setWatermarkOffset({
        x: Math.floor(Math.random() * 50) + 10,
        y: Math.floor(Math.random() * 60) + 15,
      });
    }, 8000);

    // Global shortcut listener to prevent video source / page saving
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "s" || e.key === "S" || e.key === "u" || e.key === "U" || e.key === "p" || e.key === "P")
      ) {
        e.preventDefault();
        setShowDrmWarning(true);
        setTimeout(() => setShowDrmWarning(false), 4000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(timer);
      clearInterval(shiftTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Flashcards state
  const [activeVocabIndex, setActiveVocabIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [justCompletedToast, setJustCompletedToast] = useState(false);

  // Reset quiz state when switching lessons
  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveVocabIndex(0);
    setIsFlipped(false);
    setActiveTab("video");
  }, [lesson.id]);

  // Audio Speech Synthesis for Pronunciation
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = school.language === "german" ? "de-DE" : "it-IT";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle Manual Completion
  const handleTriggerComplete = () => {
    onCompleteLesson(lesson.id);
    setShowCelebration(true);
    setJustCompletedToast(true);
    playCelebrationSound("lesson");
    setTimeout(() => {
      setShowCelebration(false);
      setJustCompletedToast(false);
    }, 3500);
  };

  // Handle Quiz Submission
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = () => {
    if (quizList.length === 0) return;
    let correctCount = 0;
    quizList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / quizList.length) * 100);
    setQuizScore(scorePercent);
    setQuizSubmitted(true);

    if (scorePercent >= (lesson.passingScorePercent || 70)) {
      onCompleteLesson(lesson.id);
      setShowCelebration(true);
      setJustCompletedToast(true);
      playCelebrationSound("quiz");
      setTimeout(() => {
        setShowCelebration(false);
        setJustCompletedToast(false);
      }, 3500);
    }
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const isYouTubeUrl =
    lesson.videoUrl?.includes("youtube.com/watch") ||
    lesson.videoUrl?.includes("youtu.be/") ||
    lesson.videoUrl?.includes("youtube.com/embed");

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1`;
      }
      if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1]?.split("&")[0];
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiShower active={showCelebration} durationMs={3500} />

      {/* MOTIVATIONAL FEEDBACK TOAST */}
      <AnimatePresence>
        {justCompletedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-4 text-white shadow-xl shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <Trophy size={20} className="animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black">
                  {locale === "en"
                    ? `🎉 Well done ${student.name}! Lesson completed successfully!`
                    : `🎉 Bravo ${student.name} ! Leçon validée avec succès !`}
                </h4>
                <p className="text-[11px] text-emerald-100">
                  {locale === "en"
                    ? "+50 XP earned • Your progress has been saved."
                    : "+50 XP gagnés • Votre progression a été enregistrée."}
                </p>
              </div>
            </div>

            {hasNextLesson && onNextLesson && (
              <button
                type="button"
                onClick={onNextLesson}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-emerald-700 text-xs font-bold shadow hover:bg-emerald-50 transition cursor-pointer"
              >
                <span>{locale === "en" ? "Next Lesson" : "Leçon suivante"}</span>
                <ChevronRight size={14} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Lesson Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lesson.id}
          variants={lessonTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          {/* Lesson Title & Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase">
                  {school.language === "german" ? t.common.german : t.common.italian}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> {lesson.durationMinutes} min
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <Star size={12} /> 50 XP
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lesson.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Previous / Next buttons */}
              {hasPrevLesson && onPrevLesson && (
                <button
                  type="button"
                  onClick={onPrevLesson}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer min-h-[38px]"
                  title={locale === "en" ? "Previous lesson" : "Leçon précédente"}
                >
                  <ChevronLeft size={15} />
                  <span className="hidden sm:inline">{locale === "en" ? "Previous" : "Précédente"}</span>
                </button>
              )}

              {isAlreadyCompleted ? (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-500 border border-emerald-500/30 min-h-[38px]">
                  <CheckCircle2 size={16} />
                  <span>{t.student.validated}</span>
                </div>
              ) : (
                <NeonButton
                  variant="emerald"
                  size="sm"
                  onClick={handleTriggerComplete}
                  icon={<CheckCircle2 size={16} />}
                >
                  {t.student.markCompleted}
                </NeonButton>
              )}

              {hasNextLesson && onNextLesson && (
                <button
                  type="button"
                  onClick={onNextLesson}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer shadow-sm min-h-[38px]"
                  title={locale === "en" ? "Next lesson" : "Leçon suivante"}
                >
                  <span className="hidden sm:inline">{locale === "en" ? "Next" : "Suivante"}</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Sub-Tabs with Framer Motion indicators */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === "video"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Play size={14} />
              <span>{locale === "en" ? "Secure Video" : "Vidéo Sécurisée"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("theory")}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === "theory"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <BookOpen size={14} />
              <span>{locale === "en" ? "Notes & Theory" : "Cours & Notes"}</span>
            </button>

            {totalVocab > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("vocabulary")}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  activeTab === "vocabulary"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <Volume2 size={14} />
                <span>{locale === "en" ? "Vocabulary" : "Vocabulaire"} ({totalVocab})</span>
              </button>
            )}

            {totalQuiz > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <HelpCircle size={14} />
                <span>{locale === "en" ? "Validation Quiz" : "Quiz de Validation"} ({totalQuiz})</span>
              </button>
            )}
          </div>

          {/* TAB 1: SECURE VIDEO STREAMING */}
          <AnimatePresence mode="wait">
            {activeTab === "video" && (
              <motion.div
                key="video-tab"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* DRM Alert Toast on attempted copy/download */}
                <AnimatePresence>
                  {showDrmWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5 font-medium shadow-lg backdrop-blur-sm"
                    >
                      <Shield size={18} className="shrink-0 text-amber-500" />
                      <span>
                        {locale === "en"
                          ? "⚠️ Protected DRM Stream: Video download, source extraction, and screen recording are strictly prohibited."
                          : "⚠️ Flux Sécurisé DRM : Le téléchargement, l'extraction de la vidéo et l'enregistrement sont strictement interdits."}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* DRM Security Header Bar */}
                <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900/90 text-white text-[11px] font-mono border border-white/10 shadow-sm select-none">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-400">DRM ENCRYPTED STREAM</span>
                    <span className="hidden sm:inline text-slate-400">• Anti-Download Active</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Session ID: <span className="text-cyan-400">{student.id}</span>
                  </div>
                </div>

                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDrmWarning(true);
                    setTimeout(() => setShowDrmWarning(false), 4000);
                  }}
                  className="relative w-full"
                >
                  <UniversalVideoPlayer
                    videoUrl={lesson.videoUrl}
                    poster={lesson.videoPoster}
                    title={lesson.title}
                    watermarkText={`${school.name} • ${student.name}`}
                    watermarkEmail={student.email}
                    watermarkSessionId={student.id}
                    showDrmWatermark={true}
                    className="shadow-2xl rounded-3xl"
                  />
                </div>

                {/* Lesson Summary and DRM footer */}
                <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      {locale === "en" ? "Lesson Summary" : "Résumé de la leçon"}
                    </h4>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      <Shield size={12} />
                      {locale === "en" ? "DRM Protected" : "Protégé par DRM"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lesson.summary}
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 2: THEORY & LESSON NOTES */}
            {activeTab === "theory" && (
              <motion.div
                key="theory-tab"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="neon-card rounded-3xl p-6 sm:p-7 space-y-4"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-500" />
                  {locale === "en" ? "Theoretical Course Material" : "Support de cours théorique"}
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 whitespace-pre-line text-slate-700 dark:text-slate-300 font-normal">
                  {lesson.theoryContent || lesson.summary}
                </div>
              </motion.div>
            )}

            {/* TAB 3: VOCABULARY FLASHCARDS */}
            {activeTab === "vocabulary" && totalVocab > 0 && (
              <motion.div
                key="vocab-tab"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 max-w-xl mx-auto py-4"
              >
                {/* Flashcard Card with Flip Effect */}
                <div className="perspective-1000">
                  <motion.div
                    id={`flashcard-${activeVocabIndex}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative min-h-[230px] rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-xl cursor-pointer flex flex-col items-center justify-center text-center transition-all select-none"
                  >
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                      {locale === "en" ? `Card ${activeVocabIndex + 1} / ${totalVocab}` : `Carte ${activeVocabIndex + 1} / ${totalVocab}`}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (vocabList[activeVocabIndex]) {
                          handleSpeak(vocabList[activeVocabIndex].term);
                        }
                      }}
                      className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition cursor-pointer"
                      title={locale === "en" ? "Listen to audio pronunciation" : "Écouter la prononciation audio"}
                    >
                      <Volume2 size={18} />
                    </button>

                    {!isFlipped ? (
                      <div className="space-y-2">
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                          {vocabList[activeVocabIndex]?.term || ""}
                        </p>
                        <p className="text-xs text-slate-400">{locale === "en" ? "Click to reveal translation" : "Cliquez pour voir la traduction"}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {vocabList[activeVocabIndex]?.translation || ""}
                        </p>
                        {vocabList[activeVocabIndex]?.exampleSentence && (
                          <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3 text-xs">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 italic">
                              "{vocabList[activeVocabIndex].exampleSentence}"
                            </p>
                            {vocabList[activeVocabIndex]?.exampleTranslation && (
                              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                                {vocabList[activeVocabIndex].exampleTranslation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Flashcards controls */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={activeVocabIndex === 0}
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveVocabIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 disabled:opacity-30 transition cursor-pointer"
                  >
                    {locale === "en" ? "Previous" : "Précédente"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFlipped(false);
                      if (vocabList[activeVocabIndex]) {
                        handleSpeak(vocabList[activeVocabIndex].term);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                  >
                    <Volume2 size={15} /> {locale === "en" ? "Pronounce" : "Prononcer"}
                  </button>

                  <button
                    type="button"
                    disabled={activeVocabIndex >= totalVocab - 1}
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveVocabIndex((prev) =>
                        Math.min(totalVocab - 1, prev + 1)
                      );
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white disabled:opacity-30 transition cursor-pointer"
                  >
                    {locale === "en" ? "Next" : "Suivante"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 4: QUIZ VALIDATION */}
            {activeTab === "quiz" && totalQuiz > 0 && (
              <motion.div
                key="quiz-tab"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="neon-card rounded-3xl p-6 sm:p-7 space-y-6 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Award size={18} className="text-amber-500" />
                      {t.student.quizTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {locale === "en"
                        ? `Passing score: ${lesson.passingScorePercent || 70}%`
                        : `Score minimum pour valider : ${lesson.passingScorePercent || 70}%`}
                    </p>
                  </div>

                  {quizSubmitted && quizScore !== null && (
                    <motion.div
                      variants={quizScore >= (lesson.passingScorePercent || 70) ? quizSuccess : scoreBadgePop}
                      initial="hidden"
                      animate="visible"
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black shadow-lg ${
                        quizScore >= (lesson.passingScorePercent || 70)
                          ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 shadow-emerald-500/10"
                          : "bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-rose-500/10"
                      }`}
                    >
                      {quizScore >= (lesson.passingScorePercent || 70) && !isReducedMotion() && (
                        <>
                          <motion.span
                            variants={celebrationParticle}
                            initial="initial"
                            animate="animate"
                            custom={0}
                            className="absolute -top-2 -left-2 text-amber-400 pointer-events-none"
                          >
                            ✨
                          </motion.span>
                          <motion.span
                            variants={celebrationParticle}
                            initial="initial"
                            animate="animate"
                            custom={1}
                            className="absolute -top-2 -right-2 text-emerald-400 pointer-events-none"
                          >
                            ⭐
                          </motion.span>
                        </>
                      )}
                      <span className="font-mono text-sm">{quizScore}%</span>
                      <span>
                        {quizScore >= (lesson.passingScorePercent || 70)
                          ? (locale === "en" ? "🎉 Passed!" : "🎉 Réussi !")
                          : (locale === "en" ? "Needs Review" : "À revoir")}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-6">
                  {lesson.quiz.map((q, qIdx) => {
                    const selectedOpt = selectedAnswers[qIdx];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = isAnswered && selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id || qIdx}
                        className="rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 p-4 border border-slate-200/60 dark:border-slate-800 space-y-3"
                      >
                        <p className="font-bold text-xs text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isOptionSelected = selectedOpt === optIdx;
                            let optionStyle =
                              "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300";

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                optionStyle =
                                  "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                              } else if (isOptionSelected && !isCorrect) {
                                optionStyle =
                                  "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                              }
                            } else if (isOptionSelected) {
                              optionStyle =
                                "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold";
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleAnswerSelect(qIdx, optIdx)}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer ${optionStyle}`}
                              >
                                <span className="font-mono font-bold mr-2 text-[11px]">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && q.explanation && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            💡 <strong>{locale === "en" ? "Explanation:" : "Explication :"}</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {quizSubmitted ? (
                    <button
                      type="button"
                      onClick={handleRetryQuiz}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition min-h-[40px] cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>{locale === "en" ? "Retry Quiz" : "Recommencer le quiz"}</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {!quizSubmitted && (
                    <NeonButton
                      variant="primary"
                      size="sm"
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < totalQuiz}
                      icon={<Sparkles size={15} />}
                    >
                      {t.student.submitQuiz}
                    </NeonButton>
                  )}

                  {quizSubmitted && onNextLesson && (
                    <NeonButton
                      variant="emerald"
                      size="sm"
                      onClick={onNextLesson}
                      icon={<ChevronRight size={15} />}
                    >
                      {locale === "en" ? "Next Lesson" : "Leçon suivante"}
                    </NeonButton>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
