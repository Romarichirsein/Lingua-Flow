import {
  ExamMatchingLesenTask,
  ExamSprachbausteineTask,
  ExamHorenTrueFalseTask,
  ExamSchreibenSimulationTask,
  ExamSprechenSimulationTask,
} from "./prufungData";

// =============================================================================
// NIVEAU B1 — TELC / GOETHE AUTHENTISCHE EXAMEN-DATEN
// =============================================================================

export const B1_MATCHING_LESEN: ExamMatchingLesenTask[] = [
  {
    id: "de-b1-match-1",
    part: 1,
    title: "Teil 1: Zuordnung — Überschriften und Kurztexte",
    textType: "Berichte aus Tageszeitungen und Magazinen",
    theme: "Umwelt, Konsum und nachhaltiger Alltag",
    instructions:
      "Lesen Sie die Texte 1 bis 5 und die Überschriften A bis H. Finden Sie für jeden Text die passende Überschrift. Für jeden Text gibt es nur eine richtige Lösung. Drei Überschriften passen zu keinem Text.",
    texts: [
      "Familie Meier aus Freiburg hat vor zwei Jahren beschlossen, ihren Plastikmüll drastisch zu reduzieren. Statt im Supermarkt einzukaufen, bringen sie eigene Gläser und Stoffbeutel auf den Wochenmarkt und in Unverpackt-Läden. Inzwischen fällt bei ihnen pro Monat nur noch ein kleiner Beutel Restmüll an. Die Meiers betonen, dass diese Lebensweise am Anfang Disziplin verlangte, aber ihnen heute mehr Lebensqualität und bewussteres Kochen schenkt.",
      "In einer ehemaligen Fabrikhalle in Köln treffen sich jeden Samstag handwerklich begabte Freiwillige und Bürger aus dem Viertel. Hier wird vom kaputten Toaster über das alte Kofferradio bis zum Fahrrad alles gemeinsam repariert – vollkommen kostenlos. Bei Kaffee und Kuchen lernen Besucher, wie sie Haushaltsgeräte vor dem Müll retten können. Die Organisatoren wollen damit ein Zeichen gegen die Wegwerfgesellschaft setzen.",
      "Im ländlichen Schwarzwald hat sich ein neues Mobilitätsnetzwerk etabliert. Weil der Bus oft nur zweimal täglich fuhr, teilen sich die Bewohner dreier Dörfer nun sechs Elektroautos über eine gemeinsame Smartphone-App. Wer zum Arzt oder zum Großeinkauf in die nächste Kreisstadt muss, bucht einfach ein Fahrzeug für zwei Stunden. Die Kosten teilen sich die Nutzer solidarisch auf.",
      "Zwei Ganztagsschulen in Hannover gehen neue Wege bei der Schülerverpflegung: In den Mensen gibt es ab sofort dienstags und donnerstags ausschließlich Gerichte aus regionalem Bio-Anbau ohne Fleisch. Die Schüler halfen bei der Gestaltung des Speiseplans und pflanzen im Schulgarten eigene Kräuter an. Das Projekt soll das Bewusstsein junger Menschen für gesunde Ernährung und Klimaschutz schärfen.",
      "Ein Berliner Start-up hat eine App entwickelt, über die Bäckereien, Cafés und Restaurants überschüssige Waren kurz vor Feierabend zu einem Bruchteil des Originalpreises anbieten. Kunden reservieren eine Überraschungstüte online und holen sie abends ab. Deutschlandweit konnten dadurch bereits über zwei Millionen Mahlzeiten vor der Mülltonne gerettet werden.",
    ],
    headlines: [
      { id: "a", label: "Reparieren statt wegwerfen: Bürger engagieren sich gegen Elektroschrott" },
      { id: "b", label: "Nachhaltige Ernährung: Frische Bio-Küche an Bildungsstätten" },
      { id: "c", label: "Digitale Hilfe gegen Nahrungsmittelverschwendung" },
      { id: "d", label: "Fast müllfrei leben: Ein Erfahrungsbericht aus dem Schwarzwald und Baden" },
      { id: "e", label: "Gemeinsam mobil: Neue Fahrkonzepte für kleine Ortschaften" },
      { id: "f", label: "Drastische Erhöhung der städtischen Müllgebühren" },
      { id: "g", label: "Der Trend zum Zweitwagen in deutschen Großstädten" },
      { id: "h", label: "Kostenlose Reparaturdienste an Universitätskliniken" },
    ],
    answers: {
      "0": "d",
      "1": "a",
      "2": "e",
      "3": "b",
      "4": "c",
    },
    explanations: {
      "0": "Text 1 handelt vom fast müllfreien Leben der Familie Meier ('Fast müllfrei leben').",
      "1": "Text 2 beschreibt das 'Repair Café' gegen Elektroschrott ('Reparieren statt wegwerfen').",
      "2": "Text 3 beschreibt Carsharing in Dörfern ('Gemeinsam mobil: Fahrkonzepte für kleine Ortschaften').",
      "3": "Text 4 beschreibt Bio-Essen an zwei Schulen ('Frische Bio-Küche an Bildungsstätten').",
      "4": "Text 5 beschreibt eine App gegen das Wegwerfen von Essen ('Digitale Hilfe gegen Nahrungsmittelverschwendung').",
    },
  },
];

export const B1_SPRACHBAUSTEINE: ExamSprachbausteineTask[] = [
  {
    id: "de-b1-sb-1",
    part: 1,
    title: "Teil 1: E-Mail — Vorbereitung des gemeinsamen Sommerfestes",
    theme: "Freundschaft, Alltagsorganisation und Feste",
    instructions:
      "Lesen Sie den folgenden Text und entscheiden Sie, welches Wort (a, b oder c) in die jeweilige Lücke passt.",
    parts: [
      "",
      { n: 1, opts: ["Liebe", "Lieber", "Liebes"], correct: 1, explanation: "Anrede an einen männlichen Freund im Vokativ: 'Lieber Jakob'." },
      " Jakob,\n\nich hoffe sehr, ",
      { n: 2, opts: ["dass", "weil", "ob"], correct: 0, explanation: "Objektsatz mit 'hoffen': 'hoffen, dass'." },
      " es dir und deiner Familie gut geht. Ich schreibe dir heute, ",
      { n: 3, opts: ["denn", "weil", "deshalb"], correct: 1, explanation: "Kausale Konjunktion mit Verb am Satzende: 'weil wir bald unser großes Sommerfest feiern'." },
      " wir bald unser großes Sommerfest feiern und wir noch einige Dinge organisieren müssen.\n\nVielen Dank noch einmal ",
      { n: 4, opts: ["für", "an", "über"], correct: 0, explanation: "'Danken für' regiert die Präposition 'für' + Akkusativ: 'für deine Hilfe'." },
      " deine Unterstützung bei der Suche nach einem passenden Raum. Am ",
      { n: 5, opts: ["nächste", "nächsten", "nächstes"], correct: 1, explanation: "Temporale Angabe mit 'am' (an dem) verlangt Dativ maskulin: 'am nächsten Samstag'." },
      " Samstag treffen wir uns um 15:00 Uhr im Park. ",
      { n: 6, opts: ["Wenn", "Als", "Ob"], correct: 0, explanation: "Konditionalsatz in der Gegenwart: 'Wenn du Zeit hast'." },
      " du Zeit hast, bring bitte die Musikbox mit, ",
      { n: 7, opts: ["die", "der", "das"], correct: 0, explanation: "Relativpronomen für 'die Musikbox' (feminin Akkusativ): 'die du neu gekauft hast'." },
      " du neu gekauft hast.\n\nAußerdem wollte ich dich fragen: ",
      { n: 8, opts: ["Könntest", "Konntest", "Gekonnt"], correct: 0, explanation: "Höfliche Bitte im Konjunktiv II Gegenwart: 'Könntest du auch Getränke besorgen?'." },
      " du vielleicht auch noch ein paar kalte Getränke besorgen? Wir teilen die Kosten natürlich durch alle Teilnehmer. Ich freue mich schon sehr ",
      { n: 9, opts: ["auf", "über", "an"], correct: 0, explanation: "'Sich freuen auf' + Akkusativ drückt Vorfreude auf ein zukünftiges Ereignis aus." },
      " unser Wiedersehen.\n\n",
      { n: 10, opts: ["Herzlicher", "Herzliche", "Herzliches"], correct: 1, explanation: "Formel am Schluss: 'Herzliche Grüße' (Akkusativ Plural)." },
      " Grüße,\nLukas",
    ],
  },
  {
    id: "de-b1-sb-2",
    part: 2,
    title: "Teil 2: Magazinbericht — Dorothee Schumacher & Modedesign",
    theme: "Karriere, Mode und unternehmerischer Mut",
    instructions:
      "Lesen Sie den folgenden Magazinbeitrag und wählen Sie für jede Lücke die richtige Option (a, b oder c).",
    parts: [
      "Dorothee Schumacher gehört heute zu den bekanntesten Designerinnen Deutschlands. Doch ihr Weg ",
      { n: 11, opts: ["zum", "beim", "am"], correct: 0, explanation: "Feste Verbindung: 'der Weg zu + Dativ': 'ihr Weg zum internationalen Erfolg'." },
      " internationalen Erfolg war keineswegs vorgezeichnet. Geboren in Düsseldorf, sammelte sie schon früh praktische Erfahrungen ",
      { n: 12, opts: ["in", "auf", "unter"], correct: 0, explanation: "Lokale Präposition: 'in einer Strickwarenfabrik'." },
      " einer italienischen Manufaktur. Im Jahr 1989 gründete sie schließlich ihr ",
      { n: 13, opts: ["eigenes", "eigene", "eigenen"], correct: 0, explanation: "Akkusativ Neutrum nach Possessivpronomen: 'ihr eigenes Modelabel'." },
      " Modelabel mit einer kleinen Kollektion von T-Shirts.\n\nIhre Philosophie war von Anfang an klar: Sie wollte Kleidung entwerfen, ",
      { n: 14, opts: ["die", "welcher", "wo"], correct: 0, explanation: "Relativpronomen Bezug auf 'Kleidung' (feminin Akkusativ): 'die Frauen Selbstbewusstsein verleiht'." },
      " modernen Frauen Selbstvertrauen und Eleganz im Berufsalltag schenkt. ",
      { n: 15, opts: ["Obwohl", "Weil", "Trotz"], correct: 0, explanation: "Konzessive Konjunktion: 'Obwohl die ersten Jahre finanziell herausfordernd waren'." },
      " die ersten Jahre finanziell herausfordernd waren, gab sie niemals auf. Heute werden ihre Entwürfe in mehr ",
      { n: 16, opts: ["als", "wie", "von"], correct: 0, explanation: "Komparativischer Vergleich: 'mehr als 40 Ländern'." },
      " vierzig Ländern weltweit verkauft.\n\nBesonderen Wert legt das Unternehmen ",
      { n: 17, opts: ["auf", "über", "für"], correct: 0, explanation: "Feste Verb-Präposition: 'Wert legen auf + Akkusativ'." },
      " nachhaltige Produktionsbedingungen und langlebige Materialien. Schumacher arbeitet eng ",
      { n: 18, opts: ["mit", "bei", "von"], correct: 0, explanation: "Feste Verb-Präposition: 'arbeiten mit + Dativ'." },
      " talentierten jungen Schneiderinnen zusammen und engagiert sich aktiv für soziale Hilfsprojekte. Wer mit ihr spricht, spürt sofort ihre Leidenschaft ",
      { n: 19, opts: ["für", "um", "nach"], correct: 0, explanation: "Nomen-Präposition-Verbindung: 'die Leidenschaft für + Akkusativ'." },
      " kreative Gestaltung. Mode bedeutet für sie vor allem die Freiheit, ",
      { n: 20, opts: ["zu sein", "sein", "gewesen"], correct: 0, explanation: "Infinitivkonstruktion mit 'zu': 'sich selbst zu sein'." },
      " sich selbst treu zu bleiben.",
    ],
  },
];

