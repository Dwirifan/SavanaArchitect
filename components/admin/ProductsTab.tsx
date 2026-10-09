"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PencilSquareIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CMS, Product } from "@/lib/cms";
import { AdminModal } from "./AdminModal";
import { MediaGallery } from "./MediaGallery";
const TinyEditor = dynamic(() => import("./TinyEditor").then(m => m.TinyEditor), { ssr: false });

const FIELD = "w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors text-[var(--ink)]";
const LABEL = "text-xs tracking-widest uppercase opacity-50 block mb-1";

export function ProductsModal({ cms, onSave }: { cms: CMS; onSave: (c: CMS) => void }) {
  const [view, setView] = useState<"list"|"form">("list");
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState<Partial<Product>>({ name:"", category:"Meja", price:"", material:"", dimensions:"", image:"", images:[], excerpt:"", inStock:true });
  const [deleteConfirm, setDeleteConfirm] = useState<string|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const previewItem = preview ? cms.products.find(p=>p.id===preview) ?? null : null;

  const openNew = () => { setEditing(null); setForm({ name:"", category:"Meja", price:"", material:"", dimensions:"", image:"", images:[], excerpt:"", inStock:true }); setView("form"); };
  const openEdit = (p: Product) => {
    // ensure images contains cover for unified gallery
    const imgs = p.images?.length ? [...p.images] : [];
    if (p.image && !imgs.includes(p.image)) imgs.unshift(p.image);
    setEditing(p.id); setForm({ ...p, images: imgs }); setView("form");
  };
  const submit = () => {
    const cover = form.image || form.images?.[0] || "";
    if (!form.name || !cover) return alert("Nama & minimal 1 foto wajib diisi");
    const payload: Product = {
      id: editing || Date.now().toString(),
      name: form.name!, category: form.category||"Meja", price: form.price||"Rp -", material: form.material||"-", dimensions: form.dimensions||"-",
      image: cover, images: (form.images||[]).slice(0,10), excerpt: form.excerpt||"", inStock: form.inStock ?? true,
    };
    if (editing) onSave({ ...cms, products: cms.products.map(p=> p.id===editing ? payload : p) });
    else onSave({ ...cms, products: [payload, ...cms.products] });
    setView("list");
  };
  const doDelete = (id:string) => { onSave({ ...cms, products: cms.products.filter(p=>p.id!==id)}); setDeleteConfirm(null); };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {view==="list" ? (
          <motion.div key="list" initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:0.28,ease:[0.22,1,0.36,1]}}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm opacity-50">{cms.products.length} produk</p>
              <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm hover:opacity-90 transition-opacity"><PlusIcon className="w-4 h-4"/> Tambah Produk</button>
            </div>
            <div className="space-y-1">
              {cms.products.map((p,i)=>(
                <motion.div key={p.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}} className="flex gap-3 items-center py-3 px-3 rounded-xl hover:bg-[var(--bg)] group cursor-pointer transition-colors" onClick={()=> setPreview(p.id)}>
                  <img src={p.image} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[var(--line)]" alt=""/>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{p.name}</div><div className="text-[11px] opacity-40 uppercase tracking-widest mt-0.5">{p.category} · {p.price} · {(p.images?.length||0)} foto</div></div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${p.inStock ? "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" : "border-[var(--line)] opacity-50"}`}>{p.inStock ? "Ready" : "Pre-Order"}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={e=>{e.stopPropagation(); openEdit(p);}} className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--card)] bg-[var(--card)]"><PencilSquareIcon className="w-3.5 h-3.5"/></button>
                    <button onClick={e=>{e.stopPropagation(); setDeleteConfirm(p.id);}} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"><TrashIcon className="w-3.5 h-3.5"/></button>
                  </div>
                </motion.div>
              ))}
              {cms.products.length===0 && <p className="text-sm opacity-40 text-center py-8 border border-dashed border-[var(--line)] rounded-xl">Belum ada produk.</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}} transition={{duration:0.32,ease:[0.22,1,0.36,1]}} className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 md:p-8">
            <button onClick={()=> setView("list")} className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 mb-4"><ArrowLeftIcon className="w-3.5 h-3.5"/> Kembali ke Daftar</button>
            <h3 className="font-serif text-xl mb-5">{editing ? "Edit Produk" : "Tambah Produk"}</h3>
            <div className="space-y-4">
              <div><label className={LABEL}>Nama Produk</label><input value={form.name||""} onChange={e=> setForm({...form,name:e.target.value})} placeholder="cth: Meja Makan Sora" className={FIELD}/></div>
              <div className="grid grid-cols-2 gap-4"><div><label className={LABEL}>Kategori</label><select value={form.category} onChange={e=> setForm({...form,category:e.target.value})} className={FIELD+" appearance-none"}><option>Meja</option><option>Kursi</option><option>Rak</option><option>Lampu</option><option>Lainnya</option></select></div><div><label className={LABEL}>Harga</label><input value={form.price||""} onChange={e=> setForm({...form,price:e.target.value})} placeholder="Rp 1.750.000" className={FIELD}/></div></div>
              <div className="grid grid-cols-2 gap-4"><div><label className={LABEL}>Material</label><input value={form.material||""} onChange={e=> setForm({...form,material:e.target.value})} placeholder="Jati daur ulang" className={FIELD}/></div><div><label className={LABEL}>Dimensi</label><input value={form.dimensions||""} onChange={e=> setForm({...form,dimensions:e.target.value})} placeholder="180×90×75 cm" className={FIELD}/></div></div>
              <MediaGallery images={form.images||[]} onImagesChange={v=> setForm({...form,images:v})} maxImages={10} label="Foto Produk" folder="products" cover={form.image} onCoverChange={v=> setForm({...form,image:v})} />
              <div><label className={LABEL}>Deskripsi (TinyMCE)</label><TinyEditor value={form.excerpt||""} onChange={v=> setForm({...form,excerpt:v})} placeholder="Cerita materialnya..." /></div>
              <label className="flex items-center gap-3 p-3 border border-[var(--line)] rounded-xl cursor-pointer select-none hover:bg-[var(--bg)] transition-colors"><input type="checkbox" checked={!!form.inStock} onChange={e=> setForm({...form,inStock:e.target.checked})} className="accent-[var(--ink)] w-4 h-4"/><span className="text-sm">Ready Stock <span className="opacity-50">(hilangkan jika Pre-Order)</span></span></label>
              <div className="flex gap-3 pt-2"><button onClick={()=> setView("list")} className="flex-1 py-3 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)] text-sm">Batal</button><button onClick={submit} className="flex-1 py-3 rounded-xl bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 text-sm">{editing ? "Simpan Perubahan" : "Simpan Produk"}</button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AdminModal open={!!deleteConfirm} onClose={()=> setDeleteConfirm(null)} title="Hapus Produk?" size="sm" variant="modal" footer={<><button onClick={()=> setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm">Batal</button><button onClick={()=> doDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm">Hapus</button></>}>
        <p className="text-sm opacity-70">Produk akan dihapus permanen.</p>
      </AdminModal>
      <AdminModal open={!!preview} onClose={()=> setPreview(null)} title="Preview Produk" size="md" variant="sidebar" footer={previewItem ? <button onClick={()=> {const p=previewItem; setPreview(null); openEdit(p);}} className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm">Edit Produk</button> : null}>
        {previewItem && (<div className="space-y-6"><img src={previewItem.image} className="w-full aspect-[4/3] object-cover rounded-xl border border-[var(--line)]" alt=""/><div><h4 className="font-serif text-2xl">{previewItem.name}</h4><p className="text-sm opacity-60 mt-1">{previewItem.category} · {previewItem.price}</p></div><div className="grid grid-cols-2 gap-4 border-y border-[var(--line)] py-4"><div><div className="text-[10px] tracking-widest uppercase opacity-40">Status</div><div className="text-sm mt-1">{previewItem.inStock ? "Ready" : "Pre-Order"}</div></div><div><div className="text-[10px] tracking-widest uppercase opacity-40">Dimensi</div><div className="text-sm mt-1">{previewItem.dimensions||"-"}</div></div></div>{previewItem.images?.length ? <div><div className="text-[10px] tracking-widest uppercase opacity-40 mb-2">Galeri {previewItem.images.length} foto</div><div className="grid grid-cols-3 gap-2">{previewItem.images.map((s,i)=><img key={i} src={s} className="aspect-square object-cover rounded-lg border border-[var(--line)]" alt=""/>)}</div></div> : null}<div><div className="text-[10px] tracking-widest uppercase opacity-40 mb-2">Deskripsi</div><div className="text-sm opacity-80 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: previewItem.excerpt||"Tidak ada deskripsi."}}/></div></div>)}
      </AdminModal>
    </div>
  );
}
export { ProductsModal as ProductsTab };
