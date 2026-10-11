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
  const body = await req.json();
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: true, stored: "local" });
  }
  const { error } = await admin.from("site_settings").upsert({ id: 1, data: body, updated_at: new Date().toISOString() });
  if (error) {
    // Vercel marketplace Supabase sometimes has no table or is read-only replica — don't block UX, fallback to local
    if (
      error.message.includes("site_settings") ||
      error.message.includes("schema cache") ||
      error.message.includes("read-only") ||
      error.message.includes("permission")
    ) {
      console.warn("CMS save fallback to local:", error.message);
      return NextResponse.json({ ok: true, stored: "local", warning: error.message });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
