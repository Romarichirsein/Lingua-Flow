/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParsedVideoInfo {
  type: "youtube" | "vimeo" | "googledrive" | "dailymotion" | "html5" | "idb" | "unknown";
  embedUrl?: string;
  directUrl?: string;
  isIframe: boolean;
  sourceLabel: string;
}

/**
 * Universal Video URL Parser for LinguaFlow LMS
 * Transforms any educational video link into an embeddable/playable format
 */
export function parseVideoSource(rawUrl: string): ParsedVideoInfo {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      type: "unknown",
      isIframe: false,
      sourceLabel: "Source Non Définie",
    };
  }

  const trimmed = rawUrl.trim();

  // 1. IndexedDB Persistent Video Record
  if (trimmed.startsWith("idb:")) {
    return {
      type: "idb",
      directUrl: trimmed,
      isIframe: false,
      sourceLabel: "Vidéo Locale Persistante (IndexedDB)",
    };
  }

  // 2. Data URL Base64 or Blob
  if (trimmed.startsWith("data:video/") || trimmed.startsWith("blob:")) {
    return {
      type: "html5",
      directUrl: trimmed,
      isIframe: false,
      sourceLabel: "Fichier Vidéo Importé",
    };
  }

  // 3. YouTube Links (watch?v=, youtu.be/, shorts/, embed/)
  if (
    trimmed.includes("youtube.com/watch") ||
    trimmed.includes("youtu.be/") ||
    trimmed.includes("youtube.com/embed/") ||
    trimmed.includes("youtube.com/shorts/") ||
    trimmed.includes("youtube-nocookie.com/embed/")
  ) {
    let videoId = "";
    try {
      if (trimmed.includes("youtu.be/")) {
        videoId = trimmed.split("youtu.be/")[1]?.split("?")[0]?.split("/")[0] || "";
      } else if (trimmed.includes("watch?v=")) {
        const urlObj = new URL(trimmed);
        videoId = urlObj.searchParams.get("v") || "";
      } else if (trimmed.includes("youtube.com/shorts/")) {
        videoId = trimmed.split("shorts/")[1]?.split("?")[0]?.split("/")[0] || "";
      } else if (trimmed.includes("embed/")) {
        videoId = trimmed.split("embed/")[1]?.split("?")[0]?.split("/")[0] || "";
      }
    } catch {
      // fallback regex
      const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
      if (match && match[1]) videoId = match[1];
    }

    if (videoId) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&playsinline=1&iv_load_policy=3`,
        isIframe: true,
        sourceLabel: "YouTube Stream",
      };
    }
  }

  // 4. Vimeo Links
  if (trimmed.includes("vimeo.com/")) {
    const match = trimmed.match(/vimeo\.com\/(?:video\/|channels\/[\w-]+\/)?(\d+)/);
    const videoId = match ? match[1] : "";
    if (videoId) {
      return {
        type: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`,
        isIframe: true,
        sourceLabel: "Vimeo Stream",
      };
    }
  }

  // 5. Google Drive Video Links
  if (trimmed.includes("drive.google.com/")) {
    let fileId = "";
    if (trimmed.includes("/file/d/")) {
      fileId = trimmed.split("/file/d/")[1]?.split("/")[0] || "";
    } else if (trimmed.includes("id=")) {
      try {
        const urlObj = new URL(trimmed);
        fileId = urlObj.searchParams.get("id") || "";
      } catch {
        fileId = "";
      }
    }

    if (fileId) {
      return {
        type: "googledrive",
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isIframe: true,
        sourceLabel: "Google Drive Preview",
      };
    }
  }

  // 6. Dailymotion Links
  if (trimmed.includes("dailymotion.com/") || trimmed.includes("dai.ly/")) {
    let videoId = "";
    if (trimmed.includes("dai.ly/")) {
      videoId = trimmed.split("dai.ly/")[1]?.split("?")[0] || "";
    } else if (trimmed.includes("/video/")) {
      videoId = trimmed.split("/video/")[1]?.split("?")[0]?.split("_")[0] || "";
    }
    if (videoId) {
      return {
        type: "dailymotion",
        embedUrl: `https://www.dailymotion.com/embed/video/${videoId}`,
        isIframe: true,
        sourceLabel: "Dailymotion Stream",
      };
    }
  }

  // 7. Dropbox Direct Links
  if (trimmed.includes("dropbox.com/")) {
    const directDropbox = trimmed.replace("dl=0", "dl=1").replace("www.dropbox.com", "dl.dropboxusercontent.com");
    return {
      type: "html5",
      directUrl: directDropbox,
      isIframe: false,
      sourceLabel: "Dropbox Media Direct",
    };
  }

  // 8. Standard Direct HTML5 Video (MP4, WebM, OGG, MOV, Cloud Storage, or HTTP URL)
  return {
    type: "html5",
    directUrl: trimmed,
    isIframe: false,
    sourceLabel: "Flux Vidéo HTML5",
  };
}

/**
 * Pre-validated high-speed sample video presets for German and Italian courses
 */
export const SAMPLE_VIDEO_PRESETS = [
  {
    label: "Capsule Vidéo Allemand A1/A2 (MP4 Cloud)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    lang: "german",
  },
  {
    label: "Capsule Vidéo Italien B1/B2 (MP4 Cloud)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    lang: "italian",
  },
  {
    label: "Conversation & Prononciation (MP4 Cloud)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    lang: "all",
  },
  {
    label: "Leçon YouTube Exemple (Nocookie Embed)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    lang: "all",
  },
];
