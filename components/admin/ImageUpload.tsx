"use client";
import { useRef, useState } from "react";
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { compressImageToBlob } from "@/lib/compress";
import { uploadToSupabase } from "@/lib/upload";

export function ImageUpload({ value, onChange, label = "Cover Image", folder = "covers" }: { value: string; onChange: (v: string) => void; label?: string; folder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return alert("File harus gambar");
    setBusy(true);
    try {
      const blob = await compressImageToBlob(file, 1600, 0.72);
      // upload compressed webp to Vercel Blob via API
      const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
      const url = await uploadToSupabase(compressedFile, folder);
      onChange(url);
    } catch (e: any) {
      alert(e.message || "Gagal upload");
    }
    setBusy(false);
  };

  const onInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await handleFile(f);
    e.target.value = "";
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) await handleFile(f);
  };

  return (
    <div>
      <div className="text-xs tracking-widest uppercase opacity-50 block mb-1">{label}</div>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-[var(--line)]">
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 disabled:opacity-50">{busy?"Uploading...":"Ganti"}</button>
            <button type="button" onClick={() => onChange("")} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !busy && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-[var(--ink)] bg-[var(--bg)]" : "border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[var(--bg)]/50"} ${busy?"opacity-60 pointer-events-none":""}`}
        >
          <div className="w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center">
            <PhotoIcon className="w-5 h-5 opacity-40" />
          </div>
          <p className="text-sm opacity-70 flex items-center gap-1.5"><ArrowUpTrayIcon className="w-3.5 h-3.5" /> {busy?"Mengupload...":"Klik atau drag & drop gambar"}</p>
          <p className="text-[11px] opacity-40">Auto-kompres → WebP 1600px · ringan & cepat</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInput} />
      {/* fallback paste URL */}
      <input
        value={value.includes("supabase.co") || value.startsWith("data:") ? "" : value}
        onChange={e => onChange(e.target.value)}
        placeholder="atau paste URL https://..."
        className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:border-[var(--ink)] placeholder:opacity-40"
      />
    </div>
  );
}
