import { Book, CEFRLevel, SupportedLanguage } from "../types";

export const BOOKS_DATABASE: Book[] = [
  // ==========================================================================
  // GERMAN (DEUTSCH) BOOKS BY CEFR LEVEL
  // ==========================================================================
  {
    id: "book-de-a1-1",
    title: "Ein Tag in Berlin",
    subtitle: "Une journée à Berlin — Récit d'apprentissage A1",
    originalTitle: "Ein Tag in Berlin: Alltag, Café und neue Freunde",
    author: "Klaus Lindner",
    language: "german",
    level: "A1",
    coverImage: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&auto=format&fit=crop&q=80",
    description: "Lucas arrive à Berlin pour la première fois. Suivez ses aventures simples et vivantes pour commander un café, s'orienter dans le métro et faire connaissance avec des étudiants berlinois.",
    summary: "Parfait pour les débutants A1 : phrases courtes au présent, vocabulaire du quotidien, salutations, repères dans l'espace et présentations personnelles.",
    estimatedMinutes: 15,
    tags: ["A1 Débutant", "Berlin", "Quotidien", "Café", "Transport"],
    totalWords: 750,
    chapters: [
      {
        id: "ch-1",
        title: "Kapitel 1: Ankunft am Hauptbahnhof",
        subtitle: "Arrivée à la gare centrale",
        audioText: "Es ist acht Uhr morgens. Lucas steht am Berliner Hauptbahnhof. Der Bahnhof ist sehr groß und modern. Überall sind Menschen. Lucas hat einen Rucksack und einen Stadtplan. Er sucht die U-Bahn. Entschuldigung, wo ist die Linie U55? fragt er einen Mann. Da drüben, geradeaus, antwortet der Mann freundlich. Lucas lächelt und sagt: Vielen Dank! Er ist glücklich, in Berlin zu sein.",
        vocabulary: [
          { word: "der Hauptbahnhof", translation: "la gare centrale", definition: "Gare principale d'une ville allemande" },
          { word: "der Rucksack", translation: "le sac à dos", definition: "Sac porté sur le dos" },
          { word: "geradeaus", translation: "tout droit", definition: "Indication de direction" },
          { word: "glücklich", translation: "heureux / content", definition: "Sentiment de joie" },
        ],
        content: `### Kapitel 1: Ankunft am Hauptbahnhof 🚆

Es ist acht Uhr morgens. **Lucas** steht am Berliner Hauptbahnhof. Der Bahnhof ist riesig, hell und sehr modern. Überall sind Menschen: Berufstätige mit Koffern, Touristen mit Kameras und Studenten mit Kopfhörern.

Lucas atmet tief ein. Er hat einen blauen **Rucksack** und einen Stadtplan auf seinem Smartphone. Heute beginnt sein Sprachaufenthalt in Deutschland.

Er sucht die U-Bahn-Station. Er geht zu einem Informationsschalter:

— *„Entschuldigung, guten Tag! Wo ist bitte die Linie U5 nach Alexanderplatz?“*, fragt er höflich.  
— *„Guten Tag! Gehen Sie einfach da drüben nach rechts und dann **geradeaus** die Treppe hinunter“*, antwortet die Beamtin mit einem freundlichen Lächeln.  
— *„Vielen herzlichen Dank! Einen schönen Tag noch!“*, sagt Lucas.

Lucas kauft eine Fahrkarte am Automaten. Das Display zeigt: *„Einzelfahrschein Berlin AB — 3,50 Euro“*. Er zahlt mit seiner Karte, entwertet das Ticket und steigt in den Zug ein. Berlin begrüßt ihn mit Sonnenschein.`,
      },
      {
        id: "ch-2",
        title: "Kapitel 2: Im gemütlichen Café am Kollwitzplatz",
        subtitle: "Dans le café chaleureux de Kollwitzplatz",
        audioText: "Lucas steigt am Prenzlauer Berg aus. Die Straßen sind ruhig und schön. Es gibt viele Bäume und kleine Geschäfte. Lucas hat Hunger und Durst. Er sieht ein schönes Café mit Tischen draußen. Er setzt sich an einen Tisch am Fenster. Eine Kellnerin kommt: Guten Morgen! Was möchten Sie bestellen? Lucas antwortet: Guten Morgen! Ich möchte bitte einen Kaffee mit Milch und ein Croissant. Sehr gerne, kommt sofort!",
        vocabulary: [
          { word: "bestellen", translation: "commander", definition: "Demander un plat ou une boisson" },
          { word: "gemütlich", translation: "chaleureux / douillet", definition: "Ambiance agréable et détendue" },
          { word: "die Rechnung", translation: "l'addition", definition: "Montant à régler" },
          { word: "zusammen", translation: "ensemble", definition: "Payer ensemble ou être ensemble" },
        ],
        content: `### Kapitel 2: Im gemütlichen Café am Kollwitzplatz ☕

Lucas steigt an der Station Eberswalder Straße aus. Er spaziert durch den Stadtteil Prenzlauer Berg. Die Altbauten haben bunte Fassaden und große Balkone.

Er hat Hunger und Durst nach der Reise. An der Ecke entdeckt er das Café *„Zimt & Zucker“*. Draußen stehen kleine Holztische unter Kastanienbäumen. Die Atmosphäre ist wunderbar **gemütlich**.

Lucas setzt sich an einen freien Tisch. Die Kellnerin kommt mit einer Speisekarte:

— *„Hallo! Was darf es sein?“*  
— *„Guten Tag! Ich möchte bitte einen großen Kaffee mit Hafermilch und ein Käsebrötchen **bestellen**.“*  
— *„Gerne! Möchten Sie das Brötchen warm oder kalt?“*  
— *„Warm, bitte. Danke!“*

Lucas schaut aus dem Fenster. Kinder fahren mit dem Roller vorbei, Nachbarn grüßen sich auf der Straße. Nach zwanzig Minuten winkt er der Kellnerin:

— *„Entschuldigung, kann ich bitte bezahlen?“*  
— *„Natürlich! Das macht zusammen 5 Euro 80.“*  
— *„Hier sind 7 Euro, das stimmt so!“*, sagt Lucas stolz auf sein Trinkgeld.  
— *„Vielen Dank, einen schönen Tag!“*`,
      },
      {
        id: "ch-3",
        title: "Kapitel 3: Das Treffen mit Hanna",
        subtitle: "La rencontre avec Hanna",
        audioText: "Am Nachmittag trifft Lucas seine Tandem-Partnerin Hanna vor dem Brandenburger Tor. Hanna studiert Geschichte an der Humboldt-Universität. Hallo Lucas! Willkommen in Berlin! sagt sie. Hallo Hanna! Schön, dich kennenzulernen! antwortet Lucas. Zusammen machen sie einen Spaziergang im Tiergarten. Sie sprechen Deutsch und Französisch. Lucas lernt viele neue Wörter. Berlin ist eine fantastische Stadt!",
        vocabulary: [
          { word: "das Treffen", translation: "la rencontre / le rendez-vous", definition: "Moment où l'on retrouve quelqu'un" },
          { word: "kennenlernen", translation: "faire la connaissance", definition: "Découvrir une personne pour la première fois" },
          { word: "der Spaziergang", translation: "la promenade", definition: "Marcher tranquillement pour le plaisir" },
          { word: "die Sehenswürdigkeit", translation: "le monument touristique", definition: "Lieu remarquable à visiter" },
        ],
        content: `### Kapitel 3: Das Treffen mit Hanna 🏛️

Um vierzehn Uhr steht Lucas vor dem imposanten **Brandenburger Tor**. Es ist das berühmteste Wahrzeichen der deutschen Hauptstadt.

Eine junge Frau mit braunen Haaren und einer grünen Jacke winkt ihm zu:

— *„Hallo Lucas! Bist du es?“*  
— *„Ja! Hallo Hanna! Freut mich sehr, dich persönlich **kennenzulernen**!“*  
— *„Willkommen in Berlin! Wie war deine Anreise?“*  
— *„Sehr gut, danke! Die Züge in Deutschland sind sehr pünktlich.“*

Hanna lacht: *„Manchmal jedenfalls! Komm, wir machen einen kleinen **Spaziergang** durch den Tiergarten.“*

Im Park sprechen sie über ihre Hobbys, ihre Familien und ihre Studienpläne. Hanna korrigiert Lucas geduldig, wenn er einen Artikel verwechselt.

— *„Dein Deutsch ist schon sehr verständlich, Lucas!“*, ermutigt sie ihn.  
— *„Danke, Hanna! Mit jedem Satz lerne ich ein bisschen mehr.“*

Am Abend verabschieden sie sich:  
— *„Bis morgen in der Sprachschule, Lucas!“*  
— *„Bis morgen, Hanna! Tschüss!“*

Lucas weiß nun: Diese Reise nach Berlin wird sein Leben verändern.`,
      },
    ],
  },
  {
    id: "book-de-a1-2",
    title: "Die neue Nachbarin",
    subtitle: "La nouvelle voisine — Mystère et amitié à Munich",
    originalTitle: "Die neue Nachbarin in Schwabing",
    author: "Martina Baumgartner",
    language: "german",
    level: "A1",
    coverImage: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&auto=format&fit=crop&q=80",
    description: "Dans un immeuble ancien de Munich, une mystérieuse pianiste emménage au 3e étage. Félix et son chien Waldi décident d'aller faire sa connaissance.",
    summary: "Vocabulaire du logement, des meubles, des instruments de musique et des conversations de bon voisinage en allemand débutant.",
    estimatedMinutes: 18,
    tags: ["A1 Débutant", "Munich", "Voisinage", "Musique", "Dialogue"],
    totalWords: 820,
    chapters: [
      {
        id: "ch-1",
        title: "Kapitel 1: Klaviermusik im Treppenhaus",
        subtitle: "Musique de piano dans l'escalier",
        audioText: "Felix wohnt im zweiten Stock eines Altbaus in München. Am Samstagmorgen hört er wunderschöne Musik. Jemand spielt Klavier im dritten Stock. Wer ist das? Die Wohnung war doch drei Monate lang leer. Felix nimmt seinen Hund Waldi und geht die Treppe hoch. An der Tür steht ein neues Namensschild: Elena Rossi.",
        vocabulary: [
          { word: "das Treppenhaus", translation: "la cage d'escalier", definition: "Espace commun comprenant les escaliers d'un immeuble" },
          { word: "die Wohnung", translation: "l'appartement", definition: "Lieu d'habitation" },
          { word: "wunderschön", translation: "magnifique", definition: "D'une grande beauté" },
        ],
        content: `### Kapitel 1: Klaviermusik im Treppenhaus 🎹

Felix wohnt seit drei Jahren in einem charmanten Altbau im Münchner Stadtteil Schwabing. Seine Wohnung im zweiten Stock ist hell und gemütlich.

Es ist Samstagvormittag, zehn Uhr. Felix kocht sich einen Tee in der Küche. Plötzlich hört er eine sanfte Melodie durch die Decke klingen. Jemand spielt Mozart auf dem Klavier!

Die Töne sind klar, präzise und **wunderschön**.

Felix wundert sich: Die Wohnung im dritten Stock stand doch den ganzen Winter über leer. Wer ist die neue Person da oben?

Sein Dackel Waldi spitzt die Ohren und bellt leise.  
— *„Komm, Waldi, wir gehen mal schauen!“*, sagt Felix neugierig.

Im **Treppenhaus** riecht es nach frischer Farbe und Lavendel. Felix geht die Holzstufen hinauf. Vor der Wohnungstür Nummer 8 stehen zwei große Umzugskartons mit italienischen Aufklebern.

Auf dem goldenen Klingelschild steht ein neuer Name:  
**Elena Rossi — Pianistin**.`,
      },
      {
        id: "ch-2",
        title: "Kapitel 2: Ein Willkommenskuchen",
        subtitle: "Un gâteau de bienvenue",
        audioText: "Felix backt am Nachmittag einen Apfelkuchen. In Bayern bringt man neuen Nachbarn gern eine kleine Überraschung mit. Felix klingelt an Elenas Tür. Elena öffnet: Guten Tag! Ich bin Elena. Felix lächelt: Hallo Elena, ich bin Felix von unten. Herzlich willkommen im Haus! Hier ist ein Apfelkuchen für Sie. Elena freut sich sehr: Oh, wie lieb! Kommen Sie doch bitte herein!",
        vocabulary: [
          { word: "klingeln", translation: "sonner", definition: "Actionner la sonnette à une porte" },
          { word: "hereinkommen", translation: "entrer", definition: "Franchir le seuil d'une maison" },
          { word: "überrascht", translation: "surpris", definition: "Étonné par un événement inattendu" },
        ],
        content: `### Kapitel 2: Ein Willkommenskuchen 🥧

Felix beschließt, eine deutsche Tradition zu pflegen: die Nachbarschaftshilfe. Seine Großmutter hat ihm das beste Rezept für bayerischen Apfelkuchen mit Zimt vererbt.

Um fünfzehn Uhr duftet das ganze Treppenhaus nach Äpfeln und Vanille. Felix legt den warmen Kuchen auf einen bunten Teller und geht nach oben.

Er drückt auf die Klingel. Ding-dong!

Die Tür öffnet sich. Eine junge Frau mit dunklen Locken und freundlichen Augen schaut ihn an:

— *„Buonasera... äh, guten Tag!“*, sagt sie etwas zögernd auf Deutsch.  
— *„Guten Tag! Ich bin Felix aus dem zweiten Stock. Herzlich willkommen in unserem Haus! Ich habe einen kleinen Apfelkuchen für Sie gebacken.“*

Elena schlägt die Hände zusammen vor Freude:  
— *„Mamma mia, wirklich? Das ist ja unglaublich nett! Bitte, **kommen Sie doch herein**! Ich koche gerade frischen Espresso.“*`,
      },
      {
        id: "ch-3",
        title: "Kapitel 3: Zwei Sprachen, eine Freundschaft",
        subtitle: "Deux langues, une amitié",
        audioText: "In Elenas Wohnzimmer steht ein großer schwarzer Flügel. Elena kommt aus Mailand. Sie studiert Musik an der Hochschule in München. Mein Deutsch ist noch nicht perfekt, sagt sie bescheiden. Felix antwortet: Dein Deutsch ist super! Und wenn du möchtest, können wir zusammen üben. Ab jetzt trinken sie jeden Samstag Kaffee zusammen.",
        vocabulary: [
          { word: "der Flügel", translation: "le piano à queue", definition: "Grand instrument de musique à cordes horizontales" },
          { word: "bescheiden", translation: "modeste", definition: "Qui ne fait pas étalage de ses qualités" },
          { word: "zusammen", translation: "ensemble", definition: "En compagnie l'un de l'autre" },
        ],
        content: `### Kapitel 3: Zwei Sprachen, eine Freundschaft 🤝

In Elenas Wohnzimmer dominiert ein prächtiger schwarzer Steinway-**Flügel**. Notenblätter liegen auf dem Notenständer: Bach, Beethoven, Chopin.

Elena schneidet den Kuchen an:  
— *„Mmh, fantastico! Der Kuchen schmeckt himmlisch, Felix!“*  
— *„Danke! Wie gefällt dir München bisher?“*, fragt Felix neugierig.  
— *„Sehr gut! Ich habe ein Stipendium an der Musikhochschule bekommen. Aber manchmal fehlen mir die Worte beim Einkaufen oder auf dem Amt.“*

Felix lacht: *„Die deutsche Bürokratie ist selbst für Deutsche schwer! Weißt du was? Ich helfe dir mit den deutschen Formularen und Grammatikregeln — und du spielst mir dafür manchmal etwas auf dem Klavier vor?“*

Elena strahlt: *„Das ist der beste Tausch meines Lebens! D'accordo, abgemacht!“*

So begann eine wunderbare deutsch-italienische Freundschaft mitten im Herzen von München.`,
      },
    ],
  },

  // ==========================================================================
  // LEVEL A2 GERMAN BOOKS
  // ==========================================================================
  {
    id: "book-de-a2-1",
    title: "Das Geheimnis der Zugspitze",
    subtitle: "Le mystère de la Zugspitze — Aventure dans les Alpes",
    originalTitle: "Das Geheimnis der Zugspitze",
    author: "Stefan Gruber",
    language: "german",
    level: "A2",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    description: "Deux étudiants partent en randonnée vers le plus haut sommet d'Allemagne. Quand un vieux carnet de 1930 est découvert dans un refuge, une passionnante quête commence.",
    summary: "Niveau A2 consolidé : passé composé (Perfekt), connecteurs de temps (als, wenn, während), prépositions mixtes et vocabulaire de la montagne et de la nature.",
    estimatedMinutes: 25,
    tags: ["A2 Intermédiaire", "Montagne", "Aventure", "Zugspitze", "Mystère"],
    totalWords: 1250,
    chapters: [
      {
        id: "ch-1",
        title: "Kapitel 1: Der Aufstieg ab Garmisch",
        subtitle: "L'ascension depuis Garmisch",
        audioText: "Die Zugspitze ist mit zweitausendneunhundertzweiundsechzig Metern der höchste Berg Deutschlands. Jonas und Sarah wandern durch das Höllental. Der Weg ist steil und steinig. Die Luft wird kühler, je höher sie steigen. Im Höllentalanger-Refugium trinken sie warmen Tee und bereiten sich auf den nächsten Tag vor.",
        vocabulary: [
          { word: "der Berggipfel", translation: "le sommet de la montagne", definition: "Point culminant d'une montagne" },
          { word: "die Berghütte", translation: "le refuge de montagne", definition: "Abri gardé pour les randonneurs" },
          { word: "der Rucksack", translation: "le sac à dos", definition: "Équipement essentiel du marcheur" },
        ],
        content: `### Kapitel 1: Der Aufstieg ab Garmisch 🏔️

Mit genau **2.962 Metern** ist die Zugspitze das Dach Deutschlands. Für Jonas und Sarah, zwei Geographiestudenten aus Augsburg, war diese Bergtour ein lang ersehnter Traum.

Früh morgens um sechs Uhr starteten sie bei der Klamm in Hammersbach. Der Weg führte durch das spektakuläre Höllental. Mächtige Felswände ragten links und rechts empor, während unter ihnen das Schmelzwasser tost und brauste.

— *„Schau mal nach oben, Sarah! Die Wolken verziehen sich, wir haben Kaiserwetter!“*, rief Jonas begeistert durch den Wind.  
— *„Hoffentlich bleibt es stabil. In den Bergen kann das Wetter innerhalb von dreißig Minuten umschlagen“*, mahnte Sarah vorsichtig.

Sie trugen feste Wanderschuhe, Klettersteiggurte und wetterfeste Jacken. Nach vier Stunden anstrengendem Aufstieg erreichten sie die Höllentalangerhütte.

Der Hüttenwirt Alois, ein wettergegerbter Bayer mit grauem Bart, empfing sie herzlich:  
— *„Grüß Gott beinand! Kommt erst mal rein in die warme Stube. Es gibt frischen Kaiserschmarrn und heiße Kräutertee!“*`,
      },
      {
        id: "ch-2",
        title: "Kapitel 2: Der Fund im alten Holzschrank",
        subtitle: "La découverte dans la vieille armoire",
        audioText: "Während draußen ein plötzlicher Sommerregen einsetzt, stöbert Jonas im Dachgeschoss der Hütte. Hinter alten Büchern entdeckt er ein kleines Lederbuch mit vergilbten Seiten. Es ist ein Tagebuch aus dem Jahr neunzehnhundertvierunddreißig von einem Kartographen namens Friedrich Weimann.",
        vocabulary: [
          { word: "das Tagebuch", translation: "le journal intime / de bord", definition: "Cahier dans lequel on note ses observations" },
          { word: "die Handschrift", translation: "l'écriture manuscrite", definition: "Style d'écriture à la main" },
          { word: "verstecken", translation: "cacher", definition: "Mettre dans un endroit secret" },
        ],
        content: `### Kapitel 2: Der Fund im alten Holzschrank 📜

Gegen fünfzehn Uhr zog ein schweres Gewitter über das Wettersteingebirge. Donner hallte zwischen den Felsen wider. An einen Weiterweg zum Gipfel war heute nicht mehr zu denken.

Sarah las in der Gaststube einen Wanderführer, während Jonas die alte Bibliothek der Hütte im Obergeschoss durchstöberte. Zwischen verstaubten Geologiebänden fiel sein Blick auf einen Hohlraum hinter den Eichenregalen.

Darin lag eine verstaubte Metalldose. Mit zitternden Fingern öffnete Jonas den verrosteten Verschluss.

Zum Vorschein kam ein kleines braunes Lederheft:  
*„Expeditionsbericht Zugspitz-Platt — August 1934, gezeichnet Dr. Friedrich Weimann, königlicher Landvermesser“*.

Auf der dritten Seite las Jonas mit klopfendem Herzen:  
*„Unter dem dritten Felsvorsprung des Höllentalferners, genau siebzig Schritte östlich der Wetterstation, haben wir die meteorologischen Messgeräte und eine bronzene Zeitkapsel vergraben...“*

Jonas rannte die Treppe hinunter zu Sarah:  
— *„Sarah, du glaubst nicht, was ich gerade gefunden habe!“*`,
      },
    ],
  },

  // ==========================================================================
  // LEVEL B1 GERMAN BOOKS
  // ==========================================================================
  {
    id: "book-de-b1-1",
    title: "Der Traum vom Auswandern",
    subtitle: "Le rêve de l'émigration — Trajectoire professionnelle à Hambourg",
    originalTitle: "Der Traum vom Auswandern nach Hamburg",
    author: "Anja Vogel",
    language: "german",
    level: "B1",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    description: "Amir quitte son pays pour s'installer à Hambourg et travailler dans la logistique portuaire. Entre démarches administratives, défis linguistiques et amitiés hanséatiques, son intégration prend vie.",
    summary: "Niveau B1 complet : phrases complexes avec subordonnées (weil, obwohl, damit, dass), discours indirect au Konjunktiv I/II, vocabulaire professionnel et sociétal.",
    estimatedMinutes: 30,
    tags: ["B1 Seuil", "Hambourg", "Travail", "Intégration", "Port"],
    totalWords: 1600,
    chapters: [
      {
        id: "ch-1",
        title: "Kapitel 1: Der erste Tag in der Speicherstadt",
        subtitle: "Le premier jour dans la Speicherstadt",
        audioText: "Hamburg ist das Tor zur Welt. Der Hamburger Hafen ist der drittgrößte Containerhafen Europas. Amir steht auf der Poggenmühlenbrücke und blickt auf die roten Backsteingebäude der historischen Speicherstadt. Heute ist sein erster Arbeitstag bei der internationalen Logistikfirma Hanseatic Cargo.",
        vocabulary: [
          { word: "die Herausforderung", translation: "le défi / le challenge", definition: "Tâche difficile qui demande des efforts" },
          { word: "die Arbeitserlaubnis", translation: "le permis de travail", definition: "Autorisation officielle pour exercer une profession" },
          { word: "die Zuverlässigkeit", translation: "la fiabilité", definition: "Qualité d'une personne sur qui l'on peut compter" },
        ],
        content: `### Kapitel 1: Der erste Tag in der Speicherstadt ⚓

Der Hamburger Morgennebel lag wie ein feuchter Schleier über den Fleeten der historischen **Speicherstadt**. Amir zog seinen Kragen hoch. Der Wind von der Elbe blies eisig, aber in seiner Brust pochte die Aufregung.

Nach sechs Monaten intensivstem Deutschlernen am Goethe-Institut und unzähligen Formularen beim Ausländeramt hielt er nun stolz seinen Arbeitsvertrag in den Händen: Junior Operations Specialist bei *Hanseatic Cargo Logistics*.

Um acht Uhr betrat er das moderne Bürogebäude, das architektonisch geschickt in die neugotischen Backsteinspeicher integriert worden war.

— *„Moin Moin, Sie müssen Herr Al-Mansoor sein!“*, begrüßte ihn Frau Hansen, die Personalchefin, mit einem kräftigen hanseatischen Händedruck.  
— *„Guten Morgen, Frau Hansen. Ja, genau. Ich freue mich sehr, hier zu sein“*, erwiderte Amir auf sorgfältigem Hochdeutsch.  
— *„Bei uns im Norden reicht ein einfaches 'Moin' zu jeder Tages- und Nachtzeit!“*, schmunzelte sie. *„Kommen Sie, ich stelle Ihnen das Team vor.“*

Die größte **Herausforderung** war für Amir anfangs nicht die Fachsoftware, sondern das rasante Tempo, in dem seine Kollegen während der Besprechungen sprachen. Fachbegriffe wie *„Zollabfertigung“*, *„Lieferkettensicherheit“* und *„Hafenumschlag“* wirbelten durch den Konferenzraum. Doch Amir notierte jedes neue Wort akribisch in sein kleines Notizbuch.`,
      },
    ],
  },

  // ==========================================================================
  // LEVEL B2 GERMAN BOOKS
  // ==========================================================================
  {
    id: "book-de-b2-1",
    title: "Schatten über Heidelberg",
    subtitle: "Ombres sur Heidelberg — Intrigue académique et philosophique",
    originalTitle: "Schatten über Heidelberg: Ein Wissenschaftskrimi",
    author: "Prof. Dr. Heinrich von Weizsäcker",
    language: "german",
    level: "B2",
    coverImage: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&auto=format&fit=crop&q=80",
    description: "À l'Université de Heidelberg, la disparition d'un manuscrit philosophique inédit plonge deux chercheurs dans les secrets des sociétés savantes du XIXe siècle.",
    summary: "Niveau B2 avancé : tournures passives, participes présents/passés adjectivés, Konjunktiv II d'hypothèse, vocabulaire académique et éthique.",
    estimatedMinutes: 35,
    tags: ["B2 Avancé", "Heidelberg", "Philosophie", "Mystère", "Université"],
    totalWords: 1850,
    chapters: [
      {
        id: "ch-1",
        title: "Kapitel 1: Der Philosophenweg im Herbst",
        subtitle: "Le Chemin des Philosophes en automne",
        audioText: "Hoch über den Dächern von Heidelberg schlängelt sich der berühmte Philosophenweg. Von hier aus eröffnet sich ein unvergleichlicher Blick auf das Schloss, die Alte Brücke und den träge dahinfließenden Neckar. Dr. Miriam Bergner, Dozentin für Germanistik und Philosophie, eilte den Hang hinab.",
        vocabulary: [
          { word: "die Handschrift", translation: "le manuscrit", definition: "Document ancien rédigé à la main" },
          { word: "der Verdacht", translation: "le soupçon", definition: "Hypothèse concernant une action répréhensible" },
          { word: "die Abhandlung", translation: "le traité / mémoire scientifique", definition: "Texte d'analyse approfondie sur un sujet" },
        ],
        content: `### Kapitel 1: Der Philosophenweg im Herbst 🍂

Der goldene Oktober hatte die Hänge des Heiligenbergs in ein flammendes Farbenmeer verwandelt. Doch Dr. Miriam Bergner, Privatdozentin für Neuere Deutsche Literatur an der altehrwürdigen Ruprecht-Karls-Universität Heidelberg, hatte heute keinen Blick für die romantische Kulisse.

Vor kaum einer Stunde hatte sie im Universitätsarchiv eine erschütternde Entdeckung gemacht: Der Tresorraum C im Untergeschoss der Universitätsbibliothek war aufgebrochen worden. Aus dem Bestand des Nachlasses von 1888 fehlte ein Konvolut: die unveröffentlichten Vorlesungsmitschriften von Friedrich Nietzsche zu seiner unvollendeten Anthropologie.

Der Dekan hatte sofort interveniert:  
— *„Frau Bergner, wenn dieser Vorfall an die Presse gelangt, steht der internationale Ruf unserer Fakultät auf dem Spiel. Wir müssen diskret ermitteln, bevor die Landespolizei das gesamte Institut abriegelt.“*

Miriam dachte an die Worte ihres Mentors: Wer immer das Manuskript entwendet hatte, musste genaue Kenntnisse der internen Schließmechanismen besitzen. Der Täter stammte mit an Sicherheit grenzender Wahrscheinlichkeit aus den eigenen akademischen Reihen.`,
      },
    ],
  },

  // ==========================================================================
  // LEVEL C1/C2 GERMAN MASTERPIECES (Éditions annotées pour apprenants)
  // ==========================================================================
  {
    id: "book-de-c1-1",
    title: "Die Metamorphose (Franz Kafka)",
    subtitle: "La Métamorphose — Chef-d'œuvre annoté et contextualisé",
    originalTitle: "Die Verwandlung (1915)",
    author: "Franz Kafka (Édition Pédagogique)",
    language: "german",
    level: "C1",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "Le texte intégral du chef-d'œuvre de Kafka, enrichi d'annotations stylistiques, d'analyses métaphoriques et d'un lexique des expressions idiomatiques de la modernité viennoise.",
    summary: "Niveau C1 Maîtrise : syntaxe kafkaïenne magistrale, subordonnées imbriquées, ironie tragique et richesse stylistique incomparable.",
    estimatedMinutes: 45,
    tags: ["C1 Maîtrise", "Classique", "Kafka", "Littérature", "Prague"],
    totalWords: 2400,
    chapters: [
      {
        id: "ch-1",
        title: "Abschnitt 1: Das Erwachen des Gregor Samsa",
        subtitle: "Le réveil de Gregor Samsa",
        audioText: "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheuren Ungeziefer verwandelt. Er lag auf seinem panzerartig harten Rücken und sah, wenn er den Kopf ein wenig hob, seinen gewölbten, braunen, von bogenförmigen Versteifungen geteilten Bauch.",
        vocabulary: [
          { word: "das Ungeziefer", translation: "la vermine / l'insecte monstrueux", definition: "Créature répugnante et marginalisée" },
          { word: "die Verwandlung", translation: "la métamorphose", definition: "Transformation radicale de la forme et de la nature" },
          { word: "beschwerlich", translation: "pénible / laborieux", definition: "Difficile et exigeant de pénibles efforts" },
        ],
        content: `### Abschnitt 1: Das Erwachen des Gregor Samsa 🪲

*„Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheuren **Ungeziefer** verwandelt.“*

Er lag auf seinem panzerartig harten Rücken und sah, wenn er den Kopf ein wenig hob, seinen gewölbten, braunen, von bogenförmigen Versteifungen geteilten Bauch, auf dessen Höhe sich die Bettdecke, zum gänzlichen Niedergleiten bereit, kaum noch erhalten konnte. Seine vielen, im Vergleich zu seinem sonstigen Umfang kläglich dünnen Beine flimmerten ihm hilflos vor den Augen.

*„Was ist mit mir geschehen?“*, dachte er. Es war kein Traum.

Sein Zimmer, ein richtiges, nur etwas zu kleines Menschenzimmer, lag ruhig zwischen den vier wohlbekannten Wänden. Über dem Tisch, auf dem eine aufgeschnittene Musterkollektion von Tuchwaren ausgebreitet war — Samsa war Reisender —, hing das Bild, das er vor kurzem aus einer illustrierten Zeitschrift ausgeschnitten und in einen hübschen, vergoldeten Rahmen getan hatte.

Gregors Blick richtete sich dann zum Fenster, und das trübe Wetter — man hörte Regentropfen auf das Fensterblech aufschlagen — machte ihn ganz melancholisch.

*„Wie wäre es, wenn ich noch ein wenig weiterschliefe und alle Verrücktheiten vergäße?“*, dachte er, aber das war gänzlich unausführbar, denn er war gewohnt, auf der rechten Seite zu schlafen, konnte sich aber in seinem gegenwärtigen Zustand nicht in diese Lage bringen.`,
      },
    ],
  },

  // ==========================================================================
  // ITALIAN BOOKS FOR ITALIAN STUDENTS
  // ==========================================================================
  {
    id: "book-it-a1-1",
    title: "Una Giornata a Roma",
    subtitle: "Une journée à Rome — Récit d'apprentissage A1",
    originalTitle: "Una Giornata a Roma",
    author: "Gianluigi De Luca",
    language: "italian",
    level: "A1",
    coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
    description: "Marco visite Rome pour la première fois. Découvrez la ville éternelle à travers des dialogues simples au Colisée, dans un café de la piazza Navona et à la fontaine de Trevi.",
    summary: "Vocabulaire A1 italien : présent de l'indicatif, salutations, commandes au restaurant, repérage dans l'espace.",
    estimatedMinutes: 15,
    tags: ["A1 Débutant", "Roma", "Café", "Colosseo", "Italien"],
    totalWords: 720,
    chapters: [
      {
        id: "ch-1",
        title: "Capitolo 1: Arrivo a Roma Termini",
        subtitle: "Arrivée à la gare Termini",
        audioText: "Sono le nove del mattino. Marco arriva alla stazione Termini di Roma. La stazione è grande e piena di luce. Marco cerca la linea B della metropolitana. Buongiorno, dov'è la metro per il Colosseo? chiede a una guardia. È laggiù, dritto, risponde la guardia con un sorriso. Marco dice: Grazie mille e buona giornata!",
        vocabulary: [
          { word: "la stazione", translation: "la gare", definition: "Lieu d'arrivée des trains" },
          { word: "dritto", translation: "tout droit", definition: "Direction en ligne droite" },
          { word: "il sorriso", translation: "le sourire", definition: "Expression bienveillante du visage" },
        ],
        content: `### Capitolo 1: Arrivo a Roma Termini 🏛️

Sono le nove del mattino. Marco scende dal treno Frecciarossa alla stazione Termini di Roma. C'è un'energia vibrante nell'aria, profumo di espresso e rumore di valigie.

Marco ha uno zaino sulle spalle e tanta voglia di scoprire la capitale d'Italia.

Va verso il tabaccaio:  
— *„Buongiorno! Vorrei un biglietto per la metropolitana, per favore.“*  
— *„Certamente! Ecco a te, costa un euro e cinquanta centesimi.“*  
— *„Grazie mille! Dov'è l'ingresso della linea B?“*  
— *„Segui la linea blu sul pavimento, sempre **dritto** fino ai tornelli.“*

Marco ringrazia con un grande **sorriso** e sale sul vagone. Prossima fermata: Colosseo!`,
      },
    ],
  },
];

