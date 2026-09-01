export type UserRole = "super_admin" | "school_admin" | "student";

export type SupportedLanguage = "german" | "italian";

export type UILocale = "fr" | "en";

export type ThemeMode = "light" | "dark" | "system";

export type EntityStatus = "active" | "suspended" | "blocked" | "expired" | "archived" | "deleted";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface UserPreferences {
  locale: UILocale;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  emailAlerts: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  schoolId?: string; // Set for school_admin and student
  studentId?: string; // Set for student
  status: EntityStatus;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  language: SupportedLanguage;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  professionalEmail?: string;
  phone?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  website?: string;
  whatsappNumber?: string;
  whatsappWelcomeTemplate?: string;
  address?: string;
  city?: string;
  country?: string;
  managerName: string;
  managerEmail: string;
  managerPhone?: string;
  username?: string; // Credentials set by Super Admin
  password?: string; // Password set by Super Admin for the School
  startDate: string; // ISO format or YYYY-MM-DD
  endDate: string;
  status: EntityStatus;
  suspensionReason?: string;
  whatsappSupportUrl: string; // e.g. https://wa.me/4915123456789
  studentQuota: number;
  programsCount?: number;
  createdAt: string;
  lastActiveDate?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface SchoolAdmin {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone?: string;
  role: "school_admin";
  status: EntityStatus;
  createdAt: string;
}

export interface Student {
  id: string;
  schoolId: string;
  schoolName?: string;
  name: string;
  email: string;
  username?: string; // Credentials set by School Admin
  password?: string; // Password set by School Admin for the Student
  phone?: string;
  whatsappNumber?: string;
  avatar?: string;
  enrolledProgramId?: string;
  level: CEFRLevel;
  startDate: string;
  endDate: string;
  accessStartDate?: string;
  enrolledAt?: string;
  expiresAt?: string;
  status: EntityStatus;
  suspensionReason?: string;
  progressPercent: number;
  lastActiveLessonId?: string;
  completedLessons: string[]; // lesson ids
  lastLoginDate?: string;
  lastLoginAt?: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  schoolId: string;
  programId: string;
  language: SupportedLanguage;
  level: CEFRLevel;
  startDate: string;
  endDate: string;
  status: EntityStatus;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  lastActivityAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  studentId: string;
  lessonId: string;
  moduleId: string;
  programId: string;
  completed: boolean;
  completedAt?: string;
  score?: number;
  timeSpentSeconds?: number;
  quizAttemptsCount?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  lessonId: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptDate: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface VideoAsset {
  id: string;
  url: string;
  posterUrl?: string;
  durationMinutes: number;
  provider?: "direct" | "youtube" | "vimeo" | "storage";
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "audio" | "link" | "document";
  url: string;
  sizeMb?: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  durationMinutes: number;
  videoUrl: string;
  videoPoster?: string;
  summary: string;
  theoryContent?: string;
  vocabulary?: VocabularyItem[];
  quiz?: QuizQuestion[];
  resources?: Resource[];
  passingScorePercent?: number;
  isUnlocked?: boolean;
  isMandatory?: boolean;
}

export interface CourseModule {
  id: string;
  programId: string;
  title: string;
  order: number;
  description: string;
  lessons: Lesson[];
}

export type Module = CourseModule;

export interface Program {
  id: string;
  schoolId: string;
  schoolName?: string;
  language: SupportedLanguage;
  title: string;
  level: CEFRLevel;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  status?: "draft" | "published" | "archived";
  enrolledStudentsCount?: number;
  totalVideosCount?: number;
  totalResourcesCount?: number;
  modules: CourseModule[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface AIWritingError {
  category: string;
  type?: string;
  original: string;
  correction: string;
  explanation: string;
  severity?: "high" | "medium" | "low";
}

export interface AIWritingResult {
  score: {
    grammar: number;
    vocabulary: number;
    coherence: number;
  };
  overallScore?: number;
  cefrEstimatedLevel: string;
  summary?: string;
  correctedVersion: string;
  errors: AIWritingError[];
  strengths: string[];
  improvements: string[];
}

export type AIWritingEvaluation = AIWritingResult;

export interface AIWritingSubmission {
  id: string;
  studentId: string;
  studentName?: string;
  schoolId: string;
  language: SupportedLanguage;
  level: CEFRLevel;
  topic: string;
  studentText: string;
  submissionDate: string;
  result: AIWritingResult;
  evaluation?: AIWritingResult;
  submittedAt?: string;
  originalText?: string;
  status?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  type: "info" | "success" | "warning" | "error" | "urgent";
  targetRole?: UserRole | "all";
  targetSchoolId?: string;
  targetStudentId?: string;
  senderName: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleFr?: string;
  titleEn?: string;
  content: string;
  contentFr?: string;
  contentEn?: string;
  target: "all" | "schools" | "students" | "specific_school";
  targetSchoolId?: string;
  priority: "info" | "success" | "warning" | "urgent";
  createdAt: string;
  publishDate?: string;
  expiryDate?: string;
  authorName: string;
  isActive: boolean;
  readCount?: number;
}

export interface NotificationTemplate {
  id: string;
  trigger: string;
  title: string;
  messageTemplate: string;
  channel: "email" | "whatsapp" | "in_app";
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  actorRole: UserRole;
  actorName: string;
  schoolName?: string;
  schoolId?: string;
  entityType?: "school" | "student" | "program" | "announcement" | "config" | "security" | "enrollment" | "ai";
  entityId?: string;
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress?: string;
  status: "success" | "warning" | "error";
}

export type AuditLog = ActivityLog;

export interface WhatsAppSettings {
  superAdminWhatsapp: string;
  superAdminWhatsappFrMsg?: string;
  superAdminWhatsappEnMsg?: string;
  showFloatingWhatsapp?: boolean;
}

export interface GlobalPlatformConfig {
  platformName: string;
  logoUrl?: string;
  faviconUrl?: string;
  description?: string;
  superAdminWhatsapp: string;
  superAdminWhatsappFrMsg?: string;
  superAdminWhatsappEnMsg?: string;
  showFloatingWhatsapp?: boolean;
  floatingWhatsappLabelFr?: string;
  floatingWhatsappLabelEn?: string;
  supportEmail: string;
  primaryBrandColor: string;
  secondaryBrandColor?: string;
  aiCorrectionStrictness: "lenient" | "standard" | "strict";
  aiCorrectionTemperature: number;
  defaultSchoolDurationMonths?: number;
  autoArchiveExpiredDays?: number;
  securityIpTrackingEnabled?: boolean;
  maintenanceMode: boolean;
}

export type PlatformSettings = GlobalPlatformConfig;

export interface SuperAdminProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  preferredLocale: UILocale;
  preferredTheme: ThemeMode;
  emailNotifications: boolean;
  whatsappAlerts: boolean;
  securityAlerts: boolean;
}

