import type { Variants } from "motion/react";

// Helper to check if the user prefers reduced motion (safely checked in browser)
export const isReducedMotion = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
    },
  },
};

export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

export const modalAnimation: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 340,
      damping: 28,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: {
      duration: 0.18,
    },
  },
};

/**
 * Framer Motion variant for module unlocking.
 * Combined scale and opacity fade-in (0.95 to 1 scale).
 * Checks prefers-reduced-motion to disable scaling/animations for accessibility.
 */
export const unlockedModule: Variants = {
  hidden: {
    opacity: 0,
    scale: isReducedMotion() ? 1 : 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: isReducedMotion()
      ? { duration: 0 }
      : {
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1] as const,
        },
  },
  exit: {
    opacity: 0,
    scale: isReducedMotion() ? 1 : 0.98,
    transition: {
      duration: isReducedMotion() ? 0 : 0.2,
    },
  },
};

/**
 * Framer Motion variant for quiz completion success feedback.
 * Includes a spring-based bounce effect.
 * Checks prefers-reduced-motion to disable bounce animations for accessibility.
 */
export const quizSuccess: Variants = {
  hidden: {
    opacity: 0,
    scale: isReducedMotion() ? 1 : 0.8,
    y: isReducedMotion() ? 0 : 15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: isReducedMotion()
      ? { duration: 0 }
      : {
          type: "spring" as const,
          stiffness: 450,
          damping: 18,
          bounce: 0.4,
          mass: 0.8,
        },
  },
  pulse: {
    scale: isReducedMotion() ? 1 : [1, 1.06, 1],
    transition: isReducedMotion()
      ? { duration: 0 }
      : {
          duration: 0.6,
          repeat: 2,
          ease: "easeInOut" as const,
        },
  },
};

/**
 * Framer Motion variant for smooth visual unlocking of lessons.
 * Provides a gentle fade-in with a scale pop effect and shimmer.
 * Respects prefers-reduced-motion.
 */
export const lessonUnlockVariant: Variants = {
  locked: {
    opacity: 0.65,
    scale: 0.97,
    filter: "grayscale(70%)",
  },
  unlocked: {
    opacity: 1,
    scale: [0.97, 1.03, 1],
    filter: "grayscale(0%)",
    transition: {
      duration: 0.55,
      ease: [0.175, 0.885, 0.32, 1.275] as const,
    },
  },
  unlockedReduced: {
    opacity: 1,
    scale: 1,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Framer Motion variant for quiz completion success celebrations.
 * Produces an energetic pulse and badge pop.
 */
export const quizSuccessCelebration: Variants = {
  initial: {
    opacity: 0,
    scale: 0.85,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 22,
      mass: 0.8,
    },
  },
  pulseGlow: {
    boxShadow: [
      "0 0 0px rgba(16, 185, 129, 0)",
      "0 0 30px rgba(16, 185, 129, 0.45)",
      "0 0 10px rgba(16, 185, 129, 0.2)",
    ],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/**
 * Score Badge Pop animation for quiz score display.
 */
export const scoreBadgePop: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 25,
      delay: 0.15,
    },
  },
};

/**
 * Confetti particles or star celebration pop variant.
 */
export const celebrationParticle: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
    y: 0,
  },
  animate: (i: number = 0) => ({
    opacity: [0, 1, 1, 0],
    scale: [0, 1.2, 1, 0.6],
    y: [-10, -35 - (i * 8), -50],
    x: [(i % 2 === 0 ? -1 : 1) * (15 + i * 10)],
    transition: {
      duration: 0.85,
      delay: i * 0.08,
      ease: "easeOut" as const,
    },
  }),
};

