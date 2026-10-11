"use client";
import { useRef, useState, useEffect, useCallback } from "react";

export function ImageCropper({
  src,
  onCancel,
  onCrop,
  aspect = 1, // 1 = square (team avatar)
  outputSize = 800,
}: {
  src: string;
  onCancel: () => void;
  onCrop: (blob: Blob) => void;
  aspect?: number;
  outputSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  // box size in px (square crop)
  const BOX = 320;

  const onImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const natW = img.naturalWidth, natH = img.naturalHeight;
    // fit so smallest side covers BOX
    const coverScale = Math.max(BOX / natW, BOX / natH);
    // rendered size at scale=1
    setImgSize({ w: natW * coverScale, h: natH * coverScale });
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const clampOffset = (x: number, y: number, s: number) => {
    const w = imgSize.w * s, h = imgSize.h * s;
    const maxX = Math.max(0, (w - BOX) / 2);
    const maxY = Math.max(0, (h - BOX) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOffsetStart(offset);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setOffset(clampOffset(offsetStart.x + dx, offsetStart.y + dy, scale));
  };
  const handlePointerUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.max(1, Math.min(3, scale - e.deltaY * 0.001));
    setScale(next);
    setOffset((o) => clampOffset(o.x, o.y, next));
  };

  const doCrop = async () => {
    const img = imgRef.current;
    if (!img) return;
    // compute source rect
    const s = scale;
    const renderedW = imgSize.w * s;
    const renderedH = imgSize.h * s;
    // offset is center shift, so top-left of image relative to box center
    // box center is 0,0 ; image center at offset
    // visible area: box [-BOX/2, BOX/2]
    // image rect: [offset.x - renderedW/2, offset.y - renderedH/2] to [offset.x+renderedW/2, offset.y+renderedH/2]
    // need mapping to natural image pixels
    const natW = img.naturalWidth, natH = img.naturalHeight;
    // scale from rendered to natural: nat / (coverScale * renderedScale?) but easier:
    // rendered size = nat * coverScale * s  => factor = nat / rendered
    const factorX = natW / renderedW;
    const factorY = natH / renderedH;

    const imgLeft = offset.x - renderedW / 2;
    const imgTop = offset.y - renderedH / 2;
    // box left/top in same coords
    const boxLeft = -BOX / 2;
    const boxTop = -BOX / 2;
    // crop rect in rendered coords
    const cropXrender = boxLeft - imgLeft;
    const cropYrender = boxTop - imgTop;
    const cropWrender = BOX;
    const cropHrender = BOX / aspect; // stay square
    // to natural
    const sx = cropXrender * factorX;
    const sy = cropYrender * factorY;
    const sw = cropWrender * factorX;
    const sh = cropHrender * factorY;

    const canvas = document.createElement("canvas");
    const outW = outputSize;
    const outH = Math.round(outputSize / aspect);
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // high quality
    ctx.imageSmoothingQuality = "high";
    // fill fallback
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, outW, outH);
    // drawImage with source rect clipped
    // clamp source
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

    canvas.toBlob((blob) => { if (blob) onCrop(blob); }, "image/webp", 0.88);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]" onClick={onCancel}>
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 w-full max-w-[420px] space-y-4" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Atur Foto</h4>
          <span className="text-[11px] opacity-40">drag geser · scroll/ slider zoom · 1:1</span>
        </div>

        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          className="relative mx-auto rounded-xl overflow-hidden bg-black select-none touch-none"
          style={{ width: BOX, height: BOX, cursor: dragging ? "grabbing" : "grab" }}
        >
          <img
            ref={imgRef}
            src={src}
            alt=""
            onLoad={onImgLoad}
            draggable={false}
            className="absolute top-1/2 left-1/2 max-none pointer-events-none"
            style={{
              width: imgSize.w,
              height: imgSize.h,
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            }}
          />
          {/* circular overlay for team avatar */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(circle at 50% 50%, transparent ${BOX/2 -1}px, rgba(0,0,0,0.55) ${BOX/2}px)`,
            boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18)`,
            borderRadius: aspect===1 ? "9999px" : "12px",
          }}/>
          {/* grid */}
          <div className="absolute inset-0 pointer-events-none opacity-15" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: `${BOX/3}px ${BOX/3}px`,
          }}/>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-50">Zoom</span>
          <input type="range" min={1} max={3} step={0.02} value={scale} onChange={e=>{ const s=parseFloat(e.target.value); setScale(s); setOffset(o=> clampOffset(o.x,o.y,s));}} className="flex-1 accent-[var(--ink)]" />
          <span className="text-[11px] tabular-nums w-8 text-right">{scale.toFixed(2)}x</span>
        </div>

        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm hover:bg-[var(--bg)] transition-colors">Batal</button>
          <button onClick={doCrop} className="flex-1 py-2.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] text-sm hover:opacity-90 transition-opacity">Terapkan & Upload</button>
        </div>
      </div>
    </div>
  );
}
