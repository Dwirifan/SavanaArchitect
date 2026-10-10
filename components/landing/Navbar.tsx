"use client";
import { useTheme } from "@/components/theme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
  // bersihkan hash dari URL biar tetap clean (tidak jadi /#journal)
  history.replaceState(null, "", window.location.pathname);
}

export function Navbar() {
  const { theme, toggle } = useTheme();
  return (
    <nav className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--line)]">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 text-left">
          <img
            src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"}
            alt="SAVANA"
            className="h-7 w-auto object-contain transition-opacity"
          />
          <span className="hidden sm:inline text-[11px] tracking-[0.28em] font-medium uppercase opacity-60">Architecture Studio</span>
        </button>
        <div className="hidden md:flex items-center gap-7 t-label">
          <button onClick={() => scrollTo("works")} className="relative py-1 opacity-60 hover:opacity-100 transition-opacity group">Works<span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" /></button>
          <button onClick={() => scrollTo("objects")} className="relative py-1 opacity-60 hover:opacity-100 transition-opacity group">Collection<span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" /></button>
          <button onClick={() => scrollTo("studio")} className="relative py-1 opacity-60 hover:opacity-100 transition-opacity group">Studio<span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" /></button>
          <button onClick={() => scrollTo("team")} className="relative py-1 opacity-60 hover:opacity-100 transition-opacity group">Team<span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" /></button>
          <span className="w-px h-3.5 bg-[var(--line)]" />
          <button onClick={toggle} className="w-8 h-8 border border-[var(--line)] grid place-items-center opacity-60 hover:opacity-100 transition-opacity" title="Toggle theme">
            {theme === "dark" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>
          <button onClick={() => scrollTo("contact")} className="relative px-4 py-1.5 border border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition group overflow-hidden">Inquire<span className="pointer-events-none absolute left-0 -bottom-0 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" /></button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="w-8 h-8 grid place-items-center border border-[var(--line)]" aria-label="Toggle theme">{theme === "dark" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}</button>
          <button onClick={() => scrollTo("contact")} className="px-3 py-1.5 bg-[var(--ink)] text-[var(--bg)] t-label">Inquire</button>
        </div>
      </div>
    </nav>
  );
}