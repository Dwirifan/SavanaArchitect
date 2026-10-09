import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseBrowser } from "@/lib/supabase";

export async function GET() {
  const browser = getSupabaseBrowser();
  if (browser) {
    const { data } = await browser.from("site_settings").select("data").eq("id", 1).single();
    if (data?.data) return NextResponse.json(data.data);
  }
  return NextResponse.json(null, { status: 404 });
}

export async function POST(req: NextRequest) {
  // simple protection: require ADMIN_TOKEN if set, else allow (Vercel env)
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${token}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { error } = await admin.from("site_settings").upsert({ id: 1, data: body, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