export const B1_TRUE_FALSE_HOREN: ExamHorenTrueFalseTask[] = [
  {
    id: "de-b1-tf-horen-1",
    part: 2,
    title: "Teil 2: Radiointerview — Dorothee Schumacher: Mode mit Persönlichkeit",
    theme: "Mode, Beruf und unternehmerischer Erfolg (telccfree authentisch)",
    audioScenario: "Kulturmagazin 'Stil & Leben' auf Deutschlandfunk Kultur",
    playCountMax: 2,
    script:
      "Moderator: Willkommen bei 'Stil & Leben'. Heute bei uns im Studio ist die Modedesignerin Dorothee Schumacher. Frau Schumacher, schön, dass Sie da sind! Sie haben Ihr Unternehmen 1989 in Mannheim gegründet. Damals war Mode aus Deutschland international kaum im Gespräch. Wie kam es zu diesem mutigen Schritt?\n\nDorothee Schumacher: Guten Tag! Wissen Sie, ich wollte schon als junges Mädchen nicht einfach Kleidung von der Stange tragen. Ich habe in Italien eine Lehre in der Textilbranche gemacht und gesehen, mit welcher Hingabe dort gearbeitet wird. Zurück in Deutschland hatte ich das Gefühl: Frauen brauchen Mode, die sowohl im Büro tragbar als auch feminin und bequem ist. Mein Startkapital war klein, aber mein Wille groß. Anfangs fertigten wir nur T-Shirts mit Spitze, die sofort reißenden Absatz fanden.\n\nModerator: Heute zeigen Sie Kollektionen auf den Fashion Weeks in New York und Berlin. Trotzdem sind Sie mit Ihrer Unternehmenszentrale in Mannheim geblieben und nicht nach Paris oder Mailand gezogen. Warum?\n\nDorothee Schumacher: Mannheim ist für mich ein Ruhepol. Berlin ist aufregend, aber auch laut und schnelllebig. In Mannheim haben wir ein wunderbares Team aus über 140 Mitarbeitern, viel Raum für Kreativität und eine sehr familiäre Atmosphäre. Außerdem sind wir mitten in Europa und verkehrsgünstig angebunden.\n\nModerator: In Zeiten von Fast Fashion achten viele Kunden wieder stärker auf Nachhaltigkeit. Wie reagiert Ihr Haus darauf?\n\nDorothee Schumacher: Für uns ist das kein neuer Trend, sondern seit 30 Jahren gelebte Realität. Wir setzen auf Naturfasern, faire Löhne in den Partnerbetrieben und zeitlose Schnitte. Ein gutes Kleidungsstück soll man zehn Jahre lang tragen können, nicht nur eine Saison.",
    statements: [
      {
        id: "b1-tf-1",
        statement: "Dorothee Schumacher absolvierte ihre Ausbildung in Frankreich.",
        isTrue: false,
        explanation: "Falsch: Sie sagt ausdrücklich, dass sie in Italien eine Lehre in der Textilbranche gemacht hat.",
      },
      {
        id: "b1-tf-2",
        statement: "Die erste Kollektion ihres Labels bestand ausschließlich aus T-Shirts mit Spitze.",
        isTrue: true,
        explanation: "Richtig: 'Anfangs fertigten wir nur T-Shirts mit Spitze, die sofort reißenden Absatz fanden.'",
      },
      {
        id: "b1-tf-3",
        statement: "Ihr Unternehmen verlegte seinen Hauptsitz später von Mannheim nach Berlin.",
        isTrue: false,
        explanation: "Falsch: Das Unternehmen ist bewusst in Mannheim geblieben, weil es ein kreativer Ruhepol ist.",
      },
      {
        id: "b1-tf-4",
        statement: "In der Mannheimer Unternehmenszentrale arbeiten derzeit über 140 Personen.",
        isTrue: true,
        explanation: "Richtig: 'In Mannheim haben wir ein wunderbares Team aus über 140 Mitarbeitern.'",
      },
      {
        id: "b1-tf-5",
        statement: "Frau Schumacher hält Berlin für zu teuer für junge Modelabels.",
        isTrue: false,
        explanation: "Falsch: Sie bezeichnet Berlin als laut und schnelllebig, erwähnt aber keine zu hohen Kosten.",
      },
      {
        id: "b1-tf-6",
        statement: "Nachhaltigkeit und Langlebigkeit spielten für ihr Label von Beginn an eine zentrale Rolle.",
        isTrue: true,
        explanation: "Richtig: 'Für uns ist das kein neuer Trend, sondern seit 30 Jahren gelebte Realität.'",
      },
      {
        id: "b1-tf-7",
        statement: "Die Designerin empfiehlt Kunden, ihre Kleidung nach einer Saison auszutauschen.",
        isTrue: false,
        explanation: "Falsch: Sie betont, dass ein gutes Kleidungsstück zehn Jahre lang getragen werden soll.",
      },
      {
        id: "b1-tf-8",
        statement: "Dorothee Schumacher präsentiert ihre Kollektionen auch international in den USA.",
        isTrue: true,
        explanation: "Richtig: Der Moderator erwähnt die Modewochen in New York und Berlin.",
      },
    ],
  },
];

export const B1_SCHREIBEN_SIMULATION: ExamSchreibenSimulationTask[] = [
  {
    id: "de-b1-sim-schreiben-1",
    part: 1,
    title: "Offizieller Prüfungsteil: Beschwerde-E-Mail (Reklamation)",
    theme: "Sprachreise und Unterbringung (telc Deutsch B1 Prüfungsformat)",
    scenario:
      "Sie haben vor zwei Wochen an einem zweiwöchigen Intensivsprachkurs in München teilgenommen, den Sie über die Agentur 'Sprachen & Zukunft' gebucht hatten. Leider entsprach der Kurs überhaupt nicht den Versprechungen im Prospekt: Die Unterkunft war schmutzig, der Unterricht fiel an zwei Tagen ersatzlos aus und das Lehrmaterial musste vor Ort zusätzlich teuer bezahlt werden.",
    requirements: [
      "Geben Sie den Anlass Ihres Schreibens und Ihre Kundennummer an.",
      "Beschreiben Sie präzise zwei bis drei aufgetretene Mängel.",
      "Drücken Sie Ihre Enttäuschung über den Service höflich aber bestimmt aus.",
      "Fordern Sie eine angemessene Rückerstattung eines Teils der Kursgebühren mit Fristsetzung.",
    ],
    min_words: 100,
    time_minutes: 30,
    rubric: [
      { critere: "I. Erfüllung der Aufgabenstellung (alle 4 Leitpunkte behandelt)", points: 25 },
      { critere: "II. Kohärenz, Textaufbau und formelle E-Mail-Struktur", points: 25 },
      { critere: "III. Wortschatz, Redemittel und Ausdrucksvermögen", points: 25 },
      { critere: "IV. Grammatische Korrektheit, Morphologie und Rechtschreibung", points: 25 },
    ],
    sampleSolution:
      "Sehr geehrte Damen und Herren,\n\nhiermit möchte ich mich über den zweiwöchigen Intensivkurs 'Deutsch für den Beruf' in München beschweren (Buchungsnummer: LF-94821), den ich vom 1. bis zum 15. Juli besucht habe.\n\nLaut Ihrer Broschüre sollte der Unterricht in modernen Kleingruppen mit maximal acht Teilnehmern stattfinden. In Wirklichkeit waren wir jedoch über zwanzig Personen im Raum, sodass kaum Gelegenheit zum Sprechen blieb. Zudem fiel der Unterricht an zwei Tagen wegen Krankheit der Lehrkraft ersatzlos aus. Auch die von Ihnen vermittelte Unterkunft war in einem unhygienischen Zustand: Das Badezimmer war verschmutzt und das WLAN funktionierte während des gesamten Aufenthalts nicht.\n\nIch bin über diesen mangelhaften Service äußerst enttäuscht, zumal ich für die Reise über 1.200 Euro bezahlt habe. Aus diesem Grund fordere ich eine Rückerstattung von 40 Prozent des Gesamtbetrags auf mein Konto bis zum 30. dieses Monats.\n\nIch erwarte Ihre baldige Rückmeldung.\n\nMit freundlichen Grüßen,\nAlexandre Dupont",
    usefulPhrases: [
      "Sehr geehrte Damen und Herren,",
      "Hiermit möchte ich mich über ... beschweren.",
      "Laut Ihrer Ankündigung sollte...",
      "In Wirklichkeit entsprach die Situation nicht den Angaben.",
      "Ich bin über diesen Zustand äußerst enttäuscht.",
      "Aus diesem Grund fordere ich eine teilweise Rückerstattung.",
      "Bitte überweisen Sie den Betrag bis zum [Datum].",
      "Mit freundlichen Grüßen,",
    ],
  },
];

