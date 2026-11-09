import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Student, School, CEFRLevel, UILocale } from "../../types";
import {
  Award,
  CheckCircle2,
  XCircle,
  Printer,
  X,
  ShieldCheck,
  QrCode,
  Calendar,
  Building,
  User,
  FileCheck2,
} from "lucide-react";

export interface TelcExamScoreBreakdown {
  lesenScore: number; // Max 75
  sprachbausteine1Score: number; // Max 15
  sprachbausteine2Score: number; // Max 15
  horenScore: number; // Max 75
  schreibenScore: number; // Max 45
  sprechenScore: number; // Max 75
  examDate?: string;
  certificateNumber?: string;
}

interface TelcOfficialCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  school: School;
  level: CEFRLevel;
  scores: TelcExamScoreBreakdown;
  locale: UILocale;
}

export const TelcOfficialCertificateModal: React.FC<TelcOfficialCertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  school,
  level,
  scores,
  locale,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";

  // Points calculation according to strict Telc standard
  const sbTotal = (scores.sprachbausteine1Score || 0) + (scores.sprachbausteine2Score || 0); // /30
  const schriftlichTotal =
    (scores.lesenScore || 0) +
    sbTotal +
    (scores.horenScore || 0) +
    (scores.schreibenScore || 0); // /225

  const mundlichTotal = scores.sprechenScore || 0; // /75
  const gesamtergebnis = schriftlichTotal + mundlichTotal; // /300

  // Strict Pass Thresholds: 60% in both parts
  const isSchriftlichPassed = schriftlichTotal >= 135; // 60% of 225
  const isMundlichPassed = mundlichTotal >= 45; // 60% of 75
  const isOverallPassed = isSchriftlichPassed && isMundlichPassed && gesamtergebnis >= 180;

  // Telc Prädikat / Mention
  let praedikatDe = "Nicht bestanden";
  let praedikatFr = "Échoué";
  let praedikatEn = "Failed";
  let praedikatColor = "text-rose-600 border-rose-500 bg-rose-50 dark:bg-rose-950/20";

  if (isOverallPassed) {
    if (gesamtergebnis >= 270) {
      praedikatDe = "Sehr Gut (1)";
      praedikatFr = "Très Bien (1)";
      praedikatEn = "Very Good (Distinction)";
      praedikatColor = "text-emerald-700 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
    } else if (gesamtergebnis >= 240) {
      praedikatDe = "Gut (2)";
      praedikatFr = "Bien (2)";
      praedikatEn = "Good (Merit)";
      praedikatColor = "text-teal-700 border-teal-500 bg-teal-50 dark:bg-teal-950/30";
    } else if (gesamtergebnis >= 210) {
      praedikatDe = "Befriedigend (3)";
      praedikatFr = "Assez Bien (3)";
      praedikatEn = "Satisfactory";
      praedikatColor = "text-indigo-700 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30";
    } else {
      praedikatDe = "Ausreichend (4)";
      praedikatFr = "Passable / Admis (4)";
      praedikatEn = "Pass";
      praedikatColor = "text-amber-700 border-amber-500 bg-amber-50 dark:bg-amber-950/30";
    }
  }

  const certNumber =
    scores.certificateNumber ||
    `TELC-DE-${level}-${(student.id || "STD").slice(0, 6).toUpperCase()}-${new Date().getFullYear()}`;
  const examDateFormatted =
    scores.examDate ||
    new Date().toLocaleDateString(locale === "en" ? "en-US" : "de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0c101d] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden my-auto"
        >
          {/* Top Actions Bar (Hidden in Print) */}
          <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6D5DFC] text-white">
                <FileCheck2 size={18} />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {isEn ? "Official telc Examination Certificate" : "Certificat Officiel d'Examen telc"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isEn ? "Standard European Language Certificate Model" : "Modèle Officiel telc Standard Européen (300 Pkt)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition cursor-pointer"
              >
                <Printer size={14} />
                <span>{isEn ? "Print / Save PDF" : "Imprimer / PDF"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* PRINTABLE OFFICIAL TELC CERTIFICATE */}
          <div
            ref={printRef}
            className="p-8 sm:p-12 text-slate-900 bg-white relative overflow-hidden print:p-6"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {/* Subtle telc Background Security Guilloche & Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none font-serif text-[140px] font-black tracking-widest text-slate-900">
              TELC {level}
            </div>

            {/* Official Double Border Frame */}
            <div className="border-4 border-[#1E3A8A] p-6 sm:p-8 rounded-2xl relative">
              <div className="border border-[#1E3A8A]/40 p-4 sm:p-6 rounded-xl">
                {/* Header: Organization & Level */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#1E3A8A]">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#1E3A8A]">
                      EUROPEAN LANGUAGE CERTIFICATES • SYSTEM DER TELC gGmbH
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight mt-1">
                      ZERTIFIKAT DEUTSCH
                    </h1>
                    <div className="text-base font-bold text-slate-700 mt-0.5">
                      telc Deutsch {level} • Gemeinsamer europäischer Referenzrahmen (GER)
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white font-black text-xl tracking-wider text-center shadow-md">
                      telc {level}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      Prüfungs-ID: {certNumber}
                    </span>
                  </div>
                </div>

                {/* Candidate Identification Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Name des Kandidaten / Name of Candidate:
                    </span>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      Kandidatennummer: <span className="font-mono font-bold">{student.id}</span>
                    </p>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Prüfungszentrum / Examination Centre:
                    </span>
                    <p className="text-base font-bold text-slate-900">
                      {school.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      Prüfungsdatum: <span className="font-semibold">{examDateFormatted}</span>
                    </p>
                  </div>
                </div>

                {/* OFFICIAL TELC SCORE BREAKDOWN TABLE (225 + 75 = 300) */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#1E3A8A]">
                      Prüfungsergebnisse im Detail / Detailed Results
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Bestehensgrenze: 60% in beiden Prüfungsteilen
                    </span>
                  </div>

                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                          <th className="p-3">Prüfungsteil / Module</th>
                          <th className="p-3 text-center">Erreichte Punkte</th>
                          <th className="p-3 text-center">Max. Punkte</th>
                          <th className="p-3 text-center">Mindestpunktzahl (60%)</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {/* Teil 1: Schriftliche Prüfung */}
                        <tr className="bg-indigo-50/50 font-bold text-[#1E3A8A]">
                          <td colSpan={5} className="p-2.5 pl-3 uppercase tracking-wider text-[11px]">
                            I. Schriftliche Prüfung / Written Examination (225 Punkte)
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 pl-6 text-slate-800">1. Leseverstehen</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                            {scores.lesenScore}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">75</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">45.0</td>
                          <td className="p-2.5 text-right">
                            {scores.lesenScore >= 45 ? (
                              <span className="text-emerald-700 font-bold">Bestanden</span>
                            ) : (
                              <span className="text-rose-600 font-bold">Nicht bestanden</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 pl-6 text-slate-800">
                            2. Sprachbausteine Teil 1 ({scores.sprachbausteine1Score}/15) & Teil 2 ({scores.sprachbausteine2Score}/15)
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                            {sbTotal}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">30</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">18.0</td>
                          <td className="p-2.5 text-right">
                            {sbTotal >= 18 ? (
                              <span className="text-emerald-700 font-bold">Bestanden</span>
                            ) : (
                              <span className="text-rose-600 font-bold">Nicht bestanden</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 pl-6 text-slate-800">3. Hörverstehen</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                            {scores.horenScore}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">75</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">45.0</td>
                          <td className="p-2.5 text-right">
                            {scores.horenScore >= 45 ? (
                              <span className="text-emerald-700 font-bold">Bestanden</span>
                            ) : (
                              <span className="text-rose-600 font-bold">Nicht bestanden</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 pl-6 text-slate-800">4. Schriftlicher Ausdruck (Brief / Textproduktion)</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                            {scores.schreibenScore}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">45</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">27.0</td>
                          <td className="p-2.5 text-right">
                            {scores.schreibenScore >= 27 ? (
                              <span className="text-emerald-700 font-bold">Bestanden</span>
                            ) : (
                              <span className="text-rose-600 font-bold">Nicht bestanden</span>
                            )}
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="p-3 pl-3 text-[#1E3A8A]">
                            Zwischensumme Schriftliche Prüfung:
                          </td>
                          <td className="p-3 text-center font-mono text-sm text-[#1E3A8A]">
                            {schriftlichTotal}
                          </td>
                          <td className="p-3 text-center font-mono text-slate-600">225</td>
                          <td className="p-3 text-center font-mono text-slate-600">135.0</td>
                          <td className="p-3 text-right">
                            {isSchriftlichPassed ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <CheckCircle2 size={13} /> Bestanden
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600">
                                <XCircle size={13} /> Nicht bestanden
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Teil 2: Mündliche Prüfung */}
                        <tr className="bg-indigo-50/50 font-bold text-[#1E3A8A]">
                          <td colSpan={5} className="p-2.5 pl-3 uppercase tracking-wider text-[11px]">
                            II. Mündliche Prüfung / Oral Examination (75 Punkte)
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 pl-6 text-slate-800">
                            Mündlicher Ausdruck (Präsentation, Diskussion & Prüfungsgespräch)
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                            {mundlichTotal}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">75</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">45.0</td>
                          <td className="p-2.5 text-right">
                            {isMundlichPassed ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <CheckCircle2 size={13} /> Bestanden
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                                <XCircle size={13} /> Nicht bestanden
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* Gesamtergebnis */}
                        <tr className="bg-[#1E3A8A]/10 font-black text-sm">
                          <td className="p-3.5 pl-3 text-[#1E3A8A]">
                            GESAMTERGEBNIS / FINAL RESULT (300 Punkte):
                          </td>
                          <td className="p-3.5 text-center font-mono text-base text-[#1E3A8A]">
                            {gesamtergebnis}
                          </td>
                          <td className="p-3.5 text-center font-mono text-slate-700">300</td>
                          <td className="p-3.5 text-center font-mono text-slate-700">180.0</td>
                          <td className="p-3.5 text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                                isOverallPassed
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-600 text-white"
                              }`}
                            >
                              {isOverallPassed ? "Bestanden" : "Nicht bestanden"}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PRÄDIKAT / OFFICIAL MENTION BADGE */}
                <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                      Prädikat / Final Grade Distinction:
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                      {praedikatDe}{" "}
                      <span className="text-sm font-semibold text-slate-500">
                        ({isEn ? praedikatEn : praedikatFr})
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Notenskala: 270–300 (Sehr Gut) • 240–269.5 (Gut) • 210–239.5 (Befriedigend) • 180–209.5 (Ausreichend)
                    </p>
                  </div>

                  <div className={`px-5 py-2.5 rounded-xl border-2 font-black text-sm sm:text-base ${praedikatColor}`}>
                    {isOverallPassed ? `ZERTIFIZIERT GER ${level}` : "NICHT BESTANDEN"}
                  </div>
                </div>

                {/* Footer: Official Verification, Signatures & Stamp */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-slate-200 mt-6">
                  {/* Left: Security QR and ID */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 border-2 border-slate-300 rounded-lg p-1 flex items-center justify-center bg-white shadow-xs">
                      <QrCode size={56} className="text-[#1E3A8A]" />
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      <span className="font-bold text-slate-700 block">Digital Authenticated</span>
                      <span>telc Verification Service</span>
                      <span className="font-mono block mt-0.5">{certNumber}</span>
                    </div>
                  </div>

                  {/* Center: Official Seal */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#1E3A8A]/50 flex flex-col items-center justify-center text-[#1E3A8A] text-[9px] font-bold p-1">
                      <ShieldCheck size={20} className="text-[#1E3A8A] mb-0.5" />
                      <span>OFFICIAL SEAL</span>
                      <span className="text-[8px]">{school.name}</span>
                    </div>
                  </div>

                  {/* Right: Signature */}
                  <div className="text-right space-y-1">
                    <div className="h-10 border-b border-slate-400 font-serif italic text-sm text-slate-600 flex items-end justify-end pr-2">
                      Dr. Werner Klaus
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                      Leiter des Prüfungszentrums / Head of Examination Centre
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
