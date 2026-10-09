"use client";
import { useEffect, useState } from "react";
import { CMS } from "@/lib/cms";

export function StudioTab({ cms, onSave }: { cms: CMS, onSave: (c: CMS) => void }) {
  const [s, setS] = useState(cms.studio);
  useEffect(() => setS(cms.studio), [cms.studio]);

  return (
    <div className="bg-[var(--card)] rounded-[20px] border border-[var(--line)] p-6 md:p-8 max-w-3xl text-[var(--ink)]">
      <div className="space-y-5">
        <div>
          <label className="text-xs tracking-widest uppercase opacity-50 block mb-1">Hero title (pakai Enter untuk baris baru)</label>
          <textarea value={s.heroTitle} onChange={e => setS({ ...s, heroTitle: e.target.value })} rows={2} className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase opacity-50 block mb-1">Hero subtitle</label>
          <textarea value={s.heroSubtitle} onChange={e => setS({ ...s, heroSubtitle: e.target.value })} rows={3} className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
        </div>
        
        <div className="rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--bg)] p-5 space-y-4">
          <div className="text-[11px] tracking-[0.14em] uppercase font-semibold opacity-60">Studio headline — 3 baris</div>
          <div>
            <label className="text-xs opacity-60 block mb-1">Baris 1 — headline</label>
            <input value={(s as any).studioHeadline ?? ""} onChange={e => setS({ ...s, studioHeadline: e.target.value } as any)} placeholder="A small studio in a converted warehouse," className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
          </div>
          <div>
            <label className="text-xs opacity-60 block mb-1">Baris 2 — accent (italic)</label>
            <input value={(s as any).studioHeadlineAccent ?? ""} onChange={e => setS({ ...s, studioHeadlineAccent: e.target.value } as any)} placeholder="learning from the site" className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
          </div>
          <div>
            <label className="text-xs opacity-60 block mb-1">Baris 3 — tail</label>
            <input value={(s as any).studioHeadlineTail ?? ""} onChange={e => setS({ ...s, studioHeadlineTail: e.target.value } as any)} placeholder="before we draw." className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
          </div>
          <div>
            <label className="text-xs opacity-60 block mb-1">Quote</label>
            <input value={(s as any).quote ?? ""} onChange={e => setS({ ...s, quote: e.target.value } as any)} placeholder="We keep it small — 4 to 5 houses a year..." className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--bg)] p-5 space-y-4">
          <div className="text-[11px] tracking-[0.14em] uppercase font-semibold opacity-60">Contact CTA</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs opacity-60 block mb-1">Teks Utama</label>
              <input value={s.contactHeadline ?? ""} onChange={e => setS({ ...s, contactHeadline: e.target.value })} placeholder="Let's build" className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
            </div>
            <div>
              <label className="text-xs opacity-60 block mb-1">Teks Accent (Stroke)</label>
              <input value={s.contactHeadlineAccent ?? ""} onChange={e => setS({ ...s, contactHeadlineAccent: e.target.value })} placeholder="something." className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase opacity-50 block mb-1">Tentang studio</label>
          <textarea value={s.about} onChange={e => setS({ ...s, about: e.target.value })} rows={4} className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs opacity-60 block mb-1">Email</label>
            <input value={s.email} onChange={e => setS({ ...s, email: e.target.value })} placeholder="Email" className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
          </div>
          <div>
            <label className="text-xs opacity-60 block mb-1">Telepon</label>
            <input value={s.phone} onChange={e => setS({ ...s, phone: e.target.value })} placeholder="Phone" className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
          </div>
        </div>
        
        <div>
          <label className="text-xs opacity-60 block mb-1">Alamat</label>
          <input value={s.address} onChange={e => setS({ ...s, address: e.target.value })} placeholder="Alamat" className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
        </div>
        
        <div>
          <label className="text-xs opacity-60 block mb-1">Instagram</label>
          <input value={s.instagram} onChange={e => setS({ ...s, instagram: e.target.value })} placeholder="Instagram" className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
        </div>
        
        <div>
          <label className="text-xs tracking-widest uppercase opacity-50 block mb-1">Philosophy (pisah koma)</label>
          <input value={s.philosophy.join(", ")} onChange={e => setS({ ...s, philosophy: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })} className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--ink)] transition-colors" />
        </div>
        
        <button onClick={() => onSave({ ...cms, studio: s })} className="w-full rounded-full bg-[var(--ink)] text-[var(--bg)] py-3.5 text-sm hover:opacity-90 transition-opacity mt-4">Simpan Perubahan</button>
        <p className="text-xs opacity-40 text-center">Perubahan akan langsung tampil di website.</p>
      </div>
    </div>
  );
}
