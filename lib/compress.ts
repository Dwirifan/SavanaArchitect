export async function compressImageToBlob(file: File, maxW = 1600, quality = 0.72): Promise<Blob> {
  // Try createImageBitmap first, fallback to <img> for very large files / Safari quirks
  let w: number, h: number;
  let draw: (ctx: CanvasRenderingContext2D) => void;
  let cleanup: () => void = () => {};
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxW / Math.max(bitmap.width, bitmap.height));
    w = Math.round(bitmap.width * scale);
    h = Math.round(bitmap.height * scale);
    draw = (ctx) => ctx.drawImage(bitmap, 0, 0, w, h);
    cleanup = () => bitmap.close();
  } catch {
    const url = URL.createObjectURL(file);
    const img: HTMLImageElement = await new Promise((res, rej) => {
      const el = new Image();
      el.onload = () => res(el);
      el.onerror = () => rej(new Error("Gagal load gambar"));
      el.src = url;
    });
    const scale = Math.min(1, maxW / Math.max(img.naturalWidth, img.naturalHeight));
    w = Math.round(img.naturalWidth * scale);
    h = Math.round(img.naturalHeight * scale);
    draw = (ctx) => ctx.drawImage(img, 0, 0, w, h);
    cleanup = () => URL.revokeObjectURL(url);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  cleanup();
  const toBlob = (type: string, q: number) =>
    new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), type, q) as any);
  let blob: Blob;
  try { blob = await toBlob("image/webp", quality); } catch { blob = await toBlob("image/jpeg", quality); }
  if (!blob || blob.size === 0) blob = await toBlob("image/jpeg", quality);
  // If still > 1MB, recompress with lower quality once (for 200MB originals)
  if (blob.size > 1024 * 1024) {
    const q2 = Math.max(0.5, quality - 0.15);
    try { const smaller = await toBlob("image/webp", q2); if (smaller.size < blob.size) blob = smaller; } catch {}
  }
  return blob;
}

// Legacy: dataURL for fallback / local preview
export async function compressImage(file: File, maxW = 1600, quality = 0.72): Promise<string> {
  const blob = await compressImageToBlob(file, maxW, quality);
  return await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

export async function compressVideoToDataUrl(file: File, maxMB = 25): Promise<string> {
  if (file.size > maxMB * 1024 * 1024) throw new Error(`Video max ${maxMB}MB`);
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
