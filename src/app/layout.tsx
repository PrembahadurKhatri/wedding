import type { Metadata } from "next";
import { weddingDetails } from "@/data/wedding";
import "./globals.css";

export const metadata: Metadata = {
  title: `${weddingDetails.bride.nameEnglish} & ${weddingDetails.groom.nameEnglish} | Wedding Invitation`,
  description:
    `Wedding invitation for ${weddingDetails.bride.nameEnglish} and ${weddingDetails.groom.nameEnglish} on ${weddingDetails.dateNepali} at ${weddingDetails.venue.name}, ${weddingDetails.venue.location}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
