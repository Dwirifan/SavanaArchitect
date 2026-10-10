"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function WorkDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [cms, setCms] = useState<CMS | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadCMS().then(setCms);
  }, []);

  // lightbox keyboard
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(v => v !== null ? Math.min(v + 1, (cms?.projects.find(p=>p.id===id)?.images.length ?? 1) -1) : v);
      if (e.key === "ArrowLeft") setLightbox(v => v !== null ? Math.max(v - 1, 0) : v);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox, cms, id]);

  if (!cms) return null;
  const project = cms.projects.find(p => p.id === id);
  const idx = cms.projects.findIndex(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <Navbar />
        <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-20">
          <p className="font-serif text-xl">Project not found.</p>
          <button onClick={() => router.back()} className="mt-4 underline t-label">Go back</button>
        </main>
        <Footer />
      </div>
    );
  }

  const total = cms.projects.length;
  const next = cms.projects[(idx + 1) % total];
  const PREVIEW_GRID = 12;
  const visible = showAll ? project.images : project.images.slice(0, PREVIEW_GRID);
  const remaining = project.images.length - PREVIEW_GRID;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />

      <main className="flex-1 w-full pt-10 pb-24">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
          <Link href="/works" className="inline-flex items-center gap-2 t-label text-[10px] tracking-[0.14em] uppercase opacity-40 hover:opacity-100 transition-opacity group">
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to projects
          </Link>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 mt-8 md:mt-10">
          <div className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.16em] uppercase opacity-40 mb-6">
            <span className="font-mono">{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <span className="w-6 h-px bg-[var(--line-strong)] opacity-40" />
            <span className="px-2.5 py-1 border border-[var(--line)] bg-[var(--card)] tracking-[0.14em]">{project.category}</span>
            <span className="px-2.5 py-1 bg-[var(--ink)] text-[var(--bg)] tracking-[0.14em]">{project.status}</span>
            <span className="hidden sm:inline normal-case tracking-[0.04em] opacity-50 ml-1">{project.location} · {project.year}</span>
          </div>

          <div className="flex flex-col gap-6 md:gap-7">
            <h1 className="font-serif font-[300] leading-[0.88] tracking-[-0.04em] text-balance" style={{ fontSize: "clamp(34px, 5.2vw, 68px)" }}>
              {project.title}
            </h1>
            <div className="max-w-[75%]">
              <p className="font-serif text-[16px] md:text-[17px] leading-[1.7] tracking-[-0.01em] opacity-75 text-pretty">
                <span className="float-left font-serif font-bold text-[36px] leading-[0.8] mr-2 mt-1 opacity-90">{project.excerpt.charAt(0)}</span>
                {project.excerpt.slice(1)}
              </p>
              {project.area && (
                <div className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase opacity-40 border-t border-[var(--line)] pt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] opacity-20" /> {project.area} · {project.year}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 md:mt-10 h-px bg-[var(--line)]" />
        </div>

        <div className="w-full mt-8 md:mt-10">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8 lg:px-12">
            <button onClick={() => setLightbox(0)} className="relative w-full overflow-hidden bg-[var(--card)] group text-left">
              <img src={project.cover} alt={project.title} className="w-full h-auto object-cover max-h-[86vh] group-hover:scale-[1.01] transition-transform duration-700" />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur text-white font-mono text-[10px] tracking-[0.12em]">COVER — click to enlarge</div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 mt-10 md:mt-14">
          <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
            <div className="lg:sticky lg:top-24 order-2 lg:order-1">
              {/* minimal facts — hairline only, no card */}
              <div className="border-t border-[var(--line-strong)] pt-4">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-30">Project facts</span>
                <dl className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  <div className="flex justify-between gap-4 py-3.5">
                    <dt className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-35">Location</dt>
                    <dd className="font-serif text-[13px] leading-none text-right opacity-80">{project.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3.5">
                    <dt className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-35">Year</dt>
                    <dd className="font-serif text-[13px] opacity-80">{project.year}</dd>
                  </div>
                  {project.area && (
                    <div className="flex justify-between gap-4 py-3.5">
                      <dt className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-35">Area</dt>
                      <dd className="font-serif text-[13px] opacity-80">{project.area}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 py-3.5">
                    <dt className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-35">Category</dt>
                    <dd className="font-mono text-[11px] tracking-[0.08em] uppercase opacity-60">{project.category}</dd>
                  </div>
                </dl>
              </div>
              {next && (
                <Link href={`/works/${next.id}`} className="mt-3 flex items-center justify-between py-3 border-b border-[var(--line)] group">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-30 group-hover:opacity-60 transition-opacity">Next — {next.title}</span>
                  <ArrowLeftIcon className="w-3.5 h-3.5 rotate-180 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                </Link>
              )}
            </div>

            {/* Gallery grid + lightbox */}
            {project.images && project.images.length > 0 ? (
              <div className="order-1 lg:order-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-30">Site frames — {project.images.length}</span>
                  <span className="font-mono text-[10px] opacity-30 hidden sm:inline">Click to enlarge · ESC to close</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {visible.map((img, i) => (
                    <button key={i} onClick={() => setLightbox(i)} className="group relative aspect-[4/3] overflow-hidden bg-[var(--card)] border border-[var(--line)] text-left">
                      <img src={img} alt={`${project.title} ${String(i + 1).padStart(2,"0")}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/55 backdrop-blur text-white font-mono text-[9px] tracking-[0.12em]">{String(i+1).padStart(2,"0")}</span>
                      <span className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-mono text-[9px] text-white/80 tracking-[0.08em]">View</span>
                      </span>
                    </button>
                  ))}
                </div>
                {!showAll && remaining > 0 && (
                  <button onClick={() => setShowAll(true)} className="mt-3 w-full py-3 border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)] transition-colors font-mono text-[11px] tracking-[0.14em] uppercase">
                    Show all {project.images.length} frames <span className="opacity-50">({remaining} more)</span>
                  </button>
                )}
                {showAll && project.images.length > PREVIEW_GRID && (
                  <button onClick={() => setShowAll(false)} className="mt-3 w-full py-3 border border-[var(--line)] hover:bg-[var(--card)] transition-colors font-mono text-[11px] tracking-[0.14em] uppercase opacity-60 hover:opacity-100">
                    Show less
                  </button>
                )}
              </div>
            ) : (
              <div className="order-1 lg:order-2 py-16 text-center border border-dashed border-[var(--line)] t-label opacity-20">No gallery yet</div>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 shrink-0">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/60">{project.title} — {String(lightbox+1).padStart(2,"0")} / {String(project.images.length).padStart(2,"0")}</span>
            <button onClick={() => setLightbox(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"><XMarkIcon className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 min-h-0">
            <button onClick={() => setLightbox(v => v !== null ? Math.max(0, v-1) : v)} disabled={lightbox===0} className="absolute left-2 md:left-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:pointer-events-none grid place-items-center text-white transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
            <img src={project.images[lightbox]} alt="" className="max-w-full max-h-full object-contain shadow-2xl" />
            <button onClick={() => setLightbox(v => v !== null ? Math.min(project.images.length-1, v!+1) : v)} disabled={lightbox===project.images.length-1} className="absolute right-2 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:pointer-events-none grid place-items-center text-white transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
          </div>
          <div className="px-4 md:px-6 py-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <span className="font-mono text-[10px] tracking-[0.12em] text-white/40">← → to navigate · ESC to close</span>
            <span className="font-mono text-[10px] text-white/30 hidden sm:inline">{project.location} · {project.year}</span>
          </div>
          {/* click backdrop to close */}
          <button onClick={() => setLightbox(null)} className="absolute inset-0 -z-10" aria-label="close" />
        </div>
      )}

      <Footer />
    </div>
  );
}
