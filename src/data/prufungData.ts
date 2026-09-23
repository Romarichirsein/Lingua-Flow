import { CEFRLevel, SupportedLanguage } from "../types";
import {
  A1_MATCHING_LESEN,
  A1_SPRACHBAUSTEINE,
  A1_TRUE_FALSE_HOREN,
  A1_SCHREIBEN_SIMULATION,
  A1_SPRECHEN_SIMULATION,
  A2_MATCHING_LESEN,
  A2_SPRACHBAUSTEINE,
  A2_TRUE_FALSE_HOREN,
  A2_SCHREIBEN_SIMULATION,
  A2_SPRECHEN_SIMULATION,
  B1_MATCHING_LESEN,
  B1_SPRACHBAUSTEINE,
  B1_TRUE_FALSE_HOREN,
  B1_SCHREIBEN_SIMULATION,
  B1_SPRECHEN_SIMULATION,
  B2_MATCHING_LESEN,
  B2_SPRACHBAUSTEINE,
  B2_TRUE_FALSE_HOREN,
  B2_SCHREIBEN_SIMULATION,
  B2_SPRECHEN_SIMULATION,
  C1_MATCHING_LESEN,
  C1_SPRACHBAUSTEINE,
  C1_TRUE_FALSE_HOREN,
  C1_SCHREIBEN_SIMULATION,
  C1_SPRECHEN_SIMULATION,
} from "./prufungExtendedData";

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamLesenTask {
  id: string;
  part: number; // Teil 1, Teil 2, Teil 3
  title: string;
  textType: string; // e.g., "E-Mail", "Zeitungsartikel", "Anzeige", "Forenbeitrag"
  context: string;
  text: string;
  questions: ExamQuestion[];
}

export interface ExamHorenTask {
  id: string;
  part: number;
  title: string;
  audioScenario: string;
  transcript: string;
  playCountMax: number;
  questions: ExamQuestion[];
}

export interface ExamSchreibenTask {
  id: string;
  part: number;
  title: string;
  targetWordCount: { min: number; max: number };
  prompt: string;
  requiredPoints: string[];
  sampleSolution: string;
  usefulPhrases: string[];
}

export interface ExamSprechenTask {
  id: string;
  part: number;
  title: string;
  durationMinutes: number;
  instructions: string;
  prompts: string[];
  essentialRedemittel: { category: string; phrases: string[] }[];
  evaluationCriteria: string[];
}

export interface VocabularyItem {
  id: string;
  term: string;
  article?: "der" | "die" | "das" | "il" | "la" | "lo" | "l'";
  plural?: string;
  translationFr: string;
  translationEn: string;
  exampleSentence: string;
  exampleTranslation: string;
  theme: string;
}

export interface ExamMatchingHeadline {
  id: string;
  label: string;
}

export interface ExamMatchingLesenTask {
  id: string;
  part: number; // Teil 1, 2, 3
  title: string;
  textType: string;
  theme: string;
  instructions: string;
  texts: string[];
  headlines: ExamMatchingHeadline[];
  answers: Record<string, string>; // textIndex (string "0", "1"...) -> headlineId
  explanations?: Record<string, string>;
}

export interface ExamSprachbausteineGap {
  n: number;
  opts: [string, string, string];
  correct: number;
  explanation?: string;
}

export interface ExamSprachbausteineTask {
  id: string;
  part: number; // Teil 1 ou Teil 2
  title: string;
  theme: string;
  instructions: string;
  context?: string;
  parts: Array<string | ExamSprachbausteineGap>;
}

export interface ExamHorenStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface ExamHorenTrueFalseTask {
  id: string;
  part: number;
  title: string;
  theme: string;
  audioScenario: string;
  script: string;
  playCountMax: number;
  statements: ExamHorenStatement[];
}

export interface ExamSchreibenRubricItem {
  critere: string;
  points: number;
}

export interface ExamSchreibenSimulationTask {
  id: string;
  part: number;
  title: string;
  theme: string;
  scenario: string;
  requirements: string[];
  min_words: number;
  time_minutes: number;
  rubric: ExamSchreibenRubricItem[];
  sampleSolution: string;
  usefulPhrases: string[];
}

export interface ExamSprechenSimulationTask {
  id: string;
  part: number;
  title: string;
  durationMinutes: number;
  instructions: string;
  topic: string;
  partnerTask?: string;
  prompts: string[];
  essentialRedemittel: Array<{ category: string; phrases: string[] }>;
  evaluationCriteria: string[];
}

export interface LevelExamConfig {
  level: CEFRLevel;
  officialExamNameDe: string;
  officialExamNameIt: string;
  certifyingBodies: string[];
  totalTimeMinutes: number;
  passingScorePercent: number; // 60%
  descriptionFr: string;
  descriptionEn: string;
  lesenTimeMinutes: number;
  horenTimeMinutes: number;
  schreibenTimeMinutes: number;
  sprechenTimeMinutes: number;
  wortschatzEstimate: number;
  tasks: {
    lesen: ExamLesenTask[];
    matchingLesen?: ExamMatchingLesenTask[];
    sprachbausteine?: ExamSprachbausteineTask[];
    horen: ExamHorenTask[];
    trueFalseHoren?: ExamHorenTrueFalseTask[];
    schreiben: ExamSchreibenTask[];
    schreibenSimulation?: ExamSchreibenSimulationTask[];
    sprechen: ExamSprechenTask[];
    sprechenSimulation?: ExamSprechenSimulationTask[];
    wortschatz: VocabularyItem[];
    wortschatzQuiz: ExamQuestion[];
  };
}

