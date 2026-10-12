import { Suspense } from "react";
import Client from "./Client";
import type { Metadata } from "next";
import { DEFAULT_JOURNAL } from "@/lib/cms.defaults";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const j = DEFAULT_JOURNAL.find(x => x.id === id);
  if (!j) return { title: "Artikel tidak ditemukan", robots: { index: false, follow: false } };
  const title = j.title;
  const desc = j.excerpt.replace(/<[^>]*>/g, "").slice(0, 155);
  const url = `/journal/${j.id}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: "article", images: [{ url: j.image, width: 1200, height: 630, alt: j.title }] },
    twitter: { card: "summary_large_image", title, description: desc, images: [j.image] },
  };
}

export function generateStaticParams() {
  return DEFAULT_JOURNAL.map(j => ({ id: j.id }));
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Client />
    </Suspense>
  );
}
