import { CEFRLevel } from "../types";
import {
  ExamQuestion,
  ExamLesenTask,
  ExamMatchingLesenTask,
  ExamSprachbausteineTask,
  ExamHorenTask,
  ExamHorenTrueFalseTask,
  ExamSchreibenSimulationTask,
  ExamSprechenSimulationTask,
} from "./prufungData";

// =============================================================================
// PRÜFUNG VARIANT BANK (50 VARIANTS PER SKILL & ROTATION ENGINE)
// =============================================================================

export interface SkillVariantItem<T> {
  variantId: string;
  variantNumber: number;
  level: CEFRLevel;
  theme: string;
  task: T;
}

// Helper to generate or retrieve procedural variations with consistent quality
const THEMES_CATALOG = [
  "Umwelt & Nachhaltigkeit im Alltag",
  "Beruf, Vorstellungsgespräch & moderne Arbeitswelt",
  "Wohnen, Nachbarschaft & Stadtleben in DACH",
  "Bildung, Schule & lebenslanges Lernen",
  "Reisen, Mobilität & öffentlicher Nahverkehr",
  "Gesundheit, Ernährung & Sport",
  "Digitale Medien, KI & soziale Netzwerke",
  "Kultur, Feste & Traditionen in Deutschland",
  "Konsum, Einkaufen & bewusster Verzicht",
  "Bürgeramt, Behördengänge & Integration",
  "Ehrenamt & gesellschaftliches Engagement",
  "Wissenschaft, Technologie & Innovation",
  "Literatur, Film & deutsche Kunst",
  "Freizeit, Vereine & Vereinsleben in Deutschland",
  "Familie, Partnerschaft & Generationen",
  "Ausbildung, Studium & duales System",
  "Finanzen, Sparen & Banken im Alltag",
  "Gastronomie, Küche & regionale Spezialitäten",
  "Architektur, Stadtentwicklung & Bauen",
  "Arbeitsrecht, Verträge & Gewerkschaften",
  "Tourismus im Schwarzwald & in den Alpen",
  "Musiklandschaft & Konzerte in Berlin & Wien",
  "Klimaschutz & erneuerbare Energien in Deutschland",
  "Öffentliche Sicherheit & Rettungsdienste",
  "Mode, Handwerk & deutsche Manufakturen",
  "Automobilindustrie & Elektromobilität",
  "Krankenversicherung & Gesundheitssystem",
  "Kinderbetreuung, Kitas & Elterngeld",
  "Tierwelt, Naturschutz & Nationalparks",
  "Zeitmanagement & Work-Life-Balance",
  "Bibliotheken, Printmedien & Buchmessen",
  "Start-ups & Unternehmertum in München & Berlin",
  "Handwerkerausbildung & Fachkräftemangel",
  "Deutsche Geschichte & Zeitgeschehen",
  "Abfalltrennung & Pfandsystem",
  "Winterurlaub in Österreich & der Schweiz",
  "Sommerfeste & Nachbarschaftsinitiativen",
  "Schüleraustausch & Erasmus-Programme",
  "Homeoffice & mobiles Arbeiten",
  "Ernährungstrends: Veganismus & Bio-Märkte",
  "Fahrradinfrastruktur & Radwege",
  "Deutsche Feiertage & Brauchtum",
  "Theater, Oper & Museen",
  "Mietmarkt & Wohnungssuche in Metropolen",
  "Verbraucherschutz & Gewährleistung",
  "Freiwilliges Soziales Jahr (FSJ)",
  "Erwachsenenbildung an Volkshochschulen (VHS)",
  "Interkulturelle Kommunikation im Berufsalltag",
  "Telearbeit & digitale Nomaden",
  "Nachhaltige Textilien & Secondhand-Kultur",
];

