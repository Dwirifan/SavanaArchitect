import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Objects — Teak, Rattan & Terracotta Editions",
  description:
    "Objects by SAVANA: Sora dining tables, Kala chairs, terracotta pendants and bamboo benches — reclaimed teak and local materials, made in Jepara & Plered.",
  alternates: { canonical: "/objects" },
  openGraph: { title: "Objects | SAVANA Architecture", description: "Furniture & objects in reclaimed teak, rattan and terracotta.", url: "/objects", type: "website" },
};
export default function ObjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
