"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { loadCMS, type CMS } from "@/lib/cms";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function WorkDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [cms, setCms] = useState<CMS | null>(null);

  useEffect(() => {
    loadCMS().then(setCms);
  }, []);

  if (!cms) return null;
  const project = cms.projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <Navbar />
        <main className="flex-1 mx-auto max-w-[1600px] w-full px-4 md:px-8 lg:px-12 pt-20">
          <p>Project not found.</p>
          <button onClick={() => router.back()} className="mt-4 underline">Go back</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />

      <main className="flex-1 w-full pt-12 pb-32">
        {/* Back nav container */}
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 pb-12 lg:pb-16">
          <Link href="/works" className="inline-flex items-center gap-2 t-label opacity-40 hover:opacity-100 transition-all duration-300 group">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to projects
          </Link>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
          {/* Top header area: Title and Intro */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-24 items-end mb-16 lg:mb-24">
            <div>
              <div className="flex gap-2 text-[10px] tracking-[0.2em] uppercase opacity-50 flex-wrap mb-8">
                <span className="px-3 py-1.5 border border-[var(--line)]">{project.category}</span>
                <span className="px-3 py-1.5 bg-[var(--ink)] text-[var(--bg)]">{project.status}</span>
              </div>
              <h1 className="font-serif leading-[0.85] tracking-[-0.04em]" style={{ fontSize: "clamp(48px, 8vw, 120px)" }}>
                {project.title}
              </h1>
            </div>
            
            <div className="pb-2">
              <p className="text-[15px] md:text-[16px] leading-[1.8] opacity-75">{project.excerpt}</p>
            </div>
          </div>
        </div>

        {/* Hero image full width bleeds slightly but contained */}
        <div className="w-full mb-16 lg:mb-32">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8 lg:px-12">
            <div className="w-full overflow-hidden bg-[var(--card)]">
              <img src={project.cover} alt={project.title} className="w-full h-auto object-cover max-h-[85vh]" />
            </div>
          </div>
        </div>

        {/* Info Grid and Additional Images */}
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[300px_1fr] gap-16 lg:gap-32 items-start">
            
            {/* Project Details sticky */}
            <div className="lg:sticky lg:top-32 flex flex-col gap-10 order-2 lg:order-1">
              <div className="flex flex-col gap-8">
                <div className="border-t border-[var(--line)] pt-5">
                  <div className="text-[10px] uppercase tracking-[0.16em] opacity-40 mb-2.5">Location</div>
                  <div className="text-[15px] font-medium tracking-[-0.01em] opacity-90">{project.location}</div>
                </div>
                <div className="border-t border-[var(--line)] pt-5">
                  <div className="text-[10px] uppercase tracking-[0.16em] opacity-40 mb-2.5">Year</div>
                  <div className="text-[15px] font-medium tracking-[-0.01em] opacity-90">{project.year}</div>
                </div>
                {project.area && (
                  <div className="border-t border-[var(--line)] pt-5">
                    <div className="text-[10px] uppercase tracking-[0.16em] opacity-40 mb-2.5">Area</div>
                    <div className="text-[15px] font-medium tracking-[-0.01em] opacity-90">{project.area}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images Stack */}
            {project.images && project.images.length > 0 && (
              <div className="flex flex-col gap-8 lg:gap-16 order-1 lg:order-2">
                {project.images.map((img, i) => (
                  <div key={i} className="w-full overflow-hidden bg-[var(--card)]">
                    <img src={img} alt={`${project.title} gallery ${i+1}`} className="w-full h-auto object-cover max-h-[90vh]" />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
