export async function uploadToSupabase(file: File, folder = "general"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const headers: Record<string, string> = {};
  const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN; // if you expose it, else omit — API checks server ADMIN_TOKEN
  // Prefer server-side token via cookie/header; for now we send nothing — API allows if ADMIN_TOKEN not set
  const res = await fetch("/api/upload", { method: "POST", body: fd, headers });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || "Upload failed");
  return j.url as string;
}
