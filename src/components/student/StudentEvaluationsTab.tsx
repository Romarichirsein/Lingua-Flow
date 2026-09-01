import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Student, School, Program, Lesson, QuizQuestion, UILocale } from "../../types";
import { translations } from "../../lib/translations";
import { NeonButton } from "../common/NeonButton";
import { quizSuccess, unlockedModule, isReducedMotion } from "../../lib/motionVariants";
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

interface StudentEvaluationsTabProps {
  student: Student;
  school: School;
  program: Program | undefined;
  allLessons: Lesson[];
  locale: UILocale;
  onCompleteLesson: (lessonId: string) => void;
  onOpenLesson: (lessonId: string) => void;
}

export const StudentEvaluationsTab: React.FC<StudentEvaluationsTabProps> = ({
  student,
  school,
  program,
  allLessons,
  locale,
  onCompleteLesson,
  onOpenLesson,
}) => {
  const t = translations[locale];

  // Lessons with quizzes
  const safeLessons = allLessons || [];
  const studentCompleted = student.completedLessons || [];
  const lessonsWithQuiz = safeLessons.filter((l) => l.quiz && l.quiz.length > 0);

  // Active quiz runner modal
  const [activeQuizLesson, setActiveQuizLesson] = useState<Lesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Filter: all | passed | pending
  const [filter, setFilter] = useState<"all" | "passed" | "pending">("all");

  const passedQuizzesCount = lessonsWithQuiz.filter((l) =>
    studentCompleted.includes(l.id)
  ).length;

  const handleStartQuiz = (lesson: Lesson) => {
    setActiveQuizLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: optIdx,
    });
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizLesson || !activeQuizLesson.quiz || activeQuizLesson.quiz.length === 0) return;
    let correctCount = 0;
    activeQuizLesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const quizLen = activeQuizLesson.quiz.length || 1;
    const scorePercent = Math.round((correctCount / quizLen) * 100);
    setQuizScore(scorePercent);
    setQuizSubmitted(true);

    if (scorePercent >= (activeQuizLesson.passingScorePercent || 70)) {
      onCompleteLesson(activeQuizLesson.id);
    }
  };

  const filteredLessons = lessonsWithQuiz.filter((l) => {
    const isDone = studentCompleted.includes(l.id);
    if (filter === "passed") return isDone;
    if (filter === "pending") return !isDone;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle size={22} className="text-cyan-500" />
            {t.student.quizTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === "en"
              ? `Test and validate your language skills (${school.language === "german" ? "German 🇩🇪" : "Italian 🇮🇹"}).`
              : `Testez et validez vos compétences linguistiques (${school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}).`}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            {locale === "en" ? "All" : "Tous"} ({lessonsWithQuiz.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("passed")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === "passed"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            {locale === "en" ? "Passed" : "Réussis"} ({passedQuizzesCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            {locale === "en" ? "Pending" : "À faire"} ({lessonsWithQuiz.length - passedQuizzesCount})
          </button>
        </div>
      </div>

      {/* Grid of Quizzes */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredLessons.map((les) => {
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
                    {totalQuestions} Question{totalQuestions > 1 ? "s" : ""} • {locale === "en" ? "Passing" : "Seuil"} {les.passingScorePercent || 70}%
                  </span>

                  {isPassed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={13} /> {locale === "en" ? "Passed" : "Validé"}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      {locale === "en" ? "Not passed" : "Non validé"}
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

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => onOpenLesson(les.id)}
                  className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  {locale === "en" ? "View lesson" : "Voir la leçon"}
                </button>

                <NeonButton
                  variant={isPassed ? "emerald" : "primary"}
                  size="sm"
                  onClick={() => handleStartQuiz(les)}
                  icon={isPassed ? <RotateCcw size={14} /> : <Sparkles size={14} />}
                >
                  {isPassed ? (locale === "en" ? "Retry Quiz" : "Recommencer") : (locale === "en" ? "Start Quiz" : "Lancer le quiz")}
                </NeonButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUIZ RUNNER MODAL */}
      {activeQuizLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  {locale === "en" ? "Validation Quiz" : "Quiz de Validation"}
                </span>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white truncate">
                  {activeQuizLesson.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveQuizLesson(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Questions list */}
            <div className="space-y-5">
              {activeQuizLesson.quiz.map((q, qIdx) => {
                const selectedOpt = selectedAnswers[qIdx];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.correctIndex;

                return (
                  <div
                    key={q.id || qIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-3"
                  >
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isOptionSelected = selectedOpt === optIdx;
                        let optionStyle =
                          "border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300";

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
                            onClick={() => handleSelectOption(qIdx, optIdx)}
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
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 leading-relaxed">
                        💡 <strong>{locale === "en" ? "Explanation:" : "Explication :"}</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {quizSubmitted && quizScore !== null ? (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <motion.div
                    variants={quizScore >= (activeQuizLesson.passingScorePercent || 70) ? quizSuccess : undefined}
                    initial="hidden"
                    animate="visible"
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      quizScore >= (activeQuizLesson.passingScorePercent || 70)
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                    }`}
                  >
                    Score: {quizScore}% •{" "}
                    {quizScore >= (activeQuizLesson.passingScorePercent || 70)
                      ? (locale === "en" ? "🎉 Passed!" : "🎉 Réussi !")
                      : (locale === "en" ? "Needs practice" : "À retravailler")}
                  </motion.div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                  >
                    {locale === "en" ? "Retry" : "Recommencer"}
                  </button>
                </div>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveQuizLesson(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                >
                  {locale === "en" ? "Close" : "Fermer"}
                </button>

                {!quizSubmitted && (
                  <NeonButton
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length < (activeQuizLesson?.quiz?.length || 0)
                    }
                  >
                    {t.student.submitQuiz}
                  </NeonButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
