"use client";
import Link from "next/link";
import { TeamMember, Journal } from "@/lib/cms";
import { motion } from "framer-motion";

export function Team({ team }: { team: TeamMember[] }) {
  return (
    <section id="team" className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-14 md:pt-16 lg:pt-20 scroll-mt-14">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 md:pb-10 mb-2">
        <div>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.03em", fontWeight: 400 }}
          >
            People
          </h2>
          <p className="t-label opacity-60 mt-3 normal-case tracking-[0.06em] hidden sm:block">
            Small, on site &nbsp;·&nbsp; 4 people, 4 to 5 projects a year
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] opacity-50">4 MEMBERS</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {team.map((m, i) => (
          <TeamCard key={m.id} member={m} index={i} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ member: m, index: i }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.06 }}
      transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-[3/4] overflow-hidden bg-[var(--bg)]"
    >
      <img
        src={m.image}
        alt={m.name}
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
      <div className="absolute top-3 left-3 t-label text-white/40 text-[9px] tracking-[0.18em]">{String(i + 1).padStart(2, "0")}</div>
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
        <div className="section-kicker text-white/70 text-[9px] tracking-[0.16em]">{m.role}</div>
        <div className="font-serif text-[21px] md:text-[23px] leading-none tracking-[-0.02em] mt-1.5">{m.name}</div>
        <p className="t-body text-white/70 text-[12px] leading-[1.6] mt-2.5 line-clamp-3">{m.bio}</p>
        <span className="mt-3 inline-flex items-center gap-2 t-label text-white/50 text-[9px] tracking-[0.16em] group-hover:text-white/80 transition-colors">
          <span className="w-5 h-px bg-white/30 group-hover:bg-white/60 transition-colors" /> {i === 0 ? "Principal" : "View profile"}
        </span>
      </div>
    </motion.div>
  );
}


export function JournalSection({ journal }: { journal: Journal[] }) {
  const preview = journal.slice(0, 4);
  return (
    <section id="journal" className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-10 md:pb-14 lg:pb-16 scroll-mt-14">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-6 mb-2">
        <div>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 0.9, letterSpacing: "-0.025em", fontWeight: 400 }}
          >
            Journal
          </h2>
          <p className="t-label opacity-60 mt-2.5 normal-case tracking-[0.06em] hidden sm:block text-[10px]">
            Field notes · material, light, site
          </p>
        </div>
        {journal.length > 4 ? (
          <Link href="/journal" className="inline-flex items-center gap-1.5 t-label text-[10px] tracking-[0.16em] uppercase border border-[var(--line)] px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)] transition-colors">
            Show more
          </Link>
        ) : (
          <span className="t-label opacity-50 text-[9px] tracking-[0.18em] hidden md:inline">FIELD NOTES</span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {journal.length === 0 && <div className="col-span-2 lg:col-span-4 py-20 text-center section-kicker opacity-20 bg-[var(--bg)]">No entries</div>}
        {preview.map((j, idx) => (
          <JournalCard key={j.id} journal={j} idx={idx} />
        ))}
      </div>
    </section>
  );
}

function JournalCard({ journal: j, idx }: { journal: Journal; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.06 }}
      transition={{ duration: 0.65, delay: (idx % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/journal/${j.id}?from=landing`} className="group cursor-pointer relative aspect-[4/5] overflow-hidden bg-[var(--bg)] block">
        <img src={j.image} alt={j.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 bg-white text-black text-[9px] tracking-[0.14em] uppercase font-medium">{j.tag}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="t-label text-white/60 text-[8px] tracking-[0.13em]">{j.date}</div>
          <h3 className="font-serif text-[14px] md:text-[15px] leading-[1.25] tracking-[-0.01em] mt-1 group-hover:text-white/90 transition-colors line-clamp-2">{j.title}</h3>
          <p className="t-body text-white/65 text-[11px] leading-[1.55] mt-1.5 line-clamp-2 hidden sm:block">{j.excerpt?.replace(/<[^>]*>/g, "").slice(0,120)}</p>
          <div className="mt-2.5 flex items-center gap-2 t-label text-white/30 group-hover:text-white/50 transition-colors text-[8px]">
            <span className="w-6 h-px bg-white/30 group-hover:bg-white/60 transition-colors" /> Read
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
