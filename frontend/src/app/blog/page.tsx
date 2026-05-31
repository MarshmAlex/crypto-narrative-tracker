import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Narrative Blog — Real-Time Trends & Emerging Themes | Crypto Narrative Tracker",
  description:
    "Stay ahead of the market with in-depth analysis of the hottest crypto narratives. DeFi, AI tokens, Solana, RWA and more — updated weekly from live Reddit and market data.",
  openGraph: {
    title: "Crypto Narrative Blog — Real-Time Trends & Emerging Themes",
    description:
      "In-depth analysis of the hottest crypto narratives: DeFi, AI tokens, Solana, RWA, memecoins. Discover emerging trends before the crowd.",
    type: "website",
  },
};

const ARTICLES = [
  {
    slug: "top-crypto-narratives-may-2026",
    title: "Top Crypto Narratives Right Now: DeFi Dominates, AI Tokens Surge — May 2026",
    date: "2026-05-31",
    excerpt:
      "DeFi reclaims the top spot with a perfect momentum score of 100. AI tokens accelerate on the back of institutional interest. Here's what our real-time tracker is seeing across 10,000+ Reddit posts.",
    tags: ["DeFi", "AI Tokens", "Solana", "RWA", "real-time crypto trends"],
    readingTime: "3 min read",
    content: `
## The Crypto Narrative Landscape — May 2026

Our Crypto Narrative Tracker has been running continuously for the past week, ingesting over 10,000 Reddit posts every 48 hours and cross-referencing them with CoinGecko market data. Here's what the data is telling us right now.

### 🥇 DeFi — Score 100/100

DeFi is the undisputed king of crypto narratives this week. With **76 Reddit mentions in the last 24 hours** and a steady 7-day climb from 61.6 to 100, the momentum is unmistakable. Key catalysts include Coinbase and Kalshi launching regulated perpetual crypto futures for US investors, and the CFTC backing 24/7 trading infrastructure. Top coins in this narrative: **AAVE** ($81.42), **UNI** ($2.98), **COMP**, **CRV**, and **GMX**.

### 🤖 AI Tokens — Score 54/100

AI tokens are the second-strongest narrative, scoring 54 with 29 mentions in 24 hours. The 7-day trajectory shows consistent growth (31.7 → 54.0), driven by speculation around AI-powered trading and on-chain agent frameworks. **FET (Artificial Superintelligence Alliance)** is trending with a +24.6% 7-day gain despite a -2.5% daily dip. **NEAR Protocol** and **Worldcoin (WLD)** are also in focus. Keep an eye on **Bittensor (TAO)** at $252.

### 🏦 Real World Assets (RWA) — Score 27.5/100

RWA is quietly heating up. With 18 mentions and a 7-day score progression from 12.4 to 27.5, this narrative is accelerating. The DTCC's $4.7 quadrillion tokenization plan generated significant discussion, and the $65B RWA race is drawing major attention. **ONDO** is the leading coin here, up +4.3% in 24h despite broader market softness.

### ⚡ Solana Ecosystem — Score 27.3/100

Solana maintains strong narrative momentum at 27.3, up from 10.8 a week ago. **SOL** trades at $81.75 and is trending, alongside **BONK**. The Solana ecosystem narrative benefits from strong developer activity, low fees, and the ongoing memecoin culture built on top of it.

### 🐸 Memecoins — Score 13.1/100

Memecoins score 13.1, holding steady. **DOGE** ($0.099), **SHIB** ($0.00000544), and **PEPE** ($0.00000337) are the anchors. Community sentiment around DOGE technical patterns (descending wedge breakout) is generating some discussion, but momentum is modest compared to DeFi and AI.

---

## What to Watch Next

The Layer 2 / Scaling narrative is quietly building (4.5, up from 2.1 last week), particularly around Base and Arbitrum. If you're watching for the next rotation out of DeFi, L2s could be the landing spot.

**Check back every week** for our updated narrative rankings. All data is sourced in real-time from Reddit and CoinGecko — no opinions, just momentum.
    `.trim(),
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-surface-950 text-white px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-400 font-black text-xl mb-6 hover:text-brand-300 transition-colors"
          >
            📡 Crypto Narrative Tracker
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Crypto Narrative Blog
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Weekly deep-dives into <strong className="text-slate-300">real-time crypto trends</strong> and{" "}
            <strong className="text-slate-300">emerging narratives</strong> — powered by live Reddit and
            market data. DeFi, AI tokens, Solana, RWA, and more.
          </p>
        </div>

        {/* Article list */}
        <div className="space-y-8">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl bg-surface-800/50 border border-surface-600/40 hover:border-brand-500/40 transition-colors overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <time
                    dateTime={article.date}
                    className="text-xs text-slate-500 font-mono"
                  >
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{article.readingTime}</span>
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white mb-3 leading-tight">
                  {article.title}
                </h2>

                <p className="text-slate-400 mb-6 leading-relaxed">{article.excerpt}</p>

                {/* Full content rendered inline (single article page for now) */}
                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  {article.content.split("\n\n").map((block, idx) => {
                    if (block.startsWith("## ")) {
                      return (
                        <h2 key={idx} className="text-lg font-black text-white mt-8 mb-3">
                          {block.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (block.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-base font-bold text-brand-300 mt-6 mb-2">
                          {block.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (block.startsWith("---")) {
                      return <hr key={idx} className="border-surface-600 my-6" />;
                    }
                    // Inline bold parsing
                    const parts = block.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <p key={idx} className="text-slate-400 text-sm leading-relaxed mb-4">
                        {parts.map((part, pi) =>
                          part.startsWith("**") ? (
                            <strong key={pi} className="text-slate-200 font-semibold">
                              {part.replace(/\*\*/g, "")}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-16 text-center p-10 rounded-2xl bg-surface-800/30 border border-dashed border-surface-600/40">
          <p className="text-slate-500 text-sm mb-2">More articles coming soon</p>
          <p className="text-slate-400 text-xs">
            Weekly posts generated from live narrative data — every Monday, automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
