import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LinguaFlowLogo } from "./LinguaFlowLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [statusMessage, setStatusMessage] = useState(
    "Initialisation de l'écosystème LinguaFlow SaaS..."
  );

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(42);
      setStatusMessage("Chargement des environnements multi-écoles (Allemand 🇩🇪 & Italien 🇮🇹)...");
    }, 500);

    const timer2 = setTimeout(() => {
      setProgress(78);
      setStatusMessage("Vérification des quotas SaaS, licences et règles d'isolation...");
    }, 1100);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage("Environnement prêt ! Redirection vers votre espace...");
    }, 1700);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Generate 12 dots arranged mathematically along a circle for the circular neon loading animation
  const totalDots = 12;
  const radius = 54; // radius in px

  return (
    <motion.div
      id="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A12] text-white px-4 select-none overflow-hidden h-screen h-[100dvh] min-h-[100dvh] w-screen w-full"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#6D5DFC]/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#00D9FF]/20 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center text-center max-w-md w-full mx-auto my-auto"
      >
        {/* Central Logo in Hero Size with pure white text and perfect centering */}
        <div className="relative mb-5 flex flex-col items-center justify-center w-full text-center">
          <LinguaFlowLogo
            size="xl"
            showText={true}
            showBadge={true}
            badgeText="SaaS B2B"
            textColor="white"
            centered={true}
            className="w-full justify-center items-center text-center"
          />
          <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mt-2.5 max-w-xs text-center mx-auto">
            Plateforme E-Learning Multi-Écoles (Allemand & Italien)
          </p>
        </div>

        {/* Circular Neon-Animated Indicator with Orbiting Dots */}
        <div className="relative my-6 flex items-center justify-center w-36 h-36">
          {/* Central subtle pulsing core */}
          <motion.div
            animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6D5DFC]/40 via-[#00D9FF]/30 to-[#20E3A2]/40 blur-md"
          />

          {/* Rotating ambient ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-white/5"
          />

          {/* Orbiting dots arranged geometrically along the circle */}
          {Array.from({ length: totalDots }).map((_, index) => {
            const angle = (index / totalDots) * (2 * Math.PI) - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const delay = (index / totalDots) * 1.2;

            return (
              <motion.div
                key={index}
                className="absolute rounded-full"
                style={{
                  width: index % 2 === 0 ? "10px" : "7px",
                  height: index % 2 === 0 ? "10px" : "7px",
                  transform: `translate(${x}px, ${y}px)`,
                  backgroundColor: index % 2 === 0 ? "#00D9FF" : "#6D5DFC",
                }}
                animate={{
                  scale: [0.4, 1.4, 0.4],
                  opacity: [0.2, 1, 0.2],
                  boxShadow: [
                    "0 0 2px rgba(0,217,255,0.2)",
                    "0 0 14px rgba(0,217,255,0.9)",
                    "0 0 2px rgba(0,217,255,0.2)",
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-white/60">
            <span className="truncate pr-2">{statusMessage}</span>
            <span className="text-[#00D9FF] font-bold">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#6D5DFC] via-[#00D9FF] to-[#20E3A2] rounded-full shadow-[0_0_12px_rgba(0,217,255,0.8)]"
              initial={{ width: "10%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Fast skip button */}
        <button
          id="skip-splash-btn"
          type="button"
          onClick={onComplete}
          className="mt-6 flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition cursor-pointer py-1 px-3 rounded-lg hover:bg-white/5"
        >
          <span>Accéder directement à l'application</span>
          <ArrowRight size={13} />
        </button>
      </motion.div>
    </motion.div>
  );
};
