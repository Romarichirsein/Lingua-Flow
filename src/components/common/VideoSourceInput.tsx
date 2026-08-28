/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
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
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import { saveVideoFileToDB } from "../../lib/videoStorage";
import { parseVideoSource, SAMPLE_VIDEO_PRESETS } from "../../lib/videoHelper";
import { UniversalVideoPlayer } from "./UniversalVideoPlayer";

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
  const isLocalSource =
    value.startsWith("idb:") ||
    value.startsWith("data:") ||
    value.startsWith("blob:");

  const [sourceMode, setSourceMode] = useState<"upload" | "url" | "presets">(
    isLocalSource ? "upload" : "url"
  );
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    isLocalSource ? "Vidéo persistante enregistrée" : null
  );
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsed = parseVideoSource(value);

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Octet";
    const k = 1024;
    const sizes = ["Octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processVideoFile(file);
    }
  };

  const processVideoFile = async (file: File) => {
    setFileTypeError(null);
    if (!file.type.startsWith("video/")) {
      setFileTypeError("Veuillez sélectionner un fichier vidéo valide (MP4, WebM, MOV, etc.).");
      return;
    }

    try {
      setIsUploading(true);
      setFileName(file.name);
      setFileSize(formatBytes(file.size));

      // If file is small (< 5MB), convert to Base64 so it can easily serialize, OR save to IndexedDB
      if (file.size < 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          onChange(dataUrl);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Save to persistent IndexedDB
        const result = await saveVideoFileToDB(file, file.name);
        onChange(result.uri);
        setIsUploading(false);
      }
    } catch (err) {
      console.error("Error storing video file:", err);
      setIsUploading(false);
      setFileTypeError("Impossible d'enregistrer ce fichier vidéo. Veuillez réessayer ou utiliser un lien web.");
    }
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearVideo = () => {
    setFileName(null);
    setFileSize(null);
    setShowLivePreview(false);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-white/80">
          {label}
        </label>

        {/* Triple Mode Switcher (Upload | URL | Presets) */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/70 dark:bg-white/10 text-xs">
          <button
            type="button"
            onClick={() => setSourceMode("url")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer select-none ${
              sourceMode === "url"
                ? "bg-white dark:bg-[#6D5DFC] text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900"
            }`}
          >
            <LinkIcon size={12} />
            <span>Lien Web / Embed</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceMode("upload")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer select-none ${
              sourceMode === "upload"
                ? "bg-white dark:bg-[#6D5DFC] text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900"
            }`}
          >
            <Upload size={12} />
            <span>Importer Fichier</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceMode("presets")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer select-none ${
              sourceMode === "presets"
                ? "bg-white dark:bg-[#6D5DFC] text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900"
            }`}
          >
            <Sparkles size={12} />
            <span>Échantillons HD</span>
          </button>
        </div>
      </div>

      {/* MODE 1: URL / EMBED LINK */}
      {sourceMode === "url" && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ex: https://youtube.com/watch?v=... ou https://vimeo.com/... ou https://drive.google.com/file/d/... ou MP4 direct"
              className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono placeholder:font-sans focus:outline-none focus:border-[#6D5DFC]"
            />
            <LinkIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            {value && (
              <button
                type="button"
                onClick={handleClearVideo}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition p-1"
                title="Effacer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-white/50">
            <span>
              Supports : <b>YouTube</b>, <b>Vimeo</b>, <b>Google Drive</b>, <b>Dailymotion</b>, <b>Direct MP4 / WebM</b>
            </span>
            {value && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 font-semibold font-mono text-[10px]">
                {parsed.sourceLabel}
              </span>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: LOCAL DEVICE UPLOAD (IndexedDB / Base64) */}
      {sourceMode === "upload" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-[#6D5DFC] bg-[#6D5DFC]/10"
                : "border-slate-300 dark:border-white/15 hover:border-[#6D5DFC] bg-slate-50 dark:bg-white/5"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-6 h-6 border-2 border-[#6D5DFC] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-700 dark:text-white">
                  Enregistrement persistant de la vidéo...
                </p>
              </div>
            ) : value && isLocalSource ? (
              <div className="flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <FileVideo size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">
                      {fileName || "Vidéo persistante enregistrée"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {fileSize ? `${fileSize} • ` : ""}Persisté pour rechargements
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-white hover:bg-slate-300 transition"
                  >
                    Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 py-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#6D5DFC]/10 text-[#6D5DFC] flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-white">
                  Glissez-déposez une vidéo ici, ou <span className="text-[#6D5DFC]">parcourez vos fichiers</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Formats acceptés : MP4, WebM, MOV (Sauvegardé avec persistance locale)
                </p>
              </div>
            )}
          </div>

          {fileTypeError && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1">
              <AlertCircle size={13} /> {fileTypeError}
            </p>
          )}
        </div>
      )}

      {/* MODE 3: HIGH-SPEED PRESET SAMPLES */}
      {sourceMode === "presets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_VIDEO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setSourceMode("url");
              }}
              className="p-2.5 rounded-xl text-left bg-slate-50 dark:bg-white/5 hover:bg-[#6D5DFC]/10 border border-slate-200 dark:border-white/10 hover:border-[#6D5DFC]/40 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Play size={13} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white/90 truncate">
                  {preset.label}
                </span>
              </div>
              <span className="text-[10px] text-indigo-500 font-bold uppercase shrink-0">
                Appliquer
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Live Preview Toggle */}
      {value && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1">
              <Shield size={12} className="text-emerald-500" />
              Source prête pour diffusion sécurisée
            </span>
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="text-xs font-bold text-[#6D5DFC] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Play size={12} />
              <span>{showLivePreview ? "Masquer le test vidéo" : "Tester la lecture vidéo en direct"}</span>
            </button>
          </div>

          {showLivePreview && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-indigo-500/30">
              <UniversalVideoPlayer
                videoUrl={value}
                title="Aperçu du cours"
                showDrmWatermark={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
