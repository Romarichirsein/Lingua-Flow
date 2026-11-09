import React, { useState } from "react";
import { Student, School, Program, Lesson, UILocale, Book, CEFRLevel } from "../../types";
import { translations } from "../../lib/translations";
import { ProgressBar } from "../common/ProgressBar";
import { BOOKS_DATABASE, getSavedBookProgress } from "../../lib/booksData";
import { InPlatformBookReader } from "./InPlatformBookReader";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Calendar,
  Clock,
  Layers,
  Award,
  ChevronRight,
  ArrowRight,
  Library,
  Sparkles,
  BookMarked,
  Filter,
  Eye,
  FileText,
} from "lucide-react";

interface StudentProgramsTabProps {
  student: Student;
  school: School;
  programs: Program[];
  locale: UILocale;
  onSelectProgram: (programId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onAddLog?: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const StudentProgramsTab: React.FC<StudentProgramsTabProps> = ({
  student,
  school,
  programs,
  locale,
  onSelectProgram,
  onOpenLesson,
  onAddLog,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Section switcher: 'programs' (Cursus & cours) vs 'books' (Mes Livres)
  const [activeSection, setActiveSection] = useState<"programs" | "books">("programs");

  // Books filtering
  const studentLevel: CEFRLevel = student.level || "A1";
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("MY_LEVEL");
  const [selectedBookForReading, setSelectedBookForReading] = useState<Book | null>(null);

  // Programs belonging to this school
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);
  const displayPrograms = schoolPrograms.length > 0 ? schoolPrograms : programs;

  // Filter books matching school language (German or Italian)
  const languageBooks = BOOKS_DATABASE.filter((b) => b.language === school.language);

  // Apply level filter
  const displayedBooks = languageBooks.filter((b) => {
    if (selectedLevelFilter === "MY_LEVEL") {
      return b.level === studentLevel;
    }
    if (selectedLevelFilter === "ALL") {
      return true;
    }
    return b.level === selectedLevelFilter;
  });

  const myLevelBooksCount = languageBooks.filter((b) => b.level === studentLevel).length;

  return (
    <div className="space-y-6">
      {/* 1. TOP SEGMENTED SWITCHER: PROGRAMS VS MES LIVRES */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-2 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Tab 1: Mes Cursus & Cours */}
          <button
            type="button"
            onClick={() => setActiveSection("programs")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeSection === "programs"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <BookOpen size={16} />
            <span>{isEn ? "My Programs & Courses" : "Mes Cursus & Cours"}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {displayPrograms.length}
            </span>
          </button>

          {/* Tab 2: Mes Livres (Requested by User) */}
          <button
            type="button"
            id="tab-mes-livres-btn"
            onClick={() => setActiveSection("books")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeSection === "books"
                ? "bg-gradient-to-r from-indigo-600 to-[#6D5DFC] text-white shadow-md shadow-indigo-500/25"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Library size={16} />
            <span>{isEn ? "My Books (Library)" : "Mes Livres"}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeSection === "books"
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              }`}
            >
              {languageBooks.length}
            </span>
          </button>
        </div>

        {/* Info pill on the right */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-white/60 px-3">
          <span>{school.language === "german" ? "🇩🇪 Allemand DACH" : "🇮🇹 Italiano"}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
            {isEn ? "Your level:" : "Votre niveau :"} {studentLevel}
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION A: MES PROGRAMMES                                            */}
      {/* ==================================================================== */}
      {activeSection === "programs" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={22} className="text-indigo-500" />
                {t.student.myPrograms}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.student.allAssignedPrograms} ({school.language === "german" ? t.common.german : t.common.italian})
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 self-start sm:self-auto">
              {displayPrograms.length} {locale === "en" ? `program${displayPrograms.length > 1 ? "s" : ""} available` : `programme${displayPrograms.length > 1 ? "s" : ""} disponible${displayPrograms.length > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Program Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {displayPrograms.map((prog) => {
              const isCurrent =
                prog.id === student.enrolledProgramId ||
                (displayPrograms.length === 1 && !student.enrolledProgramId);

              const studentCompleted = student.completedLessons || [];
              const progLessons: Lesson[] = (prog.modules || []).flatMap((m) => m.lessons || []);
              const completedCount = progLessons.filter((l) =>
                studentCompleted.includes(l.id)
              ).length;

              const progProgress =
                progLessons.length > 0
                  ? Math.round((completedCount / progLessons.length) * 100)
                  : 0;

              const firstLessonId = progLessons[0]?.id;

              return (
                <div
                  key={prog.id}
                  className={`relative overflow-hidden rounded-3xl border transition shadow-sm flex flex-col justify-between ${
                    isCurrent
                      ? "bg-white dark:bg-[#0D1220] border-indigo-500/40 ring-1 ring-indigo-500/30"
                      : "bg-white/80 dark:bg-[#0D1220]/80 border-slate-200 dark:border-white/10"
                  }`}
                >
                  {/* Card Header with Level Badge */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                          {t.student.levelBadge} {prog.level || student.level}
                        </span>
                        <span className="text-xs text-slate-400">
                          {school.language === "german" ? t.common.german : t.common.italian}
                        </span>
                      </div>

                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {locale === "en" ? "In Progress" : "En cours"}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {prog.description}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span>{locale === "en" ? "Progress" : "Progression"}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          {progProgress}% ({completedCount}/{progLessons.length} {locale === "en" ? "lessons" : "leçons"})
                        </span>
                      </div>
                      <ProgressBar value={progProgress} color="cyan" height="sm" />
                    </div>

                    {/* Module breakdown pills */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                        {(prog.modules || []).length} {locale === "en" ? "thematic modules:" : "modules thématiques :"}
                      </span>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {(prog.modules || []).map((m, idx) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-slate-50 dark:bg-white/[0.02]"
                          >
                            <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                              {idx + 1}. {m.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                              {(m.lessons || []).length} {locale === "en" ? "lessons" : "leçons"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProgram(prog.id);
                        if (firstLessonId) onOpenLesson(firstLessonId);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <PlayCircle size={16} />
                      <span>{isCurrent ? t.student.resumeProgram : t.student.openProgram}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION B: MES LIVRES (INTEGRATED IN-PLATFORM DIGITAL LIBRARY)        */}
      {/* ==================================================================== */}
      {activeSection === "books" && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 p-6 rounded-3xl border border-indigo-500/20 backdrop-blur-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>{isEn ? "Digital Graded Readers" : "Lectures Graduées & Littérature"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <Library size={24} className="text-cyan-400" />
                <span>{isEn ? "My Books Library" : "Mes Livres"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isEn
                  ? "Read authentic graded books directly from the platform without downloading anything! Includes voice audio reading, chapter glossaries, and progress tracking."
                  : "Lisez des livres et histoires authentiques directement depuis la plateforme sans aucun téléchargement. Intègre la lecture vocale audio, les glossaires de vocabulaire et la sauvegarde de votre progression."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs text-white flex items-center gap-2">
                <BookMarked size={16} className="text-cyan-400" />
                <span>
                  <strong>{displayedBooks.length}</strong> {isEn ? "books accessible" : "livres accessibles"}
                </span>
              </div>
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
              <Filter size={13} />
              <span>{isEn ? "Level:" : "Niveau :"}</span>
            </span>

            {/* Recommended for student level button */}
            <button
              type="button"
              onClick={() => setSelectedLevelFilter("MY_LEVEL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedLevelFilter === "MY_LEVEL"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>
                {isEn ? `Recommended (${studentLevel})` : `Mon Niveau (${studentLevel})`}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {myLevelBooksCount}
              </span>
            </button>

            {/* All Levels */}
            <button
              type="button"
              onClick={() => setSelectedLevelFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedLevelFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              {isEn ? "All Levels" : "Tous les niveaux"} ({languageBooks.length})
            </button>

            {/* Specific CEFR Levels */}
            {(["A1", "A2", "B1", "B2", "C1"] as CEFRLevel[]).map((lvl) => {
              const count = languageBooks.filter((b) => b.level === lvl).length;
              if (count === 0) return null;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedLevelFilter === lvl
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                      : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {lvl} ({count})
                </button>
              );
            })}
          </div>

          {/* Book Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedBooks.map((book) => {
              const progress = getSavedBookProgress(student.id, book.id);
              const isRecommended = book.level === studentLevel;

              return (
                <div
                  key={book.id}
                  className={`overflow-hidden rounded-3xl border transition shadow-sm hover:shadow-xl flex flex-col justify-between ${
                    isRecommended
                      ? "bg-white dark:bg-[#0D1220] border-indigo-500/40 ring-1 ring-indigo-500/20"
                      : "bg-white/80 dark:bg-[#0D1220]/80 border-slate-200 dark:border-white/10"
                  }`}
                >
                  <div>
                    {/* Book Cover Image with Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black uppercase bg-indigo-600 text-white shadow-md">
                          {book.level}
                        </span>

                        {isRecommended && (
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500 text-slate-900 shadow-md flex items-center gap-1">
                            <Sparkles size={11} />
                            {isEn ? "Target Level" : "Votre niveau"}
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-[11px] font-semibold text-slate-300 truncate">
                          {book.author}
                        </p>
                        <h3 className="text-base font-black truncate text-white">
                          {book.title}
                        </h3>
                      </div>
                    </div>

                    {/* Book Meta Body */}
                    <div className="p-5 space-y-3">
                      {book.subtitle && (
                        <p className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">
                          {book.subtitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {book.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {book.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-medium text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Info Pills */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                        <span className="flex items-center gap-1">
                          <Layers size={12} />
                          {book.chapters.length} {isEn ? "chapters" : "chapitres"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          ~{book.estimatedMinutes} min
                        </span>
                      </div>

                      {/* Reading Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          <span>{isEn ? "Reading progress" : "Progression"}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                            {progress.completed
                              ? (isEn ? "Completed (100%)" : "Terminé (100%)")
                              : `${progress.progressPercent}%`}
                          </span>
                        </div>
                        <ProgressBar
                          value={progress.progressPercent}
                          color={progress.completed ? "emerald" : "indigo"}
                          height="sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Button: Read on platform */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookForReading(book);
                        if (onAddLog) {
                          onAddLog(
                            "BOOK_READING_STARTED",
                            `L'élève ${student.name} a ouvert le livre "${book.title}" (${book.level}).`,
                            "success"
                          );
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-[#6D5DFC] hover:from-indigo-500 hover:to-[#7c6dfc] text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition cursor-pointer"
                    >
                      <BookOpen size={16} />
                      <span>
                        {progress.progressPercent > 0
                          ? (isEn ? "Resume Reading" : "Reprendre la lecture")
                          : (isEn ? "Read Now (In-Platform)" : "Lire directement")}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. FULL-SCREEN IN-PLATFORM BOOK READER (NO DOWNLOAD REQUIRED)        */}
      {/* ==================================================================== */}
      {selectedBookForReading && (
        <InPlatformBookReader
          book={selectedBookForReading}
          student={student}
          school={school}
          locale={locale}
          onClose={() => setSelectedBookForReading(null)}
          onAddLog={onAddLog}
        />
      )}
    </div>
  );
};
