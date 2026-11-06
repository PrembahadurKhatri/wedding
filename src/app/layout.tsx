import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { weddingDetails } from "@/data/wedding";
import "./globals.css";

// Self-hosted at build time by next/font (no render-blocking Google Fonts request).
// Nothing text-based is visible until the cover is tapped, so no font is preloaded: the cover
// artwork and app code get the bandwidth first, and fonts load right behind them.
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", preload: false });
// Devanagari faces are subset to the characters this invitation uses (src/fonts/*.subset.woff2, ~25 KB each
// instead of ~120 KB). If you add new Nepali text, regenerate them — see README.
const notoSans = localFont({
  src: [
    { path: "../fonts/NotoSansDevanagari-400.subset.woff2", weight: "400" },
    { path: "../fonts/NotoSansDevanagari-500.subset.woff2", weight: "500" },
  ],
  variable: "--font-noto-sans-deva",
  display: "swap",
  preload: false,
});
const notoSerif = localFont({
  src: [
    { path: "../fonts/NotoSerifDevanagari-400.subset.woff2", weight: "400" },
    { path: "../fonts/NotoSerifDevanagari-500.subset.woff2", weight: "500" },
  ],
  variable: "--font-noto-serif-deva",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${weddingDetails.bride.nameEnglish} & ${weddingDetails.groom.nameEnglish} | Wedding Invitation`,
  description:
    `Wedding invitation for ${weddingDetails.bride.nameEnglish} and ${weddingDetails.groom.nameEnglish} on ${weddingDetails.dateNepali} at ${weddingDetails.venue.name}, ${weddingDetails.venue.location}.`,
};

export const viewport: Viewport = {
  themeColor: "#3a0d18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${notoSans.variable} ${notoSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
