/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { parseVideoSource } from "../../lib/videoHelper";
import { resolvePlayableVideoUrl } from "../../lib/videoStorage";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Shield,
  Sparkles,
  RefreshCw,
  Video,
} from "lucide-react";

interface UniversalVideoPlayerProps {
  videoUrl: string;
  poster?: string;
  title?: string;
  watermarkText?: string;
  watermarkEmail?: string;
  watermarkSessionId?: string;
  showDrmWatermark?: boolean;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  videoUrl,
  poster,
  title = "Leçon Vidéo",
  watermarkText,
  watermarkEmail,
  watermarkSessionId,
  showDrmWatermark = false,
  className = "",
  autoPlay = false,
  onEnded,
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>(videoUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dynamic moving watermark position
  const [watermarkOffset, setWatermarkOffset] = useState({ x: 15, y: 20 });
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Resolve video URL (handling idb: and data URLs asynchronously)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    resolvePlayableVideoUrl(videoUrl)
      .then((url) => {
        if (isMounted) {
          setResolvedUrl(url);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setResolvedUrl(videoUrl);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [videoUrl]);

  // Moving watermark timer
  useEffect(() => {
    if (!showDrmWatermark) return;

    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }, 1000);

    const shiftTimer = setInterval(() => {
      setWatermarkOffset({
        x: Math.floor(Math.random() * 45) + 10,
        y: Math.floor(Math.random() * 55) + 15,
      });
    }, 9000);

    return () => {
      clearInterval(timer);
      clearInterval(shiftTimer);
    };
  }, [showDrmWatermark]);

  const parsed = parseVideoSource(resolvedUrl);

  const handleVideoError = (e: any) => {
    console.warn("Video playback error on URL:", resolvedUrl, e);
    setHasError(true);
    setErrorMessage("Le format ou l'accès à ce flux vidéo n'a pas pu être chargé par le navigateur.");
  };

  const handleRetry = () => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleUseFallbackSample = () => {
    setHasError(false);
    setResolvedUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-xl border border-slate-800 select-none group ${className}`}
    >
      {/* 1. Iframe Players: YouTube, Vimeo, Google Drive, Dailymotion */}
      {parsed.isIframe && parsed.embedUrl ? (
        <iframe
          src={parsed.embedUrl}
          className="h-full w-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      ) : hasError ? (
        /* Error Diagnostic Fallback Card */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 text-white space-y-3 z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Lecture vidéo indisponible</h4>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              {errorMessage || "Le fichier source est inaccessible ou le format vidéo n'est pas supporté par ce navigateur."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Réessayer</span>
            </button>
            <button
              type="button"
              onClick={handleUseFallbackSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow transition cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Tester un échantillon HD</span>
            </button>
            {resolvedUrl.startsWith("http") && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                <span>Ouvrir lien</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      ) : (
        /* HTML5 Native Video Stream (MP4, WebM, Base64, IndexedDB blob) */
        <video
          ref={videoRef}
          src={resolvedUrl}
          poster={poster}
          controls
          autoPlay={autoPlay}
          controlsList="nodownload"
          playsInline
          onError={handleVideoError}
          onEnded={onEnded}
          className="h-full w-full object-contain bg-black select-none"
        />
      )}

      {/* 2. DYNAMIC ANTI-RECORDING DRM WATERMARK OVERLAY */}
      {showDrmWatermark && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-5 opacity-30 select-none overflow-hidden">
          {/* Top Bar Watermark */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/90 tracking-wider uppercase">
            <span>{watermarkText || "LinguaFlow Protected Stream"}</span>
            <span>{watermarkEmail || ""}</span>
          </div>

          {/* Shifting Floating Watermark Badge */}
          <div
            style={{
              transform: `translate(${watermarkOffset.x}px, ${watermarkOffset.y}px)`,
              transition: "transform 4s ease-in-out",
            }}
            className="flex items-center justify-center"
          >
            <div className="rounded-xl bg-black/60 px-3.5 py-1.5 backdrop-blur-xs text-center border border-cyan-500/30 shadow-lg">
              <p className="text-[10px] font-mono font-bold text-cyan-300">
                DRM SESSION • {watermarkSessionId || "SECURE-ID"}
              </p>
              <p className="text-[9px] font-mono text-white/80">{currentTimeStr || "ACTIVE"}</p>
            </div>
          </div>

          {/* Bottom Bar Watermark */}
          <div className="flex items-center justify-between text-[9px] font-mono text-white/70">
            <span>PROTECTED LMS STREAM • DOWNLOAD PROHIBITED</span>
            <span>{currentTimeStr}</span>
          </div>
        </div>
      )}
    </div>
  );
};
