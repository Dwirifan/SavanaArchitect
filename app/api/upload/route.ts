import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "general";
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  // hard cap 25MB — client should already compress 200MB → ~200-400KB before hitting here
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: `File ${Math.round(file.size/1024/1024)}MB kebesaran, max 25MB. Kompres dulu di client.` }, { status: 413 });

  try {
    console.log(`[upload] ${file.name} ${Math.round(file.size/1024)}KB → folder:${folder} compressing...`);
    // lib/storage handles: sharp WebP compress -> Vercel Blob (public) or local /public/uploads
    const url = await saveUploadedImage(file, folder);
    return NextResponse.json({ url, path: url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
