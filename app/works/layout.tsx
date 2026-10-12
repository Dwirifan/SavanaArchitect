import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Works — Houses, Studios & Cultural Projects",
  description:
    "Explore SAVANA Architecture works: houses by the paddies in Ubud, studios in Jakarta, villas in Lombok and cultural pavilions in bamboo. Filter by Residential, Hospitality, Cultural & more.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works | SAVANA Architecture",
    description: "Houses, studios and cultural projects by SAVANA — honest construction in local materials.",
    url: "/works",
    type: "website",
  },
};
export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
