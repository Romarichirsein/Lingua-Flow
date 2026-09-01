import {
  Student,
  Program,
  CourseModule,
  Lesson,
  LessonProgress,
  Enrollment,
  Notification,
  ActivityLog,
  UILocale,
} from "../types";
import { createActivityLog, createSystemNotification } from "./syncEngine";

export interface ProgressionCompletionResult {
  student: Student;
  updatedEnrollment?: Enrollment;
  lessonProgress: LessonProgress;
  isModuleCompleted: boolean;
  completedModule?: CourseModule;
  isProgramCompleted: boolean;
  newProgressPercent: number;
  unlockedLessonIds: string[];
  newNotifications: Notification[];
  activityLog: ActivityLog;
}

export class ProgressionService {
  /**
   * Recalculates student and enrollment progression when a lesson is marked completed.
   */
  public static completeLesson(params: {
    student: Student;
    program: Program;
    lessonId: string;
    score?: number;
    timeSpentSeconds?: number;
    locale?: UILocale;
    existingEnrollment?: Enrollment;
  }): ProgressionCompletionResult {
    const {
      student,
      program,
      lessonId,
      score,
      timeSpentSeconds = 60,
      locale = "fr",
      existingEnrollment,
    } = params;

    // 1. Gather all lessons across all modules in this program
    const allProgramLessons: Lesson[] = [];
    let currentModule: CourseModule | undefined;
    let currentLesson: Lesson | undefined;

    for (const mod of program.modules || []) {
      for (const les of mod.lessons || []) {
        allProgramLessons.push(les);
        if (les.id === lessonId) {
          currentModule = mod;
          currentLesson = les;
        }
      }
    }

    // 2. Compute new completed lessons list (ensuring uniqueness)
    const prevCompleted = student.completedLessons || [];
    const newCompletedLessons = Array.from(new Set([...prevCompleted, lessonId]));

    // 3. Compute percentage
    const totalLessons = allProgramLessons.length || 1;
    const completedCountInProgram = allProgramLessons.filter((l) =>
      newCompletedLessons.includes(l.id)
    ).length;
    const newProgressPercent = Math.min(100, Math.round((completedCountInProgram / totalLessons) * 100));

    // 4. Determine unlocked lessons (order based sequential unlock)
    const unlockedLessonIds: string[] = [];
    allProgramLessons.forEach((les, idx) => {
      if (idx === 0 || les.isUnlocked) {
        unlockedLessonIds.push(les.id);
      } else {
        const prevLes = allProgramLessons[idx - 1];
        if (newCompletedLessons.includes(prevLes.id)) {
          unlockedLessonIds.push(les.id);
        }
      }
    });

    // 5. Check if current module is newly completed
    let isModuleCompleted = false;
    if (currentModule) {
      const moduleLessons = currentModule.lessons || [];
      const allModuleDone = moduleLessons.every((l) => newCompletedLessons.includes(l.id));
      const wasModuleDoneBefore = moduleLessons.every((l) => prevCompleted.includes(l.id));
      isModuleCompleted = allModuleDone && !wasModuleDoneBefore;
    }

    // 6. Check if entire program is newly completed
    const wasProgramDoneBefore = allProgramLessons.every((l) => prevCompleted.includes(l.id));
    const isProgramCompleted =
      newProgressPercent === 100 && !wasProgramDoneBefore && allProgramLessons.length > 0;

    // 7. Build updated student model
    const updatedStudent: Student = {
      ...student,
      progressPercent: newProgressPercent,
      completedLessons: newCompletedLessons,
      lastActiveLessonId: lessonId,
    };

    // 8. Build LessonProgress record
    const lessonProgress: LessonProgress = {
      id: `lp-${student.id}-${lessonId}`,
      enrollmentId: existingEnrollment?.id || `enr-${student.id}-${program.id}`,
      studentId: student.id,
      lessonId,
      moduleId: currentModule?.id || "module-1",
      programId: program.id,
      completed: true,
      completedAt: new Date().toISOString(),
      score: score ?? 100,
      timeSpentSeconds,
    };

    // 9. Build updated Enrollment
    const updatedEnrollment: Enrollment = {
      id: existingEnrollment?.id || `enr-${student.id}-${program.id}`,
      studentId: student.id,
      schoolId: student.schoolId,
      programId: program.id,
      language: program.language,
      level: program.level,
      startDate: student.startDate || new Date().toISOString().split("T")[0],
      endDate: student.endDate || "2026-12-31",
      status: student.status,
      progressPercent: newProgressPercent,
      completedLessonsCount: completedCountInProgram,
      totalLessonsCount: totalLessons,
      lastActivityAt: new Date().toISOString(),
      createdAt: existingEnrollment?.createdAt || new Date().toISOString(),
      createdBy: existingEnrollment?.createdBy || "school_admin",
    };

    // 10. Generate Notifications if Module or Program is completed
    const newNotifications: Notification[] = [];

    // Lesson completed notification
    newNotifications.push(
      createSystemNotification({
        title: `Leçon terminée : ${currentLesson?.title || lessonId}`,
        titleEn: `Lesson completed: ${currentLesson?.title || lessonId}`,
        message: `Vous avez terminé avec succès "${currentLesson?.title || lessonId}". Progression globale : ${newProgressPercent}%.`,
        messageEn: `You successfully completed "${currentLesson?.title || lessonId}". Overall progress: ${newProgressPercent}%.`,
        type: "success",
        targetRole: "student",
        targetStudentId: student.id,
        targetSchoolId: student.schoolId,
      })
    );

    // Module completion notification
    if (isModuleCompleted && currentModule) {
      newNotifications.push(
        createSystemNotification({
          title: `🎉 Module terminé : ${currentModule.title}`,
          titleEn: `🎉 Module completed: ${currentModule.title}`,
          message: `Félicitations ! Vous avez validé l'intégralité du module "${currentModule.title}". Le module suivant est désormais débloqué !`,
          messageEn: `Congratulations! You validated the entire module "${currentModule.title}". The next module is now unlocked!`,
          type: "urgent",
          targetRole: "student",
          targetStudentId: student.id,
          targetSchoolId: student.schoolId,
        })
      );
    }

    // Program completion celebration
    if (isProgramCompleted) {
      newNotifications.push(
        createSystemNotification({
          title: `🏆 Programme complété à 100% : ${program.title}`,
          titleEn: `🏆 Program 100% Completed: ${program.title}`,
          message: `Bravo ${student.name} ! Vous avez atteint 100% de complétion sur la formation "${program.title}" (${program.level}). Votre attestation est prête.`,
          messageEn: `Well done ${student.name}! You have achieved 100% completion for "${program.title}" (${program.level}). Your certificate is ready.`,
          type: "urgent",
          targetRole: "student",
          targetStudentId: student.id,
          targetSchoolId: student.schoolId,
        })
      );
    }

    // 11. Activity Log
    const activityLog = createActivityLog({
      action: "Complétion de leçon",
      details: `L'élève ${student.name} a terminé la leçon "${currentLesson?.title || lessonId}" (${newProgressPercent}% du programme).`,
      actorRole: "student",
      actorName: student.name,
      schoolId: student.schoolId,
      schoolName: student.schoolName,
      entityType: "enrollment",
      entityId: lessonId,
      newValue: `${newProgressPercent}%`,
      status: "success",
    });

    return {
      student: updatedStudent,
      updatedEnrollment,
      lessonProgress,
      isModuleCompleted,
      completedModule: currentModule,
      isProgramCompleted,
      newProgressPercent,
      unlockedLessonIds,
      newNotifications,
      activityLog,
    };
  }
}
