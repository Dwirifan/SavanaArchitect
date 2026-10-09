"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PencilSquareIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CMS, Journal } from "@/lib/cms";
import { AdminModal } from "./AdminModal";
import { ImageUpload } from "./ImageUpload";
const TinyEditor = dynamic(() => import("./TinyEditor").then(m => m.TinyEditor), { ssr: false });

const FIELD = "w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors text-[var(--ink)]";
const LABEL = "text-xs tracking-widest uppercase opacity-50 block mb-1";

export function JournalModal({ cms, onSave }: { cms: CMS; onSave: (c: CMS) => void }) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Journal>>({ title:"", date:"", tag:"Essay", image:"", excerpt:"" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewItem = preview ? cms.journal.find(j => j.id === preview) ?? null : null;

  const openNew = () => { setEditing(null); setForm({ title:"", date:new Date().toLocaleDateString("id-ID"), tag:"Essay", image:"", excerpt:"" }); setView("form"); };
  const openEdit = (j: Journal) => { setEditing(j.id); setForm(j); setView("form"); };
  const submit = () => {
    if (!form.title || !form.image) return alert("Judul & image wajib");
    if (editing) onSave({ ...cms, journal: cms.journal.map(x => x.id === editing ? { ...x, ...form } as Journal : x) });
    else { const n: Journal = { id: Date.now().toString(), title: form.title!, date: form.date || new Date().toLocaleDateString("id-ID"), tag: form.tag || "Essay", image: form.image!, excerpt: form.excerpt || "" }; onSave({ ...cms, journal: [n, ...cms.journal] }); }
    setView("list");
  };
  const doDelete = (id: string) => { onSave({ ...cms, journal: cms.journal.filter(j => j.id !== id) }); setDeleteConfirm(null); };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm opacity-50">{cms.journal.length} artikel</p>
              <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm hover:opacity-90 transition-opacity">
                <PlusIcon className="w-4 h-4" /> Tulis Jurnal
              </button>
            </div>
            <div className="space-y-1">
              {cms.journal.map((j, i) => (
                <motion.div key={j.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex gap-3 items-center py-3 px-3 rounded-xl hover:bg-[var(--bg)] group cursor-pointer transition-colors" onClick={() => setPreview(j.id)}>
                  <img src={j.image} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[var(--line)]" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-serif truncate">{j.title}</div>
                    <div className="text-[11px] opacity-40 uppercase tracking-widest mt-0.5">{j.tag} · {j.date}</div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(j); }} className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--card)] bg-[var(--card)]"><PencilSquareIcon className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(j.id); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"><TrashIcon className="w-3.5 h-3.5" /></button>
                  </div>
                </motion.div>
              ))}
              {cms.journal.length === 0 && <p className="text-sm opacity-40 text-center py-8 border border-dashed border-[var(--line)] rounded-xl">Belum ada jurnal.</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }} className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 md:p-8">
            <button onClick={() => setView("list")} className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 mb-4 transition-opacity"><ArrowLeftIcon className="w-3.5 h-3.5" /> Kembali ke Daftar</button>
            <h3 className="font-serif text-xl mb-5">{editing ? "Edit Jurnal" : "Tulis Jurnal Baru"}</h3>
            <div className="space-y-4">
              <div><label className={LABEL}>Judul Artikel</label><input value={form.title||""} onChange={e=> setForm({...form, title:e.target.value})} placeholder="cth: Mengapa bata ekspos lebih baik..." className={FIELD} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={LABEL}>Kategori / Tag</label><input value={form.tag||""} onChange={e=> setForm({...form, tag:e.target.value})} placeholder="Essay" className={FIELD} /></div>
                <div><label className={LABEL}>Tanggal</label><input value={form.date||""} onChange={e=> setForm({...form, date:e.target.value})} placeholder="12 Mar 2024" className={FIELD} /></div>
              </div>
              <ImageUpload value={form.image||""} onChange={v=> setForm({...form, image:v})} label="Cover Image (Upload)" />
              <div><label className={LABEL}>Isi / Ringkasan (TinyMCE)</label><TinyEditor value={form.excerpt||""} onChange={v=> setForm({...form, excerpt:v})} placeholder="Tulis isi artikel..." /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=> setView("list")} className="flex-1 py-3 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)] transition-colors text-sm">Batal</button>
                <button onClick={submit} className="flex-1 py-3 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 transition-opacity text-sm">{editing ? "Simpan Perubahan" : "Terbitkan Jurnal"}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminModal open={!!deleteConfirm} onClose={()=> setDeleteConfirm(null)} title="Hapus Jurnal?" size="sm" variant="modal"
        footer={<><button onClick={()=> setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm hover:bg-[var(--bg)]">Batal</button><button onClick={()=> doDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600">Hapus</button></>}>
        <p className="text-sm opacity-70">Jurnal ini akan dihapus permanen.</p>
      </AdminModal>
      <AdminModal open={!!preview} onClose={()=> setPreview(null)} title="Preview Jurnal" size="md" variant="sidebar"
        footer={previewItem ? <button onClick={()=> { const j=previewItem; setPreview(null); openEdit(j); }} className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 text-sm">Edit Jurnal</button> : null}>
        {previewItem && (<div className="space-y-6"><img src={previewItem.image} className="w-full aspect-[16/9] object-cover rounded-xl border border-[var(--line)]" alt="" /><div><h4 className="font-serif text-2xl">{previewItem.title}</h4><p className="text-sm opacity-60 mt-2">{previewItem.tag} · {previewItem.date}</p></div><div><div className="text-sm opacity-80 leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-a:underline" dangerouslySetInnerHTML={{__html: previewItem.excerpt||"Tidak ada isi."}} /></div></div>)}
      </AdminModal>
    </div>
  );
}
export { JournalModal as JournalTab };
