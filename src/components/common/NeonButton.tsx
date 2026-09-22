import React, { ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";

type NeonButtonVariant = "primary" | "cyan" | "emerald" | "danger" | "ghost" | "green" | "success" | "secondary";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: NeonButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}) => {
  const variantStyles: Record<string, string> = {
    primary:
      "bg-[#6D5DFC] hover:bg-[#5548eb] text-white shadow-[0_10px_25px_rgba(109,93,252,0.4)] border border-[#6D5DFC]/40",
    cyan: "bg-[#00D9FF] hover:bg-[#00c2e6] text-[#070A12] font-semibold shadow-[0_0_20px_rgba(0,217,252,0.25)] border border-[#00D9FF]/40",
    emerald:
      "bg-[#20E3A2] hover:bg-[#1bc78e] text-[#070A12] font-semibold shadow-[0_0_20px_rgba(32,227,162,0.3)] border border-[#20E3A2]/40",
    green:
      "bg-[#20E3A2] hover:bg-[#1bc78e] text-[#070A12] font-semibold shadow-[0_0_20px_rgba(32,227,162,0.3)] border border-[#20E3A2]/40",
    success:
      "bg-[#20E3A2] hover:bg-[#1bc78e] text-[#070A12] font-semibold shadow-[0_0_20px_rgba(32,227,162,0.3)] border border-[#20E3A2]/40",
    danger:
      "bg-[#FF4D8D] hover:bg-[#e63c78] text-white shadow-[0_0_20px_rgba(255,77,141,0.35)] border border-[#FF4D8D]/40",
    ghost:
      "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/80 border border-white/10",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border border-slate-200 dark:border-white/10",
  };

  const resolvedVariantStyle = variantStyles[variant] || variantStyles.primary;

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold",
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-medium transition-colors overflow-hidden ${
        resolvedVariantStyle
      } ${sizeStyles[size]} ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"
      } ${className}`}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.button>
  );
};
