"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrashIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CMS, TeamMember } from "@/lib/cms";
import { AdminModal } from "./AdminModal";

const FIELD_CLS = "w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors text-[var(--ink)]";
const LABEL_CLS = "text-xs tracking-widest uppercase opacity-50 block mb-1";

export function TeamModal({ cms, onSave }: { cms: CMS; onSave: (c: CMS) => void }) {
  const [form, setForm] = useState<Partial<TeamMember>>({ name: "", role: "", bio: "", image: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [preview, setPreview] = useState<TeamMember | null>(null);

  const openNew = () => { setEditing(null); setForm({ name: "", role: "", bio: "", image: "" }); setOpen(true); };
  const edit = (m: TeamMember) => { setEditing(m.id); setForm(m); setOpen(true); };

  const submit = () => {
    if (!form.name || !form.image) return alert("Nama & foto wajib");
    if (editing) {
      onSave({ ...cms, team: cms.team.map(t => t.id === editing ? { ...t, ...form } as TeamMember : t) });
    } else {
      const n: TeamMember = { id: Date.now().toString(), name: form.name!, role: form.role || "Architect", bio: form.bio || "", image: form.image! };
      onSave({ ...cms, team: [n, ...cms.team] });
    }
    setOpen(false);
  };

  const doDelete = (id: string) => { onSave({ ...cms, team: cms.team.filter(t => t.id !== id) }); setDeleteConfirm(null); };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm opacity-50">{(cms.team || []).length} anggota</p>
        <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm hover:opacity-90 transition-opacity">
          <PlusIcon className="w-4 h-4" /> Tambah Anggota
        </button>
      </div>

      <div className="space-y-1">
        {(cms.team || []).map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex gap-3 items-center py-3 px-3 rounded-xl hover:bg-[var(--bg)] group cursor-pointer transition-colors"
            onClick={() => setPreview(m)}
          >
            <img src={m.image} className="w-12 h-12 rounded-full object-cover shrink-0 border border-[var(--line)]" alt="" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{m.name}</div>
              <div className="text-[11px] opacity-40 uppercase tracking-widest mt-0.5">{m.role}</div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={(e) => { e.stopPropagation(); edit(m); }} className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--card)]"><PencilSquareIcon className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(m.id); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"><TrashIcon className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AdminModal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Anggota Tim" : "Tambah Anggota Tim"} size="md" variant="modal"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm hover:bg-[var(--bg)]">Batal</button>
            <button onClick={submit} className="flex-1 py-2.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm hover:opacity-90">Simpan Profil</button>
          </>
        }
      >
        <div>
          <label className={LABEL_CLS}>Nama</label>
          <input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="cth: Riko Savana" className={FIELD_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Posisi / Role</label>
          <input value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Principal Architect" className={FIELD_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Foto URL</label>
          <input value={form.image || ""} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={FIELD_CLS} />
          {form.image && <img src={form.image} className="w-full h-36 object-cover rounded-xl border border-[var(--line)] mt-2" alt="" />}
        </div>
        <div>
          <label className={LABEL_CLS}>Bio Singkat</label>
          <textarea value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Deskripsi singkat..." className={FIELD_CLS} />
        </div>
      </AdminModal>

      <AdminModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Anggota Tim?" size="sm" variant="modal"
        footer={
          <>
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm hover:bg-[var(--bg)]">Batal</button>
            <button onClick={() => doDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600">Hapus</button>
          </>
        }
      >
        <p className="text-sm opacity-70">Anggota tim ini akan dihapus secara permanen.</p>
      </AdminModal>

      <AdminModal open={!!preview} onClose={() => setPreview(null)} title="Preview Anggota" size="md" variant="sidebar"
        footer={
          <button onClick={() => { setPreview(null); edit(preview!); }} className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 transition-opacity text-sm">Edit Profil</button>
        }
      >
        {preview && (
          <div className="space-y-6 text-center">
            <img src={preview.image} className="w-32 h-32 mx-auto rounded-full object-cover border border-[var(--line)]" alt="" />
            <div>
              <h4 className="font-serif text-2xl">{preview.name}</h4>
              <p className="text-sm opacity-60 mt-1">{preview.role}</p>
            </div>
            <div className="text-left">
              <div className="text-[10px] tracking-widest uppercase opacity-40 mb-2">Bio Singkat</div>
              <p className="text-sm opacity-80 leading-relaxed">{preview.bio || "Tidak ada bio."}</p>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}

export { TeamModal as TeamTab };
