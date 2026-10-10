"use client";
import { motion } from "framer-motion";

export function FuturisticLine({ className = "", shimmer = true }: { className?: string; shimmer?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0 }}
      className={`relative h-px overflow-hidden bg-[var(--line)]/60 ${className}`}
    >
      {shimmer && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.0) 20%, var(--ink) 50%, transparent 80%)",
            opacity: 0.18,
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 1.4 }}
        />
      )}
      {/* traveling dot */}
      {shimmer && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-[48px] h-px bg-[var(--ink)]"
          style={{ opacity: 0.9, filter: "blur(0.5px)", boxShadow: "0 0 8px var(--ink)" }}
          initial={{ left: "-48px" }}
          animate={{ left: "100%" }}
          transition={{ duration: 2.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1], repeatDelay: 1.4 }}
        />
      )}
    </motion.div>
  );
}

export function FuturisticBorderTop({ className = "" }: { className?: string }) {
  return (
    <div className={`relative border-t border-transparent ${className}`}>
      <FuturisticLine className="absolute top-0 left-0 right-0" />
    </div>
  );
}
