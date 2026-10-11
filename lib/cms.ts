import { DEFAULT_PROJECTS, DEFAULT_JOURNAL, DEFAULT_STUDIO, DEFAULT_TEAM, DEFAULT_PRODUCTS } from "./cms.defaults";
export type { Project, Journal, TeamMember, Product, StudioData, CMS } from "./cms.defaults";

const KEY = "savana_cms_v11";

const defaults = { projects: DEFAULT_PROJECTS, journal: DEFAULT_JOURNAL, studio: DEFAULT_STUDIO, team: DEFAULT_TEAM, products: DEFAULT_PRODUCTS };

// Read via Prisma API route only
export async function loadCMS(): Promise<import("./cms.defaults").CMS> {
  const defaultData = defaults as import("./cms.defaults").CMS;

  let apiData: any = null;
  try {
    const res = await fetch("/api/cms", { cache: "no-store" });
    if (res.ok) apiData = await res.json();
  } catch {}

  // localStorage copy (where saveCMS always writes first)
  let localData: any = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) localData = normalize(JSON.parse(raw), defaultData);
    } catch {}
  }

  // If API returned defaults (DB belum di-push / belum connect) but local has edits → prefer local
  if (apiData) {
    const normalizedApi = normalize(apiData, defaultData);
    // detect "defaults fallback": same counts as defaults and local has different counts
    const isApiDefaults =
      normalizedApi.projects.length === defaultData.projects.length &&
      normalizedApi.journal.length === defaultData.journal.length &&
      normalizedApi.team.length === defaultData.team.length;
    if (isApiDefaults && localData && (
      localData.projects.length !== normalizedApi.projects.length ||
      localData.team.length !== normalizedApi.team.length ||
      localData.products.length !== normalizedApi.products.length ||
      JSON.stringify(localData.studio) !== JSON.stringify(normalizedApi.studio)
    )) {
      console.warn("[cms] API returned defaults but local has edits — using local");
      return localData;
    }
    return normalizedApi;
  }

  if (localData) return localData;
  if (typeof window === "undefined") return defaultData;
  return defaultData;
}

function normalize(parsed: any, fallback: import("./cms.defaults").CMS): import("./cms.defaults").CMS {
  if (!parsed) return fallback;
  if (!parsed.team) parsed.team = fallback.team;
  if (!parsed.products) parsed.products = fallback.products;
  if (parsed.studio && !parsed.studio.studioHeadline) {
    parsed.studio.studioHeadline = fallback.studio.studioHeadline;
    parsed.studio.studioHeadlineAccent = fallback.studio.studioHeadlineAccent;
    parsed.studio.studioHeadlineTail = fallback.studio.studioHeadlineTail;
    parsed.studio.quote = fallback.studio.quote;
  }
  if (parsed.projects) parsed.projects.forEach((p: any) => { if (!p.videos) p.videos = []; if (!p.images) p.images = []; });
  if (parsed.products) parsed.products.forEach((p: any) => { if (!p.images) p.images = []; });
  return parsed;
}

export async function saveCMS(data: import("./cms.defaults").CMS) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("savana:update", { detail: data }));
  }
  const res = await fetch("/api/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "same-origin",
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || `save failed ${res.status}`);
  // surface DB-not-ready warning so admin UI can show it — don't throw, data is at least in localStorage
  if (j.stored === "local" && j.warning) {
    console.warn("[cms] saved locally only:", j.warning);
    throw new Error(j.warning);
  }
  return j;
}

export const defaultsExport = defaults;
export { defaults };
