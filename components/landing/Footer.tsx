"use client";
import { useTheme } from "@/components/theme";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="w-full bg-[var(--card)] border-t border-[var(--line)] mt-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-3">
              <img
                src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"}
                alt="SAVANA Architecture"
                className="h-16 md:h-20 w-auto object-contain transition-opacity"
              />
            </div>
            <p className="text-sm opacity-60 max-w-md leading-relaxed">
              We design spaces that blend form, function, and environment. 
              Based in Jakarta, delivering projects across Indonesia and beyond.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Connect</h3>
            {["Instagram", "Are.na", "LinkedIn"].map((s) => (
              <a key={s} href="#" className="relative text-sm opacity-70 hover:opacity-100 transition-opacity w-fit group py-0.5">
                {s}<span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </a>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Office</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Jakarta, Indonesia<br />
              Est. 2018
            </p>
            <a href="mailto:hello@savana.studio" className="relative text-sm opacity-70 hover:opacity-100 transition-opacity mt-2 w-fit group py-0.5">
              hello@savana.studio<span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[var(--line)] overflow-hidden relative">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 py-4 flex items-center justify-center relative z-10">
          <span className="text-[10px] opacity-40 tracking-[0.1em] uppercase">
            © {new Date().getFullYear()} Savana Architecture
          </span>
        </div>
        
        <div 
          className="absolute inset-0 flex items-center justify-center font-black opacity-[0.03] select-none pointer-events-none"
          style={{ fontSize: "clamp(80px, 16vw, 300px)", lineHeight: 0.8 }}
          aria-hidden="true"
        >
          SAVANA
        </div>
      </div>
    </footer>
  );
}