export const B1_SPRECHEN_SIMULATION: ExamSprechenSimulationTask[] = [
  {
    id: "de-b1-sim-sprechen-1",
    part: 3,
    title: "Teil 3: Gemeinsam eine Aufgabe lösen (telc B1 Prüfungsformat)",
    durationMinutes: 5,
    instructions:
      "Sie und Ihr Prüfungspartner sollen gemeinsam ein Abschiedsfest für einen geschätzten Kollegen planen, der das Unternehmen verlässt. Finden Sie für alle Punkte eine gemeinsame Lösung und einigen Sie sich auf einen Plan.",
    topic: "Planung einer Abschiedsfeier für Herrn Wagner",
    partnerTask:
      "Ihr Partner hat eigene Ideen zum Termin und Budget. Tauschen Sie Argumente aus und finden Sie für jeden Punkt einen Kompromiss.",
    prompts: [
      "Wann und wo soll die Feier stattfinden? (Im Büro, im Restaurant oder im Park?)",
      "Welches Geschenk soll gekauft werden und wer sammelt das Geld ein?",
      "Essen und Getränke: Catering bestellen oder bringt jeder Kollege etwas mit?",
      "Überraschungsmoment: Soll jemand eine kurze Rede halten oder Musik vorbereiten?",
    ],
    essentialRedemittel: [
      {
        category: "Vorschläge machen",
        phrases: [
          "Was hältst du davon, wenn wir...",
          "Ich schlage vor, dass wir...",
          "Wir könnten doch...",
          "Wäre es nicht eine gute Idee, wenn...",
        ],
      },
      {
        category: "Zustimmen & Begeisterung zeigen",
        phrases: [
          "Das ist ein ausgezeichneter Vorschlag!",
          "Ganz genau, so machen wir es.",
          "Da stimme ich dir vollkommen zu.",
          "Das klingt wirklich vernünftig.",
        ],
      },
      {
        category: "Einwände erheben & ablehnen",
        phrases: [
          "Ich bin mir nicht sicher, ob das klappt, weil...",
          "Meinst du wirklich? Das Restaurant könnte zu teuer sein.",
          "Dagegen spricht, dass viele Kollegen freitags früher nach Hause fahren.",
          "Ich hätte da einen anderen Gedanken...",
        ],
      },
      {
        category: "Einen Kompromiss aushandeln",
        phrases: [
          "Lass uns einen Mittelweg finden: Wie wäre es mit...",
          "Könnten wir uns darauf einigen, dass...",
          "Gut, dann übernehme ich das Geschenk und du kümmerst dich um...",
        ],
      },
    ],
    evaluationCriteria: [
      "Aktive Gesprächsbeteiligung und Kooperation mit dem Partner",
      "Stellen von Fragen und Eingehen auf die Argumente des Partners",
      "Flüssigkeit, Intonation und angemessener B1-Wortschatz",
      "Erreichen eines klaren Konsenses für alle 4 Teilfragen",
    ],
  },
];

// =============================================================================
// NIVEAU B2 — TELC / GOETHE AUTHENTISCHE EXAMEN-DATEN (TELCCFREE & DEUROPA)
// =============================================================================

export const B2_MATCHING_LESEN: ExamMatchingLesenTask[] = [
  {
    id: "de-b2-match-1",
    part: 1,
    title: "Teil 1: Zuordnung — « Das alte Leben hinter sich lassen »",
    textType: "Erfahrungsberichte und Porträts aus überregionalen Wochenzeitungen",
    theme: "Beruflicher Neuanfang, Quereinstieg und Sinnsuche (telccfree authentisch)",
    instructions:
      "Lesen Sie die fünf Erfahrungsberichte (1 bis 5) und die Überschriften A bis H. Welche Überschrift passt zu welchem Text? Für jeden Text gibt es nur eine richtige Lösung. Drei Überschriften bleiben übrig.",
    texts: [
      "Markus, 43, verbrachte fünfzehn Jahre in gläsernen Bürotürmen von Frankfurt als Analyst im Investmentbanking. Die Arbeitswochen mit siebzig Stunden und der permanente Renditedruck führten schließlich zu einem schweren Erschöpfungszustand. Vor drei Jahren zog er die Reißleine, erwarb einen verlassenen Bauernhof in der Vulkaneifel und betreibt dort heute eine ökologische Ziegenkäserei. 'Die körperliche Arbeit von Sonnenaufgang bis zum Abend ist hart', räumt er ein, 'aber ich schmecke zum ersten Mal den Sinn meines eigenen Schaffens.'",
      "Claudia war über ein Jahrzehnt als verbeamtete Gymnasiallehrerin für Deutsch und Geschichte an einer angesehenen Schule tätig. Trotz gesichertem Einkommen und unkündbarem Status erstickte die wachsende Bürokratie ihre pädagogische Leidenschaft. Sie kündigte den Schuldienst, baute einen historischen Bus zu einer rollenden Buchhandlung um und tourt seither durch abgelegene Dörfer im ländlichen Brandenburg. Sie bringt Literatur direkt zu den Menschen, veranstaltet Lesungen am Dorfbrunnen und blüht in dieser neuen Unabhängigkeit auf.",
      "Stefan war erfolgreicher Chefarchitekt einer Softwarefirma in München. Nach zwanzig Jahren virtueller Codezeilen wuchs in ihm das drängende Verlangen nach greifbarer Materie. Er absolvierte eine zweijährige Schreinerlehre als Geselle und eröffnete eine Werkstatt für die Restaurierung antiker Echtholzmöbel. 'Wenn ich das Jahrhundert alte Eichenholz abhobele und die Maserung wieder sichtbar wird, spüre ich eine Befriedigung, die mir kein Software-Release jemals geben konnte', erklärt der 50-Jährige.",
      "Dr. Birgit Ederer leitete als renommierte Chefärztin die Kardiologie an einer Universitätsklinik. Der ökonomische Zwang zur Fallpauschalen-Maximierung und die mangelnde Zeit für das persönliche Patientengespräch widersprachen jedoch zunehmend ihrem humanistischen Berufsethos. Mit 54 Jahren gab sie ihre Spitzenposition auf, absolvierte eine kunsttherapeutische Zusatzausbildung und arbeitet heute mit Demenzkranken in Hospizen und Pflegeheimen.",
      "Alexander, 34, leitete die Marketingkampagnen eines globalen Sportartikelherstellers. Die ständige Tretmühle aus Meetings und Geschäftsreisen tauschte er gegen einen autark ausgerüsteten Allrad-Transporter. Als freiberuflicher Texter arbeitet er nun standortunabhängig von den Klippen Portugals oder aus den schwedischen Wäldern. Seine Devise: 'Ich habe meinen Konsum auf das Wesentliche reduziert und dafür unbezahlbare Freiheit und Zeitautonomie gewonnen.'",
    ],
    headlines: [
      { id: "a", label: "Vom Büro auf das Feld: Ein Banker findet seine Erfüllung in der Landwirtschaft" },
      { id: "b", label: "Literatur auf vier Rädern: Eine Lehrerin bringt Kultur aufs Land" },
      { id: "c", label: "Aus Liebe zum Handwerk: Wenn ein IT-Experte altes Holz zum Leben erweckt" },
      { id: "d", label: "Vom Skalpell zur Kunsttherapie: Neue Wege in der ganzheitlichen Heilung" },
      { id: "e", label: "Digitales Nomadentum: Mit dem Campervan zur absoluten Lebensautonomie" },
      { id: "f", label: "Finanzielle Risiken bei Unternehmensneugründungen im Handwerkssektor" },
      { id: "g", label: "Der Trend zur vorzeitigen Pensionierung im staatlichen Beamtenapparat" },
      { id: "h", label: "Warum viele Quereinsteiger nach kurzer Zeit in den alten Beruf zurückkehren" },
    ],
    answers: {
      "0": "a",
      "1": "b",
      "2": "c",
      "3": "d",
      "4": "e",
    },
    explanations: {
      "0": "Text 1 handelt vom Investmentbanker Markus, der Ziegenkäse herstellt ('Vom Büro auf das Feld').",
      "1": "Text 2 schildert die ehemalige Lehrerin Claudia mit ihrer mobilen Buchhandlung ('Literatur auf vier Rädern').",
      "2": "Text 3 beschreibt Stefan, der vom Softwarearchitekten zum Holzrestaurator wurde ('Aus Liebe zum Handwerk').",
      "3": "Text 4 beschreibt Chefärztin Birgit, die zur Kunsttherapeutin wurde ('Vom Skalpell zur Kunsttherapie').",
      "4": "Text 5 handelt von Alexander im Campervan als digitaler Nomade ('Digitales Nomadentum').",
    },
  },
  {
    id: "de-b2-match-2",
    part: 3,
    title: "Teil 3: Anzeigen und Situationen — « Stadtführer & Geschäftsreisen »",
    textType: "Serviceangebote und gewerbliche Kleinanzeigen",
    theme: "Dienstleistungen, Seminare und Reiseorganisation (deuropa.app authentisch)",
    instructions:
      "Lesen Sie die Situationen 1 bis 3 und die Anzeigen A bis E. Welche Anzeige passt zu welcher Situation? Wählen Sie für jede Situation den passenden Buchstaben. Wenn keine Anzeige passt, markieren Sie 'x'.",
    texts: [
      "Situation 1: Frau Hoffmann sucht für eine Delegation ausländischer Führungskräfte eine zweisprachige Architekturführung durch das Regierungsviertel in Berlin mit anschließendem Empfang.",
      "Situation 2: Ein junges Start-up-Team sucht ein intensives Wochenendseminar zur Schulung von Verhandlungstechniken im englisch-deutschen Kontext in ländlicher Umgebung.",
      "Situation 3: Herr Dr. Meier sucht einen Fahrdienst mit Chauffeur und Limousine für mehrtägige Messetermine in Frankfurt inklusive Buchung von Hotelkontingenten.",
    ],
    headlines: [
      { id: "a", label: "Anzeige A: 'Metropol Tours Berlin' — Exklusive bilinguale Fachführungen zu Stadtplanung & Architektur mit Cateringoption" },
      { id: "b", label: "Anzeige B: 'Rhein-Main Chauffeur Service' — Diskreter Limousinentransfer, Messelogistik und Premium-Gästebetreuung" },
      { id: "c", label: "Anzeige C: 'Seminarhaus Taunus' — Rhetorik- und Verhandlungsworkshops für Teams im Grünen" },
      { id: "d", label: "Anzeige D: 'Gourmet-Catering Berlin' — Fingerfood und Buffets für Hochzeiten und Jubiläen" },
      { id: "e", label: "Anzeige E: 'City Hostel Frankfurt' — Günstige Mehrbettzimmer im Stadtzentrum" },
      { id: "x", label: "Keine passende Anzeige vorhanden" },
    ],
    answers: {
      "0": "a",
      "1": "c",
      "2": "b",
    },
    explanations: {
      "0": "Situation 1 passt exakt zu Anzeige A (bilinguale Architekturführung Berlin mit Catering).",
      "1": "Situation 2 passt exakt zu Anzeige C (Verhandlungsworkshop im Seminarhaus im Grünen).",
      "2": "Situation 3 passt exakt zu Anzeige B (Limousinentransfer, Messelogistik Frankfurt).",
    },
  },
];