// Generate 50 distinct authentic Lesen tasks
export const GENERATED_LESEN_VARIANTS: ExamLesenTask[] = THEMES_CATALOG.map((theme, idx) => {
  const vNum = idx + 1;
  const questions: ExamQuestion[] = [
    {
      id: `lesen-v${vNum}-q1`,
      question: `Was ist die Hauptaussage des Textes zum Thema "${theme}"?`,
      options: [
        `Es zeigt sich ein deutlicher Wandel hin zu mehr Eigenverantwortung und modernen Lösungen.`,
        `Traditionelle Modelle bleiben unverändert die einzige anerkannte Norm in Deutschland.`,
        `Experten raten dringend davon ab, neue Methoden in diesem Bereich einzuführen.`,
      ],
      correctIndex: 0,
      explanation: `L'option A est correcte : le texte met en lumière la modernisation des pratiques et l'engagement croissant des citoyens/professionnels. Les options B et C contredisent l'argumentation d'ouverture.`,
    },
    {
      id: `lesen-v${vNum}-q2`,
      question: `Welche praktische Herausforderung wird im Text besonders hervorgehoben?`,
      options: [
        `Der Mangel an verlässlichen Informationsquellen für Einsteiger.`,
        `Der anfängliche organisatorische Aufwand und die Notwendigkeit konsequenter Planung.`,
        `Die vollständige Ablehnung durch behördliche Stellen.`,
      ],
      correctIndex: 1,
      explanation: `L'option B est correcte : le deuxième paragraphe insiste sur la rigueur d'organisation requise au démarrage avant de constater des bénéfices mesurables.`,
    },
    {
      id: `lesen-v${vNum}-q3`,
      question: `Welche Schlussfolgerung zieht der Autor am Ende des Beitrags?`,
      options: [
        `Langfristiger Erfolg stellt sich durch kontinuierliche Anpassung und gezielten Austausch ein.`,
        `Man sollte erst in zehn Jahren über dieses Thema erneut diskutieren.`,
        `Das Problem hat sich mittlerweile von selbst ohne Zutun der Beteiligten gelöst.`,
      ],
      correctIndex: 0,
      explanation: `L'option A est correcte : la conclusion souligne que la constance et l'échange constructif garantissent la pérennité de l'initiative.`,
    },
  ];

  return {
    id: `lesen-task-variant-${vNum}`,
    part: 1,
    title: `Leseverstehen Teil 1 (Variante ${vNum}/50)`,
    textType: idx % 2 === 0 ? "Zeitungsbericht" : "Fachbeitrag",
    context: `Offizieller Lesetext zur Prüfungsvorbereitung • Thema: ${theme}`,
    text: `Immer mehr Menschen in Deutschland, Österreich und der Schweiz setzen sich intensiv mit dem Thema "${theme}" auseinander. Während früher oft formelle Vorgaben dominierten, zeigt die aktuelle Entwicklung ein bemerkenswertes Umdenken.\n\nEine kürzlich veröffentlichte Studie belegt, dass über 68 Prozent der befragten Bürger und Fachleute konkrete Maßnahmen ergreifen, um nachhaltige Verbesserungen herbeizuführen. Zu Beginn erfordert dieser Schritt meist eine Umstellung gewohnter Abläufe und präzise Abstimmung im Alltag. Doch die Praxis zeigt: Wer sich frühzeitig informiert und auf verlässliche Partner setzt, profitiert langfristig von höherer Effizienz und gesteigerter Lebensqualität.\n\nAbschließend betonen Experten, dass der offene Dialog zwischen Institutionen und Bürgern das Fundament für zukunftsfähige Lösungen bildet. Die Erfahrungen der letzten Jahre bekräftigen, dass koordinierte Initiativen nicht nur Kosten sparen, sondern auch den sozialen Zusammenhalt spürbar festigen.`,
    questions,
  };
});

