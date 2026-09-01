import React, { useRef } from "react";
import { Student, School, Program, Lesson, UILocale } from "../../types";
import { translations } from "../../lib/translations";
import { ProgressBar } from "../common/ProgressBar";
import { NeonButton } from "../common/NeonButton";
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Lock,
  FileCheck,
} from "lucide-react";

interface StudentProgressTabProps {
  student: Student;
  school: School;
  program: Program | undefined;
  allLessons: Lesson[];
  locale: UILocale;
}

export const StudentProgressTab: React.FC<StudentProgressTabProps> = ({
  student,
  school,
  program,
  allLessons,
  locale,
}) => {
  const t = translations[locale];
  const certificateRef = useRef<HTMLDivElement>(null);

  const isCertified = (student.progressPercent || 0) >= 100;
  const completedLessons = student.completedLessons || [];
  const safeLessons = allLessons || [];
  const completedLessonsCount = completedLessons.length;
  const totalLessonsCount = Math.max(1, safeLessons.length);

  // Skill competencies breakdown
  const skills = [
    {
      name: t.student.oralComprehension,
      level: student.level,
      score: Math.min(100, student.progressPercent + 5),
      color: "cyan",
    },
    {
      name: t.student.writtenComprehension,
      level: student.level,
      score: Math.min(100, student.progressPercent),
      color: "indigo",
    },
    {
      name: t.student.grammarSyntax,
      level: student.level,
      score: Math.max(20, Math.min(100, student.progressPercent - 2)),
      color: "emerald",
    },
    {
      name: t.student.vocabularyLexicon,
      level: student.level,
      score: Math.min(100, student.progressPercent + 2),
      color: "purple",
    },
    {
      name: t.student.writtenExpression,
      level: student.level,
      score: Math.max(15, Math.min(100, student.progressPercent - 5)),
      color: "amber",
    },
  ];

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award size={22} className="text-indigo-500" />
          {t.student.skillsBreakdown} & {locale === "en" ? "Certificate" : "Certificat"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {locale === "en"
            ? `Detailed tracking of your CEFR skills and official certificate delivery (${school.name}).`
            : `Suivi détaillé de vos compétences CECRL et délivrance de votre attestation officielle (${school.name}).`}
        </p>
      </div>

      {/* Skills Assessment Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {s.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-500">
                {locale === "en" ? "Level" : "Niveau"} {s.level}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>{locale === "en" ? "Estimated Mastery" : "Maîtrise estimée"}</span>
                <span className="text-slate-900 dark:text-white font-bold">{s.score}%</span>
              </div>
              <ProgressBar value={s.score} color={s.color as any} height="sm" />
            </div>
          </div>
        ))}

        {/* Global Progress Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-[#0D1220] text-white rounded-3xl p-5 shadow-md space-y-3 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-indigo-300">{locale === "en" ? "Global Validation" : "Validation Globale"}</span>
            <ShieldCheck size={18} className="text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{student.progressPercent}%</span>
            <span className="text-xs text-slate-400">
              ({completedLessonsCount}/{totalLessonsCount} {locale === "en" ? "lessons" : "leçons"})
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            {isCertified
              ? (locale === "en" ? "🎉 Congratulations! Your official certificate is validated." : "🎉 Félicitations ! Votre certificat officiel est validé.")
              : (locale === "en" ? "Complete all lessons to unlock your certificate." : "Complétez toutes les leçons pour débloquer votre attestation.")}
          </p>
        </div>
      </div>

      {/* OFFICIAL CERTIFICATE SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck size={18} className="text-emerald-500" />
            {t.student.certificateTitle}
          </h3>

          {isCertified && (
            <div className="flex flex-wrap items-center gap-2">
              <NeonButton
                variant="primary"
                size="sm"
                onClick={handlePrintCertificate}
                icon={<Printer size={14} />}
              >
                {t.student.certificatePrint}
              </NeonButton>
              <NeonButton
                variant="emerald"
                size="sm"
                onClick={handleDownloadPDF}
                icon={<Download size={14} />}
              >
                {t.student.certificateDownload}
              </NeonButton>
            </div>
          )}
        </div>

        {/* Certificate Card Preview */}
        <div
          ref={certificateRef}
          className={`relative overflow-hidden rounded-3xl border p-4 sm:p-10 transition ${
            isCertified
              ? "bg-gradient-to-b from-amber-500/5 via-white to-slate-50 dark:from-amber-500/5 dark:via-slate-900 dark:to-[#0D1220] border-amber-500/40 shadow-xl"
              : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 opacity-80"
          }`}
        >
          {/* Certificate Inner Frame Border */}
          <div className="rounded-2xl border-2 border-dashed border-amber-500/30 p-4 sm:p-8 space-y-6 sm:space-y-8 text-center relative">
            {/* Watermark Seal Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <Award size={280} className="text-amber-500" />
            </div>

            {/* School & Platform Top Header */}
            <div className="space-y-1">
              <p className="text-[11px] font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-bold">
                LINGUA FLOW OFFICIAL CERTIFICATION
              </p>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-wide">
                {locale === "en" ? "Certificate of Achievement" : "Attestation de Réussite"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {locale === "en"
                  ? `Issued by language school institution ${school.name}`
                  : `Délivrée par l'établissement d'enseignement linguistique ${school.name}`}
              </p>
            </div>

            {/* Student Name */}
            <div className="space-y-2 py-4 border-y border-amber-500/20 max-w-lg mx-auto">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {locale === "en" ? "This certificate is awarded to" : "Ce certificat est décerné à"}
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                {student.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {locale === "en" ? (
                  <>
                    For successfully completing the complete curriculum in{" "}
                    <strong>{school.language === "german" ? "German 🇩🇪" : "Italian 🇮🇹"}</strong>{" "}
                    corresponding to the European standard <strong>CEFR {student.level}</strong>.
                  </>
                ) : (
                  <>
                    Pour avoir validé avec succès l'ensemble du cursus de formation en{" "}
                    <strong>{school.language === "german" ? "Allemand 🇩🇪" : "Italien 🇮🇹"}</strong>{" "}
                    correspondant au standard européen <strong>CECRL {student.level}</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-left max-w-xl mx-auto pt-2">
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">{locale === "en" ? "CEFR Level" : "Niveau CECRL"}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {student.level}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">{locale === "en" ? "Progress" : "Progression"}</span>
                <span className="font-bold text-emerald-500 text-sm">
                  {student.progressPercent}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">{locale === "en" ? "Issue Date" : "Date d'émission"}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {new Date().toLocaleDateString(locale === "en" ? "en-US" : "fr-FR")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">{locale === "en" ? "Verification ID" : "ID Vérification"}</span>
                <span className="font-mono text-[11px] font-bold text-indigo-500 truncate block">
                  LF-{student.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Signature & Stamp */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 max-w-xl mx-auto">
              <div className="text-left space-y-1">
                <div className="h-8 border-b border-slate-300 dark:border-slate-700 w-36 font-serif italic text-xs text-slate-400 flex items-end">
                  {school.managerName || (locale === "en" ? "Academic Director" : "Direction Pédagogique")}
                </div>
                <p className="text-[10px] text-slate-400">{locale === "en" ? "Academic Director" : "Directeur Pédagogique"}</p>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{school.name}</p>
              </div>

              {/* Verified Digital Stamp */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/60 flex flex-col items-center justify-center text-amber-500 rotate-[-12deg] p-1 select-none">
                <ShieldCheck size={20} />
                <span className="text-[8px] font-black uppercase tracking-tighter">VERIFIED</span>
                <span className="text-[7px] font-mono">LINGUA FLOW</span>
              </div>
            </div>
          </div>

          {/* Locked Overlay if not 100% */}
          {!isCertified && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
                <Lock size={28} />
              </div>
              <h4 className="text-base sm:text-lg font-bold">
                {locale === "en" ? `Certificate locked (${student.progressPercent}%)` : `Certificat verrouillé (${student.progressPercent}%)`}
              </h4>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                {t.student.certificateLockedNotice}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
