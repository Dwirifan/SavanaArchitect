"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function ObjectDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("from") === "landing";
  const [cms, setCms] = useState<CMS | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const backHref = fromLanding ? "/#objects" : "/objects";
  const backLabel = fromLanding ? "Back to home" : "Back to objects";

  useEffect(() => {
    loadCMS().then(setCms);
  }, []);

  if (!cms) return null;
  const product = cms.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <Navbar />
        <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-20">
          <p>Object not found.</p>
          <button onClick={() => router.back()} className="mt-4 underline">Go back</button>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [product.image, ...(product.images ?? [])];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />

      <main className="flex-1 w-full pt-12 pb-32">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pb-10">
          <Link href={backHref} className="inline-flex items-center gap-2 t-label opacity-40 hover:opacity-100 transition-all duration-300 group">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {backLabel}
          </Link>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-start">
            
            {/* LEFT: Image Gallery */}
            <div className="flex flex-col gap-6">
              {/* Main image viewer — fixed aspect ratio, object-cover */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--card)]">
                <img
                  src={allImages[activeImg]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                />
              </div>

              {/* Thumbnails row */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative aspect-[4/3] overflow-hidden transition-all duration-300 ${activeImg === i ? "ring-1 ring-[var(--ink)] opacity-100" : "opacity-40 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              

            </div>

            {/* RIGHT: Product Details Sticky */}
            <div className="lg:sticky lg:top-32 flex flex-col gap-10">
              <div className="flex flex-col">
                <div className="flex gap-2 text-[10px] tracking-[0.2em] uppercase opacity-50 flex-wrap mb-8">
                  <span className="px-3 py-1.5 border border-[var(--line)]">{product.category}</span>
                  {!product.inStock && <span className="px-3 py-1.5 bg-[var(--ink)] text-[var(--bg)]">Preorder 3 weeks</span>}
                </div>
                
                <h1 className="font-serif leading-[0.9] tracking-[-0.03em] mb-6" style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}>
                  {product.name}
                </h1>
                
                <div className="text-[24px] md:text-[28px] font-medium tracking-[-0.01em] opacity-90">{product.price}</div>
              </div>

              <div className="border-t border-[var(--line)] pt-8">
                <p className="text-[15px] leading-[1.8] opacity-75">{product.excerpt}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--line)] pt-8">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] opacity-40 mb-2.5">Material</div>
                  <div className="text-[14px] font-medium tracking-[-0.01em] opacity-90">{product.material}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] opacity-40 mb-2.5">Dimensions</div>
                  <div className="text-[14px] font-medium tracking-[-0.01em] opacity-90">{product.dimensions}</div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={`https://wa.me/6281234567890?text=Hello%20SAVANA,%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden bg-[var(--ink)] px-8 py-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--bg)] transition-transform active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-2">Order via WhatsApp</span>
                  <div className="absolute inset-0 z-0 h-full w-full bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute">Order via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ObjectDetailPage() {
  return (
    <Suspense>
      <ObjectDetailContent />
    </Suspense>
  );
}
