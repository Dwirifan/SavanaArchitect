"use client";
import { useState, useRef, useEffect } from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--line)]/60 ${className}`} aria-hidden />;
}

export function ImageSkeleton({
  src,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setLoaded(false);
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);
  if (!src) {
    return <div className={`bg-[var(--line)]/30 animate-pulse overflow-hidden ${className}`} aria-hidden />;
  }
  return (
    <div className={`overflow-hidden bg-[var(--card)] ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-[var(--line)]/35 pointer-events-none">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>
      )}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${imgClassName} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}
