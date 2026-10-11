import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

export function normalizeBlobPath(url: string): string | null {
  if (url.startsWith("/api/blob/")) return url.slice("/api/blob/".length);
  if (url.startsWith("http") && url.includes("blob.vercel-storage.com")) return url;
  return null;
}

function shouldUseBlob() {
  if (process.env.BLOB_STORE_ID) return true;
  if (process.env.BLOB_READ_WRITE_TOKEN) return true;
  if (process.env.VERCEL === "1") return true;
  return false;
}

const IMAGE_PRESETS: Record<string, { maxDim: number; quality: number }> = {
  profile: { maxDim: 800, quality: 80 },
  projects: { maxDim: 1600, quality: 78 },
  products: { maxDim: 1600, quality: 78 },
  team: { maxDim: 800, quality: 80 },
  journal: { maxDim: 1200, quality: 78 },
  general: { maxDim: 1600, quality: 78 },
};

async function compressImage(input: Buffer, mime: string, prefix: string) {
  if (mime === "image/gif") return { bytes: input, ext: ".gif", contentType: "image/gif" as string };
  const { maxDim, quality } = IMAGE_PRESETS[prefix] ?? { maxDim: 1600, quality: 78 };
  const { default: sharp } = await import("sharp");
  const bytes = await sharp(input, { animated: false })
    .rotate()
    .resize({ width: maxDim, height: maxDim, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer();
  return { bytes, ext: ".webp", contentType: "image/webp" as string };
}

export async function saveUploadedImage(file: File, prefix: string): Promise<string> {
  const raw = Buffer.from(await file.arrayBuffer());
  const { bytes, ext, contentType } = await compressImage(raw, file.type, prefix);
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  // Try Vercel Blob only if credentials exist — otherwise fallback to local
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN || !!process.env.BLOB_STORE_ID || !!process.env.VERCEL_OIDC_TOKEN;
  if (hasBlobToken && shouldUseBlob()) {
    try {
      const blob = await put(`uploads/${prefix}/${filename}`, bytes, {
        access: "public",
        contentType,
      });
      return blob.url;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "";
      // Missing credentials or private store → fallback to local instead of throwing 500
      if (/No blob credentials|private store/i.test(msg)) {
        console.warn(`[storage] Blob unavailable (${msg}), falling back to local`);
      } else if (/private store/i.test(msg)) {
        try {
          const blob = await put(`uploads/${prefix}/${filename}`, bytes, {
            access: "private",
            contentType,
          });
          return `/api/blob/${blob.pathname}`;
        } catch {}
      } else {
        console.warn(`[storage] Blob put failed: ${msg}, falling back to local`);
      }
      // fall through to local
    }
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", prefix);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${prefix}/${filename}`;
}

export async function deleteFileFromUrl(url: string | null | undefined) {
  if (!url) return;
  try {
    const pathname = normalizeBlobPath(url);
    if (pathname) {
      await del(pathname);
      return;
    }
    if (!url.startsWith("/uploads/")) return;
    const filePath = path.join(process.cwd(), "public", ...url.split("/"));
    await unlink(filePath);
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException)?.code !== "ENOENT") console.error(`[storage] delete failed: ${url}`, e);
  }
}
