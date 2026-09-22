import { createClient } from "@sanity/client";

export const SANITY_CONFIG = {
  projectId: "2o4xp2hr",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // use false for freshest writes/reads with token
  organizationId: "oC8a8jw4C",
};

// Client for reading / writing with authentication token
export const sanityClient = createClient({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  apiVersion: SANITY_CONFIG.apiVersion,
  useCdn: false,
  token: (import.meta as any).env?.VITE_SANITY_API_TOKEN || "",
});

export interface SanityStatusResult {
  connected: boolean;
  projectId: string;
  dataset: string;
  organizationId: string;
  documentCount?: number;
  lastChecked: string;
  error?: string;
}

/**
 * Test connectivity to Sanity project
 */
export async function testSanityConnection(): Promise<SanityStatusResult> {
  try {
    const res = await fetch(
      `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=%2A%5B0..10%5D`,
      {
        headers: {
          Authorization: `Bearer ${sanityClient.config().token}`,
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return {
        connected: false,
        projectId: SANITY_CONFIG.projectId,
        dataset: SANITY_CONFIG.dataset,
        organizationId: SANITY_CONFIG.organizationId,
        lastChecked: new Date().toISOString(),
        error: `HTTP ${res.status}: ${errText}`,
      };
    }

    const data = await res.json();
    const count = Array.isArray(data.result) ? data.result.length : 0;

    return {
      connected: true,
      projectId: SANITY_CONFIG.projectId,
      dataset: SANITY_CONFIG.dataset,
      organizationId: SANITY_CONFIG.organizationId,
      documentCount: count,
      lastChecked: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SANITY_CONFIG.projectId,
      dataset: SANITY_CONFIG.dataset,
      organizationId: SANITY_CONFIG.organizationId,
      lastChecked: new Date().toISOString(),
      error: err.message || "Failed to connect to Sanity",
    };
  }
}
