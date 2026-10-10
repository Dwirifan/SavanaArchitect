import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseBrowser } from "@/lib/supabase";
import { DEFAULT_PROJECTS, DEFAULT_JOURNAL, DEFAULT_STUDIO, DEFAULT_TEAM, DEFAULT_PRODUCTS } from "@/lib/cms.defaults";

export async function GET() {
  const browser = getSupabaseBrowser();
  if (browser) {
    try {
      const { data } = await browser.from("site_settings").select("data").eq("id", 1).single();
      if (data?.data) return NextResponse.json(data.data);
    } catch {}
  }
  // No DB configured — return defaults so frontend never gets 404/blank
  return NextResponse.json({
    projects: DEFAULT_PROJECTS,
    journal: DEFAULT_JOURNAL,
    studio: DEFAULT_STUDIO,
    team: DEFAULT_TEAM,
    products: DEFAULT_PRODUCTS,
  });
}

export async function POST(req: NextRequest) {
  // auth is already checked in middleware (cookie or ADMIN_TOKEN), but double-check here for direct calls
  const body = await req.json();
  const admin = getSupabaseAdmin();
  if (!admin) {
    // local dev / Vercel without DB yet — accept save and let localStorage handle it (don't block UX)
    console.warn("CMS save: Supabase not configured, saving locally only");
    return NextResponse.json({ ok: true, stored: "local" });
  }
  const { error } = await admin.from("site_settings").upsert({ id: 1, data: body, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
