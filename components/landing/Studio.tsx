"use client";
import { useRef } from "react";
import { StudioData, TeamMember } from "@/lib/cms";
import { useTheme } from "@/components/theme";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function StudioTeam({ studio, team }: { studio: StudioData; team: TeamMember[] }) {
  const { theme } = useTheme();
  // magnetic logo: menjauh kesamping dari kursor
  const wrapRef = useRef<HTMLDivElement>(null);
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
  // fallback for old localStorage
  let headline = (studio as any).studioHeadline ?? "A small studio,";
  if (headline === "A small studio in a converted warehouse,") headline = "A small studio,";
  
  let accent = (studio as any).studioHeadlineAccent ?? "learning from site";
  if (accent === "learning from the site") accent = "learning from site";
  
  let tail = (studio as any).studioHeadlineTail ?? "before we draw.";
  const quote = (studio as any).quote ?? "We keep it small — 4 to 5 houses a year. On site, with the builders.";
  return (
    <section id="studio" className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10 scroll-mt-14 flex flex-col justify-center lg:min-h-[calc(100vh-3.5rem)] lg:py-6">
      {/* ── Studio editorial — diperlebar, headline 3 baris ── */}
      <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center">
        <motion.div
          style={{ x: logoX, y: logoY }}
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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

        <motion.div style={{ x: textX }} className="flex flex-col min-w-0 w-full lg:max-w-[800px] lg:mx-0 will-change-transform">
          <motion.h3
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black uppercase leading-[1.05] tracking-[-0.01em] mt-4 text-balance" style={{ fontSize: "clamp(26px, 3.5vw, 48px)" }}>
            <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-block">{headline} </motion.span>
            <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.22 }} className="inline-block">{accent}</motion.span>
            {tail ? <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.35 }} className="text-transparent opacity-30 inline-block" style={{ WebkitTextStroke: "1px var(--ink)" }}> {tail}</motion.span> : null}
          </motion.h3>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="mt-5 space-y-3">
            <motion.p variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }} className="font-serif italic leading-[1.55] opacity-70 text-[13px] text-pretty">
              &ldquo;{quote}&rdquo;
            </motion.p>
            <motion.p variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }} className="t-body opacity-65 leading-[1.65] text-[12.5px] text-pretty line-clamp-3">
              {studio.about}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── People — ditinggikan agar pas 1 layar ── */}
      <div id="team" className="mt-5 pt-4 border-t border-[var(--line)]/60 scroll-mt-14">
        <div className="flex items-center gap-3">
          <span className="t-label opacity-40 text-[9px] whitespace-nowrap tracking-[0.14em]">THE STUDIO</span>
          <span className="h-px flex-1 bg-[var(--line)]/60" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {team.map((m, i) => (
            <TeamPortrait key={m.id} member={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamPortrait({ member: m, index: i }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative aspect-[3/4] overflow-hidden bg-[var(--card)]"
    >
      <motion.img
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: i * 0.08 + 0.1, ease: [0.22, 1, 0.36, 1] }}
        src={m.image}
        alt={m.name}
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-400" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.08 + 0.35 }}
        className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
        <div className="t-label text-white/60 text-[8px] tracking-[0.13em]">{m.role}</div>
        <div className="font-serif text-[14.5px] leading-none tracking-[-0.01em] mt-1">{m.name}</div>
      </motion.div>
    </motion.div>
  );
}
