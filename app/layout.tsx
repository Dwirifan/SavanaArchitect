import type { Metadata } from "next";
import { Space_Grotesk, DM_Serif_Display, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const neoGrotesque = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://savana-architecture.vercel.app";
const SITE_NAME = "SAVANA Architecture";
const TITLE = "SAVANA Architecture — Jakarta Studio | Houses, Workspaces & Objects";
const DESCRIPTION =
  "SAVANA is a Jakarta-based architecture studio crafting houses, workspaces and objects in local materials and honest construction. Explore our works, objects, and journal.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "SAVANA Architecture",
    "arsitek Jakarta",
    "architecture studio Indonesia",
    "rumah tropis",
    "Jakarta architect",
    "interior design Jakarta",
    "furniture teak",
    "arsitektur lokal",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Architecture",
  alternates: {
    canonical: "/",
    languages: { "id-ID": "/", "en-US": "/" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SAVANA Architecture — Houses, workspaces and objects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
    creator: "@savanaarchitect",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/savanalogo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/savanalogo.png",
    shortcut: "/savanalogo.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    // google: "add-when-you-have-it",
  },
};

// JSON-LD Organization + WebSite
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/savanaarsitekblack.png`,
      description: DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: "Jakarta", addressCountry: "ID" },
      sameAs: ["https://instagram.com/savanaarchitecture"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "id-ID",
      publisher: { "@id": `${SITE_URL}#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/works?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${space.variable} ${serif.variable} ${mono.variable} ${neoGrotesque.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
