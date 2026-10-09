"use client";
import { useRef, useState } from "react";
import { PhotoIcon, VideoCameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import { compressImageToBlob } from "@/lib/compress";
import { uploadToSupabase } from "@/lib/upload";

export function MediaGallery({
  images, onImagesChange,
  videos, onVideosChange,
  maxImages, maxVideos,
  label = "Galeri",
  folder = "gallery",
  cover, onCoverChange,
}: {
  images: string[]; onImagesChange: (v: string[]) => void;
  videos?: string[]; onVideosChange?: (v: string[]) => void;
  maxImages: number; maxVideos?: number;
  label?: string;
  folder?: string;
  cover?: string; onCoverChange?: (url: string) => void;
}) {
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleImages = async (files: FileList) => {
    const remaining = maxImages - images.length;
    const list = Array.from(files).slice(0, remaining);
    if (list.length === 0) return alert(`Maks ${maxImages} foto`);
    setBusy(true);
    const out: string[] = [];
    for (let i = 0; i < list.length; i++) {
      setProgress(`Mengupload ${i + 1}/${list.length}...`);
      try {
        const blob = await compressImageToBlob(list[i], 1600, 0.7);
        const f = new File([blob], list[i].name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
        const url = await uploadToSupabase(f, `${folder}/images`);
        out.push(url);
      } catch (e: any) { alert(e.message); }
    }
    const next = [...images, ...out];
    onImagesChange(next);
    if (onCoverChange && !cover && next.length) onCoverChange(next[0]);
    setBusy(false); setProgress("");
  };

  const handleVideos = async (files: FileList) => {
    if (!onVideosChange || !videos) return;
    const remaining = (maxVideos ?? 0) - videos.length;
    const list = Array.from(files).slice(0, remaining);
    if (list.length === 0) return alert(`Maks ${maxVideos} video`);
    setBusy(true);
    const out: string[] = [];
    for (let i = 0; i < list.length; i++) {
      setProgress(`Mengupload video ${i + 1}/${list.length}...`);
      try {
        if (list[i].size > 25 * 1024 * 1024) throw new Error(`Video ${list[i].name} max 25MB`);
        const url = await uploadToSupabase(list[i], `${folder}/videos`);
        out.push(url);
      } catch (e: any) { alert(e.message); }
    }
    onVideosChange([...videos, ...out]);
    setBusy(false); setProgress("");
  };

  const removeImage = (idx: number) => {
    const removed = images[idx];
    const next = images.filter((_, i) => i !== idx);
    onImagesChange(next);
    if (onCoverChange && cover === removed) onCoverChange(next[0] ?? "");
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length) await handleImages(files);
  };

  const blocked = busy || images.length >= maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase opacity-50">{label}</span>
        <span className="text-[11px] opacity-40">{images.length}/{maxImages}{maxVideos ? ` · ${(videos?.length ?? 0)}/${maxVideos} video` : ""}</span>
      </div>

      {(images.length > 0 || (videos && videos.length > 0)) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((src, idx) => {
            const isCover = onCoverChange ? cover === src : false;
            return (
              <div key={idx} className={`relative group aspect-square rounded-xl overflow-hidden border bg-[var(--bg)] ${isCover ? "border-amber-500 ring-2 ring-amber-400/40" : "border-[var(--line)]"}`}>
                <img src={src} className="w-full h-full object-cover" alt="" />
                {onCoverChange && (
                  <button
                    type="button"
                    onClick={() => onCoverChange(src)}
                    title={isCover ? "Cover terpilih" : "Jadikan cover"}
                    className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full flex items-center justify-center border backdrop-blur transition-all ${isCover ? "bg-amber-500 border-amber-500 text-white shadow" : "bg-black/45 border-white/20 text-white hover:bg-amber-500 hover:border-amber-500"}`}
                  >
                    {isCover ? <StarSolid className="w-3.5 h-3.5" /> : <StarIcon className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button onClick={() => removeImage(idx)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><XMarkIcon className="w-3.5 h-3.5" /></button>
                <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">{idx + 1}</span>
                {isCover && <span className="absolute bottom-1.5 right-1.5 text-[8px] tracking-widest uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">Cover</span>}
              </div>
            );
          })}
          {videos?.map((src, idx) => (
            <div key={`v-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-[var(--line)] bg-black">
              <video src={src} className="w-full h-full object-cover" muted />
              <div className="absolute inset-0 flex items-center justify-center"><VideoCameraIcon className="w-6 h-6 text-white/80" /></div>
              <button onClick={() => onVideosChange!(videos.filter((_, i) => i !== idx))} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><XMarkIcon className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Premium drag & drop area — mirip single ImageUpload */}
      <div
        onDragOver={e => { e.preventDefault(); if (!blocked) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !blocked && imgRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 py-7 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-[var(--ink)] bg-[var(--bg)]" : "border-[var(--line)] hover:border-[var(--line-strong)] hover:bg-[var(--bg)]/50"} ${blocked ? "opacity-40 pointer-events-none" : ""} ${busy ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center">
          <PhotoIcon className="w-5 h-5 opacity-40" />
        </div>
        <p className="text-sm opacity-70">{busy ? progress || "Mengupload..." : images.length === 0 ? "Klik atau drag & drop foto" : "Klik atau drag untuk tambah foto"}</p>
        <p className="text-[11px] opacity-40">{images.length >= maxImages ? `Maks ${maxImages} foto tercapai` : `${images.length}/${maxImages} foto · bisa pilih banyak sekaligus`}</p>
      </div>

      {maxVideos !== undefined && maxVideos > 0 && (
        <button
          type="button"
          disabled={busy || (videos?.length ?? 0) >= (maxVideos ?? 0)}
          onClick={() => vidRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--card)] text-xs disabled:opacity-40 transition-colors"
        >
          <VideoCameraIcon className="w-4 h-4 opacity-60" /> Tambah Video ({videos?.length ?? 0}/{maxVideos})
        </button>
      )}

      <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleImages(e.target.files)} />
      <input ref={vidRef} type="file" accept="video/*" multiple className="hidden" onChange={e => e.target.files && handleVideos(e.target.files)} />
    </div>
  );
}
