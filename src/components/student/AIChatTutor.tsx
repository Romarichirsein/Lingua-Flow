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
  Shuffle,
  Briefcase,
  Home,
  Train,
  HeartPulse,
  Landmark,
  Target,
  Wrench,
  Globe,
  Theater,
  HelpCircle,
  BookOpen,
} from "lucide-react";

interface AIChatTutorProps {
  student: Student;
  school: School;
  locale: UILocale;
}

interface GermanTopicDef {
  id: string;
  nameDe: string;
  nameFr: string;
  nameEn: string;
  icon: React.ReactNode;
  description: string;
  sampleStarter: Record<CEFRLevel, string>;
  suggestions: Record<CEFRLevel, string[]>;
}

const GERMAN_TOPICS: GermanTopicDef[] = [
  {
    id: "beruf",
    nameDe: "Beruf, Karriere & Bewerbung",
    nameFr: "Emploi, Carrière & Entretiens",
    nameEn: "Jobs, Career & Interviews",
    icon: <Briefcase size={15} className="text-amber-500" />,
    description: "Vorstellungsgespräch, Büroalltag, E-Mails, Gehaltsverhandlung & Networking in DACH",
    sampleStarter: {
      A1: "Guten Tag! Ich bin der Personalleiter. Wie heißen Sie und welchen Beruf haben Sie?",
      A2: "Willkommen zum Vorstellungsgespräch! Erzählen Sie mir: Welche Aufgaben haben Sie in Ihrem letzten Beruf gemacht?",
      B1: "Guten Tag! Schön, dass Sie da sind. Warum möchten Sie genau in unserem Unternehmen in Deutschland arbeiten?",
      B2: "Guten Tag! Vielen Dank für Ihre Bewerbung. Welche Ihrer beruflichen Erfahrungen und Stärken befähigen Sie besonders für diese anspruchsvolle Position?",
      C1: "Herzlich willkommen zum strategischen Fachgespräch. Wie beurteilen Sie die Marktchancen unserer Branche im DACH-Raum und welche Führungsphilosophie vertreten Sie?",
      C2: "Guten Tag. Vor dem Hintergrund der aktuellen wirtschaftlichen Transformation: Mit welcher strategischen Roadmap würden Sie unsere Organisationsstruktur neu ausrichten?",
    },
    suggestions: {
      A1: [
        "Ich heiße Alex und arbeite als IT-Spezialist.",
        "Ich suche eine Vollzeitstelle in München.",
        "Hier ist mein Lebenslauf.",
        "Welche Arbeitszeiten haben Sie?",
      ],
      A2: [
        "In meiner früheren Firma habe ich Projekte koordiniert.",
        "Ich möchte mein Deutsch im Beruf verbessern.",
        "Können Sie mir mehr über das Team erzählen?",
        "Ich kann ab dem 1. nächsten Monat anfangen.",
      ],
      B1: [
        "Ich habe drei Jahre Erfahrung im Projektmanagement gesammelt.",
        "Meine größte Stärke ist lösungsorientiertes Arbeiten im Team.",
        "Wie sehen die Weiterbildungsmöglichkeiten in Ihrem Unternehmen aus?",
        "Ich interessiere mich besonders für internationale Projekte.",
      ],
      B2: [
        "In meiner bisherigen Laufbahn habe ich agile Methoden erfolgreich etabliert.",
        "Ich bin es gewohnt, eigenverantwortlich unter hohem Termindruck zu agieren.",
        "Welche quantitativen Zielvorgaben sind für die ersten sechs Monate definiert?",
        "Lassen Sie uns über die Gehaltsstruktur und variable Vergütungsmodelle sprechen.",
      ],
      C1: [
        "Ich verfolge einen partizipativen Führungsansatz mit klarer Ergebnisfokussierung.",
        "Angesichts der Marktvolatilität halte ich eine Diversifizierung der Wertschöpfungskette für unabdingbar.",
        "Wie positioniert sich Ihr Haus hinsichtlich der digitalen Souveränität?",
        "Ich bringe ein belastbares Netzwerk und tiefgreifende Branchenexpertise mit.",
      ],
      C2: [
        "Eine nachhaltige Neuausrichtung erfordert synergetische Restrukturierungsmaßnahmen.",
        "Ich plädiere für ein adaptives Governance-Modell mit hoher Reaktionselastizität.",
        "Lassen Sie uns die Schnittstellen zwischen Compliance, Agilität und Skalierbarkeit beleuchten.",
        "Gerade im DACH-Raum ist kulturelle Passung der Hebel für nachhaltige Wertschöpfung.",
      ],
    },
  },
  {
    id: "alltag",
    nameDe: "Alltag, Wohnen & Stadtleben",
    nameFr: "Quotidien, Logement & Ville",
    nameEn: "Daily Life, Housing & City",
    icon: <Home size={15} className="text-emerald-500" />,
    description: "Wohnungssuche, WG-Zimmer, Einkaufen, Nachbarschaft & Dienstleistungen",
    sampleStarter: {
      A1: "Hallo! Ich bin der Vermieter. Suchen Sie eine Wohnung in der Stadt? Wie viele Zimmer möchten Sie?",
      A2: "Hallo! Ich habe Ihre Nachricht wegen des WG-Zimmers gelesen. Wie sieht Ihr typischer Tagesablauf aus?",
      B1: "Hallo! Schön, dass du zum WG-Casting kommst. Wie stellst du dir das Zusammenleben und den Putzplan bei uns vor?",
      B2: "Guten Tag! Ich zeige Ihnen heute die Mietwohnung. Achten Sie auf die Nebenkostenabrechnung und die Hausordnung. Haben Sie Fragen zum Mietvertrag?",
      C1: "Guten Tag. Angesichts der anhaltenden Wohnraumknappheit in deutschen Ballungsräumen: Welche Kriterien priorisieren Sie bei der Standort- und Vertragsauswahl?",
      C2: "Willkommen. Die Debatte um Mietpreisbremsen und gentrifizierungsbedingte Verdrängungseffekte prägt die Metropolen. Wie bewerten Sie diese soziokulturelle Dynamik?",
    },
    suggestions: {
      A1: [
        "Ich suche eine Ein-Zimmer-Wohnung mit Küche.",
        "Wie hoch ist die Warmmiete pro Monat?",
        "Gibt es einen Supermarkt in der Nähe?",
        "Ist die Kaution drei Monatsmieten?",
      ],
      A2: [
        "Ich koche sehr gerne und bin ein ordentlicher Mitbewohner.",
        "Gibt es eine Waschmaschine im Keller?",
        "Ich hätte gerne einen Termin für eine Wohnungsbesichtigung.",
        "Darf man in der Wohnung Haustiere halten?",
      ],
      B1: [
        "Ich finde eine offene und rücksichtsvolle Kommunikation in einer WG besonders wichtig.",
        "Wie hoch sind die durchschnittlichen Heiz- und Stromkosten im Winter?",
        "Ich bringe eine Schufa-Auskunft und eine Mietschuldenfreiheitsbescheinigung mit.",
        "Gibt es einen Fahrradkeller oder einen Stellplatz im Innenhof?",
      ],
      B2: [
        "Ich habe die Mietvertragsklauseln bezüglich Schönheitsreparaturen geprüft.",
        "Welche Richtlinien gelten im Haus bezüglich Mülltrennung und Ruhezeiten?",
        "Wäre eine Staffelmiete oder eine Indexmiete vertraglich vorgesehen?",
        "Die Anbindung an den ÖPNV ist für mein Pendeln nach Frankfurt ideal.",
      ],
      C1: [
        "Die Verdrängung alteingesessener Mieter durch Luxussanierungen halte ich für hochproblematisch.",
        "Könnten Sie mir die energetischen Kennwerte aus dem Energieausweis erläutern?",
        "Die urbane Lebensqualität bemisst sich maßgeblich an Grünflächen und sozialer Durchmischung.",
        "Welche bau- und mietrechtlichen Sonderbestimmungen greifen in diesem Altbauviertel?",
      ],
      C2: [
        "Urbanistische Konzepte wie die 15-Minuten-Stadt bergen erhebliches Potenzial zur Revitalisierung.",
        "Wir sollten die Diskrepanz zwischen spekulativem Leerstand und sozialem Wohnbau beleuchten.",
        "Die architektonische Transformation spiegelt sozioökonomische Segregationsprozesse wider.",
        "Mietpreisregulierungen bleiben wirkungslos ohne parallele offensive Neubauförderung.",
      ],
    },
  },
  {
    id: "reisen",
    nameDe: "Reise, Mobilität & Deutsche Bahn",
    nameFr: "Voyage, Mobilité & Train (DB)",
    nameEn: "Travel, Mobility & Trains",
    icon: <Train size={15} className="text-blue-500" />,
    description: "Bahnhof, Ticketbuchung, Verspätungen, Hotel & Entdeckungen in Deutschland, Österreich, Schweiz",
    sampleStarter: {
      A1: "Guten Tag am DB-Schalter. Wohin möchten Sie fahren: nach Berlin, München oder Hamburg?",
      A2: "Guten Tag! Der ICE nach Köln hat 25 Minuten Verspätung. Möchten Sie die Verbindung wechseln oder einen Sitzplatz reservieren?",
      B1: "Hallo! Willkommen im Reisezentrum. Möchten Sie das Deutschlandticket nutzen oder ein Sparpreis-Ticket für den Fernverkehr buchen?",
      B2: "Guten Tag. Ihr Anschlusszug in Frankfurt fällt witterungsbedingt aus. Welche alternativen Fahrtrouten oder Fahrgastrechte möchten Sie in Anspruch nehmen?",
      C1: "Guten Tag. Die Debatte um die Verkehrswende und die Sanierung des deutschen Schienennetzes ist allgegenwärtig. Welche Strategien halten Sie für zukunftsfähig?",
      C2: "Willkommen. Infrastrukturelle Engpässe und intermodale Vernetzung stellen die DACH-Region vor gigantische Herausforderungen. Worin sehen Sie den Königsweg?",
    },
    suggestions: {
      A1: [
        "Eine Fahrkarte nach München, bitte, einfache Fahrt.",
        "Von welchem Gleis fährt der Zug ab?",
        "Gibt es im Zug WLAN und ein Bistro?",
        "Wann kommt der nächste Zug an?",
      ],
      A2: [
        "Ich habe meinen Anschlusszug wegen Verspätung verpasst.",
        "Kann ich mit diesem Ticket auch den Nahverkehr nutzen?",
        "Gilt die Zugbindung noch bei dieser Verspätung?",
        "Ich möchte ein Doppelzimmer mit Frühstück reservieren.",
      ],
      B1: [
        "Steht mir nach den Fahrgastrechten eine Entschädigung von 25 % zu?",
        "Können Sie mir eine alternative Reiseroute ohne Umstieg heraussuchen?",
        "Ich reise mit einem Fahrrad, brauche ich eine gesonderte Stellplatzreservierung?",
        "Lohnt sich für mich die BahnCard 25 oder 50 bei regelmäßigen Fahrten?",
      ],
      B2: [
        "Da die Verspätung am Zielort über 60 Minuten beträgt, mache ich mein Recht auf Erstattung geltend.",
        "Wie verhält es sich mit der Aufhebung der Zugbindung bei Teilstreckenausfällen?",
        "Ich bevorzuge das Deutschlandticket für urbane Strecken, kombiniert mit Fernverkehr-Sparpreisen.",
        "Könnten Sie mir eine schriftliche Verspätungsbestätigung für meinen Arbeitgeber ausstellen?",
      ],
      C1: [
        "Das Schienennetz leidet unter jahrzehntelangem Investitionsstau auf den Hauptkorridoren.",
        "Eine ganzheitliche Verkehrswende erfordert drastische Umschichtungen zugunsten der Schiene.",
        "Wie beurteilen Sie die Trennung von Netz und Betrieb im europäischen Eisenbahnrecht?",
        "Die Zuverlässigkeit der DB ist zu einem Standortfaktor für den Wirtschaftsstandort geworden.",
      ],
      C2: [
        "Intermodale Mobilitätsknotenpunkte sind der Dreh- und Angelpunkt moderner Raumplanung.",
        "Die Diskrepanz zwischen politischer Rhetorik und haushaltspolitischer Realität bleibt frappierend.",
        "Transeuropäische Netze erfordern eine Harmonisierung der Leit- und Sicherungstechnik.",
        "Mobilität als Grundbedürfnis muss ökologisch verträglich und sozial inklusiv tariert werden.",
      ],
    },
  },
  {
    id: "gesundheit",
    nameDe: "Gesundheit & Beim Arzt",
    nameFr: "Santé, Médecin & Pharmacie",
    nameEn: "Health, Doctor & Pharmacy",
    icon: <HeartPulse size={15} className="text-rose-500" />,
    description: "Symptome schildern, Apotheke, Notaufnahme, Krankmeldung (AU) & Krankenkasse",
    sampleStarter: {
      A1: "Guten Tag in der Arztpraxis. Was tut Ihnen weh: der Kopf, der Hals oder der Bauch?",
      A2: "Guten Tag! Ich bin Dr. Schmidt. Seit wann haben Sie diese Beschwerden und haben Sie Fieber gemessen?",
      B1: "Guten Tag. Bitte nehmen Sie Platz. Schildern Sie mir Ihre Symptome genau: Nehmen Sie bereits Medikamente ein und brauchen Sie eine Arbeitsunfähigkeitsbescheinigung?",
      B2: "Guten Tag. Nach der Untersuchung stelle ich eine Reizung der oberen Atemwege fest. Lassen Sie uns über die Medikation, mögliche Nebenwirkungen und die Krankschreibung sprechen.",
      C1: "Guten Tag. Lassen Sie uns die Anamnese vertiefen. Treten die Beschwerden psychosomatisch getriggert oder unter spezifischer physischer Belastung auf?",
      C2: "Willkommen. Vor dem Hintergrund der ganzheitlichen Diagnostik: Welche Differenzialdiagnosen sollten wir labortechnisch und apparativ ausschließen?",
    },
    suggestions: {
      A1: [
        "Ich habe starke Kopfschmerzen und Fieber.",
        "Ich brauche Schmerztabletten aus der Apotheke.",
        "Mein Hals tut weh beim Schlucken.",
        "Brauche ich für diese Medizin ein Rezept?",
      ],
      A2: [
        "Seit gestern Abend habe ich Husten und Schnupfen.",
        "Ich brauche eine Krankschreibung für meinen Arbeitgeber.",
        "Wie oft am Tag soll ich diese Tropfen einnehmen?",
        "Ich habe eine Allergie gegen Penicillin.",
      ],
      B1: [
        "Die Schmerzen strahlen in den Rücken und die Schulter aus.",
        "Gibt es bei diesem Antibiotikum bekannte Wechselwirkungen mit anderen Mitteln?",
        "Können Sie die elektronische Arbeitsunfähigkeitsbescheinigung direkt übermitteln?",
        "Ich fühle mich seit einer Woche chronisch erschöpft und appetitlos.",
      ],
      B2: [
        "Ich vermute eine pollenassoziierte Kreuzallergie mit bestimmten Nahrungsmitteln.",
        "Wäre eine Überweisung zum Facharzt für Kardiologie ratsam?",
        "Übernimmt die gesetzliche Krankenkasse die Kosten für diese Therapieform?",
        "Ich bevorzuge vorerst eine konservative Therapie ohne operative Eingriffe.",
      ],
      C1: [
        "Die Symptomatik deutet auf eine vegetative Dystonie infolge chronischer Überlastung hin.",
        "Welche evidenzbasierten Studien stützen den präventiven Einsatz dieses Präparats?",
        "Ich bitte um eine detaillierte Erläuterung des Nutzen-Risiko-Profils der Medikation.",
        "Inwiefern spielen psychosoziale Determinanten in dieses Krankheitsbild hinein?",
      ],
      C2: [
        "Eine multimodale Schmerztherapie scheint angesichts der Chronifizierung indiziert.",
        "Die pharmakokinetischen Besonderheiten erfordern eine engmaschige Spiegelbestimmung.",
        "Wir sollten die psychosomatische Komponente im biopsychosozialen Modell würdigen.",
        "Präventionsmedizinische Ansätze müssen kurative Interventionen sinnvoll flankieren.",
      ],
    },
  },
  {
    id: "behoerden",
    nameDe: "Bürgeramt, Behörden & Formalitäten",
    nameFr: "Administration & Démarches",
    nameEn: "Civic Office & Bureaucracy",
    icon: <Landmark size={15} className="text-purple-500" />,
    description: "Wohnsitzanmeldung, Ausländerbehörde, Steuer-ID, Rundfunkbeitrag & Anträge",
    sampleStarter: {
      A1: "Guten Tag im Bürgeramt. Haben Sie einen Termin und Ihren Reisepass dabei?",
      A2: "Guten Tag! Sie möchten Ihren Wohnsitz anmelden. Haben Sie die Wohnungsgeberbestätigung Ihres Vermieters ausgefüllt?",
      B1: "Guten Tag. Ich bin der Sachbearbeiter im Bürgeramt. Für welches Anliegen sind Sie heute da: Anmeldung, Führerscheinumtausch oder Steueridentifikationsnummer?",
      B2: "Guten Tag. Wir prüfen Ihren Antrag auf Erteilung des Aufenthaltstitels. Es fehlen noch der Arbeitsvertrag und die Gehaltsabrechnungen der letzten drei Monate. Wie ist Ihr Status?",
      C1: "Guten Tag. Die deutsche Verwaltungstransformation hin zum Online-Zugangsgesetz verläuft schleppend. Welche verwaltungsrechtlichen Hürden sehen Sie im Alltag?",
      C2: "Willkommen. Föderalismus und kommunale Selbstverwaltung bedingen komplexe bürokratische Geflechte. Wie bewerten Sie das Verhältnis von Bürgernähe und Effizienz?",
    },
    suggestions: {
      A1: [
        "Ich möchte meinen Wohnsitz in der Stadt anmelden.",
        "Hier ist mein Reisepass und mein Mietvertrag.",
        "Wo bekomme ich meine deutsche Steuer-ID?",
        "Wie viel kostet die Bearbeitungsgebühr?",
      ],
      A2: [
        "Ich habe die Wohnungsgeberbestätigung unterschrieben mitgebracht.",
        "Muss ich mich auch für den Rundfunkbeitrag (GEZ) anmelden?",
        "Wie lange dauert die Bearbeitung meines Antrags?",
        "Ich brauche eine amtliche Meldebestätigung.",
      ],
      B1: [
        "Ich habe alle Unterlagen zur Verlängerung meines Aufenthaltstitels vollständig beisammen.",
        "Gibt es eine Übergangsbescheinigung (Fiktionsbescheinigung), falls die Karte noch dauert?",
        "Welche Fristen muss ich für die steuerliche Veranlagung einhalten?",
        "Ich möchte meinen ausländischen Führerschein in einen deutschen EU-Führerschein umschreiben.",
      ],
      B2: [
        "Ich erfülle alle Voraussetzungen der Fachkräfteeinwanderung nach dem Aufenthaltsgesetz.",
        "Welche Rechtsmittel stehen mir im Falle eines ablehnenden Bescheids offen?",
        "Können Sie mir das genaue Widerspruchsverfahren und die Fristen darlegen?",
        "Ich strebe die Niederlassungserlaubnis nach 24 Monaten qualifizierter Beschäftigung an.",
      ],
      C1: [
        "Die zersplitterte Zuständigkeit zwischen Bund, Ländern und Kommunen bremst die Digitalisierung.",
        "Der administrative Aufwand für ausländische Fachkräfte konterkariert den Zuzugswillen.",
        "Wie beurteilen Sie die verfassungsrechtlichen Grenzen hoheitlicher Ermessensentscheidungen?",
        "Bürokratieabbau erfordert schlankere Verwaltungsverfahren und gegenseitige Datenvernetzung.",
      ],
      C2: [
        "Das Prinzip der Gesetzmäßigkeit der Verwaltung darf nicht in Paragrafenstarre erstarren.",
        "Interoperable Register und das Once-Only-Prinzip sind conditio sine qua non moderner Staatlichkeit.",
        "Verwaltungsakte bedürfen transparenter Begründungspflichten zur Wahrung des Rechtsfriedens.",
        "Die Balance zwischen Datenschutzakribie und pragmatischer Amtshilfe muss neu austariert werden.",
      ],
    },
  },
  {
    id: "prufung",
    nameDe: "Goethe / TELC / TestDaF Prüfungstraining",
    nameFr: "Entraînement Examens (Goethe / TELC)",
    nameEn: "Exam Prep (Goethe / TELC / TestDaF)",
    icon: <Target size={15} className="text-cyan-500" />,
    description: "Mündliche Prüfung (Sprechen Teil 1, 2, 3), Bildbeschreibung, Vortrag & Diskussion",
    sampleStarter: {
      A1: "Prüfungssimulation Goethe A1 Sprechen: Bitte stellen Sie sich kurz vor (Name, Alter, Land, Beruf, Hobbys).",
      A2: "Prüfungssimulation A2: Sprechen Teil 2. Bitte erzählen Sie von einem Erlebnis aus Ihrem Alltag. Was ist passiert?",
      B1: "Prüfungssimulation Goethe/TELC B1: Präsentation und Diskussion. Wählen Sie ein Thema, präsentieren Sie Vor- und Nachteile und schildern Sie Ihre persönlichen Erfahrungen.",
      B2: "Prüfungssimulation B2: Halten Sie einen 3-minütigen Kurzvortrag zu einem kontroversen Thema. Danach werde ich Ihnen kritische Nachfragen stellen und ein Gegenargument formulieren.",
      C1: "Prüfungssimulation Goethe C1: Freier Vortrag zu komplexen Fragestellungen mit syntaktischer Vielfalt, gefolgt von einer akademischen Diskussion. Welches Thema wählen Sie?",
      C2: "Simulation Großes Deutsches Sprachdiplom (C2): Exzellente rhetorische Rede mit nuanciertem Vokabular und spontaner Replik auf konträre Thesen.",
    },
    suggestions: {
      A1: [
        "Ich heiße Alex, bin 28 Jahre alt und wohne in Lyon. In meiner Freizeit lese ich gern.",
        "Buchstabieren Sie bitte Ihren Nachnamen.",
        "Können Sie bitte eine Frage mit 'Wann' und 'Wo' stellen?",
        "Wie frage ich nach dem Weg in der Prüfung?",
      ],
      A2: [
        "Letztes Wochenende habe ich mit Freunden einen Ausflug an den See gemacht.",
        "Wir haben gepicknickt und sind geschwommen, weil das Wetter herrlich war.",
        "Auf dem Foto sehe ich zwei Personen in einem Supermarkt.",
        "Können wir einen gemeinsamen Termin am Samstag planen?",
      ],
      B1: [
        "Ich möchte heute über das Thema 'Sollten Schüler Smartphones im Unterricht nutzen?' sprechen.",
        "Meine Präsentation gliedert sich in vier Teile: persönliche Erfahrungen, Situation im Heimatland, Vor- und Nachteile, Fazit.",
        "Ein wesentlicher Vorteil ist der sofortige Zugriff auf digitale Wörterbücher.",
        "Allerdings besteht die Gefahr, dass Schüler vom Unterricht abgelenkt werden.",
      ],
      B2: [
        "Ich vertrete die These, dass die Vier-Tage-Woche die Produktivität signifikant steigern kann.",
        "Einerseits sinkt das Stressniveau, andererseits muss das Arbeitsvolumen komprimiert werden.",
        "Zusammenfassend lässt sich konstatieren, dass Flexibilität der entscheidende Schlüssel ist.",
        "Ich stimme Ihrem Einwand teilweise zu, dennoch zeigen Pilotstudien eindeutig positive Effekte.",
      ],
      C1: [
        "In meinem Vortrag werde ich die Ambivalenz des technologischen Determinismus beleuchten.",
        "Es gilt, die dialektische Spannung zwischen Innovationsdruck und ethischen Leitplanken herauszuarbeiten.",
        "Ich weise die Prämisse zurück, dass Digitalisierung per se zu Entfremdung führt.",
        "Gestatten Sie mir, diesen Gedanken anhand dreier empirischer Befunde zu untermauern.",
      ],
      C2: [
        "Die teleologische Ausrichtung dieser Argumentation greift meines Erachtens zu kurz.",
        "Wir müssen die semantische Aufladung des Diskurses kritisch dekonstruieren.",
        "Eine apodiktische Haltung verstellt den Blick auf intermediäre Lösungsansätze.",
        "Rhetorisch wie substanziell offenbart sich hier eine fundamentale Antinomie.",
      ],
    },
  },
  {
    id: "grammatik",
    nameDe: "Grammatik-Labor & Satzbau-Coach",
    nameFr: "Laboratoire de Grammaire & Syntaxe",
    nameEn: "Grammar & Syntax Coach",
    icon: <Wrench size={15} className="text-orange-500" />,
    description: "Kasus (Akkusativ/Dativ/Genitiv), Verben mit festen Präpositionen, Konjunktiv II, Passiv & Nebensätze",
    sampleStarter: {
      A1: "Willkommen im Grammatik-Labor! Heute üben wir die Verbstellung: Im deutschen Aussagesatz steht das konjugierte Verb IMMER an Position 2. Bilden Sie einen Satz mit: (morgen / ich / nach Berlin / fahren).",
      A2: "Heute trainieren wir Wechselpräpositionen (an, auf, in, über, unter, vor, hinter, neben, zwischen): Wohin (Akkusativ) vs. Wo (Dativ). Stellen Sie die Frage oder korrigieren Sie einen Satz!",
      B1: "Fokus heute: Zweiteilige Konnektoren (sowohl ... als auch, weder ... noch, nicht nur ... sondern auch) und Verben mit festen Präpositionen. Welches Thema möchten Sie analysieren?",
      B2: "Schwerpunkt: Konjunktiv II für irreale Bedingungen ('Wenn ich Zeit hätte, würde ich...') und Passiversatzformen (sein + zu + Infinitiv, -bar, sich lassen). Welchen Satz sollen wir umformen?",
      C1: "Syntaktische Meisterklasse: Partizipialattribute, Nominalstil vs. Verbalstil und komplexe Satzgefüge mit Modalfaktoren. Welches grammatische Phänomen untersuchen wir?",
      C2: "Philologische Feinheiten: Modale Infinitive, Konjunktiv I in der indirekten Rede mit Ersatzformen und stilistische Elegien deutscher Syntax.",
    },
    suggestions: {
      A1: [
        "Morgen fahre ich mit dem Zug nach Berlin.",
        "Erkläre mir den Unterschied zwischen 'der', 'die' und 'das'.",
        "Wann benutzt man den Akkusativ im Deutschen?",
        "Wie bildet man Fragen mit W-Wörtern?",
      ],
      A2: [
        "Ich lege das Buch auf den Tisch (Wohin? Akkusativ).",
        "Das Buch liegt auf dem Tisch (Wo? Dativ).",
        "Erkläre mir den Unterschied zwischen 'Perfekt' und 'Präteritum'.",
        "Wie bildet man Nebensätze mit 'weil' und 'dass'?",
      ],
      B1: [
        "Ich interessiere mich für moderne Architektur (sich interessieren für + Akk).",
        "Wie unterscheidet sich 'obwohl' von 'trotzdem' im Satzbau?",
        "Erkläre mir die Bildung des Konjunktiv II mit 'hätte' und 'wäre'.",
        "Wann benutzt man das Vorgangspassiv mit 'werden'?",
      ],
      B2: [
        "Forme diesen Satz in ein Partizipialattribut um: 'Die Maßnahme, die gestern beschlossen wurde...'",
        "Welche Präposition gehört zu diesen Verben: abhängen, zweifeln, hinweisen, beitragen?",
        "Wie verwandle ich diesen Nominalstil-Satz in einen lebendigen Verbalstil?",
        "Erkläre mir die Nuancen von 'brauchen + zu + Infinitiv' im Verneinungsfall.",
      ],
      C1: [
        "Lass uns komplexe erweiterte Partizipien deklinieren und auflösen.",
        "Welche feinen Bedeutungsunterschiede existieren zwischen 'scheinen zu', 'pflegen zu' und 'drohen zu'?",
        "Wie funktioniert die korrekte Redewiedergabe im Konjunktiv I bei Gleichheit mit dem Indikativ?",
        "Analysiere die Informationsdichte im deutschen Schachtelsatz.",
      ],
      C2: [
        "Erörtere die Funktionsverbgefüge im Vergleich zu ihren simplen Basisverben.",
        "Welche syntaktischen Ausklammerungen (Ausklammerung ins Nachfeld) sind stilistisch statthaft?",
        "Lassen sich Doppelinfinitiv-Konstruktionen im Perfekt historisch-linguistisch begründen?",
        "Stilistische Dekonstruktion überbordender Nominalkomposita.",
      ],
    },
  },
  {
    id: "kultur",
    nameDe: "Kultur, Landeskunde & Mentalität",
    nameFr: "Culture, Régions & Mentalités",
    nameEn: "Culture, Regions & Customs",
    icon: <Globe size={15} className="text-teal-500" />,
    description: "Traditionen, 16 Bundesländer, deutsche Feiertage, Bräuche, Küche & Knigge-Etikette",
    sampleStarter: {
      A1: "Willkommen zur deutschen Landeskunde! Deutschland hat 16 Bundesländer und Berlin ist die Hauptstadt. Was essen Sie gerne aus Deutschland: Brezel, Bratwurst oder Apfelkuchen?",
      A2: "In Deutschland trennt man den Müll sehr genau und Pünktlichkeit ist wichtig. Wie ist das in Ihrem Heimatland?",
      B1: "Hallo! Sprechen wir über Bräuche in Deutschland: Karneval im Rheinland, das Oktoberfest in München oder Ostern und Weihnachten. Welches Fest interessiert dich am meisten?",
      B2: "Guten Tag! Diskutieren wir über kulturelle Unterschiede im Alltag und Berufsleben: Direkte Kommunikation ('Klartext'), Trennung von Beruflichem und Privatem, sowie Vereinskultur. Was überrascht Sie?",
      C1: "Herzlich willkommen. Die historische Zerrissenheit und der Föderalismus prägen das deutsche Regionalbewusstsein bis heute. Welche soziokulturellen Facetten möchten Sie analysieren?",
      C2: "Die deutsche Geistesgeschichte zwischen Aufklärung, Romantik und den Brüchen des 20. Jahrhunderts: Welche Einflüsse spiegeln sich in der heutigen Identitätsdebatte wider?",
    },
    suggestions: {
      A1: [
        "Ich liebe deutsche Brezeln und Apfelschorle.",
        "Welche Bundesländer liegen im Süden von Deutschland?",
        "Was feiert man am 3. Oktober in Deutschland?",
        "Warum ist Pünktlichkeit in Deutschland so wichtig?",
      ],
      A2: [
        "In meiner Kultur begrüßt man sich mit Küsschen, in Deutschland gibt man die Hand.",
        "Erzähle mir vom Karneval in Köln und Mainz.",
        "Was ist die Bedeutung des Sonntags als Ruhetag in Deutschland?",
        "Welche typischen Gerichte isst man in Österreich und der Schweiz?",
      ],
      B1: [
        "Deutsche Kollegen kommunizieren im Beruf sehr sachorientiert und direkt.",
        "Wie funktioniert die Vereinsmeierei (Vereine für Sport, Musik, Garten) in Deutschland?",
        "Was ist der Unterschied zwischen Grünkohlessen im Norden und Brotzeit im Süden?",
        "Welche Feiertage sind in allen Bundesländern gesetzlich frei?",
      ],
      B2: [
        "Die 'Feierabendkultur' und die strikte Trennung von Privatem und Beruflichem ist bemerkenswert.",
        "Wie hat die Wiedervereinigung die regionale Identität in Ost- und Westdeutschland geprägt?",
        "Welche ungeschriebenen Gesetze gelten bei Einladungen zu deutschen Gastgebern?",
        "Diskutieren wir über das deutsche Sparbewusstsein und das Phänomen der 'German Angst'.",
      ],
      C1: [
        "Die föderale Bildungs- und Kulturhoheit erzeugt Vielfalt, aber auch institutionelle Reibungsverluste.",
        "Inwiefern speist sich das deutsche Umweltbewusstsein aus der Romantik und der Waldliebe?",
        "Die Konsensdemokratie prägt das politische Verhalten grundlegend.",
        "Welche Wandlungen durchläuft das deutsche Staatsbürgerschaftsverständnis aktuell?",
      ],
      C2: [
        "Das Spannungsverhältnis zwischen kosmopolitischer Offenheit und provinzieller Beharrlichkeit.",
        "Die Rezeption der Frankfurter Schule im soziologischen Diskurs der Bundesrepublik.",
        "Erinnerungskultur als Identitätsfundament der Berliner Republik.",
        "Sprachliche Reflexionen deutscher Denkfiguren von Kant bis Habermas.",
      ],
    },
  },
  {
    id: "debatten",
    nameDe: "Aktuelle Debatten, KI & Zukunft",
    nameFr: "Débats d'Actualité, IA & Société",
    nameEn: "Current Debates, AI & Society",
    icon: <Sparkles size={15} className="text-yellow-500" />,
    description: "Künstliche Intelligenz, Klimaschutz, Energiewende, Arbeit der Zukunft & Digitalisierung in DACH",
    sampleStarter: {
      A1: "Hallo! Nutzen Sie Computer und Smartphones für Ihre Arbeit? Was gefällt Ihnen am Internet?",
      A2: "Nutzen Sie künstliche Intelligenz beim Sprachenlernen? Finden Sie das nützlich oder schwierig?",
      B1: "Guten Tag! Diskutieren wir über die Zukunft: Glauben Sie, dass künstliche Intelligenz viele Berufe verändern oder ersetzen wird?",
      B2: "Guten Tag! Die Debatte um die Energiewende und den Ausstieg aus fossilen Energieträgern bewegt Deutschland. Welche Vor- und Nachteile sehen Sie bei erneuerbaren Energien?",
      C1: "Willkommen im Debattierclub. Wie balancieren wir technologische Innovationskraft, Datenschutz (DSGVO) und ethische Leitplanken beim Einsatz autonomer Systeme aus?",
      C2: "Begrüßung zur philosophisch-politischen Kontroverse: Führt der technologische Transhumanismus zu einer Neudefinition des anthropologischen Selbstverständnisses?",
    },
    suggestions: {
      A1: [
        "Ich lerne Deutsch mit meinem Computer und Apps.",
        "Technologie hilft mir beim Übersetzen von Texten.",
        "Ich arbeite jeden Tag online.",
        "Was denkst du über moderne Handys?",
      ],
      A2: [
        "Ich mache mir Sorgen um meine persönlichen Daten im Internet.",
        "Künstliche Intelligenz kann beim Vokabellernen sehr helfen.",
        "Homeoffice spart Zeit beim Pendeln.",
        "Welche neuen Technologien findest du am besten?",
      ],
      B1: [
        "Einerseits steigert KI die Effizienz, andererseits gehen Routinejobs verloren.",
        "Deutschland setzt stark auf Solar- und Windenergie, aber der Netzausbau hinkt hinterher.",
        "Sollte die Nutzung von Smartphones an Schulen gesetzlich verboten werden?",
        "Wie verändert flexibles Arbeiten das soziale Miteinander im Team?",
      ],
      B2: [
        "Datenschutz wird in Deutschland oft als Innovationsbremse kritisiert, schützt aber Bürgerrechte.",
        "Die Transformation der Automobilindustrie zur Elektromobilität ist eine Zerreißprobe für den Mittelstand.",
        "Brauchen wir eine Kennzeichnungspflicht für KI-generierte Medien und Texte?",
        "Welche ökonomischen Instrumente zur CO2-Bepreisung sind sozial verträglich?",
      ],
      C1: [
        "Die Regulierung von Algorithmen durch den EU AI Act setzt weltweit Maßstäbe.",
        "Wir dürfen die technologische Souveränität Europas nicht an US- und asiatische Plattformmonopole abtreten.",
        "Die ethische Gratwanderung zwischen prädiktiver Analytik und informationeller Selbstbestimmung.",
        "Erneuerbare Energien erfordern disruptive Speichertechnologien und marktwirtschaftliche Anreize.",
      ],
      C2: [
        "Die Dialektik der Aufklärung erfährt durch generative Modelle eine unverhoffte Aktualität.",
        "Inwiefern erodiert die Epistemologie des digitalen Diskurses die demokratische Deliberation?",
        "Das Postulat der Singularität verdeckt sozioökonomische Asymmetrien.",
        "Transdisziplinäre Governance als conditio sine qua non für das postfossile Zeitalter.",
      ],
    },
  },
  {
    id: "rollenspiel",
    nameDe: "Interaktives Rollenspiel",
    nameFr: "Jeu de Rôle Immersif",
    nameEn: "Immersive Roleplay",
    icon: <Theater size={15} className="text-pink-500" />,
    description: "Im Restaurant bestellen, Ware im Geschäft reklamieren, Streit mit Nachbarn schlichten, WG-Casting",
    sampleStarter: {
      A1: "🎭 Rollenspiel: Im Berliner Café. Kellner: 'Guten Tag! Möchten Sie bestellen? Was darf ich Ihnen bringen?'",
      A2: "🎭 Rollenspiel: Im Kleidergeschäft. Verkäufer: 'Hallo! Kann ich Ihnen helfen? Suchen Sie eine bestimmte Größe oder Farbe?'",
      B1: "🎭 Rollenspiel: Reklamation. Kundenservice: 'Guten Tag. Sie rufen wegen Ihres defekten Laptops an. Was genau funktioniert nicht?'",
      B2: "🎭 Rollenspiel: Gehaltsverhandlung. Vorgesetzter: 'Herr/Frau Müller, Sie haben um ein Mitarbeitergespräch gebeten. Welche Ergebnisse der letzten Monate möchten Sie präsentieren?'",
      C1: "🎭 Rollenspiel: Krisenkommunikation. Pressesprecher im Interview mit einem investigativen Journalisten: 'Herr Sprecher, wie rechtfertigen Sie die Verzögerungen beim Großprojekt?'",
      C2: "🎭 Rollenspiel: Schiedsgerichtsbarkeit und diplomatische Vermittlung in einem komplexen Wirtschaftsstreitfall.",
    },
    suggestions: {
      A1: [
        "Einen Cappuccino und ein Stück Käsekuchen bitte.",
        "Die Rechnung bitte, ich möchte mit Karte zahlen.",
        "Haben Sie diesen Pullover in Größe M?",
        "Wo sind die Umkleidekabinen bitte?",
      ],
      A2: [
        "Ich möchte diesen Artikel umtauschen, weil er nicht passt.",
        "Geben Sie mir bitte den Kassenbon und die Quittung.",
        "Können Sie mir einen Tisch am Fenster reservieren?",
        "Ich habe eine Reservierung auf den Namen Dupont.",
      ],
      B1: [
        "Ich habe das Gerät vor zwei Wochen gekauft und der Bildschirm flackert ständig.",
        "Ich bestehe auf Reparatur oder einen kostenfreien Ersatz nach der Gewährleistung.",
        "Ich habe meine Projektziele im vergangenen Quartal um 15 % übertroffen.",
        "Angesichts meiner erweiterten Führungsverantwortung halte ich eine Gehaltserhöhung für angemessen.",
      ],
      B2: [
        "Lassen Sie uns eine verbindliche Zielvereinbarung für die nächste Bonusperiode definieren.",
        "Die Lärmbelästigung durch laute Musik nach 22 Uhr verstößt eklatant gegen die Hausordnung.",
        "Ich schlage einen tragfähigen Kompromiss vor, der beiden Mietparteien gerecht wird.",
        "Wir fordern eine lückenlose Aufklärung der Vorwürfe und volle Transparenz.",
      ],
      C1: [
        "Die unvorhergesehenen geologischen Verwerfungen machten eine Nachjustierung des Zeitplans unumgänglich.",
        "Wir weisen jede Vermutung unlauterer Absichten mit aller Entschiedenheit zurück.",
        "In bilateralen Vorverhandlungen konnten wir substanzielle Annäherungen erzielen.",
        "Das Mandat unserer Verhandlungsdelegation schließt einseitige Zugeständnisse kategorisch aus.",
      ],
      C2: [
        "Ich appelliere an die Vertragstreue (pacta sunt servanda) beider Streitparteien.",
        "Eine außergerichtliche Streitbeilegung wahrt das beiderseitige Renommee.",
        "Wir formulieren hiermit einen modifizierten Vergleichsvorschlag ad referendum.",
        "Die Schiedsklausel sieht eine abschließende und bindende Feststellung vor.",
      ],
    },
  },
  {
    id: "freies",
    nameDe: "✨ Freies Thema / Eigenes Thema",
    nameFr: "✨ Sujet Libre Personnalisé",
    nameEn: "✨ Custom / Free Topic",
    icon: <Sparkles size={15} className="text-indigo-500" />,
    description: "Geben Sie ein beliebiges Thema ein – die KI passt sich sofort an Ihr Niveau an!",
    sampleStarter: {
      A1: "Hallo! Über welches Thema möchtest du heute auf Deutsch sprechen? Schreibe mir ein Thema oder ein Wort!",
      A2: "Hallo! Welches Thema interessiert dich heute? Du kannst mir jede Frage stellen oder mir von einem Thema erzählen.",
      B1: "Hallo! Du hast freie Themenwahl. Sag mir, worüber du diskutieren, schreiben oder nachdenken möchtest – ich begleite dich auf Niveau B1!",
      B2: "Guten Tag! Ich passe mich vollkommen deinem Wunschthema an. Ob Fachdiskussion, Hobbys, Kunst, Politik oder Sprachrätsel: Welches Thema schlägst du vor?",
      C1: "Guten Tag. Die Bühne gehört dir: Welches anspruchsvolle Thema aus Wissenschaft, Kultur, Wirtschaft oder Philosophie möchtest du heute im Detail sezieren?",
      C2: "Willkommen zum freien Diskurs auf muttersprachlichem Niveau. Ich bin bereit für jede intellektuelle und sprachliche Herausforderung. Worüber debattieren wir?",
    },
    suggestions: {
      A1: [
        "Meine Hobbys: Musik hören und Fußball spielen.",
        "Mein Lieblingstag in der Woche.",
        "Meine Familie und meine Haustiere.",
        "Mein Lieblingsessen in Frankreich.",
      ],
      A2: [
        "Mein letzter Urlaub in den Bergen.",
        "Mein typischer Arbeitstag von morgens bis abends.",
        "Meine Lieblingsserie auf Deutsch mit Untertiteln.",
        "Warum ich Deutsch lernen möchte.",
      ],
      B1: [
        "Kulturelle Unterschiede zwischen Frankreich und Deutschland.",
        "Lohnt es sich, für ein Semester in Deutschland zu studieren?",
        "Tipps für das autonome Sprachenlernen zu Hause.",
        "Die Rolle von Sport für die mentale Gesundheit.",
      ],
      B2: [
        "Der Einfluss sozialer Medien auf unsere Aufmerksamkeitsspanne.",
        "Nachhaltiger Konsum versus Verzichtsethik im Alltag.",
        "Chancen und Risiken des Lebens als digitaler Nomade.",
        "Wie verändern Streaming-Plattformen die Film- und Serienkultur?",
      ],
      C1: [
        "Die Resilienz demokratischer Institutionen im 21. Jahrhundert.",
        "Sprache als Instrument der Macht und gesellschaftlichen Inklusion.",
        "Kognitionswissenschaftliche Grundlagen der Mehrsprachigkeit.",
        "Die Zukunft des Buches im Zeitalter digitaler Informationsüberflutung.",
      ],
      C2: [
        "Ontologische Fragestellungen künstlicher Intelligenz und Bewusstsein.",
        "Der Wandel des bürgerlichen Kunstbegriffs in der Postmoderne.",
        "Gerechtigkeitstheorien im globalen Ressourcenwettstreit.",
        "Die Hermeneutik literarischer Mehrdeutigkeit.",
      ],
    },
  },
];

