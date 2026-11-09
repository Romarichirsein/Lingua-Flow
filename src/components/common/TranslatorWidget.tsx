import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  X,
  Sparkles,
  Loader2,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { generateGeminiContent } from "../../lib/gemini";
import { UILocale } from "../../types";

interface TranslatorWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: UILocale;
}

export type TranslationPair = "fr-de" | "en-de";
export type TranslationLang = "fr" | "en" | "de";

// Built-in offline pedagogical dictionary fallback for high availability
const FALLBACK_PHRASES: Record<string, string> = {
  // FR -> DE
  "bonjour": "Guten Tag",
  "bonjour, comment allez-vous ?": "Guten Tag, wie geht es Ihnen?",
  "bonjour comment allez-vous": "Guten Tag, wie geht es Ihnen?",
  "salut": "Hallo",
  "merci": "Danke",
  "merci beaucoup": "Vielen Dank",
  "au revoir": "Auf Wiedersehen",
  "s'il vous plaît": "Bitte",
  "s'il vous plait": "Bitte",
  "oui": "Ja",
  "non": "Nein",
  "comment vous appelez-vous ?": "Wie heißen Sie?",
  "comment vous appelez-vous": "Wie heißen Sie?",
  "je m'appelle": "Ich heiße",
  "je m'appelle lucas": "Ich heiße Lucas",
  "je voudrais apprendre l'allemand": "Ich möchte Deutsch lernen",
  "je veux apprendre l'allemand": "Ich möchte Deutsch lernen",
  "pouvez-vous m'aider ?": "Können Sie mir helfen?",
  "pouvez-vous m'aider": "Können Sie mir helfen?",
  "je ne comprends pas": "Ich verstehe nicht",
  "parlez-vous allemand ?": "Sprechen Sie Deutsch?",
  "parlez-vous français ?": "Sprechen Sie Französisch?",
  "où est la gare ?": "Wo ist der Bahnhof?",
  "où se trouve la gare ?": "Wo befindet sich der Bahnhof?",
  "enchanté": "Freut mich sehr",
  "bonne nuit": "Gute Nacht",
  "bon appétit": "Guten Appetit",
  "à bientôt": "Bis bald",
  "bienvenue": "Herzlich willkommen",
  "combien ça coûte ?": "Wie viel kostet das?",
  "je suis étudiant": "Ich bin Student",
  "je suis étudiante": "Ich bin Studentin",

  // DE -> FR
  "guten tag": "Bonjour",
  "guten tag, wie geht es ihnen?": "Bonjour, comment allez-vous ?",
  "hallo": "Salut",
  "danke": "Merci",
  "vielen dank": "Merci beaucoup",
  "auf wiedersehen": "Au revoir",
  "bitte": "S'il vous plaît",
  "ja": "Oui",
  "nein": "Non",
  "wie heißen sie?": "Comment vous appelez-vous ?",
  "ich heiße": "Je m'appelle",
  "ich möchte deutsch lernen": "Je voudrais apprendre l'allemand",
  "können sie mir helfen?": "Pouvez-vous m'aider ?",
  "ich verstehe nicht": "Je ne comprends pas",
  "sprechen sie deutsch?": "Parlez-vous allemand ?",
  "wo ist der bahnhof?": "Où est la gare ?",
  "freut mich sehr": "Enchanté",
  "gute nacht": "Bonne nuit",
  "guten appetit": "Bon appétit",
  "bis bald": "À bientôt",
  "herzlich willkommen": "Bienvenue",

  // EN -> DE
  "hello": "Guten Tag",
  "hello, how are you?": "Guten Tag, wie geht es Ihnen?",
  "hello how are you": "Guten Tag, wie geht es Ihnen?",
  "hi": "Hallo",
  "thank you": "Danke",
  "thank you very much": "Vielen Dank",
  "goodbye": "Auf Wiedersehen",
  "please": "Bitte",
  "yes": "Ja",
  "no": "Nein",
  "what is your name?": "Wie heißen Sie?",
  "what is your name": "Wie heißen Sie?",
  "my name is": "Ich heiße",
  "i would like to learn german": "Ich möchte Deutsch lernen",
  "i want to learn german": "Ich möchte Deutsch lernen",
  "can you help me?": "Können Sie mir helfen?",
  "can you help me": "Können Sie mir helfen?",
  "i don't understand": "Ich verstehe nicht",
  "do you speak german?": "Sprechen Sie Deutsch?",
  "where is the train station?": "Wo ist der Bahnhof?",
  "nice to meet you": "Freut mich sehr",
  "good night": "Gute Nacht",
  "enjoy your meal": "Guten Appetit",
  "see you soon": "Bis bald",
  "welcome": "Herzlich willkommen",
  "how much does it cost?": "Wie viel kostet das?",
  "i am a student": "Ich bin Student",

  // DE -> EN
  "wie heißen sie": "What is your name?",
  "guten morgen": "Good morning",
  "guten abend": "Good evening",
};

