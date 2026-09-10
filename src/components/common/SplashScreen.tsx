import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck, Check } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: "Initialisation du noyau LinguaFlow SaaS",
      sub: "Chargement du moteur applicatif et des configurations sécurisées",
    },
    {
      title: "Curriculums CECRL Allemand 🇩🇪 & Italien 🇮🇹",
      sub: "Vérification des référentiels officiels de niveau A1 à C2",
    },
    {
      title: "Cloisonnement & Isolation Multi-Écoles",
      sub: "Activation du chiffrement des sessions et règles de protection",
    },
    {
      title: "Moteur d'Examen & Certification Prüfung",
      sub: "Prêt pour les simulations : Sprechen, Hören, Schreiben, Lesen",
    },
    {
      title: "Environnement prêt • Bienvenue",
      sub: "Ouverture de votre espace de travail personnalisé",
    },
  ];

  useEffect(() => {
    const duration = 10000; // exactly 10 seconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentPct);

      // Determine step based on percentage (0-100 divided into 5 steps)
      const stepIdx = Math.min(steps.length - 1, Math.floor(currentPct / 20));
      setCurrentStepIndex(stepIdx);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  // Geometry calculations for the SVG circular loader
  const size = 300;
  const strokeWidth = 5;
  const radius = 126;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Calculate coordinates for the glowing comet tip
  const angleInDegrees = (progress / 100) * 360 - 90;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const cometX = center + radius * Math.cos(angleInRadians);
  const cometY = center + radius * Math.sin(angleInRadians);

  const secondsRemaining = Math.max(0, Math.ceil((10000 - (progress / 100) * 10000) / 1000));

  return (
    <motion.div
      id="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black text-white px-4 py-8 select-none overflow-hidden h-screen h-[100dvh] min-h-[100dvh] w-screen w-full"
    >
      {/* Background ambient lighting - Deep luxury black with minimal cosmic aura */}
      <div className="absolute inset-0 bg-[#000000]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#6D5DFC]/10 via-[#00D9FF]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Top Header info */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/50 uppercase">
            LinguaFlow Core v2.4
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
          <ShieldCheck size={14} className="text-[#00D9FF]" />
          <span className="hidden sm:inline">Secure SaaS Gateway</span>
          <span className="text-white/60">•</span>
          <span className="text-[#00D9FF] font-bold">{secondsRemaining}s</span>
        </div>
      </div>

      {/* Center: Modern Circular Loader with Central Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md">
        {/* Circular Orbital Loader Container */}
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          {/* SVG Orbit Tracks & Progress Stroke */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0 pointer-events-none"
          >
            <defs>
              {/* High-tech gradient for the progress line */}
              <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6D5DFC" />
                <stop offset="50%" stopColor="#00D9FF" />
                <stop offset="100%" stopColor="#20E3A2" />
              </linearGradient>

              {/* Intense laser glow filter */}
              <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Layer 1: Outermost subtle radar perimeter with micro ticks */}
            <circle
              cx={center}
              cy={center}
              r={radius + 16}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
              strokeDasharray="2 8"
            />

            {/* Layer 2: Slow counter-clockwise rotating technical dashed ring */}
            <g
              style={{
                transformOrigin: "center",
                animation: "spin 25s linear infinite reverse",
              }}
            >
              <circle
                cx={center}
                cy={center}
                r={radius + 8}
                fill="none"
                stroke="rgba(109, 93, 252, 0.18)"
                strokeWidth="1.5"
                strokeDasharray="16 40 8 40"
              />
            </g>

            {/* Layer 3: Passive background groove */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth={strokeWidth}
            />

            {/* Layer 4: ACTIVE SMOOTH CIRCULAR PROGRESS (fills across 10 seconds) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#orbit-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              filter="url(#laser-glow)"
              style={{ transition: "stroke-dashoffset 40ms linear" }}
            />

            {/* Layer 5: Inner subtle aperture border */}
            <circle
              cx={center}
              cy={center}
              r={radius - 14}
              fill="none"
              stroke="rgba(0, 217, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Layer 6: Leading Photon / Comet Tip */}
            {progress > 0 && progress < 100 && (
              <g>
                <circle
                  cx={cometX}
                  cy={cometY}
                  r="7"
                  fill="#00D9FF"
                  filter="url(#laser-glow)"
                  opacity="0.9"
                />
                <circle
                  cx={cometX}
                  cy={cometY}
                  r="3"
                  fill="#ffffff"
                />
              </g>
            )}
          </svg>

          {/* Central Core with Floating Logo */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-[#030509] border border-white/10 flex flex-col items-center justify-center p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_0_40px_rgba(109,93,252,0.15)] overflow-hidden">
            {/* Subtle inner ambient pulse */}
            <motion.div
              animate={{
                scale: [0.95, 1.05, 0.95],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6D5DFC]/20 to-[#00D9FF]/20 blur-xl pointer-events-none"
            />

            {/* Logo image centered with breathing animation */}
            <motion.div
              animate={{
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 flex flex-col items-center justify-center"
            >
              <img
                src="/logo.png"
                alt="LinguaFlow Logo"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,217,255,0.45)]"
              />
            </motion.div>

            {/* Micro badge under logo */}
            <div className="relative z-20 mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              <Sparkles size={10} className="text-[#00D9FF]" />
              <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase">
                SaaS B2B
              </span>
            </div>
          </div>
        </div>

        {/* Numeric Live Progress Indicator */}
        <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#00D9FF]">
              {Math.floor(progress)}
            </span>
            <span className="text-sm font-bold text-[#00D9FF]">%</span>
          </div>

          {/* Dynamic 5-step milestone indicators */}
          <div className="flex items-center gap-1.5 pt-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx < currentStepIndex
                    ? "w-6 bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF]"
                    : idx === currentStepIndex
                    ? "w-8 bg-[#00D9FF] shadow-[0_0_8px_rgba(0,217,255,0.8)] animate-pulse"
                    : "w-2 bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Current Status Message with smooth fade animation */}
          <div className="h-14 flex flex-col items-center justify-center px-4 max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                  {steps[currentStepIndex].title}
                </p>
                <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">
                  {steps[currentStepIndex].sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer controls: Fast Access button if needed */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center gap-2">
        <button
          id="skip-splash-btn"
          type="button"
          onClick={onComplete}
          className="group inline-flex items-center gap-2 text-[11px] font-medium text-white/40 hover:text-white transition-all py-1.5 px-4 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 cursor-pointer backdrop-blur-sm"
        >
          <span>Accéder directement ({secondsRemaining}s)</span>
          <ArrowRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5 text-[#00D9FF]"
          />
        </button>

        <p className="text-[10px] font-mono text-white/30 text-center">
          Plateforme E-Learning Multi-Écoles • Allemand & Italien
        </p>
      </div>

      {/* Global CSS rotation utility for orbital rings */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};
