import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Student,
  School,
  ChatMessage,
  SupportedLanguage,
  UILocale,
} from "../../types";
import { translations } from "../../lib/translations";
import { NeonButton } from "../common/NeonButton";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Volume2,
  Brain,
  RotateCcw,
  MessageSquare,
  Zap,
} from "lucide-react";

interface AIChatTutorProps {
  student: Student;
  school: School;
  locale: UILocale;
}

export const AIChatTutor: React.FC<AIChatTutorProps> = ({
  student,
  school,
  locale,
}) => {
  const t = translations[locale];
  const language: SupportedLanguage = school.language;

  // Multi-turn messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "model",
      content:
        language === "german"
          ? `Hallo ${student.name}! Ich bin dein persönlicher KI-Sprachtutor an der ${school.name}. Wie kann ich dir heute mit Deutsch auf Niveau ${student.level} helfen?`
          : `Ciao ${student.name}! Sono il tuo tutor virtuale di lingua presso ${school.name}. Come posso aiutarti oggi con l'italiano di livello ${student.level}?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Audio Output
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "german" ? "de-DE" : "it-IT";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quick conversation suggestions
  const suggestions =
    language === "german"
      ? [
          "Simulieren wir eine Bestellung im Restaurant auf Deutsch!",
          "Erkläre mir den Unterschied zwischen Dativ und Akkusativ mit Beispielen.",
          "Stell mir 3 Fragen zu meinem Alltag auf Deutsch.",
          "Wie kann ich mich auf Deutsch höflich entschuldigen?",
        ]
      : [
          "Facciamo finta di ordinare al ristorante in italiano!",
          "Spiegami la differenza tra Passato Prossimo e Imperfetto.",
          "Fammi 3 domande sulla mia giornata in italiano.",
          "Come posso chiedere informazioni per strada a Roma?",
        ];

  // Send message to Gemini backend `/api/ai/chat`
  const handleSendMessage = async (promptToSend?: string) => {
    const textToSend = promptToSend || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt("");
    setIsLoading(true);

    try {
      // Map history for API
      const historyPayload = newHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload.slice(0, -1), // prior history
          language,
          level: student.level,
          schoolName: school.name,
          thinkingMode: useThinkingMode,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de communication avec le tuteur IA.");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: data.reply || "Antwort bereit.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content:
          language === "german"
            ? "Entschuldigung, es gab einen Fehler bei der Verbindung. Bitte versuche es noch einmal."
            : "Mi dispiace, si è verificato un errore di connessione. Riprova tra poco.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        role: "model",
        content:
          language === "german"
            ? `Konversation neu gestartet! Was möchtest du heute auf Deutsch üben?`
            : `Conversazione riavviata! Cosa vorresti praticare oggi in italiano?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="neon-card rounded-3xl p-4 sm:p-6 flex flex-col h-[580px] sm:h-[650px] max-h-[85vh]">
      {/* Chat Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shrink-0">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {locale === "en" ? "Virtual AI Tutor" : "Tuteur IA Virtuel"}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-500">
                {language === "german" ? (locale === "en" ? "German 🇩🇪" : "Allemand 🇩🇪") : (locale === "en" ? "Italian 🇮🇹" : "Italien 🇮🇹")} • {student.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {locale === "en" ? "Interactive multi-turn conversation • Real-time correction" : "Dialogue interactif multi-tours • Correction en temps réel"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Thinking Mode Toggle */}
          <button
            type="button"
            onClick={() => setUseThinkingMode(!useThinkingMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[36px] ${
              useThinkingMode
                ? "bg-violet-600/10 text-violet-600 border-violet-500/40 dark:text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "bg-slate-100 text-slate-600 border-transparent dark:bg-slate-800 dark:text-slate-400"
            }`}
            title={locale === "en" ? "Enables in-depth pedagogical reasoning for complex grammar explanations" : "Active le raisonnement approfondi pour des explications grammaticales complexes"}
          >
            <Brain size={14} className={useThinkingMode ? "text-violet-500 animate-pulse" : ""} />
            <span className="text-[11px] sm:text-xs">Thinking Mode</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title={locale === "en" ? "Reset conversation" : "Réinitialiser la conversation"}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`group relative max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/50"
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>

                {/* Voice Speak button for Bot */}
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(m.content)}
                    className="absolute -right-7 top-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition"
                    title={locale === "en" ? "Listen to pronunciation" : "Écouter la prononciation"}
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400 animate-pulse pl-10">
            <Sparkles size={14} className="animate-spin" />
            <span>
              {useThinkingMode
                ? (locale === "en" ? "In-depth pedagogical reasoning in progress..." : "Raisonnement pédagogique approfondi en cours...")
                : (locale === "en" ? "The AI tutor is crafting a response..." : "Le tuteur rédige sa réponse...")}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(s)}
              className="shrink-0 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] px-3 py-1 text-slate-600 dark:text-slate-300 transition"
            >
              💬 {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          id="ai-chat-input-field"
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            language === "german"
              ? "Schreibe eine Nachricht auf Deutsch..."
              : "Scrivi un messaggio in italiano..."
          }
          className="flex-1 h-11 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-white/10 dark:bg-slate-900 dark:text-white transition"
        />

        <NeonButton
          id="ai-chat-send-btn"
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputPrompt.trim() || isLoading}
          icon={<Send size={15} />}
        >
          {locale === "en" ? "Send" : "Envoyer"}
        </NeonButton>
      </form>
    </div>
  );
};
