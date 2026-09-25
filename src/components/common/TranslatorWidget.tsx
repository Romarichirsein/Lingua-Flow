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
  BookOpen,
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

// Built-in offline pedagogical dictionary fallback for high availability
const FALLBACK_PHRASES: Record<string, string> = {
  "bonjour": "Hello",
  "bonjour, comment allez-vous ?": "Hello, how are you?",
  "bonjour comment allez-vous": "Hello, how are you?",
  "salut": "Hi",
  "merci": "Thank you",
  "merci beaucoup": "Thank you very much",
  "au revoir": "Goodbye",
  "s'il vous plaît": "Please",
  "oui": "Yes",
  "non": "No",
  "comment vous appelez-vous ?": "What is your name?",
  "je m'appelle": "My name is",
  "je voudrais apprendre": "I would like to learn",
  "pouvez-vous m'aider ?": "Can you help me?",
  "je ne comprends pas": "I don't understand",
  "parlez-vous anglais ?": "Do you speak English?",
  "parlez-vous français ?": "Do you speak French?",
  "où est la gare ?": "Where is the train station?",
  "enchanté": "Nice to meet you",
  // English to French
  "hello": "Bonjour",
  "hello, how are you?": "Bonjour, comment allez-vous ?",
  "thank you": "Merci",
  "thank you very much": "Merci beaucoup",
  "goodbye": "Au revoir",
  "please": "S'il vous plaît",
  "yes": "Oui",
  "no": "Non",
  "what is your name?": "Comment vous appelez-vous ?",
  "my name is": "Je m'appelle",
  "i don't understand": "Je ne comprends pas",
  "can you help me?": "Pouvez-vous m'aider ?",
  "nice to meet you": "Enchanté",
  "do you speak french?": "Parlez-vous français ?",
};

const SUGGESTED_PHRASES_FR = [
  "Bonjour, comment allez-vous aujourd'hui ?",
  "Je voudrais perfectionner ma prononciation.",
  "Pouvez-vous m'expliquer cette règle de grammaire ?",
  "Je prépare un examen de certification linguistique.",
  "Pourriez-vous répéter plus lentement s'il vous plaît ?",
];

const SUGGESTED_PHRASES_EN = [
  "Hello, how are you doing today?",
  "I would like to practice conversational skills.",
  "Could you explain this grammatical rule to me?",
  "I am preparing for an international language exam.",
  "Could you please speak a little more slowly?",
];

export const TranslatorWidget: React.FC<TranslatorWidgetProps> = ({
  isOpen,
  onClose,
  locale = "fr",
}) => {
  const [direction, setDirection] = useState<"fr-en" | "en-fr">("fr-en");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSwapDirection = () => {
    setDirection((prev) => (prev === "fr-en" ? "en-fr" : "fr-en"));
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

    const isFrToEn = direction === "fr-en";
    const sourceLang = isFrToEn ? "French" : "English";
    const targetLang = isFrToEn ? "English" : "French";

    try {
      // 1. Try Gemini AI Translation
      const prompt = `You are an elite educational language translator for bilingual students (English <-> French).
Translate the following ${sourceLang} text into natural, idiomatic, grammatically flawless ${targetLang}.
Strict rules:
1. Return ONLY the translated text in ${targetLang}.
2. Do NOT wrap in quotes, do not add introductory greetings or notes.
3. Preserve punctuation and formatting.

Text to translate:
"""
${text}
"""`;

      const result = await generateGeminiContent(prompt, {
        model: "gemini-3.1-flash-lite",
        timeoutMs: 9000,
        maxRetries: 2,
      });

      const cleanText = result.text.trim().replace(/^["']|["']$/g, "");
      setTranslatedText(cleanText);
    } catch (err: any) {
      console.warn("[Translator] Gemini translation fallback:", err?.message);

      // 2. Offline dictionary / heuristic fallback
      const lower = text.toLowerCase();
      if (FALLBACK_PHRASES[lower]) {
        setTranslatedText(FALLBACK_PHRASES[lower]);
      } else {
        // Simple direct word-by-word fallback if simple sentence
        const words = lower.split(/\s+/);
        const translatedWords = words.map((w) => FALLBACK_PHRASES[w] || w);
        if (translatedWords.join(" ") !== lower) {
          setTranslatedText(translatedWords.join(" "));
        } else {
          setErrorMsg(
            locale === "en"
              ? "Unable to reach translation service. Please check your network connection."
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

  const handleSpeak = (text: string, lang: "fr" | "en") => {
    if ("speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "fr" ? "fr-FR" : "en-US";
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectQuickPhrase = (phrase: string) => {
    setSourceText(phrase);
    handleTranslate(phrase);
  };

  const isFrToEn = direction === "fr-en";
  const currentQuickPhrases = isFrToEn ? SUGGESTED_PHRASES_FR : SUGGESTED_PHRASES_EN;

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
                    <span>Traducteur Bilingue</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                      FR ⇄ EN
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {locale === "en"
                      ? "Bidirectional English ⇄ French linguistic translation with voice audio"
                      : "Traduction linguistique bidirectionnelle Français ⇄ Anglais avec synthèse vocale"}
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

            {/* Language Switcher Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              {/* Source Lang Tag */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <span className="text-base">{isFrToEn ? "🇫🇷" : "🇬🇧"}</span>
                <span>{isFrToEn ? "Français" : "English"}</span>
              </div>

              {/* Swap Direction Button */}
              <button
                type="button"
                onClick={handleSwapDirection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white text-xs font-bold transition shadow-xs cursor-pointer"
                title={locale === "en" ? "Swap direction" : "Inverser la langue"}
              >
                <ArrowRightLeft size={13} />
                <span>{isFrToEn ? "FR ➔ EN" : "EN ➔ FR"}</span>
              </button>

              {/* Target Lang Tag */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>{isFrToEn ? "English" : "Français"}</span>
                <span className="text-base">{isFrToEn ? "🇬🇧" : "🇫🇷"}</span>
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
                    isFrToEn
                      ? "Saisissez votre texte en français à traduire en anglais (ex: 'Bonjour, comment allez-vous ?')..."
                      : "Enter English text to translate to French (e.g., 'Good morning, how are you?')..."
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
                          onClick={() => handleSpeak(sourceText, isFrToEn ? "fr" : "en")}
                          className="flex items-center gap-1 p-1 hover:text-indigo-500 transition cursor-pointer"
                          title="Écouter le texte source"
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
                          title="Effacer"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </>
                    )}
                  </div>
                  <span>{sourceText.length} caractères</span>
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
                      <span>{isFrToEn ? "Traduction en Anglais" : "Traduction en Français"}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeak(translatedText, isFrToEn ? "en" : "fr")}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
                        title={locale === "en" ? "Listen pronunciation" : "Écouter la prononciation"}
                      >
                        <Volume2 size={13} />
                        <span className="hidden sm:inline">Écouter</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
                        title="Copier la traduction"
                      >
                        {copied ? (
                          <>
                            <Check size={13} className="text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span className="hidden sm:inline">Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed select-text min-h-[48px]">
                    {isLoading ? (
                      <span className="text-slate-400 italic flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-indigo-500" />
                        Génération de la traduction linguistique...
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
