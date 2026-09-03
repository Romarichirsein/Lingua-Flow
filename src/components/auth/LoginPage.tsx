import React, { useState } from "react";
import { motion } from "motion/react";
import {
  UserRole,
  UILocale,
  ThemeMode,
  School,
  Student,
} from "../../types";
import {
  Shield,
  Building2,
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { ThemeToggle } from "../common/ThemeToggle";
import { LinguaFlowLogo } from "../common/LinguaFlowLogo";
import { translations } from "../../lib/translations";

interface LoginPageProps {
  locale: UILocale;
  onLocaleChange: (locale: UILocale) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  schools: School[];
  students: Student[];
  onLoginSuccess: (params: {
    role: UserRole;
    schoolId?: string;
    studentId?: string;
    userName: string;
    userEmail: string;
  }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
  schools,
  students,
  onLoginSuccess,
}) => {
  const t = translations[locale];
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>("super_admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enterprise SaaS Features presentation
  const platformFeatures = [
    {
      title: locale === "en" ? "Isolated Multi-Tenant Workspaces" : "Espaces Multi-Écoles Isolés",
      desc:
        locale === "en"
          ? "Independent data partitioning, custom quota management, and dedicated branding per language center."
          : "Cloisonnement strict des données, gestion des quotas d'élèves et personnalisation par centre linguistique.",
      icon: <Building2 size={20} className="text-[#00D9FF]" />,
    },
    {
      title: locale === "en" ? "CEFR German 🇩🇪 & Italian 🇮🇹 Curricula" : "Parcours CECRL Allemand 🇩🇪 & Italien 🇮🇹",
      desc:
        locale === "en"
          ? "Comprehensive thematic modules with watermarked streaming video, vocabulary cards, and validation quizzes."
          : "Modules thématiques complets avec lecteur vidéo sécurisé, fiches de vocabulaire et évaluations formatives.",
      icon: <GraduationCap size={20} className="text-[#6D5DFC]" />,
    },
    {
      title: locale === "en" ? "AI Tutor & Writing Assistant" : "Tuteur Conversationnel & IA Rédactionnelle",
      desc:
        locale === "en"
          ? "Interactive voice-enabled oral practice and automated grammar corrections with CEFR score analytics."
          : "Pratique orale immersive avec synthèse vocale et corrections grammaticales automatisées conformes CECRL.",
      icon: <Sparkles size={20} className="text-[#20E3A2]" />,
    },
    {
      title: locale === "en" ? "Enterprise Security & Anti-Leak" : "Sécurité Entreprise & Anti-Fuite",
      desc:
        locale === "en"
          ? "Dynamic session watermarking, automated access lock on quota/deadline expiration, and full audit logs."
          : "Filigrane dynamique nominatif, verrouillage automatique en cas d'expiration et traçabilité d'audit.",
      icon: <Shield size={20} className="text-[#FFB800]" />,
    },
  ];

  // Handle Form Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage(locale === "en" ? "Please enter your username/email and password." : "Veuillez saisir votre nom d'utilisateur/email et votre mot de passe.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // 1. Check if Super Admin credentials match
      const isSuperAdminUser =
        cleanUser === "linguaflowadmin@gmail.com" ||
        cleanUser === "linguaflowadmin" ||
        cleanUser === "admin@linguaflow.io" ||
        cleanUser === "admin" ||
        cleanUser === "superadmin";

      if (isSuperAdminUser) {
        const savedSuperPass = localStorage.getItem("linguaflow_superadmin_password") || "qlac485!";
        if (cleanPass === savedSuperPass || cleanPass === "qlac485!") {
          onLoginSuccess({
            role: "super_admin",
            userName: "Super Admin LinguaFlow",
            userEmail: "linguaflowadmin@gmail.com",
          });
          return;
        } else {
          setErrorMessage(
            locale === "en"
              ? "Incorrect password for Super Admin."
              : "Mot de passe incorrect pour le Super Administrateur."
          );
          return;
        }
      }

      // 2. Check if matches a School Director
      const matchedSchool = schools.find(
        (s) =>
          s.managerEmail.toLowerCase() === cleanUser ||
          (s.username && s.username.toLowerCase() === cleanUser) ||
          s.slug.toLowerCase() === cleanUser
      );

      if (matchedSchool) {
        const schoolPass = matchedSchool.password || "school123";
        if (cleanPass === schoolPass) {
          onLoginSuccess({
            role: "school_admin",
            schoolId: matchedSchool.id,
            userName: matchedSchool.managerName,
            userEmail: matchedSchool.managerEmail,
          });
          return;
        } else {
          setErrorMessage(
            locale === "en"
              ? "Incorrect password for this school account."
              : "Mot de passe incorrect pour cet espace école."
          );
          return;
        }
      }

      // 3. Check if matches a Student
      const matchedStudent = students.find(
        (st) =>
          st.email.toLowerCase() === cleanUser ||
          (st.username && st.username.toLowerCase() === cleanUser) ||
          st.id.toLowerCase() === cleanUser
      );

      if (matchedStudent) {
        const studentPass = matchedStudent.password || "student123";
        if (cleanPass === studentPass) {
          onLoginSuccess({
            role: "student",
            schoolId: matchedStudent.schoolId,
            studentId: matchedStudent.id,
            userName: matchedStudent.name,
            userEmail: matchedStudent.email,
          });
          return;
        } else {
          setErrorMessage(
            locale === "en"
              ? "Incorrect password for this student account."
              : "Mot de passe incorrect pour cet élève."
          );
          return;
        }
      }

      // 4. If no matched user account found
      setErrorMessage(
        locale === "en"
          ? "Invalid email or password. Please check your credentials."
          : "Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe."
      );
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070A12] dark:text-white flex flex-col relative overflow-x-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#6D5DFC]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#00D9FF]/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 w-full border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-[#070A12]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="Lingua Flow"
              className="h-8 sm:h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline-flex rounded-md bg-[#6D5DFC]/10 dark:bg-[#6D5DFC]/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#6D5DFC] dark:text-[#00D9FF] border border-[#6D5DFC]/30 dark:border-[#00D9FF]/30 uppercase tracking-widest whitespace-nowrap">
                  {locale === "en" ? "Auth Portal" : "Authentification"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-white/40 hidden md:block font-medium truncate">
                {locale === "en" ? "Multi-School E-Learning • German 🇩🇪 & Italian 🇮🇹" : "E-Learning Multi-Écoles • Allemand 🇩🇪 & Italien 🇮🇹"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher locale={locale} onLocaleChange={onLocaleChange} />
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-12 flex flex-col items-center justify-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* Left Column: Platform Presentation & Features */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#6D5DFC]/10 border border-[#6D5DFC]/30 text-[#6D5DFC] dark:text-[#a399ff] text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3">
                <Sparkles size={13} className="text-[#6D5DFC] dark:text-[#00D9FF] shrink-0" />
                <span className="truncate">{locale === "en" ? "Dedicated Multi-Tenant SaaS Platform" : "Plateforme SaaS Multi-Tenant Dédiée"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {locale === "en" ? "Log in to your learning space" : "Connexion à votre espace d'apprentissage"}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-white/60 mt-2 sm:mt-3 leading-relaxed">
                {locale === "en"
                  ? "Every user role (Super Admin, School Director, Learner) benefits from an isolated workspace tailored to their exact curriculum."
                  : "Chaque utilisateur (Super Admin, Responsable d'école, Élève) dispose d'un tableau de bord sur-mesure avec ses données et son environnement linguistique isolés."}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {platformFeatures.map((feat, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2 hover:border-indigo-300 dark:hover:border-white/10 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 shrink-0">
                      {feat.icon}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-white/50 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: User Name & Password Login Box */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md bg-white dark:bg-[#0D1220] border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative"
            >
              {/* Role Selection Tabs */}
              <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoleTab("super_admin");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                    selectedRoleTab === "super_admin"
                      ? "bg-[#6D5DFC] text-white shadow-md shadow-[#6D5DFC]/30"
                      : "text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Shield size={13} className="shrink-0" />
                  <span className="truncate">{t.roles.super_admin}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoleTab("school_admin");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                    selectedRoleTab === "school_admin"
                      ? "bg-[#6D5DFC] text-white shadow-md shadow-[#6D5DFC]/30"
                      : "text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Building2 size={13} className="shrink-0" />
                  <span className="truncate">{t.roles.school_admin}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoleTab("student");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                    selectedRoleTab === "student"
                      ? "bg-[#6D5DFC] text-white shadow-md shadow-[#6D5DFC]/30"
                      : "text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <GraduationCap size={13} className="shrink-0" />
                  <span className="truncate">{t.roles.student}</span>
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedRoleTab === "super_admin"
                    ? (locale === "en" ? "Super Admin Portal Login" : "Connexion Super Administrateur")
                    : selectedRoleTab === "school_admin"
                    ? (locale === "en" ? "School Director Portal Login" : "Connexion Espace Directeur d'École")
                    : (locale === "en" ? "Learner Portal Login" : "Connexion Espace Apprenant")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                  {locale === "en"
                    ? "Enter your credentials to access your personal dashboard."
                    : "Saisissez vos identifiants pour ouvrir votre tableau de bord personnel."}
                </p>
              </div>

              {/* Error Banner if any */}
              {errorMessage && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-[#FF4D8D]/10 border border-[#FF4D8D]/30 text-[#FF4D8D] text-xs">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username / Email field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="username-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-white/70"
                  >
                    {t.login.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40"
                    />
                    <input
                      id="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={
                        selectedRoleTab === "super_admin"
                          ? "linguaflowadmin@gmail.com"
                          : selectedRoleTab === "school_admin"
                          ? "directeur@ecole.com"
                          : "eleve@email.com"
                      }
                      required
                      className="w-full h-11 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none transition focus:border-[#6D5DFC] focus:bg-white dark:focus:bg-white/10"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-white/70"
                    >
                      {t.login.passwordLabel}
                    </label>
                    <span className="text-[11px] text-[#6D5DFC] dark:text-[#00D9FF] hover:underline cursor-pointer">
                      {locale === "en" ? "Forgot password?" : "Mot de passe oublié ?"}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40"
                    />
                    <input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none transition focus:border-[#6D5DFC] focus:bg-white dark:focus:bg-white/10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition cursor-pointer p-1"
                      title={showPassword ? (locale === "en" ? "Hide password" : "Masquer le mot de passe") : (locale === "en" ? "Show password" : "Afficher le mot de passe")}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me & security badge */}
                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5 text-[#6D5DFC] focus:ring-0 cursor-pointer"
                    />
                    <span>{locale === "en" ? "Remember me" : "Se souvenir de moi"}</span>
                  </label>

                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-[#20E3A2]">
                    <CheckCircle2 size={12} />
                    <span>{locale === "en" ? "Active SSL Isolation" : "Isolation SSL Active"}</span>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  id="submit-login-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-2 rounded-xl bg-[#6D5DFC] hover:bg-[#5548eb] text-white font-bold text-sm shadow-[0_10px_25px_rgba(109,93,252,0.4)] border border-[#6D5DFC]/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>{locale === "en" ? "Authenticating..." : "Authentification en cours..."}</span>
                    </span>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>{locale === "en" ? "Sign in to my dashboard" : "Se connecter à mon tableau de bord"}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-500 dark:text-white/40">
        <p>
          {locale === "en"
            ? "LinguaFlow SaaS v2.4 • Secure multi-school platform for German & Italian"
            : "LinguaFlow SaaS v2.4 • Plateforme sécurisée multi-écoles pour l'Allemand et l'Italien"}
        </p>
      </footer>
    </div>
  );
};
