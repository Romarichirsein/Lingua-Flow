/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { parseVideoSource } from "../../lib/videoHelper";
import { resolvePlayableVideoUrl } from "../../lib/videoStorage";
import {
  AlertTriangle,
  RefreshCw,
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

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    // Extract only primitive details to avoid circular structure errors with HTMLVideoElement / FiberNode in console loggers
    const mediaError = e.currentTarget?.error;
    const errorCode = mediaError?.code;
    const errorMsg = mediaError?.message || "Format vidéo non supporté ou flux inaccessible";
    console.warn("Video playback error on URL:", resolvedUrl, { errorCode, errorMsg });
    setHasError(true);
    setErrorMessage("Le format ou l'accès à ce flux vidéo n'a pas pu être chargé par le navigateur.");
  };

  const handleRetry = () => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    if (video.duration && video.currentTime >= video.duration * 0.98) {
      onEnded?.();
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Réessayer</span>
            </button>
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
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          playsInline
          onContextMenu={(e) => e.preventDefault()}
          onError={handleVideoError}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => onEnded?.()}
          className="h-full w-full object-contain bg-black select-none pointer-events-auto"
        />
      )}

      {/* 2. PLATFORM LOGO WATERMARK WITH REDUCED OPACITY */}
      <div className="pointer-events-none absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 flex items-center gap-2 select-none">
        <img
          src="/logo.png"
          alt="LinguaFlow"
          className="h-6 sm:h-8 w-auto object-contain opacity-25 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] filter contrast-125"
        />
        <span className="hidden sm:inline text-[9px] font-mono font-bold tracking-widest text-white/25 uppercase">
          LinguaFlow
        </span>
      </div>

      {/* 3. OPTIONAL SUBTLE SESSION DRM WATERMARK */}
      {showDrmWatermark && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-4 opacity-20 select-none overflow-hidden">
          <div className="flex items-center justify-between text-[9px] font-mono text-white/70 tracking-wider uppercase">
            <span>{watermarkText || "LinguaFlow Protected"}</span>
            <span>{watermarkEmail || ""}</span>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono text-white/60">
            <span>FLUX PROTÉGÉ • TÉLÉCHARGEMENT & PARTAGE STRICTEMENT INTERDITS</span>
            <span>{currentTimeStr}</span>
          </div>
        </div>
      )}
    </div>
  );
};