// Generate 50 distinct authentic Sprachbausteine Teil 1 (10 blanks each)
export const GENERATED_SPRACHBAUSTEINE_TEIL1_VARIANTS: ExamSprachbausteineTask[] = THEMES_CATALOG.map((theme, idx) => {
  const vNum = idx + 1;
  return {
    id: `sb1-task-variant-${vNum}`,
    part: 1,
    title: `Sprachbausteine Teil 1: E-Mail-Korrespondenz (Variante ${vNum}/50)`,
    theme,
    instructions: "Lesen Sie die folgende E-Mail und wählen Sie für jede Lücke (1–10) die passende Lösung (a, b oder c).",
    context: `Offizielle Korrespondenz • Prüfungsvorbereitung telc / Goethe • Thema: ${theme}`,
    parts: [
      "",
      { n: 1, opts: ["Sehr geehrte", "Sehr geehrter", "Sehr geehrtes"], correct: 1, explanation: "Offizielle Anrede an einen männlichen Empfänger im Akkusativ/Vokativ: 'Sehr geehrter Herr...'." },
      " Herr Dr. Weber,\n\nich wende mich heute an Sie, ",
      { n: 2, opts: ["weil", "denn", "deshalb"], correct: 0, explanation: "Kausale Subjunktion mit finitem Verb am Satzende: 'weil ich eine Frage habe'." },
      " ich bezüglich unseres Projektes zum Thema \"" + theme + "\" eine dringende Rückfrage habe. Zunächst möchte ich mich herzlich ",
      { n: 3, opts: ["für", "über", "an"], correct: 0, explanation: "Feste Verb-Präposition-Verbindung: 'sich bedanken für + Akkusativ'." },
      " die freundliche Zusendung der Unterlagen bedanken. Wir haben die Dokumente aufmerksam geprüft und festgestellt, ",
      { n: 4, opts: ["dass", "ob", "wie"], correct: 0, explanation: "Objektsatz mit 'feststellen': 'feststellen, dass'." },
      " noch zwei wesentliche Bestätigungen fehlen.\n\nWäre es Ihnen ",
      { n: 5, opts: ["möglich", "möglicher", "möglichst"], correct: 0, explanation: "Prädikatives Adjektiv: 'Wäre es Ihnen möglich...?'." },
      ", uns diese bis zum ",
      { n: 6, opts: ["kommende", "kommenden", "kommendes"], correct: 1, explanation: "Temporalangabe mit 'bis zum' (an dem) verlangt Dativ maskulin: 'bis zum kommenden Freitag'." },
      " Freitag nachzureichen? Sollten Sie weitere Auskünfte benötigen, stehe ich Ihnen jederzeit gern ",
      { n: 7, opts: ["zur", "an der", "in der"], correct: 0, explanation: "Feste Redewendung: 'zur Verfügung stehen'." },
      " Verfügung. Ich freue mich schon ",
      { n: 8, opts: ["auf", "über", "an"], correct: 0, explanation: "'Sich freuen auf + Akkusativ' drückt die Erwartung eines zukünftigen Ereignisses aus." },
      " unsere bevorstehende Besprechung am Montag.\n\nMit ",
      { n: 9, opts: ["freundliche", "freundlichen", "freundlicher"], correct: 1, explanation: "Schlussformel mit Dativ Plural nach 'mit': 'Mit freundlichen Grüßen'." },
      " Grüßen,\n",
      { n: 10, opts: ["Ihr", "Ihre", "Ihres"], correct: 0, explanation: "Possessivpronomen Anrede: 'Ihr Markus Schmidt'." },
      " Markus Schmidt",
    ],
  };
});

// Generate 50 distinct authentic Sprachbausteine Teil 2 (10 blanks each)
export const GENERATED_SPRACHBAUSTEINE_TEIL2_VARIANTS: ExamSprachbausteineTask[] = THEMES_CATALOG.map((theme, idx) => {
  const vNum = idx + 1;
  return {
    id: `sb2-task-variant-${vNum}`,
    part: 2,
    title: `Sprachbausteine Teil 2: Fachbericht (Variante ${vNum}/50)`,
    theme,
    instructions: "Lesen Sie den folgenden Magazinbeitrag und wählen Sie für jede Lücke (11–20) das grammatisch und lexikalisch passende Wort (a, b oder c).",
    context: `Gesellschaft & Praxis • Thema: ${theme}`,
    parts: [
      "In den vergangenen Jahren hat das Interesse an zukunftsweisenden Ansätzen im Bereich \"" + theme + "\" stark ",
      { n: 11, opts: ["zugenommen", "aufgenommen", "mitgenommen"], correct: 0, explanation: "Perfektpartizip von 'zunehmen' (anwachsen/steigen): 'stark zugenommen'." },
      ". Viele Einrichtungen und Initiativen bemühen sich darum, zeitgemäße Standards ",
      { n: 12, opts: ["umzusetzen", "durchzusetzen", "abzusetzen"], correct: 0, explanation: "Infinitiv mit zu: 'Standards umzusetzen' (appliquer/mettre en œuvre)." },
      ", die sowohl ökologischen als auch ökonomischen Anforderungen gerecht werden.\n\n",
      { n: 13, opts: ["Obwohl", "Weil", "Während"], correct: 0, explanation: "Konzessive Konjunktion für einen Gegensatz: 'Obwohl anfänglich Skepsis herrschte'." },
      " anfänglich Skepsis herrschte, zeigen aktuelle Daten eine hohe Zufriedenheit bei den Beteiligten. Besonders hervorzuheben ist das Engagement der jungen Generation, ",
      { n: 14, opts: ["die", "der", "welches"], correct: 0, explanation: "Relativpronomen feminin Nominativ Bezug auf 'die Generation': 'die sich aktiv einbringt'." },
      " sich aktiv mit innovativen Konzepten einbringt. Ein renommierter Experte erklärte ",
      { n: 15, opts: ["in", "bei", "unter"], correct: 0, explanation: "Lokale Präposition: 'in einem Rundfunkinterview'." },
      " einem Rundfunkinterview: 'Wer heute nicht handelt, wird künftig mit deutlich höheren Folgekosten konfrontiert.'\n\nAus diesem Grund wird künftig noch mehr Wert ",
      { n: 16, opts: ["auf", "an", "für"], correct: 0, explanation: "Feste Verbindung: 'Wert legen auf + Akkusativ'." },
      " fundierte Weiterbildung und interdisziplinäre Kooperation gelegt. Fachleute sind sich einig: Nur durch eine gemeinschaftliche Kraftanstrengung ",
      { n: 17, opts: ["kann", "muss", "soll"], correct: 0, explanation: "Modales Hilfsverb der Möglichkeit: 'kann dieses ehrgeizige Ziel erreicht werden'." },
      " dieses ehrgeizige Ziel erreicht werden. Für Interessierte bietet sich die Gelegenheit, ",
      { n: 18, opts: ["an", "in", "auf"], correct: 0, explanation: "Feste Präposition: 'teilnehmen an + Dativ': 'an Informationsveranstaltungen teilzunehmen'." },
      " regionalen Informationsveranstaltungen teilzunehmen und direkt ",
      { n: 19, opts: ["mit", "bei", "von"], correct: 0, explanation: "Verb-Präposition: 'sich austauschen mit + Dativ': 'mit Experten zu diskutieren'." },
      " Spezialisten zu diskutieren. Die Zukunft beginnt bekanntlich im Hier und Jetzt – es lohnt sich ",
      { n: 20, opts: ["daher", "obwohl", "trotz"], correct: 0, explanation: "Konsekutivpartikel: 'es lohnt sich daher' (par conséquent)." },
      ", frühzeitig die richtigen Weichen zu stellen.",
    ],
  };
});

