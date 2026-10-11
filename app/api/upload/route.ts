import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "general";
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "Max 25MB" }, { status: 400 });

  try {
    // lib/storage handles: sharp WebP compress -> Vercel Blob (public) or local /public/uploads
    const url = await saveUploadedImage(file, folder);
    return NextResponse.json({ url, path: url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
