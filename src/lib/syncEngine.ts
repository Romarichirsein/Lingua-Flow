import {
  School,
  Student,
  Program,
  Lesson,
  UserRole,
  EntityStatus,
  SupportedLanguage,
  UILocale,
  GlobalPlatformConfig,
  Notification,
  ActivityLog,
} from "../types";

/**
 * Computes remaining days dynamically using current timestamp.
 * Formula: Math.max(0, Math.ceil((endDate - now) / 86400000))
 */
export function computeDaysRemaining(endDateStr: string): number {
  if (!endDateStr) return 0;
  const target = new Date(endDateStr).getTime();
  if (isNaN(target)) return 0;
  const now = Date.now();
  const diffMs = target - now;
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Returns the effective status of a school or student.
 * If status is 'active' but the expiration date has passed, returns 'expired'.
 */
export function getEffectiveStatus(entity: {
  status: EntityStatus;
  endDate: string;
}): EntityStatus {
  if (entity.status === "suspended" || entity.status === "blocked" || entity.status === "archived") {
    return entity.status;
  }
  const daysLeft = computeDaysRemaining(entity.endDate);
  if (daysLeft <= 0) {
    return "expired";
  }
  return entity.status;
}

/**
 * Validates language consistency between School and Program.
 * An Italian school can ONLY create and assign Italian programs.
 * A German school can ONLY create and assign German programs.
 */
export function validateLanguageMatch(
  schoolLanguage: SupportedLanguage,
  programLanguage: SupportedLanguage
): boolean {
  return schoolLanguage === programLanguage;
}

/**
 * Enforces Server & Client-side RBAC multi-tenant isolation.
 * - Super admin can access all schools and students.
 * - School admin can ONLY access entities matching their schoolId.
 * - Student can ONLY access their own records matching their schoolId and studentId.
 */
export function checkTenantAccess(params: {
  actorRole: UserRole;
  actorSchoolId?: string;
  actorStudentId?: string;
  targetSchoolId?: string;
  targetStudentId?: string;
}): { allowed: boolean; reason?: string } {
  const { actorRole, actorSchoolId, actorStudentId, targetSchoolId, targetStudentId } = params;

  if (actorRole === "super_admin") {
    return { allowed: true };
  }

  if (actorRole === "school_admin") {
    if (!actorSchoolId || !targetSchoolId) {
      return { allowed: false, reason: "Identifiant d'école manquant pour la vérification multi-tenant." };
    }
    if (actorSchoolId !== targetSchoolId) {
      return { allowed: false, reason: "Accès refusé : vous ne pouvez pas accéder aux données d'une autre école." };
    }
    return { allowed: true };
  }

  if (actorRole === "student") {
    if (actorSchoolId && targetSchoolId && actorSchoolId !== targetSchoolId) {
      return { allowed: false, reason: "Accès refusé : école non correspondante." };
    }
    if (actorStudentId && targetStudentId && actorStudentId !== targetStudentId) {
      return { allowed: false, reason: "Accès refusé : accès aux données d'un autre élève interdit." };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: "Rôle non reconnu." };
}

/**
 * Determines whether a student can open and complete pedagogical contents (videos, lessons, AI tutor).
 * Rules:
 * 1. School must be active and not expired.
 * 2. Student must be active and not expired.
 * 3. If program is specified, it must belong to the student's school and match the language.
 */
export function canStudentAccessPedagogy(params: {
  school: School;
  student: Student;
  program?: Program;
}): { canAccess: boolean; lockReason?: "school_suspended" | "school_blocked" | "school_expired" | "student_suspended" | "student_blocked" | "student_expired" | "language_mismatch" } {
  const { school, student, program } = params;

  const schoolEffectiveStatus = getEffectiveStatus(school);
  if (schoolEffectiveStatus === "suspended") return { canAccess: false, lockReason: "school_suspended" };
  if (schoolEffectiveStatus === "blocked") return { canAccess: false, lockReason: "school_blocked" };
  if (schoolEffectiveStatus === "expired") return { canAccess: false, lockReason: "school_expired" };

  const studentEffectiveStatus = getEffectiveStatus(student);
  if (studentEffectiveStatus === "suspended") return { canAccess: false, lockReason: "student_suspended" };
  if (studentEffectiveStatus === "blocked") return { canAccess: false, lockReason: "student_blocked" };
  if (studentEffectiveStatus === "expired") return { canAccess: false, lockReason: "student_expired" };

  if (program) {
    if (program.schoolId !== school.id) {
      return { canAccess: false, lockReason: "language_mismatch" };
    }
    if (!validateLanguageMatch(school.language, program.language)) {
      return { canAccess: false, lockReason: "language_mismatch" };
    }
  }

  return { canAccess: true };
}

/**
 * Calculates mathematical progression percentage.
 * Formula: (completedLessons / totalLessons) * 100
 */
export function calculateProgression(completedLessons: string[], allProgramLessons: Lesson[]): number {
  if (!allProgramLessons || allProgramLessons.length === 0) return 0;
  const uniqueCompleted = Array.from(new Set(completedLessons));
  const validCompletedInProgram = uniqueCompleted.filter((id) =>
    allProgramLessons.some((l) => l.id === id)
  );
  return Math.min(100, Math.round((validCompletedInProgram.length / allProgramLessons.length) * 100));
}

/**
 * Checks if a lesson is unlocked for a student.
 * The 1st lesson of module 1 is always unlocked.
 * A subsequent lesson is unlocked if the immediate previous lesson in the order is completed.
 */
export function isLessonAccessible(
  lesson: Lesson,
  allLessonsOrdered: Lesson[],
  completedLessonIds: string[]
): boolean {
  if (lesson.isUnlocked) return true;
  const index = allLessonsOrdered.findIndex((l) => l.id === lesson.id);
  if (index <= 0) return true; // First lesson is always unlocked
  const previousLesson = allLessonsOrdered[index - 1];
  return completedLessonIds.includes(previousLesson.id);
}

/**
 * Generates formatted WhatsApp link for School -> Super Admin Support.
 */
export function buildSuperAdminWhatsAppUrl(
  config: GlobalPlatformConfig,
  school: School,
  locale: UILocale = "fr"
): string {
  const baseNum = config.superAdminWhatsapp?.replace(/[^0-9+]/g, "") || "33612345678";
  const cleanNum = baseNum.startsWith("+") ? baseNum.substring(1) : baseNum;
  
  const textFr = `Bonjour le support LinguaFlow, je suis ${school.managerName || "Directeur"} de l'école "${school.name}" (ID: ${school.id}). J'ai besoin d'assistance pour notre espace.`;
  const textEn = `Hello LinguaFlow Support, I am ${school.managerName || "Manager"} from school "${school.name}" (ID: ${school.id}). I need assistance for our school workspace.`;
  
  const message = locale === "en" ? textEn : textFr;
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates formatted WhatsApp link for Student -> School Support / Community Group.
 */
export function buildStudentSchoolWhatsAppUrl(
  school: School,
  student: Student,
  locale: UILocale = "fr"
): string {
  const url = school.whatsappSupportUrl?.trim();
  if (url && (url.includes("chat.whatsapp.com") || url.includes("wa.me") || url.startsWith("http"))) {
    return url;
  }

  const fallbackUrl = school.phone || school.managerPhone || school.whatsappSupportUrl || "491512345678";
  const baseNum = fallbackUrl.replace(/[^0-9+]/g, "");
  const cleanNum = baseNum.startsWith("+") ? baseNum.substring(1) : baseNum;

  const textFr = `Bonjour l'équipe de ${school.name}, je suis l'élève ${student.name} (Niveau: ${student.level}). J'ai une question concernant mes cours.`;
  const textEn = `Hello ${school.name} team, I am student ${student.name} (Level: ${student.level}). I have a question regarding my language courses.`;

  const message = locale === "en" ? textEn : textFr;
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates standardized activity log.
 */
export function createActivityLog(params: {
  action: string;
  details: string;
  actorRole: UserRole;
  actorName: string;
  schoolName?: string;
  schoolId?: string;
  entityType?: "school" | "student" | "program" | "announcement" | "config" | "security" | "enrollment" | "ai";
  entityId?: string;
  previousValue?: string;
  newValue?: string;
  status?: "success" | "warning" | "error";
}): ActivityLog {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    action: params.action,
    details: params.details,
    actorRole: params.actorRole,
    actorName: params.actorName,
    schoolName: params.schoolName,
    schoolId: params.schoolId,
    entityType: params.entityType,
    entityId: params.entityId,
    previousValue: params.previousValue,
    newValue: params.newValue,
    timestamp: new Date().toISOString(),
    status: params.status || "success",
  };
}

/**
 * Creates standardized system notification.
 */
export function createSystemNotification(params: {
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  type?: "info" | "success" | "warning" | "error" | "urgent";
  targetRole?: UserRole | "all";
  targetSchoolId?: string;
  targetStudentId?: string;
  senderName?: string;
  linkUrl?: string;
}): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: params.title,
    titleEn: params.titleEn || params.title,
    message: params.message,
    messageEn: params.messageEn || params.message,
    type: params.type || "info",
    targetRole: params.targetRole || "all",
    targetSchoolId: params.targetSchoolId,
    targetStudentId: params.targetStudentId,
    senderName: params.senderName || "Système LinguaFlow",
    isRead: false,
    createdAt: new Date().toISOString(),
    linkUrl: params.linkUrl,
  };
}