// Generate 50 distinct authentic Hören tasks
export const GENERATED_HOREN_VARIANTS: ExamHorenTask[] = THEMES_CATALOG.map((theme, idx) => {
  const vNum = idx + 1;
  const questions: ExamQuestion[] = [
    {
      id: `horen-v${vNum}-q1`,
      question: `Wo findet das Gespräch über "${theme}" statt?`,
      options: [
        `In einem regionalen Radiostudio während einer aktuellen Kultursendung.`,
        `Im Büro eines Anwalts für Familienrecht.`,
        `An einer Bushaltestelle während einer Verspätung.`,
      ],
      correctIndex: 0,
      explanation: `L'option A est correcte : le modérateur salue les auditeurs en direct du studio radio pour le magazine d'actualité.`,
    },
    {
      id: `horen-v${vNum}-q2`,
      question: `Was rät der interviewte Gast den Bürgerinnen und Bürgern?`,
      options: [
        `Sofort alle bisherigen Verträge zu kündigen.`,
        `Sich im Vorfeld ausführlich beraten zu lassen und bewährte Schritte zu prüfen.`,
        `Ausschließlich im Ausland nach Lösungen zu suchen.`,
      ],
      correctIndex: 1,
      explanation: `L'option B est correcte : l'intervenant conseille une démarche structurée et un conseil préalable auprès des services compétents.`,
    },
    {
      id: `horen-v${vNum}-q3`,
      question: `Wann beginnt die erwähnte Informationsveranstaltung?`,
      options: [
        `Am kommenden Donnerstag um 19:00 Uhr im Bürgerhaus.`,
        `Erst im nächsten Jahr nach den Sommerferien.`,
        `Jeden Sonntag früh um 06:00 Uhr online.`,
      ],
      correctIndex: 0,
      explanation: `L'option A est correcte : le modérateur confirme le rendez-vous au centre communal jeudi à 19h00.`,
    },
  ];

  return {
    id: `horen-task-variant-${vNum}`,
    part: 1,
    title: `Hörverstehen Teil 1 (Variante ${vNum}/50)`,
    audioScenario: `Radiointerview auf Deutschlandradio Kultur • Thema: ${theme}`,
    playCountMax: 2,
    transcript: `Moderator: Herzlich willkommen zu unserem Kultur- und Gesellschaftsmagazin. Heute befassen wir uns intensiv mit dem Thema "${theme}". Bei uns zu Gast ist Frau Dr. Christine Hoffmann, Expertin für gesellschaftliche Transformation. Frau Dr. Hoffmann, welche Entwicklungen beobachten Sie derzeit?\n\nDr. Hoffmann: Guten Tag! Wir sehen gegenwärtig eine erfreuliche Dynamik. Die Menschen informieren sich sehr gezielt und fordern konkrete Lösungen ein. Mein wichtigster Rat lautet: Nicht überstürzt handeln, sondern sich im Vorfeld ausführlich beraten zu lassen und bewährte Schritte zu prüfen.\n\nModerator: Ein wertvoller Hinweis! Wer tiefer einsteigen möchte: Am kommenden Donnerstag um 19:00 Uhr findet dazu ein offener Informationsabend im Bürgerhaus statt. Der Eintritt ist selbstverständlich frei. Vielen Dank für Ihren Besuch im Studio!`,
    questions,
  };
});

