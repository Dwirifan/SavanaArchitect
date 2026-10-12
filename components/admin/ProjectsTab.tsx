"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PencilSquareIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CMS, Project } from "@/lib/cms";
import { AdminModal } from "./AdminModal";
import { MediaGallery } from "./MediaGallery";
const TinyEditor = dynamic(() => import("./TinyEditor").then(m => m.TinyEditor), { ssr: false });

const FIELD = "w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors text-[var(--ink)]";
const LABEL = "text-xs tracking-widest uppercase opacity-50 block mb-1";

export function ProjectsModal({ cms, onSave }: { cms: CMS; onSave: (c: CMS) => void }) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({ title:"", location:"", year:"2025", category:"Residential", cover:"", images:[], videos:[], excerpt:"", area:"", status:"Built" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewItem = preview ? cms.projects.find(p => p.id === preview) ?? null : null;

  const openNew = () => {
    setEditing(null);
    setForm({ title:"", location:"", year:new Date().getFullYear().toString(), category:"Residential", cover:"", images:[], videos:[], excerpt:"", area:"", status:"Built" });
    setView("form");
  };
  const openEdit = (p: Project) => { setEditing(p.id); setForm(p); setView("form"); };
  const submit = () => {
    const cover = form.cover || form.images?.[0] || "";
    if (!form.title || !cover) return alert("Judul & minimal 1 foto wajib diisi");
    const payload: Project = {
      id: editing || Date.now().toString(),
      title: form.title!, location: form.location || "-", year: form.year || "2025",
      category: form.category || "Residential", cover, images: (form.images||[]).slice(0,100), videos: (form.videos||[]).slice(0,4),
      excerpt: form.excerpt || "", area: form.area, status: (form.status as any) || "Built",
    };
    if (editing) onSave({ ...cms, projects: cms.projects.map(p => p.id === editing ? payload : p) });
    else onSave({ ...cms, projects: [payload, ...cms.projects] });
    setView("list");
  };
  const doDelete = (id: string) => { onSave({ ...cms, projects: cms.projects.filter(p => p.id !== id) }); setDeleteConfirm(null); };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm opacity-50">{cms.projects.length} projects</p>
              <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm hover:opacity-90 transition-opacity"><PlusIcon className="w-4 h-4" /> Tambah Project</button>
            </div>
            <div className="space-y-1">
              {cms.projects.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex gap-3 items-center py-3 px-3 rounded-xl hover:bg-[var(--bg)] group cursor-pointer transition-colors" onClick={() => setPreview(p.id)}>
                  <img src={p.cover} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[var(--line)]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.title}</div>
                    <div className="text-[11px] opacity-40 uppercase tracking-widest mt-0.5">{p.category} · {p.year} · {(p.images?.length||0)} foto {(p.videos?.length||0)>0 ? `· ${p.videos?.length} video` : ""}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} className="p-2 rounded-lg border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] active:scale-95 transition" aria-label="Edit"><PencilSquareIcon className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(p.id); }} className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition" aria-label="Delete"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
              {cms.projects.length === 0 && <p className="text-sm opacity-40 text-center py-8 border border-dashed border-[var(--line)] rounded-xl">Belum ada project.</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 md:p-8">
            <button onClick={() => setView("list")} className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 mb-4 transition-opacity"><ArrowLeftIcon className="w-3.5 h-3.5" /> Kembali ke Daftar</button>
            <h3 className="font-serif text-xl mb-5">{editing ? "Edit Project" : "Tambah Project"}</h3>
            <div className="space-y-4">
              <div><label className={LABEL}>Judul Project</label><input value={form.title||""} onChange={e=> setForm({...form, title:e.target.value})} placeholder="cth: Rumah Tepi Sawah" className={FIELD} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={LABEL}>Lokasi</label><input value={form.location||""} onChange={e=> setForm({...form, location:e.target.value})} placeholder="Ubud, Bali" className={FIELD} /></div>
                <div><label className={LABEL}>Tahun</label><input value={form.year||""} onChange={e=> setForm({...form, year:e.target.value})} placeholder="2025" className={FIELD} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={LABEL}>Kategori</label><select value={form.category} onChange={e=> setForm({...form, category:e.target.value})} className={FIELD+" appearance-none"}><option>Residential</option><option>Hospitality</option><option>Commercial</option><option>Cultural</option><option>Studio</option></select></div>
                <div><label className={LABEL}>Status</label><select value={form.status} onChange={e=> setForm({...form, status:e.target.value as any})} className={FIELD+" appearance-none"}><option>Built</option><option>Ongoing</option><option>Concept</option></select></div>
                <div><label className={LABEL}>Luas Area</label><input value={form.area||""} onChange={e=> setForm({...form, area:e.target.value})} placeholder="420 m²" className={FIELD} /></div>
              </div>
              <MediaGallery images={form.images||[]} onImagesChange={v=> setForm(s=> ({...s, images:v}))} videos={form.videos||[]} onVideosChange={v=> setForm(s=> ({...s, videos:v}))} maxImages={100} maxVideos={4} label="Foto Project" folder="projects" cover={form.cover} onCoverChange={v=> setForm(s=> ({...s, cover:v}))} />
              <div><label className={LABEL}>Deskripsi / Konten (Rich Text)</label><TinyEditor value={form.excerpt||""} onChange={v=> setForm({...form, excerpt:v})} placeholder="Ceritakan konsepnya..." /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=> setView("list")} className="flex-1 py-3 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)] transition-colors text-sm">Batal</button>
                <button onClick={submit} className="flex-1 py-3 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 transition-opacity text-sm">{editing ? "Simpan Perubahan" : "Simpan Project"}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AdminModal open={!!deleteConfirm} onClose={()=> setDeleteConfirm(null)} title="Hapus Project?" size="sm" variant="modal"
        footer={<><button onClick={()=> setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm hover:bg-[var(--bg)]">Batal</button><button onClick={()=> doDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600">Hapus</button></>}>
        <p className="text-sm opacity-70">Project ini akan dihapus permanen.</p>
      </AdminModal>
      <AdminModal open={!!preview} onClose={()=> setPreview(null)} title="Preview Project" size="md" variant="sidebar"
        footer={previewItem ? <button onClick={()=> { const p=previewItem; setPreview(null); openEdit(p); }} className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 text-sm">Edit Project</button> : null}>
        {previewItem && (<div className="space-y-6"><img src={previewItem.cover} className="w-full aspect-[4/3] object-cover rounded-xl border border-[var(--line)]" alt="" /><div><h4 className="font-serif text-2xl">{previewItem.title}</h4><p className="text-sm opacity-60 mt-1">{previewItem.category} · {previewItem.location} · {previewItem.year}</p></div><div className="grid grid-cols-2 gap-4 border-y border-[var(--line)] py-4"><div><div className="text-[10px] tracking-widest uppercase opacity-40">Status</div><div className="text-sm mt-1">{previewItem.status}</div></div><div><div className="text-[10px] tracking-widest uppercase opacity-40">Luas Area</div><div className="text-sm mt-1">{previewItem.area||"-"}</div></div></div><div><div className="text-[10px] tracking-widest uppercase opacity-40 mb-2">Deskripsi</div><div className="text-sm opacity-80 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: previewItem.excerpt||"Tidak ada deskripsi."}} /></div>{previewItem.images?.length ? <div><div className="text-[10px] tracking-widest uppercase opacity-40 mb-2">Galeri {previewItem.images.length} foto</div><div className="grid grid-cols-3 gap-2">{previewItem.images.slice(0,6).map((s,i)=><img key={i} src={s} className="aspect-square object-cover rounded-lg border border-[var(--line)]" alt=""/>)}</div></div> : null}{previewItem.videos?.length ? <div><div className="text-[10px] tracking-widest uppercase opacity-40 mb-2">Video {previewItem.videos.length}</div>{previewItem.videos.map((v,i)=><video key={i} src={v} controls className="w-full rounded-xl border border-[var(--line)]" />)}</div> : null}</div>)}
      </AdminModal>
    </div>
  );
}
export { ProjectsModal as ProjectsTab };
