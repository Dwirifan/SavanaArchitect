import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { DEFAULT_PROJECTS, DEFAULT_JOURNAL, DEFAULT_STUDIO, DEFAULT_TEAM, DEFAULT_PRODUCTS } from "@/lib/cms.defaults";

// helper: map DB -> CMS shape
function toCMS(projects: any[], journals: any[], teams: any[], products: any[], studio: any) {
  return {
    projects: projects.map((p) => ({
      id: p.id, title: p.title, location: p.location, year: p.year, category: p.category,
      cover: p.cover, images: p.images ?? [], videos: (p.videos ?? []) as string[], excerpt: p.excerpt, area: p.area ?? undefined, status: p.status,
    })),
    journal: journals.map((j) => ({ id: j.id, title: j.title, date: j.date, tag: j.tag, image: j.image, excerpt: j.excerpt })),
    team: teams.map((t) => ({ id: t.id, name: t.name, role: t.role, bio: t.bio, image: t.image })),
    products: products.map((p) => ({
      id: p.id, name: p.name, category: p.category, price: p.price, material: p.material, dimensions: p.dimensions,
      image: p.image, images: (p.images ?? []) as string[], excerpt: p.excerpt, inStock: p.inStock,
    })),
    studio: studio ? {
      heroTitle: studio.heroTitle, heroSubtitle: studio.heroSubtitle,
      studioHeadline: studio.studioHeadline, studioHeadlineAccent: studio.studioHeadlineAccent, studioHeadlineTail: studio.studioHeadlineTail,
      quote: studio.quote, about: studio.about, philosophy: studio.philosophy as string[],
      contactHeadline: studio.contactHeadline ?? undefined, contactHeadlineAccent: studio.contactHeadlineAccent ?? undefined,
      email: studio.email, phone: studio.phone, address: studio.address, instagram: studio.instagram,
    } : DEFAULT_STUDIO,
  };
}

export async function GET() {
  // fallback if no DB configured (local dev without POSTGRES env)
  if (!isDatabaseConfigured || !prisma) {
    return NextResponse.json({ projects: DEFAULT_PROJECTS, journal: DEFAULT_JOURNAL, studio: DEFAULT_STUDIO, team: DEFAULT_TEAM, products: DEFAULT_PRODUCTS });
  }
  try {
    const [projects, journals, teams, products, studio] = await Promise.all([
      prisma.savanaProject.findMany({ orderBy: { order: "asc" } }),
      prisma.savanaJournal.findMany({ orderBy: { order: "asc" } }),
      prisma.savanaTeam.findMany({ orderBy: { order: "asc" } }),
      prisma.savanaProduct.findMany({ orderBy: { order: "asc" } }),
      prisma.savanaStudio.findUnique({ where: { id: "studio" } }),
    ]);
    // seed empty DB on first read so admin sees defaults immediately
    if (projects.length === 0 && journals.length === 0) {
      await seedIfEmpty();
      const [p2, j2, t2, pr2, s2] = await Promise.all([
        prisma.savanaProject.findMany({ orderBy: { order: "asc" } }),
        prisma.savanaJournal.findMany({ orderBy: { order: "asc" } }),
        prisma.savanaTeam.findMany({ orderBy: { order: "asc" } }),
        prisma.savanaProduct.findMany({ orderBy: { order: "asc" } }),
        prisma.savanaStudio.findUnique({ where: { id: "studio" } }),
      ]);
      return NextResponse.json(toCMS(p2, j2, t2, pr2, s2));
    }
    return NextResponse.json(toCMS(projects, journals, teams, products, studio));
  } catch (e: any) {
    console.error("[cms GET prisma]", e?.message);
    return NextResponse.json({ projects: DEFAULT_PROJECTS, journal: DEFAULT_JOURNAL, studio: DEFAULT_STUDIO, team: DEFAULT_TEAM, products: DEFAULT_PRODUCTS });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!isDatabaseConfigured || !prisma) {
    // no DB -> accept but store locally only (client keeps localStorage)
    return NextResponse.json({ ok: true, stored: "local", warning: "POSTGRES_PRISMA_URL not configured — saved to localStorage only" });
  }
  try {
    // collect old URLs before sync to find orphans
    const oldUrls = await collectAllUrls();
    await syncCMS(body);
    // delete orphaned blob/local files (fire and don't block save if fails)
    const newUrls = collectUrlsFromCMS(body);
    const removed = [...oldUrls].filter((u) => !newUrls.has(u));
    if (removed.length) {
      const { deleteFileFromUrl } = await import("@/lib/storage");
      await Promise.all(removed.map((u) => deleteFileFromUrl(u).catch(() => {})));
      if (removed.length) console.log(`[cms] cleaned ${removed.length} orphaned file(s)`);
    }
    return NextResponse.json({ ok: true, stored: "prisma" });
  } catch (e: any) {
    const msg = e?.message ?? "save failed";
    const code = e?.code ?? "";
    console.error("[cms POST prisma]", code, msg, e);
    // DB belum di-migrate (P2021 table does not exist) atau belum connect -> jangan 500, fallback ke local agar admin tetap bisa save
    if (code === "P2021" || /does not exist|Can't reach database|connect|POSTGRES/i.test(msg)) {
      return NextResponse.json({ ok: true, stored: "local", warning: `DB not ready (${code || msg.slice(0,120)}), saved to localStorage. Run pnpm db:push + Vercel Postgres.` });
    }
    return NextResponse.json({ error: msg, code }, { status: 500 });
  }
}

