"use client";
import { useRef, useEffect, useState } from "react";
import { StudioData, TeamMember } from "@/lib/cms";
import { useTheme } from "@/components/theme";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView } from "framer-motion";
import { FuturisticLine } from "./FuturisticLine";
import { ImageSkeleton } from "@/components/ui/Skeleton";

function useScrollDirection() {
  const [dir, setDir] = useState<"down" | "up">("down");
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const d = y > last.current ? "down" : y < last.current ? "up" : dir;
      if (d !== dir) setDir(d as any);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dir]);
  return dir;
}

export function StudioTeam({ studio, team }: { studio: StudioData; team: TeamMember[] }) {
  const { theme } = useTheme();
  // magnetic logo: menjauh kesamping dari kursor
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 18, mass: 0.6 });
  // logo menghindar berlawanan arah kursor, tulisan ikut sedikit parallax searah
  const logoX = useTransform(sx, v => -v * 0.55);
  const logoY = useTransform(sy, v => -v * 0.28);
  const textX = useTransform(sx, v => v * 0.18);
  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set((e.clientX - cx) / 9);
    my.set((e.clientY - cy) / 14);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  // scroll-linked parallax — beda arah logo vs text (scroll down logo naik sedikit, text turun)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxLogoY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const parallaxTextY = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const dir = useScrollDirection();
  // fallback for old localStorage
  let headline = (studio as any).studioHeadline ?? "A small studio,";
  if (headline === "A small studio in a converted warehouse,") headline = "A small studio,";
  
  let accent = (studio as any).studioHeadlineAccent ?? "learning from site";
  if (accent === "learning from the site") accent = "learning from site";
  
  let tail = (studio as any).studioHeadlineTail ?? "before we draw.";
  const quote = (studio as any).quote ?? "We keep it small — 4 to 5 houses a year. On site, with the builders.";
  return (
    <section ref={sectionRef} id="studio" className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10 scroll-mt-14 flex flex-col justify-center lg:min-h-[calc(100vh-3.5rem)] lg:py-6 overflow-hidden">
      {/* ── Studio editorial — parallax scroll: logo vs text beda arah ── */}
      <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center">
        <motion.div
          style={{ x: logoX, y: parallaxLogoY }}
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center lg:justify-end will-change-transform"
        >
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ scale: 1.03 }}
            src={theme === "dark" ? "/savanaarsitekwhite.png" : "/savanaarsitekblack.png"}
            alt="Savana Architecture"
            className="w-full max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] h-auto object-contain"
          />
        </motion.div>

        <motion.div style={{ x: textX, y: parallaxTextY }} className="flex flex-col min-w-0 w-full lg:max-w-[800px] lg:mx-0 will-change-transform">
          <motion.h3
            initial={{ opacity: 0, y: dir === "down" ? 26 : -18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black uppercase leading-[1.05] tracking-[-0.01em] mt-4 text-balance" style={{ fontSize: "clamp(26px, 3.5vw, 48px)" }}>
            <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-block">{headline} </motion.span>
            <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.22 }} className="inline-block">{accent}</motion.span>
            {tail ? <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.35 }} className="text-transparent opacity-30 inline-block" style={{ WebkitTextStroke: "1px var(--ink)" }}> {tail}</motion.span> : null}
          </motion.h3>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            className="mt-5 space-y-3">
            <motion.p variants={{ hidden: { opacity: 0, y: dir === "down" ? 16 : -12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }} className="font-serif italic leading-[1.55] opacity-70 text-[13px] text-pretty">
              &ldquo;{quote}&rdquo;
            </motion.p>
            <motion.p variants={{ hidden: { opacity: 0, y: dir === "down" ? 16 : -12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }} className="t-body opacity-65 leading-[1.65] text-[12.5px] text-pretty line-clamp-3">
              {studio.about}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── People — scroll-direction aware, parallax + stagger ── */}
      <motion.div id="team" className="mt-8 pt-6 scroll-mt-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }} style={{ transformOrigin: dir === "down" ? "left" : "right" }}>
          <FuturisticLine className="mb-5" />
        </motion.div>
        {/* header: editorial lockup — left PEOPLE big serif, right count large display */}
        <motion.div className="flex items-end justify-between gap-6"
          initial={{ opacity: 0, y: dir === "down" ? 18 : -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h4 className="font-display font-black uppercase tracking-[-0.02em] leading-none" style={{ fontSize: "clamp(28px, 3.2vw, 42px)" }}>
                People
              </h4>
              <span className="font-serif italic text-[12.5px] opacity-50 hidden sm:inline -translate-y-1">Each house, one lead — on site</span>
            </div>
            <div className="flex items-center gap-2.5 mt-2.5">
              <span className="h-px w-8 bg-[var(--ink)] opacity-20" />
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-35 font-medium">The Studio</span>
              <span className="text-[10px] opacity-20">—</span>
              <span className="text-[10px] tracking-[0.14em] uppercase opacity-40">{team.length} architects & collaborators</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end leading-none shrink-0">
            <span className="font-display font-black tabular-nums leading-none tracking-[-0.04em] opacity-[0.07]" style={{ fontSize: "clamp(44px,5vw,72px)", lineHeight: 0.85 }}>
              {String(team.length).padStart(2, "0")}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase opacity-30 -mt-1">People</span>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
          {team.map((m, i) => (
            <TeamPortrait key={m.id} member={m} index={i} dir={dir} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function TeamPortrait({ member: m, index: i, dir = "down" }: { member: TeamMember; index: number; dir?: "up" | "down" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: dir === "down" ? 30 : -22, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.62, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative aspect-[4/5] overflow-hidden bg-[var(--card)] basis-[calc(50%-6px)] sm:basis-[calc(33.333%-8px)] lg:basis-[calc(25%-12px)] max-w-[340px] grow-0 shrink-0"
    >
      <ImageSkeleton
        src={m.image}
        alt={m.name}
        className="absolute inset-0"
        imgClassName="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 ease-out"
      />
      {/* overlay lebih editorial — vignette halus */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-white/[0.06] group-hover:ring-white/10 transition-colors" />
      {/* number watermark */}
      <span className="absolute top-3 right-3 font-display font-black tabular-nums text-white/0 group-hover:text-white/[0.08] text-[26px] leading-none tracking-[-0.04em] transition-colors select-none">
        {String(i + 1).padStart(2, "0")}
      </span>
      <motion.div
        initial={{ opacity: 0, y: dir === "down" ? 12 : -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: i * 0.06 + 0.32 }}
        className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-white/35 group-hover:w-9 group-hover:bg-white/60 transition-all duration-300" />
          <span className="text-[9px] tracking-[0.18em] uppercase font-medium text-white/55 group-hover:text-white/80 transition-colors">{m.role}</span>
        </div>
        <div className="font-serif text-[16px] leading-[1.05] tracking-[-0.015em] mt-2 text-balance">{m.name}</div>
        <div className="h-px w-0 group-hover:w-full bg-white/20 mt-3 transition-all duration-500 ease-out" />
      </motion.div>
    </motion.div>
  );
}
