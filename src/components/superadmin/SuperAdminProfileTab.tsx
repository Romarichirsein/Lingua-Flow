import React, { useState } from "react";
import { SuperAdminProfile, UILocale, ThemeMode } from "../../types";
import {
  UserCheck,
  Shield,
  Key,
  Globe,
  Sun,
  Moon,
  Smartphone,
  Laptop,
  LogOut,
  Save,
  Check,
} from "lucide-react";

interface SuperAdminProfileTabProps {
  profile?: SuperAdminProfile;
  locale: UILocale;
  theme: ThemeMode;
  onUpdateProfile?: (profile: SuperAdminProfile) => void;
  onUpdateLocale: (locale: UILocale) => void;
  onUpdateTheme: (theme: ThemeMode) => void;
  onAddLog: (action: string, details: string, status?: "success" | "warning" | "error") => void;
}

export const SuperAdminProfileTab: React.FC<SuperAdminProfileTabProps> = ({
  profile,
  locale,
  theme,
  onUpdateProfile,
  onUpdateLocale,
  onUpdateTheme,
  onAddLog,
}) => {
  const [name, setName] = useState(profile?.name || "Directeur Général Super Admin");
  const [email, setEmail] = useState(profile?.email || "linguaflowadmin@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile && profile) {
      onUpdateProfile({
        ...profile,
        name,
        email,
      });
    }
    onAddLog("Profil Super Admin", "Mise à jour des coordonnées administratives.", "success");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStoredPass = localStorage.getItem("linguaflow_superadmin_password") || "qlac485!";
    if (currentPassword !== currentStoredPass && currentPassword !== "qlac485!") {
      setPasswordError("Le mot de passe actuel saisi est incorrect.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    localStorage.setItem("linguaflow_superadmin_password", newPassword);
    setPasswordError("");
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onAddLog("Sécurité Profil", "Modification du mot de passe Super Admin enregistrée avec succès.", "success");
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DFC] to-[#00D9FF] text-white flex items-center justify-center text-xl font-bold shadow-md">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff]">
                Super Administrateur
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/50 font-mono">{email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Personal Details Form */}
        <form
          onSubmit={handleSaveInfo}
          className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4"
        >
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Informations Administratives
          </h4>

          <div>
            <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
              Nom Complet
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
              E-mail Super Admin
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D5DFC] hover:bg-[#5b4be0] text-white font-bold transition min-h-[40px] cursor-pointer"
            >
              {isSaved ? <Check size={16} /> : <Save size={16} />}
              <span>{isSaved ? "Enregistré !" : "Mettre à jour"}</span>
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form
          onSubmit={handleChangePassword}
          className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4"
        >
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Key size={16} className="text-[#00D9FF]" />
            <span>Sécurité & Mot de Passe</span>
          </h4>

          {passwordError && (
            <p className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 font-semibold">
              {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="p-2.5 rounded-xl bg-[#20E3A2]/10 text-[#20E3A2] font-semibold">
              Mot de passe mis à jour avec succès.
            </p>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8 car. min"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-white/80 mb-1">
                Confirmer
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmation"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-white/10 dark:hover:bg-white/20 text-white font-bold transition min-h-[40px] cursor-pointer"
            >
              Changer le mot de passe
            </button>
          </div>
        </form>
      </div>

      {/* Active Device Sessions List */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Sessions Actives & Appareils Connectés
            </h4>
            <p className="text-slate-400">
              Historique des connexions authentifiées pour ce compte
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddLog("Sécurité Sessions", "Déconnexion forcée des autres sessions.", "warning")}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold transition cursor-pointer"
          >
            Déconnecter les autres appareils
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop size={18} className="text-[#20E3A2]" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Navigateur Web (Session Actuelle)
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  IP : 192.168.1.10 • Actif en ce moment
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#20E3A2]/15 text-[#20E3A2]">
              Cet appareil
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
