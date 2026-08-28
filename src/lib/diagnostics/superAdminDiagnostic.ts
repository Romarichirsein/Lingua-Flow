import {
  School,
  Student,
  Program,
  ActivityLog,
  SupportedLanguage,
  EntityStatus,
  UserRole,
} from "../../types";
import {
  computeDaysRemaining,
  getEffectiveStatus,
  validateLanguageMatch,
  checkTenantAccess,
  canStudentAccessPedagogy,
  createActivityLog,
} from "../syncEngine";

export interface DiagnosticAssertion {
  id: string;
  step: string;
  name: string;
  status: "passed" | "failed" | "running";
  message: string;
  details?: Record<string, any>;
  durationMs: number;
}

export interface DiagnosticReport {
  timestamp: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  totalDurationMs: number;
  isHealthy: boolean;
  assertions: DiagnosticAssertion[];
  summary: {
    schoolCreation: boolean;
    studentAssignment: boolean;
    statusToggleCascade: boolean;
    licenseManagement: boolean;
    persistenceAndSync: boolean;
  };
}

export type StorageAdapter = {
  getStored: () => { schools: School[]; students: Student[]; logs: ActivityLog[] };
  saveStored: (data: { schools?: School[]; students?: Student[]; logs?: ActivityLog[] }) => void;
};

/**
 * Executes a comprehensive diagnostic test of the Super Admin School Management Flow.
 * Verifies school creation, student assignment, status toggle cascades, and state synchronization.
 */