export const B2_SPRACHBAUSTEINE: ExamSprachbausteineTask[] = [
  {
    id: "de-b2-sb-1",
    part: 1,
    title: "Teil 1: Formelle E-Mail — Liebe Anna / Hey Jan (telccfree / deuropa)",
    theme: "Berufliche Neuorientierung und kollegiale Zusammenarbeit",
    instructions:
      "Lesen Sie den folgenden Text und wählen Sie bei jeder Lücke die grammatikalisch und stilistisch korrekte Form (a, b oder c).",
    parts: [
      "Liebe Anna,\n\nich hoffe, dass du dich ",
      { n: 21, opts: ["an deinem", "in deinen", "nach deinem"], correct: 0, explanation: "Feste Verbindung: 'sich an einem neuen Arbeitsplatz einleben' verlangt 'an + Dativ'." },
      " neuen Arbeitsplatz in Hamburg bereits gut eingelebt hast. Wie du weißt, hat sich seit deinem Weggang auch bei uns in der Abteilung einiges verändert.\n\nUnser Abteilungsleiter hat mich gebeten, ",
      { n: 22, opts: ["die Leitung", "zur Leitung", "der Leitung"], correct: 0, explanation: "Akkusativobjekt nach dem Infinitiv 'übernehmen': 'die Leitung des Digitalprojekts zu übernehmen'." },
      " des neuen Digitalprojekts zu übernehmen, ",
      { n: 23, opts: ["worüber", "worauf", "womit"], correct: 0, explanation: "Pronominaladverb bezogen auf den ganzen Sachverhalt: 'worüber ich mich sehr gefreut habe'." },
      " ich mich natürlich sehr gefreut habe. Allerdings ist der Zeitplan äußerst straff, ",
      { n: 24, opts: ["sodass", "obwohl", "insofern"], correct: 0, explanation: "Konsekutiver Konnektor: 'sodass Überstunden unvermeidlich sind'." },
      " Überstunden in den kommenden Wochen wohl unvermeidlich sein werden.\n\nIch erinnere mich daran, dass du damals eine sehr strukturierte Vorlage für die Quartalsberichte ",
      { n: 25, opts: ["erstellt hattest", "erstellt worden war", "erstellen würdest"], correct: 0, explanation: "Plusquamperfekt zur Kennzeichnung der Vorzeitigkeit: 'erstellt hattest'." },
      ". Wäre es dir möglich, ",
      { n: 26, opts: ["mir diese zukommen zu lassen", "dass du mir diese zukommen lässt", "um mir diese zukommen zu lassen"], correct: 0, explanation: "Infinitivkonstruktion nach 'möglich sein': 'mir diese zukommen zu lassen'." },
      "? Das würde mir die Einarbeitung der neuen Kollegen erheblich ",
      { n: 27, opts: ["erleichtern", "erleichtert", "erleichternd"], correct: 0, explanation: "Reiner Infinitiv nach dem Konjunktiv-Hilfsverb 'würde': 'erleichtern'." },
      ".\n\nÜbrigens findet Ende nächsten Monats die europäische Fachkonferenz in Berlin statt. Nimmst du ",
      { n: 28, opts: ["daran teil", "davon teil", "darüber teil"], correct: 0, explanation: "Feste Verb-Präposition: 'teilnehmen an + Dativ' -> 'daran teilnehmen'." },
      "? Falls ja, könnten wir uns doch abends auf ein Glas Wein treffen, ",
      { n: 29, opts: ["um uns auszutauschen", "ohne uns auszutauschen", "anstatt uns auszutauschen"], correct: 0, explanation: "Finaler Infinitivsatz: 'um uns auszutauschen'." },
      ".\n\nIch wünsche dir weiterhin viel Erfolg und freue mich auf deine Antwort.\n\n",
      { n: 30, opts: ["Herzliche Grüße", "Mit freundlichen Grüßen", "Liebste Grüße"], correct: 0, explanation: "Halbformelle/freundschaftlich-kollegiale Grußformel: 'Herzliche Grüße'." },
      ",\nJan",
    ],
  },
  {
    id: "de-b2-sb-2",
    part: 2,
    title: "Teil 2: Fachartikel — « Sprachwandel im digitalen Zeitalter »",
    theme: "Linguistik, Medien und Sprachökonomie (telccfree / deuropa authentisch)",
    instructions:
      "Lesen Sie den folgenden Text. Wählen Sie für jede Lücke aus den drei Möglichkeiten das passende Wort aus.",
    parts: [
      "Die deutsche Gegenwartssprache befindet sich in einem rasanten Transformationsprozess. Noch nie zuvor haben sich Kommunikationsgewohnheiten so grundlegend gewandelt wie im Zeitalter sozialer Netzwerke. Während Kulturpessimisten regelmäßig den vermeintlichen ",
      { n: 31, opts: ["Niedergang", "Rückgang", "Ausfall"], correct: 0, explanation: "Fester Begriff in der Sprachkritik: 'der Niedergang der Sprachkultur'." },
      " der Sprachkultur beklagen, betrachten Sprachwissenschaftler dieses Phänomen nüchterner.\n\nIn Kurznachrichten und Messenger-Diensten herrscht das Prinzip der ",
      { n: 32, opts: ["Sprachökonomie", "Sprachvorsicht", "Sprachverwirrung"], correct: 0, explanation: "Linguistischer Fachbegriff: 'Sprachökonomie' (mit minimalem Aufwand maximalen Inhalt vermitteln)." },
      ". Abkürzungen, Emojis und syntaktische Reduktionen dienen keineswegs der Verarmung des Wortschatzes, sondern ermöglichen eine extrem schnelle, dialogorientierte Verständigung. Interessant ist hierbei, dass Sprecher sehr wohl in der Lage sind, je nach Kontext zwischen informellem Chat-Jargon und formellem Register ",
      { n: 33, opts: ["zu differenzieren", "differenzierend", "differenziert"], correct: 0, explanation: "Infinitiv mit 'zu' nach 'in der Lage sein': 'zu differenzieren'." },
      ".\n\nEin weiterer Aspekt betrifft die Entlehnung von Anglizismen. Begriffe aus Informationstechnologie und Wirtschaftsleben werden häufig nicht bloß übernommen, sondern vollständig in das deutsche Grammatiksystem ",
      { n: 34, opts: ["integriert", "ausgegrenzt", "verworfen"], correct: 0, explanation: "Passiv Perfekt: 'in das System integriert (eingegliedert) werden'." },
      ", wie Bildungen wie 'gegoogelt' oder 'gedownloadet' anschaulich beweisen. Diese morphologische Anpassungsfähigkeit zeugt von der Vitalität und Flexibilität der deutschen Sprache, nicht etwa von ihrer ",
      { n: 35, opts: ["Schwäche", "Macht", "Schönheit"], correct: 0, explanation: "Gegensatzpaar zu Vitalität/Flexibilität: 'nicht etwa von ihrer Schwäche'." },
      ".\n\nZudem lässt sich beobachten, dass dialektale Färbungen in der Alltagssprache zurückgehen, während gleichzeitig neue, urbane Soziolekte ",
      { n: 36, opts: ["entstehen", "vergehen", "fehlschlagen"], correct: 0, explanation: "Passendes Verb: Neue Varietäten 'entstehen' kontinuierlich." },
      ". Letztlich erweist sich Sprache nicht als ein starres Regelwerk, sondern als ein lebendiger Organismus, der sich fortwährend den Lebensrealitäten seiner Sprecher ",
      { n: 37, opts: ["anpasst", "entzieht", "widersetzt"], correct: 0, explanation: "Reflexives Verb: 'sich anpassen an + Akkusativ'." },
      ". Wer den Sprachwandel verstehen will, muss ihn daher als Ausdruck gesellschaftlicher Dynamik begreifen, ",
      { n: 38, opts: ["anstatt", "infolge", "anstelle"], correct: 0, explanation: "Präposition mit Genitiv / Infinitiv: 'anstatt ihn dogmatisch zu verurteilen'." },
      " ihn pauschal als Verfall abzutun. Die Fähigkeit zur steten Erneuerung sichert der Sprache schließlich ihre ",
      { n: 39, opts: ["Zukunftsfähigkeit", "Gegenwärtigkeit", "Vergangenheit"], correct: 0, explanation: "Substantiv: 'Zukunftsfähigkeit' passt in den Schlusssatz." },
      " im 21. Jahrhundert.",
    ],
  },
];

