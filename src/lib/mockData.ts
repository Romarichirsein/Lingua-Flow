import {
  School,
  Student,
  Program,
  ActivityLog,
  AIWritingSubmission,
  GlobalPlatformConfig,
  Announcement,
  NotificationTemplate,
} from "../types";

export const INITIAL_PLATFORM_CONFIG: GlobalPlatformConfig = {
  superAdminWhatsapp: "https://wa.me/33612345678",
  platformName: "LinguaFlow SaaS",
  supportEmail: "support@linguaflow.io",
  primaryBrandColor: "#6D5DFC",
  aiCorrectionStrictness: "standard",
  aiCorrectionTemperature: 0.3,
  maintenanceMode: false,
};

export const INITIAL_SCHOOLS: School[] = [
  {
    id: "school-berlin",
    name: "Berlin Sprachzentrum",
    slug: "berlin-sprachzentrum",
    language: "german",
    logo: "🇩🇪",
    primaryColor: "#6366f1",
    secondaryColor: "#06b6d4",
    professionalEmail: "contact@berlin-sprachzentrum.de",
    phone: "+49 30 12345678",
    address: "Friedrichstraße 120",
    city: "Berlin",
    country: "Allemagne",
    managerName: "Klaus Weber",
    managerEmail: "klaus@berlin-sprachzentrum.de",
    managerPhone: "+49 151 23456789",
    username: "klaus.weber",
    password: "berlin2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active",
    whatsappSupportUrl: "https://wa.me/491512345678",
    studentQuota: 250,
    programsCount: 3,
    createdAt: "2026-01-10",
    lastActiveDate: "2026-08-24 18:42",
  },
  {
    id: "school-milano",
    name: "Milano Lingua Studio",
    slug: "milano-lingua-studio",
    language: "italian",
    logo: "🇮🇹",
    primaryColor: "#10b981",
    secondaryColor: "#f59e0b",
    professionalEmail: "info@milanolingua.it",
    phone: "+39 02 98765432",
    address: "Via Montenapoleone 18",
    city: "Milan",
    country: "Italie",
    managerName: "Chiara Rossi",
    managerEmail: "chiara@milanolingua.it",
    managerPhone: "+39 345 1234567",
    username: "chiara.rossi",
    password: "milano2026",
    startDate: "2026-02-01",
    endDate: "2026-11-30",
    status: "active",
    whatsappSupportUrl: "https://wa.me/393451234567",
    studentQuota: 180,
    programsCount: 2,
    createdAt: "2026-02-05",
    lastActiveDate: "2026-08-25 08:15",
  },
  {
    id: "school-munchen",
    name: "München Elite Kolleg",
    slug: "munchen-elite-kolleg",
    language: "german",
    logo: "🏰",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    professionalEmail: "kontakt@muenchen-kolleg.de",
    phone: "+49 89 55443322",
    address: "Maximilianstraße 45",
    city: "Munich",
    country: "Allemagne",
    managerName: "Stefan Gruber",
    managerEmail: "stefan@muenchen-kolleg.de",
    managerPhone: "+49 176 11223344",
    username: "stefan.gruber",
    password: "munchen2026",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    status: "active",
    whatsappSupportUrl: "https://wa.me/491761122334",
    studentQuota: 100,
    programsCount: 2,
    createdAt: "2026-03-01",
    lastActiveDate: "2026-08-23 14:10",
  },
  {
    id: "school-firenze",
    name: "Firenze Accademia Dante",
    slug: "firenze-accademia-dante",
    language: "italian",
    logo: "🏛️",
    primaryColor: "#ec4899",
    secondaryColor: "#f43f5e",
    professionalEmail: "segreteria@dante-firenze.it",
    phone: "+39 055 8765432",
    address: "Piazza del Duomo 8",
    city: "Florence",
    country: "Italie",
    managerName: "Elena Moretti",
    managerEmail: "elena@dante-firenze.it",
    managerPhone: "+39 320 9988776",
    username: "elena.moretti",
    password: "firenze2026",
    startDate: "2026-01-15",
    endDate: "2026-08-30",
    status: "suspended",
    whatsappSupportUrl: "https://wa.me/393209988776",
    studentQuota: 75,
    programsCount: 1,
    createdAt: "2026-01-15",
    lastActiveDate: "2026-08-10 11:20",
  },
  {
    id: "school-hamburg",
    name: "Hanseatische Sprachakademie Hamburg",
    slug: "hamburg-sprachakademie",
    language: "german",
    logo: "⚓",
    primaryColor: "#0ea5e9",
    secondaryColor: "#6366f1",
    professionalEmail: "moin@sprachakademie-hamburg.de",
    phone: "+49 40 76543210",
    address: "Jungfernstieg 22",
    city: "Hambourg",
    country: "Allemagne",
    managerName: "Lukas Brandt",
    managerEmail: "lukas@sprachakademie-hamburg.de",
    managerPhone: "+49 160 9988776",
    username: "lukas.brandt",
    password: "hamburg2026",
    startDate: "2026-04-01",
    endDate: "2026-10-31",
    status: "active",
    whatsappSupportUrl: "https://wa.me/491609988776",
    studentQuota: 150,
    programsCount: 2,
    createdAt: "2026-04-01",
    lastActiveDate: "2026-08-24 16:30",
  },
  {
    id: "school-roma",
    name: "Roma Centro Linguistico Capitale",
    slug: "roma-centro-linguistico",
    language: "italian",
    logo: "🍕",
    primaryColor: "#f59e0b",
    secondaryColor: "#ef4444",
    professionalEmail: "info@romalinguistico.it",
    phone: "+39 06 44332211",
    address: "Via del Corso 112",
    city: "Rome",
    country: "Italie",
    managerName: "Marco Bellini",
    managerEmail: "marco@romalinguistico.it",
    managerPhone: "+39 338 5544332",
    username: "marco.bellini",
    password: "roma2026",
    startDate: "2025-09-01",
    endDate: "2026-03-01",
    status: "expired",
    whatsappSupportUrl: "https://wa.me/393385544332",
    studentQuota: 50,
    programsCount: 1,
    createdAt: "2025-09-01",
    lastActiveDate: "2026-02-28 19:00",
  },
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: "prog-de-a1",
    schoolId: "school-berlin",
    language: "german",
    title: "Allemand A1 — Débutant & Fondations",
    level: "A1",
    description: "Apprenez les bases de la communication quotidienne en allemand : se présenter, commander au restaurant, poser des questions et maîtriser la conjugaison de base.",
    thumbnail: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=600&auto=format&fit=crop&q=80",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    isPublished: true,
    modules: [
      {
        id: "mod-de-a1-1",
        programId: "prog-de-a1",
        title: "Module 1 : Se présenter et saluer",
        order: 1,
        description: "Salutations formelles et informelles, alphabet allemand, prononciation et premiers dialogues.",
        lessons: [
          {
            id: "les-de-1",
            moduleId: "mod-de-a1-1",
            title: "Dire bonjour & se présenter en allemand",
            order: 1,
            durationMinutes: 15,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            videoPoster: "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=600&auto=format&fit=crop&q=80",
            summary: "Découvrez les formules de salutation selon l'heure de la journée (Guten Morgen, Guten Tag, Guten Abend, Hallo) et la présentation personnelle (Ich heiße, Ich bin).",
            theoryContent: `### Salutations quotidiennes en allemand
En allemand, les salutations varient selon le moment de la journée et le degré de familiarité :
- **Guten Morgen** : Bonjour (le matin, jusqu'à ~11h)
- **Guten Tag** : Bonjour (la journée)
- **Guten Abend** : Bonsoir
- **Gute Nacht** : Bonne nuit (au moment de se coucher)
- **Hallo** : Salut / Bonjour (informel et très courant)

### Se présenter
- *Wie heißen Sie?* (Formel) / *Wie heißt du?* (Informel) -> *Ich heiße Lucas.*
- *Woher kommen Sie?* / *Woher kommst du?* -> *Ich komme aus Frankreich / aus Italien.*
- *Wo wohnen Sie?* / *Wo wohnst du?* -> *Ich wohne in Berlin.*`,
            vocabulary: [
              {
                id: "voc-de-1",
                term: "Guten Tag",
                translation: "Bonjour",
                exampleSentence: "Guten Tag, Herr Müller!",
                exampleTranslation: "Bonjour, Monsieur Müller !",
              },
              {
                id: "voc-de-2",
                term: "Ich heiße...",
                translation: "Je m'appelle...",
                exampleSentence: "Ich heiße Markus und komme aus Köln.",
                exampleTranslation: "Je m'appelle Markus et je viens de Cologne.",
              },
              {
                id: "voc-de-3",
                term: "Auf Wiedersehen",
                translation: "Au revoir",
                exampleSentence: "Vielen Dank und auf Wiedersehen!",
                exampleTranslation: "Merci beaucoup et au revoir !",
              },
              {
                id: "voc-de-4",
                term: "Wie geht es Ihnen?",
                translation: "Comment allez-vous ? (formel)",
                exampleSentence: "Guten Morgen! Wie geht es Ihnen heute?",
                exampleTranslation: "Bonjour ! Comment allez-vous aujourd'hui ?",
              },
            ],
            quiz: [
              {
                id: "q-de-1",
                question: "Quelle salutation utilise-t-on le matin avant 11h ?",
                options: ["Guten Abend", "Guten Morgen", "Gute Nacht", "Tschüss"],
                correctIndex: 1,
                explanation: "'Guten Morgen' est la salutation standard matinale en allemand.",
              },
              {
                id: "q-de-2",
                question: "Comment répond-on correctement à la question 'Woher kommst du ?'",
                options: [
                  "Ich wohne in Paris.",
                  "Ich bin 25 Jahre alt.",
                  "Ich komme aus Deutschland.",
                  "Ich heiße Thomas.",
                ],
                correctIndex: 2,
                explanation: "'Ich komme aus Deutschland' répond à la provenance géographique (Woher).",
              },
              {
                id: "q-de-3",
                question: "Que signifie 'Auf Wiedersehen' ?",
                options: ["S'il vous plaît", "Merci beaucoup", "Au revoir", "À demain"],
                correctIndex: 2,
                explanation: "'Auf Wiedersehen' est la formule formelle pour dire au revoir.",
              },
            ],
            passingScorePercent: 70,
            isUnlocked: true,
          },
          {
            id: "les-de-2",
            moduleId: "mod-de-a1-1",
            title: "Les pronoms personnels et les verbes sein & haben",
            order: 2,
            durationMinutes: 20,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            videoPoster: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
            summary: "Maîtrisez les deux verbes auxiliaires indispensables : sein (être) et haben (avoir) ainsi que tous les pronoms personnels.",
            theoryContent: `### Les pronoms personnels en allemand
- **ich** (je)
- **du** (tu)
- **er / sie / es** (il / elle / neutre)
- **wir** (nous)
- **ihr** (vous pluriel informel)
- **sie / Sie** (ils, elles / Vous de politesse)

### Conjugaison du verbe *sein* (être)
- ich **bin**
- du **bist**
- er/sie/es **ist**
- wir **sind**
- ihr **seid**
- sie/Sie **sind**`,
            vocabulary: [
              {
                id: "voc-de-5",
                term: "sein",
                translation: "être",
                exampleSentence: "Ich bin Student in Berlin.",
                exampleTranslation: "Je suis étudiant à Berlin.",
              },
              {
                id: "voc-de-6",
                term: "haben",
                translation: "avoir",
                exampleSentence: "Wir haben heute Unterricht.",
                exampleTranslation: "Nous avons cours aujourd'hui.",
              },
            ],
            quiz: [
              {
                id: "q-de-4",
                question: "Quelle est la forme correcte de 'sein' avec le pronom 'wir' ?",
                options: ["wir bist", "wir sind", "wir seid", "wir ist"],
                correctIndex: 1,
                explanation: "La conjugaison est 'wir sind'.",
              },
            ],
            passingScorePercent: 70,
            isUnlocked: true,
          },
        ],
      },
      {
        id: "mod-de-a1-2",
        programId: "prog-de-a1",
        title: "Module 2 : Au restaurant et dans la ville",
        order: 2,
        description: "Commander des plats, demander son chemin, payer l'addition et utiliser les chiffres.",
        lessons: [
          {
            id: "les-de-3",
            moduleId: "mod-de-a1-2",
            title: "Commander un café et un repas",
            order: 1,
            durationMinutes: 18,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            videoPoster: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
            summary: "Pratiquez le vocabulaire culinaire et les expressions polies avec 'Ich möchte bitte...' et 'Zahlen bitte'.",
            theoryContent: `### Commander poliment
- *Ich möchte bitte einen Kaffee.* (J'aimerais un café s'il vous plaît)
- *Die Rechnung, bitte!* (L'addition, s'il vous plaît)
- *Zusammen oder getrennt?* (Ensemble ou séparément ?)`,
            vocabulary: [
              {
                id: "voc-de-7",
                term: "Ich möchte bitte...",
                translation: "J'aimerais s'il vous plaît...",
                exampleSentence: "Ich möchte bitte ein Mineralwasser.",
                exampleTranslation: "J'aimerais une eau minérale s'il vous plaît.",
              },
            ],
            quiz: [
              {
                id: "q-de-5",
                question: "Comment demander l'addition au serveur ?",
                options: ["Guten Morgen!", "Die Rechnung, bitte!", "Ich heiße Paul.", "Auf Wiedersehen!"],
                correctIndex: 1,
                explanation: "'Die Rechnung, bitte' signifie l'addition s'il vous plaît.",
              },
            ],
            passingScorePercent: 70,
            isUnlocked: false,
          },
        ],
      },
    ],
  },
  {
    id: "prog-it-a1",
    schoolId: "school-milano",
    language: "italian",
    title: "Italien A1 — Fondamenti & Conversazione",
    level: "A1",
    description: "Plongez dans la langue italienne : salutations chaleureuses, présentation, commande au bar italien et bases grammaticales.",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    isPublished: true,
    modules: [
      {
        id: "mod-it-a1-1",
        programId: "prog-it-a1",
        title: "Modulo 1 : Salutare e presentarsi",
        order: 1,
        description: "Salutations, prononciation des sons italiens (ci, ce, chi, che, gli) et premiers échanges.",
        lessons: [
          {
            id: "les-it-1",
            moduleId: "mod-it-a1-1",
            title: "Salutare e dire come ti chiami",
            order: 1,
            durationMinutes: 15,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            videoPoster: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop&q=80",
            summary: "Apprenez les salutations italiennes selon les moments de la journée et commencez à vous présenter avec confiance.",
            theoryContent: `### Saluti in italiano
- **Buongiorno** : Bonjour (toute la matinée et début d'après-midi)
- **Buonasera** : Bonsoir (à partir de la fin d'après-midi)
- **Buonanotte** : Bonne nuit (en allant dormir)
- **Ciao** : Salut / Bonjour / Au revoir (informel)
- **Arrivederci** : Au revoir (formel)

### Presentarsi
- *Come ti chiami?* (informel) / *Come si chiama?* (formel) -> *Mi chiamo Matteo.*
- *Di dove sei?* -> *Sono francese / Sono di Lione.*
- *Piacere di conoscerti!* -> Enchanté(e) !`,
            vocabulary: [
              {
                id: "voc-it-1",
                term: "Buongiorno",
                translation: "Bonjour",
                exampleSentence: "Buongiorno signora Ferrari, come sta?",
                exampleTranslation: "Bonjour Madame Ferrari, comment allez-vous ?",
              },
              {
                id: "voc-it-2",
                term: "Mi chiamo...",
                translation: "Je m'appelle...",
                exampleSentence: "Piacere, mi chiamo Alessandro.",
                exampleTranslation: "Enchanté, je m'appelle Alessandro.",
              },
              {
                id: "voc-it-3",
                term: "Piacere",
                translation: "Enchanté(e)",
                exampleSentence: "Piacere di conoscerti!",
                exampleTranslation: "Enchanté(e) de faire ta connaissance !",
              },
            ],
            quiz: [
              {
                id: "q-it-1",
                question: "Quel mot peut signifier à la fois 'Bonjour' et 'Au revoir' de façon informelle ?",
                options: ["Buongiorno", "Arrivederci", "Ciao", "Buonasera"],
                correctIndex: 2,
                explanation: "'Ciao' s'emploie à l'arrivée comme au départ avec des amis ou collègues familiers.",
              },
              {
                id: "q-it-2",
                question: "Comment dit-on 'Je m'appelle Marco' en italien ?",
                options: ["Mi chiamo Marco", "Io Marco", "Sono chiamare Marco", "Marco mi nome"],
                correctIndex: 0,
                explanation: "'Mi chiamo Marco' est la formule exacte.",
              },
            ],
            passingScorePercent: 70,
            isUnlocked: true,
          },
        ],
      },
    ],
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "stu-romaric",
    schoolId: "school-berlin",
    name: "Romaric Hirsein",
    email: "romarichirsein@gmail.com",
    username: "romaric.hirsein",
    password: "romaric123",
    phone: "+237 690 11 22 33",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    enrolledProgramId: "prog-de-a1",
    level: "A1",
    startDate: "2026-08-01",
    endDate: "2026-10-24", // 61 days calculation example from prompt
    status: "active",
    progressPercent: 65,
    lastActiveLessonId: "les-de-1",
    completedLessons: ["les-de-1"],
    lastLoginDate: "2026-08-24",
  },
  {
    id: "stu-sophie",
    schoolId: "school-berlin",
    name: "Sophie Laurent",
    email: "sophie.laurent@example.com",
    username: "sophie.laurent",
    password: "sophie123",
    phone: "+33 6 45 78 90 12",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    enrolledProgramId: "prog-de-a1",
    level: "A1",
    startDate: "2026-07-15",
    endDate: "2026-09-15",
    status: "active",
    progressPercent: 80,
    lastActiveLessonId: "les-de-2",
    completedLessons: ["les-de-1", "les-de-2"],
    lastLoginDate: "2026-08-23",
  },
  {
    id: "stu-gianni",
    schoolId: "school-milano",
    name: "Gianni Berti",
    email: "gianni.berti@example.it",
    username: "gianni.berti",
    password: "gianni123",
    phone: "+39 347 88 99 001",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    enrolledProgramId: "prog-it-a1",
    level: "A1",
    startDate: "2026-08-01",
    endDate: "2026-11-01",
    status: "active",
    progressPercent: 40,
    lastActiveLessonId: "les-it-1",
    completedLessons: ["les-it-1"],
    lastLoginDate: "2026-08-22",
  },
  {
    id: "stu-clara",
    schoolId: "school-milano",
    name: "Clara Dubois",
    email: "clara.dubois@example.fr",
    username: "clara.dubois",
    password: "clara123",
    phone: "+33 7 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    enrolledProgramId: "prog-it-a1",
    level: "A1",
    startDate: "2026-05-01",
    endDate: "2026-07-31", // Expired
    status: "expired",
    progressPercent: 100,
    lastActiveLessonId: "les-it-1",
    completedLessons: ["les-it-1"],
    lastLoginDate: "2026-07-30",
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    timestamp: "2026-08-24T08:15:00Z",
    actorRole: "super_admin",
    actorName: "Super Admin",
    schoolName: "Berlin Sprachzentrum",
    action: "Vérification quotas SaaS",
    details: "Vérification automatique des quotas de bande passante et de vidéos.",
    ipAddress: "192.168.1.1",
    status: "success",
  },
  {
    id: "log-2",
    timestamp: "2026-08-24T07:45:00Z",
    actorRole: "student",
    actorName: "Romaric Hirsein",
    schoolName: "Berlin Sprachzentrum",
    action: "Validation Leçon",
    details: "Leçon 'Dire bonjour & se présenter' validée avec quiz à 100%.",
    ipAddress: "105.235.12.8",
    status: "success",
  },
  {
    id: "log-3",
    timestamp: "2026-08-23T18:20:00Z",
    actorRole: "school_admin",
    actorName: "Klaus Weber",
    schoolName: "Berlin Sprachzentrum",
    action: "Mise à jour groupe WhatsApp",
    details: "Lien du groupe d'entraide Allemand A1 mis à jour.",
    ipAddress: "84.112.90.14",
    status: "success",
  },
  {
    id: "log-4",
    timestamp: "2026-08-22T14:10:00Z",
    actorRole: "super_admin",
    actorName: "Super Admin",
    schoolName: "Firenze Accademia Dante",
    action: "Suspension temporaire",
    details: "Suspension pour mise à jour des conditions contractuelles.",
    ipAddress: "192.168.1.1",
    status: "warning",
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Mise à jour majeure du Tuteur IA & Correction Grammaticale",
    content: "L'assistant d'expression écrite prend désormais en charge l'évaluation fine des niveaux A1 à C1 avec retours phonétiques et contextuels pour l'allemand et l'italien.",
    target: "all",
    priority: "info",
    createdAt: "2026-08-20",
    authorName: "Super Admin LinguaFlow",
    isActive: true,
  },
  {
    id: "ann-2",
    title: "Maintenance préventive des serveurs vidéo",
    content: "Une optimisation de l'infrastructure de streaming avec filigrane dynamique sera effectuée ce dimanche de 02h00 à 04h00 UTC.",
    target: "schools",
    priority: "warning",
    createdAt: "2026-08-23",
    authorName: "Super Admin LinguaFlow",
    isActive: true,
  },
];