type PracticeMode = "conversation" | "roleplay" | "grammar" | "exam" | "vocabulary";

interface PracticeModeDef {
  id: PracticeMode;
  labelDe: string;
  labelFr: string;
  labelEn: string;
  icon: string;
  badge: string;
}

const PRACTICE_MODES: PracticeModeDef[] = [
  { id: "conversation", labelDe: "Konversation", labelFr: "Conversation spontanée", labelEn: "Spontaneous Chat", icon: "💬", badge: "Dialog" },
  { id: "roleplay", labelDe: "Rollenspiel", labelFr: "Jeu de rôle immersif", labelEn: "Roleplay", icon: "🎭", badge: "Immersiv" },
  { id: "grammar", labelDe: "Grammatik-Coach", labelFr: "Coach Grammaire & Syntaxe", labelEn: "Grammar Coach", icon: "🔍", badge: "Korrektur" },
  { id: "exam", labelDe: "Prüfungstraining", labelFr: "Simulation Examen (Goethe/TELC)", labelEn: "Exam Prep", icon: "🎯", badge: "Zertifikat" },
  { id: "vocabulary", labelDe: "Wortschatz-Booster", labelFr: "Booster de Vocabulaire", labelEn: "Vocabulary Booster", icon: "📚", badge: "Idiome" },
];

