import React from "react";
import { motion } from "motion/react";

interface ProgressBarProps {
  value?: number;
  progress?: number; // alias for value
  max?: number;
  color?: "cyan" | "violet" | "emerald" | "amber" | "rose" | "primary" | "indigo" | "blue" | "green";
  showLabel?: boolean;
  height?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg"; // alias for height
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  progress,
  max = 100,
  color = "cyan",
  showLabel = false,
  height,
  size = "md",
}) => {
  const effectiveValue = value !== undefined ? value : progress !== undefined ? progress : 0;
  const effectiveHeight = height || size || "md";
  const safeValue = typeof effectiveValue === "number" && !isNaN(effectiveValue) ? effectiveValue : 0;
  const safeMax = typeof max === "number" && !isNaN(max) && max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, Math.round((safeValue / safeMax) * 100)));

  const colorGradients: Record<string, string> = {
    cyan: "from-[#00D9FF] to-blue-500 shadow-[0_0_8px_rgba(0,217,255,0.6)]",
    blue: "from-[#00D9FF] to-blue-500 shadow-[0_0_8px_rgba(0,217,255,0.6)]",
    violet: "from-[#6D5DFC] to-[#5548eb] shadow-[0_0_8px_rgba(109,93,252,0.6)]",
    primary: "from-[#6D5DFC] to-[#5548eb] shadow-[0_0_8px_rgba(109,93,252,0.6)]",
    indigo: "from-[#6D5DFC] to-[#5548eb] shadow-[0_0_8px_rgba(109,93,252,0.6)]",
    emerald: "from-[#20E3A2] to-emerald-600 shadow-[0_0_8px_rgba(32,227,162,0.6)]",
    green: "from-[#20E3A2] to-emerald-600 shadow-[0_0_8px_rgba(32,227,162,0.6)]",
    amber: "from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    rose: "from-[#FF4D8D] to-pink-600 shadow-[0_0_8px_rgba(255,77,141,0.6)]",
  };

  const resolvedGradient = colorGradients[color] || colorGradients.cyan;

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      <div className={`w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80 ${heightClasses[effectiveHeight]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${resolvedGradient}`}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{percentage}% terminé</span>
          <span>{safeValue} / {safeMax}</span>
        </div>
      )}
    </div>
  );
};