export const B2_TRUE_FALSE_HOREN: ExamHorenTrueFalseTask[] = [
  {
    id: "de-b2-tf-horen-1",
    part: 2,
    title: "Teil 2: Radiofeature — Flexible Arbeitswelten und mentale Gesundheit",
    theme: "Arbeitswelt 4.0, Ergonomie und Resilienz (telccfree / deuropa)",
    audioScenario: "Wirtschaftsmagazin 'Trend & Zukunft' im Südwestrundfunk (SWR)",
    playCountMax: 2,
    script:
      "Moderator: Schönen guten Abend. Die Corona-Pandemie hat einen weltweiten Großversuch in Sachen Telearbeit ausgelöst. Mittlerweile fordern viele Großkonzerne ihre Beschäftigten wieder zur Rückkehr ins Büro auf. Warum? Darüber sprechen wir mit Arbeitspsychologin Dr. Sabine Brandner.\n\nDr. Brandner: Guten Abend. Die anfängliche Begeisterung über das permanente Homeoffice hat sich merklich abgekühlt. Zwar sparten die Mitarbeiter wertvolle Pendelzeit, doch die psychologischen Folgekosten wurden anfangs unterschätzt. Wenn der Küchentisch dauerhaft zum Schreibtisch wird, gelingt die mentale Trennung zwischen Berufsleben und Feierabend kaum noch. Viele Betroffene berichten über permanente Erreichbarkeit und schleichende Schlafstörungen.\n\nModerator: Aber galt Homeoffice nicht als ideal für die Vereinbarkeit von Familie und Beruf?\n\nDr. Brandner: Das ist die Theorie. In der Praxis zeigte sich jedoch insbesondere bei Eltern kleiner Kinder eine enorme Doppelbelastung. Wenn gleichzeitig Videokonferenzen anstehen und Kinder betreut werden müssen, steigt das Stressniveau exponentiell. Hinzu kommt der Verlust der informellen Firmenkultur. Die kreativsten Ideen entstehen nun einmal nicht in strukturierten Zoom-Meetings, sondern beim zufälligen Plausch an der Kaffeemaschine.\n\nModerator: Welche Modelle empfehlen Sie zeitgemäßen Unternehmen?\n\nDr. Brandner: Die Zukunft gehört dem hybriden Modell mit zwei bis drei festen Präsenztagen pro Woche. An diesen Präsenztagen sollte jedoch nicht isoliert am PC gearbeitet werden, sondern Teambuilding, kreative Workshops und strategische Planungen im Mittelpunkt stehen. Nur so verbindet man die Autonomie der Heimarbeit mit dem sozialen Zusammenhalt des Teams.",
    statements: [
      {
        id: "b2-tf-1",
        statement: "Die anfängliche Euphorie über ausschließliche Heimarbeit ist mittlerweile verflogen.",
        isTrue: true,
        explanation: "Richtig: 'Die anfängliche Begeisterung über das permanente Homeoffice hat sich merklich abgekühlt.'",
      },
      {
        id: "b2-tf-2",
        statement: "Das Fehlen einer klaren räumlichen Grenze führt laut Dr. Brandner häufig zu Schlafstörungen.",
        isTrue: true,
        explanation: "Richtig: Sie nennt permanente Erreichbarkeit und schleichende Schlafstörungen als Folge.",
      },
      {
        id: "b2-tf-3",
        statement: "Studien belegen, dass Videokonferenzen spontane Kreativität besser fördern als Flurgespräche.",
        isTrue: false,
        explanation: "Falsch: Sie betont, dass kreative Ideen eben nicht in Zoom-Meetings, sondern am Kaffeeautomaten entstehen.",
      },
      {
        id: "b2-tf-4",
        statement: "Dr. Brandner plädiert für eine vollständige Abschaffung aller Homeoffice-Möglichkeiten.",
        isTrue: false,
        explanation: "Falsch: Sie empfiehlt ein hybrides Modell mit 2-3 Tagen Präsenz und Heimarbeit.",
      },
      {
        id: "b2-tf-5",
        statement: "An Präsenztagen sollten primär gemeinsame Teamaktivitäten und Workshops stattfinden.",
        isTrue: true,
        explanation: "Richtig: An diesen Tagen sollen 'Teambuilding, kreative Workshops und strategische Planungen im Mittelpunkt stehen.'",
      },
    ],
  },
];

export const B2_SCHREIBEN_SIMULATION: ExamSchreibenSimulationTask[] = [
  {
    id: "de-b2-sim-schreiben-1",
    part: 1,
    title: "Offizieller Prüfungsteil: Beschwerdebrief — Mangelhafter Hotelaufenthalt",
    theme: "Hotelurlaub & Geschäftsreise (telc Deutsch B2 Prüfungsstandard)",
    scenario:
      "Sie haben für Ihre Abteilung ein viertägiges Firmenseminar im Tagungshotel 'Alpenblick' in Garmisch gebucht. Vor Ort entsprachen weder die Tagungstechnik noch die Unterbringung der vertraglichen Vereinbarung: Der Beamer war defekt, die Zimmer waren kalt und laut, und das versprochene Business-Buffet fiel aus.",
    requirements: [
      "Nennen Sie den konkreten Anlass des Schreibens und die Buchungsdaten.",
      "Beschreiben Sie die aufgetretenen Mängel detailliert und stellen Sie den Kontrast zur Hotelbroschüre dar.",
      "Schildern Sie die unzureichende Reaktion des Managements vor Ort.",
      "Fordern Sie eine angemessene Preisminderung (30-40%) sowie eine schriftliche Stellungnahme mit Zahlungsfrist.",
    ],
    min_words: 160,
    time_minutes: 45,
    rubric: [
      { critere: "I. Erfüllung der Aufgabenstellung (Vollständigkeit aller 4 Leitpunkte)", points: 25 },
      { critere: "II. Textkohärenz, logischer Gedankenaufbau und Absatzstruktur", points: 25 },
      { critere: "III. Wortschatz und idiomatische Angemessenheit auf B2-Niveau", points: 25 },
      { critere: "IV. Grammatische Richtigkeit (Morphosyntax, Satzbau, Orthografie)", points: 25 },
    ],
    sampleSolution:
      "Sehr geehrte Damen und Herren,\n\nim Namen unseres Unternehmens möchte ich hiermit formell Beschwerde über den viertägigen Aufenthalt unserer Arbeitsgruppe im Hotel 'Alpenblick' vom 10. bis zum 14. September einlegen (Buchungsnummer: AB-7491-B).\n\nWir hatten Ihr Haus bewusst gewählt, weil Sie auf Ihrer Internetpräsenz mit hochmoderner Tagungstechnik und ruhigen Komfortzimmern für anspruchsvolle Firmenkunden werben. Die Realität vor Ort stand jedoch in eklatantem Widerspruch zu diesen Zusicherungen. Der Konferenzraum verfügte über keinen funktionierenden Beamer, sodass unsere geplanten Präsentationen erst nach dreistündiger Verzögerung provisorisch starten konnten. Zudem funktionierte die Heizung in den Hotelzimmern unserer Referenten bei winterlichen Außentemperaturen nicht, und der anhaltende Lärm von Renovierungsarbeiten im Nachbartrakt machte konzentriertes Arbeiten unmöglich. Das vertraglich vereinbarte Business-Lunch wurde kurzerhand durch kalte Snacks ersetzt.\n\nAls wir die Hotelleitung am zweiten Tag auf diese Missstände hinwiesen, reagierte das Personal unkooperativ und wies jegliche Verantwortung mit Verweis auf Handwerkermangel zurück. Eine solche Gleichgültigkeit gegenüber Geschäftskunden ist inakzeptabel.\n\nAufgrund der gravierenden Leistungsdefizite fordern wir eine Preisminderung von 35 Prozent auf den Gesamtbetrag in Höhe von 1.680 Euro. Bitte überweisen Sie den Differenzbetrag bis zum 15. Oktober auf unser Geschäftskonto. Sollte die Frist fruchtlos verstreichen, behalten wir uns rechtliche Schritte vor.\n\nMit freundlichen Grüßen,\nMartina Weber\nLeiterin Personalentwicklung",
    usefulPhrases: [
      "Sehr geehrte Damen und Herren,",
      "Hiermit lege ich formell Beschwerde über... ein.",
      "In Ihrer Hotelbroschüre werben Sie ausdrücklich mit...",
      "Die Realität vor Ort stand in eklatantem Widerspruch zu Ihren Zusicherungen.",
      "Hinzu kam, dass...",
      "Als wir das Hotelpersonal auf diese Missstände hinwiesen, reagierte man abweisend.",
      "Aufgrund dieser gravierenden Mängel fordere ich eine angemessene Preisminderung von...",
      "Bitte überweisen Sie den Betrag bis zum [Datum] auf mein Konto.",
      "Mit freundlichen Grüßen,",
    ],
  },
];

export const B2_SPRECHEN_SIMULATION: ExamSprechenSimulationTask[] = [
  {
    id: "de-b2-sim-sprechen-1",
    part: 3,
    title: "Teil 3: Gemeinsam etwas planen — « Besuch im Kinderkrankenhaus »",
    durationMinutes: 6,
    instructions:
      "Gemeinsam mit Ihrem Prüfungspartner möchten Sie kranken Kindern in einer städtischen Kinderklinik eine Freude bereiten. Planen Sie das Vorhaben Schritt für Schritt. Gemäß den offiziellen Prüfungsrichtlinien umfasst die Aktion sowohl MATERIELLE HILFE (Spenden/Geschenke) als auch AKTIVITÄTEN/UNTERHALTUNG vor Ort. Finden Sie eine gemeinsame Lösung für alle 4 Punkte.",
    topic: "Organisation eines Besuchstags im Kinderkrankenhaus",
    partnerTask:
      "Ihr Partner hat eigene Vorschläge bezüglich Geschenken und Aktivitäten. Begründen Sie Ihre Meinung, wägen Sie Vor- und Nachteile ab und treffen Sie konkrete Vereinbarungen.",
    prompts: [
      "1. Materielle Unterstützung: Welche Spenden (Bücher, Bastelsets, Malsachen, therapeutische Kuscheltiere) sollen gesammelt werden? Wer organisiert die Anschaffung?",
      "2. Aktivitäten & Unterhaltung: Was machen wir vor Ort mit den Kindern? (Märchen vorlesen, gemeinsames Zaubern/Musik machen, kleine Theateraufführung)",
      "3. Hygiene & Klinikregeln: Rücksprache mit Ärzten, Desinfektion der Spielsachen und Berücksichtigung der Belastbarkeit der Kinder",
      "4. Zeitplan & Aufgabenverteilung: Wann findet die Aktion statt und wer übernimmt welche Vorbereitungen?",
    ],
    essentialRedemittel: [
      {
        category: "Initiative ergreifen & Vorschläge einbringen",
        phrases: [
          "Lassen Sie uns zunächst überlegen, wie wir den Kindern sowohl materiell als auch emotional eine Freude machen können.",
          "Ich schlage vor, dass wir neben Sachspenden auch ein kleines Unterhaltungsprogramm einstudieren.",
          "Wäre es denkbar, dass wir Bastelmaterialien und Bücher besorgen?",
          "Meines Erachtens sollten wir unbedingt mit der Klinikleitung klären, welche Materialien überhaupt zulässig sind.",
        ],
      },
      {
        category: "Abwägen & Gegenargumente formulieren",
        phrases: [
          "Das ist zwar eine schöne Idee, aber wir müssen die strengen Hygienevorschriften beachten.",
          "Bei Kuscheltieren bin ich skeptisch, da sie desinfizierbar sein müssen; Malbücher wären wohl unproblematischer.",
          "Ein Theaterstück könnte für die geschwächten Kinder zu anstrengend sein; Vorlesen fände ich schonender.",
          "Da haben Sie natürlich recht, daran hatte ich noch nicht gedacht.",
        ],
      },
      {
        category: "Konsens & Aufgabenverteilung festlegen",
        phrases: [
          "Können wir uns darauf verständigen, dass wir beides kombinieren: Geschenkübergabe und kurzes Vorlesen?",
          "Einverstanden! Dann übernehme ich die Kontaktaufnahme mit der Pflegedienstleitung.",
          "Würden Sie sich im Gegenzug um das Spendensammeln im Sprachkurs kümmern?",
          "Damit haben wir alle wesentlichen Punkte geklärt.",
        ],
      },
    ],
    evaluationCriteria: [
      "Integration beider Säulen: Materielle Sachspenden UND Vor-Ort-Aktivitäten",
      "Strukturierte Gesprächsführung und Eingehen auf Gegenargumente",
      "Präziser Wortschatz zu Organisation, Gesundheit und Pädagogik",
      "Grammatikalische Korrektheit (Konjunktiv II, Passiv, Nebensätze mit Konnektoren)",
    ],
  },
];

