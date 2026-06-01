import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Narrative Tracker — Trending Crypto Narratives & Market Sentiment | GeniBiz",
  description:
    "Track trending crypto narratives and crypto market sentiment in real-time. Our crypto narrative tracker monitors DeFi, AI tokens, Solana, RWA & memecoins — updated every 2 hours from 10,000+ Reddit posts and CoinGecko data.",
  keywords: [
    "crypto narrative tracker",
    "trending crypto narratives",
    "crypto market sentiment",
    "crypto trends",
    "DeFi narrative",
    "AI tokens trend",
    "Solana ecosystem",
    "RWA crypto",
    "memecoin narrative",
    "crypto momentum",
  ],
  metadataBase: new URL("https://genibiz.com"),
  alternates: {
    canonical: "https://genibiz.com",
  },
  openGraph: {
    title: "Crypto Narrative Tracker — Trending Crypto Narratives & Market Sentiment",
    description:
      "Track trending crypto narratives and crypto market sentiment in real-time. Monitor DeFi, AI tokens, Solana, RWA & more — updated every 2 hours.",
    url: "https://genibiz.com",
    siteName: "GeniBiz",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Narrative Tracker — Spot Trending Narratives Before the Crowd",
    description:
      "Real-time crypto market sentiment tracker. See which crypto narratives are trending now — DeFi, AI tokens, Solana, RWA, memecoins.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Replace with actual GSC verification code when available
    google: "GOOGLE_SITE_VERIFICATION_CODE",
  },
  themeColor: "#0a0e17",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GeniBiz — Crypto Narrative Tracker",
    url: "https://genibiz.com",
    description:
      "Track trending crypto narratives and crypto market sentiment in real-time.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://genibiz.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-surface-900 text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