export const INITIAL_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: "tpl-1",
    trigger: "access_expiring_soon",
    title: "Votre accès LinguaFlow expire bientôt",
    messageTemplate: "Bonjour {{student_name}}, votre formation chez {{school_name}} se termine dans {{days_left}} jours. Pensez à finaliser vos modules !",
    channel: "email",
  },
  {
    id: "tpl-2",
    trigger: "new_lesson_published",
    title: "Nouvelle leçon disponible !",
    messageTemplate: "Une nouvelle leçon a été ajoutée à votre programme : {{lesson_title}}.",
    channel: "in_app",
  },
  {
    id: "tpl-3",
    trigger: "inactivity_reminder",
    title: "Reprenez votre apprentissage",
    messageTemplate: "Bonjour {{student_name}}, 3 jours sans pratique ! Reprenez votre leçon '{{last_lesson}}' dès maintenant.",
    channel: "whatsapp",
  },
];

// LocalStorage helpers with automatic hydration
const STORAGE_KEYS = {
  SCHOOLS: "linguaflow_schools_v1",
  STUDENTS: "linguaflow_students_v1",
  PROGRAMS: "linguaflow_programs_v1",
  LOGS: "linguaflow_logs_v1",
  CONFIG: "linguaflow_config_v1",
  AI_SUBMISSIONS: "linguaflow_ai_submissions_v1",
  ANNOUNCEMENTS: "linguaflow_announcements_v1",
  TEMPLATES: "linguaflow_templates_v1",
};