// =============================================================================
// NIVEAU C1 — GOETHE / TELC HOCHSCHULE AUTHENTISCHE EXAMEN-DATEN
// =============================================================================

export const C1_MATCHING_LESEN: ExamMatchingLesenTask[] = [
  {
    id: "de-c1-match-1",
    part: 1,
    title: "Teil 1: Kernaussagen zuordnen — « Künstliche Intelligenz und kognitive Autonomie »",
    textType: "Wissenschaftliche Essays und philosophische Fachbeiträge",
    theme: "Epistemologie, KI und gesellschaftliche Transformation",
    instructions:
      "Lesen Sie die fünf Textabschnitte (1 bis 5) und die Kernaussagen A bis H. Welche Aussage spiegelt die These des jeweiligen Abschnitts am präzisesten wider? Drei Aussagen passen zu keinem Abschnitt.",
    texts: [
      "Die fortschreitende Delegation analytischer Denkprozesse an probabilistische Großrechenmodelle konstituiert eine beispiellose Verschiebung menschlicher Kognition. Wenn Synthese und Urteilsbildung automatisiert werden, droht eine schleichende Atrophie genuin hermeneutischer Fähigkeiten. Der Einzelne verliert zunehmend die Fertigkeit, komplexe semantische Ambiguitäten eigenständig auszuhalten und dialektisch zu durchdringen.",
      "Algorithmenbasierte Kurationssysteme generieren epistemische Echokammern, die das demokratische Diskurspotenzial nachhaltig untergraben. Indem sie Inhalte primär nach affektiver Erregungsintensität priorisieren, fragmentieren sie den gemeinsamen gesellschaftlichen Referenzrahmen. Wahrheit verkommt in diesem medialen Dispositiv zu einer Funktion algorithmengetriebener Aufmerksamkeitsökonomie.",
      "In der biomedizinischen Diagnostik offenbart generative KI bereits heute ein unübersehbares Potenzial zur Reduktion von Fehlbeurteilungen. Durch die simultane Aggregation weltweiter klinischer Studien und radiologischer Bilddaten übertreffen spezialisierte Netzwerke menschliche Experten in der Frühdetektion seltener Pathologien, was eine Demokratisierung hochqualitativer Medizin ermöglichen könnte.",
      "Die Diskussion um autonome Waffensysteme markiert die ethische Bruchlinie modernen Völkerrechts. Die Abtretung letaler Entscheidungsbefugnisse an mathematische Zieloptimierungsfunktionen entzieht den Akt des Tötens jeglicher menschlichen Rechenschaftspflicht. Es bedarf eines unverzüglichen, völkerrechtlich bindenden Moratoriums gegen vollständig autonome Kampfsysteme.",
      "Im Kunst- und Literaturbetrieb entzaubert künstliche Kreativität den romantischen Mythos des genialischen Schöpfers. Indem Maschinen stilistische Konventionen perfekt imitieren und neu kombinieren, zwingen sie uns zu einer radikalen Neudefinition von Originalität und ästhetischem Wert jenseits mechanischer Virtuosität.",
    ],
    headlines: [
      { id: "a", label: "Der drohende Verlust hermeneutischer Urteilskraft durch kognitives Outsourcing" },
      { id: "b", label: "Desintegration des öffentlichen Diskurses durch algorithmische Aufmerksamkeitsfilter" },
      { id: "c", label: "Diagnostische Präzisionsgewinne und Chancengleichheit im Gesundheitswesen" },
      { id: "d", label: "Die moralische Notwendigkeit eines Verbots autonomer Tötungstechnologien" },
      { id: "e", label: "Entmystifizierung des Schöpferbegriffs im Spiegel künstlicher Ästhetik" },
      { id: "f", label: "Finanzielle Monopolisierung generativer Modelle im Silicon Valley" },
      { id: "g", label: "Der rechtliche Status von Trainingsdaten im Urheberrecht" },
      { id: "h", label: "Die Verdrängung menschlicher Lehrkräfte an Universitäten" },
    ],
    answers: {
      "0": "a",
      "1": "b",
      "2": "c",
      "3": "d",
      "4": "e",
    },
    explanations: {
      "0": "Text 1 analysiert den Verlust kognitiver Fähigkeiten ('Verlust hermeneutischer Urteilskraft').",
      "1": "Text 2 analysiert Filterblasen und Diskursfragmente ('Desintegration des öffentlichen Diskurses').",
      "2": "Text 3 belegt medizinische Erfolge ('Diagnostische Präzisionsgewinne im Gesundheitswesen').",
      "3": "Text 4 fordert ein Verbot autonomer Waffen ('Verbot autonomer Tötungstechnologien').",
      "4": "Text 5 diskutiert Originalität in der Kunst ('Entmystifizierung des Schöpferbegriffs').",
    },
  },
];

export const C1_SPRACHBAUSTEINE: ExamSprachbausteineTask[] = [
  {
    id: "de-c1-sb-1",
    part: 1,
    title: "Teil 1: Wissenschaftliches Anschreiben — Antrag auf Forschungsförderung",
    theme: "Akademischer Stil, Funktionsverbgefüge und gehobene Syntax",
    instructions:
      "Wählen Sie für jede Lücke die stilistisch und grammatisch adäquate Wendung auf universitärem C1-Niveau aus.",
    parts: [
      "Sehr geehrte Damen und Herren des Gutachtergremiums,\n\nmit großem Interesse ",
      { n: 41, opts: ["bringe ich hiermit zur Kenntnis", "stelle ich hiermit den Antrag", "gebe ich bekannt"], correct: 1, explanation: "Wissenschaftliches Register: 'den Antrag auf Forschungsförderung stellen'." },
      " auf Gewährung einer Anschubfinanzierung für das interdisziplinäre Forschungsvorhaben 'Kognitive Resilienz im digitalen Zeitalter'.\n\nAngesichts der rasanten gesellschaftlichen Umbrüche ",
      { n: 42, opts: ["bedarf es", "bedarf", "wird benötigt"], correct: 0, explanation: "Unpersönliche Konstruktion mit Genitiv: 'bedarf es einer differenzierten Analyse'." },
      " einer differenzierten Reevaluation bestehender theoretischer Modelle. Das beantragte Projekt zielt darauf ab, die psychologischen Adaptationsmechanismen jener Individuen ",
      { n: 43, opts: ["näher zu beleuchten", "besser anzuschauen", "näher beleuchten"], correct: 0, explanation: "Gehobenes Synonym für untersuchen mit 'zu': 'näher zu beleuchten'." },
      ", die beruflich einer permanenten Informationsflut ausgesetzt sind. Besonderes Augenmerk ",
      { n: 44, opts: ["wird hierbei gerichtet auf", "richtet man hier auf", "gilt hierbei"], correct: 0, explanation: "Passivische Funktionsverb-Konstruktion: 'Aufmerksamkeit / Augenmerk wird gerichtet auf + Akkusativ'." },
      " die Rekonfiguration synaptischer Verknüpfungen.\n\nDie methodische Konzeption ",
      { n: 45, opts: ["fußt auf", "stützt durch", "basiert von"], correct: 0, explanation: "Gehobene Rektion: 'fußen auf + Dativ'." },
      " einem multimethodischen Ansatz, welcher qualitative Experteninterviews mit neurobiologischen Messungen verknüpft. ",
      { n: 46, opts: ["In Anbetracht der Tatsache, dass", "Weil nun mal", "Nachdem nämlich"], correct: 0, explanation: "Kausale Einleitung im akademischen Nominalstil: 'In Anbetracht der Tatsache, dass'." },
      " erste Vorstudien signifikante Korrelationen aufweisen, erscheint eine vertiefte Untersuchung dringend geboten. Wir hoffen zuversichtlich, mit diesem Vorhaben neue Impulse für die präventive Gesundheitsförderung ",
      { n: 47, opts: ["in Gang zu setzen", "zur Rede zu stellen", "in Zweifel zu ziehen"], correct: 0, explanation: "Funktionsverbgefüge: 'einen Prozess / Impulse in Gang setzen'." },
      ".\n\nÜber eine wohlwollende Prüfung unseres Gesuchs ",
      { n: 48, opts: ["würden wir uns sehr freuen", "freuten wir uns", "hätten wir uns gefreut"], correct: 0, explanation: "Höflichkeitskonjunktiv II: 'würden wir uns sehr freuen'." },
      ".\n\nMit vorzüglicher Hochachtung,\nProf. Dr. Roland Vögele",
    ],
  },
];

