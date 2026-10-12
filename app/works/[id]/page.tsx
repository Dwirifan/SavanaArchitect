import { Suspense } from "react";
import Client from "./Client";
import type { Metadata } from "next";
import { DEFAULT_PROJECTS } from "@/lib/cms.defaults";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = DEFAULT_PROJECTS.find(x => x.id === id);
  if (!p) return { title: "Project not found", robots: { index: false, follow: false } };
  const title = `${p.title} — ${p.location} · ${p.year}`;
  const desc = p.excerpt.replace(/<[^>]*>/g, "").slice(0, 155);
  const url = `/works/${p.id}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: "article", images: [{ url: p.cover, width: 1200, height: 800, alt: p.title }] },
    twitter: { card: "summary_large_image", title, description: desc, images: [p.cover] },
  };
}

export function generateStaticParams() {
  return DEFAULT_PROJECTS.map(p => ({ id: p.id }));
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Client />
    </Suspense>
  );
}
