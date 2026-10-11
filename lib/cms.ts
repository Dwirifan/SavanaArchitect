import { DEFAULT_PROJECTS, DEFAULT_JOURNAL, DEFAULT_STUDIO, DEFAULT_TEAM, DEFAULT_PRODUCTS } from "./cms.defaults";
export type { Project, Journal, TeamMember, Product, StudioData, CMS } from "./cms.defaults";

const KEY = "savana_cms_v11";

const defaults = { projects: DEFAULT_PROJECTS, journal: DEFAULT_JOURNAL, studio: DEFAULT_STUDIO, team: DEFAULT_TEAM, products: DEFAULT_PRODUCTS };

// Read via Prisma API route only
export async function loadCMS(): Promise<import("./cms.defaults").CMS> {
  const defaultData = defaults as import("./cms.defaults").CMS;

  try {
    const res = await fetch("/api/cms", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data) return normalize(data, defaultData);
    }
  } catch {}

  // localStorage fallback
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData;
    return normalize(JSON.parse(raw), defaultData);
  } catch { return defaultData; }
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
  try {
    const res = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "same-origin",
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || `save failed ${res.status}`);
    }
  } catch (e) {
    console.error("saveCMS failed", e);
    throw e;
  }
}

export const defaultsExport = defaults;
export { defaults };
