"use client";
import { StudioData } from "@/lib/cms";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function Contact({ studio }: { studio: StudioData }) {
  return (
    <section
      id="contact"
      className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pt-14 md:pt-16 lg:pt-20 pb-16 md:pb-20 scroll-mt-14"
    >
      <motion.div 
        className="flex flex-wrap items-end justify-between gap-6 pb-8 md:pb-10 mb-2"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.06 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.03em", fontWeight: 400 }}
          >
            Contact
          </h2>
          <p className="t-label opacity-60 mt-3 normal-case tracking-[0.06em] hidden sm:block">
            Let's build something &nbsp;·&nbsp; Jakarta, Indonesia
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center">
        {/* LEFT: Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.06 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-12">
            <h3
              className="font-display font-black uppercase leading-[0.95] tracking-[-0.01em] text-balance"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              <span className="block">{studio.contactHeadline || "Let's build"}</span>
              {studio.contactHeadlineAccent ? (
                <span className="block text-transparent opacity-30" style={{ WebkitTextStroke: "1px var(--ink)" }}>
                  {studio.contactHeadlineAccent}
                </span>
              ) : (
                <span className="block text-transparent opacity-30" style={{ WebkitTextStroke: "1px var(--ink)" }}>
                  something.
                </span>
              )}
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 t-body opacity-70">
            <span>Jakarta, Indonesia</span>
            <a
              href={`mailto:${studio.email}`}
              className="hover:text-[var(--ink)] hover:opacity-100 transition-colors duration-150 underline underline-offset-4 decoration-[var(--line)]"
            >
              {studio.email}
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6">
            {studio.instagram && (
              <a
                href={`https://instagram.com/${studio.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="t-label opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
              >
                Instagram <ArrowUpRightIcon className="w-3 h-3" />
              </a>
            )}
            <a href="#" className="t-label opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1">
              Are.na <ArrowUpRightIcon className="w-3 h-3" />
            </a>
          </div>

          {studio.philosophy?.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              className="mt-8 flex flex-wrap gap-1.5"
            >
              {studio.philosophy.map((ph) => (
                <motion.span
                  key={ph}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--card)] border border-[var(--line)]/80 t-body text-[11px] leading-none opacity-75"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--ink)] opacity-30 shrink-0" />
                  {ph}
                </motion.span>
              ))}
            </motion.div>
          )}

          <div className="mt-12">
            <motion.a
              href={`https://wa.me/${studio.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center justify-center overflow-hidden bg-[var(--ink)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-transform active:scale-[0.98]"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="absolute inset-0 z-0 bg-[#25D366]"
                variants={{
                  initial: { y: "100%" },
                  hover: { y: "0%" }
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="relative z-10 block overflow-hidden">
                <motion.span
                  className="flex items-center justify-center gap-3 text-[var(--bg)]"
                  variants={{
                    initial: { y: "0%" },
                    hover: { y: "-120%" }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Start a conversation <ArrowRightIcon className="w-4 h-4" />
                </motion.span>
                <motion.span
                  className="absolute inset-0 flex items-center justify-center gap-3 text-white"
                  variants={{
                    initial: { y: "120%" },
                    hover: { y: "0%" }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Start a conversation <ArrowRightIcon className="w-4 h-4" />
                </motion.span>
              </span>
            </motion.a>
          </div>
        </motion.div>

        {/* RIGHT: Image */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.06 }}
          transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format&fit=crop"
              alt="Kemang atelier"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          <p className="t-caption mt-2 opacity-40">Kemang Atelier converted warehouse 2018</p>
        </motion.div>
      </div>
    </section>
  );
}