export const AIChatTutor: React.FC<AIChatTutorProps> = ({
  student,
  school,
  locale,
}) => {
  const language: SupportedLanguage = school.language;
  const isEn = locale === "en";

  // CEFR Level state synced with student.level
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>(student.level || "B1");

  // Keep synced if student.level updates
  useEffect(() => {
    if (student.level) {
      setActiveLevel(student.level);
    }
  }, [student.level, student.id]);

  // Active topic state (Default to Job & Interview for B1/B2, or Daily Life for A1)
  const [selectedTopicId, setSelectedTopicId] = useState<string>("beruf");
  const [customTopicInput, setCustomTopicInput] = useState<string>("");
  const [activePracticeMode, setActivePracticeMode] = useState<PracticeMode>("conversation");
  const [suggestionOffset, setSuggestionOffset] = useState<number>(0);

  const activeTopic = GERMAN_TOPICS.find((t) => t.id === selectedTopicId) || GERMAN_TOPICS[0];

  const getTopicDisplayName = (tDef: GermanTopicDef) => {
    if (locale === "fr") return tDef.nameFr;
    if (locale === "en") return tDef.nameEn;
    return tDef.nameDe;
  };

  const buildInitialGreeting = (
    lvl: CEFRLevel,
    tDef: GermanTopicDef,
    mode: PracticeMode,
    name: string
  ) => {
    const starterSentence = tDef.sampleStarter[lvl] || tDef.sampleStarter.B1;
    const modeHeader =
      mode === "roleplay"
        ? `🎭 [Szenario-Modus : ${tDef.nameDe}]`
        : mode === "grammar"
        ? `🔍 [Grammatik-Labor & Korrektur-Modus : ${lvl}]`
        : mode === "exam"
        ? `🎯 [Prüfungstraining : Goethe / TELC ${lvl}]`
        : mode === "vocabulary"
        ? `📚 [Wortschatz-Booster & Redewendungen : ${tDef.nameDe}]`
        : `💬 [Thema : ${tDef.nameDe}]`;

    return `${modeHeader}\n\nHallo ${name}! ${starterSentence}`;
  };

  // Multi-turn messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome-init",
      role: "model",
      content: buildInitialGreeting(activeLevel, activeTopic, activePracticeMode, student.name),
      timestamp: new Date().toISOString(),
    },
  ]);

  // Switch topic or mode updates starter if conversation is fresh
  const handleSelectTopic = (newTopicId: string) => {
    setSelectedTopicId(newTopicId);
    setSuggestionOffset(0);
    const targetTopic = GERMAN_TOPICS.find((t) => t.id === newTopicId) || GERMAN_TOPICS[0];
    const newWelcome = buildInitialGreeting(activeLevel, targetTopic, activePracticeMode, student.name);
    setMessages([
      {
        id: `msg-welcome-topic-${newTopicId}-${Date.now()}`,
        role: "model",
        content: newWelcome,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSelectPracticeMode = (newMode: PracticeMode) => {
    setActivePracticeMode(newMode);
    const newWelcome = buildInitialGreeting(activeLevel, activeTopic, newMode, student.name);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-mode-switch-${Date.now()}`,
        role: "model",
        content: newWelcome,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleShuffleSuggestions = () => {
    setSuggestionOffset((prev) => prev + 1);
  };

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
      // Clean pedagogical tags before speaking so it reads natural German
      const cleaned = text
        .replace(/\[💡[^\]]*\]/gi, "")
        .replace(/\[🎯[^\]]*\]/gi, "")
        .replace(/\[🔍[^\]]*\]/gi, "")
        .replace(/\[🎭[^\]]*\]/gi, "")
        .replace(/\[📚[^\]]*\]/gi, "")
        .replace(/\[💬[^\]]*\]/gi, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = "de-DE";
      // Calibrated speech rates by CEFR level
      const rates: Record<CEFRLevel, number> = {
        A1: 0.8,
        A2: 0.85,
        B1: 0.95,
        B2: 1.0,
        C1: 1.05,
        C2: 1.08,
      };
      utterance.rate = rates[activeLevel] || 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get dynamic suggestions for active topic + level
  const currentTopicSuggestions = activeTopic.suggestions[activeLevel] || [
    "Können Sie mir das genauer auf Deutsch erklären?",
    "Wie drückt man das im Berufsalltag professionell aus?",
    "Habe ich hier einen Grammatikfehler gemacht?",
    "Lass uns das Thema weiter vertiefen!",
  ];

  // Rotate through suggestions with offset
  const displayedSuggestions = currentTopicSuggestions.slice(
    (suggestionOffset % Math.max(1, currentTopicSuggestions.length - 2)),
    (suggestionOffset % Math.max(1, currentTopicSuggestions.length - 2)) + 3
  );

  // Send message to backend `/api/ai/chat` with full German aptitude context
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
      const historyPayload = newHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const activeTopicTitle =
        selectedTopicId === "freies" && customTopicInput.trim()
          ? customTopicInput.trim()
          : activeTopic.nameDe;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload.slice(0, -1),
          language,
          level: activeLevel,
          topic: activeTopicTitle,
          practiceMode: activePracticeMode,
          studentName: student.name,
          schoolName: school.name,
          thinkingMode: useThinkingMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
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
      console.warn("Client fetch notice, triggering dynamic client-side German response:", err);
      // Dynamic non-repetitive client fallback generator
      const cleanFirstName = student.name.split(" ")[0] || "Schüler";
      const topicTitle = activeTopic.nameDe;
      const seed = Date.now();

      const dynamicFallbacks: Record<CEFRLevel, string[]> = {
        A1: [
          `Gut geantwortet, ${cleanFirstName}! Zum Thema „${topicTitle}“: In kurzen Sätzen im Präsens ist das schon sehr verständlich.\n\n[💡 Conseil A1 : *Rappelez-vous qu'en allemand, le verbe conjugué se place toujours en 2e position dans une phrase déclarative simple.*]\n\nWas gefällt Ihnen am besten an diesem Thema?`,
          `Prima, ${cleanFirstName}! Danke für Ihren Beitrag. Wir sprechen weiter über „${topicTitle}“.\n\n[💡 Conseil A1 : *Pour poser une question fermée (oui/non), on commence directement par le verbe (ex. : « Kommen Sie morgen? »).*]\n\nHaben Sie dazu noch eine Frage?`,
          `Schön formuliert! Das passt gut zum Thema „${topicTitle}“.\n\n[💡 Conseil A1 : *Attention à la majuscule obligatoire sur TOUS les noms communs en allemand (ex. : das Buch, die Arbeit).*]\n\nKönnen Sie mir das mit einem anderen deutschen Wort beschreiben?`,
        ],
        A2: [
          `Sehr gelungener Beitrag, ${cleanFirstName}! Beim Thema „${topicTitle}“ machen Sie spürbare Fortschritte.\n\n[💡 Conseil A2 : *Avec la conjonction « weil » (parce que), le verbe conjugué est rejeté tout à la fin de la proposition subordonnée.*]\n\nWas haben Sie zu diesem Thema kürzlich persönlich erlebt?`,
          `Gute Ausdrucksweise! Wir vertiefen nun den Aspekt „${topicTitle}“.\n\n[💡 Conseil A2 : *Au passé composé (Perfekt), la majorité des verbes d'action ou de changement d'état prennent l'auxiliaire « sein » (ex. : « Ich bin gefahren »).*]\n\nKönnen Sie mir davon im Perfekt (Vergangenheit) berichten?`,
          `Das ist ein interessanter Punkt, ${cleanFirstName}. Zum Thema „${topicTitle}“ gibt es viele praktische Facetten.\n\n[💡 Conseil A2 : *N'oubliez pas d'utiliser des connecteurs temporels comme « zuerst », « danach » et « schließlich » pour structurer votre récit.*]\n\nWelche Variante bevorzugen Sie persönlich in diesem Fall?`,
        ],
        B1: [
          `Ein sehr überzeugender Gedanke, ${cleanFirstName}! Im Rahmen von „${topicTitle}“ argumentieren Sie bereits recht flüssig.\n\n[💡 Conseil B1 : *Pour nuancer votre avis, alternez entre « meiner Ansicht nach (+ verbe en 2e) » et « ich bin der Überzeugung, dass ... (+ verbe à la fin) ».*]\n\nWelche wesentlichen Vor- und Nachteile sehen Sie bei dieser Situation aus Ihrer Sicht?`,
          `Das ist ein relevanter Aspekt zu „${topicTitle}“. Lassen Sie uns das differenziert betrachten.\n\n[💡 Conseil B1 : *La conjonction double « sowohl ... als auch » permet d'enrichir considérablement votre discours sans alourdir la syntaxe.*]\n\nWie würden Sie reagieren, wenn Sie in Deutschland unmittelbar mit dieser Situation konfrontiert wären?`,
          `Treffend formuliert, ${cleanFirstName}! Genau solche Formulierungen werden in der mündlichen Prüfung TELC/Goethe B1 geschätzt.\n\n[💡 Conseil B1 : *Pensez à utiliser le Konjunktiv II de politesse (« Ich hätte gern... », « Könnten Sie mir bitte... ») pour un registre naturel.*]\n\nWelchen Lösungsvorschlag würden Sie für dieses Problem empfehlen?`,
        ],
        B2: [
          `Eine bemerkenswert fundierte Stellungnahme, ${cleanFirstName}. Beim Thema „${topicTitle}“ bewegen Sie sich auf einem anspruchsvollen B2-Niveau.\n\n[💡 Conseil B2 : *Soignez la rection des verbes (Verben mit festen Präpositionen) : par exemple « hinweisen auf (+ Akk.) », « beitragen zu (+ Dat.) », « abhängen von (+ Dat.) ».*]\n\nWelche wirtschaftlichen oder gesellschaftlichen Gegenargumente ließen sich diesem Standpunkt noch entgegensetzen?`,
          `Sehr präzise dargelegt! Im professionellen Kontext von „${topicTitle}“ ist diese Perspektive von zentraler Bedeutung.\n\n[💡 Conseil B2 : *L'emploi de la voix passive (« Es muss berücksichtigt werden, dass... ») confère une objectivité appréciée dans les échanges formels en Allemagne.*]\n\nWelche konkreten Schritte und Handlungsempfehlungen würden Sie hier priorisieren?`,
          `Exzellent argumentiert, ${cleanFirstName}! Sie beherrschen den Übergang von theoretischen Überlegungen zu praktischen Beispielen.\n\n[💡 Conseil B2 : *Dans une négociation ou un débat, la formule concessive « Zwar ..., aber ... » permet d'admettre un point adverse tout en maintenant sa position.*]\n\nWie schätzen Sie die langfristige Entwicklung in diesem Bereich für den DACH-Raum ein?`,
        ],
        C1: [
          `Ein herausragendes sprachliches Register, ${cleanFirstName}. Ihre Analyse zu „${topicTitle}“ zeugt von hoher analytischer Schärfe und lexikalischer Vielfalt.\n\n[💡 Conseil C1 : *Pour densifier le propos académique, vous pouvez employer des attributs participiaux étendus (« die von der Fachwelt bislang unterschätzten Implikationen »).*]\n\nWelche übergeordneten systemischen Konsequenzen leiten Sie aus diesem Befund für die moderne Gesellschaft ab?`,
          `Faszinierende Erörterung! Sie verknüpfen diskursive Eleganz mit präziser Terminologie zum Thema „${topicTitle}“.\n\n[💡 Conseil C1 : *L'intégration de constructions avec verbes supports (Funktionsverbgefüge comme « in Betracht ziehen », « zur Debatte stehen ») parfait le registre soutenu.*]\n\nInwiefern lässt sich dieser Ansatz mit bestehenden ordnungspolitischen Rahmenbedingungen harmonisieren?`,
          `Eine bestechende Beweisführung, ${cleanFirstName}. Ihre rhetorische Souveränität spiegelt die Exzellenzstufe C1 wider.\n\n[💡 Conseil C1 : *Pensez à exploiter la nuance entre le Konjunktiv I pour le discours indirect rigoureux et le Konjunktiv II pour l'irréel hypothétique.*]\n\nWelche dialektische Gegenthese würden Sie einem solchen Entwurf im wissenschaftlichen Diskurs entgegenhalten?`,
        ],
        C2: [
          `Eine meisterhafte Replik von geradezu muttersprachlicher Eleganz, ${cleanFirstName}. Ihr Beitrag zu „${topicTitle}“ besticht durch stilistische Nuancierung.\n\n[💡 Conseil C2 : *L'agencement harmonieux des champs syntaxiques (notamment l'ausklammerung ins Nachfeld) témoigne d'un sentiment linguistique d'une absolue souveraineté.*]\n\nWelche erkenntnistheoretischen Konsequenzen zieht der zeitgenössische Diskurs aus dieser Antinomie?`,
          `Sprachlich wie inhaltlich auf höchstem Niveau! Wir sezieren die Thematik „${topicTitle}“ mit philologischer Akribie.\n\nWelche hermeneutischen Brüche diagnostizieren Sie im historischen Vergleich dieses Phänomens?`,
          `Brillante Formulierung, ${cleanFirstName}. Dieser argumentative Bogen illustriert das Maximum an Ausdruckskraft.\n\nWie verorten Sie diese Thematik im Spannungsfeld zwischen teleologischem Fortschrittsglauben und postmoderner Skepsis?`,
        ],
      };

      const options = dynamicFallbacks[activeLevel] || dynamicFallbacks.B1;
      const chosen = options[seed % options.length];

      const botMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: "model",
        content: chosen,
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
        content: buildInitialGreeting(activeLevel, activeTopic, activePracticeMode, student.name),
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const levelDescriptions: Record<CEFRLevel, { fr: string; en: string; de: string }> = {
    A1: {
      de: "A1 Anfänger : Kurze Sätze (5-8 Wörter), Präsens, Verbstellung & Phonetik",
      fr: "A1 Débutant : phrases courtes (5-8 mots), présent, ordre du verbe & prononciation",
      en: "A1 Beginner: short sentences (5-8 words), present tense, verb order & phonetics",
    },
    A2: {
      de: "A2 Grundlagen : Alltag, Familie, Perfekt (Vergangenheit) & Nebensätze mit 'weil/dass'",
      fr: "A2 Élémentaire : vie quotidienne, passé composé (Perfekt) & subordonnées 'weil/dass'",
      en: "A2 Elementary: daily life, past tense (Perfekt) & subordinate clauses",
    },
    B1: {
      de: "B1 Mittelstufe : Flüssige Meinungsäußerung, TELC/Goethe-Format, Reisen & Konjunktiv II",
      fr: "B1 Intermédiaire : expression d'opinions, format officiel TELC/Goethe, voyages & conditionnel",
      en: "B1 Intermediate: fluent opinions, TELC/Goethe exam format & subjunctive II",
    },
    B2: {
      de: "B2 Gute Mittelstufe : Berufsalltag, Vorstellungsgespräch, Rektion der Verben & Passiv",
      fr: "B2 Avancé : milieu pro, entretiens d'embauche, rection des verbes & passif",
      en: "B2 Upper Intermediate: professional discourse, job interviews, prepositions & passive",
    },
    C1: {
      de: "C1 Fortgeschritten : Akademischer Diskurs, idiomatische Nuancen & Partizipialattribute",
      fr: "C1 Expert : style académique, nuances idiomatiques, tournures complexes & argumentation",
      en: "C1 Advanced: academic discourse, nuanced idioms & complex participle clauses",
    },
    C2: {
      de: "C2 Exzellenz : Muttersprachliches Niveau, rhetorische Finesse & literarische Tiefe",
      fr: "C2 Maîtrise : niveau bilingue, finesse rhétorique & profondeur stylistique",
      en: "C2 Mastery: native-like fluency, rhetorical subtleties & deep stylistic range",
    },
  };

  return (
    <div className="neon-card rounded-3xl p-3 sm:p-5 flex flex-col h-[700px] sm:h-[750px] max-h-[90vh]">
      {/* Header with Title and Level Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>KI-Sprachtutor Deutsch</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  DACH 🇩🇪 🇦🇹 🇨🇭
                </span>
              </h3>

              {/* CEFR Level Selector Pill */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEn ? "Level" : "Niveau"}
                </span>
                <select
                  value={activeLevel}
                  onChange={(e) => {
                    const newLvl = e.target.value as CEFRLevel;
                    setActiveLevel(newLvl);
                    const newWelcome = buildInitialGreeting(newLvl, activeTopic, activePracticeMode, student.name);
                    setMessages([
                      {
                        id: `msg-welcome-lvl-${newLvl}-${Date.now()}`,
                        role: "model",
                        content: newWelcome,
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                  }}
                  className="bg-transparent text-xs font-black text-indigo-600 dark:text-indigo-400 outline-none cursor-pointer"
                  title={levelDescriptions[activeLevel][isEn ? "en" : "fr"]}
                >
                  <option value="A1">A1 (Anfänger)</option>
                  <option value="A2">A2 (Grundlagen)</option>
                  <option value="B1">B1 (Mittelstufe)</option>
                  <option value="B2">B2 (Gute Mittelstufe)</option>
                  <option value="C1">C1 (Fortgeschritten)</option>
                  <option value="C2">C2 (Exzellenz)</option>
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[34px] ${
              useThinkingMode
                ? "bg-violet-600/10 text-violet-600 border-violet-500/40 dark:text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "bg-slate-100 text-slate-600 border-transparent dark:bg-slate-800 dark:text-slate-400"
            }`}
            title={locale === "en" ? "Deep pedagogical reasoning for grammar breakdown" : "Raisonnement pédagogique approfondi pour l'analyse syntaxique"}
          >
            <Brain size={13} className={useThinkingMode ? "text-violet-500 animate-pulse" : ""} />
            <span className="text-[11px]">Thinking Mode</span>
          </button>

          {/* Reset Chat */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50"
            title={locale === "en" ? "Reset chat" : "Réinitialiser la conversation"}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* TOPIC & PRACTICE MODE SELECTION BAR */}
      <div className="py-2.5 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Practice Mode Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Target size={11} />
            {isEn ? "Mode:" : "Modus:"}
          </span>
          {PRACTICE_MODES.map((mode) => {
            const isSelected = activePracticeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleSelectPracticeMode(mode.id)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                <span>{mode.icon}</span>
                <span>{locale === "fr" ? mode.labelFr : isEn ? mode.labelEn : mode.labelDe}</span>
              </button>
            );
          })}
        </div>

        {/* German Topics Selector Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <BookOpen size={11} />
            {isEn ? "Topic:" : "Thema:"}
          </span>
          {GERMAN_TOPICS.map((topic) => {
            const isSelected = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleSelectTopic(topic.id)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-slate-900 hover:border-indigo-400 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                }`}
                title={topic.description}
              >
                {topic.icon}
                <span className="truncate max-w-[140px] sm:max-w-none">{getTopicDisplayName(topic)}</span>
              </button>
            );
          })}
        </div>

        {/* If Custom Topic is selected, show input */}
        {selectedTopicId === "freies" && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="Geben Sie hier Ihr persönliches Wunschthema ein (z. B. Architektur, Philosophie, Filmkunst)..."
              className="flex-1 h-8 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => {
                if (!customTopicInput.trim()) return;
                const newWelcome = `✨ [Freies Wunschthema : ${customTopicInput.trim()}]\n\nAusgezeichnete Wahl, ${student.name}! Wir unterhalten uns jetzt über „${customTopicInput.trim()}“ auf Niveau ${activeLevel}.\n\nWas interessiert dich daran besonders oder worüber möchtest du sprechen?`;
                setMessages([
                  {
                    id: `msg-custom-topic-${Date.now()}`,
                    role: "model",
                    content: newWelcome,
                    timestamp: new Date().toISOString(),
                  },
                ]);
              }}
              className="px-3 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shrink-0 cursor-pointer"
            >
              Starten
            </button>
          </div>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1.5">
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
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm"
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`group relative max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-50 text-slate-900 dark:bg-slate-800/90 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/60 shadow-sm"
                }`}
              >
                <div className="whitespace-pre-line prose-p:my-1">{m.content}</div>

                {/* Voice Speak button for Bot with level-adapted speech rate */}
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(m.content)}
                    className="absolute -right-7 top-2 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition p-1 cursor-pointer"
                    title={locale === "en" ? `Listen with German pronunciation (${activeLevel})` : `Écouter la prononciation allemande (${activeLevel})`}
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
                ? (locale === "en" ? `In-depth pedagogical reasoning for CEFR ${activeLevel}...` : `Raisonnement linguistique approfondi (CECRL ${activeLevel})...`)
                : (locale === "en" ? `German Tutor formulating level-${activeLevel} reply...` : `Le tuteur formule une réponse adaptée au niveau ${activeLevel}...`)}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts tailored dynamically to active topic & level */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/60">
        <button
          type="button"
          onClick={handleShuffleSuggestions}
          className="shrink-0 flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[10px] font-bold px-2 py-1 transition border border-indigo-200 dark:border-indigo-800/60 cursor-pointer"
          title="Neue Vorschläge anzeigen / Nouvelles inspirations"
        >
          <Shuffle size={11} />
          <span>Impulse</span>
        </button>

        {displayedSuggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(s)}
            className="shrink-0 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] px-3 py-1 text-slate-700 dark:text-slate-300 transition border border-slate-200/60 dark:border-slate-700/60 cursor-pointer truncate max-w-[280px]"
          >
            💬 {s}
          </button>
        ))}
      </div>

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
          placeholder={`Schreibe auf Deutsch zum Thema „${getTopicDisplayName(activeTopic)}“ (${activeLevel})...`}
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
