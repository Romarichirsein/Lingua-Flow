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
  const isEn = locale === "en";

  // CEFR Level state synced with student.level
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>(student.level || "A1");

  // Keep synced if student.level updates from admin
  useEffect(() => {
    if (student.level) {
      setActiveLevel(student.level);
    }
  }, [student.level, student.id]);

  const getInitialWelcome = (lvl: CEFRLevel, lang: SupportedLanguage, name: string, schName: string) => {
    if (lang === "german") {
      switch (lvl) {
        case "A1":
          return `Hallo ${name}! 👋 Ich bin dein KI-Sprachtutor an der ${schName}.\n\nDein registriertes Niveau ist A1 (Anfänger). Ich passe meine Sätze an: kurze Wörter, einfaches Präsens und langsamere Aussprache.\n\nWie heißt du und woher kommst du?`;
        case "A2":
          return `Hallo ${name}! 🌟 Schön dich zu sehen an der ${schName}.\n\nWir trainieren Deutsch auf Niveau A2 (Alltag, Familie, Hobbys und Perfekt). Wie geht es dir heute und was hast du Schönes gemacht?`;
        case "B1":
          return `Guten Tag ${name}! 🚀 Willkommen bei deinem KI-Tutor an der ${schName}.\n\nAuf Niveau B1 führen wir flüssige Gespräche über deine persönliche Meinung, Reiseerlebnisse und Pläne. Worüber möchtest du heute sprechen?`;
        case "B2":
          return `Herzlich willkommen ${name}! 💼 Als dein KI-Sprachtutor an der ${schName} trainieren wir Niveau B2.\n\nWir feilen an differenzierten Argumentationen, beruflicher Kommunikation, Konjunktiv II und idiomatischer Präzision. Welches Thema interessiert dich heute?`;
        case "C1":
        default:
          return `Guten Tag ${name}. 🎓 Willkommen im C1-Exzellenztraining an der ${schName}.\n\nAuf diesem Niveau vertiefen wir anspruchsvolle rhetorische Strukturen, akademischen Diskurs und stilistische Nuancen. Zu welchem gesellschaftlichen oder fachlichen Thema möchtest du dich austauschen?`;
      }
    } else {
      switch (lvl) {
        case "A1":
          return `Ciao ${name}! 👋 Sono il tuo tutor virtuale di lingua italiana presso ${schName}.\n\nIl tuo livello registrato è A1 (Principiante). Parleremo con parole semplici, frasi brevi e pronuncia scandita.\n\nCome ti chiami e di dove sei?`;
        case "A2":
          return `Ciao ${name}! 🌟 Che piacere ritrovarti a ${schName}.\n\nAl livello A2 parliamo della tua vita quotidiana, dei tuoi passatempi e delle tue esperienze al passato prossimo. Come stai oggi?`;
        case "B1":
          return `Ciao ${name}! 🚀 Benvenuto al livello B1.\n\nInsieme praticheremo conversazioni più ricche, le tue opinioni personali, sogni e progetti futuri. Di cosa vorresti parlare oggi?`;
        case "B2":
          return `Benvenuto ${name}! 💼 Al livello B2 lavoriamo sulla fluidità, l'argomentazione approfondita, il congiuntivo e le sfumature della lingua italiana formale e professionale. Quale tema desideri affrontare?`;
        case "C1":
        default:
          return `Benvenuto ${name}. 🎓 Al livello C1 perfezioniamo la precisione lessicale, l'eleganza retorica e il pensiero critico accademico. Quale argomento complesso vorresti esaminare oggi?`;
      }
    }
  };

  // Multi-turn messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "model",
      content: getInitialWelcome(activeLevel, language, student.name, school.name),
      timestamp: new Date().toISOString(),
    },
  ]);

  // Reset chat welcome when active level or student changes
  useEffect(() => {
    setMessages([
      {
        id: `msg-welcome-${activeLevel}-${student.id}`,
        role: "model",
        content: getInitialWelcome(activeLevel, language, student.name, school.name),
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [activeLevel, student.id, student.name, language, school.name]);

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

  // Speech Audio Output adapted to level
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "german" ? "de-DE" : "it-IT";
      // Slower for beginner levels (A1, A2), natural for higher levels (B1, B2, C1)
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

  // Quick conversation suggestions strictly adapted by level
  const getSuggestions = (lvl: CEFRLevel, lang: SupportedLanguage): string[] => {
    if (lang === "german") {
      switch (lvl) {
        case "A1":
          return [
            "Ich heiße Alex und komme aus Frankreich. Und du?",
            "Wie viel kostet ein Kaffee und ein Brötchen bitte?",
            "Wo ist der Hauptbahnhof in Berlin?",
            "Ich lerne Deutsch für meine Arbeit.",
          ];
        case "A2":
          return [
            "Was hast du am Wochenende Schönes gemacht?",
            "Erzähle mir von deiner Lieblingsstadt in Deutschland.",
            "Wie bestelle ich höflich im Restaurant auf Deutsch?",
            "Erkläre mir den Akkusativ mit zwei Beispielen.",
          ];
        case "B1":
          return [
            "Lass uns ein Vorstellungsgespräch auf Deutsch simulieren!",
            "Was sind die Vor- und Nachteile von Homeoffice?",
            "Welche Bräuche gibt es in Deutschland und Österreich?",
            "Erkläre mir Nebensätze mit 'obwohl' und 'trotzdem'.",
          ];
        case "B2":
          return [
            "Debattieren wir über den Einfluss von KI auf die Arbeitswelt.",
            "Welche sprachlichen Nuancen unterscheiden Konjunktiv I und II?",
            "Simulieren wir eine geschäftliche Verhandlung über Projektfristen.",
            "Erkläre mir gebräuchliche deutsche Redewendungen im Berufsalltag.",
          ];
        case "C1":
        default:
          return [
            "Analysieren wir die gesellschaftlichen Herausforderungen der Energiewende.",
            "Welche rhetorischen Stilmittel eignen sich für eine Festrede?",
            "Diskutiere über sprachphilosophische Aspekte der Mehrsprachigkeit.",
            "Erläutere subtile Bedeutungsunterschiede zwischen gehobenen Synonymen.",
          ];
      }
    } else {
      switch (lvl) {
        case "A1":
          return [
            "Mi chiamo Luca e vengo dalla Francia. E tu?",
            "Quanto costa un caffè e un cornetto per favore?",
            "Dov'è la stazione centrale di Roma?",
            "Studio l'italiano per piacere.",
          ];
        case "A2":
          return [
            "Cosa hai fatto di bello questo fine settimana?",
            "Raccontami della tua città preferita in Italia.",
            "Come ordino con cortesia al ristorante in italiano?",
            "Spiegami la differenza tra Passato Prossimo e Imperfetto.",
          ];
        case "B1":
          return [
            "Simuliamo un colloquio di lavoro in italiano!",
            "Quali sono i pro e i contro dello smart working?",
            "Quali sono le tradizioni culinarie più famose delle regioni italiane?",
            "Spiegami l'uso del congiuntivo presente con esempi pratici.",
          ];
        case "B2":
          return [
            "Dibattiamo sull'impatto dell'intelligenza artificiale sul lavoro.",
            "Come si usa il congiuntivo passato nei periodi ipotetici?",
            "Simuliamo una trattativa commerciale tra partner europei.",
            "Spiegami modi di dire italiani tipici del mondo professionale.",
          ];
        case "C1":
        default:
          return [
            "Analizziamo le trasformazioni sociologiche della società moderna.",
            "Quali strategie retoriche rendono persuasivo un discorso pubblico?",
            "Discutiamo dell'evoluzione del linguaggio letterario contemporaneo.",
            "Illustrami le sfumature di registro tra termini sinonimi di livello colto.",
          ];
      }
    }
  };

  const suggestions = getSuggestions(activeLevel, language);

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
          level: activeLevel,
          studentName: student.name,
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
      console.warn("Chat notice, activating level-calibrated fallback:", err);
      const isGerman = language === "german";
      let fallbackReply = "";

      if (isGerman) {
        if (activeLevel === "A1") {
          fallbackReply = `Hallo ${student.name.split(" ")[0]}! Das ist ein guter Anfang. [💡 Conseil A1: En allemand, le verbe est toujours à la 2e place dans la phrase simple]. Wie heißt du?`;
        } else if (activeLevel === "A2") {
          fallbackReply = `Sehr schön formuliert! [💡 Conseil A2: Avec 'weil', le verbe se met tout à la fin: '... weil ich Deutsch lerne.']. Erzähle mir mehr darüber!`;
        } else if (activeLevel === "B1") {
          fallbackReply = `Interessanter Gedanke, ${student.name.split(" ")[0]}! Was denkst du persönlich darüber und welche Erfahrungen hast du in diesem Bereich gemacht?`;
        } else if (activeLevel === "B2") {
          fallbackReply = `Sehr differenzierter Beitrag! [💡 Tipp B2: Achte auf die Rektion der Verben mit festen Präpositionen]. Welche Gegenargumente könnte man hier anführen?`;
        } else {
          fallbackReply = `Ein beachtlich hohes sprachliches Register, ${student.name.split(" ")[0]}. Welche stilistischen Feinheiten würdest du im akademischen Kontext noch ergänzen?`;
        }
      } else {
        if (activeLevel === "A1") {
          fallbackReply = `Ciao ${student.name.split(" ")[0]}! Molto bene. [💡 Consiglio A1: Ricorda sempre l'articolo corretto: 'il ragazzo', 'la pizza']. Come ti chiami?`;
        } else if (activeLevel === "A2") {
          fallbackReply = `Ottima frase! [💡 Consiglio A2: Con il passato prossimo fai attenzione all'accordo del participio passato con l'ausiliare essere]. Raccontami ancora!`;
        } else if (activeLevel === "B1") {
          fallbackReply = `Ottimo spunto di conversazione, ${student.name.split(" ")[0]}! Qual è la tua opinione personale su questo argomento?`;
        } else if (activeLevel === "B2") {
          fallbackReply = `Un'argomentazione molto articolata! [💡 Consiglio B2: Puoi arricchire il discorso con il congiuntivo passato o con formule ipotetiche]. Quali soluzioni proponi?`;
        } else {
          fallbackReply = `Espressione impeccabile ed elegante, ${student.name.split(" ")[0]}. Quali sfumature retoriche o contestuali ritieni opportune per perfezionare ulteriormente l'analisi?`;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: "model",
        content: fallbackReply,
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
        content: getInitialWelcome(activeLevel, language, student.name, school.name),
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const levelDescriptions: Record<CEFRLevel, { fr: string; en: string }> = {
    A1: {
      fr: "Débutant : vocabulaire essentiel, phrases courtes (5-8 mots), débit audio lent (0.8x)",
      en: "Beginner: essential words, short sentences (5-8 words), slow audio pace (0.8x)",
    },
    A2: {
      fr: "Élémentaire : vie quotidienne, passé composé, connecteurs simples, débit audio 0.88x",
      en: "Elementary: daily life, past tense, simple connectors, audio pace 0.88x",
    },
    B1: {
      fr: "Intermédiaire : autonomie, expression d'opinions, subordonnées, débit audio 0.95x",
      en: "Intermediate: independence, opinions, subordinate clauses, audio pace 0.95x",
    },
    B2: {
      fr: "Avancé : communication professionnelle, nuances, passif et subjonctif, débit audio 1.0x",
      en: "Upper Intermediate: professional discourse, nuances, subjunctive, audio pace 1.0x",
    },
    C1: {
      fr: "Expert : style académique, idiomes subtils, registre soutenu, débit naturel 1.05x",
      en: "Mastery: academic register, subtle idioms, sophisticated syntax, native pace 1.05x",
    },
    C2: {
      fr: "Maîtrise bilingue : aisance absolue, subtilités littéraires, tournures rhétoriques fines",
      en: "Bilingual mastery: absolute fluency, literary subtleties, and advanced rhetorical forms",
    },
  };

  return (
    <div className="neon-card rounded-3xl p-4 sm:p-6 flex flex-col h-[600px] sm:h-[680px] max-h-[88vh]">
      {/* Chat Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {locale === "en" ? "Adaptive AI Tutor" : "Tuteur IA Adaptatif"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles size={10} />
                {language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")}
              </span>

              {/* CEFR Level Selector Pill */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {isEn ? "Level:" : "Niveau:"}
                </span>
                <select
                  value={activeLevel}
                  onChange={(e) => setActiveLevel(e.target.value as CEFRLevel)}
                  className="bg-transparent text-xs font-bold text-indigo-600 dark:text-indigo-400 outline-none cursor-pointer"
                  title={levelDescriptions[activeLevel][isEn ? "en" : "fr"]}
                >
                  <option value="A1">A1 (Débutant)</option>
                  <option value="A2">A2 (Élémentaire)</option>
                  <option value="B1">B1 (Intermédiaire)</option>
                  <option value="B2">B2 (Avancé)</option>
                  <option value="C1">C1 (Expert)</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Zap size={11} className="text-amber-500" />
              <span>{levelDescriptions[activeLevel][isEn ? "en" : "fr"]}</span>
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
                className={`group relative max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/50 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>

                {/* Voice Speak button for Bot with level-adapted speech rate */}
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(m.content)}
                    className="absolute -right-7 top-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition p-1"
                    title={locale === "en" ? `Listen (Rate ${activeLevel})` : `Écouter la prononciation (${activeLevel})`}
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
                ? (locale === "en" ? `In-depth pedagogical reasoning for CEFR ${activeLevel}...` : `Raisonnement pédagogique approfondi pour CECRL ${activeLevel}...`)
                : (locale === "en" ? `LinguaBot is formulating response (CEFR ${activeLevel})...` : `LinguaBot formule sa réponse adaptée au niveau ${activeLevel}...`)}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts tailored specifically to this level */}
      {messages.length <= 3 && (
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">
            {isEn ? `Suggestions ${activeLevel}:` : `Suggestions ${activeLevel} :`}
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(s)}
              className="shrink-0 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] px-3 py-1.5 text-slate-600 dark:text-slate-300 transition border border-slate-200/50 dark:border-slate-700/50 cursor-pointer"
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
              ? `Schreibe eine Nachricht auf Deutsch (Niveau ${activeLevel})...`
              : `Scrivi un messaggio in italiano (Livello ${activeLevel})...`
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
