"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function slugify(s: string) {
  return s.toLowerCase().replace(/<[^>]*>/g, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";
}

function extractToc(html: string) {
  const re = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  const items: { id: string; text: string; level: number }[] = [];
  let m: RegExpExecArray | null;
  const seen = new Map<string, number>();
  while ((m = re.exec(html))) {
    const level = Number(m[1]);
    const raw = m[2].replace(/<[^>]*>/g, "").trim();
    if (!raw) continue;
    let id = slugify(raw);
    const c = seen.get(id) ?? 0;
    seen.set(id, c + 1);
    if (c) id = `${id}-${c + 1}`;
    items.push({ id, text: raw, level });
  }
  return items;
}

function injectIds(html: string, toc: { id: string; text: string }[]) {
  let idx = 0;
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (_full, lvl, attrs, inner) => {
    const item = toc[idx++];
    if (!item) return _full;
    // if already has id, keep it
    if (/id=/.test(attrs)) return _full;
    return `<h${lvl}${attrs} id="${item.id}">${inner}</h${lvl}>`;
  });
}

export default function JournalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("from") === "landing";
  const [cms, setCms] = useState<CMS | null>(null);
  const [active, setActive] = useState<string>("");
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => { loadCMS().then(setCms); }, []);
  useEffect(() => {
    try { setBookmarked(!!localStorage.getItem(`savana:bm:${id}`)); } catch {}
  }, [id]);

  const handleBack = () => {
    if (fromLanding) {
      try { sessionStorage.setItem("savana:scrollTo", "journal"); } catch {}
      router.push("/");
      return;
    }
    // coba history back jika ada referrer, fallback ke /journal
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      // fallback jika back tidak berpindah dalam 400ms
      setTimeout(() => {
        if (window.location.pathname.includes("/journal/")) router.push("/journal");
      }, 450);
      return;
    }
    router.push("/journal");
  };

  const entry = cms?.journal.find(j => j.id === id) ?? null;
  const toc = useMemo(() => extractToc(entry?.excerpt || ""), [entry?.excerpt]);
  const html = useMemo(() => injectIds(entry?.excerpt || "<p>Tidak ada konten.</p>", toc), [entry?.excerpt, toc]);
  const others = useMemo(() => cms ? cms.journal.filter(j => j.id !== id).slice(0, 4) : [], [cms, id]);

  // scroll spy
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    toc.forEach(t => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc, html]);

  const toggleBm = () => {
    const next = !bookmarked;
    setBookmarked(next);
    try {
      if (next) localStorage.setItem(`savana:bm:${id}`, "1");
      else localStorage.removeItem(`savana:bm:${id}`);
    } catch {}
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(()=>setCopied(false), 1600); } catch {}
  };

  if (!cms) return null;
  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <Navbar />
        <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-20"><p>Artikel tidak ditemukan.</p><Link href="/journal" className="mt-4 underline inline-block">Kembali ke Journal</Link></main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />
      <main className="flex-1 w-full pt-10 pb-24">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
          <button onClick={handleBack} className="inline-flex items-center gap-2 t-label opacity-40 hover:opacity-100 transition-all duration-300 group">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {fromLanding ? "Back to home" : "Back to journal"}
          </button>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 mt-8 md:mt-12">
          <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-16 items-start">
            {/* Main article */}
            <article className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.16em] uppercase opacity-50 mb-6">
                <span className="px-2.5 py-1 border border-[var(--line)]">{entry.tag}</span>
                <span>{entry.date}</span>
                <span className="hidden sm:inline opacity-30">·</span>
                <span className="hidden sm:inline opacity-60 normal-case tracking-[0.06em] text-[11px]">{toc.length ? `${toc.length} bagian` : "Artikel"}</span>
              </div>
              <h1 className="font-serif text-[32px] md:text-[48px] lg:text-[56px] leading-[0.95] tracking-[-0.03em]">{entry.title}</h1>

              <div className="mt-8 md:mt-10 w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
                <img src={entry.image} alt={entry.title} className="w-full h-auto object-cover max-h-[72vh]" />
              </div>

              {/* Mobile TOC */}
              {toc.length > 0 && (
                <div className="lg:hidden mt-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {toc.map(t => (
                      <button key={t.id} onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className={`px-2.5 py-1 rounded-full border text-[11px] transition-colors ${active===t.id ? "bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)]" : "border-[var(--line)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]"}`}>{t.text}</button>
                    ))}
                  </div>
                </div>
              )}

              <div
                id="article-content"
                className="prose max-w-none mt-8 md:mt-10 prose-p:leading-relaxed prose-p:text-[15px] prose-p:opacity-80 prose-headings:font-serif prose-headings:tracking-[-0.02em] prose-headings:scroll-mt-24 prose-h2:text-[22px] prose-h2:mt-10 prose-h3:text-[18px] prose-img:rounded-xl prose-img:border prose-img:border-[var(--line)] prose-a:underline prose-a:decoration-[var(--line-strong)]"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <div className="mt-6 flex gap-2 lg:hidden">
                <button onClick={toggleBm} className={`flex-1 py-2.5 rounded-xl border text-xs ${bookmarked ? "bg-amber-500 border-amber-500 text-white" : "border-[var(--line)] bg-[var(--bg)]"}`}>{bookmarked ? "Tersimpan" : "Simpan"}</button>
                <button onClick={() => setShowShare(true)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs">Bagikan</button>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <button onClick={handleBack} className="px-5 py-2.5 border border-[var(--line)] text-xs tracking-widest uppercase hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)] transition-colors">Semua artikel</button>
                <button onClick={() => { try { sessionStorage.setItem("savana:scrollTo","contact"); } catch {} router.push("/"); }} className="px-5 py-2.5 bg-[var(--ink)] text-[var(--bg)] text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">Contact studio</button>
              </div>
            </article>

            {/* Sidebar — TOC from TinyMCE */}
            <aside className="hidden lg:block sticky top-24 self-start space-y-4">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden">
                {toc.length > 0 && (
                  <nav className="px-2 py-3">
                    {toc.map(t => (
                      <button
                        key={t.id}
                        onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        className={`w-full text-left flex gap-2.5 px-3 py-2 rounded-xl text-sm leading-snug transition-colors border ${active===t.id ? "bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)]" : "border-transparent hover:bg-[var(--bg)] hover:border-[var(--line)] opacity-70 hover:opacity-100"} ${t.level===3 ? "ml-4 text-[13px] opacity-60" : ""}`}
                      >
                        <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${active===t.id ? "bg-[var(--bg)]" : "bg-[var(--ink)]/30"}`} />
                        <span className="line-clamp-2">{t.text}</span>
                      </button>
                    ))}
                  </nav>
                )}

                <div className={`px-3 flex gap-2 ${toc.length ? "pb-3 pt-1 border-t border-[var(--line)]" : "py-3"}`}>
                  <button onClick={toggleBm} className={`flex-1 inline-flex items-center justify-center py-2.5 rounded-xl border text-xs transition-colors ${bookmarked ? "bg-amber-500 border-amber-500 text-white" : "border-[var(--line)] hover:bg-[var(--bg)]"}`}>
                    {bookmarked ? "Tersimpan" : "Simpan"}
                  </button>
                  <button onClick={() => setShowShare(true)} className="flex-1 inline-flex items-center justify-center py-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg)] text-xs transition-colors">
                    Bagikan
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 mt-16 md:mt-24 pt-10 border-t border-[var(--line)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {others.map(j => (
                <Link key={j.id} href={`/journal/${j.id}`} className="group relative aspect-[4/3] overflow-hidden bg-[var(--bg)] block border border-[var(--line)]">
                  <img src={j.image} alt={j.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="t-label text-white/60 text-[8px]">{j.date}</div>
                    <h3 className="font-serif text-[14px] leading-snug line-clamp-2 mt-1">{j.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />

      {showShare && (
        <SharePopup entry={{ title: entry.title, image: entry.image }} onClose={() => setShowShare(false)} onCopy={copyLink} copied={copied} />
      )}
    </div>
  );
}

function SharePopup({ entry, onClose, onCopy, copied }: { entry: { title: string; image: string }; onClose: () => void; onCopy: () => void; copied: boolean }) {
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);
  const text = encodeURIComponent(entry.title);
  const u = encodeURIComponent(url);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${u}`, color: "bg-[#25D366] hover:bg-[#1ebe5a]" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, color: "bg-[#1877F2] hover:bg-[#1669d6]" },
    { label: "X (Twitter)", href: `https://twitter.com/intent/tweet?text=${text}&url=${u}`, color: "bg-black hover:bg-zinc-800" },
    { label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${text}`, color: "bg-[#2AABEE] hover:bg-[#229ed9]" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-[420px] rounded-2xl bg-[var(--card)] border border-[var(--line)] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <h3 className="font-serif text-[16px]">Bagikan artikel</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center hover:bg-[var(--line)] transition-colors text-sm leading-none">×</button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm opacity-60 line-clamp-2">{entry.title}</p>
          <div className="grid grid-cols-2 gap-2">
            {links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={`text-white text-xs font-medium tracking-wide py-2.5 rounded-xl text-center transition-colors ${l.color}`}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs truncate">{url}</div>
            <button onClick={onCopy} className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors ${copied ? "bg-emerald-500 border-emerald-500 text-white" : "bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)] hover:opacity-90"}`}>
              {copied ? "Tersalin!" : "Salin tautan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
