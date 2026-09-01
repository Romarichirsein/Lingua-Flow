import React, { useState } from "react";
import { Student, School, UILocale, EntityStatus } from "../../types";
import { Modal } from "../common/Modal";
import { ProgressBar } from "../common/ProgressBar";
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    const headers = [
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
        `"${sch ? sch.name.replace(/"/g, '""') : "Inconnue"}"`,
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
    link.setAttribute("download", `linguaflow_eleves_${new Date().toISOString().split("T")[0]}.csv`);
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

        {/* Filters */}
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold transition min-h-[40px] cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{isEn ? "Export CSV" : "Export CSV"}</span>
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
                <th className="py-3.5 px-4">{isEn ? "Access & Status" : "Accès & Statut"}</th>
                <th className="py-3.5 px-4 text-right">{isEn ? "Actions" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-white/40 text-xs">
                    {isEn ? "No students match the criteria." : "Aucun élève ne correspond à votre recherche."}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const school = schools.find((s) => s.id === student.schoolId);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Student Info */}
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
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{school.logo || "🏫"}</span>
                              <span>{school.name}</span>
                            </p>
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
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 rounded-xl text-slate-500 hover:text-[#00D9FF] hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                            title={isEn ? "View student dossier" : "Voir le dossier élève"}
                          >
                            <Eye size={15} />
                          </button>

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

              <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-slate-400">{isEn ? "School:" : "École :"}</span>
                  <p className="font-bold text-slate-800 dark:text-white truncate">
                    {school ? school.name : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">{isEn ? "CEFR Level:" : "Niveau CECRL :"}</span>
                  <p className="font-bold text-[#6D5DFC]">{student.level}</p>
                </div>
                <div>
                  <span className="text-slate-400">{isEn ? "Progress:" : "Progression :"}</span>
                  <p className="font-bold text-[#00D9FF]">{student.progressPercent}%</p>
                </div>
                <div>
                  <span className="text-slate-400">{isEn ? "Expiration:" : "Expiration :"}</span>
                  <p className="font-mono text-slate-800 dark:text-white">{student.expiresAt || student.endDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white text-xs font-bold min-h-[44px] cursor-pointer"
                >
                  {isEn ? "View full dossier" : "Voir le dossier complet"}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(student)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold min-h-[44px] cursor-pointer ${
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

      {/* Student Detail Modal */}
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
              <span>{isEn ? "Expires on:" : "Échéance :"} {selectedStudent.endDate || "2025-12-31"}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
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
        )}
      </Modal>
    </div>
  );
};
