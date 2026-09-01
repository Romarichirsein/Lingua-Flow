import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { School, Student, Program, ActivityLog, EntityStatus, SupportedLanguage, UILocale } from "../../types";
import { Modal } from "../common/Modal";
import { ProgressBar } from "../common/ProgressBar";
import { SuperAdminSchoolDetailModal } from "./SuperAdminSchoolDetailModal";
import {
  Building2,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock3,
  ShieldAlert,
  Archive,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Globe,
  Activity,
  KeyRound,
  Copy,
  EyeOff,
  RefreshCw,
  Share2,
  Send,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface SuperAdminSchoolsTabProps {
  schools: School[];
  students: Student[];
  programs: Program[];
  logs: ActivityLog[];
  locale: UILocale;
  onUpdateSchools: (schools: School[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
  onSelectSchoolTab?: (schoolId: string) => void;
  onOpenDiagnostic?: () => void;
}

export const SuperAdminSchoolsTab: React.FC<SuperAdminSchoolsTabProps> = ({
  schools,
  students,
  programs,
  logs,
  locale,
  onUpdateSchools,
  onAddLog,
  onSelectSchoolTab,
  onOpenDiagnostic,
}) => {
  const isEn = locale === "en";
  // Search, Filters & Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "endDate" | "students" | "quota">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [detailSchool, setDetailSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [statusActionSchool, setStatusActionSchool] = useState<{
    school: School;
    newStatus: EntityStatus;
  } | null>(null);
  const [extendSchool, setExtendSchool] = useState<School | null>(null);
  const [extensionMonths, setExtensionMonths] = useState(6);

  // Credentials Modal State (View / Copy / Send to School Director)
  const [credentialsSchool, setCredentialsSchool] = useState<School | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    language: "german" as SupportedLanguage,
    logo: "🇩🇪",
    primaryColor: "#6D5DFC",
    secondaryColor: "#00D9FF",
    professionalEmail: "",
    phone: "",
    address: "",
    city: "",
    country: "Allemagne",
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    username: "",
    password: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "2027-08-25",
    whatsappSupportUrl: "https://wa.me/491512345678",
    studentQuota: 200,
  });

  const generateStrongPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let res = "";
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleSuggestUsername = (name: string, managerName: string) => {
    if (managerName.trim()) {
      return managerName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/(^\.|\.$)+/g, "");
    }
    if (name.trim()) {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^_|_$)+/g, "");
    }
    return "admin_ecole";
  };

  // Filter & Sort Logic
  const filteredSchools = schools
    .filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.managerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.city && school.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.country && school.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
        school.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLang = languageFilter === "all" || school.language === languageFilter;
      const matchesStatus = statusFilter === "all" || school.status === statusFilter;

      return matchesSearch && matchesLang && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "createdAt") {
        comparison = (a.createdAt || "").localeCompare(b.createdAt || "");
      } else if (sortBy === "endDate") {
        comparison = a.endDate.localeCompare(b.endDate);
      } else if (sortBy === "students") {
        const aCount = students.filter((s) => s.schoolId === a.id).length;
        const bCount = students.filter((s) => s.schoolId === b.id).length;
        comparison = aCount - bCount;
      } else if (sortBy === "quota") {
        comparison = a.studentQuota - b.studentQuota;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Paginated Slices
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage) || 1;
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleOpenCreate = () => {
    const defaultPassword = generateStrongPassword();
    setFormData({
      name: "",
      slug: "",
      language: "german",
      logo: "🇩🇪",
      primaryColor: "#6D5DFC",
      secondaryColor: "#00D9FF",
      professionalEmail: "",
      phone: "",
      address: "",
      city: "",
      country: "Allemagne",
      managerName: "",
      managerEmail: "",
      managerPhone: "",
      username: "",
      password: defaultPassword,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2027-08-25",
      whatsappSupportUrl: "https://wa.me/491512345678",
      studentQuota: 200,
    });
    setShowPasswordInForm(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      slug: school.slug,
      language: school.language,
      logo: school.logo || (school.language === "german" ? "🇩🇪" : "🇮🇹"),
      primaryColor: school.primaryColor || "#6D5DFC",
      secondaryColor: school.secondaryColor || "#00D9FF",
      professionalEmail: school.professionalEmail || "",
      phone: school.phone || "",
      address: school.address || "",
      city: school.city || "",
      country: school.country || (school.language === "german" ? "Allemagne" : "Italie"),
      managerName: school.managerName,
      managerEmail: school.managerEmail,
      managerPhone: school.managerPhone || "",
      username: school.username || (school.managerEmail ? school.managerEmail.split("@")[0] : school.slug || ""),
      password: school.password || "school123",
      startDate: school.startDate,
      endDate: school.endDate,
      whatsappSupportUrl: school.whatsappSupportUrl || "",
      studentQuota: school.studentQuota,
    });
    setShowPasswordInForm(false);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const finalUsername =
      formData.username.trim() ||
      (formData.managerEmail ? formData.managerEmail.split("@")[0] : "") ||
      generatedSlug ||
      `school_${Date.now()}`;

    const finalPassword = formData.password.trim() || generateStrongPassword();

    const newSchool: School = {
      id: `school-${Date.now()}`,
      name: formData.name,
      slug: generatedSlug,
      language: formData.language,
      logo: formData.logo,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      professionalEmail: formData.professionalEmail,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      managerName: formData.managerName,
      managerEmail: formData.managerEmail,
      managerPhone: formData.managerPhone,
      username: finalUsername,
      password: finalPassword,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "active",
      whatsappSupportUrl: formData.whatsappSupportUrl,
      studentQuota: Number(formData.studentQuota) || 100,
      programsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastActiveDate: "À l'instant",
    };

    onUpdateSchools([newSchool, ...schools]);
    onAddLog(
      "Création d'école",
      `Création de l'école partenaire '${newSchool.name}' (${newSchool.language}) avec identifiant '${newSchool.username}' et quota de ${newSchool.studentQuota} élèves.`,
      "success"
    );
    setIsCreateModalOpen(false);
    // Directly open the credentials share modal for the Super Admin
    setCredentialsSchool(newSchool);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;

    const finalUsername =
      formData.username.trim() ||
      editingSchool.username ||
      formData.managerEmail.split("@")[0];

    const finalPassword =
      formData.password.trim() || editingSchool.password || "school123";

    const updatedSchools = schools.map((s) =>
      s.id === editingSchool.id
        ? {
            ...s,
            name: formData.name,
            slug: formData.slug || s.slug,
            language: formData.language,
            logo: formData.logo,
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
            professionalEmail: formData.professionalEmail,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            managerName: formData.managerName,
            managerEmail: formData.managerEmail,
            managerPhone: formData.managerPhone,
            username: finalUsername,
            password: finalPassword,
            startDate: formData.startDate,
            endDate: formData.endDate,
            whatsappSupportUrl: formData.whatsappSupportUrl,
            studentQuota: Number(formData.studentQuota) || s.studentQuota,
          }
        : s
    );

    onUpdateSchools(updatedSchools);
    onAddLog(
      "Modification d'école",
      `Mise à jour des informations et identifiants pour l'école '${formData.name}'.`,
      "success"
    );
    setEditingSchool(null);
  };

  const handleConfirmStatusChange = () => {
    if (!statusActionSchool) return;
    const { school, newStatus } = statusActionSchool;

    const updated = schools.map((s) =>
      s.id === school.id ? { ...s, status: newStatus } : s
    );

    onUpdateSchools(updated);
    onAddLog(
      "Changement de statut",
      `Statut de l'école '${school.name}' modifié en '${newStatus}'.`,
      newStatus === "active" ? "success" : "warning"
    );
    setStatusActionSchool(null);
  };

  const handleConfirmExtension = () => {
    if (!extendSchool) return;

    const currentEnd = new Date(extendSchool.endDate);
    currentEnd.setMonth(currentEnd.getMonth() + extensionMonths);
    const newEndDate = currentEnd.toISOString().split("T")[0];

    const updated = schools.map((s) =>
      s.id === extendSchool.id
        ? { ...s, endDate: newEndDate, status: s.status === "expired" ? "active" : s.status }
        : s
    );

    onUpdateSchools(updated);
    onAddLog(
      "Prolongation d'accès SaaS",
      `Extension de ${extensionMonths} mois accordée à l'école '${extendSchool.name}'. Nouvelle échéance : ${newEndDate}.`,
      "success"
    );
    setExtendSchool(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingSchool) return;

    const updated = schools.filter((s) => s.id !== deletingSchool.id);
    onUpdateSchools(updated);
    onAddLog(
      "Suppression définitive",
      `Suppression irréversible de l'école '${deletingSchool.name}' et purge des accès associés.`,
      "error"
    );
    setDeletingSchool(null);
    setDeleteConfirmationInput("");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nom",
      "Slug",
      "Langue",
      "Statut",
      "Responsable",
      "Email Responsable",
      "Telephone",
      "Ville",
      "Pays",
      "Quota",
      "Eleves Inscrits",
      "Date Debut",
      "Date Fin",
      "Date Creation",
    ];

    const rows = filteredSchools.map((s) => {
      const studentCount = students.filter((st) => st.schoolId === s.id).length;
      return [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        s.slug,
        s.language,
        s.status,
        `"${s.managerName.replace(/"/g, '""')}"`,
        s.managerEmail,
        s.phone || "",
        s.city || "",
        s.country || "",
        s.studentQuota,
        studentCount,
        s.startDate,
        s.endDate,
        s.createdAt || "",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `linguaflow_ecoles_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddLog("Export Données", "Export CSV de la liste des écoles partenaires.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Search, Filters, Export & New School CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isEn ? "Search by school, director, email, city, slug..." : "Rechercher par école, responsable, email, ville, slug..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF] transition"
          />
        </div>

        {/* Filter Selectors & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? "All languages" : "Toutes langues"}</option>
            <option value="german">{isEn ? "German 🇩🇪" : "Allemand 🇩🇪"}</option>
            <option value="italian">{isEn ? "Italian 🇮🇹" : "Italien 🇮🇹"}</option>
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
            <option value="active">{isEn ? "Active" : "Actives"}</option>
            <option value="suspended">{isEn ? "Suspended" : "Suspendues"}</option>
            <option value="blocked">{isEn ? "Blocked" : "Bloquées"}</option>
            <option value="expired">{isEn ? "Expired" : "Expirées"}</option>
            <option value="archived">{isEn ? "Archived" : "Archivées"}</option>
          </select>

          {/* Diagnostic Sync Flow Button */}
          {onOpenDiagnostic && (
            <button
              type="button"
              onClick={onOpenDiagnostic}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-cyan-600 dark:text-[#00D9FF] border border-cyan-500/20 text-xs font-bold transition min-h-[40px] cursor-pointer"
              title={isEn ? "Run state synchronization diagnostic" : "Lancer le diagnostic de synchronisation d'état"}
            >
              <Activity size={14} className="animate-pulse" />
              <span className="hidden md:inline">{isEn ? "Sync Diagnostic" : "Diagnostic Flux"}</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition min-h-[40px] cursor-pointer"
            title={isEn ? "Export list as CSV" : "Exporter la liste en CSV"}
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Create School Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white text-xs font-extrabold shadow-md hover:opacity-95 transition min-h-[40px] cursor-pointer"
          >
            <Plus size={16} />
            <span>{isEn ? "Add School" : "Ajouter une école"}</span>
          </button>
        </div>
      </div>

      {/* Results Header Count & Sort Bar */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-white/60">
        <p>
          <span className="font-bold text-slate-900 dark:text-white">{filteredSchools.length}</span> {isEn ? "school(s) found" : "école(s) trouvée(s)"}
        </p>

        <div className="flex items-center gap-2">
          <span>{isEn ? "Sort by:" : "Trier par :"}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="name">{isEn ? "Name" : "Nom"}</option>
            <option value="createdAt">{isEn ? "Creation date" : "Date de création"}</option>
            <option value="endDate">{isEn ? "Expiry date" : "Date d'expiration"}</option>
            <option value="students">{isEn ? "Student count" : "Nombre d'élèves"}</option>
            <option value="quota">{isEn ? "Quota" : "Quota"}</option>
          </select>
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title={isEn ? "Reverse sort" : "Inverser le tri"}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Desktop Table View (tablets & desktops) */}
      <div className="hidden md:block overflow-hidden rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{isEn ? "School & Language" : "École & Langue"}</th>
                <th className="py-3.5 px-4">{isEn ? "Director & Contact" : "Direction & Contact"}</th>
                <th className="py-3.5 px-4">{isEn ? "Location" : "Localisation"}</th>
                <th className="py-3.5 px-4">{isEn ? "Students / Quota" : "Élèves / Quota"}</th>
                <th className="py-3.5 px-4">{isEn ? "License & Status" : "Licence & Statut"}</th>
                <th className="py-3.5 px-4 text-right">{isEn ? "Actions" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 font-medium">
              {paginatedSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-white/40 text-xs">
                    {isEn ? "No schools match the selected criteria." : "Aucune école ne correspond aux critères sélectionnés."}
                  </td>
                </tr>
              ) : (
                paginatedSchools.map((school) => {
                  const enrolled = students.filter((s) => s.schoolId === school.id).length;
                  const quotaPct = Math.min(100, Math.round((enrolled / Math.max(1, school.studentQuota)) * 100));

                  return (
                    <tr
                      key={school.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* School & Language */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                            {school.logo || (school.language === "german" ? "🇩🇪" : "🇮🇹")}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setDetailSchool(school)}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#00D9FF] text-left transition cursor-pointer"
                            >
                              {school.name}
                            </button>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-bold text-[#6D5DFC] dark:text-[#a399ff]">
                                {school.language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                /{school.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Direction & Contact */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{school.managerName}</p>
                        <a
                          href={`mailto:${school.managerEmail}`}
                          className="text-[11px] text-slate-400 hover:text-[#00D9FF] font-mono"
                        >
                          {school.managerEmail}
                        </a>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-white/80 text-[11px]">
                        <p className="font-semibold">{school.city || "—"}</p>
                        <p className="text-slate-400">{school.country || "Europe"}</p>
                      </td>

                      {/* Quota */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-700 dark:text-white">
                              {enrolled} / {school.studentQuota}
                            </span>
                            <span className="text-slate-400">{quotaPct}%</span>
                          </div>
                          <ProgressBar value={quotaPct} color={quotaPct >= 90 ? "amber" : "cyan"} height="sm" />
                        </div>
                      </td>

                      {/* License & Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              school.status === "active"
                                ? "bg-[#20E3A2]/15 text-[#20E3A2] border border-[#20E3A2]/30"
                                : school.status === "suspended"
                                ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                : school.status === "blocked"
                                ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                                : school.status === "archived"
                                ? "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/70"
                                : "bg-slate-300 text-slate-800 dark:bg-white/15 dark:text-white"
                            }`}
                          >
                            {school.status === "active"
                              ? (isEn ? "Active" : "Active")
                              : school.status === "suspended"
                              ? (isEn ? "Suspended" : "Suspendue")
                              : school.status === "blocked"
                              ? (isEn ? "Blocked" : "Bloquée")
                              : school.status === "archived"
                              ? (isEn ? "Archived" : "Archivée")
                              : (isEn ? "Expired" : "Expirée")}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {isEn ? "Expiry:" : "Échéance :"} {school.endDate}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCredentialsSchool(school)}
                            className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition cursor-pointer"
                            title={isEn ? "View & send login credentials" : "Voir & transmettre les identifiants de connexion"}
                          >
                            <KeyRound size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDetailSchool(school)}
                            className="p-2 rounded-xl text-slate-500 hover:text-[#00D9FF] hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                            title={isEn ? "View detailed profile" : "Voir la fiche détaillée"}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(school)}
                            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-[#6D5DFC] transition cursor-pointer"
                            title={isEn ? "Edit information" : "Modifier les informations"}
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setExtendSchool(school)}
                            className="p-2 rounded-xl text-slate-500 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition cursor-pointer"
                            title={isEn ? "Extend SaaS access" : "Prolonger l'accès SaaS"}
                          >
                            <Clock3 size={15} />
                          </button>

                          {school.status === "active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                setStatusActionSchool({ school, newStatus: "suspended" })
                              }
                              className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition cursor-pointer"
                              title={isEn ? "Suspend school" : "Suspendre l'école"}
                            >
                              <ShieldAlert size={15} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setStatusActionSchool({ school, newStatus: "active" })
                              }
                              className="p-2 rounded-xl text-slate-500 hover:text-[#20E3A2] hover:bg-[#20E3A2]/10 transition cursor-pointer"
                              title={isEn ? "Reactivate school" : "Réactiver l'école"}
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeletingSchool(school)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                            title={isEn ? "Permanently delete" : "Supprimer définitivement"}
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

      {/* Mobile Stacked Cards View (phones < 768px) */}
      <div className="md:hidden space-y-3">
        {paginatedSchools.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/90 dark:bg-[#0D1220]/90 border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
            {isEn ? "No schools found." : "Aucune école trouvée."}
          </div>
        ) : (
          paginatedSchools.map((school) => {
            const enrolled = students.filter((s) => s.schoolId === school.id).length;
            const quotaPct = Math.min(100, Math.round((enrolled / Math.max(1, school.studentQuota)) * 100));

            return (
              <div
                key={school.id}
                className="p-4 rounded-2xl bg-white/95 dark:bg-[#0D1220]/95 border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                      {school.logo || (school.language === "german" ? "🇩🇪" : "🇮🇹")}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {school.name}
                      </h4>
                      <p className="text-[11px] font-bold text-[#6D5DFC] dark:text-[#a399ff]">
                        {school.language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")} • /{school.slug}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      school.status === "active"
                        ? "bg-[#20E3A2]/15 text-[#20E3A2]"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {school.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-slate-100 dark:border-white/5">
                  <div>
                    <span className="text-slate-400">{isEn ? "Director:" : "Direction :"}</span>
                    <p className="font-semibold text-slate-800 dark:text-white truncate">
                      {school.managerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">{isEn ? "City / Country:" : "Ville / Pays :"}</span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {school.city || "—"}, {school.country || "Europe"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">{isEn ? "Students / Quota:" : "Élèves / Quota :"}</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {enrolled} / {school.studentQuota} ({quotaPct}%)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">{isEn ? "Expiry:" : "Échéance :"}</span>
                    <p className="font-mono text-slate-800 dark:text-white">{school.endDate}</p>
                  </div>
                </div>

                {/* Mobile Action Buttons (min 44px touch targets) */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setCredentialsSchool(school)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold transition min-h-[44px] cursor-pointer"
                    title={isEn ? "Credentials" : "Identifiants"}
                  >
                    <KeyRound size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailSchool(school)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-bold transition min-h-[44px] cursor-pointer"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(school)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#6D5DFC]/10 hover:bg-[#6D5DFC]/20 text-[#6D5DFC] dark:text-[#a399ff] text-xs font-bold transition min-h-[44px] cursor-pointer"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtendSchool(school)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold transition min-h-[44px] cursor-pointer"
                  >
                    <Clock3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingSchool(school)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition min-h-[44px] cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-[#0D1220]/80 border border-slate-200 dark:border-white/10 text-xs">
          <p className="text-slate-500 dark:text-white/50">
            Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> sur{" "}
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

      {/* School Detail Modal */}
      <SuperAdminSchoolDetailModal
        school={detailSchool}
        students={students}
        programs={programs}
        logs={logs}
        locale={locale}
        isOpen={!!detailSchool}
        onClose={() => setDetailSchool(null)}
        onEdit={(sch) => handleOpenEdit(sch)}
        onExtend={(sch) => setExtendSchool(sch)}
        onChangeStatus={(sch, st) => setStatusActionSchool({ school: sch, newStatus: st })}
        onDelete={(sch) => setDeletingSchool(sch)}
      />

      {/* Create / Edit School Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!editingSchool}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingSchool(null);
        }}
        title={editingSchool ? `Modifier • ${editingSchool.name}` : "Créer une Nouvelle École"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={editingSchool ? handleSaveEdit : handleSaveCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Nom de l'école *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Berlin Sprachzentrum"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Langue Enseignée *
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    language: e.target.value as SupportedLanguage,
                    logo: e.target.value === "german" ? "🇩🇪" : "🇮🇹",
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <option value="german">Allemand 🇩🇪</option>
                <option value="italian">Italien 🇮🇹</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Directeur / Responsable *
              </label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="ex: Klaus Weber"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                E-mail Responsable *
              </label>
              <input
                type="email"
                required
                value={formData.managerEmail}
                onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                placeholder="klaus@ecole.de"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Téléphone Responsable
              </label>
              <input
                type="tel"
                value={formData.managerPhone}
                onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                placeholder="+49 151 2345678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="ex: Berlin / Milan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Pays
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="ex: Allemagne"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Quota d'élèves *
              </label>
              <input
                type="number"
                required
                min={1}
                max={5000}
                value={formData.studentQuota}
                onChange={(e) => setFormData({ ...formData, studentQuota: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Date de début d'accès
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                Date de fin d'accès (Échéance)
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          {/* Identifiants d'accès & Connexion Super Admin -> École */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-cyan-50/80 dark:from-indigo-950/30 dark:to-cyan-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-bold text-xs">
                <KeyRound size={16} className="text-[#6D5DFC] dark:text-[#00D9FF]" />
                <span>Identifiants d'accès de l'école (Login & Mot de passe)</span>
              </div>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                Défini par le Super Admin
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-white/70 leading-relaxed">
              Ces identifiants permettront au responsable de l'école de se connecter à son tableau de bord SaaS. Vous pourrez lui transmettre directement par WhatsApp ou E-mail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-white/80">
                    Nom d'utilisateur (Username) *
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        username: handleSuggestUsername(formData.name, formData.managerName),
                      })
                    }
                    className="text-[10px] text-[#6D5DFC] dark:text-[#00D9FF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={11} /> Suggérer
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                    placeholder="ex: klaus.weber ou ecole_berlin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6D5DFC]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-white/80">
                    Mot de passe (Password) *
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        password: generateStrongPassword(),
                      })
                    }
                    className="text-[10px] text-[#6D5DFC] dark:text-[#00D9FF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={11} /> Régénérer
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswordInForm ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mot de passe sécurisé..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6D5DFC]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    title={showPasswordInForm ? "Masquer" : "Afficher"}
                  >
                    {showPasswordInForm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
              Lien Groupe WhatsApp Promo (Élèves & Enseignants)
            </label>
            <input
              type="url"
              value={formData.whatsappSupportUrl}
              onChange={(e) => setFormData({ ...formData, whatsappSupportUrl: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingSchool(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-bold transition min-h-[42px] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:opacity-95 transition min-h-[42px] cursor-pointer"
            >
              {editingSchool ? "Sauvegarder les modifications" : "Créer l'école"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Suspend / Block / Reactivate Status Modal */}
      <Modal
        isOpen={!!statusActionSchool}
        onClose={() => setStatusActionSchool(null)}
        title="Changement de Statut de l'École"
        maxWidth="max-w-md"
      >
        {statusActionSchool && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center gap-3">
              <span className="text-2xl">{statusActionSchool.school.logo || "🏫"}</span>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {statusActionSchool.school.name}
                </h4>
                <p className="text-xs text-slate-400">
                  Statut actuel : <span className="font-bold">{statusActionSchool.school.status}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-white/70">
              {statusActionSchool.newStatus === "suspended" &&
                "La suspension empêche temporairement les élèves et l'équipe pédagogique d'accéder aux cours et aux vidéos filigranées."}
              {statusActionSchool.newStatus === "blocked" &&
                "Le blocage restreint totalement la plateforme pour cette école pour non-respect des règles ou impayé."}
              {statusActionSchool.newStatus === "active" &&
                "La réactivation restaure immédiatement tous les accès pour les élèves et administrateurs de l'école."}
              {statusActionSchool.newStatus === "archived" &&
                "L'archivage conserve l'historique et les notes mais désactive la connexion active."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusActionSchool(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-white min-h-[40px] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md min-h-[40px] cursor-pointer ${
                  statusActionSchool.newStatus === "active"
                    ? "bg-[#20E3A2] text-slate-950"
                    : statusActionSchool.newStatus === "suspended"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              >
                Confirmer ({statusActionSchool.newStatus})
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Extend Access Modal */}
      <Modal
        isOpen={!!extendSchool}
        onClose={() => setExtendSchool(null)}
        title={`Prolonger la Licence • ${extendSchool?.name}`}
        maxWidth="max-w-md"
      >
        {extendSchool && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs">
              <p className="text-slate-400">Échéance actuelle :</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {extendSchool.endDate}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-2">
                Durée de prolongation à ajouter :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setExtensionMonths(months)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition border min-h-[42px] cursor-pointer ${
                      extensionMonths === months
                        ? "bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"
                    }`}
                  >
                    +{months} Mois
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setExtendSchool(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-white min-h-[40px] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmExtension}
                className="px-5 py-2 rounded-xl bg-[#00D9FF] text-slate-950 text-xs font-bold shadow-md hover:opacity-90 min-h-[40px] cursor-pointer"
              >
                Prolonger de {extensionMonths} mois
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Strong Confirmation Delete Modal */}
      <Modal
        isOpen={!!deletingSchool}
        onClose={() => {
          setDeletingSchool(null);
          setDeleteConfirmationInput("");
        }}
        title="Suppression Définitive d'une École"
        maxWidth="max-w-md"
      >
        {deletingSchool && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-3">
              <AlertTriangle size={24} className="shrink-0" />
              <p className="font-semibold">
                Attention : Cette action est irréversible. L'école '{deletingSchool.name}', tous ses élèves et ses cours associés seront définitivement purgés.
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-600 dark:text-white/70 mb-2">
                Pour confirmer, veuillez saisir le nom exact de l'école :{" "}
                <span className="font-bold text-slate-900 dark:text-white select-all">
                  {deletingSchool.name}
                </span>
              </p>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder="Saisissez le nom exact..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingSchool(null);
                  setDeleteConfirmationInput("");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-white min-h-[40px] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput.trim() !== deletingSchool.name.trim()}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md disabled:opacity-40 min-h-[40px] cursor-pointer"
              >
                Supprimer Définitivement
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* Credentials Share Modal (Super Admin -> School Director) */}
      <Modal
        isOpen={!!credentialsSchool}
        onClose={() => {
          setCredentialsSchool(null);
          setCopiedKey(null);
        }}
        title="Identifiants de Connexion École"
        maxWidth="max-w-lg"
      >
        {credentialsSchool && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6D5DFC]/10 to-[#00D9FF]/10 border border-[#6D5DFC]/20 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#6D5DFC] text-white shrink-0 shadow-md">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Identifiants créés par le Super Admin pour {credentialsSchool.name}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-white/70 leading-relaxed">
                  Ces informations d'authentification permettent au responsable ({credentialsSchool.managerName}) d'accéder à son espace administration école en toute sécurité.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Nom d'utilisateur / Login
                  </span>
                  <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {credentialsSchool.username || credentialsSchool.managerEmail.split("@")[0]}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const user = credentialsSchool.username || credentialsSchool.managerEmail.split("@")[0];
                    navigator.clipboard.writeText(user);
                    setCopiedKey("user");
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-100 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === "user" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedKey === "user" ? "Copié" : "Copier"}</span>
                </button>
              </div>

              <div className="h-px bg-slate-200 dark:bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mot de passe
                  </span>
                  <div className="font-mono text-sm font-bold text-[#6D5DFC] dark:text-[#00D9FF]">
                    {credentialsSchool.password || "school123"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const pwd = credentialsSchool.password || "school123";
                    navigator.clipboard.writeText(pwd);
                    setCopiedKey("pwd");
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-100 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === "pwd" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedKey === "pwd" ? "Copié" : "Copier"}</span>
                </button>
              </div>

              <div className="h-px bg-slate-200 dark:bg-white/10" />

              <div className="text-xs text-slate-600 dark:text-white/70 space-y-1">
                <div><strong className="text-slate-900 dark:text-white">URL de connexion :</strong> {window.location.origin}</div>
                <div><strong className="text-slate-900 dark:text-white">Responsable :</strong> {credentialsSchool.managerName} ({credentialsSchool.managerEmail})</div>
                <div><strong className="text-slate-900 dark:text-white">Validité :</strong> Jusqu'au {new Date(credentialsSchool.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Actions de transmission WhatsApp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <a
                href={`https://wa.me/${(credentialsSchool.managerPhone || credentialsSchool.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Bonjour ${credentialsSchool.managerName},\n\nVotre accès Super Admin pour l'école *${credentialsSchool.name}* sur la plateforme Lingua-Flow a été configuré avec succès.\n\n🔗 *Lien de connexion* : ${window.location.origin}\n👤 *Identifiant* : ${credentialsSchool.username || credentialsSchool.managerEmail.split("@")[0]}\n🔑 *Mot de passe* : ${credentialsSchool.password || "school123"}\n\nVous pouvez dès à présent gérer vos cours, inscrire vos élèves et suivre les progrès pédagogiques.\n\nCordialement,\nL'administration Lingua-Flow`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                <Share2 size={16} />
                <span>Envoyer par WhatsApp</span>
              </a>

              <a
                href={`mailto:${credentialsSchool.managerEmail}?subject=${encodeURIComponent(
                  `Vos identifiants d'accès Lingua-Flow - École ${credentialsSchool.name}`
                )}&body=${encodeURIComponent(
                  `Bonjour ${credentialsSchool.managerName},\n\nVotre compte administrateur pour l'école "${credentialsSchool.name}" est désormais actif.\n\nURL de connexion : ${window.location.origin}\nNom d'utilisateur : ${credentialsSchool.username || credentialsSchool.managerEmail.split("@")[0]}\nMot de passe : ${credentialsSchool.password || "school123"}\n\nValidité de la licence : jusqu'au ${credentialsSchool.endDate}\n\nBienvenue sur Lingua-Flow !\nL'équipe administrative.`
                )}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md hover:opacity-90 transition cursor-pointer"
              >
                <Send size={16} />
                <span>Envoyer par E-mail</span>
              </a>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCredentialsSchool(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-200 min-h-[40px] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
