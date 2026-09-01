import React, { useState } from "react";
import { School, Student, Program, ActivityLog, EntityStatus, UILocale } from "../../types";
import { Modal } from "../common/Modal";
import { ProgressBar } from "../common/ProgressBar";
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Edit2,
  Clock3,
  ShieldAlert,
  Archive,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  UserCheck,
} from "lucide-react";

interface SuperAdminSchoolDetailModalProps {
  school: School | null;
  students: Student[];
  programs: Program[];
  logs: ActivityLog[];
  locale: UILocale;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (school: School) => void;
  onExtend: (school: School) => void;
  onChangeStatus: (school: School, status: EntityStatus) => void;
  onDelete: (school: School) => void;
}

export const SuperAdminSchoolDetailModal: React.FC<SuperAdminSchoolDetailModalProps> = ({
  school,
  students,
  programs,
  logs,
  locale,
  isOpen,
  onClose,
  onEdit,
  onExtend,
  onChangeStatus,
  onDelete,
}) => {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "programs" | "history">("overview");

  if (!school) return null;

  const schoolStudents = students.filter((s) => s.schoolId === school.id);
  const schoolPrograms = programs.filter((p) => p.schoolId === school.id);
  const schoolLogs = logs.filter((l) => l.schoolName === school.name || l.schoolId === school.id);

  const quotaPercent = Math.min(100, Math.round((schoolStudents.length / Math.max(1, school.studentQuota)) * 100));

  // Compute days remaining
  const now = new Date();
  const endDate = new Date(school.endDate);
  const diffTime = endDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEn ? "School File" : "Fiche Détaillée"} • ${school.name}`}
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Header Hero Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200/50 dark:from-white/[0.04] dark:to-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="text-3xl p-3 rounded-2xl bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 shrink-0">
              {school.logo || (school.language === "german" ? "🇩🇪" : "🇮🇹")}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {school.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] border border-[#6D5DFC]/30">
                  {school.language === "german" ? (isEn ? "German 🇩🇪" : "Allemand 🇩🇪") : (isEn ? "Italian 🇮🇹" : "Italien 🇮🇹")}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    school.status === "active"
                      ? "bg-[#20E3A2]/10 text-[#20E3A2] border border-[#20E3A2]/30"
                      : school.status === "suspended"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                      : school.status === "blocked"
                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                      : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white/70"
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
              </div>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-1 font-mono">
                {isEn ? "Slug" : "Slug"} : /{school.slug} • {isEn ? "Created on" : "Créée le"} {school.createdAt}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(school);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition min-h-[40px] cursor-pointer"
            >
              <Edit2 size={14} />
              <span>{isEn ? "Edit" : "Modifier"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onExtend(school);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-bold transition min-h-[40px] cursor-pointer"
            >
              <Clock3 size={14} />
              <span>{isEn ? "Extend Access" : "Prolonger"}</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs inside modal */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/10 pb-2">
          {[
            { id: "overview", label: isEn ? "Overview" : "Vue d'ensemble", icon: <Building2 size={15} /> },
            {
              id: "students",
              label: `${isEn ? "Students" : "Élèves"} (${schoolStudents.length})`,
              icon: <Users size={15} />,
            },
            {
              id: "programs",
              label: `${isEn ? "Programs" : "Programmes"} (${schoolPrograms.length})`,
              icon: <GraduationCap size={15} />,
            },
            {
              id: "history",
              label: `${isEn ? "Logs" : "Historique"} (${schoolLogs.length})`,
              icon: <Clock size={15} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] ${
                activeTab === tab.id
                  ? "bg-[#6D5DFC] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <p className="text-[11px] font-semibold text-slate-400">{isEn ? "Enrolled students" : "Élèves inscrits"}</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {schoolStudents.length} / {school.studentQuota}
                </p>
                <div className="mt-2">
                  <ProgressBar value={quotaPercent} color={quotaPercent >= 90 ? "amber" : "cyan"} height="sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <p className="text-[11px] font-semibold text-slate-400">{isEn ? "Remaining license" : "Accès SaaS restant"}</p>
                <p
                  className={`text-xl font-extrabold mt-1 ${
                    daysRemaining <= 15 ? "text-rose-500" : daysRemaining <= 30 ? "text-amber-500" : "text-[#20E3A2]"
                  }`}
                >
                  {daysRemaining > 0 ? `${daysRemaining} ${isEn ? "days" : "jours"}` : (isEn ? "Expired" : "Expiré")}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  {isEn ? "End:" : "Fin :"} {school.endDate}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <p className="text-[11px] font-semibold text-slate-400">{isEn ? "Created programs" : "Programmes créés"}</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {schoolPrograms.length}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {school.language === "german" ? (isEn ? "German Tracks" : "Filières Allemand") : (isEn ? "Italian Tracks" : "Filières Italien")}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <p className="text-[11px] font-semibold text-slate-400">{isEn ? "Last activity" : "Dernière activité"}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                  {school.lastActiveDate || (isEn ? "Today" : "Aujourd'hui")}
                </p>
                <p className="text-[10px] text-[#20E3A2] mt-1 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20E3A2] inline-block" />
                  {isEn ? "Online" : "En ligne"}
                </p>
              </div>
            </div>

            {/* General Info and Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
                  {isEn ? "Academic & Director Details" : "Coordonnées Pédagogiques & Direction"}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                    <span className="text-slate-500">{isEn ? "Director name:" : "Responsable légal :"}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{school.managerName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                    <span className="text-slate-500">{isEn ? "Director email:" : "E-mail responsable :"}</span>
                    <a href={`mailto:${school.managerEmail}`} className="text-[#00D9FF] hover:underline font-mono">
                      {school.managerEmail}
                    </a>
                  </div>
                  {school.managerPhone && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-500">{isEn ? "Director phone:" : "Téléphone responsable :"}</span>
                      <span className="font-mono text-slate-800 dark:text-white">{school.managerPhone}</span>
                    </div>
                  )}
                  {school.professionalEmail && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-500">{isEn ? "Professional email:" : "E-mail professionnel :"}</span>
                      <span className="font-mono text-slate-800 dark:text-white">{school.professionalEmail}</span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-500">{isEn ? "Main phone:" : "Standard téléphonique :"}</span>
                      <span className="font-mono text-slate-800 dark:text-white">{school.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
                  {isEn ? "Location & WhatsApp Support" : "Localisation & Support WhatsApp"}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                    <span className="text-slate-500">{isEn ? "Address:" : "Adresse :"}</span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {school.address || (isEn ? "Downtown" : "Centre-ville")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                    <span className="text-slate-500">{isEn ? "City / Country:" : "Ville / Pays :"}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {school.city || "—"}, {school.country || "Europe"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                    <span className="text-slate-500">{isEn ? "Promo WhatsApp Group:" : "Groupe Promo WhatsApp :"}</span>
                    {school.whatsappSupportUrl ? (
                      <a
                        href={school.whatsappSupportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-500 font-bold hover:underline flex items-center gap-1"
                      >
                        <MessageCircle size={13} />
                        <span>{isEn ? "Open WhatsApp" : "Ouvrir WhatsApp"}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400">{isEn ? "Not configured" : "Non configuré"}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">{isEn ? "License Period:" : "Période de licence :"}</span>
                    <span className="font-mono text-slate-800 dark:text-white">
                      {school.startDate} → {school.endDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Matrix Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {school.status === "active" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onChangeStatus(school, "suspended");
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition min-h-[40px] cursor-pointer"
                    >
                      {isEn ? "Suspend School" : "Suspendre l'école"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onChangeStatus(school, "blocked");
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold transition min-h-[40px] cursor-pointer"
                    >
                      {isEn ? "Block School" : "Bloquer l'école"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onChangeStatus(school, "active");
                    }}
                    className="px-3 py-2 rounded-xl bg-[#20E3A2]/15 hover:bg-[#20E3A2]/25 text-[#20E3A2] border border-[#20E3A2]/30 text-xs font-bold transition min-h-[40px] cursor-pointer"
                  >
                    {isEn ? "Reactivate School" : "Réactiver l'école"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onChangeStatus(school, "archived");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white/80 text-xs font-bold transition min-h-[40px] cursor-pointer flex items-center gap-1.5"
                >
                  <Archive size={14} />
                  <span>{isEn ? "Archive" : "Archiver"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(school);
                }}
                className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition min-h-[40px] cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 size={14} />
                <span>{isEn ? "Delete School Permanently" : "Supprimer définitivement"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Students */}
        {activeTab === "students" && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {schoolStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-white/40 text-xs">
                {isEn ? "No students registered yet for this school." : "Aucun élève n'a encore été inscrit dans cette école."}
              </div>
            ) : (
              <div className="space-y-2">
                {schoolStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6D5DFC]/15 text-[#6D5DFC] font-bold flex items-center justify-center shrink-0">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{st.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#6D5DFC]/10 text-[#6D5DFC]">
                        {isEn ? "Level" : "Niveau"} {st.level}
                      </span>
                      <div className="w-24 text-right">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-400">{isEn ? "Progress" : "Progrès"}</span>
                          <span className="text-[#00D9FF]">{st.progressPercent}%</span>
                        </div>
                        <ProgressBar value={st.progressPercent} color="cyan" height="sm" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === "active"
                            ? "bg-[#20E3A2]/10 text-[#20E3A2]"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Programs */}
        {activeTab === "programs" && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {schoolPrograms.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-white/40 text-xs">
                {isEn ? "No educational program created yet by this school." : "Aucun programme pédagogique n'a encore été créé par cette école."}
              </div>
            ) : (
              <div className="space-y-2.5">
                {schoolPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6D5DFC]/15 text-[#6D5DFC]">
                          {prog.level}
                        </span>
                        <h5 className="font-bold text-slate-900 dark:text-white">{prog.title}</h5>
                        {prog.isPublished ? (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#20E3A2]/10 text-[#20E3A2]">
                            {isEn ? "Published" : "Publié"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                            {isEn ? "Draft" : "Brouillon"}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{prog.description}</p>
                    </div>

                    <div className="text-right font-mono text-[11px] text-slate-400 shrink-0">
                      <p>{prog.modules.length} {isEn ? "Modules" : "Modules"}</p>
                      <p>
                        {prog.modules.reduce((acc, m) => acc + m.lessons.length, 0)} {isEn ? "Lessons" : "Leçons"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Activity History */}
        {activeTab === "history" && (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {schoolLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-white/40 text-xs">
                {isEn ? "No specific audit log for this school yet." : "Aucune entrée de journal spécifique à cette école."}
              </div>
            ) : (
              <div className="space-y-2">
                {schoolLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{log.action}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      <p>{log.timestamp}</p>
                      <p className="text-slate-500">{log.actorName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
