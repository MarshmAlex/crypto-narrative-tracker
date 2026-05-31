import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeniBiz — Crypto Narrative Tracker | Real-Time Crypto Trends",
  description:
    "Track emerging crypto narratives in real-time. DeFi, AI tokens, Solana, RWA — see what's hot before everyone else. Updated every 6 hours.",
  metadataBase: new URL("https://genibiz.com"),
  alternates: {
    canonical: "https://genibiz.com",
  },
  openGraph: {
    title: "GeniBiz — Crypto Narrative Tracker | Real-Time Crypto Trends",
    description:
      "Track emerging crypto narratives in real-time. DeFi, AI tokens, Solana, RWA — see what's hot before everyone else. Updated every 6 hours.",
    url: "https://genibiz.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeniBiz — Crypto Narrative Tracker | Real-Time Crypto Trends",
    description:
      "Track emerging crypto narratives in real-time. DeFi, AI tokens, Solana, RWA — see what's hot before everyone else. Updated every 6 hours.",
  },
  themeColor: "#0a0e17",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-surface-900 text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
