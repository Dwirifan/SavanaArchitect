"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const CATS = ["All", "Table", "Chair", "Shelf", "Light"];

export default function ObjectsPage() {
  const [cms, setCms] = useState<CMS | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadCMS().then(setCms);
    const h = () => { loadCMS().then(setCms); };
    window.addEventListener("savana:update", h);
    return () => window.removeEventListener("savana:update", h);
  }, []);

  if (!cms) return null;
  const list = filter === "All" ? cms.products : cms.products.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-10 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-[var(--line)]">
          <div>
            <Link href="/#objects" className="inline-flex items-center gap-1.5 t-label opacity-30 hover:opacity-60 transition-opacity"><ArrowLeftIcon className="w-3.5 h-3.5" /> Back to home</Link>
            <h1 className="font-serif mt-3" style={{ fontSize: "clamp(38px,5vw,64px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}>Objects</h1>
            <p className="t-label opacity-25 mt-3 normal-case tracking-[0.06em]">{cms.products.length} editions A Reclaimed teak A Local clay</p>
          </div>
          <div className="flex flex-wrap gap-px p-px bg-[var(--line)] border border-[var(--line)]">
            {CATS.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`px-3.5 py-1.5 text-[10px] tracking-[0.16em] uppercase transition-colors ${filter === c ? "bg-[var(--ink)] text-[var(--bg)]" : "bg-[var(--card)] opacity-40 hover:opacity-70"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {list.map((prod) => (
            <Link href={`/objects/${prod.id}`} key={prod.id} className="group cursor-pointer bg-[var(--card)] flex flex-col border border-transparent hover:border-[var(--line)] transition-colors block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={prod.image} alt={prod.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                {!prod.inStock && <span className="absolute top-2 right-2 px-2 py-1 bg-[var(--ink)] text-[var(--bg)] text-[9px] tracking-[0.14em] uppercase">Pre-order</span>}
              </div>
              <div className="flex-1 flex flex-col px-4 py-3.5">
                <div className="section-kicker opacity-25 text-[9px]">{prod.category}</div>
                <h3 className="font-serif text-[15px] leading-tight mt-1">{prod.name}</h3>
                <div className="section-kicker opacity-20 text-[9px] mt-1 truncate normal-case tracking-[0.04em]">{prod.material} A {prod.dimensions}</div>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium opacity-70">{prod.price}</span>
                  <span className="inline-flex items-center gap-1 section-kicker opacity-30 text-[9px]">View <ArrowUpRightIcon className="w-3 h-3" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && <div className="py-20 text-center t-label opacity-20">No objects in this category</div>}
      </main>
      <Footer />
    </div>
  );
}