function collectUrlsFromCMS(cms: any): Set<string> {
  const s = new Set<string>();
  const add = (u: any) => {
    if (typeof u !== "string" || !u) return;
    // only track owned storage — skip externals/unsplash/seeds
    if (u.includes("blob.vercel-storage.com") || u.startsWith("/uploads/") || u.startsWith("/api/blob/")) s.add(u);
  };
  for (const p of cms.projects ?? []) { add(p.cover); for (const x of p.images ?? []) add(x); for (const v of p.videos ?? []) add(v); }
  for (const j of cms.journal ?? []) add(j.image);
  for (const t of cms.team ?? []) add(t.image);
  for (const p of cms.products ?? []) { add(p.image); for (const x of p.images ?? []) add(x); }
  return s;
}

async function collectAllUrls(): Promise<Set<string>> {
  if (!prisma) return new Set();
  try {
    const [projects, journals, teams, products] = await Promise.all([
      prisma.savanaProject.findMany({ select: { cover: true, images: true, videos: true } }),
      prisma.savanaJournal.findMany({ select: { image: true } }),
      prisma.savanaTeam.findMany({ select: { image: true } }),
      prisma.savanaProduct.findMany({ select: { image: true, images: true } }),
    ]);
    const s = new Set<string>();
    const add = (u: any) => {
      if (typeof u !== "string" || !u) return;
      if (u.includes("blob.vercel-storage.com") || u.startsWith("/uploads/") || u.startsWith("/api/blob/")) s.add(u);
    };
    for (const p of projects) { add(p.cover); for (const x of p.images) add(x); for (const v of p.videos) add(v); }
    for (const j of journals) add(j.image);
    for (const t of teams) add(t.image);
    for (const p of products) { add(p.image); for (const x of p.images) add(x); }
    return s;
  } catch { return new Set(); }
}

// --- helpers ---
async function seedIfEmpty() {
  if (!prisma) return;
  const db = prisma;
  const count = await db.savanaProject.count();
  if (count > 0) return;
  await db.$transaction([
    ...DEFAULT_PROJECTS.map((p, i) => db.savanaProject.create({
      data: { id: p.id, title: p.title, location: p.location, year: p.year, category: p.category, cover: p.cover, images: p.images, videos: (p as any).videos ?? [], excerpt: p.excerpt, area: (p as any).area ?? null, status: p.status, order: i },
    })),
    ...DEFAULT_JOURNAL.map((j, i) => db.savanaJournal.create({
      data: { id: j.id, title: j.title, date: j.date, tag: j.tag, image: j.image, excerpt: j.excerpt, order: i },
    })),
    ...DEFAULT_TEAM.map((t, i) => db.savanaTeam.create({
      data: { id: t.id, name: t.name, role: t.role, bio: t.bio, image: t.image, order: i },
    })),
    ...DEFAULT_PRODUCTS.map((p, i) => db.savanaProduct.create({
      data: { id: p.id, name: p.name, category: p.category, price: p.price, material: p.material, dimensions: p.dimensions, image: p.image, images: (p as any).images ?? [], excerpt: p.excerpt, inStock: p.inStock, order: i },
    })),
    db.savanaStudio.upsert({
      where: { id: "studio" },
      create: { id: "studio", heroTitle: DEFAULT_STUDIO.heroTitle, heroSubtitle: DEFAULT_STUDIO.heroSubtitle, studioHeadline: DEFAULT_STUDIO.studioHeadline, studioHeadlineAccent: DEFAULT_STUDIO.studioHeadlineAccent, studioHeadlineTail: DEFAULT_STUDIO.studioHeadlineTail, quote: DEFAULT_STUDIO.quote, about: DEFAULT_STUDIO.about, philosophy: DEFAULT_STUDIO.philosophy, contactHeadline: (DEFAULT_STUDIO as any).contactHeadline ?? null, contactHeadlineAccent: (DEFAULT_STUDIO as any).contactHeadlineAccent ?? null, email: DEFAULT_STUDIO.email, phone: DEFAULT_STUDIO.phone, address: DEFAULT_STUDIO.address, instagram: DEFAULT_STUDIO.instagram },
      update: {},
    }),
  ]);
}

