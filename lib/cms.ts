import { createClient } from "@supabase/supabase-js";
export type { Project, Journal, TeamMember, Product, StudioData, CMS } from "./cms.defaults";
import { DEFAULT_PROJECTS, DEFAULT_JOURNAL, DEFAULT_STUDIO, DEFAULT_TEAM, DEFAULT_PRODUCTS } from "./cms.defaults";

const KEY = "savana_cms_v11";

const defaults = { projects: DEFAULT_PROJECTS, journal: DEFAULT_JOURNAL, studio: DEFAULT_STUDIO, team: DEFAULT_TEAM, products: DEFAULT_PRODUCTS };

// Read via API route (or direct anon read fallback) — anon can only SELECT via RLS
export async function loadCMS(): Promise<import("./cms.defaults").CMS> {
  const defaultData = defaults as import("./cms.defaults").CMS;

  // 1) Try API route (works both server & client, no anon key needed for read)
  try {
    const res = await fetch("/api/cms", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data) return normalize(data, defaultData);
    }
  } catch {}

  // 2) Fallback direct Supabase anon read (for local dev without API)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    try {
      const supabase = createClient(url, anon);
      const { data } = await supabase.from("site_settings").select("data").eq("id", 1).single();
      if (data?.data) return normalize(data.data as import("./cms.defaults").CMS, defaultData);
    } catch {}
  }

  // 3) localStorage fallback
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
  // ensure videos array exists
  if (parsed.projects) parsed.projects.forEach((p: any) => { if (!p.videos) p.videos = []; if (!p.images) p.images = []; });
  if (parsed.products) parsed.products.forEach((p: any) => { if (!p.images) p.images = []; });
  return parsed;
}

// Write via API route (uses service_role on server, RLS blocks anon direct write)
export async function saveCMS(data: import("./cms.defaults").CMS) {
  // Optimistic local cache
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("savana:update", { detail: data }));
  }
  try {
    await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error("saveCMS failed", e);
  }
}

export const defaultsExport = defaults;
export { defaults };
