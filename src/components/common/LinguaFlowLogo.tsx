import React from "react";
import logoImg from "../../assets/logo.png";

export interface LinguaFlowLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  textColor?: "default" | "white" | "dark";
  centered?: boolean;
  subtitle?: string;
}

export const LinguaFlowLogo: React.FC<LinguaFlowLogoProps> = ({
  size = "md",
  showBadge = true,
  badgeText = "SaaS B2B",
  className = "",
  centered = false,
  subtitle,
}) => {
  const logoDimensions = {
    sm: "h-8 sm:h-9 max-w-[140px]",
    md: "h-9 sm:h-11 max-w-[170px]",
    lg: "h-14 sm:h-16 max-w-[240px]",
    xl: "h-24 sm:h-28 max-w-[320px]",
  };

  return (
    <div
      className={`flex select-none ${
        centered ? "flex-col items-center justify-center text-center gap-2" : "items-center gap-2.5"
      } ${className}`}
    >
      <div className="relative inline-flex items-center justify-center">
        {/* Subtle ambient lighting effect for dark themes */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6D5DFC]/30 to-[#00D9FF]/30 blur-xl opacity-60 pointer-events-none"
          aria-hidden="true"
        />

        {/* Official Lingua Flow Brand Logo */}
        <img
          src={logoImg}
          alt="Lingua Flow"
          className={`relative z-10 ${logoDimensions[size]} object-contain drop-shadow-[0_2px_12px_rgba(0,217,255,0.25)]`}
        />
      </div>

      {/* SaaS Badge if enabled */}
      {showBadge && (
        <span className="rounded-full bg-[#6D5DFC]/20 px-2.5 py-0.5 text-[10px] font-extrabold text-[#00D9FF] border border-[#00D9FF]/40 uppercase tracking-wider shadow-sm shrink-0">
          {badgeText}
        </span>
      )}

      {subtitle && (
        <p className="text-xs text-white/70 font-medium tracking-wide mt-1 text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
};