export const PRUFUNG_DATA_DE: Record<CEFRLevel, LevelExamConfig> = {
  A1: {
    level: "A1",
    officialExamNameDe: "Goethe-Zertifikat A1: Start Deutsch 1 / telc Deutsch A1",
    officialExamNameIt: "CILS A1 / CELI Impatto",
    certifyingBodies: ["Goethe-Institut", "telc GmbH", "ÖSD"],
    totalTimeMinutes: 80,
    passingScorePercent: 60,
    descriptionFr: "Certifie les compétences linguistiques élémentaires : expressions quotidiennes, besoins concrets et interactions simples.",
    descriptionEn: "Certifies basic elementary skills: everyday expressions, immediate concrete needs, and simple personal exchanges.",
    lesenTimeMinutes: 25,
    horenTimeMinutes: 20,
    schreibenTimeMinutes: 20,
    sprechenTimeMinutes: 15,
    wortschatzEstimate: 650,
    tasks: {
      lesen: [
        {
          id: "de-a1-lesen-1",
          part: 1,
          title: "Teil 1: Kurze E-Mails & Mitteilungen verstehen",
          textType: "E-Mail an einen Freund",
          context: "Sie lesen eine E-Mail von Ihrem Freund Marco.",
          text: `Liebe Anna,
wie geht es dir? Ich mache am Samstag ab 18:00 Uhr eine kleine Grillparty in meinem Garten. Mein neuer Nachbar Thomas kommt auch.
Bringst du bitte etwas zum Trinken mit? Bier habe ich schon gekauft, aber Orangensaft und Mineralwasser fehlen noch.
Bitte gib mir bis Freitag Bescheid, ob du kommen kannst.
Viele Grüße,
Marco`,
          questions: [
            {
              id: "de-a1-l1-q1",
              question: "Wann beginnt Marcos Party?",
              options: ["Am Freitag um 18:00 Uhr", "Am Samstag um 18:00 Uhr", "Am Sonntag um 12:00 Uhr"],
              correctIndex: 1,
              explanation: "Im Text steht ausdrücklich: 'Ich mache am Samstag ab 18:00 Uhr eine kleine Grillparty'.",
            },
            {
              id: "de-a1-l1-q2",
              question: "Was soll Anna mitbringen?",
              options: ["Bier und Fleisch", "Orangensaft oder Mineralwasser", "Einen Grill für den Garten"],
              correctIndex: 1,
              explanation: "Marco schreibt: 'Bier habe ich schon gekauft, aber Orangensaft und Mineralwasser fehlen noch.'",
            },
            {
              id: "de-a1-l1-q3",
              question: "Bis wann muss Anna antworten?",
              options: ["Bis Samstag", "Bis Freitag", "Bis heute Abend"],
              correctIndex: 1,
              explanation: "Marco bittet: 'Bitte gib mir bis Freitag Bescheid, ob du kommen kannst.'",
            },
          ],
        },
        {
          id: "de-a1-lesen-2",
          part: 2,
          title: "Teil 2: Schilder und Aushänge lesen",
          textType: "Aushang im Supermarkt",
          context: "Sie sehen diesen Aushang an der Tür des Supermarkts 'FrischMarkt'.",
          text: `ACHTUNG KUNDEN!
Wegen Umbauarbeiten bleibt unsere Bäckerei von Montag, 12. Mai bis Mittwoch, 14. Mai geschlossen.
Ab Donnerstag, 15. Mai haben wir wieder wie gewohnt ab 07:00 Uhr frisches Brot und Gebäck für Sie!
Der Supermarkt ist zu den normalen Öffnungszeiten für Sie geöffnet.`,
          questions: [
            {
              id: "de-a1-l2-q1",
              question: "Ist der gesamte Supermarkt von Montag bis Mittwoch geschlossen?",
              options: ["Ja, alles ist geschlossen", "Nein, nur die Bäckerei ist geschlossen", "Nein, nur am Donnerstag"],
              correctIndex: 1,
              explanation: "Der Aushang sagt: 'Der Supermarkt ist zu den normalen Öffnungszeiten geöffnet' und nur die Bäckerei bleibt geschlossen.",
            },
          ],
        },
      ],
      horen: [
        {
          id: "de-a1-horen-1",
          part: 1,
          title: "Teil 1: Durchsage am Bahnhof",
          audioScenario: "Bahnhofsansage am Hauptbahnhof Frankfurt",
          transcript: `Achtung an Gleis 4: Der Intercity-Express 572 nach Hamburg Hauptbahnhof über Hannover, planmäßige Abfahrt 14 Uhr 25, fährt heute abweichend von Gleis 7 ein. Ich wiederhole: ICE 572 nach Hamburg von Gleis 7. Bitte achten Sie auf die Durchsagen.`,
          playCountMax: 2,
          questions: [
            {
              id: "de-a1-h1-q1",
              question: "Von welchem Gleis fährt der Zug nach Hamburg heute ab?",
              options: ["Gleis 4", "Gleis 7", "Gleis 14"],
              correctIndex: 1,
              explanation: "Die Durchsage sagt: 'fährt heute abweichend von Gleis 7 ein.'",
            },
            {
              id: "de-a1-h1-q2",
              question: "Wohin fährt dieser Zug?",
              options: ["Nach Frankfurt", "Nach Hannover und Hamburg", "Nach München"],
              correctIndex: 1,
              explanation: "Der Zug fährt nach Hamburg Hauptbahnhof über Hannover.",
            },
          ],
        },
        {
          id: "de-a1-horen-2",
          part: 2,
          title: "Teil 2: Telefonnachricht beim Arzt",
          audioScenario: "Anrufbeantworter der Praxis Dr. Weber",
          transcript: `Guten Tag, Herr Müller. Hier spricht die Praxis Dr. Weber. Wir rufen an wegen Ihres Termins am Dienstag um 10 Uhr. Frau Dr. Weber ist am Dienstag leider auf einer Fortbildung. Könnten Sie stattdessen am Donnerstag um 14 Uhr 30 kommen? Bitte rufen Sie uns zurück unter 089 45 67 89. Vielen Dank!`,
          playCountMax: 2,
          questions: [
            {
              id: "de-a1-h2-q1",
              question: "Welcher neue Termin wird Herrn Müller vorgeschlagen?",
              options: ["Dienstag um 10:00 Uhr", "Donnerstag um 14:30 Uhr", "Freitag um 08:00 Uhr"],
              correctIndex: 1,
              explanation: "Die Arzthelferin fragt: 'Könnten Sie stattdessen am Donnerstag um 14 Uhr 30 kommen?'",
            },
          ],
        },
      ],
      schreiben: [
        {
          id: "de-a1-schreiben-1",
          part: 1,
          title: "Teil 1: Eine kurze persönliche E-Mail schreiben",
          targetWordCount: { min: 25, max: 40 },
          prompt: `Sie möchten Ihren Deutschkurs für zwei Tage absagen, weil Sie krank sind. Schreiben Sie eine E-Mail an Ihre Lehrerin, Frau Schmidt.`,
          requiredPoints: [
            "Grund für das Fehlen (krank sein)",
            "Wie lange Sie fehlen (Montag und Dienstag)",
            "Hausaufgaben erfragen",
          ],
          sampleSolution: `Sehr geehrte Frau Schmidt,
leider bin ich krank und habe Fieber. Deshalb kann ich am Montag und Dienstag nicht zum Deutschkurs kommen.
Können Sie mir bitte die Hausaufgaben per E-Mail schicken?
Vielen Dank und viele Grüße,
Max Mustermann`,
          usefulPhrases: [
            "Sehr geehrte Frau / Sehr geehrter Herr...",
            "Leider kann ich nicht kommen, weil...",
            "Ich bin krank und muss zum Arzt.",
            "Können Sie mir bitte... schicken?",
            "Mit freundlichen Grüßen / Viele Grüße",
          ],
        },
      ],
      sprechen: [
        {
          id: "de-a1-sprechen-1",
          part: 1,
          title: "Teil 1: Sich vorstellen (Offizielle Prüfungskarte)",
          durationMinutes: 3,
          instructions: "Stellen Sie sich vor anhand der Stichwörter auf Ihrer Karte. Buchstabieren Sie danach Ihren Namen und nennen Sie eine Telefonnummer.",
          prompts: ["Name", "Alter", "Land / Herkunft", "Wohnort", "Sprachen", "Beruf", "Hobbys"],
          essentialRedemittel: [
            {
              category: "Vorstellung",
              phrases: [
                "Mein Name ist... / Ich heiße...",
                "Ich bin ... Jahre alt.",
                "Ich komme aus... und wohne jetzt in...",
                "Ich spreche Französisch, Englisch und ein bisschen Deutsch.",
                "Von Beruf bin ich Ingenieur / Student / Verkäufer.",
                "Meine Hobbys sind Lesen, Musik hören und Kochen.",
              ],
            },
          ],
          evaluationCriteria: [
            "Aussprache und Verständlichkeit",
            "Beantwortung aller Pflichtpunkte",
            "Sicheres Buchstabieren und Zahlen nennen",
          ],
        },
      ],
      matchingLesen: A1_MATCHING_LESEN,
      sprachbausteine: A1_SPRACHBAUSTEINE,
      trueFalseHoren: A1_TRUE_FALSE_HOREN,
      schreibenSimulation: A1_SCHREIBEN_SIMULATION,
      sprechenSimulation: A1_SPRECHEN_SIMULATION,
      wortschatz: [
        {
          id: "w-a1-1",
          term: "die Wohnung",
          article: "die",
          plural: "Wohnungen",
          translationFr: "l'appartement",
          translationEn: "the apartment",
          exampleSentence: "Ich suche eine neue Wohnung in Berlin.",
          exampleTranslation: "Je cherche un nouvel appartement à Berlin.",
          theme: "Wohnen & Alltag",
        },
        {
          id: "w-a1-2",
          term: "der Beruf",
          article: "der",
          plural: "Berufe",
          translationFr: "la profession / le métier",
          translationEn: "the profession / job",
          exampleSentence: "Was sind Sie von Beruf?",
          exampleTranslation: "Quelle est votre profession ?",
          theme: "Arbeit & Beruf",
        },
        {
          id: "w-a1-3",
          term: "die Familie",
          article: "die",
          plural: "Familien",
          translationFr: "la famille",
          translationEn: "the family",
          exampleSentence: "Meine Familie lebt in Hamburg.",
          exampleTranslation: "Ma famille vit à Hambourg.",
          theme: "Familie & Freunde",
        },
        {
          id: "w-a1-4",
          term: "das Frühstück",
          article: "das",
          plural: "Frühstücke",
          translationFr: "le petit-déjeuner",
          translationEn: "breakfast",
          exampleSentence: "Um acht Uhr gibt es Frühstück.",
          exampleTranslation: "Le petit-déjeuner est à huit heures.",
          theme: "Essen & Trinken",
        },
        {
          id: "w-a1-5",
          term: "der Bahnhof",
          article: "der",
          plural: "Bahnhöfe",
          translationFr: "la gare",
          translationEn: "the train station",
          exampleSentence: "Der Bahnhof ist fünf Minuten zu Fuß entfernt.",
          exampleTranslation: "La gare est à cinq minutes à pied.",
          theme: "Reisen & Verkehr",
        },
        {
          id: "w-a1-6",
          term: "die Uhrzeit",
          article: "die",
          plural: "Uhrzeiten",
          translationFr: "l'heure",
          translationEn: "the time (of clock)",
          exampleSentence: "Wie viel Uhr ist es bitte?",
          exampleTranslation: "Quelle heure est-il s'il vous plaît ?",
          theme: "Alltag & Zeit",
        },
      ],
      wortschatzQuiz: [
        {
          id: "wq-a1-1",
          question: "Welcher Artikel passt zu 'Wohnung'?",
          options: ["der", "die", "das"],
          correctIndex: 1,
          explanation: "'Die Wohnung' ist feminin.",
        },
        {
          id: "wq-a1-2",
          question: "Was bedeutet 'das Frühstück'?",
          options: ["Le dîner", "Le petit-déjeuner", "Le déjeuner"],
          correctIndex: 1,
          explanation: "Frühstück = petit-déjeuner.",
        },
        {
          id: "wq-a1-3",
          question: "Wie sagt man 'Gare' auf Deutsch?",
          options: ["Der Flughafen", "Der Bahnhof", "Die Haltestelle"],
          correctIndex: 1,
          explanation: "Der Bahnhof = la gare.",
        },
      ],
    },
  },

  A2: {
    level: "A2",
    officialExamNameDe: "Goethe-Zertifikat A2 / telc Deutsch A2",
    officialExamNameIt: "CILS A2 / CELI 1",
    certifyingBodies: ["Goethe-Institut", "telc GmbH", "ÖSD"],
    totalTimeMinutes: 105,
    passingScorePercent: 60,
    descriptionFr: "Compréhension de phrases isolées et d'expressions fréquentes relatives à des domaines immédiats de priorité (famille, achats, travail).",
    descriptionEn: "Understanding sentences and frequent expressions related to immediate areas of relevance (family, shopping, employment).",
    lesenTimeMinutes: 30,
    horenTimeMinutes: 30,
    schreibenTimeMinutes: 30,
    sprechenTimeMinutes: 15,
    wortschatzEstimate: 1300,
    tasks: {
      lesen: [
        {
          id: "de-a2-lesen-1",
          part: 1,
          title: "Teil 1: Zeitungsberichte & Mitteilungen verstehen",
          textType: "Kurzartikel im Stadtmagazin",
          context: "Sie lesen einen Artikel über neue Mobilitätsangebote in München.",
          text: `FAHRRAD FREI IN DER INNENSTADT
Seit letzter Woche bietet die Stadt München 500 neue Leihfahrräder an. Die Räder stehen an 40 Stationen rund um den Hauptbahnhof und die Universität bereit.
Für Studenten gibt es einen speziellen Tarif: Die ersten 30 Minuten jeder Fahrt sind komplett kostenlos! Wer länger fährt, zahlt 1 Euro pro halbe Stunde.
Die Registrierung funktioniert einfach per Smartphone-App mit Personalausweis und Bankkarte. Helme sind nicht im Verleih enthalten, werden aber dringend empfohlen.`,
          questions: [
            {
              id: "de-a2-l1-q1",
              question: "Wie viel bezahlen Studierende für die ersten 30 Minuten?",
              options: ["1 Euro", "Nichts (kostenlos)", "50 Cent"],
              correctIndex: 1,
              explanation: "Der Text sagt: 'Für Studenten gibt es einen speziellen Tarif: Die ersten 30 Minuten jeder Fahrt sind komplett kostenlos!'",
            },
            {
              id: "de-a2-l1-q2",
              question: "Was muss man selbst mitbringen?",
              options: ["Das Smartphone", "Einen Fahrradhelm", "Den Personalausweis"],
              correctIndex: 1,
              explanation: "Der Text vermerkt: 'Helme sind nicht im Verleih enthalten, werden aber dringend empfohlen.'",
            },
          ],
        },
      ],
      horen: [
        {
          id: "de-a2-horen-1",
          part: 1,
          title: "Teil 1: Alltagsgespräch im Hotel",
          audioScenario: "Rezeption im Hotel Alpenblick",
          transcript: `Rezeptionist: Guten Tag, Hotel Alpenblick, mein Name ist Fischer. Was kann ich für Sie tun?
Gast: Guten Tag, hier ist Schneider. Ich habe ein Doppelzimmer für drei Nächte ab dem 10. August reserviert. Ich möchte fragen, ob das Frühstück im Preis inbegriffen ist.
Rezeptionist: Moment bitte, Frau Schneider... Ja, Ihre Buchung liegt vor. Das reichhaltige Frühstücksbuffet ist im Zimmerpreis enthalten. Es wird täglich von 7:00 bis 10:30 Uhr im Erdgeschoss serviert.
Gast: Wunderbar! Und gibt es WLAN im Zimmer?
Rezeptionist: Ja, im gesamten Hotel steht Ihnen schnelles WLAN kostenfrei zur Verfügung.`,
          playCountMax: 2,
          questions: [
            {
              id: "de-a2-h1-q1",
              question: "Muss Frau Schneider extra für das Frühstück bezahlen?",
              options: ["Ja, 15 Euro pro Tag", "Nein, es ist im Preis enthalten", "Nein, es gibt kein Frühstück"],
              correctIndex: 1,
              explanation: "Der Rezeptionist sagt: 'Das reichhaltige Frühstücksbuffet ist im Zimmerpreis enthalten.'",
            },
          ],
        },
      ],
      schreiben: [
        {
          id: "de-a2-schreiben-1",
          part: 1,
          title: "Teil 1: Einladung zur Geburtstagsfeier beantworten",
          targetWordCount: { min: 40, max: 60 },
          prompt: `Ihr Kollege Felix hat Sie zu seiner Geburtstagsfeier am Samstag eingeladen. Schreiben Sie eine Antwort:
1. Bedanken Sie sich für die Einladung.
2. Sagen Sie zu, dass Sie kommen.
3. Fragen Sie, ob Sie etwas mitbringen sollen.`,
          requiredPoints: ["Dank für Einladung", "Zusage", "Angebot mitzubringen"],
          sampleSolution: `Lieber Felix,
vielen Dank für die Einladung zu deiner Geburtstagsfeier! Ich habe mich sehr darüber gefreut.
Ich komme sehr gerne am Samstag. Soll ich einen Salat oder einen Kuchen mitbringen?
Bis Samstag,
Liebe Grüße!`,
          usefulPhrases: [
            "Vielen Dank für deine Einladung...",
            "Ich habe mich sehr gefreut.",
            "Ich komme sehr gerne!",
            "Kann ich etwas mitbringen?",
            "Ich freue mich schon auf die Feier.",
          ],
        },
      ],
      sprechen: [
        {
          id: "de-a2-sprechen-1",
          part: 1,
          title: "Teil 2: Von sich erzählen (Präsentation eines Themas)",
          durationMinutes: 4,
          instructions: "Wählen Sie ein Thema aus (z.B. 'Mein Lieblingsurlaub' oder 'Mein typischer Tag') und sprechen Sie etwa zwei Minuten darüber.",
          prompts: ["Thema wählen", "Wann und wo?", "Mit wem?", "Was haben Sie gemacht?", "Warum hat es Ihnen gefallen?"],
          essentialRedemittel: [
            {
              category: "Strukturierung",
              phrases: [
                "Ich möchte über mein Thema ... sprechen.",
                "Normalerweise stehe ich um ... auf.",
                "Letztes Jahr bin ich nach ... gefahren.",
                "Das hat mir besonders gut gefallen, weil...",
              ],
            },
          ],
          evaluationCriteria: [
            "Flüssiges Sprechen ohne lange Pausen",
            "Korrekte Bildung des Perfekts",
            "Angemessener Wortschatz für A2",
          ],
        },
      ],
      matchingLesen: A2_MATCHING_LESEN,
      sprachbausteine: A2_SPRACHBAUSTEINE,
      trueFalseHoren: A2_TRUE_FALSE_HOREN,
      schreibenSimulation: A2_SCHREIBEN_SIMULATION,
      sprechenSimulation: A2_SPRECHEN_SIMULATION,
      wortschatz: [
        {
          id: "w-a2-1",
          term: "die Erfahrung",
          article: "die",
          plural: "Erfahrungen",
          translationFr: "l'expérience",
          translationEn: "the experience",
          exampleSentence: "Ich habe schon viel Erfahrung im Kundenservice.",
          exampleTranslation: "J'ai déjà beaucoup d'expérience dans le service client.",
          theme: "Arbeit & Beruf",
        },
        {
          id: "w-a2-2",
          term: "die Gesundheit",
          article: "die",
          translationFr: "la santé",
          translationEn: "health",
          exampleSentence: "Sport ist sehr gut für die Gesundheit.",
          exampleTranslation: "Le sport est très bon pour la santé.",
          theme: "Körper & Gesundheit",
        },
        {
          id: "w-a2-3",
          term: "die Umwelt",
          article: "die",
          translationFr: "l'environnement",
          translationEn: "the environment",
          exampleSentence: "Wir müssen die Umwelt schützen und Müll trennen.",
          exampleTranslation: "Nous devons protéger l'environnement et trier les déchets.",
          theme: "Natur & Umwelt",
        },
        {
          id: "w-a2-4",
          term: "die Ausbildung",
          article: "die",
          plural: "Ausbildungen",
          translationFr: "la formation professionnelle",
          translationEn: "apprenticeship / vocational training",
          exampleSentence: "Er macht eine Ausbildung zum Mechatroniker.",
          exampleTranslation: "Il fait une formation de mécatronicien.",
          theme: "Bildung & Karriere",
        },
      ],
      wortschatzQuiz: [
        {
          id: "wq-a2-1",
          question: "Was bedeutet 'die Ausbildung'?",
          options: ["Les vacances scolaires", "La formation professionnelle", "Le diplôme universitaire"],
          correctIndex: 1,
          explanation: "'Die Ausbildung' désigne la formation en alternance ou professionnelle.",
        },
      ],
    },
  },

  B1: {
    level: "B1",
    officialExamNameDe: "Goethe-Zertifikat B1 / telc Deutsch B1 / ÖSD Zertifikat B1",
    officialExamNameIt: "CILS Uno (B1) / CELI 2",
    certifyingBodies: ["Goethe-Institut", "telc GmbH", "ÖSD"],
    totalTimeMinutes: 180,
    passingScorePercent: 60,
    descriptionFr: "Autonomie linguistique : compréhension des points essentiels d'un langage standard, gestion des voyages, argumentation sur des sujets familiers.",
    descriptionEn: "Independent language use: understand key points of clear standard input, manage travel situations, produce simple connected text on familiar topics.",
    lesenTimeMinutes: 65,
    horenTimeMinutes: 40,
    schreibenTimeMinutes: 60,
    sprechenTimeMinutes: 15,
    wortschatzEstimate: 2400,
    tasks: {
      lesen: [
        {
          id: "de-b1-lesen-1",
          part: 1,
          title: "Teil 1: Blogbeitrag über nachhaltiges Leben",
          textType: "Blogbeitrag & Erfahrungsbericht",
          context: "Sie lesen einen Beitrag auf einem deutschen Umwelt-Blog.",
          text: `MEIN JAHR OHNE PLASTIK – EIN ZWISCHENBERICHT
Vor zehn Monaten habe ich beschlossen, meinen Alltag radikal umzustellen: Keine Plastikverpackungen mehr beim Einkaufen, keine Einwegflaschen, keine Plastiktüten.
Am Anfang war es erstaunlich mühsam. Im herkömmlichen Supermarkt ist fast jedes Gemüse in Plastikfolie verschweißt. Ich musste meine Einkaufsgewohnheiten komplett ändern und gehe nun samstags auf den Wochenmarkt oder in den Unverpackt-Laden.
Das Überraschende dabei: Ich gebe monatlich nicht mehr Geld aus als früher, weil ich viel seltener zu teuren Fertiggerichten greife und stattdessen mit frischen Zutaten koche. Allerdings erfordert diese Lebensweise ein hohes Maß an Vorbereitung und Zeitmanagement. Wer spontan unterwegs Hunger hat, findet selten plastikfreie Snacks.`,
          questions: [
            {
              id: "de-b1-l1-q1",
              question: "Warum war der Verzicht auf Plastik zu Beginn besonders schwierig?",
              options: [
                "Weil Unverpackt-Läden zu teuer waren",
                "Weil fast alle Produkte im normalen Supermarkt verpackt sind",
                "Weil die Familie nicht mitmachen wollte",
              ],
              correctIndex: 1,
              explanation: "Der Autor schreibt: 'Im herkömmlichen Supermarkt ist fast jedes Gemüse in Plastikfolie verschweißt.'",
            },
            {
              id: "de-b1-l1-q2",
              question: "Welche Auswirkung hat die Umstellung auf das Monatsbudget des Autors?",
              options: [
                "Er spart viel mehr Geld als gedacht",
                "Die Kosten sind in etwa gleich geblieben",
                "Er gibt deutlich mehr Geld aus für Bio-Lebensmittel",
              ],
              correctIndex: 1,
              explanation: "Der Text stellt fest: 'Ich gebe monatlich nicht mehr Geld aus als früher, weil ich seltener Fertiggerichte kaufe.'",
            },
            {
              id: "de-b1-l1-q3",
              question: "Welcher Nachteil wird im Text genannt?",
              options: [
                "Man verliert Freunde",
                "Man braucht mehr Zeit und gute Planung",
                "Man wird häufiger krank",
              ],
              correctIndex: 1,
              explanation: "Der Autor betont: 'Allerdings erfordert diese Lebensweise ein hohes Maß an Vorbereitung und Zeitmanagement.'",
            },
          ],
        },
      ],
      horen: [
        {
          id: "de-b1-horen-1",
          part: 1,
          title: "Teil 1: Radiointerview über Weiterbildung im Beruf",
          audioScenario: "Radiosendung 'Wirtschaft & Karriere' auf Deutschlandfunk",
          transcript: `Moderatorin: Herzlich willkommen zu unserer Sendung. Heute sprechen wir mit Dr. Martina Krüger, Expertin für berufliche Weiterbildung. Frau Dr. Krüger, warum entscheiden sich immer mehr Berufstätige mit über 40 für eine Umschulung?
Dr. Krüger: Nun, der Hauptgrund liegt in der rasanten Digitalisierung. Viele traditionelle Arbeitsplätze verändern sich grundlegend. Viele unserer Teilnehmer möchten nicht warten, bis ihr Job verschwindet, sondern aktiv neue Fertigkeiten in IT, Datenanalyse oder Projektmanagement erwerben.
Moderatorin: Und wie finanzieren die Teilnehmer diese Kurse?
Dr. Krüger: In Deutschland gibt es den Bildungsgutschein der Bundesagentur für Arbeit. Wenn die Weiterbildung notwendig ist, um die Beschäftigungsfähigkeit zu sichern, übernimmt der Staat oft bis zu 100 Prozent der Lehrgangskosten.`,
          playCountMax: 2,
          questions: [
            {
              id: "de-b1-h1-q1",
              question: "Was ist laut Dr. Krüger der wichtigste Auslöser für Umschulungen?",
              options: [
                "Der Wunsch nach kürzeren Arbeitszeiten",
                "Die fortschreitende Digitalisierung der Arbeitswelt",
                "Schlechte Bezahlung im alten Beruf",
              ],
              correctIndex: 1,
              explanation: "Dr. Krüger erklärt: 'Der Hauptgrund liegt in der rasanten Digitalisierung.'",
            },
            {
              id: "de-b1-h1-q2",
              question: "Unter welcher Voraussetzung fördert der Staat die Weiterbildung?",
              options: [
                "Nur für Personen unter 30 Jahren",
                "Wenn die Weiterbildung die Beschäftigung sichert",
                "Nur an staatlichen Universitäten",
              ],
              correctIndex: 1,
              explanation: "Sie sagt: 'Wenn die Weiterbildung notwendig ist, um die Beschäftigungsfähigkeit zu sichern, übernimmt der Staat bis zu 100%.'",
            },
          ],
        },
      ],
      schreiben: [
        {
          id: "de-b1-schreiben-1",
          part: 1,
          title: "Teil 2: Meinungsäußerung im Online-Forum",
          targetWordCount: { min: 80, max: 100 },
          prompt: `Sie haben in einer Talkshow eine Diskussion zum Thema "Sollen Smartphones an Schulen verboten werden?" gesehen. Schreiben Sie einen Forumsbeitrag und äußern Sie Ihre Meinung:
1. Drücken Sie Ihre Meinung zum Smartphone-Verbot aus.
2. Nennen Sie Gründe für Ihre Haltung.
3. Nennen Sie Vor- oder Nachteile digitaler Medien im Unterricht.
4. Ziehen Sie ein Fazit.`,
          requiredPoints: [
            "Eigene Meinung deutlich darstellen",
            "Argumente für oder gegen Smartphone-Verbot",
            "Beispiele aus Schule oder Alltag",
            "Schlussfolgerung",
          ],
          sampleSolution: `Ich finde die Diskussion über Smartphones an Schulen sehr wichtig. Meiner Meinung nach ist ein komplettes Verbot nicht die beste Lösung. 
Zwar lenken Handys Schüler im Unterricht oft ab und stören die Konzentration. Andererseits sind Smartphones ein nützliches Werkzeug, um schnell Vokabeln nachzuschlagen oder digitale Lern-Apps zu nutzen. 
Besser wäre es, klare Regeln aufzustellen: Smartphones dürfen nur dann eingeschaltet werden, wenn die Lehrkraft es für eine konkrete Aufgabe erlaubt. So lernen Kinder einen verantwortungsvollen Umgang mit moderner Technik.`,
          usefulPhrases: [
            "Meiner Meinung nach sollte man...",
            "Ich bin der Ansicht, dass...",
            "Einerseits..., andererseits...",
            "Ein großer Vorteil / Nachteil ist...",
            "Zusammenfassend lässt sich sagen, dass...",
          ],
        },
      ],
      sprechen: [
        {
          id: "de-b1-sprechen-1",
          part: 1,
          title: "Teil 2: Ein Thema präsentieren (Präsentationsstruktur B1)",
          durationMinutes: 5,
          instructions: "Präsentieren Sie ein Thema (z.B. 'Brauchen wir noch gedruckte Bücher?' oder 'Reisen mit der Bahn vs. Auto'). Folgen Sie der fünfstufigen Struktur.",
          prompts: [
            "1. Thema vorstellen & Struktur ankündigen",
            "2. Eigene persönliche Erfahrungen schildern",
            "3. Vor- und Nachteile abwägen",
            "4. Situation im Heimatland beschreiben",
            "5. Eigenes Fazit & Dank für Aufmerksamkeit",
          ],
          essentialRedemittel: [
            {
              category: "Einleitung & Struktur",
              phrases: [
                "Das Thema meiner Präsentation lautet...",
                "Ich habe dieses Thema gewählt, weil...",
                "Meine Präsentation besteht aus folgenden Teilen...",
              ],
            },
            {
              category: "Vor- und Nachteile",
              phrases: [
                "Ein wesentlicher Vorteil ist, dass...",
                "Demgegenüber steht der Nachteil, dass...",
                "Im Vergleich dazu ist...",
              ],
            },
            {
              category: "Schluss",
              phrases: [
                "Zusammenfassend bin ich der Überzeugung, dass...",
                "Ich bedanke mich herzlich für Ihre Aufmerksamkeit.",
                "Haben Sie noch Fragen?",
              ],
            },
          ],
          evaluationCriteria: [
            "Einhaltung der Gliederung",
            "Verbindungswörter (Konnektoren: deshalb, obwohl, trotzdem)",
            "Aussprache und Intonation",
            "Interaktive Beantwortung von Partnerfragen",
          ],
        },
      ],
      matchingLesen: B1_MATCHING_LESEN,
      sprachbausteine: B1_SPRACHBAUSTEINE,
      trueFalseHoren: B1_TRUE_FALSE_HOREN,
      schreibenSimulation: B1_SCHREIBEN_SIMULATION,
      sprechenSimulation: B1_SPRECHEN_SIMULATION,
      wortschatz: [
        {
          id: "w-b1-1",
          term: "die Voraussetzung",
          article: "die",
          plural: "Voraussetzungen",
          translationFr: "le prérequis / la condition préalable",
          translationEn: "prerequisite / condition",
          exampleSentence: "Gute Deutschkenntnisse sind eine Voraussetzung für diesen Studiengang.",
          exampleTranslation: "De bonnes connaissances en allemand sont un prérequis pour ce cursus.",
          theme: "Bildung & Studium",
        },
        {
          id: "w-b1-2",
          term: "die Nachhaltigkeit",
          article: "die",
          translationFr: "la durabilité / le développement durable",
          translationEn: "sustainability",
          exampleSentence: "Das Unternehmen setzt verstärkt auf ökologische Nachhaltigkeit.",
          exampleTranslation: "L'entreprise mise de plus en plus sur la durabilité écologique.",
          theme: "Umwelt & Gesellschaft",
        },
        {
          id: "w-b1-3",
          term: "der Arbeitgeber",
          article: "der",
          plural: "Arbeitgeber",
          translationFr: "l'employeur",
          translationEn: "the employer",
          exampleSentence: "Mein Arbeitgeber bietet flexible Arbeitszeiten und Homeoffice an.",
          exampleTranslation: "Mon employeur propose des horaires flexibles et du télétravail.",
          theme: "Wirtschaft & Beruf",
        },
        {
          id: "w-b1-4",
          term: "beeinflussen",
          translationFr: "influencer",
          translationEn: "to influence",
          exampleSentence: "Soziale Medien beeinflussen die Meinungsbildung stark.",
          exampleTranslation: "Les réseaux sociaux influencent fortement la formation des opinions.",
          theme: "Medien & Kommunikation",
        },
        {
          id: "w-b1-5",
          term: "die Herausforderung",
          article: "die",
          plural: "Herausforderungen",
          translationFr: "le défi / le challenge",
          translationEn: "the challenge",
          exampleSentence: "Der Klimawandel ist die größte globale Herausforderung unserer Zeit.",
          exampleTranslation: "Le changement climatique est le plus grand défi mondial de notre époque.",
          theme: "Politik & Zukunft",
        },
      ],
      wortschatzQuiz: [
        {
          id: "wq-b1-1",
          question: "Was bedeutet 'die Voraussetzung'?",
          options: ["La conclusion finale", "Le prérequis ou condition préalable", "L'hypothèse scientifique"],
          correctIndex: 1,
          explanation: "Voraussetzung = condition préalable indispensable.",
        },
        {
          id: "wq-b1-2",
          question: "Welches Wort passt: 'Das Unternehmen setzt auf ökologische ______'?",
          options: ["Vergangenheit", "Nachhaltigkeit", "Minderheit"],
          correctIndex: 1,
          explanation: "'Nachhaltigkeit' signifie durabilité.",
        },
      ],
    },
  },

  B2: {
    level: "B2",
    officialExamNameDe: "Goethe-Zertifikat B2 / telc Deutsch B2",
    officialExamNameIt: "CILS Due (B2) / CELI 3",
    certifyingBodies: ["Goethe-Institut", "telc GmbH", "ÖSD"],
    totalTimeMinutes: 195,
    passingScorePercent: 60,
    descriptionFr: "Compréhension du contenu essentiel de sujets concrets ou abstraits dans un texte complexe, discussion technique, expression spontanée et courante.",
    descriptionEn: "Understanding complex texts on concrete and abstract topics, technical discussions in field of specialization, fluent interaction.",
    lesenTimeMinutes: 65,
    horenTimeMinutes: 40,
    schreibenTimeMinutes: 75,
    sprechenTimeMinutes: 15,
    wortschatzEstimate: 4000,
    tasks: {
      lesen: [
        {
          id: "de-b2-lesen-1",
          part: 1,
          title: "Teil 1: Debattenartikel zu Homeoffice und Unternehmensführung",
          textType: "Wirtschafts- und Gesellschaftsartikel",
          context: "Sie lesen einen Fachartikel im 'Manager Magazin'.",
          text: `ZWISCHEN FREIHEIT UND ISOLATION: DIE ZUKUNFT DES HYBRIDEN ARBEITENS
Die Euphorie über die grenzenlose Flexibilität des Homeoffice weicht zunehmend einer differenzierten Ernüchterung. Während Arbeitnehmer die gewonnene Zeitersparnis durch den Wegfall des täglichen Pendelns schätzen, schlagen viele Führungskräfte Alarm.
Aktuelle Studien renommierter Wirtschaftsinstitute belegen, dass die Innovationskraft von Unternehmen maßgeblich von informellen Begegnungen an der Kaffeemaschine oder im Flur abhängt. Spontane Synergien lassen sich nur schwer in durchgetakteten Videokonferenzen reproduzieren.
Zudem verschwimmen im heimischen Arbeitszimmer die Grenzen zwischen Berufs- und Privatleben, was langfristig zu chronischer Überlastung führen kann. Zukunftsfähige Unternehmen setzen daher auf sogenannte hybride Modelle mit verbindlichen Präsenztagen, an denen kollaborative Teamprozesse im Mittelpunkt stehen.`,
          questions: [
            {
              id: "de-b2-l1-q1",
              question: "Warum betrachten Führungskräfte reines Homeoffice mit Skepsis?",
              options: [
                "Weil Mitarbeiter zu Hause weniger Arbeitsstunden leisten",
                "Weil informelle, innovationsfördernde Begegnungen fehlen",
                "Weil die Energiekosten für Büros steigen",
              ],
              correctIndex: 1,
              explanation: "Der Text betont: 'Aktuelle Studien belegen, dass die Innovationskraft maßgeblich von informellen Begegnungen abhängt.'",
            },
            {
              id: "de-b2-l1-q2",
              question: "Welche Gefahr für Arbeitnehmer wird im Text genannt?",
              options: [
                "Fehlende Gehaltserhöhungen",
                "Verschwimmen der Grenzen zwischen Freizeit und Arbeit",
                "Gefahr von Arbeitslosigkeit",
              ],
              correctIndex: 1,
              explanation: "Es heißt: 'Grenzen zwischen Berufs- und Privatleben verschwimmen, was zu Überlastung führen kann.'",
            },
          ],
        },
      ],
      horen: [
        {
          id: "de-b2-horen-1",
          part: 1,
          title: "Teil 1: Radio-Podiumsdiskussion über Künstliche Intelligenz",
          audioScenario: "WDR 5 Debatte: Chancen und Risiken generativer KI im Bildungswesen",
          transcript: `Moderator: Guten Abend, meine Damen und Herren. Künstliche Intelligenz hält Einzug in Hörsäle und Klassenzimmer. Professor Lindemann, droht uns eine Entmündigung des menschlichen Denkens?
Prof. Lindemann: Keineswegs, wenn wir didaktisch klug reagieren. KI-Systeme zwingen uns vielmehr, Prüfungsformate grundlegend zu überdenken. Das bloße Reproduzieren von Faktenwissen wird obsolet. Gefragt sind künftig kritisches Hinterfragen, Quellenkritik und kreatives Problemlösen.
Frau Dr. Becker: Da muss ich Ihnen aber widersprechen, Herr Kollege. Wenn Studierende keine Basistexte mehr selbst verfassen, geht die Fähigkeit zur sprachlichen Präzision verloren. Denn Sprache ist nicht nur Transportmittel für Gedanken, sondern das Werkzeug des Denkens selbst!`,
          playCountMax: 2,
          questions: [
            {
              id: "de-b2-h1-q1",
              question: "Welche Konsequenz zieht Professor Lindemann aus dem Einsatz von KI?",
              options: [
                "Prüfungsformate müssen auf kritisches Denken umgestellt werden",
                "KI sollte an Universitäten verboten werden",
                "Faktenwissen wird wichtiger denn je",
              ],
              correctIndex: 0,
              explanation: "Er plädiert dafür, Prüfungen zu überdenken und kritisches Denken zu fördern.",
            },
            {
              id: "de-b2-h1-q2",
              question: "Welches Kernargument bringt Dr. Becker gegen Lindemanns Position vor?",
              options: [
                "KI-Modelle sind zu teuer für Studenten",
                "Das selbstständige Schreiben formt das präzise Denken",
                "Professoren können KI-Texte nicht erkennen",
              ],
              correctIndex: 1,
              explanation: "Dr. Becker argumentiert: 'Sprache ist das Werkzeug des Denkens selbst; ohne Schreiben geht Präzision verloren.'",
            },
          ],
        },
      ],
      schreiben: [
        {
          id: "de-b2-schreiben-1",
          part: 1,
          title: "Teil 1: Diskussionsbeitrag zu einem gesellschaftlichen Thema",
          targetWordCount: { min: 150, max: 180 },
          prompt: `Schreiben Sie einen Forumsbeitrag zum Thema "Konsumgesellschaft und Reparieren statt Wegwerfen".
- Nehmen Sie Stellung zur Wegwerfgesellschaft.
- Erläutern Sie die Vor- und Nachteile von Reparatur-Cafés und langlebigen Produkten.
- Nennen Sie Beispiele, warum Geräte oft vorzeitig ersetzt werden (geplante Obsoleszenz).
- Formulieren Sie konkrete Forderungen an Politik und Hersteller.`,
          requiredPoints: [
            "Differenzierte Einleitung mit aktuellem Bezug",
            "Abwägung von ökonomischen und ökologischen Faktoren",
            "Beispiele aus persönlicher Erfahrung oder Fachwissen",
            "Appell an Konsumenten und Gesetzgeber",
          ],
          sampleSolution: `In unserer heutigen Konsumgesellschaft werden elektronische Geräte oft bereits bei minimalen Defekten entsorgt. Dieser Trend zur Wegwerfmentalität belastet nicht nur die Umwelt durch wachsende Müllberge, sondern verschwendet auch wertvolle Ressourcen.
Ein Lösungsansatz sind Repair-Cafés, in denen ehrenamtliche Experten Bürgern helfen, defekte Geräte wieder instand zu setzen. Ein klarer Vorteil ist die Stärkung des Gemeinschaftsgefühls und die Einsparung von Geld. Allerdings stößt dieses Modell an Grenzen, wenn Hersteller Ersatzteile künstlich verteuern oder Gehäuse unlösbar verkleben.
Daher sollte der Gesetzgeber ein verbindliches "Recht auf Reparatur" verankern. Nur wenn Langlebigkeit belohnt wird, können wir den Wandel zu einer nachhaltigen Kreislaufwirtschaft schaffen.`,
          usefulPhrases: [
            "Es steht außer Frage, dass...",
            "Angesichts dieser Entwicklung halte ich es für unerlässlich...",
            "Man darf jedoch nicht außer Acht lassen, dass...",
            "Dies wirft unweigerlich die Frage auf, ob...",
            "Abschließend möchte ich betonen, dass...",
          ],
        },
      ],
      sprechen: [
        {
          id: "de-b2-sprechen-1",
          part: 1,
          title: "Teil 1: Vortrag & Diskussion mit Partner",
          durationMinutes: 5,
          instructions: "Halten Sie einen strukturierten Vortrag (ca. 3 Minuten) zu einem Thema mit kontroversen Positionen und reagieren Sie anschließend auf die Einwände Ihres Prüfungspartners.",
          prompts: [
            "Problemaufriss & These formulieren",
            "Persönliche Perspektive darstellen",
            "Gegenargumente entkräften",
            "Synthese & Ausblick",
          ],
          essentialRedemittel: [
            {
              category: "Argumentation B2",
              phrases: [
                "Ich vertrete den Standpunkt, dass...",
                "Ein ausschlaggebender Faktor hierbei ist...",
                "Gegen diese Auffassung spricht allerdings...",
                "Ich bezweifle, dass dieser Lösungsansatz ausreicht.",
              ],
            },
            {
              category: "Interaktion & Replik",
              phrases: [
                "Da stimme ich Ihnen vollkommen zu, jedoch...",
                "Erlauben Sie mir dazu eine kurze Gegenfrage...",
                "Das mag auf den ersten Blick überzeugend klingen, aber...",
              ],
            },
          ],
          evaluationCriteria: [
            "Kohärenz und Argumentationstiefe",
            "Verwendung von N-Deklination und Passivkonstruktionen",
            "Differenzierter Wortschatz (C-Wortschatz-Elemente)",
            "Spontane Reaktionsfähigkeit",
          ],
        },
      ],
      matchingLesen: B2_MATCHING_LESEN,
      sprachbausteine: B2_SPRACHBAUSTEINE,
      trueFalseHoren: B2_TRUE_FALSE_HOREN,
      schreibenSimulation: B2_SCHREIBEN_SIMULATION,
      sprechenSimulation: B2_SPRECHEN_SIMULATION,
      wortschatz: [
        {
          id: "w-b2-1",
          term: "die Maßnahmen ergreifen",
          translationFr: "prendre des mesures",
          translationEn: "to take measures / actions",
          exampleSentence: "Die Regierung muss unverzüglich Maßnahmen gegen die Inflation ergreifen.",
          exampleTranslation: "Le gouvernement doit immédiatement prendre des mesures contre l'inflation.",
          theme: "Politik & Gesellschaft",
        },
        {
          id: "w-b2-2",
          term: "die Konsequenz",
          article: "die",
          plural: "Konsequenzen",
          translationFr: "la conséquence",
          translationEn: "consequence",
          exampleSentence: "Fehlentscheidungen im Management können gravierende Konsequenzen nach sich ziehen.",
          exampleTranslation: "Des erreurs de gestion peuvent entraîner de graves conséquences.",
          theme: "Wirtschaft & Analyse",
        },
        {
          id: "w-b2-3",
          term: "zur Verfügung stehen",
          translationFr: "être à disposition",
          translationEn: "to be available",
          exampleSentence: "Für das Projekt stehen ausreichende finanzielle Mittel zur Verfügung.",
          exampleTranslation: "Des fonds financiers suffisants sont à disposition pour le projet.",
          theme: "Beruf & Feste Wendungen",
        },
        {
          id: "w-b2-4",
          term: "infrage kommen",
          translationFr: "entrer en ligne de compte",
          translationEn: "to be considered / possible",
          exampleSentence: "Ein Umzug ins Ausland kommt für mich derzeit nicht infrage.",
          exampleTranslation: "Un déménagement à l'étranger n'entre pas en ligne de compte pour moi actuellement.",
          theme: "Redewendungen",
        },
      ],
      wortschatzQuiz: [
        {
          id: "wq-b2-1",
          question: "Was bedeutet die feste Nomen-Verb-Verbindung 'Maßnahmen ergreifen'?",
          options: ["Mesurer des distances", "Prendre des mesures / agir", "Abandonner une procédure"],
          correctIndex: 1,
          explanation: "'Maßnahmen ergreifen' bedeutet handeln oder intervenieren.",
        },
      ],
    },
  },

  C1: {
    level: "C1",
    officialExamNameDe: "Goethe-Zertifikat C1 / telc Deutsch C1 Hochschule",
    officialExamNameIt: "CILS Tre (C1) / CELI 4",
    certifyingBodies: ["Goethe-Institut", "telc GmbH", "ÖSD"],
    totalTimeMinutes: 210,
    passingScorePercent: 60,
    descriptionFr: "Compréhension de textes longs et exigeants, expression spontanée et fluide sans chercher ses mots, usage souple de la langue dans la vie sociale, professionnelle ou universitaire.",
    descriptionEn: "Understanding wide range of demanding, longer texts, flexible and effective language use for social, academic and professional purposes.",
    lesenTimeMinutes: 70,
    horenTimeMinutes: 40,
    schreibenTimeMinutes: 80,
    sprechenTimeMinutes: 15,
    wortschatzEstimate: 8000,
    tasks: {
      lesen: [
        {
          id: "de-c1-lesen-1",
          part: 1,
          title: "Teil 1: Wissenschaftlicher Essay zu Sprachwandel und Epistemologie",
          textType: "Akademischer Essay / Fachpublikation",
          context: "Sie lesen einen Aufsatz in einer kulturwissenschaftlichen Zeitschrift.",
          text: `DER PERFORMATIVE CHARAKTER DER SPRACHE IN DIGITALEN MEDIEN
Die zeitgenössische Linguistik begreift Sprache längst nicht mehr als ein rein deskriptives Instrumentarium zur Abbildung außersprachlicher Realitäten. Vielmehr erweist sich die sprachliche Äußerung als ein performativer Akt, der Wirklichkeiten erst konstituiert.
Im digitalen Zeitalter erfährt diese Dynamik durch algorithmisch gesteuerte Resonanzräume eine gravierende Zuspitzung. Die Verkürzung diskursiver Nuancen auf plakative Parolen führt zu einer zunehmenden Polarisierung des öffentlichen Raums.
Wer die subtile Macht der Lexik und syntaktischen Tropen nicht zu dekonstruieren vermag, läuft Gefahr, manipulativen Diskursstrategien zum Opfer zu fallen. Akademische Mündigkeit erfordert folglich eine geschärfte Medienhermeneutik, die über die bloße Semantik hinausreicht und die pragmatischen Implikationen sprachlicher Handlungen freilegt.`,
          questions: [
            {
              id: "de-c1-l1-q1",
              question: "Was besagt der performative Charakter von Sprache im Text?",
              options: [
                "Sprache beschreibt die Realität rein sachlich",
                "Sprache schafft und formt aktiv Wirklichkeiten",
                "Sprache verliert im Internet an Bedeutung",
              ],
              correctIndex: 1,
              explanation: "Der Text formuliert: 'Vielmehr erweist sich die sprachliche Äußerung als ein performativer Akt, der Wirklichkeiten erst konstituiert.'",
            },
            {
              id: "de-c1-l1-q2",
              question: "Was fordert der Autor für eine zeitgemäße akademische Mündigkeit?",
              options: [
                "Einen Verzicht auf soziale Medien",
                "Eine kritische Medienhermeneutik zur Entlarvung manipulativen Sprachgebrauchs",
                "Die Rückkehr zu lateinischen Grammatikmodellen",
              ],
              correctIndex: 1,
              explanation: "Der Autor fordert eine 'geschärfte Medienhermeneutik, die über die bloße Semantik hinausreicht und pragmatische Implikationen freilegt.'",
            },
          ],
        },
      ],
      horen: [
        {
          id: "de-c1-horen-1",
          part: 1,
          title: "Teil 1: Akademische Vorlesung zur Neurobiologie des Spracherwerbs",
          audioScenario: "Universität Heidelberg: Ringvorlesung Kognitionswissenschaften",
          transcript: `Guten Morgen. In der heutigen Sitzung widmen wir uns der synaptischen Plastizität beim bilingualen Spracherwerb im Erwachsenenalter.
Lange Zeit dominierte in der Neuropsychologie die These einer strikten 'kritischen Periode', nach deren Ablauf das Gehirn nicht mehr imstande sei, ein muttersprachenähnliches phonetisches und syntaktisches Repertoire aufzubauen.
Neuere funktionelle Magnetresonanztomographie-Studien widerlegen diese deterministische Sichtweise jedoch eindrucksvoll. Zwar erfordert der adulte Spracherwerb einen ungleich höheren Grad an bewusster metasprachlicher Steuerung, doch die neuronale Rekonfiguration bleibt bis ins hohe Alter bemerkenswert adaptiv. Entscheidend ist hierbei die Intensität der immersiven Interaktion, nicht das biologische Lebensalter an sich.`,
          playCountMax: 2,
          questions: [
            {
              id: "de-c1-h1-q1",
              question: "Was zeigen neuere fMRT-Studien im Hinblick auf die 'kritische Periode'?",
              options: [
                "Dass Erwachsene keine Fremdsprachen mehr lernen können",
                "Dass neuronale Netzwerke auch im Erwachsenenalter adaptiv und plastisch bleiben",
                "Dass Grammatik nur vor dem 12. Lebensjahr erlernt werden kann",
              ],
              correctIndex: 1,
              explanation: "Der Dozent widerlegt die deterministische Sicht: 'die neuronale Rekonfiguration bleibt bis ins hohe Alter bemerkenswert adaptiv.'",
            },
          ],
        },
      ],
      schreiben: [
        {
          id: "de-c1-schreiben-1",
          part: 1,
          title: "Teil 1: Akademische Stellungnahme und Synthesebericht",
          targetWordCount: { min: 220, max: 280 },
          prompt: `Verfassen Sie eine fundierte wissenschaftliche Stellungnahme zum Thema "Wirtschaftswachstum versus ökologische Resilienz: Ist eine Postwachstumsökonomie realisierbar?".
- Analysieren Sie die inhärenten Widersprüche zwischen kontinuierlichem BIP-Wachstum und planetaren Belastungsgrenzen.
- Diskutieren Sie das Konzept der 'Entkopplung' (Decoupling) kritisch.
- Skizzieren Sie die sozioökonomischen Transformationskosten eines Systemwechsels.`,
          requiredPoints: [
            "Akademischer Sprachstil (Nominalstil, Partizipialkonstruktionen)",
            "Logisch stringente Gedankenführung",
            "Bezugnahme auf volkswirtschaftliche Paradigmen",
            "Nuancierte Schlussfolgerung",
          ],
          sampleSolution: `Die postindustrielle Wirtschaftsordnung gründet auf der Prämisse eines exponentiellen Wachstums. Angesichts der unübersehbaren Überschreitung planetarer Belastungsgrenzen bedarf dieses Paradigma jedoch einer grundlegenden Revision.
Verfechter des 'grünen Wachstums' postulieren eine Entkopplung von Ressourcenverbrauch und Wertschöpfung durch technologische Innovationen. Empirische Untersuchungen demonstrieren jedoch, dass dieser Effizienzgewinn regelmäßig durch sogenannte Rebound-Effekte zunichtegemacht wird. Eine absolute Reduktion des ökologischen Fußabdrucks lässt sich allein durch Effizienzsteigerungen mithin kaum bewerkstelligen.
Ein Paradigmenwechsel hin zur Postwachstumsökonomie (Degrowth) impliziert mithin tiefgreifende strukturelle Umbrüche. Dies erfordert nicht nur die Neudefinition von Wohlstandsindikatoren jenseits des Bruttoinlandsprodukts, sondern auch eine fundamentale Rekonfiguration der sozialen Sicherungssysteme.`,
          usefulPhrases: [
            "Es drängt sich der Eindruck auf, dass...",
            "Im Lichte dieser Erkenntnisse lässt sich konstatieren, dass...",
            "Dem ist entgegenzuhalten, dass...",
            "Dies fungiert gewissermaßen als Katalysator für...",
            "Es bedarf daher eines ganzheitlichen Ansatzes, welcher...",
          ],
        },
      ],
      sprechen: [
        {
          id: "de-c1-sprechen-1",
          part: 1,
          title: "Teil 1: Komplexer Fachvortrag & Debatte auf akademischem Niveau",
          durationMinutes: 7,
          instructions: "Halten Sie einen differenzierten Impulsvortrag zu einer anspruchsvollen gesellschaftlichen Kontroverse und leiten Sie anschließend die Diskussion mit Prüfungskommission und Partner.",
          prompts: ["Thesenanschlag", "Kritische Diskursanalyse", "Dialektische Synthese"],
          essentialRedemittel: [
            {
              category: "Akademische Rhetorik C1",
              phrases: [
                "Aus dieser Perspektive resultiert die Notwendigkeit...",
                "Man darf dieses Phänomen keineswegs isoliert betrachten...",
                "In diametralem Gegensatz hierzu steht die Auffassung...",
                "Die Quintessenz dieser Überlegung besteht darin, dass...",
              ],
            },
          ],
          evaluationCriteria: [
            "Stilistische Vielfalt und idiomatische Wendungen",
            "Reibungslose Sprachbeherrschung ohne Wortsuche",
            "Präzise Differenzierung feinster Bedeutungsnuancen",
          ],
        },
      ],
      matchingLesen: C1_MATCHING_LESEN,
      sprachbausteine: C1_SPRACHBAUSTEINE,
      trueFalseHoren: C1_TRUE_FALSE_HOREN,
      schreibenSimulation: C1_SCHREIBEN_SIMULATION,
      sprechenSimulation: C1_SPRECHEN_SIMULATION,
      wortschatz: [
        {
          id: "w-c1-1",
          term: "die Diskrepanz",
          article: "die",
          plural: "Diskrepanzen",
          translationFr: "la divergence / l'écart marqué",
          translationEn: "discrepancy",
          exampleSentence: "Zwischen Theorie und Praxis besteht oft eine erhebliche Diskrepanz.",
          exampleTranslation: "Entre la théorie et la pratique, il existe souvent une divergence considérable.",
          theme: "Akademischer Wortschatz",
        },
        {
          id: "w-c1-2",
          term: "implizieren",
          translationFr: "impliquer logiquement",
          translationEn: "to imply",
          exampleSentence: "Diese Entscheidung impliziert weitreichende Konsequenzen für die Forschung.",
          exampleTranslation: "Cette décision implique des conséquences de grande ampleur pour la recherche.",
          theme: "Wissenschaft & Logik",
        },
        {
          id: "w-c1-3",
          term: "adäquat",
          translationFr: "adéquat / approprié",
          translationEn: "adequate / appropriate",
          exampleSentence: "Wir müssen adäquate Lösungen für die aktuellen Krisen finden.",
          exampleTranslation: "Nous devons trouver des solutions adéquates aux crises actuelles.",
          theme: "Gehobener Sprachgebrauch",
        },
      ],
      wortschatzQuiz: [
        {
          id: "wq-c1-1",
          question: "Was bedeutet 'die Diskrepanz' im akademischen Kontext?",
          options: ["Une concordance parfaite", "Un écart ou désaccord marqué", "Une synthèse méthodologique"],
          correctIndex: 1,
          explanation: "Diskrepanz = décalage, écart marqué entre deux éléments.",
        },
      ],
    },
  },

  C2: {
    level: "C2",
    officialExamNameDe: "Goethe-Zertifikat C2: Großes Deutsches Sprachdiplom (GDS)",
    officialExamNameIt: "CILS Quattro (C2) / CELI 5",
    certifyingBodies: ["Goethe-Institut", "telc GmbH"],
    totalTimeMinutes: 240,
    passingScorePercent: 60,
    descriptionFr: "Maîtrise quasi-native : compréhension sans effort de tout ce qui est lu ou entendu, restitution de faits et d'arguments de diverses sources avec cohérence et nuances stylistiques fines.",
    descriptionEn: "Mastery / near-native: effortless understanding of virtually everything read or heard, summarizing information from diverse sources into coherent presentation.",
    lesenTimeMinutes: 80,
    horenTimeMinutes: 45,
    schreibenTimeMinutes: 80,
    sprechenTimeMinutes: 15,
    wortschatzEstimate: 12000,
    tasks: {
      lesen: [
        {
          id: "de-c2-lesen-1",
          part: 1,
          title: "Teil 1: Literaturkritik und philosophische Textanalyse",
          textType: "Feuilleton / Literaturtheorie",
          context: "Sie lesen eine Rezension in der 'Frankfurter Allgemeinen Zeitung'.",
          text: `DAS SCHWEIGEN ZWISCHEN DEN ZEILEN: ÜBER DIE ÄSTHETIK DES FRAGMENTARISCHEN
Im Zeitalter der allgegenwärtigen Informiertheit zelebriert der neue Roman von Elfriede Jelinek das kunstvolle Aussparen. Nicht das Gesagte bildet das Gravitationszentrum des Textes, sondern die beredte Lücke, das schmerzhafte Vakuum im Bewusstseinsstrom der Protagonistin.
Mit virtuoser sprachlicher Souveränität dekonstruiert die Autorin die Konventionen des psychologischen Realismus. Ihre Prosa oszilliert zwischen beißendem Sarkasmus und zärtlicher Melancholie, ohne je ins Sentimentale abzugleiten.
Es ist ein Text, der dem Rezipienten ein Höchstmaß an hermeneutischer Partizipation abverlangt: Man liest diesen Roman nicht zur Zerstreuung, sondern als existenzielle Herausforderung, die gewohnte Denkschablonen pulverisiert.`,
          questions: [
            {
              id: "de-c2-l1-q1",
              question: "Was ist das Hauptmerkmal des besprochenen Romans?",
              options: [
                "Eine lineare und leicht verständliche Handlung",
                "Das kunstvolle Aussparen und die Bedeutung der Leerstellen",
                "Eine übermäßig sentimentale Darstellung",
              ],
              correctIndex: 1,
              explanation: "Der Rezensent hebt hervor: 'Nicht das Gesagte bildet das Gravitationszentrum, sondern die beredte Lücke.'",
            },
          ],
        },
      ],
      horen: [
        {
          id: "de-c2-horen-1",
          part: 1,
          title: "Teil 1: Rundfunkgespräch mit einem Sprachphilosophen",
          audioScenario: "Deutschlandfunk Kultur: 'Sein und Streit'",
          transcript: `Moderator: Herzlich willkommen zu 'Sein und Streit'. Herr Professor Habermas, wie widerständig ist das gesprochene Wort noch im Zeitalter digitaler Sprachgenerierung?
Philosoph: Sehen Sie, die Aura des authentischen Diskurses lässt sich nicht durch statistische Wahrscheinlichkeiten simulieren. Was uns Menschen im Gespräch konstituiert, ist die wechselseitige Unterstellung von Wahrhaftigkeit und Zurechnungsfähigkeit. Ein KI-Modell formuliert syntaktisch makellos, aber es vermag keine Verantwortung für das Gesagte zu übernehmen. Es kennt kein Gewissen, keinen Scham, kein Erschrecken vor der eigenen Fehlbarkeit.`,
          playCountMax: 2,
          questions: [
            {
              id: "de-c2-h1-q1",
              question: "Was unterscheidet laut dem Philosophen menschliche Sprache prinzipiell von KI?",
              options: [
                "Grammatikalische Korrektheit",
                "Die ethische Verantwortungsübernahme und Wahrhaftigkeit",
                "Der Speicherplatz für Vokabeln",
              ],
              correctIndex: 1,
              explanation: "Der Philosoph betont: 'Was uns ausmacht, ist die Unterstellung von Wahrhaftigkeit... Ein KI-Modell vermag keine Verantwortung zu übernehmen.'",
            },
          ],
        },
      ],
      schreiben: [
        {
          id: "de-c2-schreiben-1",
          part: 1,
          title: "Teil 1: Feuilletonistischer Essay / Freie literarische Abhandlung",
          targetWordCount: { min: 300, max: 350 },
          prompt: `Schreiben Sie einen essayistischen Feuilletonbeitrag zu folgendem Aphorismus von Ludwig Wittgenstein:
"Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt."
- Beleuchten Sie die epistemologische Dimension dieser Aussage.
- Setzen Sie sich mit der Mehrsprachigkeit und interkulturellen Erfahrung auseinander.
- Formulieren Sie Ihren Beitrag mit hoher stilistischer Eleganz und rhetorischer Finesse.`,
          requiredPoints: [
            "Philosophische Tiefe",
            "Brillanter rhetorischer Aufbau",
            "Idiomatische Vollendung",
          ],
          sampleSolution: `Wer eine Sprache erlernt, erwirbt nicht bloß ein weiteres Etikettiersystem für vorgefundene Gegenstände; er öffnet vielmehr das Portal zu einem gänzlich neuen Denkraum. Wittgensteins berühmtes Diktum markiert keinen resignativen Befund, sondern ein emanzipatorisches Versprechen.
Indem wir unseren Wortschatz erweitern und uns den Nuancen fremder Syntax überantworten, verschieben sich die Grenzpfähle unseres Horizonts. Im Deutschen etwa erlaubt das Kompositum gedankliche Verdichtungen von unvergleichlicher Prägnanz, während andere Idiome emotionale Schattierungen erfassen, für die uns das Vokabular gebricht. Mehrsprachigkeit ist folglich kein bloßes Utensil globaler Mobilität, sondern eine existenzielle Bereicherung des menschlichen Bewusstseins.`,
          usefulPhrases: [
            "Es offenbart sich hierbei ein faszinierendes Paradoxon...",
            "Mit unnachahmlicher Prägnanz verdeutlicht...",
            "Dies ist gewissermaßen der Angelpunkt, an dem...",
            "In dieser Hinsicht erweist sich...",
          ],
        },
      ],
      sprechen: [
        {
          id: "de-c2-sprechen-1",
          part: 1,
          title: "Teil 1: Spontane Rede & philologische Disputation",
          durationMinutes: 8,
          instructions: "Halten Sie eine freie Rede zu einem unvorbereiteten Zitat oder Aphorismus und parieren Sie die Einwände der Prüfungskommission.",
          prompts: ["Freie Assoziation", "Rhetorische Figuren", "Spontane Eloquenz"],
          essentialRedemittel: [
            {
              category: "Stilistik C2",
              phrases: [
                "Es liegt mir fern zu behaupten, dass...",
                "Vielmehr drängt sich der Gedanke auf...",
                "Lassen Sie mich diesen Gedanken weiterspinnen...",
              ],
            },
          ],
          evaluationCriteria: [
            "Muttersprachliches Niveau bei Akzent und Idiomatik",
            "Souveräner Umgang mit rhetorischen Stilmitteln",
            "Schlagfertigkeit und geistreiche Argumentation",
          ],
        },
      ],
      wortschatz: [
        {
          id: "w-c2-1",
          term: "die Eloquenz",
          article: "die",
          translationFr: "l'éloquence",
          translationEn: "eloquence",
          exampleSentence: "Seine außergewöhnliche Eloquenz zog das gesamte Auditorium in ihren Bann.",
          exampleTranslation: "Son éloquence extraordinaire fascina tout l'auditoire.",
          theme: "Rhetorik & Stil",
        },
        {
          id: "w-c2-2",
          term: "subtil",
          translationFr: "subtil / délicat",
          translationEn: "subtle",
          exampleSentence: "Der Autor flicht subtile Ironie in seine Dialoge ein.",
          exampleTranslation: "L'auteur tisse une ironie subtile dans ses dialogues.",
          theme: "Nuancen & Kunst",
        },
        {
          id: "w-c2-3",
          term: "die Metamorphose",
          article: "die",
          plural: "Metamorphosen",
          translationFr: "la métamorphose",
          translationEn: "metamorphosis",
          exampleSentence: "Die Sprache befindet sich in einer permanenten Metamorphose.",
          exampleTranslation: "La langue se trouve dans une métamorphose permanente.",
          theme: "Philosophie & Wandel",
        },
      ],
      wortschatzQuiz: [
        {
          id: "wq-c2-1",
          question: "Was bedeutet 'Eloquenz'?",
          options: ["La lenteur d'esprit", "La grande facilité d'expression et l'art de bien parler", "L'ambiguïté délibérée"],
          correctIndex: 1,
          explanation: "Eloquenz = Sprachgewandtheit, Redekunst.",
        },
      ],
    },
  },
};