export const C1_TRUE_FALSE_HOREN: ExamHorenTrueFalseTask[] = [
  {
    id: "de-c1-tf-horen-1",
    part: 2,
    title: "Teil 2: Akademischer Fachvortrag — Neurobiologie des Spracherwerbs im Alter",
    theme: "Neurolinguistik, kognitive Plastizität und Sprache",
    audioScenario: "Symposium für Kognitive Neurowissenschaften an der Universität Heidelberg",
    playCountMax: 2,
    script:
      "Meine sehr geehrten Kolleginnen und Kollegen. Im Zentrum unseres heutigen Vortrags steht das Phänomen der adulten neuronalen Plastizität beim Zweitspracherwerb. Jahrzehntelang galt die Lenneberg’sche 'Critical Period Hypothesis' als unumstößliches Paradigma: Nach Einsetzen der Pubertät sei das Gehirn aufgrund fortschreitender Lateralisierung unfähig, phonetische und tiefensyntaktische Strukturen nativitätsnah abzubilden.\n\nJüngste Längsschnittstudien unter Einsatz funktioneller Magnetresonanztomographie zwingen uns jedoch zu einer grundlegenden Revision dieser Lehrmeinung. Zwar lässt sich nicht bestreiten, dass Kinder morphologische Paradigmen impliziter assimilieren. Doch adulte Probanden, die hochintensiven immersiven Lernkontexten ausgesetzt waren, zeigten eine erstaunliche synaptische Reorganisation präfrontaler und temporaler Kortexareale. Entscheidend ist hierbei nicht das kalendarische Alter, sondern das Ausmaß kognitiver Elaboration und der affektiven Valenz des Sprachkontakts. Es bedarf folglich einer Abkehr von rein biologisch deterministischen Restriktionsmodellen.",
    statements: [
      {
        id: "c1-tf-1",
        statement: "Die historische Hypothese ging von einem irreversiblen Verlust des perfekten Spracherwerbs nach der Pubertät aus.",
        isTrue: true,
        explanation: "Richtig: Der Referent erläutert die Lenneberg'sche Hypothese der kritischen Periode.",
      },
      {
        id: "c1-tf-2",
        statement: "Moderne fMRT-Untersuchungen bestätigen die biologische Unveränderbarkeit des adulten Sprachzentrums.",
        isTrue: false,
        explanation: "Falsch: Die Studien zwingen zu einer Revision und belegen erstaunliche Reorganisation.",
      },
      {
        id: "c1-tf-3",
        statement: "Die Intensität der kognitiven und emotionalen Sprachnutzung ist wichtiger als das Lebensalter.",
        isTrue: true,
        explanation: "Richtig: 'Entscheidend ist hierbei nicht das kalendarische Alter, sondern das Ausmaß kognitiver Elaboration...'",
      },
    ],
  },
];

export const C1_SCHREIBEN_SIMULATION: ExamSchreibenSimulationTask[] = [
  {
    id: "de-c1-sim-schreiben-1",
    part: 1,
    title: "Offizieller Prüfungsteil: Wissenschaftliche Stellungnahme (Erörterung)",
    theme: "Arbeitswelt der Zukunft: Entgrenzung der Arbeit und Postwachstum",
    scenario:
      "Verfassen Sie einen fundierten, akademisch formulierten Aufsatz zu der These: 'Die fortschreitende Digitalisierung führt nicht zur Emanzipation der Erwerbstätigen, sondern zu einer totalen Entgrenzung von Arbeit und Leben.'",
    requirements: [
      "Definieren Sie das soziologische Phänomen der 'Entgrenzung der Arbeit' differenziert.",
      "Stellen Sie dialektisch Vorzüge (Autonomie, Flexibilität) den pathologischen Risiken (Selbstausbeutung, Burnout) gegenüber.",
      "Leiten Sie handlungsorientierte Regulierungsmechanismen für Gesetzgeber und Unternehmen ab.",
      "Formulieren Sie ein prägnantes, theoriegeleitetes Schlussfazit im gehobenen Nominalstil.",
    ],
    min_words: 220,
    time_minutes: 60,
    rubric: [
      { critere: "I. Inhaltliche Differenziertheit, Stringenz der Argumentation und Kohärenz", points: 25 },
      { critere: "II. Wissenschaftliche Textarchitektur und logische Konnektivität", points: 25 },
      { critere: "III. Akademisches Register (Nominalstil, Funktionsverbgefüge, Fachterminologie)", points: 25 },
      { critere: "IV. Syntaktische Komplexität und morphologische Fehlerfreiheit", points: 25 },
    ],
    sampleSolution:
      "Die Transformation der postfordistischen Arbeitsordnung im Zuge ubiquitärer digitaler Konnektivität hat eine tiefgreifende Entgrenzung von Erwerbstätigkeit und Privatsphäre herbeigeführt. Der Begriff der Entgrenzung markiert hierbei das sukzessive Verschwimmen raumzeitlicher und sozialer Barrieren, welche historisch durch den physischen Betriebsort und fixe Arbeitszeitkorridore institutionalisiert waren.\n\nBefürworter agiler Arbeitsformen postulieren regelmäßig einen signifikanten Autonomiegewinn. Die Möglichkeit ortsunabhängiger Leistungserbringung erlaube eine bedürfnisorientierte Souveränität über die eigene Lebenszeit. Empirische Arbeitsanalysen offenbaren jedoch eine dialektische Verkehrung dieser Prämisse: Die scheinbare Freiheit schlägt häufig in internalisierte Selbstausbeutung um. Wer sein Büro permanent in der Hosentasche mit sich führt, unterliegt dem diffusen normativen Zwang permanenter Vigilanz und Reaktionsbereitschaft.\n\nUm den daraus resultierenden pathologischen Überlastungsmustern wirksam zu begegnen, bedarf es regulatorischer Grenzziehungen. Ein gesetzlich kodifiziertes Recht auf Nichterreichbarkeit stellt hierbei eine unabdingbare Notwendigkeit dar. Gleichzeitig müssen Unternehmen eine Führungskultur etablieren, die Leistung nicht an permanenter digitaler Präsenz, sondern an qualitativen Arbeitsergebnissen misst.\n\nZusammenfassend lässt sich konstatieren, dass Flexibilität ohne institutionelle Einhegung nicht emanzipatorisch, sondern regressiv wirkt. Erst die bewusste Setzung zeitlicher Schutzräume garantiert die physische und psychische Integrität der Erwerbstätigen im 21. Jahrhundert.",
    usefulPhrases: [
      "Es steht außer Frage, dass...",
      "Bei genauerer Betrachtung offenbart sich jedoch die Kehrseite...",
      "Im Lichte dieser soziologischen Befunde lässt sich konstatieren, dass...",
      "Dies fungiert gewissermaßen als Katalysator für...",
      "Zusammenfassend drängt sich der Schluss auf, dass...",
    ],
  },
];

export const C1_SPRECHEN_SIMULATION: ExamSprechenSimulationTask[] = [
  {
    id: "de-c1-sim-sprechen-1",
    part: 1,
    title: "Teil 1: Komplexer Impulsvortrag und dialektische Diskussion",
    durationMinutes: 8,
    instructions:
      "Halten Sie einen fünfminütigen wissenschaftlichen Kurzvortrag zu einem kontroversen Gesellschaftsthema und leiten Sie anschließend die Fachdiskussion mit der Prüfungskommission.",
    topic: "Wirtschaftswachstum versus planetare Grenzen: Ist eine Postwachstumsökonomie umsetzbar?",
    prompts: [
      "These: Das Dogma unendlichen BIP-Wachstums kollidiert unweigerlich mit ökologischer Resilienz.",
      "Kritische Beleuchtung des Konzepts des 'Grünen Wachstums' (Rebound-Effekte).",
      "Soziale und institutionelle Transformationskosten eines Degrowth-Modells.",
      "Synthese und Zukunftsperspektiven.",
    ],
    essentialRedemittel: [
      {
        category: "Strukturierung & wissenschaftliche Thesenbildung",
        phrases: [
          "Ausgangspunkt meiner Überlegungen ist die Feststellung, dass...",
          "Es gilt in diesem Zusammenhang sorgfältig zu differenzieren zwischen...",
          "Empirische Untersuchungen stützen die Annahme, dass...",
          "Dem ist freilich die fundamentale Kritik entgegenzuhalten, dass...",
        ],
      },
    ],
    evaluationCriteria: [
      "Höchste sprachliche Gewandtheit und nuancierte Argumentation",
      "Souveräner Einsatz komplexer Satzstrukturen und Fachlexik",
      "Schlagfertigkeit und Eloquenz in der anschließenden Diskussion",
    ],
  },
];

// =============================================================================
// NIVEAU A1 & A2 — BASIS-SIMULATIONEN FÜR NIVEAUISOLATION
// =============================================================================

export const A1_MATCHING_LESEN: ExamMatchingLesenTask[] = [
  {
    id: "de-a1-match-1",
    part: 1,
    title: "Teil 1: Zuordnung — Kurze Alltagsschilderungen",
    textType: "Kurznachrichten und Aushänge",
    theme: "Alltag, Einkaufen und Familie",
    instructions: "Welche Überschrift (A bis E) passt zu welchem Text (1 bis 3)? Zwei Überschriften passen nicht.",
    texts: [
      "Hallo Anna, ich bin im Supermarkt. Wir brauchen noch Milch, Brot und Obst für das Frühstück morgen. Kannst du Butter mitbringen?",
      "Sehr geehrte Kunden, unsere Bäckerei bleibt am Montag wegen Renovierungsarbeiten geschlossen. Ab Dienstag sind wir wieder da.",
      "Liebe Nachbarn, am Samstag feiere ich meinen Geburtstag ab 19 Uhr im Garten. Es könnte etwas lauter werden. Kommen Sie gerne vorbei!",
    ],
    headlines: [
      { id: "a", label: "Einkaufszettel für das Frühstück" },
      { id: "b", label: "Vorübergehende Schließung des Geschäfts" },
      { id: "c", label: "Einladung zum Geburtstagsfest" },
      { id: "d", label: "Wohnung zu vermieten" },
      { id: "e", label: "Zugverspätung nach Berlin" },
    ],
    answers: { "0": "a", "1": "b", "2": "c" },
    explanations: {
      "0": "Text 1 handelt vom Einkaufen für das Frühstück.",
      "1": "Text 2 informiert über Schließung am Montag.",
      "2": "Text 3 ist eine Geburtstagseinladung an Nachbarn.",
    },
  },
];

export const A1_SPRACHBAUSTEINE: ExamSprachbausteineTask[] = [
  {
    id: "de-a1-sb-1",
    part: 1,
    title: "Teil 1: Kurze Notiz — Treffen mit Peter",
    theme: "Freizeit & Termine",
    instructions: "Wählen Sie das passende Wort (a, b oder c) für die Lücken.",
    parts: [
      "Hallo Peter,\n\nwir treffen uns ",
      { n: 1, opts: ["am", "im", "um"], correct: 0, explanation: "Wochentage stehen mit 'am': am Samstag." },
      " Samstag um 14 Uhr. Hast du ",
      { n: 2, opts: ["Zeit", "Uhr", "Tag"], correct: 0, explanation: "Feste Redewendung: 'Zeit haben'." },
      "? Wir können im Park spazieren ",
      { n: 3, opts: ["gehen", "geht", "gegangen"], correct: 0, explanation: "Infinitiv nach Modalverb 'können': 'gehen'." },
      ".\n\nViele Grüße,\nMarc",
    ],
  },
];

