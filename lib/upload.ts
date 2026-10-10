export async function uploadToSupabase(file: File, folder = "general"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || `Upload failed ${res.status}`);
  if (!j.url) throw new Error("Upload failed: no URL returned");
  return j.url as string;
}
