"use client";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Product } from "@/lib/cms";
import { motion } from "framer-motion";

const PREVIEW = 4;

export function Objects({ products }: { products: Product[]; }) {
  const preview = products.slice(0, PREVIEW);
  return (
    <section id="objects" className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10 scroll-mt-14">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 md:pb-10 mb-2">
        <div>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.03em", fontWeight: 400 }}
          >
            Objects
          </h2>
          <p className="t-label opacity-60 mt-3 normal-case tracking-[0.06em] hidden sm:block">
            Catalog &nbsp;·&nbsp; Reclaimed teak &nbsp;·&nbsp; Local clay
          </p>
        </div>
        {products.length > PREVIEW && (
          <Link href="/objects" className="inline-flex items-center gap-1.5 t-label text-[10px] tracking-[0.16em] uppercase border border-[var(--line)] px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)] transition-colors">
            Show more <ArrowRightIcon className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {preview.map((prod, idx) => (
          <ProductCard key={prod.id} prod={prod} idx={idx} />
        ))}
      </div>
      <div className="mt-6 bg-[var(--card)] border border-[var(--line)] px-5 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-px h-8 bg-[var(--line)]" />
          <div>
            <div className="section-kicker opacity-60 text-[9px] mb-1">CUSTOM ORDER</div>
            <h3 className="font-serif text-[16px] md:text-[19px] leading-none tracking-[-0.01em]">Need a specific size or material?</h3>
          </div>
          <p className="hidden lg:block t-small opacity-60 max-w-[260px] ml-4 leading-relaxed">Send a sketch or reference. Estimate in 2 working days.</p>
        </div>
        <a href="#contact" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--ink)] text-[var(--bg)] text-[10px] tracking-[0.16em] uppercase hover:opacity-80 transition-opacity whitespace-nowrap">Contact Studio <ArrowRightIcon className="w-3 h-3" /></a>
      </div>
    </section>
  );
}

function ProductCard({ prod, idx }: { prod: Product; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.06 }}
      transition={{ duration: 0.65, delay: (idx % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer bg-[var(--card)] flex flex-col block"
    >
      <Link href={`/objects/${prod.id}?from=landing`} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={prod.image} alt={prod.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-black text-[9px] tracking-[0.14em] uppercase font-medium">{prod.category}</span>
            {!prod.inStock && <span className="px-2 py-1 bg-[var(--ink)] text-[var(--bg)] text-[9px] tracking-[0.14em] uppercase">Pre-order</span>}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-400" />
        </div>
        <div className="flex-1 flex flex-col px-4 py-3.5">
          <h3 className="font-serif text-[15px] leading-snug mt-1.5 tracking-[-0.01em]">{prod.name}</h3>
          <p className="text-[11px] leading-relaxed mt-1.5 opacity-60 line-clamp-2 font-sans">
            {prod.excerpt || `${prod.material} · ${prod.dimensions}`}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-[13px] font-semibold tracking-[-0.01em]">{prod.price}</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://wa.me/6281234567890?text=Halo%20SAVANA,%20saya%20tertarik%20dengan%20${encodeURIComponent(prod.name)}`, "_blank");
              }} 
              className="inline-flex items-center gap-1 text-[9px] tracking-[0.12em] uppercase opacity-50 hover:opacity-100 transition-opacity font-sans"
            >
              Order <ArrowUpRightIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
