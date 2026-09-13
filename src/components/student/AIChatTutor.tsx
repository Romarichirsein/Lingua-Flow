import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Student,
  School,
  ChatMessage,
  SupportedLanguage,
  UILocale,
  CEFRLevel,
} from "../../types";
import { translations } from "../../lib/translations";
import { NeonButton } from "../common/NeonButton";
import {
  Bot,
  User,
  Send,
  Languages,
  Loader2,
  Volume2,
  Brain,
  RotateCcw,
  Zap,
  Sparkles,
  HelpCircle,
  MessageSquare,
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
  const isEn = locale === "en";
  const isGerman = language === "german";

  // CEFR Level state synced with student.level
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>(student.level || "B1");

  // Keep synced if student.level updates
  useEffect(() => {
    if (student.level) {
      setActiveLevel(student.level);
    }
  }, [student.level, student.id]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Open-ended initial welcome message emphasizing total freedom of topic
  const getOpenInitialWelcome = (
    lvl: CEFRLevel,
    lang: SupportedLanguage,
    name: string,
    schName: string
  ) => {
    if (lang === "german") {
      switch (lvl) {
        case "A1":
          return `Hallo ${name}! 👋 Willkommen bei deinem persönlichen KI-Sprachtutor an der ${schName}.\n\nIch bin voll einsatzbereit und habe keinerlei Themenbeschränkungen: Wir können über alles sprechen, was dich interessiert (dein Alltag, Hobbys, Familie, Urlaub, Essen), einfache Fragen üben oder deutsche Vokabeln lernen.\n\nIch passe meine Sprache an dein A1-Niveau an (kurze Sätze, klare Wörter). Worüber möchtest du heute sprechen?`;
        case "A2":
          return `Hallo ${name}! 🌟 Schön, dich zu sehen an der ${schName}.\n\nAls dein KI-Tutor stehe ich dir für jedes beliebige Thema zur Verfügung: Gespräche über deine Pläne, praktische Lebenssituationen in Deutschland, Vergangenheitsformen (Perfekt) oder die Erklärung von Regeln.\n\nDu hast die freie Wahl! Worüber möchtest du dich heute austauschen?`;
        case "B1":
          return `Guten Tag ${name}! 🚀 Willkommen bei deinem KI-Sprachtutor an der ${schName}.\n\nIch verfüge über alle didaktischen und sprachlichen Fähigkeiten, um dich zu begleiten – ganz ohne Limitierung. Wir können über jedes gesellschaftliche, berufliche oder persönliche Thema debattieren, Goethe/TELC-Prüfungsformate trainieren, deine Grammatik perfektionieren oder ein realistisches Rollenspiel starten.\n\nWelches Thema liegt dir heute auf dem Herzen?`;
        case "B2":
          return `Herzlich willkommen, ${name}! 💼 Als dein fortgeschrittener Sprachcoach an der ${schName} trainieren wir auf Niveau B2.\n\nOb anspruchsvolle Fachdiskussionen, geschäftliche Verhandlungen, differenzierte Argumentation, idiomatische Wendungen oder komplexe Satzstrukturen (Konjunktiv II, Passiv): Ich passe mich jedem Thema an, das du anschneidest.\n\nWelche Fragestellung oder welches Szenario möchtest du heute angehen?`;
        case "C1":
          return `Guten Tag ${name}. 🎓 Willkommen im C1-Exzellenzcoaching an der ${schName}.\n\nIch begleite dich mit vollständiger muttersprachlicher und akademischer Kompetenz durch alle Sphären: philosophischer Diskurs, Wirtschaft, Politik, Literatur, stilistische Feinheiten oder anspruchsvolle Debatten.\n\nWelchen Diskurs oder welche linguistische Herausforderung möchtest du heute eröffnen?`;
        case "C2":
        default:
          return `Willkommen ${name}. 🏛️ Als KI-Sprachcoach auf C2-Exzellenzniveau stehe ich dir mit unbegrenzter sprachlicher und intellektueller Bandbreite zur Seite.\n\nVon rhetorischen Finessen und stilistischer Virtuosität bis hin zu profundem Diskurs zu jedem denkbaren Sujet: Du führst das Gespräch nach Belieben.\n\nWelches Thema explorieren wir heute?`;
      }
    } else {
      return `Ciao ${name}! 👋 Benvenuto al tuo tutor linguistico AI presso ${schName}.\n\nHo tutte le mie facoltà attive e senza limiti di argomento: possiamo conversare liberamente di qualunque tema desideri, esercitarci sulla grammatica, preparare una situazione reale o arricchire il tuo vocabolario al livello ${lvl}.\n\nDi cosa vorresti parlare oggi?`;
    }
  };

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome-init",
      role: "model",
      content: getOpenInitialWelcome(activeLevel, language, student.name, school.name),
      timestamp: new Date().toISOString(),
    },
  ]);

  // Update initial message if level changes on brand new chat
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: `msg-welcome-lvl-${activeLevel}-${Date.now()}`,
          role: "model",
          content: getOpenInitialWelcome(activeLevel, language, student.name, school.name),
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [activeLevel, student.id, student.name, language, school.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Audio Output adapted to level
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Clean pedagogical bracket notes for pristine natural pronunciation
      const cleaned = text.replace(/\[💡[^\]]*\]/gi, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = language === "german" ? "de-DE" : "it-IT";

      const rates: Record<CEFRLevel, number> = {
        A1: 0.8,
        A2: 0.88,
        B1: 0.95,
        B2: 1.0,
        C1: 1.05,
        C2: 1.08,
      };
      utterance.rate = rates[activeLevel] || 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Open inspiring triggers adapted to level (purely optional prompt inspirations)
  const getOpenPromptInspirations = (lvl: CEFRLevel, lang: SupportedLanguage): string[] => {
    if (lang === "german") {
      switch (lvl) {
        case "A1":
          return [
            "Erzähl mir von dir und was du gerne machst.",
            "Wie bestelle ich höflich im Restaurant auf Deutsch?",
            "Erklär mir die W-Fragen mit Beispielen.",
            "Lass uns über das Wochenende sprechen.",
          ];
        case "A2":
          return [
            "Was hast du am Wochenende Schönes unternommen?",
            "Erklär mir den Unterschied zwischen Perfekt und Präteritum.",
            "Simulieren wir ein Gespräch beim Arzt oder in der Apotheke.",
            "Wie beschreibe ich meinen Beruf und meine Hobbys?",
          ];
        case "B1":
          return [
            "Lass uns ein Vorstellungsgespräch auf Deutsch üben.",
            "Was sind die Vor- und Nachteile von Homeoffice und digitalem Arbeiten?",
            "Erklär mir den Konjunktiv II mit praktischen Beispielen.",
            "Ich möchte über ein aktuelles Thema diskutieren.",
          ];
        case "B2":
          return [
            "Lass uns über den Einfluss von KI auf Wirtschaft und Arbeitswelt debattieren.",
            "Simulieren wir eine Verhandlung oder eine geschäftliche E-Mail.",
            "Welche Verben mit festen Präpositionen sollte man unbedingt beherrschen?",
            "Kannst du diesen Text korrigieren und mir stilistisches Feedback geben?",
          ];
        case "C1":
        case "C2":
        default:
          return [
            "Analysieren wir die gesellschaftlichen Herausforderungen der Energiewende.",
            "Erläutere subtile stilistische Nuancen und erweiterte Partizipialattribute.",
            "Diskutieren wir über moderne Philosophie, Literatur oder Technologie.",
            "Gib mir eine anspruchsvolle Replik auf eine kontroverse These.",
          ];
      }
    } else {
      return [
        "Parliamo liberamente delle mie passioni.",
        "Spiegami una regola grammaticale con esempi.",
        "Simuliamo una conversazione reale.",
        "Aiutami a migliorare il mio vocabolario.",
      ];
    }
  };

  const openInspirations = getOpenPromptInspirations(activeLevel, language);

  // Send message to backend `/api/ai/chat` with unlimited faculties
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

    // Clean history before sending: strip initial greeting templates
    const conversationHistory = newHistory
      .filter((m) => m.id !== "msg-welcome-init" && !m.id.startsWith("msg-welcome-reset") && !m.id.startsWith("msg-welcome-lvl"))
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    let replyText = "";

    try {
      // Prior turns sent as history (clean, omitting welcome headers)
      const historyPayload = messages
        .filter((m) => m.id !== "msg-welcome-init" && !m.id.startsWith("msg-welcome-reset") && !m.id.startsWith("msg-welcome-lvl"))
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          language,
          level: activeLevel,
          studentName: student.name,
          schoolName: school.name,
          thinkingMode: useThinkingMode,
          topic: "Offenes Thema / Freier Diskurs",
          practiceMode: "conversation",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.reply && typeof data.reply === "string" && data.reply.trim().length > 0) {
          replyText = data.reply.trim();
        }
      } else {
        const errText = await res.text();
        console.warn("[AIChatTutor] Server returned status", res.status, errText);
      }
    } catch (e) {
      console.warn("[AIChatTutor] Error calling /api/ai/chat:", e);
    }

    try {
      if (!replyText) {
        const cleanName = student.name.split(" ")[0] || "Romaric";
        replyText = `⚠️ Entschuldigung ${cleanName}! Die Verbindung zum KI-Tutor hat kurzzeitig verzögert reagiert. Bitte sende deine Frage noch einmal ab oder klicke auf Senden.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: replyText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-reset-${Date.now()}`,
        role: "model",
        content: getOpenInitialWelcome(activeLevel, language, student.name, school.name),
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const levelDescriptions: Record<CEFRLevel, { fr: string; en: string; de: string }> = {
    A1: {
      de: "A1 Anfänger : Kurze Sätze, Grundwortschatz, Präsens & klare Aussprache",
      fr: "A1 Débutant : phrases courtes, vocabulaire de base, présent et prononciation claire",
      en: "A1 Beginner: short sentences, essential words, present tense & clear pacing",
    },
    A2: {
      de: "A2 Grundlagen : Alltag, Familie, Hobbys, Perfekt (Vergangenheit) & Nebensätze",
      fr: "A2 Élémentaire : vie quotidienne, passé composé (Perfekt) & subordonnées simples",
      en: "A2 Elementary: daily life, past tense (Perfekt) & simple subordinate clauses",
    },
    B1: {
      de: "B1 Mittelstufe : Flüssige Meinungsäußerung, TELC/Goethe-Format & Konjunktiv II",
      fr: "B1 Intermédiaire : expression d'opinions, format officiel TELC/Goethe & conditionnel",
      en: "B1 Intermediate: fluent opinions, TELC/Goethe exam format & subjunctive II",
    },
    B2: {
      de: "B2 Gute Mittelstufe : Berufsalltag, Vorstellungsgespräch, Rektion & Passiv",
      fr: "B2 Avancé : milieu professionnel, argumentation approfondie, passif et rection",
      en: "B2 Upper Intermediate: professional discourse, advanced argumentation & passive",
    },
    C1: {
      de: "C1 Fortgeschritten : Akademischer Diskurs, idiomatische Nuancen & Partizipien",
      fr: "C1 Expert : style académique, nuances idiomatiques, tournures complexes",
      en: "C1 Advanced: academic discourse, nuanced idioms & complex participle clauses",
    },
    C2: {
      de: "C2 Exzellenz : Muttersprachliches Niveau, rhetorische Finesse & literarische Tiefe",
      fr: "C2 Maîtrise : niveau bilingue, finesse rhétorique & profondeur stylistique",
      en: "C2 Mastery: native-like fluency, rhetorical subtleties & deep stylistic range",
    },
  };

  // Helper to render pedagogical tips with distinct high-contrast styling
  const renderMessageContent = (content: string) => {
    // Check if message contains pedagogical tip in [💡 Conseil ...]
    const parts = content.split(/(\[💡[^\]]+\])/g);
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          if (part.startsWith("[💡")) {
            const tipText = part.replace(/^\[💡\s*/, "").replace(/\]$/, "");
            return (
              <div
                key={idx}
                className="my-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed flex items-start gap-2 shadow-xs"
              >
                <span className="shrink-0 text-base leading-none">💡</span>
                <div className="flex-1 font-medium">{tipText}</div>
              </div>
            );
          }
          return (
            <p key={idx} className="whitespace-pre-line leading-relaxed">
              {part}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="neon-card rounded-3xl p-3 sm:p-5 flex flex-col h-[700px] sm:h-[750px] max-h-[90vh]">
      {/* Header: Identity, CEFR Level Selector, Thinking Mode, Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shrink-0">
            <Bot size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isGerman ? "KI-Sprachtutor Deutsch" : "Tutor Linguistico AI"}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {isGerman ? "DACH 🇩🇪 🇦🇹 🇨🇭" : "IT 🇮🇹"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Gemini 3 Flash • Connecté</span>
                </span>
              </h3>

              {/* CEFR Level Selector Pill */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEn ? "Level" : "Niveau"}
                </span>
                <select
                  value={activeLevel}
                  onChange={(e) => {
                    const newLvl = e.target.value as CEFRLevel;
                    setActiveLevel(newLvl);
                    setMessages([
                      {
                        id: `msg-welcome-lvl-${newLvl}-${Date.now()}`,
                        role: "model",
                        content: getOpenInitialWelcome(newLvl, language, student.name, school.name),
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                  }}
                  className="bg-transparent text-xs font-black text-indigo-600 dark:text-indigo-400 outline-none cursor-pointer"
                  title={levelDescriptions[activeLevel][isEn ? "en" : "fr"]}
                >
                  <option value="A1">A1 (Anfänger / Débutant)</option>
                  <option value="A2">A2 (Grundlagen / Élémentaire)</option>
                  <option value="B1">B1 (Mittelstufe / Intermédiaire)</option>
                  <option value="B2">B2 (Gute Mittelstufe / Avancé)</option>
                  <option value="C1">C1 (Fortgeschritten / Expert)</option>
                  <option value="C2">C2 (Exzellenz / Maîtrise)</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 line-clamp-1">
              <Zap size={11} className="text-amber-500 shrink-0" />
              <span>{levelDescriptions[activeLevel][locale === "en" ? "en" : locale === "fr" ? "fr" : "de"]}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Thinking Mode Toggle */}
          <button
            type="button"
            onClick={() => setUseThinkingMode(!useThinkingMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[36px] ${
              useThinkingMode
                ? "bg-violet-600/10 text-violet-600 border-violet-500/40 dark:text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "bg-slate-100 text-slate-600 border-transparent dark:bg-slate-800 dark:text-slate-400"
            }`}
            title={
              locale === "en"
                ? "Deep pedagogical reasoning for syntax and grammar breakdown"
                : "Raisonnement linguistique approfondi pour l'analyse syntaxique et grammaticale"
            }
          >
            <Brain size={14} className={useThinkingMode ? "text-violet-500 animate-pulse" : ""} />
            <span className="text-[11px]">Thinking Mode</span>
          </button>

          {/* Reset Chat */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60"
            title={locale === "en" ? "Reset conversation" : "Réinitialiser la conversation"}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1.5">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm"
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`group relative max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-50 text-slate-900 dark:bg-slate-800/90 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/60 shadow-xs"
                }`}
              >
                {renderMessageContent(m.content)}

                {/* Voice Speak button for Bot with level-adapted speech rate */}
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(m.content)}
                    className="absolute -right-7 top-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition p-1 cursor-pointer"
                    title={
                      locale === "en"
                        ? `Listen with native German pronunciation (${activeLevel})`
                        : `Écouter la prononciation allemande (${activeLevel})`
                    }
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
            <Loader2 size={14} className="animate-spin" />
            <span>
              {useThinkingMode
                ? (locale === "en"
                    ? `In-depth pedagogical reasoning for CEFR ${activeLevel}...`
                    : `Analyse et formulation approfondie (CECRL ${activeLevel})...`)
                : (locale === "en"
                    ? `Formulating level-${activeLevel} German reply...`
                    : `Le tuteur rédige une réponse adaptée au niveau ${activeLevel}...`)}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Spontaneous Impulse Suggestions (Purely open inspirations, never restricting) */}
      {messages.length <= 3 && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" />
            {isEn ? "Inspirations:" : "Idées d'échanges :"}
          </span>

          {openInspirations.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(s)}
              className="shrink-0 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] px-3 py-1 text-slate-700 dark:text-slate-300 transition border border-slate-200/60 dark:border-slate-700/60 cursor-pointer truncate max-w-[320px]"
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
        className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          id="ai-chat-input-field"
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            isGerman
              ? `Écris ou pose n'importe quelle question en allemand (${activeLevel}) : sujet libre, grammaire, discussion...`
              : `Scrivi qualsiasi messaggio o domanda in italiano (${activeLevel})...`
          }
          className="flex-1 h-11 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-white/10 dark:bg-slate-900 dark:text-white transition shadow-inner"
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
