export interface AppRoute {
  page: "splash" | "login" | "superadmin" | "school" | "student";
  type: "splash" | "login" | "superadmin" | "school" | "student";
  subpath?: string; // e.g. "dashboard", "schools", "settings", "courses", "writing", "chat"
  entitySlug?: string; // e.g. "berlin-sprachzentrum" or "romaric-hirsein"
  slug?: string;
  fullPath: string;
}

// Convert string to URL-friendly slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSchoolSlug(name: string): string {
  return slugify(name);
}

export function getStudentSlug(name: string): string {
  return slugify(name);
}

// Parse current URL or Hash into structured Route
export function parseCurrentRoute(): AppRoute {
  if (typeof window === "undefined") {
    return { page: "login", type: "login", fullPath: "/login" };
  }

  // Check hash first (e.g. #/superadmin or #/ecole/berlin-sprachzentrum/eleves)
  let raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "/") {
    // If no hash, inspect pathname
    raw = window.location.pathname;
  }

  const clean = raw.replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] === "login" || parts[0] === "auth") {
    return { page: "login", type: "login", fullPath: "/login" };
  }

  if (parts[0] === "superadmin") {
    const subpath = parts[1] || "dashboard";
    return {
      page: "superadmin",
      type: "superadmin",
      subpath,
      fullPath: `/superadmin/${subpath}`,
    };
  }

  if (parts[0] === "ecole") {
    const entitySlug = parts[1] || "berlin-sprachzentrum";
    const subpath = parts[2] || "dashboard";
    return {
      page: "school",
      type: "school",
      entitySlug,
      slug: entitySlug,
      subpath,
      fullPath: `/ecole/${entitySlug}/${subpath}`,
    };
  }

  if (parts[0] === "eleve") {
    const entitySlug = parts[1] || "romaric-hirsein";
    const subpath = parts[2] || "courses";
    return {
      page: "student",
      type: "student",
      entitySlug,
      slug: entitySlug,
      subpath,
      fullPath: `/eleve/${entitySlug}/${subpath}`,
    };
  }

  return { page: "login", type: "login", fullPath: "/login" };
}

// Safely update window location hash without full page reload
export function navigateTo(route: string) {
  if (typeof window === "undefined") return;
  const targetHash = route.startsWith("/") ? `#${route}` : `#/${route}`;
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  }
}
