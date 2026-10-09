import type { Metadata } from "next";
import { Space_Grotesk, DM_Serif_Display, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";

// Body & UI  Space Grotesk (geometric, warm)
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Display (Neo-Grotesque Sans)
const neoGrotesque = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

// Display  DM Serif Display (editorial, architectural)
const serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Mono for section numbers  tabular, precise (like drawing numbers)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Savana Architect",
  description: "A Jakarta based architecture studio. Houses, workspaces and objects in local materials and honest construction.",
  icons: {
    icon: "/savanalogo.png",
    shortcut: "/savanalogo.png",
    apple: "/savanalogo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${space.variable} ${serif.variable} ${mono.variable} ${neoGrotesque.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