const SUGGESTED_PHRASES = {
  "fr-to-de": [
    "Bonjour, comment allez-vous aujourd'hui ?",
    "Je voudrais commander un café s'il vous plaît.",
    "Où se trouve la gare centrale la plus proche ?",
    "Pouvez-vous m'expliquer cette règle de déclinaison ?",
    "Je prépare l'examen de certification Goethe B1.",
  ],
  "de-to-fr": [
    "Guten Tag, wie geht es Ihnen heute?",
    "Ich möchte bitte einen Kaffee bestellen.",
    "Wo befindet sich der nächste Hauptbahnhof?",
    "Könnten Sie mir diese Grammatikregel erklären?",
    "Ich bereite mich auf die Goethe-Zertifikatsprüfung vor.",
  ],
  "en-to-de": [
    "Hello, how are you doing today?",
    "I would like to order a coffee, please.",
    "Where is the nearest central train station?",
    "Could you please explain this German case rule to me?",
    "I am studying for the official Goethe B1 exam.",
  ],
  "de-to-en": [
    "Guten Tag, wie geht es Ihnen heute?",
    "Ich möchte bitte einen Kaffee bestellen.",
    "Wo befindet sich der nächste Hauptbahnhof?",
    "Könnten Sie mir diese Grammatikregel erklären?",
    "Ich lerne Deutsch an der Sprachakademie.",
  ],
};

