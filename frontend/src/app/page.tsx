import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import NarrativeTable from "@/components/NarrativeTable";
import PricingCTA from "@/components/PricingCTA";

export const revalidate = 7200; // ISR: re-fetch every 2h (matches cron)

interface Coin {
  symbol: string;
  name: string;
  price_change_24h: number | null;
  is_trending: boolean;
}

interface Post {
  title: string;
  url: string;
  score: number;
  comments: number;
  subreddit: string;
}

interface HistoryPoint {
  date: string;
  score: number;
}

export interface Narrative {
  id: string;
  name: string;
  score: number;
  mentions_24h: number;
  velocity: number;
  sentiment: number;
  top_coins: Coin[];
  top_posts: Post[];
  history_7d: HistoryPoint[];
}

interface NarrativesData {
  meta: {
    generated_at: string;
    posts_analysed: number;
    trending_coins: number;
    market_coins: number;
  };
  narratives: Narrative[];
}

function loadNarratives(): NarrativesData {
  // In production (Vercel) this file is in public/data/
  // We read at build/request time for static generation
  const filePath = path.join(process.cwd(), "public", "data", "narratives.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    // Return mock data if file doesn't exist yet
    return getMockData();
  }
}

export default function Home() {
  const data = loadNarratives();
  const { narratives, meta } = data;

  const freeNarratives = narratives.slice(0, 3);
  const proNarratives = narratives.slice(3, 10);

  return (
    <main className="min-h-screen">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid-size opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <Hero meta={meta} />

        {/* Dashboard section */}
        <section id="dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              Narrative Momentum Board
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Ranked by composite score: mention velocity × engagement × sentiment × on-chain signals
            </p>
          </div>

          {/* Free tier */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                FREE
              </span>
              <span className="text-slate-500 text-xs">Top 3 narratives — updated every 2h</span>
            </div>
            <NarrativeTable narratives={freeNarratives} isPro={false} />
          </div>

          {/* Pro tier (blurred) */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PRO
              </span>
              <span className="text-slate-500 text-xs">Full top 10 + alerts + API access</span>
            </div>

            {/* Blurred pro content */}
            <div className="relative">
              <div className="blur-sm pointer-events-none select-none">
                <NarrativeTable narratives={proNarratives} isPro={false} />
              </div>

              {/* Upgrade overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-surface-900/60 rounded-xl backdrop-blur-[2px]">
                <div className="text-center p-8">
                  <div className="text-4xl mb-3">🔒</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Unlock All 10 Narratives
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    Get full access to all narratives, real-time alerts, coin-level breakdowns, and API access.
                  </p>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors"
                  >
                    Get Pro — €15/month
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingCTA />

        {/* Footer */}
        <footer className="border-t border-surface-600 py-8 text-center text-slate-600 text-xs">
          <p>CryptoNarrativeTracker · Data refreshed every 2 hours · Not financial advice</p>
          <p className="mt-1">
            Sources: Reddit (r/cryptocurrency, r/CryptoMarkets, r/defi, r/altcoin) · CoinGecko API
          </p>
        </footer>
      </div>
    </main>
  );
}

// ── Mock data for initial render before first scrape ─────────────────────────
function getMockData(): NarrativesData {
  const now = new Date().toISOString();
  const makeHistory = (score: number) =>
    Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0],
      score: Math.max(score * (0.4 + i * 0.1) * (0.8 + Math.random() * 0.4), 0),
    }));

  const narratives: Narrative[] = [
    {
      id: "ai_tokens", name: "AI Tokens", score: 92.5, mentions_24h: 847,
      velocity: 2.3, sentiment: 0.42,
      top_coins: [
        { symbol: "TAO", name: "Bittensor", price_change_24h: 8.4, is_trending: true },
        { symbol: "FET", name: "Fetch.ai", price_change_24h: 5.2, is_trending: false },
        { symbol: "RNDR", name: "Render", price_change_24h: 3.1, is_trending: true },
      ],
      top_posts: [
        { title: "AI agents are eating crypto — the next 100x narrative", url: "#", score: 4200, comments: 312, subreddit: "cryptocurrency" },
        { title: "TAO ecosystem breakdown: why Bittensor is different", url: "#", score: 2800, comments: 188, subreddit: "altcoin" },
      ],
      history_7d: makeHistory(92.5),
    },
    {
      id: "rwa", name: "Real World Assets (RWA)", score: 78.1, mentions_24h: 523,
      velocity: 1.8, sentiment: 0.35,
      top_coins: [
        { symbol: "ONDO", name: "Ondo Finance", price_change_24h: 12.1, is_trending: true },
        { symbol: "CFG", name: "Centrifuge", price_change_24h: 4.5, is_trending: false },
      ],
      top_posts: [
        { title: "BlackRock BUIDL fund hits $500M — RWA is real", url: "#", score: 3900, comments: 275, subreddit: "CryptoMarkets" },
      ],
      history_7d: makeHistory(78.1),
    },
    {
      id: "memecoins", name: "Memecoins", score: 65.3, mentions_24h: 1204,
      velocity: 0.7, sentiment: 0.18,
      top_coins: [
        { symbol: "PEPE", name: "Pepe", price_change_24h: -3.2, is_trending: false },
        { symbol: "WIF", name: "dogwifhat", price_change_24h: 6.7, is_trending: true },
        { symbol: "BONK", name: "Bonk", price_change_24h: 2.1, is_trending: false },
      ],
      top_posts: [
        { title: "Memecoin cycle 2025: which ones survive the bear?", url: "#", score: 1800, comments: 420, subreddit: "altcoin" },
      ],
      history_7d: makeHistory(65.3),
    },
    {
      id: "l2", name: "Layer 2 / Scaling", score: 58.7, mentions_24h: 398,
      velocity: 1.1, sentiment: 0.22,
      top_coins: [
        { symbol: "ARB", name: "Arbitrum", price_change_24h: 1.9, is_trending: false },
        { symbol: "OP", name: "Optimism", price_change_24h: 2.4, is_trending: false },
      ],
      top_posts: [],
      history_7d: makeHistory(58.7),
    },
    {
      id: "depin", name: "DePIN", score: 51.2, mentions_24h: 287,
      velocity: 1.4, sentiment: 0.31,
      top_coins: [
        { symbol: "HNT", name: "Helium", price_change_24h: 7.3, is_trending: true },
        { symbol: "FIL", name: "Filecoin", price_change_24h: -1.2, is_trending: false },
      ],
      top_posts: [],
      history_7d: makeHistory(51.2),
    },
    {
      id: "defi", name: "DeFi", score: 44.8, mentions_24h: 612, velocity: 0.9, sentiment: 0.15,
      top_coins: [{ symbol: "UNI", name: "Uniswap", price_change_24h: 0.8, is_trending: false }],
      top_posts: [],
      history_7d: makeHistory(44.8),
    },
    {
      id: "btc_ecosystem", name: "Bitcoin Ecosystem", score: 38.4, mentions_24h: 215,
      velocity: 0.8, sentiment: 0.28,
      top_coins: [{ symbol: "STX", name: "Stacks", price_change_24h: 3.4, is_trending: false }],
      top_posts: [],
      history_7d: makeHistory(38.4),
    },
    {
      id: "restaking", name: "Restaking / LRT", score: 32.1, mentions_24h: 178,
      velocity: 1.2, sentiment: 0.19,
      top_coins: [{ symbol: "EIGEN", name: "EigenLayer", price_change_24h: 5.1, is_trending: true }],
      top_posts: [],
      history_7d: makeHistory(32.1),
    },
    {
      id: "gamefi", name: "GameFi / NFT Gaming", score: 24.6, mentions_24h: 134,
      velocity: 0.6, sentiment: 0.08,
      top_coins: [{ symbol: "IMX", name: "Immutable", price_change_24h: 1.2, is_trending: false }],
      top_posts: [],
      history_7d: makeHistory(24.6),
    },
    {
      id: "solana_ecosystem", name: "Solana Ecosystem", score: 19.3, mentions_24h: 428,
      velocity: 0.5, sentiment: 0.12,
      top_coins: [{ symbol: "SOL", name: "Solana", price_change_24h: -0.8, is_trending: false }],
      top_posts: [],
      history_7d: makeHistory(19.3),
    },
  ];

  return {
    meta: { generated_at: now, posts_analysed: 0, trending_coins: 0, market_coins: 0 },
    narratives,
  };
}