// Helper functions for reading progress persistence
const STORAGE_PREFIX = "linguaflow_reading_progress_";

// In-memory fallback map for non-browser/test environments
const inMemoryProgressMap = new Map<string, string>();

export function getSavedBookProgress(studentId: string, bookId: string): {
  lastChapterIndex: number;
  progressPercent: number;
  completed: boolean;
} {
  try {
    const key = `${STORAGE_PREFIX}${studentId}_${bookId}`;
    const raw = typeof localStorage !== "undefined"
      ? localStorage.getItem(key)
      : inMemoryProgressMap.get(key);

    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return { lastChapterIndex: 0, progressPercent: 0, completed: false };
}

export function saveBookProgress(
  studentId: string,
  bookId: string,
  chapterIndex: number,
  totalChapters: number
): void {
  try {
    const progressPercent = Math.min(
      100,
      Math.round(((chapterIndex + 1) / Math.max(1, totalChapters)) * 100)
    );
    const completed = progressPercent >= 100;
    const data = { lastChapterIndex: chapterIndex, progressPercent, completed };
    const serialized = JSON.stringify(data);
    const key = `${STORAGE_PREFIX}${studentId}_${bookId}`;

    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, serialized);
    } else {
      inMemoryProgressMap.set(key, serialized);
    }
  } catch (err) {
    console.debug("Failed to save book progress:", err);
  }
}

export function getBooksForStudent(language: SupportedLanguage, level?: CEFRLevel): Book[] {
  const langBooks = BOOKS_DATABASE.filter((b) => b.language === language);
  if (!level) return langBooks;

  // Filter or sort with student's current level first
  return langBooks;
}
