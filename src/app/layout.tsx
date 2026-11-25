import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Jost } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { Cursor } from "@/components/chrome/Cursor";
import "./globals.css";
import "@/styles/landing.css";
import "@/styles/commerce.css";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://thesvela-ten.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SVELA — Portable Marine Lantern",
  description:
    "Brushed marine steel, fluted glass, saddle leather. A portable marine lantern, dimmable to candlelight, sealed to IP67, up to forty hours from a single charge.",
  openGraph: {
    title: "SVELA — Portable Marine Lantern",
    description: "Engineered for open waters. Crafted for timeless evenings.",
    images: ["/svela/m/deck.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${cormorant.variable} ${plexMono.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <Cursor />
        </CartProvider>
      </body>
    </html>
  );
}
