export async function compressImageToBlob(file: File, maxW = 1600, quality = 0.72): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxW / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob: Blob = await new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/webp", quality) as any);
  // fallback to jpeg if webp not supported (blob size 0)
  if (blob.size === 0) {
    return await new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/jpeg", quality) as any);
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
