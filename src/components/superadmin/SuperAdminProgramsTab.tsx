import React, { useState } from "react";
import { Program, School, UILocale } from "../../types";
import { Modal } from "../common/Modal";
import {
  GraduationCap,
  BookOpen,
  Search,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Film,
  ListOrdered,
  FileCheck,
} from "lucide-react";

interface SuperAdminProgramsTabProps {
  programs: Program[];
  schools: School[];
  locale: UILocale;
  onUpdatePrograms: (programs: Program[]) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminProgramsTab: React.FC<SuperAdminProgramsTabProps> = ({
  programs,
  schools,
  locale,
  onUpdatePrograms,
  onAddLog,
}) => {
  const isEn = locale === "en";
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const filteredPrograms = programs.filter((p) => {
    const school = schools.find((s) => s.id === p.schoolId);
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school && school.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSchool = schoolFilter === "all" || p.schoolId === schoolFilter;
    const matchesLevel = levelFilter === "all" || p.level === levelFilter;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
        ? p.isPublished
        : !p.isPublished;

    return matchesSearch && matchesSchool && matchesLevel && matchesStatus;
  });

  const handleTogglePublish = (program: Program) => {
    const updated = programs.map((p) =>
      p.id === program.id ? { ...p, isPublished: !p.isPublished } : p
    );
    onUpdatePrograms(updated);
    onAddLog(
      isEn ? "Program Status Modified" : "Statut Programme Modifié",
      isEn
        ? `Program '${program.title}' is now ${!program.isPublished ? "published" : "draft"}.`
        : `Le programme '${program.title}' est maintenant ${!program.isPublished ? "publié" : "en brouillon"}.`,
      "success"
    );
    if (selectedProgram && selectedProgram.id === program.id) {
      setSelectedProgram({ ...selectedProgram, isPublished: !program.isPublished });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEn ? "Search by course title, description, school..." : "Rechercher par titre de cours, description, école..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? "All schools" : "Toutes les écoles"} ({schools.length})</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.language === "german" ? "🇩🇪" : "🇮🇹"})
              </option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? "All levels" : "Tous niveaux"}</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">{isEn ? "All statuses" : "Tous statuts"}</option>
            <option value="published">{isEn ? "Published" : "Publiés"}</option>
            <option value="draft">{isEn ? "Drafts" : "Brouillons"}</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 border border-slate-200 dark:border-white/10 text-slate-400 text-xs">
            {isEn ? "No educational programs found." : "Aucun programme pédagogique trouvé."}
          </div>
        ) : (
          filteredPrograms.map((prog) => {
            const school = schools.find((s) => s.id === prog.schoolId);
            const totalLessons = prog.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const totalVideos = prog.modules.reduce(
              (acc, m) => acc + m.lessons.filter((l) => !!l.videoUrl).length,
              0
            );
            const isIncomplete = totalLessons < 3;

            return (
              <div
                key={prog.id}
                className="p-5 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#6D5DFC]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff]">
                        {prog.level}
                      </span>
                      {prog.isPublished ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#20E3A2]/15 text-[#20E3A2]">
                          {isEn ? "Published" : "Publié"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500">
                          {isEn ? "Draft" : "Brouillon"}
                        </span>
                      )}
                    </div>

                    {isIncomplete && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 flex items-center gap-1">
                        <AlertTriangle size={11} />
                        <span>{isEn ? "Incomplete" : "Incomplet"}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                    {prog.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-white/50 line-clamp-2 mt-1">
                    {prog.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-white/80 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    <span>{school?.logo || "🏫"}</span>
                    <span className="truncate">{school?.name || (isEn ? "Partner School" : "École Partenaire")}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-2xl font-mono">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-white/70">
                      <ListOrdered size={14} className="text-[#6D5DFC]" />
                      <span>{prog.modules.length} {isEn ? "modules" : "modules"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-white/70">
                      <Film size={14} className="text-[#00D9FF]" />
                      <span>{totalVideos} {isEn ? "videos" : "vidéos"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProgram(prog)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition min-h-[40px] cursor-pointer"
                    >
                      {isEn ? "Syllabus Details" : "Détails Syllabus"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(prog)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition min-h-[40px] cursor-pointer ${
                        prog.isPublished
                          ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                          : "bg-[#20E3A2]/10 text-[#20E3A2] hover:bg-[#20E3A2]/20"
                      }`}
                    >
                      {prog.isPublished ? (isEn ? "Hide" : "Masquer") : (isEn ? "Publish" : "Publier")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Program Syllabus Detail Modal */}
      <Modal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        title={`${isEn ? "Program" : "Programme"} • ${selectedProgram?.title}`}
        maxWidth="max-w-2xl"
      >
        {selectedProgram && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#6D5DFC]">{isEn ? "Level" : "Niveau"} {selectedProgram.level}</span>
                <span className="text-slate-400 font-mono">
                  {schools.find((s) => s.id === selectedProgram.schoolId)?.name}
                </span>
              </div>
              <p className="text-slate-600 dark:text-white/70">{selectedProgram.description}</p>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                {isEn ? "Module Structure" : "Structure des Modules"} ({selectedProgram.modules.length})
              </h5>

              {selectedProgram.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {isEn ? "Module" : "Module"} {idx + 1} : {mod.title}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {mod.lessons.length} {isEn ? "lessons" : "cours"}
                    </span>
                  </div>
                  <div className="space-y-1 pl-2 border-l-2 border-[#6D5DFC]/30">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="flex items-center justify-between text-[11px] text-slate-600 dark:text-white/70 py-0.5"
                      >
                        <span>• {les.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {les.durationMinutes} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white font-bold min-h-[40px] cursor-pointer"
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
