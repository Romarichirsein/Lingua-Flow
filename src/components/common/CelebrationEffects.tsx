import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, CheckCircle2, Unlock, Trophy, ArrowRight } from "lucide-react";
import { NeonButton } from "./NeonButton";
import { unlockedModule, isReducedMotion } from "../../lib/motionVariants";

// Web Audio API Synthesizer for victory sounds
export const playCelebrationSound = (type: "lesson" | "module" | "quiz" = "lesson") => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "lesson") {
      // Pleasant rising arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.36);
      });
    } else if (type === "module") {
      // Grand victory chime
      const chords = [
        [523.25, 659.25, 783.99],
        [587.33, 739.99, 880.0],
        [659.25, 830.61, 987.77],
        [1046.5, 1318.5, 1567.98],
      ];
      chords.forEach((chord, i) => {
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
          gain.gain.setValueAtTime(0.01, ctx.currentTime + i * 0.14);
          gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.14 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.14);
          osc.stop(ctx.currentTime + i * 0.14 + 0.62);
        });
      });
    } else {
      // Short positive chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.26);
    }
  } catch (e) {
    // Gracefully ignore audio errors if blocked by browser policy
  }
};

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  shape: "circle" | "square" | "strip";
  duration: number;
  delay: number;
}

export const ConfettiShower: React.FC<{ active: boolean; durationMs?: number }> = ({
  active,
  durationMs = 3500,
}) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const colors = [
      "#6366f1",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#8b5cf6",
      "#3b82f6",
      "#22c55e",
      "#f43f5e",
    ];

    const generated: ConfettiPiece[] = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "square" : "strip",
      duration: 2.2 + Math.random() * 1.5,
      delay: Math.random() * 0.4,
    }));

    setPieces(generated);

    const timer = setTimeout(() => {
      setPieces([]);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [active, durationMs]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            opacity: 1,
            rotate: 0,
            scale: 0.8,
          }}
          animate={{
            top: ["0%", "105%"],
            left: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`],
            rotate: [0, p.rotation + 720],
            opacity: [1, 1, 0.9, 0],
            scale: [0.8, 1.2, 0.9],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: p.shape === "strip" ? p.size * 2 : p.size,
            height: p.shape === "strip" ? p.size / 2 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? "2px" : "3px",
            boxShadow: `0 0 8px ${p.color}80`,
          }}
        />
      ))}
    </div>
  );
};

// Module Unlocked Celebration Modal
interface ModuleUnlockedModalProps {
  isOpen: boolean;
  moduleTitle: string;
  moduleOrder: number;
  totalLessons: number;
  language: string;
  onClose: () => void;
  onContinue: () => void;
}

export const ModuleUnlockedModal: React.FC<ModuleUnlockedModalProps> = ({
  isOpen,
  moduleTitle,
  moduleOrder,
  totalLessons,
  language,
  onClose,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      playCelebrationSound("module");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <ConfettiShower active={isOpen} durationMs={4000} />

          {/* Modal Content */}
          <motion.div
            variants={unlockedModule}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-slate-900 via-[#0B0F19] to-slate-950 p-6 sm:p-8 text-center text-white shadow-2xl shadow-indigo-500/20"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />

            {/* Unlocking Icon Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [-30, 10, 0],
              }}
              transition={{ delay: 0.15, duration: 0.6, type: "spring" }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-400/20"
            >
              <Unlock size={38} className="text-white animate-bounce" />
            </motion.div>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                🎉 Nouveau Palier Atteint
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                +100 XP
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              Module {moduleOrder} Débloqué !
            </h2>
            <p className="text-sm font-semibold text-cyan-300 mb-4">
              « {moduleTitle} »
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
              Félicitations pour votre persévérance ! Vous venez de déverrouiller{" "}
              <strong>{totalLessons} nouvelles leçons immersives</strong> en{" "}
              {language === "german" ? "allemand" : "italien"}.
            </p>

            {/* Progress highlight card */}
            <div className="mb-6 rounded-2xl bg-white/5 p-4 border border-white/10 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                  Statut
                </span>
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1 mt-0.5 justify-center">
                  <CheckCircle2 size={13} /> Accessible
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                  Contenu
                </span>
                <span className="text-xs font-black text-white mt-0.5 block">
                  {totalLessons} Leçons & Quiz
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                  Objectif
                </span>
                <span className="text-xs font-black text-indigo-400 mt-0.5 block">
                  Maîtrise CECRL
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Fermer
              </button>
              <NeonButton
                variant="primary"
                size="md"
                onClick={() => {
                  onClose();
                  onContinue();
                }}
                icon={<ArrowRight size={16} />}
                className="w-full sm:w-auto shadow-lg shadow-indigo-500/30"
              >
                Explorer ce Module
              </NeonButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
