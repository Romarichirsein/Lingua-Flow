import React, { useState } from "react";
import { Student, School, UILocale, EntityStatus, CEFRLevel } from "../../types";
import { Modal } from "../common/Modal";
import { ProgressBar } from "../common/ProgressBar";
import { SchoolLogo } from "../common/SchoolLogo";
import {
  Users,
  Search,
  Download,
  Eye,
  Filter,
  GraduationCap,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  Copy,
  Check,
  Send,
  MessageCircle,
  EyeOff,
  Sparkles,
} from "lucide-react";

interface SuperAdminStudentsTabProps {
  students: Student[];
  schools: School[];
  locale: UILocale;
  onUpdateStudents: (students: Student[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminStudentsTab: React.FC<SuperAdminStudentsTabProps> = ({
  students,
  schools,
  locale,
  onUpdateStudents,
  onAddLog,
}) => {
  const isEn = locale === "en";
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection & Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [credentialsStudent, setCredentialsStudent] = useState<{ student: Student; pass: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolId: schools[0]?.id || "",
    level: "A2" as CEFRLevel,
    password: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "active" as EntityStatus,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789!#@";
    let res = "";
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      schoolId: schools[0]?.id || "",
      level: "A2",
      password: generateRandomPassword(),
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active",
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.schoolId) return;

    const chosenSchool = schools.find((s) => s.id === formData.schoolId);
    const newStudent: Student = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      schoolId: formData.schoolId,
      level: formData.level,
      status: formData.status,
      progressPercent: 0,
      completedLessons: [],
      startDate: formData.startDate,
      endDate: formData.endDate,
      enrolledAt: formData.startDate,
      expiresAt: formData.endDate,
    };

    onUpdateStudents([newStudent, ...students]);
    onAddLog(
      isEn ? "Student Enrolled by Super Admin" : "Élève Inscrit par Super Admin",
      isEn
        ? `Student '${newStudent.name}' enrolled into '${chosenSchool?.name || "School"}' (Level ${newStudent.level}).`
        : `L'élève '${newStudent.name}' a été inscrit dans l'école '${chosenSchool?.name || "École"}' (Niveau ${newStudent.level}).`,
      "success"
    );

    setIsCreateModalOpen(false);
    setCredentialsStudent({ student: newStudent, pass: formData.password });
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      schoolId: student.schoolId,
      level: student.level,
      password: "",
      startDate: student.startDate || student.enrolledAt || new Date().toISOString().split("T")[0],
      endDate: student.endDate || student.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: student.status,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = students.map((s) =>
      s.id === editingStudent.id
        ? {
            ...s,
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            schoolId: formData.schoolId,
            level: formData.level,
            startDate: formData.startDate,
            endDate: formData.endDate,
            enrolledAt: formData.startDate,
            expiresAt: formData.endDate,
            status: formData.status,
          }
        : s
    );

    onUpdateStudents(updated);
    onAddLog(
      isEn ? "Student Profile Updated" : "Profil Élève Modifié",
      isEn
        ? `Updated profile details for learner '${formData.name}'.`
        : `Mise à jour des coordonnées pour l'apprenant '${formData.name}'.`,
      "success"
    );

    if (selectedStudent && selectedStudent.id === editingStudent.id) {
      setSelectedStudent({
        ...selectedStudent,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        schoolId: formData.schoolId,
        level: formData.level,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrolledAt: formData.startDate,
        expiresAt: formData.endDate,
        status: formData.status,
      });
    }

    setEditingStudent(null);
  };

  const handleOpenDelete = (student: Student) => {
    setDeletingStudent(student);
    setDeleteConfirmText("");
  };

  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    const updated = students.filter((s) => s.id !== deletingStudent.id);
    onUpdateStudents(updated);
    onAddLog(
      isEn ? "Student Deleted" : "Suppression Élève",
      isEn
        ? `Student '${deletingStudent.name}' deleted by Super Administrator.`
        : `L'élève '${deletingStudent.name}' a été définitivement supprimé par le Super Admin.`,
      "warning"
    );

    if (selectedStudent && selectedStudent.id === deletingStudent.id) {
      setSelectedStudent(null);
    }
    setDeletingStudent(null);
  };

