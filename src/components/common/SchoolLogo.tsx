import React, { useState } from "react";

export interface SchoolLogoProps {
  logo?: string | null;
  name?: string;
  language?: "german" | "italian" | string;
  fallbackEmoji?: string;
  className?: string;
  imgClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  xs: "w-6 h-6 text-sm rounded-lg",
  sm: "w-8 h-8 text-base rounded-xl",
  md: "w-10 h-10 text-xl rounded-xl",
  lg: "w-12 h-12 text-2xl rounded-2xl",
  xl: "w-16 h-16 text-3xl rounded-2xl",
};

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  logo,
  name,
  language,
  fallbackEmoji,
  className = "",
  imgClassName = "",
  size = "md",
}) => {
  const [imgError, setImgError] = useState(false);

  const fallback =
    fallbackEmoji ||
    (language === "german" ? "🇩🇪" : language === "italian" ? "🇮🇹" : "🏫");

  const isImage =
    Boolean(logo) &&
    !imgError &&
    (logo!.startsWith("data:image/") ||
      logo!.startsWith("http://") ||
      logo!.startsWith("https://") ||
      logo!.startsWith("/") ||
      logo!.startsWith("blob:"));

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden shrink-0 select-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 ${sizeClass} ${className}`}
      title={name}
    >
      {isImage ? (
        <img
          src={logo!}
          alt={name ? `Logo ${name}` : "School Logo"}
          className={`w-full h-full object-contain p-1 ${imgClassName}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="leading-none flex items-center justify-center">
          {logo && logo.length <= 6 ? logo : fallback}
        </span>
      )}
    </div>
  );
};
