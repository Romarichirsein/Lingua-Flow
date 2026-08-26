import React, { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  X,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface VideoSourceInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export const VideoSourceInput: React.FC<VideoSourceInputProps> = ({
  value,
  onChange,
  label = "Source Vidéo de la Leçon",
  className = "",
}) => {
  // Mode: "upload" (from local device) or "url" (external link)
  const isBlobOrData = value.startsWith("blob:") || value.startsWith("data:");
  const [sourceMode, setSourceMode] = useState<"upload" | "url">(
    isBlobOrData ? "upload" : "url"
  );
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    isBlobOrData ? "Vidéo importée depuis l'appareil" : null
  );
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Octet";
    const k = 1024;
    const sizes = ["Octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processVideoFile(file);
    }
  };

  const processVideoFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Veuillez sélectionner un fichier vidéo valide (MP4, WebM, MOV, etc.).");
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    setPreviewError(false);
    onChange(blobUrl);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearVideo = () => {
    setFileName(null);
    setFileSize(null);
    setPreviewError(false);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Preset demo samples
  const presets = [
    {
      label: "Démo MP4 Allemand",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      label: "Démo MP4 Italien",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      label: "Démo Cloud Stream",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  ];

  const isYouTube =
    value.includes("youtube.com/watch") ||
    value.includes("youtu.be/") ||
    value.includes("youtube.com/embed");

  const getYouTubeEmbed = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-white/80">
          {label}
        </label>

        {/* Dual Mode Switcher (Upload from Device vs Web Link) */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/70 dark:bg-white/10 text-xs">
          <button
            type="button"
            onClick={() => setSourceMode("upload")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer select-none ${
              sourceMode === "upload"
                ? "bg-[#6D5DFC] text-white shadow-xs"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Upload size={13} />
            <span>Depuis l'appareil</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceMode("url")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer select-none ${
              sourceMode === "url"
                ? "bg-[#6D5DFC] text-white shadow-xs"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LinkIcon size={13} />
            <span>Lien Web / Stream</span>
          </button>
        </div>
      </div>

      {/* MODE 1: UPLOAD FROM DEVICE */}
      {sourceMode === "upload" && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!value || (!isBlobOrData && !fileName) ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                dragActive
                  ? "border-[#00D9FF] bg-[#00D9FF]/5"
                  : "border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/[0.02] hover:border-[#6D5DFC] hover:bg-[#6D5DFC]/5"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D5DFC] to-[#00D9FF] text-white flex items-center justify-center shadow-[0_0_15px_rgba(109,93,252,0.3)] mb-3">
                <Upload size={22} />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-white mb-1">
                Cliquez pour importer une vidéo depuis votre ordinateur ou appareil
              </p>
              <p className="text-[11px] text-slate-500 dark:text-white/50">
                Glissez-déposez votre fichier vidéo ici (MP4, WebM, MOV supportés)
              </p>
            </div>
          ) : (
            /* Selected Local Video State */
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <FileVideo size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {fileName || "Fichier vidéo local chargé"}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Prêt pour lecture • {fileSize || "Local Blob"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-white hover:bg-slate-100 transition cursor-pointer"
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  onClick={handleClearVideo}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer"
                  title="Supprimer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: WEB URL LINK */}
      {sourceMode === "url" && (
        <div className="space-y-3">
          <div className="relative flex items-center">
            <LinkIcon
              size={15}
              className="absolute left-3.5 text-slate-400 dark:text-white/40 pointer-events-none"
            />
            <input
              type="url"
              placeholder="https://domaine.com/video.mp4 ou lien YouTube..."
              value={isBlobOrData ? "" : value}
              onChange={(e) => {
                setFileName(null);
                setFileSize(null);
                setPreviewError(false);
                onChange(e.target.value);
              }}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-[#6D5DFC]"
            />
            {value && !isBlobOrData && (
              <button
                type="button"
                onClick={handleClearVideo}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                title="Effacer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
              Exemples rapides :
            </span>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setFileName(preset.label);
                  setFileSize("Cloud CDN");
                  onChange(preset.url);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-white/5 hover:bg-[#6D5DFC]/15 hover:text-[#6D5DFC] text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/10 transition cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LIVE VIDEO PREVIEW IN MODAL */}
      {value && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-white/50">
            <span className="flex items-center gap-1.5 text-[#00D9FF]">
              <Play size={12} /> Aperçu direct du lecteur
            </span>
            <span className="text-[10px] font-mono">
              {isBlobOrData ? "Fichier Local" : isYouTube ? "YouTube Stream" : "Flux MP4 Direct"}
            </span>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-white/10 shadow-md">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbed(value)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Aperçu YouTube"
              />
            ) : (
              <video
                src={value}
                controls
                playsInline
                onError={() => setPreviewError(true)}
                className="w-full h-full object-contain"
              />
            )}

            {previewError && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center text-rose-400">
                <AlertCircle size={24} className="mb-1" />
                <p className="text-xs font-bold">Impossible de charger la vidéo</p>
                <p className="text-[10px] text-white/60 mt-0.5">
                  Vérifiez le lien URL ou réimportez un fichier vidéo local supporté.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
