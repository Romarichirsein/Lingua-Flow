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
import { sendGeminiChatMessage } from "../../lib/gemini";
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
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; connected: boolean; model: string } | null>(null);

  // Probe real backend AI connectivity
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        if (data?.aiEngine?.gemini) {
          setAiStatus({
            configured: !!data.aiEngine.gemini.configured,
            connected: true,
            model: data.aiEngine.gemini.model || "gemini-3.1-flash-lite",
          });
        }
      })
      .catch(() => {
        setAiStatus({
          configured: false,
          connected: false,
          model: "Non connecté",
        });
      });
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Open-ended initial welcome message emphasizing LinguaFlow AI specialized German agent
  const getOpenInitialWelcome = (
    lvl: CEFRLevel,
    lang: SupportedLanguage,
    name: string,
    schName: string
  ) => {
    if (lang === "german") {
      switch (lvl) {
        case "A1":
          return `Hallo ${name}! 👋 Ich bin **LinguaFlow AI**, dein spezialisierter KI-Sprachagent für Deutsch an der ${schName}.\n\nAls dedizierter Experte für die deutsche Sprache (Deutschland 🇩🇪, Österreich 🇦🇹, Schweiz 🇨🇭) begleite ich dich gezielt auf Niveau A1:\n• Einfache Alltagsdialoge & Begrüßungen\n• Die 4 Fälle (Nominativ, Akkusativ, Dativ) klar und einfach erklärt\n• Satzbau & wichtige Verben (sein, haben, möchten, gehen)\n• Praktische Alltagssimulationen (im Café, beim Bäcker, im Hotel)\n\nIch passe mich deinem Tempo und Niveau an. Worüber möchtest du heute sprechen oder welche Frage hast du?`;
        case "A2":
          return `Hallo ${name}! 🌟 Schön, dich zu sehen. Ich bin **LinguaFlow AI**, dein spezialisierter KI-Sprachagent für Deutsch an der ${schName}.\n\nAuf Niveau A2 erweitern wir deine sprachliche Souveränität für den DACH-Raum:\n• Flüssiges Erzählen in der Vergangenheit (Perfekt mit haben/sein)\n• Trennbare Verben, Modalverben und Wechselpräpositionen (an, auf, in...)\n• Praktische Situationen (Arztbesuch, Fahrkartenkauf, Wegbeschreibung)\n• Erste Vorbereitung auf Prüfungsformate (Goethe / TELC A2)\n\nStelle mir jede beliebige Grammatikfrage oder starte ein freies Gespräch!`;
        case "B1":
          return `Guten Tag ${name}! 🚀 Willkommen bei **LinguaFlow AI**, deinem spezialisierten Sprach- und Prüfungscoach für Deutsch an der ${schName}.\n\nAuf Niveau B1 trainieren wir deine selbstständige Sprachverwendung für Alltag, Beruf und Zertifikate:\n• Eigene Meinungen überzeugend begründen & diskutieren\n• Nebensätze mit 'weil', 'obwohl', 'dass' sowie Konjunktiv II (Wünsche & Höflichkeit)\n• Realistische Simulationen: Vorstellungsgespräch, Bürgeramt oder offizielle E-Mails\n• Intensivtraining für das Goethe-Zertifikat B1 / TELC Deutsch B1\n\nWelches Thema, welche Grammatikregel oder welches Prüfungsszenario gehen wir heute an?`;
        case "B2":
          return `Herzlich willkommen, ${name}! 💼 **LinguaFlow AI** steht dir als spezialisierter Sprachagent für fortgeschrittenes Deutsch (B2) zur Seite.\n\nWir perfektionieren deine berufsbezogene und akademische Ausdrucksfähigkeit im deutschsprachigen Raum:\n• Wirtschaftsdeutsch & anspruchsvolle Verhandlungsgespräche\n• Passivkonstruktionen (Vorgangspassiv / Zustandspassiv) und feste Verben mit Präpositionen\n• Differenzierte Satzverknüpfungen (einerseits/andererseits, je... desto, insofern als)\n• Gezielte Vorbereitung auf Goethe B2 und TELC B2 Beruf\n\nWelche Fragestellung, Textkorrektur oder Diskussion möchtest du eröffnen?`;
        case "C1":
          return `Guten Tag ${name}. 🎓 Willkommen im C1-Exzellenztraining mit **LinguaFlow AI** an der ${schName}.\n\nAls spezialisierter linguistischer Agent führe ich dich durch anspruchsvollste Sphären der deutschen Sprache:\n• Akademischer, wirtschaftlicher und politischer Diskurs\n• Komplexe Nominal- und Partizipialstrukturen, Konjunktiv I (indirekte Rede)\n• Subtile idiomatische Wendungen und länderspezifische DACH-Feinheiten\n• Exzellenztraining für TestDaF, DSH, Goethe C1 und TELC C1 Hochschule\n\nWelche intellektuelle oder linguistische Herausforderung möchtest du heute analysieren?`;
        case "C2":
        default:
          return `Willkommen ${name}. 🏛️ Als hochspezialisierter KI-Sprachagent für die deutsche Sprache steht dir **LinguaFlow AI** auf muttersprachlichem C2-Niveau zur Seite.\n\nVon rhetorischer Virtuosität, literarischen Registern und philosophischen Abhandlungen bis hin zu feinster stilistischer Präzision: Du führst den Diskurs ohne jegliche thematische oder stilistische Begrenzung.\n\nWelches Sujet explorieren wir heute?`;
      }
    } else {
      return `Ciao ${name}! 👋 Benvenuto a **LinguaFlow AI**, il tuo agente linguistico AI specializzato presso ${schName}.\n\nPossiedo tutte le facoltà pedagogiche attive: possiamo conversare liberamente, analizzare la grammatica, preparare una situazione reale o sviluppare il tuo vocabolario al livello ${lvl}.\n\nDi cosa vorresti parlare oggi?`;
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
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error || `Erreur serveur (${res.status})`;
        console.warn("[AIChatTutor] Server returned status", res.status, errMsg);
      }
    } catch (e: any) {
      console.warn("[AIChatTutor] Error calling /api/ai/chat:", e);
    }

    try {
      // If server response is not available, utilize direct robust Gemini client with retries
      if (!replyText) {
        console.info("[AIChatTutor] Invoking direct Gemini client with resilient retry engine...");
        try {
          const directRes = await sendGeminiChatMessage({
            message: textToSend,
            language,
            level: activeLevel,
            studentName: student.name,
            schoolName: school.name,
            practiceMode: "conversation",
            thinkingMode: useThinkingMode,
            maxRetries: 3,
          });
          if (directRes?.reply && directRes.reply.trim()) {
            replyText = directRes.reply.trim();
          }
        } catch (clientErr: any) {
          console.warn("[AIChatTutor] Direct Gemini call notice:", clientErr?.message);
        }
      }

      if (!replyText) {
        const cleanName = student.name.split(" ")[0] || "Romaric";
        replyText = language === "german"
          ? `Hallo ${cleanName}! 👋 Schön, dass wir heute Deutsch auf Niveau ${activeLevel} üben.\n\nIch bin bereit für deine nächste Übung oder Frage. Möchtest du eine Alltagssituation durchspielen (z.B. im Restaurant oder beim Einkaufen), oder hast du eine konkrete Grammatikfrage?\n\n[💡 Tipp: Versuche auf Deutsch zu antworten, um deine Sprachpraxis zu maximieren!]`
          : `Ciao ${cleanName}! 👋 Che bello continuare a praticare l'italiano insieme a livello ${activeLevel}.\n\nQuale argomento o situazione comunicativa vorresti affrontare oggi?\n\n[💡 Suggerimento: Rispondi in italiano per massimizzare la tua fluidità!]`;
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
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 text-white shadow-md shadow-indigo-500/20 shrink-0 ring-2 ring-white/10">
            <Sparkles size={22} className="text-amber-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400">
                  LinguaFlow AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {isGerman ? "Agent IA Spécialisé Allemand" : "Specialized Language AI"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                  {isGerman ? "DACH 🇩🇪 🇦🇹 🇨🇭" : "IT 🇮🇹"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                    aiStatus === null
                      ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                      : aiStatus.configured
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      aiStatus?.configured
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  <span>
                    {aiStatus === null
                      ? "Connexion..."
                      : aiStatus.configured
                      ? `En ligne • ${aiStatus.model || "Gemini"}`
                      : "Clé GEMINI_API_KEY requise"}
                  </span>
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
                ? "Deep pedagogical reasoning for German syntax, cases, and grammar breakdown"
                : "Raisonnement linguistique approfondi pour l'analyse des cas (Akk/Dat/Gen), de la syntaxe et de la grammaire"
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
                    : "bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 text-white shadow-sm"
                }`}
              >
                {isUser ? <User size={14} /> : <Sparkles size={14} className="text-amber-200" />}
              </div>

              <div
                className={`group relative max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-50 text-slate-900 dark:bg-slate-800/90 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/60 shadow-xs"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-200/50 dark:border-slate-700/50">
                    <span className="font-extrabold text-[11px] text-indigo-600 dark:text-indigo-400">
                      LinguaFlow AI
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20">
                      DACH 🇩🇪 🇦🇹 🇨🇭
                    </span>
                  </div>
                )}

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
                    ? `LinguaFlow AI: In-depth German grammatical analysis for CEFR ${activeLevel}...`
                    : `LinguaFlow AI : Analyse approfondie de la syntaxe et des déclinaisons (CECRL ${activeLevel})...`)
                : (locale === "en"
                    ? `LinguaFlow AI is formulating a specialized level-${activeLevel} German response...`
                    : `LinguaFlow AI rédige une réponse pédagogique adaptée au niveau ${activeLevel}...`)}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Spontaneous Impulse Suggestions (Purely open inspirations, never restricting) */}
      {messages.length <= 3 && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" />
            {isEn ? "Specialized Modes:" : "Entraînements DACH :"}
          </span>

          {openInspirations.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(s)}
              className="shrink-0 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] px-3 py-1 text-slate-700 dark:text-slate-300 transition border border-slate-200/60 dark:border-slate-700/60 cursor-pointer truncate max-w-[320px]"
            >
              🇩🇪 {s}
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
              ? `Pose une question à LinguaFlow AI (${activeLevel}) : déclinaisons, cas, grammaire, simulation DACH, examen...`
              : `Scrivi qualsiasi messaggio o domanda a LinguaFlow AI (${activeLevel})...`
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
