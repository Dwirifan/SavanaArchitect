import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Journal — Field Notes on Material, Light & Site",
  description:
    "Field notes from SAVANA: uneven bricks in Bayat, thatch roof care, drawing shadows before walls, lime wash and reclaimed teak stories.",
  alternates: { canonical: "/journal" },
  openGraph: { title: "Journal | SAVANA Architecture", description: "Material, light, site — field notes by SAVANA.", url: "/journal", type: "website" },
};
export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