async function syncCMS(cms: any) {
  if (!prisma) throw new Error("prisma not configured");
  const db = prisma;
  // studio: single row upsert
  if (cms.studio) {
    const s = cms.studio;
    await db.savanaStudio.upsert({
      where: { id: "studio" },
      create: { id: "studio", heroTitle: s.heroTitle ?? "", heroSubtitle: s.heroSubtitle ?? "", studioHeadline: s.studioHeadline ?? "", studioHeadlineAccent: s.studioHeadlineAccent ?? "", studioHeadlineTail: s.studioHeadlineTail ?? "", quote: s.quote ?? "", about: s.about ?? "", philosophy: s.philosophy ?? [], contactHeadline: s.contactHeadline ?? null, contactHeadlineAccent: s.contactHeadlineAccent ?? null, email: s.email ?? "", phone: s.phone ?? "", address: s.address ?? "", instagram: s.instagram ?? "" },
      update: { heroTitle: s.heroTitle, heroSubtitle: s.heroSubtitle, studioHeadline: s.studioHeadline, studioHeadlineAccent: s.studioHeadlineAccent, studioHeadlineTail: s.studioHeadlineTail, quote: s.quote, about: s.about, philosophy: s.philosophy, contactHeadline: s.contactHeadline ?? null, contactHeadlineAccent: s.contactHeadlineAccent ?? null, email: s.email, phone: s.phone, address: s.address, instagram: s.instagram },
    });
  }
  // For collections: replace all (delete + create) inside transaction — simple & matches admin full-save pattern
  // Use individual upserts to preserve IDs when editing
  if (Array.isArray(cms.projects)) {
    const ids = cms.projects.map((p: any) => p.id);
    await db.savanaProject.deleteMany({ where: { id: { notIn: ids.length ? ids : ["__none__"] } } });
    for (let i = 0; i < cms.projects.length; i++) {
      const p = cms.projects[i];
      await db.savanaProject.upsert({
        where: { id: p.id },
        create: { id: p.id, title: p.title, location: p.location, year: p.year, category: p.category, cover: p.cover, images: p.images ?? [], videos: p.videos ?? [], excerpt: p.excerpt, area: p.area ?? null, status: p.status, order: i },
        update: { title: p.title, location: p.location, year: p.year, category: p.category, cover: p.cover, images: p.images ?? [], videos: p.videos ?? [], excerpt: p.excerpt, area: p.area ?? null, status: p.status, order: i },
      });
    }
  }
  if (Array.isArray(cms.journal)) {
    const ids = cms.journal.map((j: any) => j.id);
    await db.savanaJournal.deleteMany({ where: { id: { notIn: ids.length ? ids : ["__none__"] } } });
    for (let i = 0; i < cms.journal.length; i++) {
      const j = cms.journal[i];
      await db.savanaJournal.upsert({
        where: { id: j.id },
        create: { id: j.id, title: j.title, date: j.date, tag: j.tag, image: j.image, excerpt: j.excerpt, order: i },
        update: { title: j.title, date: j.date, tag: j.tag, image: j.image, excerpt: j.excerpt, order: i },
      });
    }
  }
  if (Array.isArray(cms.team)) {
    const ids = cms.team.map((t: any) => t.id);
    await db.savanaTeam.deleteMany({ where: { id: { notIn: ids.length ? ids : ["__none__"] } } });
    for (let i = 0; i < cms.team.length; i++) {
      const t = cms.team[i];
      await db.savanaTeam.upsert({
        where: { id: t.id },
        create: { id: t.id, name: t.name, role: t.role, bio: t.bio, image: t.image, order: i },
        update: { name: t.name, role: t.role, bio: t.bio, image: t.image, order: i },
      });
    }
  }
  if (Array.isArray(cms.products)) {
    const ids = cms.products.map((p: any) => p.id);
    await db.savanaProduct.deleteMany({ where: { id: { notIn: ids.length ? ids : ["__none__"] } } });
    for (let i = 0; i < cms.products.length; i++) {
      const p = cms.products[i];
      await db.savanaProduct.upsert({
        where: { id: p.id },
        create: { id: p.id, name: p.name, category: p.category, price: p.price, material: p.material, dimensions: p.dimensions, image: p.image, images: p.images ?? [], excerpt: p.excerpt, inStock: p.inStock ?? true, order: i },
        update: { name: p.name, category: p.category, price: p.price, material: p.material, dimensions: p.dimensions, image: p.image, images: p.images ?? [], excerpt: p.excerpt, inStock: p.inStock ?? true, order: i },
      });
    }
  }
}
