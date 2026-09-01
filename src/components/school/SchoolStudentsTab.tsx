import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Student,
  School,
  Program,
  UILocale,
  CEFRLevel,
  EntityStatus,
} from "../../types";
import { translations } from "../../lib/translations";
import {
  Search,
  Plus,
  Download,
  Upload,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Shield,
  Eye,
} from "lucide-react";
import { NeonButton } from "../common/NeonButton";
import { ProgressBar } from "../common/ProgressBar";
import { Modal } from "../common/Modal";
import { SchoolStudentDetailModal } from "./SchoolStudentDetailModal";

interface SchoolStudentsTabProps {
  locale: UILocale;
  school: School;
  students: Student[];
  programs: Program[];
  submissions?: any[];
  onUpdateStudents: (students: Student[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
  onSelectStudentTab?: (studentId: string) => void;
  onOpenStudentDetail?: (student: Student) => void;
}

export const SchoolStudentsTab: React.FC<SchoolStudentsTabProps> = ({
  locale,
  school,
  students,
  programs,
  submissions = [],
  onUpdateStudents,
  onAddLog,
  onSelectStudentTab,
  onOpenStudentDetail,
}) => {
  const t = translations[locale];
  const isEn = locale === "en";

  // Filter school's own students
  const schoolStudents = students.filter((s) => s.schoolId === school.id);
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);

  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "expiry" | "recent">("recent");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Student for Detail Dossier
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [extendStudent, setExtendStudent] = useState<Student | null>(null);
  const [extendMonths, setExtendMonths] = useState<number>(3);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState("");
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);