export const A1_TRUE_FALSE_HOREN: ExamHorenTrueFalseTask[] = [
  {
    id: "de-a1-tf-horen-1",
    part: 1,
    title: "Teil 1: Durchsage am Hauptbahnhof",
    theme: "Reisen & Verkehr",
    audioScenario: "Lautsprecherdurchsage am Gleis 4",
    playCountMax: 2,
    script:
      "Achtung an Gleis 4. Der Intercity-Express nach München über Nürnberg, planmäßige Abfahrt um 10 Uhr 15, fährt heute mit einer Verspätung von etwa zwanzig Minuten ein. Grund dafür ist eine technische Störung am Triebfahrzeug. Wir bitten alle Reisenden um Entschuldigung.",
    statements: [
      { id: "a1-tf-1", statement: "Der Zug fährt nach München.", isTrue: true, explanation: "Richtig: 'Intercity-Express nach München'." },
      { id: "a1-tf-2", statement: "Der Zug ist pünktlich.", isTrue: false, explanation: "Falsch: Er hat etwa 20 Minuten Verspätung." },
    ],
  },
];

export const A1_SCHREIBEN_SIMULATION: ExamSchreibenSimulationTask[] = [
  {
    id: "de-a1-sim-schreiben-1",
    part: 1,
    title: "Schreiben Teil 2: Kurze Nachricht an eine Freundin",
    theme: "Einladung und Verabredung",
    scenario: "Schreiben Sie eine kurze E-Mail an Ihre Freundin Sarah: Bedanken Sie sich für die Einladung, sagen Sie, dass Sie kommen, und fragen Sie nach der Uhrzeit.",
    requirements: ["Dank für Einladung", "Zusage", "Frage nach Uhrzeit"],
    min_words: 30,
    time_minutes: 15,
    rubric: [
      { critere: "Aufgabenbewältigung", points: 25 },
      { critere: "Verständlichkeit & Struktur", points: 25 },
      { critere: "Wortschatz A1", points: 25 },
      { critere: "Grammatische Grundregeln", points: 25 },
    ],
    sampleSolution: "Liebe Sarah, vielen Dank für deine Einladung zu deiner Party. Ich komme sehr gern! Um wie viel Uhr fängt die Feier an? Bis Samstag! Liebe Grüße, Thomas",
    usefulPhrases: ["Liebe Sarah,", "Vielen Dank für...", "Ich komme gern.", "Bis bald!"],
  },
];

export const A1_SPRECHEN_SIMULATION: ExamSprechenSimulationTask[] = [
  {
    id: "de-a1-sim-sprechen-1",
    part: 1,
    title: "Teil 1: Sich vorstellen (Name, Herkunft, Wohnort, Beruf)",
    durationMinutes: 3,
    instructions: "Stellen Sie sich kurz vor und beantworten Sie zwei Nachfragen des Prüfers.",
    topic: "Persönliche Vorstellung",
    prompts: ["Name & Alter", "Land & Wohnort", "Beruf & Familie", "Hobbys"],
    essentialRedemittel: [
      {
        category: "Vorstellung",
        phrases: ["Ich heiße...", "Ich komme aus...", "Ich wohne in...", "Ich bin von Beruf..."],
      },
    ],
    evaluationCriteria: ["Aussprache", "Vollständigkeit", "Verständlichkeit"],
  },
];

// A2 Task Exports
export const A2_MATCHING_LESEN: ExamMatchingLesenTask[] = [
  {
    id: "de-a2-match-1",
    part: 1,
    title: "Teil 1: Zuordnung — Freizeitangebote und Veranstaltungen",
    textType: "Freizeitmagazin Aushänge",
    theme: "Freizeit, Sport und Ausflüge",
    instructions: "Welche Anzeige passt zu welcher Person? Wählen Sie für jeden Text die richtige Anzeige.",
    texts: [
      "Herr Klein möchte am Wochenende mit seinem 8-jährigen Sohn schwimmen lernen und Wasserspiele machen.",
      "Frau Berger sucht einen entspannten Kochkurs für italienische Pasta an einem Freitagabend.",
      "Familie Schmidt sucht eine geführte Fahrradtour durch den Stadtwald mit Picknick.",
    ],
    headlines: [
      { id: "a", label: "Spaßbad 'Platsch': Kinderschwimmkurse samstags ab 10 Uhr" },
      { id: "b", label: "Volkshochschule: Frische Pasta selbstgemacht (freitags 18 Uhr)" },
      { id: "c", label: "Fahrrad-Club: Naturtour für Groß und Klein im Stadtwald" },
      { id: "d", label: "Fotokurs für Fortgeschrittene" },
    ],
    answers: { "0": "a", "1": "b", "2": "c" },
    explanations: {
      "0": "Herr Klein und Sohn -> Spaßbad Kinderschwimmkurs (A).",
      "1": "Frau Berger -> Pastakurs freitags (B).",
      "2": "Familie Schmidt -> Natur-Fahrradtour (C).",
    },
  },
];

export const A2_SPRACHBAUSTEINE: ExamSprachbausteineTask[] = [
  {
    id: "de-a2-sb-1",
    part: 1,
    title: "Teil 1: E-Mail — Urlaubsgrüße von der Ostsee",
    theme: "Reisen & Urlaub",
    instructions: "Wählen Sie das passende Wort (a, b oder c).",
    parts: [
      "Liebe Maria,\n\nviele Grüße ",
      { n: 1, opts: ["aus", "von", "in"], correct: 1, explanation: "Grüße von einem Ort: 'Grüße von der Ostsee'." },
      " der Ostsee! Das Wetter ist herrlich und wir gehen jeden Tag ",
      { n: 2, opts: ["schwimmen", "schwimmt", "geschwommen"], correct: 0, explanation: "Infinitiv nach 'gehen': 'schwimmen gehen'." },
      ". Das Hotel liegt direkt ",
      { n: 3, opts: ["am", "im", "auf"], correct: 0, explanation: "Lokale Präposition: 'am Strand' (an dem Strand)." },
      " Strand. Gestern haben wir eine lange Fahrradtour ",
      { n: 4, opts: ["gemacht", "machten", "machen"], correct: 0, explanation: "Perfekt mit haben: 'haben eine Tour gemacht'." },
      ".\n\nBis bald,\nJulia",
    ],
  },
];

export const A2_TRUE_FALSE_HOREN: ExamHorenTrueFalseTask[] = [
  {
    id: "de-a2-tf-horen-1",
    part: 1,
    title: "Teil 1: Telefonische Auskunft beim Arzt",
    theme: "Gesundheit & Termine",
    audioScenario: "Anrufbeantworter der Praxis Dr. Weber",
    playCountMax: 2,
    script:
      "Guten Tag. Sie sind verbunden mit der Praxis Dr. Weber in Köln. Unsere Praxis ist heute wegen einer Fortbildung ab 12 Uhr geschlossen. In dringenden Notfällen wenden Sie sich bitte an den ärztlichen Bereitschaftsdienst unter der Telefonnummer 116 117. Am morgigen Donnerstag sind wir ab 8 Uhr wieder für Sie erreichbar.",
    statements: [
      { id: "a2-tf-1", statement: "Die Praxis ist heute den ganzen Tag geöffnet.", isTrue: false, explanation: "Falsch: Sie schließt ab 12 Uhr." },
      { id: "a2-tf-2", statement: "Morgen öffnet die Praxis wieder um 8 Uhr.", isTrue: true, explanation: "Richtig: 'Am morgigen Donnerstag sind wir ab 8 Uhr wieder erreichbar.'" },
    ],
  },
];

export const A2_SCHREIBEN_SIMULATION: ExamSchreibenSimulationTask[] = [
  {
    id: "de-a2-sim-schreiben-1",
    part: 1,
    title: "Schreiben Teil 1: E-Mail an den Vermieter",
    theme: "Wohnen und Reparaturmeldung",
    scenario: "In Ihrer Wohnung tropft der Wasserhahn in der Küche seit gestern. Schreiben Sie eine E-Mail an Ihren Vermieter Herrn Schuster.",
    requirements: ["Problem beschreiben", "Dringlichkeit erklären", "Um Termin für Handwerker bitten"],
    min_words: 50,
    time_minutes: 20,
    rubric: [
      { critere: "Aufgabenbewältigung", points: 25 },
      { critere: "Textaufbau & Höflichkeit", points: 25 },
      { critere: "Wortschatz A2", points: 25 },
      { critere: "Grammatische Richtigkeit", points: 25 },
    ],
    sampleSolution: "Sehr geehrter Herr Schuster, ich schreibe Ihnen, weil seit gestern der Wasserhahn in meiner Küche tropft. Das Wasser lässt sich nicht mehr ganz abdrehen. Könnten Sie bitte einen Handwerker schicken? Ich bin diese Woche jeden Nachmittag ab 15 Uhr zu Hause. Vielen Dank für Ihre Hilfe. Mit freundlichen Grüßen, Anna Bauer",
    usefulPhrases: ["Sehr geehrter Herr...", "Ich schreibe Ihnen, weil...", "Könnten Sie bitte...", "Mit freundlichen Grüßen"],
  },
];

export const A2_SPRECHEN_SIMULATION: ExamSprechenSimulationTask[] = [
  {
    id: "de-a2-sim-sprechen-1",
    part: 2,
    title: "Teil 2: Über das eigene Leben sprechen (Freizeit & Hobbys)",
    durationMinutes: 4,
    instructions: "Ziehen Sie eine Themenkarte und erzählen Sie über Ihre Hobbys und Ihre Wochenendgestaltung.",
    topic: "Freizeitgestaltung am Wochenende",
    prompts: ["Was machen Sie gern am Wochenende?", "Sport oder Erholung?", "Mit wem verbringen Sie Ihre Freizeit?"],
    essentialRedemittel: [
      { category: "Freizeit", phrases: ["Am Wochenende schlafe ich gern lange.", "Samstags treffe ich mich oft mit Freunden.", "Am liebsten gehe ich im Wald spazieren."] },
    ],
    evaluationCriteria: ["Zusammenhängendes Sprechen", "Wortschatz A2", "Flüssigkeit"],
  },
];
