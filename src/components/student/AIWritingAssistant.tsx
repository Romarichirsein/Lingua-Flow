import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Student,
  School,
  SupportedLanguage,
  CEFRLevel,
  AIWritingResult,
  AIWritingSubmission,
  UILocale,
} from "../../types";
import { translations } from "../../lib/translations";
import { NeonButton } from "../common/NeonButton";
import { ConfettiShower, playCelebrationSound } from "../common/CelebrationEffects";
import { aiCorrectionAction } from "../../lib/aiActions";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Award,
  TrendingUp,
  History,
  Volume2,
  Send,
  FileText,
  Search,
  Trash2,
  Eye,
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
  Clock,
  Printer,
  ChevronRight,
  Flame,
} from "lucide-react";

interface AIWritingAssistantProps {
  student: Student;
  school: School;
  locale: UILocale;
  submissions?: AIWritingSubmission[];
  onSaveSubmission?: (submission: AIWritingSubmission) => void;
}

export const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  student,
  school,
  locale,
  submissions: initialSubmissions = [],
  onSaveSubmission,
}) => {
  const t = translations[locale];
  const language: SupportedLanguage = school.language;
  const isGerman = language === "german";

  // Main active view: 'editor' | 'history'
  const [mainView, setMainView] = useState<"editor" | "history">("editor");

  // Selected level & topics
  const [level, setLevel] = useState<CEFRLevel>(student.level || "A1");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [text, setText] = useState<string>("");

  // Loading & Result state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<AIWritingResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Submissions history (local state synced with props & localStorage)
  const storageKey = `linguaflow_writing_history_${student.id}`;
  const [history, setHistory] = useState<AIWritingSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialSubmissions.filter((s) => s.studentId === student.id);
  });

  // History search and inspection modal
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AIWritingSubmission | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Result display mode: 'diff' | 'side-by-side'
  const [viewMode, setViewMode] = useState<"diff" | "side-by-side">("diff");

  // Save to localStorage when history changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (e) {}
  }, [history, storageKey]);

  // Topic catalog categorized
  const topicCatalog = isGerman
    ? [
        {
          category: "presentation",
          catLabel: locale === "en" ? "👤 Self-Introduction" : "👤 Présentation",
          topics: [
            "Stellen Sie sich vor: Name, Herkunft, Beruf, Hobbys und warum Sie Deutsch lernen.",
            "Beschreiben Sie Ihre Familie, Freunde und Ihre Heimatstadt.",
            "Erzählen Sie von Ihren Plänen für das kommende Jahr.",
          ],
        },
        {
          category: "daily",
          catLabel: locale === "en" ? "☕ Daily Life" : "☕ Vie Quotidienne",
          topics: [
            "Beschreiben Sie Ihren typischen Tagesablauf (Morgen, Arbeit, Abend).",
            "Was machen Sie am Wochenende am liebsten zur Entspannung?",
            "Ihr Lieblingsgericht: Beschreiben Sie die Zutaten und die Zubereitung.",
          ],
        },
        {
          category: "travel",
          catLabel: locale === "en" ? "✈️ Travel & Vacation" : "✈️ Voyage & Séjour",
          topics: [
            "Schreiben Sie eine E-Mail an ein Hotel in Berlin für eine Reservierung.",
            "Erzählen Sie von Ihrer letzten unvergesslichen Urlaubsreise.",
            "Wie fragen Sie nach dem Weg und kaufen ein Zugticket in München?",
          ],
        },
        {
          category: "work",
          catLabel: locale === "en" ? "💼 Professional" : "💼 Professionnel",
          topics: [
            "Ein formelles Anschreiben für eine Bewerbung als mehrsprachiger Mitarbeiter.",
            "Schreiben Sie eine professionelle Terminabsage mit Terminvorschlag.",
            "Warum ist Deutschlernen ein wichtiger Schritt für Ihre internationale Karriere?",
          ],
        },
      ]
    : [
        {
          category: "presentation",
          catLabel: locale === "en" ? "👤 Self-Introduction" : "👤 Présentation",
          topics: [
            "Presentati: nome, origini, professione, hobby e motivazione nello studio dell'italiano.",
            "Descrivi la tua famiglia, i tuoi migliori amici e la tua città natale.",
            "Racconta i tuoi progetti e obiettivi per il prossimo anno.",
          ],
        },
        {
          category: "daily",
          catLabel: locale === "en" ? "☕ Daily Life" : "☕ Vie Quotidienne",
          topics: [
            "Descrivi la tua giornata ideale (dalla colazione alla sera).",
            "Cosa ti piace fare nel fine settimana per rilassarti?",
            "Il tuo piatto italiano preferito: ingredienti e preparazione.",
          ],
        },
        {
          category: "travel",
          catLabel: locale === "en" ? "✈️ Travel & Vacation" : "✈️ Voyage & Séjour",
          topics: [
            "Scrivi un'email a un hotel a Firenze per prenotare una camera.",
            "Racconta la tua ultima vacanza memorabile in Italia o all'estero.",
            "Come chiedi informazioni stradali e acquisti un biglietto alla stazione di Roma?",
          ],
        },
        {
          category: "work",
          catLabel: locale === "en" ? "💼 Professional" : "💼 Professionnel",
          topics: [
            "Una lettera formale di candidatura per una posizione internazionale.",
            "Scrivi un'email professionale per posticipare un incontro aziendale.",
            "Perché la conoscenza della lingua italiana è una risorsa preziosa per il tuo percorso?",
          ],
        },
      ];

  const allPrompts = topicCatalog.flatMap((c) => c.topics);
  const activePrompt =
    selectedPromptIndex === -1 ? customPrompt : allPrompts[selectedPromptIndex] || allPrompts[0];

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Useful starter phrases
  const starterPhrases = isGerman
    ? [
        "Ich möchte gerne über... sprechen",
        "Meiner Meinung nach...",
        "Zuerst... dann... schließlich...",
        "Einerseits... andererseits...",
        "Ich freue mich darauf, dass...",
      ]
    : [
        "Vorrei parlare di...",
        "Secondo la mia opinione...",
        "Prima di tutto... poi... infine...",
        "Da una parte... dall'altra...",
        "Non vedo l'ora di...",
      ];

  const handleInsertPhrase = (phrase: string) => {
    setText((prev) => (prev ? `${prev} ${phrase} ` : `${phrase} `));
  };

  // Run AI Correction with Gemini
  const handleCorrectText = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(1);

    // Simulated progress steps for smooth UX
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 700);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 1400);

    try {
      const actionResult = await aiCorrectionAction({
        studentId: student.id,
        studentName: student.name,
        schoolId: school.id,
        schoolName: school.name,
        actorRole: "student",
        text,
        language,
        level,
        topic: activePrompt,
        locale,
      });

      if (!actionResult.success || !actionResult.evaluation) {
        throw new Error(actionResult.error || "Erreur lors de la correction IA.");
      }

      const evaluation = actionResult.evaluation;
      const data: AIWritingResult = {
        score: evaluation.score,
        overallScore: evaluation.overallScore,
        cefrEstimatedLevel: evaluation.cefrEstimatedLevel,
        summary: evaluation.summary,
        correctedVersion: evaluation.correctedVersion,
        errors: evaluation.errors,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      };

      setResult(data);

      // Create new submission record
      const newSubmission: AIWritingSubmission = actionResult.submission || {
        id: `sub-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        schoolId: school.id,
        language,
        level,
        topic: activePrompt,
        studentText: text,
        submissionDate: new Date().toISOString(),
        result: data,
        evaluation,
      };

      setHistory((prev) => [newSubmission, ...prev]);
      if (onSaveSubmission) {
        onSaveSubmission(newSubmission);
      }

      // Trigger celebration if high score
      const finalScore = data.overallScore || data.score?.grammar || 80;
      if (finalScore >= 75) {
        setShowCelebration(true);
        playCelebrationSound("lesson");
        setTimeout(() => setShowCelebration(false), 3500);
      }
    } catch (err: any) {
      console.error("AI correction error:", err);
      setErrorMsg(
        err.message || "Impossible de contacter l'assistant IA. Veuillez réessayer."
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  // Text to Speech
  const handleSpeak = (textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isGerman ? "de-DE" : "it-IT";
      utterance.rate = 0.88;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyCorrected = (content?: string) => {
    const toCopy = content || result?.correctedVersion;
    if (!toCopy) return;
    navigator.clipboard.writeText(toCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteHistory = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null);
    }
  };

  const handleLoadFromHistory = (item: AIWritingSubmission) => {
    setText(item.studentText);
    setLevel(item.level);
    setResult(item.result);
    setCustomPrompt(item.topic);
    setSelectedPromptIndex(-1);
    setSelectedHistoryItem(null);
    setMainView("editor");
  };

  // Filtered history list
  const filteredHistory = history.filter((item) => {
    const matchesLevel = filterLevel === "all" || item.level === filterLevel;
    const matchesSearch =
      !searchQuery ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.result.summary && item.result.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  // Calculate statistics
  const totalSubmissions = history.length;
  const avgScore = totalSubmissions
    ? Math.round(
        history.reduce(
          (acc, cur) =>
            acc + (cur.result.overallScore || cur.result.score?.grammar || 80),
          0
        ) / totalSubmissions
      )
    : 0;

  return (
    <div className="space-y-6">
      <ConfettiShower active={showCelebration} durationMs={3500} />

      {/* Header with Nav Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Sparkles size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {locale === "en" ? "AI Writing Assistant" : "Expression Écrite IA"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase">
              {isGerman ? t.common.german : t.common.italian}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === "en"
              ? "Draft texts, receive detailed CEFR-level corrections with Gemini, and track your progress."
              : "Rédigez, recevez une correction détaillée niveau CECRL avec Gemini et suivez votre progression."}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMainView("editor")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mainView === "editor"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText size={15} />
            <span>{locale === "en" ? "Writing Workshop" : "Atelier de Rédaction"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMainView("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mainView === "history"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History size={15} />
            <span>{locale === "en" ? "History" : "Historique"} ({totalSubmissions})</span>
            {totalSubmissions > 0 && (
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: WRITING WORKSHOP & GEMINI CORRECTION */}
      {mainView === "editor" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Topic, Starter Phrases & Writing Pad */}
          <div className="space-y-4 lg:col-span-7">
            {/* Level & Topic Selector */}
            <div className="neon-card rounded-3xl p-5 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {locale === "en" ? "1. Choose targeted CEFR level:" : "1. Choisissez le niveau CECRL ciblé :"}
                </span>
                <div className="flex items-center gap-1.5">
                  {(["A1", "A2", "B1", "B2", "C1"] as CEFRLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        level === lvl
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics Catalog */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {locale === "en" ? "2. Select a topic or type custom prompt:" : "2. Sélectionnez un sujet ou écrivez votre consigne :"}
                </label>

                {/* Category filters */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {locale === "en" ? "All themes" : "Tous les thèmes"}
                  </button>
                  {topicCatalog.map((cat) => (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => setSelectedCategory(cat.category)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedCategory === cat.category
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat.catLabel}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {topicCatalog
                    .filter((c) => selectedCategory === "all" || c.category === selectedCategory)
                    .flatMap((c) => c.topics)
                    .map((promptText, idx) => {
                      const globalIdx = allPrompts.indexOf(promptText);
                      const isSelected = selectedPromptIndex === globalIdx;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPromptIndex(globalIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition cursor-pointer flex items-start gap-2.5 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 font-semibold shadow-xs"
                              : "border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <span className="shrink-0 mt-0.5 text-indigo-500 font-bold">•</span>
                          <span className="text-slate-800 dark:text-slate-100">{promptText}</span>
                        </button>
                      );
                    })}

                  <button
                    type="button"
                    onClick={() => setSelectedPromptIndex(-1)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2.5 ${
                      selectedPromptIndex === -1
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 font-semibold"
                        : "border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>✏️</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {locale === "en" ? "Custom prompt / Free topic..." : "Consigne personnalisée / Thème libre..."}
                    </span>
                  </button>

                  {selectedPromptIndex === -1 && (
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={locale === "en" ? "E.g. Describing a job interview in Frankfurt / Milan..." : "Ex: Raconter un entretien d'embauche à Francfort / Milan..."}
                      className="w-full h-11 rounded-xl border border-indigo-400 bg-white px-3.5 text-xs dark:border-indigo-500/60 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  )}
                </div>
              </div>

              {/* Starter Phrases Helper */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  {locale === "en" ? "💡 Useful starter phrases (click to insert):" : "💡 Phrases d'accroche utiles (cliquez pour insérer) :"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {starterPhrases.map((phrase, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInsertPhrase(phrase)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/80 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer hover:border-indigo-400"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Editor Area */}
            <div className="neon-card rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText size={15} className="text-indigo-500" />
                  {locale === "en"
                    ? `Your writing in ${isGerman ? "German" : "Italian"}:`
                    : `Votre rédaction en ${isGerman ? "allemand" : "italien"} :`}
                </label>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className={wordCount >= 10 ? "text-emerald-500 font-bold" : ""}>
                    {wordCount} {locale === "en" ? "words" : "mots"}
                  </span>
                  <span>•</span>
                  <span>{text.length} {locale === "en" ? "chars" : "car."}</span>
                </div>
              </div>

              <textarea
                id="student-writing-textarea"
                rows={9}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  isGerman
                    ? "Schreiben Sie Ihren Text hier auf Deutsch (z.B. Hallo, mein Name ist...)..."
                    : "Scrivi qui il tuo testo in italiano (es. Ciao, mi chiamo...)..."
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-white/10 dark:bg-slate-900 dark:text-white transition leading-relaxed"
              />

              {errorMsg && (
                <div className="rounded-xl bg-rose-500/10 p-3 text-xs text-rose-500 border border-rose-500/20 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setResult(null);
                  }}
                  disabled={!text}
                  className="text-xs text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>{locale === "en" ? "Clear" : "Effacer"}</span>
                </button>

                <NeonButton
                  id="btn-correct-writing"
                  variant="primary"
                  onClick={handleCorrectText}
                  disabled={wordCount < 3 || isLoading}
                  icon={<Sparkles size={16} className={isLoading ? "animate-spin" : ""} />}
                  className="shadow-lg shadow-indigo-500/20"
                >
                  {isLoading
                    ? (locale === "en" ? "Gemini correction in progress..." : "Correction Gemini en cours...")
                    : (locale === "en" ? "Analyze & Correct with AI" : "Analyser & Corriger avec IA")}
                </NeonButton>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & Correction Output */}
          <div className="space-y-4 lg:col-span-5">
            {/* Loading State with animated steps */}
            {isLoading && (
              <div className="neon-card rounded-3xl p-10 text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500 animate-pulse">
                  <Sparkles size={32} className="animate-spin text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {locale === "en" ? "Gemini Pedagogical Analysis" : "Analyse Pédagogique Gemini"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {locale === "en"
                      ? "In-depth review of grammar, vocabulary, and CEFR structure."
                      : "Examen approfondi de la grammaire, du vocabulaire et de la structure CECRL."}
                  </p>
                </div>

                {/* Progress pipeline */}
                <div className="space-y-2 max-w-xs mx-auto text-left pt-2">
                  <div
                    className={`flex items-center gap-2 text-xs transition ${
                      loadingStep >= 1 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        loadingStep >= 1 ? "bg-indigo-500 animate-ping" : "bg-slate-300"
                      }`}
                    />
                    <span>{locale === "en" ? "1. Reading & syntax parsing" : "1. Lecture et analyse syntaxique"}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-xs transition ${
                      loadingStep >= 2 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        loadingStep >= 2 ? "bg-indigo-500 animate-ping" : "bg-slate-300"
                      }`}
                    />
                    <span>{locale === "en" ? "2. Error & spelling detection" : "2. Détection des erreurs & orthographe"}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-xs transition ${
                      loadingStep >= 3 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        loadingStep >= 3 ? "bg-indigo-500 animate-ping" : "bg-slate-300"
                      }`}
                    />
                    <span>{locale === "en" ? "3. CEFR evaluation & optimal version" : "3. Évaluation CECRL & version optimale"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !result && (
              <div className="neon-card rounded-3xl p-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {locale === "en" ? "Your AI tutor is ready" : "Votre tuteur IA est prêt"}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {locale === "en"
                    ? "Write your text on the selected topic on the left and run analysis. You will get detailed scoring, optimal corrected version, and grammar guidance."
                    : "Rédigez votre paragraphe sur le sujet de votre choix à gauche et lancez l'analyse. Vous obtiendrez une note détaillée, la version corrigée et les explications grammaticales."}
                </p>
                <div className="rounded-2xl bg-indigo-500/5 p-3.5 border border-indigo-500/10 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  ✨ <strong>{locale === "en" ? "Tip:" : "Astuce :"}</strong> {locale === "en" ? "Every corrected text is automatically saved in your history to track progress!" : "Chaque texte corrigé est automatiquement archivé dans votre historique pour suivre vos progrès !"}
                </div>
              </div>
            )}

            {/* Correction Output */}
            {!isLoading && result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Score & CEFR Level Card */}
                <div className="neon-card rounded-3xl p-5 border-l-4 border-l-indigo-500 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                        {locale === "en" ? "CEFR Assessment" : "Évaluation CECRL"}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {locale === "en" ? "Level" : "Niveau"} {result.cefrEstimatedLevel || level}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {result.overallScore || Math.round(((result.score?.grammar || 80) + (result.score?.vocabulary || 75) + (result.score?.coherence || 80)) / 3)}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">/100</span>
                    </div>
                  </div>

                  {/* Criteria 3-pillar breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {locale === "en" ? "Grammar" : "Grammaire"}
                      </span>
                      <span className="font-black text-xs text-emerald-500">
                        {result.score?.grammar || 80}%
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {locale === "en" ? "Vocabulary" : "Vocabulaire"}
                      </span>
                      <span className="font-black text-xs text-cyan-500">
                        {result.score?.vocabulary || 75}%
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {locale === "en" ? "Coherence" : "Cohérence"}
                      </span>
                      <span className="font-black text-xs text-amber-500">
                        {result.score?.coherence || 85}%
                      </span>
                    </div>
                  </div>

                  {/* Summary commentary */}
                  {result.summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                      « {result.summary} »
                    </p>
                  )}
                </div>

                {/* Corrected Text Box */}
                <div className="neon-card rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {locale === "en" ? "Optimal Corrected Version" : "Version Corrigée & Optimale"}
                    </h4>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeak(result.correctedVersion)}
                        className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                          isSpeaking
                            ? "bg-indigo-600 text-white animate-pulse"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                        title={locale === "en" ? "Listen to audio pronunciation" : "Écouter la prononciation audio"}
                      >
                        <Volume2 size={13} />
                        <span>{isSpeaking ? (locale === "en" ? "Listening..." : "Écoute...") : (locale === "en" ? "Listen" : "Écouter")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyCorrected()}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-500/20 transition cursor-pointer"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copied ? (locale === "en" ? "Copied!" : "Copié !") : (locale === "en" ? "Copy" : "Copier")}</span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/15 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {result.correctedVersion}
                  </div>
                </div>

                {/* Identified Errors Breakdown */}
                <div className="neon-card rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-indigo-500" />
                      {locale === "en" ? `Correction Points (${result.errors?.length || 0})` : `Points à Corriger (${result.errors?.length || 0})`}
                    </h4>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {result.errors && result.errors.length > 0 ? (
                      result.errors.map((err, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-3.5 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-500">
                              {err.category || (locale === "en" ? "Grammar" : "Grammaire")}
                            </span>
                            {err.severity && (
                              <span
                                className={`text-[10px] font-semibold ${
                                  err.severity === "high"
                                    ? "text-rose-500"
                                    : err.severity === "medium"
                                    ? "text-amber-500"
                                    : "text-slate-400"
                                }`}
                              >
                                {locale === "en"
                                  ? `Priority ${err.severity === "high" ? "High" : err.severity === "medium" ? "Medium" : "Low"}`
                                  : `Priorité ${err.severity === "high" ? "Haute" : err.severity === "medium" ? "Moyenne" : "Faible"}`}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="line-through text-rose-500 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded">
                              {err.original}
                            </span>
                            <span>→</span>
                            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {err.correction}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                            💡 {err.explanation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-emerald-500/10 p-4 text-center border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        {locale === "en" ? "🎉 No errors found! Excellent writing." : "🎉 Aucune erreur détectée ! Expression impeccable."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Strengths & Actionable Advice */}
                <div className="neon-card rounded-3xl p-5 space-y-3">
                  {result.strengths && result.strengths.length > 0 && (
                    <div>
                      <h5 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                        <CheckCircle2 size={13} /> {locale === "en" ? "Strengths:" : "Points forts :"}
                      </h5>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                        {result.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.improvements && result.improvements.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <h5 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                        <TrendingUp size={13} /> {locale === "en" ? "Areas for Improvement:" : "Pistes d'amélioration :"}
                      </h5>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                        {result.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: WRITING HISTORY & PROGRESS TRACKING */}
      {mainView === "history" && (
        <div className="space-y-6">
          {/* Summary KPIs banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="neon-card rounded-3xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {locale === "en" ? "Total Drafts" : "Total Rédactions"}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {totalSubmissions}
              </span>
            </div>

            <div className="neon-card rounded-3xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {locale === "en" ? "Average Score" : "Note Moyenne"}
              </span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                {avgScore ? `${avgScore}/100` : "-"}
              </span>
            </div>

            <div className="neon-card rounded-3xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {locale === "en" ? "Practiced Language" : "Langue Pratiquée"}
              </span>
              <span className="text-base font-black text-cyan-500 mt-1 block">
                {isGerman ? t.common.german : t.common.italian}
              </span>
            </div>

            <div className="neon-card rounded-3xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {locale === "en" ? "Enrolled Level" : "Niveau Enregistré"}
              </span>
              <span className="text-base font-black text-emerald-500 mt-1 block">
                CEFR {student.level}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0D1220] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "en" ? "Search by topic or text..." : "Rechercher par sujet ou texte..."}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs dark:border-white/10 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">{locale === "en" ? "Filter by level:" : "Filtrer par niveau :"}</span>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs dark:border-white/10 dark:bg-slate-900 text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="all">{locale === "en" ? "All levels" : "Tous les niveaux"}</option>
                <option value="A1">{locale === "en" ? "Level A1" : "Niveau A1"}</option>
                <option value="A2">{locale === "en" ? "Level A2" : "Niveau A2"}</option>
                <option value="B1">{locale === "en" ? "Level B1" : "Niveau B1"}</option>
                <option value="B2">{locale === "en" ? "Level B2" : "Niveau B2"}</option>
                <option value="C1">{locale === "en" ? "Level C1" : "Niveau C1"}</option>
              </select>
            </div>
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="neon-card rounded-3xl p-12 text-center space-y-3">
              <FileText size={36} className="mx-auto text-slate-400" />
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                {locale === "en" ? "No drafts found" : "Aucune rédaction trouvée"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {history.length === 0
                  ? (locale === "en"
                      ? "You haven't submitted any texts yet. Start your first draft in the workshop!"
                      : "Vous n'avez pas encore rédigé de texte. Lancez votre première rédaction dans l'atelier !")
                  : (locale === "en"
                      ? "No drafts match your search criteria."
                      : "Aucune rédaction ne correspond à vos critères de recherche.")}
              </p>
              <NeonButton
                variant="primary"
                size="sm"
                onClick={() => setMainView("editor")}
                icon={<Sparkles size={14} />}
              >
                {locale === "en" ? "Write my first text" : "Rédiger mon premier texte"}
              </NeonButton>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHistory.map((item) => {
                const itemScore =
                  item.result.overallScore ||
                  item.result.score?.grammar ||
                  80;
                const formattedDate = new Date(item.submissionDate).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US",
                  { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
                );

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="neon-card rounded-3xl p-5 space-y-3.5 flex flex-col justify-between border hover:border-indigo-500/50 transition cursor-pointer"
                    onClick={() => setSelectedHistoryItem(item)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 uppercase">
                          {locale === "en" ? "Level" : "Niveau"} {item.level}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                              itemScore >= 80
                                ? "bg-emerald-500/10 text-emerald-500"
                                : itemScore >= 60
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            {itemScore}/100
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistory(item.id, e)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            title={locale === "en" ? "Delete draft" : "Supprimer cette rédaction"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                        {item.topic}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {item.studentText}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formattedDate}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                        {locale === "en" ? "View" : "Consulter"} <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL FOR HISTORIC SUBMISSION */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHistoryItem(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1220] p-4 sm:p-7 shadow-2xl text-slate-900 dark:text-white space-y-5 my-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase">
                      {locale === "en" ? "Level" : "Niveau"} {selectedHistoryItem.level} • {isGerman ? t.common.german : t.common.italian}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(selectedHistoryItem.submissionDate).toLocaleString(locale === "fr" ? "fr-FR" : "en-US")}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black mt-1">
                    {selectedHistoryItem.topic}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {selectedHistoryItem.result.overallScore ||
                      selectedHistoryItem.result.score?.grammar ||
                      80}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </div>

              {/* Original text vs Corrected text */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {locale === "en" ? "Original Student Text:" : "Texte original de l'élève :"}
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedHistoryItem.studentText}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={13} /> {locale === "en" ? "Optimal Version:" : "Version Optimale :"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(selectedHistoryItem.result.correctedVersion)}
                      className="text-[11px] text-indigo-500 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 size={13} /> {locale === "en" ? "Pronounce" : "Prononcer"}
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                    {selectedHistoryItem.result.correctedVersion}
                  </div>
                </div>
              </div>

              {/* Errors list */}
              {selectedHistoryItem.result.errors && selectedHistoryItem.result.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {locale === "en" ? "Errors Identified & Explanations:" : "Erreurs relevées & explications :"}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedHistoryItem.result.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-50 dark:bg-slate-900/80 p-3 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="line-through text-rose-500">{err.original}</span>
                          <span>→</span>
                          <span className="text-emerald-500 font-bold">{err.correction}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          💡 {err.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons in Modal */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDeleteHistory(selectedHistoryItem.id)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> {locale === "en" ? "Delete" : "Supprimer"}
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryItem(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-center"
                  >
                    {locale === "en" ? "Close" : "Fermer"}
                  </button>

                  <NeonButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleLoadFromHistory(selectedHistoryItem)}
                    icon={<RotateCcw size={14} />}
                  >
                    {locale === "en" ? "Edit in Workshop" : "Reprendre dans l'Atelier"}
                  </NeonButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
