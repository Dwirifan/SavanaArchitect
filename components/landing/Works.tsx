"use client";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Project } from "@/lib/cms";
import { motion } from "framer-motion";
import { FuturisticLine } from "./FuturisticLine";
import { ImageSkeleton } from "@/components/ui/Skeleton";

const PREVIEW = 5;

export function Works({
  projects,
}: {
  projects: Project[];
}) {
  const preview = projects.slice(0, PREVIEW);
  const featured = preview[0];
  const secondary = preview.slice(1, 3);
  const rest = preview.slice(3);

  const catCount = new Set(projects.map(p => p.category)).size;

  return (
    <section id="works" className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-14 md:pt-16 lg:pt-20 pb-8 md:pb-10 lg:pb-12 scroll-mt-14">
      {/* ── Section head ── */}
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 md:pb-10">
        <div>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.03em", fontWeight: 400 }}
          >
            Works
          </h2>
          <p className="t-label opacity-25 mt-3 normal-case tracking-[0.06em] hidden sm:block">
            {catCount} categor{catCount === 1 ? "y" : "ies"} &nbsp;·&nbsp; Since 2018
          </p>
        </div>
        {projects.length > PREVIEW && (
          <Link href="/works" className="inline-flex items-center gap-1.5 t-label text-[10px] tracking-[0.16em] uppercase border border-[var(--line)] px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)] transition-colors">
            Show more <ArrowRightIcon className="w-3 h-3" />
          </Link>
        )}
      </div>
      <FuturisticLine className="mb-6" />

      {preview.length === 0 && (
        <div className="py-20 text-center t-label opacity-20">
          No projects
        </div>
      )}

      {preview.length > 0 && (
        <>
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-3">
            {featured && <ProjectCard project={featured} index={1} tall staggerIndex={0} slideFrom="left" />}
            {secondary.length > 0 && (
              <div className="grid grid-rows-2 gap-3">
                {secondary.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i + 2} staggerIndex={i + 1} slideFrom="right" />
                ))}
              </div>
            )}
          </div>
          {rest.length > 0 && (
            <div
              className="mt-3 grid gap-3"
              style={{ gridTemplateColumns: `repeat(${Math.min(rest.length, 3)}, 1fr)` }}
            >
              {rest.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i + 4} compact staggerIndex={i + 3} slideFrom={i % 2 === 0 ? "left" : "right"} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ProjectCard({
  project: p,
  index,
  tall,
  compact,
  staggerIndex = 0,
  slideFrom = "bottom",
}: {
  project: Project;
  index: number;
  tall?: boolean;
  compact?: boolean;
  staggerIndex?: number;
  slideFrom?: "left" | "right" | "bottom";
}) {
  const imgH = tall
    ? "min-h-[320px] lg:min-h-[480px]"
    : compact
    ? "h-[200px]"
    : "h-[240px]";

  let initialTransform = { y: 30, x: 0, opacity: 0 };
  if (slideFrom === "left") initialTransform = { y: 0, x: -40, opacity: 0 };
  if (slideFrom === "right") initialTransform = { y: 0, x: 40, opacity: 0 };

  return (
    <motion.div
      initial={initialTransform}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: false, amount: 0.08 }}
      transition={{ duration: 0.9, delay: staggerIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer relative overflow-hidden bg-[var(--card)] block"
    >
      <Link href={`/works/${p.id}`} className="block relative w-full h-full">
        <div className={`relative w-full overflow-hidden ${imgH}`}>
          <ImageSkeleton
            src={p.cover}
            alt={p.title}
            className="absolute inset-0"
            imgClassName="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />
          <div className="absolute top-4 left-4 t-label text-white opacity-40">
            {String(index).padStart(2, "0")}
          </div>
          <div className="absolute top-4 right-4 t-label text-white opacity-35">
            {p.status}
          </div>
          {/* Info overlay — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out text-white">
            <div className="t-label opacity-50 mb-1.5">{p.category} · {p.year} · {p.location}</div>
            <div className={`font-serif leading-tight ${tall ? "text-[20px]" : "text-[16px]"}`}>{p.title}</div>
            {p.area && <div className="t-label opacity-35 mt-1">{p.area}</div>}
          </div>
        </div>
        {tall && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[var(--line)]/60">
            <div>
              <div className="t-label opacity-25">{p.category} · {p.location} · {p.year}</div>
              <div className="font-serif text-[18px] mt-1 tracking-[-0.01em]">{p.title}</div>
            </div>
            <div className="inline-flex items-center gap-1 t-label opacity-20 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all shrink-0 ml-4">Open <ArrowUpRightIcon className="w-3 h-3" /></div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
