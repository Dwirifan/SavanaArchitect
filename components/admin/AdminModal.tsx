"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "modal" | "sidebar";
}

export function AdminModal({ open, onClose, title, children, footer, size = "md", variant = "modal" }: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  // modal centered — compact (inline style for reliability)
  const modalStyle: React.CSSProperties =
    size === "sm" ? { width: "480px", maxWidth: "90vw" } :
    size === "lg" ? { width: "720px", maxWidth: "92vw" } :
    { width: "600px", maxWidth: "92vw" };
  const drawerWidth = size === "sm" ? "w-[340px] max-w-[85vw]" : size === "lg" ? "w-[600px] max-w-[92vw]" : "w-[480px] max-w-[90vw]";

  const isSidebar = variant === "sidebar";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-30 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          {/* left spacer = sidebar area — TIDAK ada overlay, biar sidebar & navbar 100% clear */}
          <div className="hidden lg:block w-64 xl:w-72 shrink-0" aria-hidden />
          <div className="flex-1 flex flex-col min-w-0">
            {/* top spacer = navbar area */}
            <div className="h-14 lg:h-16 shrink-0 hidden lg:block" aria-hidden />
            <div className={isSidebar ? "flex-1 flex justify-end min-h-0 relative" : "flex-1 flex items-center justify-center p-4 md:p-6 relative min-h-0"}>
              {/* backdrop blur SUPER tipis — hanya area konten, tidak kena sidebar/navbar */}
              <div className="absolute inset-0 bg-black/[0.04] dark:bg-black/15 backdrop-blur-[1px]" onClick={onClose} aria-hidden />

          {/* Dialog / Drawer — solid, no translucency */}
          <motion.div
            key="dialog"
            style={isSidebar ? undefined : modalStyle}
            className={
              isSidebar
                ? `relative h-full ${drawerWidth} bg-[var(--card)] text-[var(--ink)] shadow-[-12px_0_40px_rgba(0,0,0,0.12)] border-l border-[var(--line)] flex flex-col shrink-0`
                : `relative w-full bg-[var(--card)] text-[var(--ink)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[var(--line)] flex flex-col max-h-[85vh] overflow-hidden shrink-0`
            }
            initial={variant === "sidebar" ? { x: "100%" } : { opacity: 0, scale: 0.95, y: 12 }}
            animate={variant === "sidebar" ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={variant === "sidebar" ? { x: "100%" } : { opacity: 0, scale: 0.95, y: 12 }}
            transition={variant === "sidebar" ? { type: "spring", damping: 25, stiffness: 200 } : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b border-[var(--line)] shrink-0 ${variant === 'sidebar' ? 'bg-[var(--card)]' : ''}`}>
              <h3 className="font-serif text-xl">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--line)] transition-colors opacity-60 hover:opacity-100"
                aria-label="Tutup"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className={`px-6 py-4 border-t border-[var(--line)] shrink-0 flex gap-3 ${variant === 'sidebar' ? 'bg-[var(--card)]' : ''}`}>
                {footer}
              </div>
            )}
          </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