  const handleCopyCredentials = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const school = schools.find((s) => s.id === student.schoolId);
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school && school.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSchool = schoolFilter === "all" || student.schoolId === schoolFilter;
    const matchesLevel = levelFilter === "all" || student.level === levelFilter;
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesSchool && matchesLevel && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStatus = (student: Student) => {
    const newStatus: EntityStatus = student.status === "active" ? "suspended" : "active";
    const updated = students.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s));
    onUpdateStudents(updated);
    onAddLog(
      isEn ? "Student Status Changed" : "Statut Élève Modifié",
      isEn
        ? `Learner '${student.name}' status changed to '${newStatus}'.`
        : `Le statut de l'apprenant '${student.name}' a été changé en '${newStatus}'.`,
      "warning"
    );
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent({ ...selectedStudent, status: newStatus });
    }
  };

  const handleExportCSV = () => {
    const headers = isEn
      ? [
          "ID",
          "Name",
          "Email",
          "School",
          "Language",
          "Level",
          "Status",
          "Progress %",
          "Registration Date",
          "Expiration Date",
        ]
      : [
          "ID",
          "Nom",
          "Email",
          "École",
          "Langue",
          "Niveau",
          "Statut",
          "Progression %",
          "Date Inscription",
          "Date Expiration",
        ];

    const rows = filteredStudents.map((st) => {
      const sch = schools.find((s) => s.id === st.schoolId);
      return [
        st.id,
        `"${st.name.replace(/"/g, '""')}"`,
        st.email,
        `"${sch ? sch.name.replace(/"/g, '""') : (isEn ? "Unknown" : "Inconnue")}"`,
        sch ? sch.language : "",
        st.level,
        st.status,
        st.progressPercent,
        st.enrolledAt || st.startDate || "",
        st.expiresAt || st.endDate || "",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `linguaflow_${isEn ? "students" : "eleves"}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddLog(
      isEn ? "Data Export" : "Export Données",
      isEn ? "CSV export of the global students roster." : "Export CSV de la liste globale des élèves.",
      "success"
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
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
            placeholder={isEn ? "Search by student name, email, school..." : "Rechercher par nom d'élève, e-mail, école..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* School Filter */}
          <select
            value={schoolFilter}
            onChange={(e) => {
              setSchoolFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? `All schools (${schools.length})` : `Toutes les écoles (${schools.length})`}</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")})
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? "All CEFR levels" : "Tous niveaux CECRL"}</option>
            <option value="A1">A1 {isEn ? "Beginner" : "Débutant"}</option>
            <option value="A2">A2 {isEn ? "Elementary" : "Élémentaire"}</option>
            <option value="B1">B1 {isEn ? "Intermediate" : "Intermédiaire"}</option>
            <option value="B2">B2 {isEn ? "Upper-Intermediate" : "Avancé"}</option>
            <option value="C1">C1 {isEn ? "Advanced" : "Autonome"}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? "All statuses" : "Tous statuts"}</option>
            <option value="active">{isEn ? "Active" : "Actifs"}</option>
            <option value="suspended">{isEn ? "Suspended" : "Suspendus"}</option>
            <option value="expired">{isEn ? "Expired" : "Expirés"}</option>
          </select>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition min-h-[40px] cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{isEn ? "Export CSV" : "Export CSV"}</span>
          </button>

          {/* Add Student Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white text-xs font-bold hover:opacity-95 active:scale-95 transition min-h-[40px] cursor-pointer shadow-md shadow-[#6D5DFC]/20"
          >
            <Plus size={15} />
            <span>{isEn ? "Add Student" : "Inscrire un Élève"}</span>
          </button>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-white/60">
        <p>
          <span className="font-bold text-slate-900 dark:text-white">{filteredStudents.length}</span> {isEn ? "student(s) found" : "élève(s) répertorié(s)"}
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{isEn ? "Student & Email" : "Élève & E-mail"}</th>
                <th className="py-3.5 px-4">{isEn ? "Affiliated School" : "École de Rattachement"}</th>
                <th className="py-3.5 px-4">{isEn ? "CEFR Level" : "Niveau CECRL"}</th>
                <th className="py-3.5 px-4">{isEn ? "Progress" : "Progression"}</th>
                <th className="py-3.5 px-4">{isEn ? "Status & Expiry" : "Statut & Échéance"}</th>
                <th className="py-3.5 px-4 text-right">{isEn ? "Actions" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    {isEn ? "No students match your criteria." : "Aucun élève ne correspond aux critères sélectionnés."}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const school = schools.find((s) => s.id === student.schoolId);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#6D5DFC]/15 text-[#6D5DFC] font-bold flex items-center justify-center shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#00D9FF] transition text-left cursor-pointer"
                            >
                              {student.name}
                            </button>
                            <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* School Info */}
                      <td className="py-3.5 px-4">
                        {school ? (
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <SchoolLogo
                                logo={school.logo}
                                name={school.name}
                                language={school.language}
                                size="xs"
                              />
                              <span>{school.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {school.language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">{isEn ? "Unassigned" : "Non assigné"}</span>
                        )}
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff]">
                          {student.level}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-700 dark:text-white">
                              {student.progressPercent || 0}%
                            </span>
                            <span className="text-slate-400">
                              {(student.completedLessons || []).length} {isEn ? "lessons" : "cours"}
                            </span>
                          </div>
                          <ProgressBar value={student.progressPercent || 0} color="cyan" height="sm" />
                        </div>
                      </td>

                      {/* Status & Expiry */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              student.status === "active"
                                ? "bg-[#20E3A2]/15 text-[#20E3A2]"
                                : "bg-rose-500/15 text-rose-400"
                            }`}
                          >
                            {student.status === "active" ? (isEn ? "Active" : "Actif") : (isEn ? "Suspended" : "Suspendu")}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {isEn ? "Ends:" : "Fin :"} {student.expiresAt || student.endDate}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Dossier */}
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 rounded-xl text-slate-500 hover:text-[#00D9FF] hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                            title={isEn ? "View student dossier" : "Voir le dossier élève"}
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Student */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="p-2 rounded-xl text-slate-500 hover:text-[#6D5DFC] hover:bg-[#6D5DFC]/10 transition cursor-pointer"
                            title={isEn ? "Edit student profile" : "Modifier le profil de l'élève"}
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Quick Credentials */}
                          <button
                            type="button"
                            onClick={() => setCredentialsStudent({ student, pass: "••••••••" })}
                            className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition cursor-pointer"
                            title={isEn ? "View access credentials & WhatsApp invite" : "Voir les identifiants & invitation WhatsApp"}
                          >
                            <KeyRound size={15} />
                          </button>

                          {/* Toggle Active/Suspend */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student)}
                            className={`p-2 rounded-xl transition cursor-pointer ${
                              student.status === "active"
                                ? "text-slate-500 hover:text-amber-500 hover:bg-amber-500/10"
                                : "text-slate-500 hover:text-[#20E3A2] hover:bg-[#20E3A2]/10"
                            }`}
                            title={
                              student.status === "active"
                                ? (isEn ? "Suspend student" : "Suspendre l'élève")
                                : (isEn ? "Reactivate student" : "Réactiver l'élève")
                            }
                          >
                            <ShieldCheck size={15} />
                          </button>

                          {/* Delete Student */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(student)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                            title={isEn ? "Delete student" : "Supprimer l'élève"}
                          >
                            <Trash2 size={15} />
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
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden space-y-3">
        {paginatedStudents.map((student) => {
          const school = schools.find((s) => s.id === student.schoolId);

          return (
            <div
              key={student.id}
              className="p-4 rounded-2xl bg-white/95 dark:bg-[#0D1220]/95 border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6D5DFC]/15 text-[#6D5DFC] font-bold flex items-center justify-center">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {student.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    student.status === "active"
                      ? "bg-[#20E3A2]/15 text-[#20E3A2]"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 block">{isEn ? "School" : "École"}</span>
                  <span className="font-bold text-slate-800 dark:text-white truncate block">
                    {school?.name || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{isEn ? "Level" : "Niveau"}</span>
                  <span className="font-bold text-[#6D5DFC] block">CECRL {student.level}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">{isEn ? "Progress" : "Progression"}</span>
                  <span className="text-[#00D9FF]">{student.progressPercent || 0}%</span>
                </div>
                <ProgressBar value={student.progressPercent || 0} color="cyan" height="sm" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold text-[11px]"
                  >
                    {isEn ? "Dossier" : "Dossier"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(student)}
                    className="p-1.5 rounded-lg text-[#6D5DFC] hover:bg-[#6D5DFC]/10"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(student)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(student)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    student.status === "active"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-[#20E3A2]/10 text-[#20E3A2]"
                  }`}
                >
                  {student.status === "active" ? (isEn ? "Suspend" : "Suspendre") : (isEn ? "Reactivate" : "Réactiver")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#0D1220]/80 border border-slate-200 dark:border-white/10 text-xs">
          <p className="text-slate-500 dark:text-white/50">
            {isEn ? "Page" : "Page"}{" "}
            <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> {isEn ? "of" : "sur"}{" "}
            <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white disabled:opacity-30 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white disabled:opacity-30 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 1. Modal: Inscrire un Élève (Create Student) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={isEn ? "Enroll New Student" : "Inscrire un Nouvel Élève"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              {isEn ? "Institutional Enrollment" : "Inscription Institutionnelle"}
            </h4>
            <p className="text-slate-400 text-[11px]">
              {isEn
                ? "Assign this student to a partner language school with instant CEFR level calibration."
                : "Rattachez cet apprenant à une école partenaire avec calibration immédiate de son niveau CECRL."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Full Name *" : "Nom Complet *"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isEn ? "e.g. Lucas Schmidt" : "ex. Lucas Schmidt"}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Email Address *" : "Adresse E-mail *"}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="lucas@example.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Partner School *" : "École Partenaire *"}
              </label>
              <select
                required
                value={formData.schoolId}
                onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                {schools.map((sch) => {
                  const enrolled = students.filter((s) => s.schoolId === sch.id).length;
                  return (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.language === "german" ? "🇩🇪" : "🇮🇹"}) - {enrolled}/{sch.studentQuota} {isEn ? "seats" : "places"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Initial CEFR Level *" : "Niveau CECRL Initial *"}
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="A1">A1 - {isEn ? "Beginner" : "Débutant"}</option>
                <option value="A2">A2 - {isEn ? "Elementary" : "Élémentaire"}</option>
                <option value="B1">B1 - {isEn ? "Intermediate" : "Intermédiaire"}</option>
                <option value="B2">B2 - {isEn ? "Upper-Intermediate" : "Avancé"}</option>
                <option value="C1">C1 - {isEn ? "Advanced" : "Autonome"}</option>
                <option value="C2">C2 - {isEn ? "Mastery" : "Maîtrise"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Start Date" : "Date de début"}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn ? "Contract Expiration Date" : "Date d'expiration"}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700 dark:text-white/80">
                {isEn ? "Access Password" : "Mot de Passe d'Accès"}
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, password: generateRandomPassword() })}
                className="text-[11px] text-[#00D9FF] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles size={12} />
                <span>{isEn ? "Regenerate" : "Générer aléatoirement"}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono font-bold focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold min-h-[40px] cursor-pointer"
            >
              {isEn ? "Cancel" : "Annuler"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white font-bold min-h-[40px] cursor-pointer shadow-md"
            >
              {isEn ? "Confirm Enrollment" : "Valider l'Inscription"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal: Modifier l'Élève (Edit Student) */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title={`${isEn ? "Edit Student" : "Modifier l'Élève"} • ${editingStudent?.name}`}
        maxWidth="max-w-xl"
      >
        {editingStudent && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Full Name *" : "Nom Complet *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Email Address *" : "Adresse E-mail *"}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Affiliated School" : "École de Rattachement"}
                </label>
                <select
                  value={formData.schoolId}
                  onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                >
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.language === "german" ? "🇩🇪" : "🇮🇹"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "CEFR Level" : "Niveau CECRL"}
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as CEFRLevel })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Account Status" : "Statut du Compte"}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EntityStatus })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold focus:outline-none"
                >
                  <option value="active">{isEn ? "Active" : "Actif"}</option>
                  <option value="suspended">{isEn ? "Suspended" : "Suspendu"}</option>
                  <option value="expired">{isEn ? "Expired" : "Expiré"}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                  {isEn ? "Access Expiry Date" : "Date de Fin de Contrat"}
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold min-h-[40px] cursor-pointer"
              >
                {isEn ? "Cancel" : "Annuler"}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white font-bold min-h-[40px] cursor-pointer shadow-md"
              >
                {isEn ? "Save Changes" : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 3. Modal: Supprimer l'Élève (Delete Confirmation) */}
      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title={isEn ? "Delete Student Account" : "Supprimer le Compte Élève"}
        maxWidth="max-w-md"
      >
        {deletingStudent && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-3">
              <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <h5 className="font-extrabold text-sm">{isEn ? "Permanent Deletion" : "Suppression Définitive"}</h5>
                <p className="leading-relaxed">
                  {isEn
                    ? `Are you sure you want to delete '${deletingStudent.name}'? All lesson progressions and AI exercise histories will be removed.`
                    : `Êtes-vous certain de vouloir supprimer l'élève '${deletingStudent.name}' ? Tous ses progrès et historiques d'exercices IA seront effacés.`}
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                {isEn
                  ? `Type "${deletingStudent.name}" to confirm:`
                  : `Tapez "${deletingStudent.name}" pour confirmer :`}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={deletingStudent.name}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold min-h-[40px] cursor-pointer"
              >
                {isEn ? "Cancel" : "Annuler"}
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.trim().toLowerCase() !== deletingStudent.name.trim().toLowerCase()}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-30 text-white font-bold min-h-[40px] cursor-pointer shadow-md transition"
              >
                {isEn ? "Confirm Deletion" : "Supprimer Définitivement"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 4. Modal: Identifiants & Partage WhatsApp (Credentials) */}
      <Modal
        isOpen={!!credentialsStudent}
        onClose={() => setCredentialsStudent(null)}
        title={isEn ? "Student Access Credentials" : "Identifiants d'Accès Élève"}
        maxWidth="max-w-md"
      >
        {credentialsStudent && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] text-white flex items-center justify-center font-bold text-base shadow-sm">
                <KeyRound size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {credentialsStudent.student.name}
                </h4>
                <p className="text-slate-400 font-mono text-[11px]">{credentialsStudent.student.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">{isEn ? "Identifier / Email" : "Identifiant / E-mail"}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{credentialsStudent.student.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCredentials(credentialsStudent.student.email, "email")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                  title={isEn ? "Copy email" : "Copier l'e-mail"}
                >
                  {copiedKey === "email" ? <Check size={14} className="text-[#20E3A2]" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">{isEn ? "Temporary Password" : "Mot de Passe"}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{credentialsStudent.pass}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCredentials(credentialsStudent.pass, "pass")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                  title={isEn ? "Copy password" : "Copier le mot de passe"}
                >
                  {copiedKey === "pass" ? <Check size={14} className="text-[#20E3A2]" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Message Generator */}
            {(() => {
              const sch = schools.find((s) => s.id === credentialsStudent.student.schoolId);
              const welcomeMsg = isEn
                ? `Hello ${credentialsStudent.student.name}! Welcome to LinguaFlow for your language courses at ${sch?.name || "your school"}.\n\nYour login credentials:\n- Portal: ${window.location.origin}\n- Email: ${credentialsStudent.student.email}\n- Password: ${credentialsStudent.pass}\n- CEFR Level: ${credentialsStudent.student.level}\n\nHappy learning!`
                : `Bonjour ${credentialsStudent.student.name} ! Bienvenue sur LinguaFlow pour vos cours de langue avec l'école ${sch?.name || "votre centre"}.\n\nVos identifiants d'accès :\n- Portail : ${window.location.origin}\n- E-mail : ${credentialsStudent.student.email}\n- Mot de passe : ${credentialsStudent.pass}\n- Niveau CECRL : ${credentialsStudent.student.level}\n\nBonne formation !`;

              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(welcomeMsg)}`;

              return (
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition shadow-md shadow-emerald-500/20"
                  >
                    <MessageCircle size={16} />
                    <span>{isEn ? "Share via WhatsApp" : "Transmettre par WhatsApp"}</span>
                  </a>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCredentialsStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold cursor-pointer"
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 5. Student Detail Dossier Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`${isEn ? "Learner Dossier" : "Dossier Apprenant"} • ${selectedStudent?.name}`}
        maxWidth="max-w-xl"
      >
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6D5DFC]/15 text-[#6D5DFC] font-bold text-base flex items-center justify-center">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-slate-400 font-mono">{selectedStudent.email}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full font-bold ${
                  selectedStudent.status === "active"
                    ? "bg-[#20E3A2]/15 text-[#20E3A2]"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {selectedStudent.status}
              </span>
            </div>

            {/* School affiliation & progression */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <p className="text-[11px] text-slate-400 font-semibold">{isEn ? "Affiliated School" : "École de rattachement"}</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1">
                  {schools.find((s) => s.id === selectedStudent.schoolId)?.name || "—"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <p className="text-[11px] text-slate-400 font-semibold">{isEn ? "CEFR Level" : "Niveau CECRL"}</p>
                <p className="font-bold text-[#6D5DFC] mt-1">{isEn ? "Level" : "Niveau"} {selectedStudent.level}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-600 dark:text-white/80">{isEn ? "Overall progress" : "Progression globale"}</span>
                <span className="text-[#00D9FF]">{selectedStudent.progressPercent || 0}%</span>
              </div>
              <ProgressBar value={selectedStudent.progressPercent || 0} color="cyan" height="md" />
              <p className="text-[11px] text-slate-400">
                {(selectedStudent.completedLessons || []).length} {isEn ? "lessons completed successfully" : "cours terminés avec succès"}
              </p>
            </div>

            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono px-1">
              <span>{isEn ? "Enrolled on:" : "Inscrit le :"} {selectedStudent.startDate || selectedStudent.createdAt || "2025-01-01"}</span>
              <span>{isEn ? "Expires on:" : "Échéance :"} {selectedStudent.endDate || selectedStudent.expiresAt || "2025-12-31"}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(selectedStudent);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold flex items-center gap-1 hover:bg-slate-200 cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span>{isEn ? "Edit" : "Modifier"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenDelete(selectedStudent);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 font-bold flex items-center gap-1 hover:bg-rose-500/20 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>{isEn ? "Delete" : "Supprimer"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold min-h-[40px] cursor-pointer"
                >
                  {isEn ? "Close" : "Fermer"}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedStudent)}
                  className={`px-4 py-2 rounded-xl text-white font-bold min-h-[40px] cursor-pointer ${
                    selectedStudent.status === "active" ? "bg-amber-500" : "bg-[#20E3A2] text-slate-950"
                  }`}
                >
                  {selectedStudent.status === "active"
                    ? (isEn ? "Suspend Access" : "Suspendre l'accès")
                    : (isEn ? "Reactivate Access" : "Réactiver l'accès")}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
