import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, BookChapter, Student, School, UILocale } from "../../types";
import { saveBookProgress, getSavedBookProgress } from "../../lib/booksData";
import { playCelebrationSound, ConfettiShower } from "../common/CelebrationEffects";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Bookmark,
  CheckCircle2,
  List,
  Sparkles,
  Type,
  Sun,
  Moon,
  Coffee,
  HelpCircle,
  Award,
  Clock,
  ArrowLeft,
  Search,
} from "lucide-react";

interface InPlatformBookReaderProps {
  book: Book;
  student: Student;
  school: School;
  locale: UILocale;
  onClose: () => void;
  onAddLog?: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

type ReaderTheme = "light" | "sepia" | "dark";
type FontSize = "sm" | "md" | "lg" | "xl";

export const InPlatformBookReader: React.FC<InPlatformBookReaderProps> = ({
  book,
  student,
  school,
  locale,
  onClose,
  onAddLog,
}) => {
  const isEn = locale === "en";

  // Initial chapter restored from student's saved progress
  const savedProgress = getSavedBookProgress(student.id, book.id);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    const idx = savedProgress.lastChapterIndex || 0;
    return idx >= 0 && idx < book.chapters.length ? idx : 0;
  });

  const [theme, setTheme] = useState<ReaderTheme>("sepia");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [isTOCSidebarOpen, setIsTOCSidebarOpen] = useState(false);
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState(false);

  // Audio Speech Synthesis
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCompletedBook, setHasCompletedBook] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentChapter: BookChapter = book.chapters[currentChapterIndex] || book.chapters[0];
  const totalChapters = book.chapters.length;

  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Save progress automatically when chapter changes
  useEffect(() => {
    saveBookProgress(student.id, book.id, currentChapterIndex, totalChapters);
    // Scroll to top of reading area
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
    // Stop any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [currentChapterIndex, book.id, student.id, totalChapters]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      const nextIdx = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIdx);
      if (nextIdx === totalChapters - 1 && !hasCompletedBook) {
        setHasCompletedBook(true);
        setShowCelebration(true);
        playCelebrationSound();
        if (onAddLog) {
          onAddLog(
            "BOOK_READING_COMPLETED",
            `L'élève ${student.name} a terminé la lecture du livre "${book.title}" (${book.level}).`,
            "success"
          );
        }
      }
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert(isEn ? "Speech synthesis not supported." : "Synthèse vocale non supportée.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = currentChapter.audioText || currentChapter.content.replace(/[#*_`]/g, "");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = book.language === "german" ? "de-DE" : "it-IT";
      utterance.rate = 0.9; // Slightly slower for language learners

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Font size class mapping
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-sm leading-relaxed";
      case "md":
        return "text-base sm:text-lg leading-relaxed sm:leading-loose";
      case "lg":
        return "text-lg sm:text-xl leading-relaxed sm:leading-loose";
      case "xl":
        return "text-xl sm:text-2xl leading-relaxed sm:leading-loose";
    }
  };

  // Theme styling mapping
  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          wrapper: "bg-slate-50 text-slate-900",
          header: "bg-white/90 border-slate-200 text-slate-800",
          content: "bg-white border-slate-200 shadow-sm text-slate-800",
          footer: "bg-white border-slate-200 text-slate-700",
          accent: "text-indigo-600",
        };
      case "sepia":
        return {
          wrapper: "bg-[#F7F2E7] text-[#3D3325]",
          header: "bg-[#EFE8D8]/95 border-[#E2D8C3] text-[#3D3325]",
          content: "bg-[#FAF7F0] border-[#E8DFC9] shadow-sm text-[#382F22]",
          footer: "bg-[#EFE8D8] border-[#E2D8C3] text-[#4A3E2D]",
          accent: "text-amber-800",
        };
      case "dark":
        return {
          wrapper: "bg-[#090D16] text-slate-200",
          header: "bg-[#0F172A]/90 border-slate-800 text-white",
          content: "bg-[#0F172A] border-slate-800 text-slate-200",
          footer: "bg-[#0F172A] border-slate-800 text-slate-300",
          accent: "text-cyan-400",
        };
    }
  };

  const themeClasses = getThemeClasses();
  const progressPercent = Math.round(((currentChapterIndex + 1) / totalChapters) * 100);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses.wrapper} transition-colors duration-200 select-text`}>
      {/* Celebration Confetti */}
      {showCelebration && (
        <ConfettiShower active={showCelebration} durationMs={3500} />
      )}

      {/* 1. TOP READER NAVIGATION BAR */}
      <header className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b backdrop-blur-md shrink-0 z-10 ${themeClasses.header}`}>
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 truncate">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold transition cursor-pointer"
            title={isEn ? "Back to books list" : "Retour aux livres"}
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">{isEn ? "Library" : "Bibliothèque"}</span>
          </button>

          <div className="truncate">
            <h1 className="text-sm sm:text-base font-black truncate flex items-center gap-2">
              <span>{book.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                {book.level}
              </span>
            </h1>
            <p className="text-[11px] opacity-70 truncate">
              {book.author} • {book.language === "german" ? "🇩🇪 Allemand" : "🇮🇹 Italien"}
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Speech Synthesis Button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isPlayingAudio
                ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                : "border-current/20 hover:bg-current/10"
            }`}
            title={
              isPlayingAudio
                ? (isEn ? "Pause audio reading" : "Mettre en pause la lecture audio")
                : (isEn ? "Listen to chapter audio" : "Écouter la lecture audio en allemand")
            }
          >
            {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden md:inline">
              {isPlayingAudio ? (isEn ? "Pause Audio" : "Pause Audio") : (isEn ? "Listen" : "Écouter")}
            </span>
          </button>

          {/* Table of Contents Button */}
          <button
            type="button"
            onClick={() => setIsTOCSidebarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold transition cursor-pointer"
            title={isEn ? "Table of contents" : "Sommaire des chapitres"}
          >
            <List size={15} />
            <span className="hidden sm:inline">{isEn ? "Chapters" : "Sommaire"}</span>
          </button>

          {/* Vocabulary Drawer Button */}
          {(currentChapter.vocabulary || []).length > 0 && (
            <button
              type="button"
              onClick={() => setIsVocabDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition cursor-pointer"
              title={isEn ? "Chapter vocabulary" : "Vocabulaire du chapitre"}
            >
              <Sparkles size={14} />
              <span className="hidden lg:inline">{isEn ? "Vocabulary" : "Vocabulaire"}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white">
                {(currentChapter.vocabulary || []).length}
              </span>
            </button>
          )}

          {/* Font Size Adjuster */}
          <div className="hidden sm:flex items-center border border-current/20 rounded-xl overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`px-2 py-1 ${fontSize === "sm" ? "bg-current/20 font-bold" : "hover:bg-current/10"}`}
              title="Petit"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize("md")}
              className={`px-2 py-1 ${fontSize === "md" ? "bg-current/20 font-bold" : "hover:bg-current/10"}`}
              title="Moyen"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`px-2 py-1 ${fontSize === "lg" ? "bg-current/20 font-bold" : "hover:bg-current/10"}`}
              title="Grand"
            >
              A+
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center border border-current/20 rounded-xl overflow-hidden p-0.5">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg ${theme === "light" ? "bg-white shadow text-slate-900" : "hover:bg-current/10"}`}
              title="Mode Clair"
            >
              <Sun size={13} />
            </button>
            <button
              type="button"
              onClick={() => setTheme("sepia")}
              className={`p-1.5 rounded-lg ${theme === "sepia" ? "bg-[#FAF7F0] shadow text-[#3D3325]" : "hover:bg-current/10"}`}
              title="Mode Sépia (Papier chaud)"
            >
              <Coffee size={13} />
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-slate-800 shadow text-white" : "hover:bg-current/10"}`}
              title="Mode Nuit"
            >
              <Moon size={13} />
            </button>
          </div>

          {/* Close Reader Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-current/20 hover:bg-current/10 transition cursor-pointer"
            title={isEn ? "Exit reader" : "Quitter le lecteur"}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Progress Bar under header */}
      <div className="w-full bg-black/10 dark:bg-white/10 h-1 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. MAIN READING CANVAS */}
      <div
        ref={contentContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 flex justify-center"
      >
        <article
          className={`w-full max-w-3xl rounded-3xl p-6 sm:p-12 border ${themeClasses.content} transition-all`}
        >
          {/* Chapter Header */}
          <div className="mb-8 pb-6 border-b border-current/10 space-y-2">
            <div className="flex items-center justify-between text-xs opacity-70">
              <span>
                {isEn ? "Chapter" : "Chapitre"} {currentChapterIndex + 1} / {totalChapters}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                ~{Math.round(book.estimatedMinutes / totalChapters)} min de lecture
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              {currentChapter.title}
            </h2>
            {currentChapter.subtitle && (
              <p className="text-sm sm:text-base opacity-80 italic">
                {currentChapter.subtitle}
              </p>
            )}
          </div>

          {/* Chapter Content with Markdown formatting */}
          <div
            className={`prose prose-slate dark:prose-invert max-w-none ${getFontSizeClass()} font-serif whitespace-pre-line leading-relaxed`}
          >
            {currentChapter.content}
          </div>

          {/* Chapter Vocabulary Highlights Box */}
          {(currentChapter.vocabulary || []).length > 0 && (
            <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-current/5 border border-current/10 space-y-3">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>{isEn ? "Key Vocabulary in this Chapter" : "Vocabulaire clé de ce chapitre"}</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {currentChapter.vocabulary.map((vocab, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-3 rounded-xl bg-current/5 border border-current/10 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="font-mono text-indigo-600 dark:text-cyan-400 font-extrabold">
                        {vocab.word}
                      </span>
                      <span className="opacity-70 font-normal italic">
                        {vocab.translation}
                      </span>
                    </div>
                    {vocab.definition && (
                      <p className="text-[11px] opacity-80 leading-snug">
                        {vocab.definition}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapter Completion Alert */}
          {currentChapterIndex === totalChapters - 1 && (
            <div className="mt-10 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
              <h3 className="text-lg font-black">
                {isEn ? "Congratulations! You have completed this book!" : "Félicitations ! Vous avez terminé ce livre !"}
              </h3>
              <p className="text-xs opacity-90 max-w-md mx-auto">
                {isEn
                  ? `Your reading progress for "${book.title}" is 100% saved in your learner profile.`
                  : `Votre progression de lecture pour "${book.title}" est enregistrée à 100% dans votre profil élève.`}
              </p>
            </div>
          )}
        </article>
      </div>

      {/* 3. BOTTOM CHAPTER NAVIGATION FOOTER */}
      <footer className={`h-16 px-4 sm:px-8 flex items-center justify-between border-t shrink-0 ${themeClasses.footer}`}>
        <button
          type="button"
          onClick={handlePrevChapter}
          disabled={currentChapterIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-current/20 hover:bg-current/10 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>{isEn ? "Previous Chapter" : "Chapitre précédent"}</span>
        </button>

        <div className="text-xs font-bold opacity-80 hidden sm:block">
          <span>
            {isEn ? "Chapter" : "Chapitre"} {currentChapterIndex + 1} {isEn ? "of" : "sur"} {totalChapters} ({progressPercent}%)
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextChapter}
          disabled={currentChapterIndex >= totalChapters - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{isEn ? "Next Chapter" : "Chapitre suivant"}</span>
          <ChevronRight size={16} />
        </button>
      </footer>

      {/* 4. TABLE OF CONTENTS MODAL / SIDEBAR */}
      <AnimatePresence>
        {isTOCSidebarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                  <List size={18} className="text-indigo-600" />
                  <span>{isEn ? "Table of Contents" : "Sommaire du livre"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsTOCSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {book.chapters.map((ch, idx) => {
                  const isCurrent = idx === currentChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setCurrentChapterIndex(idx);
                        setIsTOCSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs transition flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? "bg-indigo-600 text-white font-bold shadow-md"
                          : "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="font-mono opacity-70 mr-1.5">{idx + 1}.</span>
                        <span>{ch.title}</span>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white shrink-0">
                          {isEn ? "Active" : "En cours"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CHAPTER VOCABULARY DRAWER */}
      <AnimatePresence>
        {isVocabDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-full max-w-md h-full bg-white dark:bg-[#0D1220] border-l border-slate-200 dark:border-white/10 p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                  <h3 className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
                    <Sparkles size={18} className="text-amber-500" />
                    <span>{isEn ? "Chapter Vocabulary" : "Glossaire du chapitre"}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsVocabDrawerOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn
                    ? "Essential terms and phrases explained for this reading segment."
                    : "Mots et expressions clés annotés pour faciliter votre compréhension."}
                </p>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {(currentChapter.vocabulary || []).map((v, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-cyan-400">
                          {v.word}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {v.translation}
                        </span>
                      </div>
                      {v.definition && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {v.definition}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVocabDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-white transition"
              >
                {isEn ? "Close Glossary" : "Fermer le glossaire"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
