import { Suspense } from "react";
import Client from "./Client";
import type { Metadata } from "next";
import { DEFAULT_PRODUCTS } from "@/lib/cms.defaults";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = DEFAULT_PRODUCTS.find(x => x.id === id);
  if (!p) return { title: "Object not found", robots: { index: false, follow: false } };
  const title = `${p.name} — ${p.material} · ${p.price}`;
  const desc = p.excerpt.replace(/<[^>]*>/g, "").slice(0, 155) || `${p.name} by SAVANA — ${p.material}`;
  const url = `/objects/${p.id}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: "website", images: [{ url: p.image, width: 800, height: 600, alt: p.name }] },
    twitter: { card: "summary_large_image", title, description: desc, images: [p.image] },
  };
}

export function generateStaticParams() {
  return DEFAULT_PRODUCTS.map(p => ({ id: p.id }));
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Client />
    </Suspense>
  );
}
