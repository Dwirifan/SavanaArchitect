"use client";
import { useEffect, useState } from "react";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Works } from "@/components/landing/Works";
import { Objects } from "@/components/landing/Objects";
import { StudioTeam } from "@/components/landing/Studio";
import { JournalSection } from "@/components/landing/TeamJournal";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const [cms, setCms] = useState<CMS | null>(null);

  useEffect(() => {
    loadCMS().then(setCms);
    const h = () => { loadCMS().then(setCms); };
    window.addEventListener("savana:update", h);
    window.addEventListener("storage", h);
    // bersihkan #hash jika ada (mis. /#journal lama) -> scroll lalu clean URL
    try {
      const raw = window.location.hash.replace(/^#/, "");
      if (raw) {
        const id = decodeURIComponent(raw);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      const target = sessionStorage.getItem("savana:scrollTo");
      if (target) {
        sessionStorage.removeItem("savana:scrollTo");
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    } catch {}
    return () => { window.removeEventListener("savana:update", h); window.removeEventListener("storage", h); };
  }, []);

  if (!cms) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--bg)]">
      <Navbar />
      <main className="flex-1">
        <Hero studio={cms.studio} projects={cms.projects} />
        {/* Pass an empty onSelect to avoid breaking types, but we'll modify the components to use Link */}
        <Works projects={cms.projects} />
        <StudioTeam studio={cms.studio} team={cms.team} />
        <Objects products={cms.products} />
        <Contact studio={cms.studio} />
        <JournalSection journal={cms.journal} />
      </main>
      <Footer />
    </div>
  );
}
