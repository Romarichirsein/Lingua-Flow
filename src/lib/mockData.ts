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
  supportEmail: "linguaflowadmin@gmail.com",
  primaryBrandColor: "#6D5DFC",
  aiCorrectionStrictness: "standard",
  aiCorrectionTemperature: 0.3,
  maintenanceMode: false,
};

export const INITIAL_SCHOOLS: School[] = [];

export const INITIAL_PROGRAMS: Program[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log-init-1",
    timestamp: new Date().toISOString(),
    actorRole: "super_admin",
    actorName: "Super Admin",
    action: "Initialisation Plateforme",
    details: "Plateforme LinguaFlow SaaS B2B initialisée avec succès. Prête pour l'intégration de vos écoles partenaires.",
    ipAddress: "127.0.0.1",
    status: "success",
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

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
  SCHOOLS: "linguaflow_schools_v2",
  STUDENTS: "linguaflow_students_v2",
  PROGRAMS: "linguaflow_programs_v2",
  LOGS: "linguaflow_logs_v2",
  CONFIG: "linguaflow_config_v2",
  AI_SUBMISSIONS: "linguaflow_ai_submissions_v2",
  ANNOUNCEMENTS: "linguaflow_announcements_v2",
  TEMPLATES: "linguaflow_templates_v2",
};

export const getStoredData = () => {
  try {
    // Purge legacy v1 demo cache if present in user browser
    const legacyKeys = [
      "linguaflow_schools_v1",
      "linguaflow_students_v1",
      "linguaflow_programs_v1",
      "linguaflow_logs_v1",
      "linguaflow_config_v1",
      "linguaflow_ai_submissions_v1",
      "linguaflow_announcements_v1",
      "linguaflow_templates_v1",
    ];
    legacyKeys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });

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
    const sanitizedSchools = (Array.isArray(parsedSchools) ? parsedSchools : []).map((sch) => {
      const defaultUsername = sch.username || (sch.managerEmail ? sch.managerEmail.split("@")[0] : sch.slug || "school_admin");
      const defaultPassword = sch.password || "school123";
      return {
        ...sch,
        username: defaultUsername,
        password: defaultPassword,
      };
    });

    // Sanitize students
    const sanitizedStudents = (Array.isArray(parsedStudents) ? parsedStudents : []).map((s) => {
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
    const sanitizedPrograms = (Array.isArray(parsedPrograms) ? parsedPrograms : []).map((p) => ({
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
