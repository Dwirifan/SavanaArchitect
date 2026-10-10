import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${token}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "general";
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "Max 25MB" }, { status: 400 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  // auto-create bucket if not exists (Vercel marketplace Supabase often has no bucket yet)
  try {
    const { data: buckets } = await admin.storage.listBuckets();
    const exists = buckets?.some(b => b.name === "savana" || b.id === "savana");
    if (!exists) {
      await admin.storage.createBucket("savana", { public: true });
    }
  } catch {}

  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from("savana").upload(path, buf, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: `Upload failed: ${error.message} (bucket savana)` }, { status: 500 });

  const { data } = admin.storage.from("savana").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
