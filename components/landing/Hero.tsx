"use client";
import { useEffect, useState, useCallback } from "react";
import { StudioData, Project } from "@/lib/cms";
import { ArrowRightIcon, ArrowUpRightIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function Hero({ studio, projects }: { studio: StudioData, projects: Project[] }) {
  const slides = projects.slice(0, 4).map((p, i) => ({
    src: p.cover,
    label: p.title,
    location: p.location,
    year: p.year,
    index: `0${i + 1}`,
  }));

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimating(false);
      }, 460);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <header
      className="relative w-full overflow-hidden flex flex-col justify-center"
      style={{
        minHeight: "calc(100vh - 3.5rem)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* ── Full-bleed background carousel ── */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0"
            style={{
              opacity: i === current ? (animating ? 0 : 1) : 0,
              transform: i === current ? (animating ? "scale(1.03)" : "scale(1)") : "scale(1.05)",
              transition: "opacity 0.85s cubic-bezier(.22,1,.36,1), transform 1.1s cubic-bezier(.22,1,.36,1)",
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <img src={s.src} alt={s.label} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
        {/* legibility gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent hidden lg:block" />
      </div>

      {/* ── Content — constrained to 1600px grid ── */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 py-10 lg:py-12 flex flex-col justify-center flex-1 text-white">
        <div className="max-w-[720px]">
          <div
            role="heading"
            aria-level={1}
            className="font-display font-black uppercase leading-[0.95] tracking-[-0.01em] text-balance"
            style={{
              fontSize: "clamp(40px, 6vw, 84px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
              transition: "opacity 0.85s 0.2s cubic-bezier(.22,1,.36,1), transform 0.85s 0.2s cubic-bezier(.22,1,.36,1)",
              textShadow: "0 2px 24px rgba(0,0,0,0.35)",
            }}
          >
            {studio.heroTitle.split("\n").map((line, i, arr) => (
              <span key={i} className="block">
                {i === arr.length - 1 ? (
                  <span className="text-transparent opacity-40" style={{ WebkitTextStroke: "1px white" }}>
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </div>

          <p
            className="max-w-[520px] leading-[1.7] mt-6 lg:mt-7 text-white/80"
            style={{
              fontSize: "clamp(14px, 1.3vw, 17px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(10px)",
              transition: "opacity 0.75s 0.34s ease, transform 0.75s 0.34s ease",
              textShadow: "0 1px 12px rgba(0,0,0,0.4)",
            }}
          >
            {studio.heroSubtitle}
          </p>

          <div
            className="flex flex-wrap gap-3 mt-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(8px)",
              transition: "opacity 0.7s 0.46s ease, transform 0.7s 0.46s ease",
            }}
          >
            <motion.a
              href="#works"
              className="relative inline-flex items-center justify-center overflow-hidden bg-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-transform active:scale-[0.98]"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="absolute inset-0 z-0 bg-black"
                variants={{
                  initial: { y: "100%" },
                  hover: { y: "0%" }
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="relative z-10 block overflow-hidden">
                <motion.span
                  className="flex items-center justify-center gap-2 text-black"
                  variants={{
                    initial: { y: "0%" },
                    hover: { y: "-120%" }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  View Works <ArrowRightIcon className="w-3.5 h-3.5" />
                </motion.span>
                <motion.span
                  className="absolute inset-0 flex items-center justify-center gap-2 text-white"
                  variants={{
                    initial: { y: "120%" },
                    hover: { y: "0%" }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  View Works <ArrowRightIcon className="w-3.5 h-3.5" />
                </motion.span>
              </span>
            </motion.a>
            <motion.a
              href="#objects"
              className="relative inline-flex items-center justify-center overflow-hidden border border-white/30 backdrop-blur-sm px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-transform active:scale-[0.98]"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="absolute inset-0 z-0 bg-white"
                variants={{
                  initial: { y: "100%" },
                  hover: { y: "0%" }
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="relative z-10 block overflow-hidden">
                <motion.span
                  className="flex items-center justify-center gap-2 text-white"
                  variants={{
                    initial: { y: "0%" },
                    hover: { y: "-120%" }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Catalog <ArrowUpRightIcon className="w-3.5 h-3.5 opacity-70" />
                </motion.span>
                <motion.span
                  className="absolute inset-0 flex items-center justify-center gap-2 text-black"
                  variants={{
                    initial: { y: "120%" },
                    hover: { y: "0%" }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Catalog <ArrowUpRightIcon className="w-3.5 h-3.5 opacity-70" />
                </motion.span>
              </span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── Bottom meta bar ── */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pb-6 md:pb-7 flex items-end justify-between gap-4 text-white">
        <div className="flex flex-col">
          <div className="font-mono text-[11px] tracking-[0.18em] text-white/60">
            {slide.index} / {String(slides.length).padStart(2, "0")}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="block h-[2px] rounded-full bg-white transition-all duration-500 hover:opacity-80"
              style={{
                width: i === current ? "28px" : "14px",
                opacity: i === current ? 1 : 0.35,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Side nav dots (mobile vertical) ── */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="block w-[2px] rounded-full bg-white transition-all duration-500 hover:opacity-80"
            style={{
              height: i === current ? "22px" : "10px",
              opacity: i === current ? 1 : 0.32,
            }}
          />
        ))}
      </div>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute bottom-6 right-4 md:right-8 z-10 w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 backdrop-blur-sm transition-all md:hidden"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>

      <style>{`
        .hero-slide-label {
          animation: heroSlideUp 0.55s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}