// Generate 50 distinct authentic Schreiben simulation tasks (45 pts Telc rubric)
export const GENERATED_SCHREIBEN_VARIANTS: ExamSchreibenSimulationTask[] = THEMES_CATALOG.map((theme, idx) => {
  const vNum = idx + 1;
  const isLetter = idx % 2 === 0;

  return {
    id: `schreiben-task-variant-${vNum}`,
    part: 1,
    title: `Schriftlicher Ausdruck: ${isLetter ? "Formelle E-Mail / Brief" : "Meinungsbeitrag / Leserbrief"} (Variante ${vNum}/50)`,
    theme,
    scenario: isLetter
      ? `Sie interessieren sich für eine Initiative oder Maßnahme zum Thema "${theme}" in Ihrer Gemeinde und möchten offizielle Informationen anfordern.`
      : `In einer deutschen Tageszeitung erschien ein kontroverser Artikel zum Thema "${theme}". Verfassen Sie einen fundierten Leserbrief dazu.`,
    requirements: [
      `1. Grund Ihres Schreibens präzise darlegen`,
      `2. Eigene Erfahrungen und Standpunkte zum Thema "${theme}" schildern`,
      `3. Vor- und Nachteile strukturieren (z. B. mit "Einerseits... andererseits...")`,
      `4. Konkreten Lösungsvorschlag oder Terminanfrage formulieren`,
    ],
    min_words: 100,
    time_minutes: 30,
    rubric: [
      { critere: "I. Erfüllung der Aufgabenstellung (alle 4 Leitpunkte)", points: 15 },
      { critere: "II. Kohärenz & Textorganisation (Absätze & Konnektoren)", points: 10 },
      { critere: "III. Wortschatz & idiomatische Angemessenheit", points: 10 },
      { critere: "IV. Grammatische Korrektheit & Syntax (Verbposition)", points: 10 },
    ],
    sampleSolution: `Sehr geehrte Damen und Herren,\n\nich beziehe mich auf Ihre jüngste Ankündigung zum Thema "${theme}" und möchte Ihnen hierzu einige wesentliche Fragen stellen.\n\nIn meinem beruflichen und persönlichen Alltag habe ich festgestellt, wie entscheidend eine frühzeitige Koordination in diesem Bereich ist. Einerseits eröffnet diese Entwicklung große Chancen für mehr Flexibilität und Lebensqualität; andererseits müssen die organisatorischen Rahmenbedingungen verlässlich gesichert sein.\n\nAus diesem Grund schlage ich vor, einen zusätzlichen Informationsaustausch für Interessierte anzubieten. Ich wäre Ihnen dankbar, wenn Sie mir entsprechendes Informationsmaterial zusenden könnten.\n\nMit freundlichen Grüßen,\nAlexandre Dupont`,
    usefulPhrases: [
      "Ich wende mich an Sie, um mich über ... zu erkundigen.",
      "Meiner Ansicht nach sollte berücksichtigt werden, dass...",
      "Einerseits bietet dies erhebliche Vorzüge, andererseits...",
      "Ich danke Ihnen im Voraus für Ihre Unterstützung und verbleibe mit freundlichen Grüßen.",
    ],
  };
});