  // Form State
  const defaultStartDate = new Date().toISOString().split("T")[0];
  const defaultEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "A1" as CEFRLevel,
    enrolledProgramId: schoolPrograms[0]?.id || "",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  // Filtered & Sorted Student List
  const filteredStudents = schoolStudents
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone && s.phone.includes(searchTerm));
      const matchLevel = levelFilter === "all" || s.level === levelFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchProgram = programFilter === "all" || s.enrolledProgramId === programFilter;
      return matchSearch && matchLevel && matchStatus && matchProgram;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return (b.progressPercent || 0) - (a.progressPercent || 0);
      if (sortBy === "expiry") return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      return new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime();
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Quota validation
  const isQuotaReached = schoolStudents.length >= school.studentQuota;
  const quotaUsedPercent = Math.min(
    100,
    Math.round((schoolStudents.length / Math.max(1, school.studentQuota)) * 100)
  );

  const [addStudentError, setAddStudentError] = useState<string | null>(null);

  // Add Student Handler
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setAddStudentError(null);
    if (!formData.name.trim() || !formData.email.trim()) {
      setAddStudentError(isEn ? "Name and Email are required." : "Le nom et l'email sont obligatoires.");
      return;
    }

    if (isQuotaReached) {
      setAddStudentError(
        isEn
          ? "Student quota reached for this school. Please contact Super Admin to increase your quota."
          : "Quota d'élèves atteint pour cette école. Contactez le Super Admin pour augmenter votre quota."
      );
      return;
    }

    const newStudent: Student = {
      id: `std_${Date.now()}`,
      schoolId: school.id,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      level: formData.level,
      enrolledProgramId: formData.enrolledProgramId || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "active",
      progressPercent: 0,
      completedLessons: [],
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newStudent, ...students];
    onUpdateStudents(updatedList);
    onAddLog(
      "Inscription d'un élève",
      `Nouvel élève ${newStudent.name} (${newStudent.level} - ${school.language}) inscrit avec succès.`,
      "success"
    );

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      level: "A1",
      enrolledProgramId: schoolPrograms[0]?.id || "",
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    });
  };

  // Edit Student Handler
  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = students.map((s) => {
      if (s.id === editingStudent.id) {
        return {
          ...s,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || undefined,
          level: formData.level,
          enrolledProgramId: formData.enrolledProgramId || undefined,
          startDate: formData.startDate,
          endDate: formData.endDate,
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    onAddLog(
      "Modification d'un élève",
      `Informations mises à jour pour l'élève ${formData.name}.`,
      "success"
    );
    setEditingStudent(null);
  };

  // Toggle Status Handler
  const handleToggleStatus = (student: Student, newStatus: EntityStatus) => {
    const updated = students.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s));
    onUpdateStudents(updated);
    onAddLog(
      "Changement de statut élève",
      `Statut de ${student.name} passé à ${newStatus.toUpperCase()}.`,
      newStatus === "active" ? "success" : "warning"
    );
    if (selectedStudentForDetail?.id === student.id) {
      setSelectedStudentForDetail({ ...selectedStudentForDetail, status: newStatus });
    }
  };

  // Extend Access Handler
  const handleExtendAccess = (student: Student, months: number) => {
    const currentEnd = new Date(student.endDate);
    const newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + months);
    const newEndDateStr = newEnd.toISOString().split("T")[0];

    const updated = students.map((s) =>
      s.id === student.id ? { ...s, endDate: newEndDateStr, status: "active" as EntityStatus } : s
    );

    onUpdateStudents(updated);
    onAddLog(
      "Prolongation de formation",
      `Période d'accès de ${student.name} prolongée de +${months} mois (jusqu'au ${newEndDateStr}).`,
      "success"
    );
    setExtendStudent(null);
    if (selectedStudentForDetail?.id === student.id) {
      setSelectedStudentForDetail({
        ...selectedStudentForDetail,
        endDate: newEndDateStr,
        status: "active",
      });
    }
  };

  // Delete Student Permanently
  const handleDeleteStudent = () => {
    if (!deletingStudent) return;
    const updated = students.filter((s) => s.id !== deletingStudent.id);
    onUpdateStudents(updated);
    onAddLog(
      "Suppression définitive élève",
      `L'élève ${deletingStudent.name} (${deletingStudent.email}) a été supprimé.`,
      "warning"
    );
    setDeletingStudent(null);
    if (selectedStudentForDetail?.id === deletingStudent.id) {
      setSelectedStudentForDetail(null);
    }
  };

  // CSV Import Batch Parser
  const handleProcessCsvImport = () => {
    if (!csvRawText.trim()) return;

    try {
      const lines = csvRawText.trim().split("\n");
      const newEnrolled: Student[] = [];
      let skippedCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("name") || line.startsWith("Nom")) continue;

        // format: name,email,phone,level
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length < 2) {
          skippedCount++;
          continue;
        }

        const [name, email, phone, rawLevel] = parts;
        const level: CEFRLevel = ["A1", "A2", "B1", "B2", "C1"].includes(rawLevel)
          ? (rawLevel as CEFRLevel)
          : "A1";

        if (schoolStudents.length + newEnrolled.length >= school.studentQuota) {
          skippedCount += lines.length - i;
          break;
        }

        newEnrolled.push({
          id: `std_csv_${Date.now()}_${i}`,
          schoolId: school.id,
          name,
          email: email.toLowerCase(),
          phone: phone || undefined,
          level,
          enrolledProgramId: schoolPrograms[0]?.id,
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          status: "active",
          progressPercent: 0,
          completedLessons: [],
          createdAt: new Date().toISOString(),
        });
      }

      if (newEnrolled.length > 0) {
        onUpdateStudents([...newEnrolled, ...students]);
        onAddLog(
          "Importation CSV Élèves",
          `${newEnrolled.length} élèves importés avec succès (${skippedCount} ignorés).`,
          "success"
        );
        setCsvFeedback(
          isEn
            ? `Successfully imported ${newEnrolled.length} student(s).`
            : `${newEnrolled.length} élève(s) importé(s) avec succès.`
        );
        setTimeout(() => {
          setIsCsvImportOpen(false);
          setCsvRawText("");
          setCsvFeedback(null);
        }, 1500);
      } else {
        setCsvFeedback(
          isEn ? "No valid student rows found in CSV." : "Aucune ligne valide trouvée dans le CSV."
        );
      }
    } catch (err) {
      setCsvFeedback(isEn ? "Error parsing CSV content." : "Erreur de lecture du format CSV.");
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = "ID,Nom,Email,Telephone,Langue,Niveau,Statut,Progression,DateDebut,DateFin\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.email}","${s.phone || ""}","${school.language}","${s.level}","${s.status}","${s.progressPercent}%","${s.startDate}","${s.endDate}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `linguaflow_${school.slug}_students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Quota Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0D1220] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Student Roster & Cohorts" : "Gestion des Élèves & Cohortes"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
              {schoolStudents.length} {isEn ? "students" : "inscrits"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
            {isEn
              ? `Authorized Language: ${school.language === "german" ? "German 🇩🇪" : "Italian 🇮🇹"} (Strictly inherited by all learners)`
              : `Langue autorisée : ${school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"} (Attribuée automatiquement à tous les élèves)`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[42px]"
            title="Exporter la liste des élèves en CSV"
          >
            <Download size={14} />
            <span>{isEn ? "Export CSV" : "Exporter CSV"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCsvImportOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[42px]"
            title="Importer des élèves par lot"
          >
            <Upload size={14} />
            <span>{isEn ? "Import CSV" : "Importer CSV"}</span>
          </button>

          <NeonButton
            variant="cyan"
            size="md"
            disabled={isQuotaReached}
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                phone: "",
                level: "A1",
                enrolledProgramId: schoolPrograms[0]?.id || "",
                startDate: defaultStartDate,
                endDate: defaultEndDate,
              });
              setIsAddModalOpen(true);
            }}
            icon={<Plus size={16} />}
          >
            {isEn ? "Enroll Student" : "Inscrire un Élève"}
          </NeonButton>
        </div>
      </div>

      {/* Quota Alert if full */}
      {isQuotaReached && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-500 dark:text-amber-400">
          <AlertTriangle size={18} className="shrink-0" />
          <span>
            {isEn
              ? "Your student quota limit is reached. Contact Super Admin to upgrade your school package."
              : "Le quota maximal d'élèves autorisés pour votre école est atteint. Contactez le Super Admin pour étendre votre licence."}
          </span>
        </div>
      )}

      {/* Filters, Search & Sort Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isEn ? "Search by name, email, phone..." : "Rechercher par nom, email, tél..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
          />
        </div>

        {/* Level Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white font-medium"
          >
            <option value="all">{isEn ? "All Levels (CEFR)" : "Tous les Niveaux"}</option>
            <option value="A1">Niveau A1</option>
            <option value="A2">Niveau A2</option>
            <option value="B1">Niveau B1</option>
            <option value="B2">Niveau B2</option>
            <option value="C1">Niveau C1</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white font-medium"
          >
            <option value="all">{isEn ? "All Statuses" : "Tous les Statuts"}</option>
            <option value="active">{isEn ? "Active" : "Actif"}</option>
            <option value="suspended">{isEn ? "Suspended" : "Suspendu"}</option>
            <option value="expired">{isEn ? "Expired" : "Expiré"}</option>
            <option value="blocked">{isEn ? "Blocked" : "Bloqué"}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white font-medium"
          >
            <option value="recent">{isEn ? "Sort: Recent" : "Tri : Récents"}</option>
            <option value="name">{isEn ? "Sort: Name (A-Z)" : "Tri : Nom (A-Z)"}</option>
            <option value="progress">{isEn ? "Sort: Progress" : "Tri : Progression"}</option>
            <option value="expiry">{isEn ? "Sort: Expiry Date" : "Tri : Date d'expiration"}</option>
          </select>
        </div>
      </div>

      {/* Desktop Students Table */}
      <div className="hidden md:block bg-white dark:bg-[#0D1220] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/50 border-b border-slate-200 dark:border-white/10 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">{isEn ? "Learner" : "Apprenant"}</th>
              <th className="py-3.5 px-4">{isEn ? "Level & Language" : "Niveau & Langue"}</th>
              <th className="py-3.5 px-4">{isEn ? "Curriculum" : "Programme"}</th>
              <th className="py-3.5 px-4">{isEn ? "Progress" : "Progression"}</th>
              <th className="py-3.5 px-4">{isEn ? "Access Period" : "Validité"}</th>
              <th className="py-3.5 px-4">{isEn ? "Status" : "Statut"}</th>
              <th className="py-3.5 px-4 text-right">{isEn ? "Actions" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-white/40">
                  {isEn ? "No students matching criteria." : "Aucun élève correspondant aux filtres."}
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const enrolledProg = schoolPrograms.find((p) => p.id === student.enrolledProgramId);
                const endDate = new Date(student.endDate);
                const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isNearingExpiry = daysRemaining >= 0 && daysRemaining <= 15;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedStudentForDetail(student)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                          <div className="text-[11px] text-slate-400 dark:text-white/40">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] font-bold font-mono text-[11px]">
                          {student.level}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-white/60">
                          {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 dark:text-white/80 font-medium truncate block max-w-[150px]">
                        {enrolledProg ? enrolledProg.title : "—"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-white/60">
                          <span>{student.progressPercent}%</span>
                          <span>{(student.completedLessons || []).length} leçons</span>
                        </div>
                        <ProgressBar progress={student.progressPercent} color="cyan" size="sm" />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[11px]">
                        <span className="block text-slate-700 dark:text-white/90 font-medium">
                          {student.endDate}
                        </span>
                        <span
                          className={`font-mono text-[10px] ${
                            daysRemaining <= 0
                              ? "text-rose-400 font-bold"
                              : isNearingExpiry
                              ? "text-amber-400 font-bold"
                              : "text-slate-400 dark:text-white/40"
                          }`}
                        >
                          {daysRemaining <= 0 ? "Expiré" : `${daysRemaining}j restants`}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === "active"
                            ? "bg-[#20E3A2]/10 text-[#20E3A2] border border-[#20E3A2]/30"
                            : student.status === "suspended"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : student.status === "blocked"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                        }`}
                      >
                        {student.status.toUpperCase()}
                      </span>
                    </td>

                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              name: student.name,
                              email: student.email,
                              phone: student.phone || "",
                              level: student.level,
                              enrolledProgramId: student.enrolledProgramId || schoolPrograms[0]?.id || "",
                              startDate: student.startDate,
                              endDate: student.endDate,
                            });
                            setEditingStudent(student);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                          title="Modifier les informations"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setExtendStudent(student)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#20E3A2] hover:bg-[#20E3A2]/10 transition"
                          title="Prolonger la période d'accès"
                        >
                          <Calendar size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingStudent(student)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Supprimer l'élève"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Student Cards Grid */}
      <div className="md:hidden space-y-3">
        {paginatedStudents.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#0D1220] rounded-2xl text-slate-400 text-xs border border-slate-200 dark:border-white/10">
            {isEn ? "No students matching criteria." : "Aucun élève correspondant aux filtres."}
          </div>
        ) : (
          paginatedStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudentForDetail(student)}
              className="p-4 bg-white dark:bg-[#0D1220] rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</h4>
                    <span className="text-[11px] text-slate-400 dark:text-white/40">{student.email}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    student.status === "active"
                      ? "bg-[#20E3A2]/10 text-[#20E3A2]"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {student.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-white/5">
                <span className="px-2 py-0.5 rounded-md bg-[#6D5DFC]/10 text-[#6D5DFC] font-bold font-mono">
                  {student.level} • {school.language === "german" ? "🇩🇪" : "🇮🇹"}
                </span>
                <span className="font-mono text-slate-500 dark:text-white/60">
                  {student.progressPercent}% terminé
                </span>
              </div>

              <ProgressBar progress={student.progressPercent} color="cyan" size="sm" />
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-white/50">
            Page {currentPage} / {totalPages} ({filteredStudents.length} élèves)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white disabled:opacity-30 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white disabled:opacity-30 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Detailed Student Dossier */}
      <SchoolStudentDetailModal
        isOpen={Boolean(selectedStudentForDetail)}
        onClose={() => setSelectedStudentForDetail(null)}
        locale={locale}
        student={selectedStudentForDetail}
        school={school}
        programs={programs}
        submissions={submissions}
        onToggleStatus={handleToggleStatus}
        onExtendAccess={handleExtendAccess}
        onResetProgress={(student) => {
          const updatedList = students.map((s) =>
            s.id === student.id ? { ...s, progressPercent: 0, completedLessons: [] } : s
          );
          onUpdateStudents(updatedList);
          if (selectedStudentForDetail?.id === student.id) {
            setSelectedStudentForDetail({ ...selectedStudentForDetail, progressPercent: 0, completedLessons: [] });
          }
          onAddLog(
            "Réinitialisation progression",
            `Progression de l'élève ${student.name} remise à zéro.`,
            "warning"
          );
        }}
        onSelectStudentTab={onSelectStudentTab}
      />

      {/* MODAL: Add Student */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isEn ? "Enroll New Student" : "Inscrire un Nouvel Élève"}
        size="lg"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          {addStudentError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{addStudentError}</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 text-xs text-slate-700 dark:text-white/80 flex items-center justify-between">
            <span>Langue enseignée autorisée :</span>
            <span className="font-bold text-[#6D5DFC] dark:text-[#a399ff]">
              {school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"} (Verrouillé)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Full Name *" : "Nom et Prénom *"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Sophie Wagner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Email Address *" : "Adresse E-mail *"}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sophie@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Phone / WhatsApp" : "Téléphone / WhatsApp"}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "CEFR Level" : "Niveau CECRL"}
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold"
              >
                <option value="A1">A1 - Débutant</option>
                <option value="A2">A2 - Élémentaire</option>
                <option value="B1">B1 - Intermédiaire</option>
                <option value="B2">B2 - Intermédiaire Avancé</option>
                <option value="C1">C1 - Autonome / Avancé</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Assigned Curriculum" : "Programme Affecté"}
              </label>
              <select
                value={formData.enrolledProgramId}
                onChange={(e) => setFormData({ ...formData, enrolledProgramId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium"
              >
                {schoolPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Start Date" : "Date de début"}
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Expiration Date" : "Date d'expiration"}
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Confirm Enrollment" : "Valider l'Inscription"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Edit Student */}
      <Modal
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        title={isEn ? "Edit Student Info" : "Modifier l'Élève"}
        size="lg"
      >
        <form onSubmit={handleEditStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Full Name *" : "Nom et Prénom *"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Email Address *" : "Adresse E-mail *"}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Phone / WhatsApp" : "Téléphone / WhatsApp"}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "CEFR Level" : "Niveau CECRL"}
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Assigned Curriculum" : "Programme Affecté"}
              </label>
              <select
                value={formData.enrolledProgramId}
                onChange={(e) => setFormData({ ...formData, enrolledProgramId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium"
              >
                {schoolPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Start Date" : "Date de début"}
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Expiration Date" : "Date d'expiration"}
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" type="button" onClick={() => setEditingStudent(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" type="submit">
              {isEn ? "Save Changes" : "Enregistrer"}
            </NeonButton>
          </div>
        </form>
      </Modal>

      {/* MODAL: Extend Student Access */}
      <Modal
        isOpen={Boolean(extendStudent)}
        onClose={() => setExtendStudent(null)}
        title={isEn ? "Extend Student Access" : "Prolonger l'accès de la formation"}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-white/70">
            {isEn
              ? `Select how many months to extend training access for ${extendStudent?.name}:`
              : `Sélectionnez la durée de prolongation pour ${extendStudent?.name} :`}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[1, 3, 6, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setExtendMonths(m)}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  extendMonths === m
                    ? "bg-[#20E3A2]/15 border-[#20E3A2] text-[#20E3A2]"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"
                }`}
              >
                <span>+{m} {isEn ? (m > 1 ? "months" : "month") : "mois"}</span>
                {extendMonths === m && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setExtendStudent(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton
              variant="green"
              size="sm"
              onClick={() => extendStudent && handleExtendAccess(extendStudent, extendMonths)}
            >
              {isEn ? "Confirm Extension" : "Valider la prolongation"}
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* MODAL: Delete Student Confirmation */}
      <Modal
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        title={isEn ? "Confirm Permanent Deletion" : "Confirmation de Suppression"}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-500 dark:text-rose-300">
              <span className="font-bold block mb-1">
                {isEn ? "Warning: Irreversible action!" : "Attention : Action irréversible !"}
              </span>
              <span>
                {isEn
                  ? `Are you sure you want to permanently delete learner ${deletingStudent?.name}? All their lesson progress, completed exercises and AI corrections will be lost.`
                  : `Êtes-vous certain de vouloir supprimer définitivement l'élève ${deletingStudent?.name} ? Toute sa progression, devoirs et corrections IA seront supprimés.`}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setDeletingStudent(null)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="danger" size="sm" onClick={handleDeleteStudent}>
              {isEn ? "Delete Permanently" : "Supprimer Définitivement"}
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* MODAL: CSV Batch Import */}
      <Modal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        title={isEn ? "Batch CSV Student Import" : "Importation CSV d'Élèves"}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-white/70">
            {isEn
              ? "Paste CSV rows with the format: Name, Email, Phone, Level (A1/A2/B1/B2/C1)"
              : "Collez vos lignes au format CSV : Nom Prénom, Email, Téléphone, Niveau (A1/A2/B1/B2/C1)"}
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 font-mono text-[11px] text-slate-500 dark:text-white/50 border border-slate-200 dark:border-white/10">
            Exemple :<br />
            Klaus Müller, klaus@example.com, +49151234567, A1<br />
            Anja Weber, anja@example.com, +49152345678, A2
          </div>

          <textarea
            rows={6}
            value={csvRawText}
            onChange={(e) => setCsvRawText(e.target.value)}
            placeholder="Collez votre contenu CSV ici..."
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#00D9FF]"
          />

          {csvFeedback && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold text-[#00D9FF]">
              {csvFeedback}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <NeonButton variant="ghost" size="sm" onClick={() => setIsCsvImportOpen(false)}>
              {isEn ? "Cancel" : "Annuler"}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" onClick={handleProcessCsvImport}>
              {isEn ? "Process Import" : "Lancer l'Import"}
            </NeonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