export const getStoredData = () => {
  try {
    const schools = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const programs = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    const logs = localStorage.getItem(STORAGE_KEYS.LOGS);
    const config = localStorage.getItem(STORAGE_KEYS.CONFIG);
    const aiSubmissions = localStorage.getItem(STORAGE_KEYS.AI_SUBMISSIONS);
    const announcements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    const templates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);

    const parsedSchools: School[] = schools ? JSON.parse(schools) : INITIAL_SCHOOLS;
    const parsedStudents: Student[] = students ? JSON.parse(students) : INITIAL_STUDENTS;
    const parsedPrograms: Program[] = programs ? JSON.parse(programs) : INITIAL_PROGRAMS;
    const parsedLogs: ActivityLog[] = logs ? JSON.parse(logs) : INITIAL_LOGS;
    const parsedConfig: GlobalPlatformConfig = config ? JSON.parse(config) : INITIAL_PLATFORM_CONFIG;
    const parsedAiSubmissions: AIWritingSubmission[] = aiSubmissions ? JSON.parse(aiSubmissions) : [];
    const parsedAnnouncements: Announcement[] = announcements ? JSON.parse(announcements) : INITIAL_ANNOUNCEMENTS;
    const parsedTemplates: NotificationTemplate[] = templates ? JSON.parse(templates) : INITIAL_NOTIFICATION_TEMPLATES;

    // Sanitize schools
    const sanitizedSchools = (Array.isArray(parsedSchools) ? parsedSchools : INITIAL_SCHOOLS).map((sch) => {
      const defaultUsername = sch.username || (sch.managerEmail ? sch.managerEmail.split("@")[0] : sch.slug || "school_admin");
      const defaultPassword = sch.password || "school123";
      return {
        ...sch,
        username: defaultUsername,
        password: defaultPassword,
      };
    });

    // Sanitize students
    const sanitizedStudents = (Array.isArray(parsedStudents) ? parsedStudents : INITIAL_STUDENTS).map((s) => {
      const defaultUsername = s.username || (s.email ? s.email.split("@")[0] : `student_${s.id}`);
      const defaultPassword = s.password || "student123";
      return {
        ...s,
        username: defaultUsername,
        password: defaultPassword,
        completedLessons: Array.isArray(s.completedLessons) ? s.completedLessons : [],
        progressPercent: typeof s.progressPercent === "number" ? s.progressPercent : 0,
      };
    });

    // Sanitize programs
    const sanitizedPrograms = (Array.isArray(parsedPrograms) ? parsedPrograms : INITIAL_PROGRAMS).map((p) => ({
      ...p,
      modules: (Array.isArray(p.modules) ? p.modules : []).map((m) => ({
        ...m,
        lessons: (Array.isArray(m.lessons) ? m.lessons : []).map((l) => ({
          ...l,
          vocabulary: Array.isArray(l.vocabulary) ? l.vocabulary : [],
          quiz: Array.isArray(l.quiz) ? l.quiz : [],
        })),
      })),
    }));

    return {
      schools: sanitizedSchools,
      students: sanitizedStudents,
      programs: sanitizedPrograms,
      logs: Array.isArray(parsedLogs) ? parsedLogs : INITIAL_LOGS,
      config: parsedConfig || INITIAL_PLATFORM_CONFIG,
      aiSubmissions: Array.isArray(parsedAiSubmissions) ? parsedAiSubmissions : [],
      announcements: Array.isArray(parsedAnnouncements) ? parsedAnnouncements : INITIAL_ANNOUNCEMENTS,
      templates: Array.isArray(parsedTemplates) ? parsedTemplates : INITIAL_NOTIFICATION_TEMPLATES,
    };
  } catch (e) {
    return {
      schools: INITIAL_SCHOOLS,
      students: INITIAL_STUDENTS,
      programs: INITIAL_PROGRAMS,
      logs: INITIAL_LOGS,
      config: INITIAL_PLATFORM_CONFIG,
      aiSubmissions: [],
      announcements: INITIAL_ANNOUNCEMENTS,
      templates: INITIAL_NOTIFICATION_TEMPLATES,
    };
  }
};

export const saveStoredData = (data: {
  schools?: School[];
  students?: Student[];
  programs?: Program[];
  logs?: ActivityLog[];
  config?: GlobalPlatformConfig;
  aiSubmissions?: AIWritingSubmission[];
  announcements?: Announcement[];
  templates?: NotificationTemplate[];
}) => {
  try {
    if (data.schools) localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(data.schools));
    if (data.students) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
    if (data.programs) localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(data.programs));
    if (data.logs) localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.logs));
    if (data.config) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
    if (data.aiSubmissions) localStorage.setItem(STORAGE_KEYS.AI_SUBMISSIONS, JSON.stringify(data.aiSubmissions));
    if (data.announcements) localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(data.announcements));
    if (data.templates) localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(data.templates));
  } catch (e) {
    console.error("Storage error:", e);
  }
};
