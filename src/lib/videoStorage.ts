/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Persistent Video & Media Storage Manager using browser IndexedDB
// Prevents QuotaExceededError in localStorage while ensuring uploaded videos survive page refreshes!

const DB_NAME = "LinguaFlowMediaDB";
const STORE_NAME = "videos";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result as IDBDatabase);
    };

    request.onerror = (event: any) => {
      reject(event.target.error || new Error("Failed to open Media DB"));
    };
  });

  return dbPromise;
}

export interface StoredVideoRecord {
  id: string;
  name: string;
  mimeType: string;
  blob: Blob;
  size: number;
  createdAt: string;
}

/**
 * Stores a video file into IndexedDB and returns a persistent custom URI: `idb:video_{timestamp}`
 */
export async function saveVideoFileToDB(file: File | Blob, customName?: string): Promise<{ id: string; uri: string; previewUrl: string }> {
  try {
    const db = await getDB();
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: StoredVideoRecord = {
      id: videoId,
      name: customName || (file instanceof File ? file.name : "video.mp4"),
      mimeType: file.type || "video/mp4",
      blob: file,
      size: file.size,
      createdAt: new Date().toISOString(),
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const uri = `idb:${videoId}`;
    const previewUrl = URL.createObjectURL(file);
    return { id: videoId, uri, previewUrl };
  } catch (error) {
    console.error("IndexedDB save error, fallback to memory/data URL:", error);
    // If IndexedDB fails, create object URL
    const fallbackId = `video_${Date.now()}`;
    return {
      id: fallbackId,
      uri: URL.createObjectURL(file),
      previewUrl: URL.createObjectURL(file),
    };
  }
}

/**
 * Retrieves a stored video blob from IndexedDB by URI or ID
 */
export async function getVideoFromDB(uriOrId: string): Promise<Blob | null> {
  try {
    const id = uriOrId.startsWith("idb:") ? uriOrId.replace("idb:", "") : uriOrId;
    const db = await getDB();

    return await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result as StoredVideoRecord | undefined;
        if (record && record.blob) {
          resolve(record.blob);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error("Failed to retrieve video from IndexedDB:", error);
    return null;
  }
}

/**
 * Converts a video source URL to a playable streaming URL
 * If it's an `idb:` URI, extracts the blob from IndexedDB and creates a live ObjectURL
 */
const objectUrlCache = new Map<string, string>();

export async function resolvePlayableVideoUrl(rawUrl: string): Promise<string> {
  if (!rawUrl) return "";

  // If already an HTTP / HTTPS / Data URL, return as is
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("data:")) {
    return rawUrl;
  }

  // If it's an IndexedDB URI
  if (rawUrl.startsWith("idb:")) {
    if (objectUrlCache.has(rawUrl)) {
      return objectUrlCache.get(rawUrl)!;
    }

    const blob = await getVideoFromDB(rawUrl);
    if (blob) {
      const liveUrl = URL.createObjectURL(blob);
      objectUrlCache.set(rawUrl, liveUrl);
      return liveUrl;
    }
  }

  // If it's a stale revoked blob URL (e.g. from previous session)
  if (rawUrl.startsWith("blob:")) {
    // Check if the blob is still valid or return standard fallback sample
    return rawUrl;
  }

  return rawUrl;
}