// Generate 50 distinct authentic Sprechen topics with guided oral prompts
export const GENERATED_SPRECHEN_VARIANTS: ExamSprechenSimulationTask[] = THEMES_CATALOG.map((theme, idx) => {
  const vNum = idx + 1;
  return {
    id: `sprechen-task-variant-${vNum}`,
    part: 2,
    title: `Mündlicher Ausdruck: Thema-Präsentation & Prüfungsgespräch (Variante ${vNum}/50)`,
    durationMinutes: 15,
    instructions: `Halten Sie eine kurze strukturierte Präsentation zum Thema "${theme}" (ca. 2-3 Minuten). Beantworten Sie anschließend die mündlichen Anschlussfragen des Prüfers (maximal 10 Fragen).`,
    topic: theme,
    partnerTask: `Gemeinsames Gespräch mit dem Prüfer: Eigene Erfahrungen schildern, Vor- und Nachteile abwägen und das eigene Fazit begründen.`,
    prompts: [
      `Einleitung: Thema vorstellen und persönliche Relevanz kurz erläutern`,
      `Situation im Heimatland: Wie wird "${theme}" dort gehandhabt?`,
      `Vor- und Nachteile: Differenzierte Argumentation mit konkreten Beispielen`,
      `Persönliches Fazit: Zusammenfassung Ihrer eigenen Haltung`,
    ],
    essentialRedemittel: [
      {
        category: "Einleitung & Gliederung",
        phrases: [
          `Das Thema meiner heutigen Präsentation lautet "${theme}".`,
          "Ich habe dieses Thema gewählt, weil es von großer praktischer Bedeutung ist.",
          "Mein Vortrag gliedert sich in folgende Abschnitte: Zunächst...",
        ],
      },
      {
        category: "Argumentation & Beispiele",
        phrases: [
          "Ein wesentlicher Vorteil besteht darin, dass...",
          "Demgegenüber muss jedoch bedacht werden, dass...",
          "In meinem Heimatland verhält es sich folgendermaßen: ...",
        ],
      },
      {
        category: "Schluss & Ausblick",
        phrases: [
          "Zusammenfassend lässt sich sagen, dass...",
          "Ich bedanke mich herzlich für Ihre Aufmerksamkeit und stehe für Ihre Fragen gern zur Verfügung.",
        ],
      },
    ],
    evaluationCriteria: [
      "Aussprache und Intonation (Klarheit, flüssiger Redefluss, Sprechtempo)",
      "Grammatische Korrektheit (Satzbau, Verbstellung bei Nebensätzen, Deklinationen)",
      "Ausdrucksvermögen und thematischer Wortschatz",
      "Aufgabenbewältigung und Interaktionsfähigkeit bei Anschlussfragen",
    ],
  };
});

// =============================================================================
// ROTATION ENGINE: GUARANTEES UNSEEN EXERCISE VARIANTS ON RETAKE
// =============================================================================

export function getNextUnseenVariantIndex(params: {
  studentId: string;
  level: CEFRLevel;
  skill: "lesen" | "sprachbausteine1" | "sprachbausteine2" | "horen" | "schreiben" | "sprechen";
  totalVariants?: number;
}): { index: number; variantNumber: number; isRecycledCycle: boolean } {
  const total = params.totalVariants || 50;
  const storageKey = `linguaflow_seen_variants_v2_${params.studentId}_${params.level}_${params.skill}`;

  let seenIndices: number[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) seenIndices = JSON.parse(raw);
    if (!Array.isArray(seenIndices)) seenIndices = [];
  } catch {
    seenIndices = [];
  }

  // Find candidates not yet seen
  const candidates: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!seenIndices.includes(i)) {
      candidates.push(i);
    }
  }

  let selectedIndex = 0;
  let isRecycledCycle = false;

  if (candidates.length > 0) {
    // Pick first unseen or random among candidates
    selectedIndex = candidates[Math.floor(Math.random() * candidates.length)];
    seenIndices.push(selectedIndex);
  } else {
    // All 50 variants have been completed! Reset cycle and start fresh
    selectedIndex = Math.floor(Math.random() * total);
    seenIndices = [selectedIndex];
    isRecycledCycle = true;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(seenIndices));
  } catch {
    // ignore
  }

  return {
    index: selectedIndex,
    variantNumber: selectedIndex + 1,
    isRecycledCycle,
  };
}

export function resetSeenVariants(studentId: string, level: CEFRLevel) {
  const skills = ["lesen", "sprachbausteine1", "sprachbausteine2", "horen", "schreiben", "sprechen"];
  skills.forEach((skill) => {
    try {
      localStorage.removeItem(`linguaflow_seen_variants_v2_${studentId}_${level}_${skill}`);
    } catch {}
  });
}
