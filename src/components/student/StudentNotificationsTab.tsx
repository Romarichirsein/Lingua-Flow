import React, { useState } from "react";
import { Student, School, UILocale, Announcement } from "../../types";
import { translations } from "../../lib/translations";
import { computeDaysRemaining } from "../../lib/syncEngine";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "access" | "lesson" | "ai" | "school";
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionTab?: "courses" | "writing" | "chat" | "profile";
}

interface StudentNotificationsTabProps {
  student: Student;
  school: School;
  locale: UILocale;
  announcements: Announcement[];
  onNavigateTab: (tab: "courses" | "writing" | "chat" | "profile") => void;
}

export const StudentNotificationsTab: React.FC<StudentNotificationsTabProps> = ({
  student,
  school,
  locale,
  announcements,
  onNavigateTab,
}) => {
  const t = translations[locale];

  // Calculate remaining days for dynamic notification safely
  const daysRemaining = computeDaysRemaining(student.endDate);

  const relevantAnnouncements = announcements.filter(
    (a) => a.target === "all" || a.target === "students" || a.targetSchoolId === school.id
  );

  const mappedAnnouncements: NotificationItem[] = relevantAnnouncements.map((ann) => ({
    id: `ann-${ann.id}`,
    type: "school",
    title: ann.title,
    message: ann.content,
    date: new Date(ann.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }),
    read: false,
  }));

  const initialNotifications: NotificationItem[] = [
    ...mappedAnnouncements,
    {
      id: "notif-1",
      type: "access",
      title: locale === "en" ? "Student Access Validity" : "Validité de votre accès élève",
      message: locale === "en"
        ? `Your training at ${school.name} is active until ${student.endDate} (${daysRemaining} days remaining).`
        : `Votre formation chez ${school.name} est active jusqu'au ${student.endDate} (${daysRemaining} jours restants).`,
      date: locale === "en" ? "Today" : "Aujourd'hui",
      read: false,
      actionTab: "profile",
    },
    {
      id: "notif-2",
      type: "lesson",
      title: locale === "en" ? "Recommended New Lesson" : "Nouvelle leçon recommandée",
      message: locale === "en"
        ? "Continue your curriculum by validating interactive exercises and module quizzes."
        : "Poursuivez votre cursus en validant les exercices interactifs et quiz du module en cours.",
      date: locale === "en" ? "Yesterday" : "Hier",
      read: false,
      actionTab: "courses",
    },
    {
      id: "notif-3",
      type: "ai",
      title: locale === "en" ? "AI Writing Assistant Available" : "Assistant Rédaction IA disponible",
      message: locale === "en"
        ? "Practice writing immersion texts and receive immediate CEFR-compliant feedback."
        : "Entraînez-vous à rédiger des textes en immersion et recevez un retour immédiat conforme au standard CECRL.",
      date: locale === "en" ? "3 days ago" : "Il y a 3 jours",
      read: true,
      actionTab: "writing",
    },
    {
      id: "notif-4",
      type: "school",
      title: locale === "en" ? `Welcome to ${school.name}` : `Bienvenue à ${school.name}`,
      message: locale === "en"
        ? `Your account for learning ${school.language === "german" ? "German" : "Italian"} is fully configured. Enjoy your learning journey!`
        : `Votre compte pour l'apprentissage du ${school.language === "german" ? "deutsch (allemand)" : "italiano (italien)"} est configuré. Bon apprentissage !`,
      date: locale === "en" ? "7 days ago" : "Il y a 7 jours",
      read: true,
    },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell size={22} className="text-indigo-500" />
            {t.student.notificationsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.student.notificationsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {t.student.markAllRead}
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {locale === "en" ? "All" : "Toutes"} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === "unread"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {locale === "en" ? "Unread" : "Non lues"} ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center text-slate-400 text-xs">
            {t.student.noNotifications}
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const getIcon = () => {
              switch (notif.type) {
                case "access":
                  return <Calendar size={18} className="text-amber-500" />;
                case "lesson":
                  return <BookOpen size={18} className="text-indigo-500" />;
                case "ai":
                  return <Sparkles size={18} className="text-cyan-500" />;
                case "school":
                  return <MessageSquare size={18} className="text-emerald-500" />;
                default:
                  return <Bell size={18} className="text-indigo-500" />;
              }
            };

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read
                    ? "bg-white dark:bg-[#0D1220] border-indigo-500/30 shadow-xs"
                    : "bg-slate-50/80 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                    {getIcon()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {notif.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.actionTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(notif.actionTab!)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{locale === "en" ? "Open" : "Ouvrir"}</span>
                      <ChevronRight size={13} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleRead(notif.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={notif.read ? (locale === "en" ? "Mark as unread" : "Marquer comme non lu") : (locale === "en" ? "Mark as read" : "Marquer comme lu")}
                  >
                    <Check size={16} className={notif.read ? "text-emerald-500" : ""} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
