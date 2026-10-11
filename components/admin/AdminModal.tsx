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
          className={
            isSidebar
              ? "fixed top-16 right-0 bottom-0 left-0 md:left-64 z-50 flex justify-end"
              : "fixed top-16 bottom-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center p-4 md:p-6"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
        >
          {/* Backdrop — blur animated via framer-motion */}
          <motion.div
            className="absolute inset-0"
            initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
            animate={{
              backdropFilter: "blur(4px)",
              backgroundColor: isSidebar ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.28)",
            }}
            exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ WebkitBackdropFilter: "blur(4px)" } as any}
          />

          {/* Dialog / Drawer */}
          <motion.div
            key="dialog"
            style={isSidebar ? undefined : modalStyle}
            className={
              isSidebar
                ? `relative h-full ${drawerWidth} bg-[var(--card)] text-[var(--ink)] shadow-2xl border-l border-[var(--line)] flex flex-col shrink-0`
                : `relative w-full bg-[var(--card)] text-[var(--ink)] rounded-2xl shadow-2xl border border-[var(--line)] flex flex-col max-h-[85vh] overflow-hidden shrink-0`
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
