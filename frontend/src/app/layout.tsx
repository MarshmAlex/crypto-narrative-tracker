import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoNarrativeTracker — Spot emerging narratives before the crowd",
  description:
    "Real-time crypto narrative momentum tracker. Detect AI tokens, RWA, DePIN, memecoins, and more before they trend.",
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
