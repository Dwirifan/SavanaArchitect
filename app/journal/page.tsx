"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function JournalPage() {
  const [cms, setCms] = useState<CMS | null>(null);
  useEffect(() => { loadCMS().then(setCms); }, []);
  if (!cms) return null;
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-10 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-[var(--line)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 t-label opacity-30 hover:opacity-60 transition-opacity"><ArrowLeftIcon className="w-3.5 h-3.5" /> Back to home</Link>
            <h1 className="font-serif mt-3" style={{ fontSize: "clamp(38px,5vw,64px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}>Journal</h1>
            <p className="t-label opacity-25 mt-3 normal-case tracking-[0.06em]">Field notes · material, light, site — {cms.journal.length} entries</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {cms.journal.map((j) => (
            <Link key={j.id} href={`/journal/${j.id}`} className="group relative aspect-[4/5] overflow-hidden bg-[var(--bg)] block">
              <img src={j.image} alt={j.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3 left-3"><span className="px-2 py-1 bg-white text-black text-[9px] tracking-[0.14em] uppercase font-medium">{j.tag}</span></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="t-label text-white/60 text-[8px] tracking-[0.13em]">{j.date}</div>
                <h3 className="font-serif text-[14px] md:text-[15px] leading-[1.25] line-clamp-2 mt-1">{j.title}</h3>
                <p className="t-body text-white/65 text-[11px] leading-[1.55] mt-1.5 line-clamp-2 hidden sm:block">{j.excerpt.replace(/<[^>]*>/g, "").slice(0,120)}</p>
              </div>
            </Link>
          ))}
        </div>
        {cms.journal.length === 0 && <div className="py-20 text-center t-label opacity-20">No entries yet</div>}
      </main>
      <Footer />
    </div>
  );
}
