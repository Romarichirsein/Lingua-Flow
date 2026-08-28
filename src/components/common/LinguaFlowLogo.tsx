import React from "react";

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
  const iconDimensions = {
    sm: "h-8 sm:h-9 w-auto",
    md: "h-9 sm:h-11 w-auto",
    lg: "h-14 sm:h-16 w-auto",
    xl: "h-20 sm:h-28 w-auto",
  };

  return (
    <div
      className={`flex select-none ${
        centered ? "flex-col items-center justify-center text-center gap-2" : "items-center gap-2.5"
      } ${className}`}
    >
      {/* Custom Uploaded Logo Image */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Lingua Flow"
          className={`${iconDimensions[size]} object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]`}
        />
      </div>

      {/* Optional Badge & Subtitle */}
      {(showBadge || subtitle) && (
        <div className={`flex flex-col ${centered ? "items-center justify-center text-center" : ""}`}>
          {showBadge && (
            <span className="rounded-md bg-[#6D5DFC]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#00D9FF] border border-[#00D9FF]/40 uppercase tracking-widest shadow-sm">
              {badgeText}
            </span>
          )}
          {subtitle && (
            <p className="text-xs text-white/70 font-medium tracking-wide mt-1 text-center">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
