import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Link as LinkIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  Play,
  FileVideo,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";

export type VideoSourceType = "file" | "url";

export interface VideoMetadata {
  sourceType: VideoSourceType;
  fileName?: string;
  fileSizeFormatted?: string;
  durationSeconds?: number;
  mimeType?: string;
  isStreamReady: boolean;
}

interface VideoSourceSelectorProps {
  value: string;
  onChange: (url: string, metadata?: VideoMetadata) => void;
  watermarkText?: string;
  placeholderUrl?: string;
  className?: string;
}

export const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  value,
  onChange,
  watermarkText = "LinguaFlow Protected",
  placeholderUrl = "https://assets.mixkit.co/videos/preview/mixkit-online-learning-concept-42023-large.mp4",
  className = "",
}) => {
  const [sourceType, setSourceType] = useState<VideoSourceType>(
    value.startsWith("blob:") || value.startsWith("data:") ? "file" : "url"
  );
  const [urlInput, setUrlInput] = useState<string>(
    value.startsWith("blob:") ? "" : value
  );
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewActive, setPreviewActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && !value.startsWith("blob:")) {
      setUrlInput(value);
    }
  }, [value]);

  // Sanitize and check URL pattern
  const validateAndApplyUrl = (input: string) => {
    setValidationError(null);
    const cleanUrl = input.trim();
    if (!cleanUrl) {
      onChange("", { sourceType: "url", isStreamReady: false });
      return;
    }

    try {
      const parsed = new URL(cleanUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        setValidationError("L'URL doit commencer par https:// ou http://");
        return;
      }

      // Valid URL
      onChange(cleanUrl, {
        sourceType: "url",
        isStreamReady: true,
      });
    } catch (e) {
      setValidationError("Veuillez saisir une URL valide (ex: https://...)");
    }
  };

  const handleFile = (file: File) => {
    setValidationError(null);
    // Accepted video mime types
    const validMime = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-matroska"];
    if (!validMime.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|mkv|ogg)$/i)) {
      setValidationError("Format invalide. Formats acceptés : MP4, WebM, MOV, MKV.");
      return;
    }

    // Size limit: 800MB
    const maxSize = 800 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError("La vidéo dépasse la limite de 800 Mo autorisée pour l'hébergement.");
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileName(file.name);
    setFileSize(`${sizeInMb} Mo`);

    const localUrl = URL.createObjectURL(file);
    onChange(localUrl, {
      sourceType: "file",
      fileName: file.name,
      fileSizeFormatted: `${sizeInMb} Mo`,
      mimeType: file.type || "video/mp4",
      isStreamReady: true,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Helper for Youtube embed
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  };

  const embedUrl = value ? getEmbedUrl(value) : null;

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Source Selection Tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setSourceType("url");
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition min-h-[40px] cursor-pointer ${
            sourceType === "url"
              ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-xs"
              : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <LinkIcon size={15} />
          <span>Lien Vidéo / Streaming (URL)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSourceType("file");
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition min-h-[40px] cursor-pointer ${
            sourceType === "file"
              ? "bg-white dark:bg-[#0D1220] text-slate-900 dark:text-white shadow-xs"
              : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Upload size={15} />
          <span>Fichier Vidéo Local</span>
        </button>
      </div>

      {/* URL Input Form */}
      {sourceType === "url" && (
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Video size={16} />
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                validateAndApplyUrl(e.target.value);
              }}
              placeholder="https://vimeo.com/... ou https://cdn.example.com/lesson-1.mp4"
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D9FF] transition"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => {
                  setUrlInput("");
                  validateAndApplyUrl("");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-500 cursor-pointer"
                aria-label="Effacer le lien"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1">
            <span>Sources compatibles : MP4 direct, Vimeo, YouTube, HLS, Cloudflare Stream</span>
            <button
              type="button"
              onClick={() => {
                setUrlInput(placeholderUrl);
                validateAndApplyUrl(placeholderUrl);
              }}
              className="text-[#00D9FF] hover:underline font-semibold cursor-pointer"
            >
              Insérer un exemple HD
            </button>
          </div>
        </div>
      )}

      {/* File Upload Drop Area */}
      {sourceType === "file" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 min-h-[140px] ${
              dragActive
                ? "border-[#00D9FF] bg-[#00D9FF]/5"
                : "border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/[0.02]"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#6D5DFC]/10 text-[#6D5DFC] dark:text-[#a399ff] flex items-center justify-center">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {fileName ? `Fichier prêt : ${fileName} (${fileSize})` : "Glissez votre vidéo ici ou cliquez pour parcourir"}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-white/40 mt-0.5">
                Formats acceptés : MP4, WebM, MOV (Max 800 Mo)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {validationError && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Watermark & Security Notice */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#20E3A2]/10 border border-[#20E3A2]/20 text-[11px] text-slate-700 dark:text-emerald-300 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#20E3A2] shrink-0" />
          <span>Protection anti-piratage active : Filigrane dynamique incrusté pour les apprenants.</span>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => setPreviewActive(!previewActive)}
            className="font-bold text-[#00D9FF] hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
          >
            <Play size={12} />
            <span>{previewActive ? "Masquer aperçu" : "Tester le lecteur"}</span>
          </button>
        )}
      </div>

      {/* Live Video Preview with Dynamic Watermark Simulator */}
      {previewActive && value && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-200 dark:border-white/10 shadow-lg">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Aperçu vidéo"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={value}
              controls
              className="w-full h-full object-contain"
              playsInline
            />
          )}

          {/* Watermark Overlay Simulator */}
          <div className="absolute top-3 right-3 pointer-events-none px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white/80 text-[10px] font-mono select-none">
            🔒 {watermarkText} • AUTH-SECURE-2026
          </div>
        </div>
      )}
    </div>
  );
};