export const TranslatorWidget: React.FC<TranslatorWidgetProps> = ({
  isOpen,
  onClose,
  locale = "fr",
}) => {
  // Selected pair: 'fr-de' (Français - Allemand) or 'en-de' (Anglais - Allemand)
  const [selectedPair, setSelectedPair] = useState<TranslationPair>("fr-de");
  // Direction within pair: false = Base -> DE, true = DE -> Base
  const [isInverted, setIsInverted] = useState(false);

  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute active source and target
  const sourceLang: TranslationLang = isInverted
    ? "de"
    : selectedPair === "fr-de"
    ? "fr"
    : "en";

  const targetLang: TranslationLang = isInverted
    ? selectedPair === "fr-de"
      ? "fr"
      : "en"
    : "de";

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handlePairChange = (pair: TranslationPair) => {
    setSelectedPair(pair);
    setSourceText("");
    setTranslatedText("");
    setErrorMsg("");
  };

  const handleSwapDirection = () => {
    setIsInverted((prev) => !prev);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setErrorMsg("");
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate ?? sourceText).trim();
    if (!text) {
      setTranslatedText("");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const langFullNames: Record<TranslationLang, string> = {
      fr: "French (Français)",
      en: "English",
      de: "German (Deutsch)",
    };

    const srcName = langFullNames[sourceLang];
    const tgtName = langFullNames[targetLang];

    try {
      // 1. Try Backend API first (/api/ai/translate)
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.translatedText && data.translatedText.trim()) {
          setTranslatedText(data.translatedText.trim());
          return;
        }
      }

      // 2. Client-side Gemini fallback
      const prompt = `You are an elite educational language translator for bilingual students (${srcName} <-> ${tgtName}).
Translate the following ${srcName} text into natural, idiomatic, grammatically flawless ${tgtName}.
Strict rules:
1. Return ONLY the translated text in ${tgtName}.
2. Do NOT wrap in quotes, do not add introductory greetings or notes.
3. Preserve punctuation and formatting.

Text to translate:
"""
${text}
"""`;

      const result = await generateGeminiContent(prompt, {
        model: "gemini-3.1-flash-lite",
        timeoutMs: 6000,
        maxRetries: 1,
      });

      const cleanText = result.text.trim().replace(/^["']|["']$/g, "");
      setTranslatedText(cleanText);
    } catch (err: any) {
      console.warn("[Translator] AI translation fallback:", err?.message);

      // 3. Offline dictionary heuristic fallback
      const lower = text.toLowerCase().trim();
      if (FALLBACK_PHRASES[lower]) {
        setTranslatedText(FALLBACK_PHRASES[lower]);
      } else {
        const words = lower.split(/\s+/);
        const translatedWords = words.map((w) => FALLBACK_PHRASES[w] || w);
        if (translatedWords.join(" ") !== lower) {
          setTranslatedText(translatedWords.join(" "));
        } else {
          setErrorMsg(
            locale === "en"
              ? "Unable to reach online translation service. Please check your connection."
              : "Service de traduction temporairement indisponible. Vérifiez votre connexion."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: TranslationLang) => {
    if ("speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === "de") {
        utterance.lang = "de-DE";
      } else if (lang === "fr") {
        utterance.lang = "fr-FR";
      } else {
        utterance.lang = "en-US";
      }
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectQuickPhrase = (phrase: string) => {
    setSourceText(phrase);
    handleTranslate(phrase);
  };

  // Determine key for quick phrases
  const quickPhraseKey =
    selectedPair === "fr-de"
      ? isInverted
        ? "de-to-fr"
        : "fr-to-de"
      : isInverted
      ? "de-to-en"
      : "en-to-de";

  const currentQuickPhrases = SUGGESTED_PHRASES[quickPhraseKey];

  const getLangBadge = (lang: TranslationLang) => {
    switch (lang) {
      case "fr":
        return { flag: "🇫🇷", name: "Français", code: "FR" };
      case "en":
        return { flag: "🇬🇧", name: "English", code: "EN" };
      case "de":
        return { flag: "🇩🇪", name: "Deutsch (Allemand)", code: "DE" };
    }
  };

  const sourceBadge = getLangBadge(sourceLang);
  const targetBadge = getLangBadge(targetLang);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                  <Languages size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{locale === "en" ? "Bilingual Translator" : "Traducteur Bilingue"}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      {selectedPair === "fr-de" ? "FR ⇄ DE" : "EN ⇄ DE"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {locale === "en"
                      ? "Specialized pedagogical translation: French ⇄ German & English ⇄ German"
                      : "Traduction pédagogique spécialisée : Français ⇄ Allemand & Anglais ⇄ Allemand"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                title={locale === "en" ? "Close" : "Fermer"}
              >
                <X size={18} />
              </button>
            </div>

            {/* Pair Selector Tabs (FR-DE vs EN-DE) */}
            <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-slate-100/70 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
                {locale === "en" ? "Pair:" : "Mode :"}
              </span>

              <button
                type="button"
                onClick={() => handlePairChange("fr-de")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedPair === "fr-de"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <span>🇫🇷 Français ⇄ 🇩🇪 Allemand</span>
              </button>

              <button
                type="button"
                onClick={() => handlePairChange("en-de")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedPair === "en-de"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <span>🇬🇧 English ⇄ 🇩🇪 Deutsch</span>
              </button>
            </div>

            {/* Direction Bar with Invert Button */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              {/* Source Lang Tag */}
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-100">
                <span className="text-lg">{sourceBadge.flag}</span>
                <span>{sourceBadge.name}</span>
              </div>

              {/* Swap Direction Button */}
              <button
                type="button"
                onClick={handleSwapDirection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white text-xs font-bold transition shadow-xs cursor-pointer"
                title={locale === "en" ? "Swap translation direction" : "Inverser le sens de traduction"}
              >
                <ArrowRightLeft size={13} />
                <span>{sourceBadge.code} ➔ {targetBadge.code}</span>
              </button>

              {/* Target Lang Tag */}
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-100">
                <span>{targetBadge.name}</span>
                <span className="text-lg">{targetBadge.flag}</span>
              </div>
            </div>

            {/* Translation Body */}
            <div className="p-6 space-y-4">
              {/* Source Input Box */}
              <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
                <textarea
                  ref={textareaRef}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleTranslate();
                    }
                  }}
                  placeholder={
                    sourceLang === "fr"
                      ? "Saisissez votre texte en français à traduire en allemand (ex: 'Bonjour, comment allez-vous ?')..."
                      : sourceLang === "en"
                      ? "Enter English text to translate to German (e.g. 'Good morning, how are you?')..."
                      : "Geben Sie deutschen Text ein, um ihn zu übersetzen (z.B. 'Guten Tag, wie geht es Ihnen?')..."
                  }
                  rows={4}
                  className="w-full resize-none p-4 pb-10 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none leading-relaxed"
                />

                {/* Bottom Source Controls */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {sourceText.trim() && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSpeak(sourceText, sourceLang)}
                          className="flex items-center gap-1 p-1 hover:text-indigo-500 transition cursor-pointer"
                          title={locale === "en" ? "Listen to source text" : "Écouter le texte source"}
                        >
                          <Volume2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSourceText("");
                            setTranslatedText("");
                          }}
                          className="flex items-center gap-1 p-1 hover:text-rose-500 transition cursor-pointer"
                          title={locale === "en" ? "Clear" : "Effacer"}
                        >
                          <RotateCcw size={13} />
                        </button>
                      </>
                    )}
                  </div>
                  <span>
                    {sourceText.length} {locale === "en" ? "characters" : "caractères"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {locale === "en" ? "Tip: Press Ctrl + Enter to translate" : "Astuce : Ctrl + Entrée pour traduire"}
                </span>

                <button
                  type="button"
                  disabled={!sourceText.trim() || isLoading}
                  onClick={() => handleTranslate()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#6D5DFC] hover:from-indigo-500 hover:to-[#7e70fc] text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed ml-auto cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>{locale === "en" ? "Translating..." : "Traduction en cours..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>{locale === "en" ? "Translate now" : "Traduire maintenant"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Result Translation Box */}
              {(translatedText || isLoading) && (
                <div className="relative rounded-2xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-4 space-y-3 transition">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-500" />
                      <span>
                        {targetLang === "de"
                          ? (locale === "en" ? "Translation in German (Deutsch)" : "Traduction en Allemand (Deutsch)")
                          : targetLang === "fr"
                          ? (locale === "en" ? "Translation in French" : "Traduction en Français")
                          : (locale === "en" ? "Translation in English" : "Traduction en Anglais")}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeak(translatedText, targetLang)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
                        title={locale === "en" ? "Listen to pronunciation" : "Écouter la prononciation"}
                      >
                        <Volume2 size={13} />
                        <span className="hidden sm:inline">{locale === "en" ? "Listen" : "Écouter"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
                        title={locale === "en" ? "Copy translation" : "Copier la traduction"}
                      >
                        {copied ? (
                          <>
                            <Check size={13} className="text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {locale === "en" ? "Copied!" : "Copié !"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span className="hidden sm:inline">{locale === "en" ? "Copy" : "Copier"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed select-text min-h-[48px]">
                    {isLoading ? (
                      <span className="text-slate-400 italic flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-indigo-500" />
                        {locale === "en"
                          ? "Generating linguistic translation..."
                          : "Génération de la traduction linguistique..."}
                      </span>
                    ) : (
                      translatedText
                    )}
                  </p>
                </div>
              )}

              {/* Quick Learning Phrases */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb size={13} className="text-amber-400" />
                  <span>{locale === "en" ? "Quick practice phrases :" : "Phrases d'entraînement rapide :"}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentQuickPhrases.map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickPhrase(phrase)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 transition text-left cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
