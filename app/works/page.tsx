"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const CATS = ["All", "Residential", "Hospitality", "Cultural", "Commercial", "Studio"];

export default function WorksPage() {
  const [cms, setCms] = useState<CMS | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadCMS().then(setCms);
    const h = () => { loadCMS().then(setCms); };
    window.addEventListener("savana:update", h);
    return () => window.removeEventListener("savana:update", h);
  }, []);

  if (!cms) return null;
  const list = filter === "All" ? cms.projects : cms.projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-10 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-[var(--line)]">
          <div>
            <Link href="/#works" className="inline-flex items-center gap-1.5 t-label opacity-30 hover:opacity-60 transition-opacity"><ArrowLeftIcon className="w-3.5 h-3.5" /> Back to home</Link>
            <h1 className="font-serif mt-3" style={{ fontSize: "clamp(38px,5vw,64px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}>Works</h1>
            <p className="t-label opacity-25 mt-3 normal-case tracking-[0.06em]">{cms.projects.length} {cms.projects.length === 1 ? "work" : "works"} · Since 2018</p>
          </div>
          <div className="flex flex-wrap gap-px p-px bg-[var(--line)] border border-[var(--line)]">
            {CATS.filter((c) => c === "All" ? true : cms.projects.some((p) => p.category === c)).map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`px-3.5 py-1.5 text-[10px] tracking-[0.16em] uppercase transition-colors ${filter === c ? "bg-[var(--ink)] text-[var(--bg)]" : "bg-[var(--card)] opacity-40 hover:opacity-70"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((p, i) => (
            <Link href={`/works/${p.id}`} key={p.id} className="group cursor-pointer bg-[var(--card)] overflow-hidden border border-transparent hover:border-[var(--line)] transition-colors block">
              <div className="relative h-[240px] overflow-hidden">
                <img src={p.cover} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                <div className="absolute top-3 left-3 t-label text-white opacity-40 bg-black/30 px-2 py-1 backdrop-blur">{String(i + 1).padStart(2, "0")}</div>
                <div className="absolute top-3 right-3 t-label text-white opacity-40 bg-black/30 px-2 py-1 backdrop-blur">{p.status}</div>
              </div>
              <div className="px-4 py-4">
                <div className="t-label opacity-25">{p.category} A {p.location} A {p.year}</div>
                <div className="font-serif text-[16px] mt-1">{p.title}</div>
                <div className="t-small opacity-30 mt-1 line-clamp-2 leading-relaxed">{p.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && <div className="py-20 text-center t-label opacity-20">No projects in this category</div>}
      </main>
      <Footer />
    </div>
  );
}