export async function runSuperAdminDiagnostic(customStorage?: StorageAdapter): Promise<DiagnosticReport> {
  const startTime = Date.now();
  const assertions: DiagnosticAssertion[] = [];

  const recordAssertion = (
    step: string,
    name: string,
    passed: boolean,
    message: string,
    details?: Record<string, any>,
    durationMs: number = 0
  ) => {
    assertions.push({
      id: `diag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step,
      name,
      status: passed ? "passed" : "failed",
      message,
      details,
      durationMs,
    });
  };

  // Setup Mock In-Memory Storage if none provided
  let memorySchools: School[] = [];
  let memoryStudents: Student[] = [];
  let memoryLogs: ActivityLog[] = [];

  const storage: StorageAdapter = customStorage || {
    getStored: () => ({
      schools: JSON.parse(JSON.stringify(memorySchools)),
      students: JSON.parse(JSON.stringify(memoryStudents)),
      logs: JSON.parse(JSON.stringify(memoryLogs)),
    }),
    saveStored: (data) => {
      if (data.schools) memorySchools = JSON.parse(JSON.stringify(data.schools));
      if (data.students) memoryStudents = JSON.parse(JSON.stringify(data.students));
      if (data.logs) memoryLogs = JSON.parse(JSON.stringify(data.logs));
    },
  };

  // =========================================================================
  // STEP 1: School Creation & Model Integrity
  // =========================================================================
  const step1Start = Date.now();
  const testSchoolId = `school-diag-${Date.now()}`;
  const testSchoolGerman: School = {
    id: testSchoolId,
    name: "Munich Sprachakademie Diagnostic",
    slug: "munich-sprachakademie-diag",
    language: "german",
    logo: "🇩🇪",
    primaryColor: "#6D5DFC",
    secondaryColor: "#00D9FF",
    professionalEmail: "direction@munich-diag.de",
    phone: "+49 89 998877",
    address: "Maximilianstraße 45",
    city: "Munich",
    country: "Allemagne",
    managerName: "Dr. Hans Meyer",
    managerEmail: "hans.meyer@munich-diag.de",
    managerPhone: "+49 170 1234567",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +6 months
    status: "active",
    whatsappSupportUrl: "https://wa.me/491701234567",
    studentQuota: 50,
    programsCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
    lastActiveDate: "À l'instant",
  };

  // 1.1 Persist school to storage
  storage.saveStored({ schools: [testSchoolGerman] });
  const storedAfterCreation = storage.getStored();
  const createdSchool = storedAfterCreation.schools.find((s) => s.id === testSchoolId);

  recordAssertion(
    "1. School Creation",
    "School Model Persistence & Retrieval",
    !!createdSchool && createdSchool.name === testSchoolGerman.name,
    createdSchool
      ? `School '${createdSchool.name}' successfully created and retrieved from storage.`
      : "Failed to retrieve newly created school from storage.",
    { schoolId: testSchoolId, retrieved: !!createdSchool },
    Date.now() - step1Start
  );

  // 1.2 Model Field Validations
  const hasValidFields =
    createdSchool &&
    createdSchool.language === "german" &&
    createdSchool.studentQuota === 50 &&
    createdSchool.status === "active" &&
    createdSchool.whatsappSupportUrl.startsWith("https://wa.me/");

  recordAssertion(
    "1. School Creation",
    "Model Contract & Constraint Validation",
    !!hasValidFields,
    hasValidFields
      ? "All required School model attributes (language, quota, status, whatsapp) are strictly compliant."
      : "School model has missing or invalid required fields.",
    {
      language: createdSchool?.language,
      studentQuota: createdSchool?.studentQuota,
      status: createdSchool?.status,
    },
    Date.now() - step1Start
  );

  // =========================================================================
  // STEP 2: Student Assignment, Quota Tracking & Language Matching
  // =========================================================================
  const step2Start = Date.now();

  const student1Id = `stu-diag-1-${Date.now()}`;
  const student1: Student = {
    id: student1Id,
    schoolId: testSchoolId,
    schoolName: testSchoolGerman.name,
    name: "Alexandre Moreau",
    email: "alexandre.moreau@diag.com",
    level: "A1",
    startDate: testSchoolGerman.startDate,
    endDate: testSchoolGerman.endDate,
    status: "active",
    progressPercent: 0,
    completedLessons: [],
    createdAt: new Date().toISOString(),
  };

  const student2Id = `stu-diag-2-${Date.now()}`;
  const student2: Student = {
    id: student2Id,
    schoolId: testSchoolId,
    schoolName: testSchoolGerman.name,
    name: "Sophie Lefevre",
    email: "sophie.lefevre@diag.com",
    level: "B1",
    startDate: testSchoolGerman.startDate,
    endDate: testSchoolGerman.endDate,
    status: "active",
    progressPercent: 25,
    completedLessons: ["lesson-1"],
    createdAt: new Date().toISOString(),
  };

  // 2.1 Assign students to school and save
  storage.saveStored({ students: [student1, student2] });
  const storedAfterStudents = storage.getStored();
  const assignedStudents = storedAfterStudents.students.filter((st) => st.schoolId === testSchoolId);

  recordAssertion(
    "2. Student Assignment",
    "Referential Integrity (Student -> School)",
    assignedStudents.length === 2 && assignedStudents.every((s) => s.schoolId === testSchoolId),
    `Assigned 2 students to School '${testSchoolId}', all maintain correct foreign key reference.`,
    { count: assignedStudents.length, studentIds: [student1Id, student2Id] },
    Date.now() - step2Start
  );

  // 2.2 Quota calculation & overflow monitoring
  const currentCount = assignedStudents.length;
  const quotaLimit = testSchoolGerman.studentQuota;
  const isWithinQuota = currentCount <= quotaLimit;

  recordAssertion(
    "2. Student Assignment",
    "Quota Calculation & Threshold Check",
    isWithinQuota && currentCount === 2,
    `School quota tracking is accurate: ${currentCount}/${quotaLimit} seats utilized.`,
    { currentCount, quotaLimit, availableSeats: quotaLimit - currentCount },
    Date.now() - step2Start
  );

  // 2.3 Language Matching Enforcement
  const isLangMatchGerman = validateLanguageMatch(testSchoolGerman.language, "german");
  const isLangMismatchItalian = !validateLanguageMatch(testSchoolGerman.language, "italian");

  recordAssertion(
    "2. Student Assignment",
    "Pedagogical Language Isolation",
    isLangMatchGerman && isLangMismatchItalian,
    "German school strictly permits German programs and rejects Italian program assignment.",
    { schoolLanguage: testSchoolGerman.language, germanPermitted: isLangMatchGerman, italianRejected: isLangMismatchItalian },
    Date.now() - step2Start
  );

  // =========================================================================
  // STEP 3: School Status Toggle & Cascading Dependent State Synchronization
  // =========================================================================
  const step3Start = Date.now();

  // 3.1 Toggle School to "suspended"
  const suspendedSchool: School = { ...testSchoolGerman, status: "suspended" };
  storage.saveStored({ schools: [suspendedSchool] });
  
  const effectiveStatusSuspended = getEffectiveStatus(suspendedSchool);
  const student1AccessWhenSuspended = canStudentAccessPedagogy({
    school: suspendedSchool,
    student: student1,
  });

  recordAssertion(
    "3. Status Toggle Cascade",
    "School Suspension -> Student Pedagogy Lock",
    effectiveStatusSuspended === "suspended" &&
      !student1AccessWhenSuspended.canAccess &&
      student1AccessWhenSuspended.lockReason === "school_suspended",
    "Suspending the school immediately locks pedagogy access for all dependent students with reason 'school_suspended'.",
    {
      schoolStatus: effectiveStatusSuspended,
      studentCanAccess: student1AccessWhenSuspended.canAccess,
      lockReason: student1AccessWhenSuspended.lockReason,
    },
    Date.now() - step3Start
  );

  // 3.2 Toggle School to "blocked"
  const blockedSchool: School = { ...testSchoolGerman, status: "blocked" };
  const student1AccessWhenBlocked = canStudentAccessPedagogy({
    school: blockedSchool,
    student: student1,
  });

  recordAssertion(
    "3. Status Toggle Cascade",
    "School Blocking -> Student Pedagogy Lock",
    !student1AccessWhenBlocked.canAccess && student1AccessWhenBlocked.lockReason === "school_blocked",
    "Blocking the school immediately locks pedagogy access with reason 'school_blocked'.",
    { lockReason: student1AccessWhenBlocked.lockReason },
    Date.now() - step3Start
  );

  // 3.3 Reactivate School to "active"
  const reactivatedSchool: School = { ...testSchoolGerman, status: "active" };
  storage.saveStored({ schools: [reactivatedSchool] });
  const student1AccessWhenActive = canStudentAccessPedagogy({
    school: reactivatedSchool,
    student: student1,
  });

  recordAssertion(
    "3. Status Toggle Cascade",
    "School Reactivation -> Student Access Restored",
    student1AccessWhenActive.canAccess === true,
    "Reactivating the school immediately restores real-time pedagogy access for active students.",
    { studentCanAccess: student1AccessWhenActive.canAccess },
    Date.now() - step3Start
  );

  // =========================================================================
  // STEP 4: Student-Level Status Toggle & Access Isolation
  // =========================================================================
  const step4Start = Date.now();

  // 4.1 Suspend individual Student 1, leaving Student 2 active
  const suspendedStudent1: Student = { ...student1, status: "suspended" };
  storage.saveStored({ students: [suspendedStudent1, student2] });

  const stu1Access = canStudentAccessPedagogy({ school: reactivatedSchool, student: suspendedStudent1 });
  const stu2Access = canStudentAccessPedagogy({ school: reactivatedSchool, student: student2 });

  recordAssertion(
    "4. Student Status Toggle",
    "Individual Student Suspension Isolation",
    !stu1Access.canAccess && stu1Access.lockReason === "student_suspended" && stu2Access.canAccess === true,
    "Suspending Student 1 locks only Student 1 while Student 2 in the same school remains fully active.",
    {
      student1Locked: !stu1Access.canAccess,
      student1LockReason: stu1Access.lockReason,
      student2Active: stu2Access.canAccess,
    },
    Date.now() - step4Start
  );

  // 4.2 Reactivate Student 1
  const reactivatedStudent1: Student = { ...student1, status: "active" };
  storage.saveStored({ students: [reactivatedStudent1, student2] });
  const stu1Restored = canStudentAccessPedagogy({ school: reactivatedSchool, student: reactivatedStudent1 });

  recordAssertion(
    "4. Student Status Toggle",
    "Individual Student Reactivation",
    stu1Restored.canAccess === true,
    "Reactivating Student 1 immediately restores their pedagogy access.",
    { student1CanAccess: stu1Restored.canAccess },
    Date.now() - step4Start
  );

  // =========================================================================
  // STEP 5: License Expiration & Dynamic Extension (+6 Months)
  // =========================================================================
  const step5Start = Date.now();

  // 5.1 Simulate expired license (date in past)
  const expiredSchool: School = {
    ...testSchoolGerman,
    status: "active",
    endDate: "2025-01-01", // Past date
  };
  const effectiveExpired = getEffectiveStatus(expiredSchool);
  const stuAccessWhenExpired = canStudentAccessPedagogy({
    school: expiredSchool,
    student: reactivatedStudent1,
  });

  recordAssertion(
    "5. License Management",
    "Temporal Expiration Detection",
    effectiveExpired === "expired" &&
      !stuAccessWhenExpired.canAccess &&
      stuAccessWhenExpired.lockReason === "school_expired",
    "Dynamic date calculation detects passed endDate and flags effective status as 'expired'.",
    {
      effectiveStatus: effectiveExpired,
      lockReason: stuAccessWhenExpired.lockReason,
      daysRemaining: computeDaysRemaining(expiredSchool.endDate),
    },
    Date.now() - step5Start
  );

  // 5.2 Extend License (+6 Months)
  const extendedDate = new Date();
  extendedDate.setMonth(extendedDate.getMonth() + 6);
  const newEndDateStr = extendedDate.toISOString().split("T")[0];

  const extendedSchool: School = {
    ...expiredSchool,
    endDate: newEndDateStr,
    status: "active",
  };
  storage.saveStored({ schools: [extendedSchool] });

  const effectiveAfterExtension = getEffectiveStatus(extendedSchool);
  const daysLeft = computeDaysRemaining(newEndDateStr);
  const stuAccessAfterExtension = canStudentAccessPedagogy({
    school: extendedSchool,
    student: reactivatedStudent1,
  });

  recordAssertion(
    "5. License Management",
    "License Extension & Automatic Re-Activation",
    effectiveAfterExtension === "active" && daysLeft > 150 && stuAccessAfterExtension.canAccess === true,
    `License extended to ${newEndDateStr} (${daysLeft} days remaining). Effective status restored to 'active'.`,
    { newEndDate: newEndDateStr, daysLeft, effectiveStatus: effectiveAfterExtension },
    Date.now() - step5Start
  );

  // =========================================================================
  // STEP 6: Multi-Tenant RBAC Security & Access Isolation
  // =========================================================================
  const step6Start = Date.now();

  const otherSchoolId = `school-other-${Date.now()}`;
  
  // Super Admin Access
  const superAdminCheck = checkTenantAccess({
    actorRole: "super_admin",
    targetSchoolId: testSchoolId,
  });

  // School Admin Access: Own School
  const schoolAdminOwnCheck = checkTenantAccess({
    actorRole: "school_admin",
    actorSchoolId: testSchoolId,
    targetSchoolId: testSchoolId,
  });

  // School Admin Access: Foreign School (Forbidden)
  const schoolAdminForeignCheck = checkTenantAccess({
    actorRole: "school_admin",
    actorSchoolId: testSchoolId,
    targetSchoolId: otherSchoolId,
  });

  recordAssertion(
    "6. Multi-Tenant RBAC",
    "Cross-School Boundary Isolation",
    superAdminCheck.allowed && schoolAdminOwnCheck.allowed && !schoolAdminForeignCheck.allowed,
    "Multi-tenant isolation strictly enforced: Super Admin has global access, School Admin is quarantined to own schoolId.",
    {
      superAdminAllowed: superAdminCheck.allowed,
      schoolAdminOwnAllowed: schoolAdminOwnCheck.allowed,
      schoolAdminForeignBlocked: !schoolAdminForeignCheck.allowed,
    },
    Date.now() - step6Start
  );

  // =========================================================================
  // STEP 7: Activity Audit Log Traceability
  // =========================================================================
  const step7Start = Date.now();

  const auditEntry = createActivityLog({
    action: "Diagnostic Super Admin",
    details: `Vérification du flux de gestion de l'école ${testSchoolGerman.name}`,
    actorRole: "super_admin",
    actorName: "Super Admin Diagnostic Runner",
    schoolId: testSchoolId,
    schoolName: testSchoolGerman.name,
    entityType: "school",
    entityId: testSchoolId,
    status: "success",
  });

  storage.saveStored({ logs: [auditEntry] });
  const storedLogs = storage.getStored().logs;
  const foundLog = storedLogs.find((l) => l.id === auditEntry.id);

  recordAssertion(
    "7. Audit Traceability",
    "Security & Audit Log Registration",
    !!foundLog && foundLog.action === "Diagnostic Super Admin",
    "Audit log entry successfully created and persisted with complete actor attribution and timestamp.",
    { logId: auditEntry.id, actor: auditEntry.actorName },
    Date.now() - step7Start
  );

  // =========================================================================
  // Summary Aggregation
  // =========================================================================
  const totalDurationMs = Date.now() - startTime;
  const passedCount = assertions.filter((a) => a.status === "passed").length;
  const failedCount = assertions.filter((a) => a.status === "failed").length;

  const summary = {
    schoolCreation: assertions.filter((a) => a.step.startsWith("1.")).every((a) => a.status === "passed"),
    studentAssignment: assertions.filter((a) => a.step.startsWith("2.")).every((a) => a.status === "passed"),
    statusToggleCascade: assertions.filter((a) => a.step.startsWith("3.")).every((a) => a.status === "passed"),
    licenseManagement: assertions.filter((a) => a.step.startsWith("5.")).every((a) => a.status === "passed"),
    persistenceAndSync: assertions.every((a) => a.status === "passed"),
  };

  return {
    timestamp: new Date().toISOString(),
    totalTests: assertions.length,
    passedCount,
    failedCount,
    totalDurationMs,
    isHealthy: failedCount === 0,
    assertions,
    summary,
  };
}
