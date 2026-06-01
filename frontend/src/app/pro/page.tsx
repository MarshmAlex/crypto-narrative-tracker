import Link from "next/link";
import { loadNarratives } from "@/lib/narratives";

function sentimentLabel(s: number): { text: string; color: string } {
  if (s > 0.1) return { text: "Bullish", color: "text-green-400" };
  if (s < -0.1) return { text: "Bearish", color: "text-red-400" };
  return { text: "Neutral", color: "text-yellow-400" };
}

function formatPrice(p: number | null): string {
  if (p === null) return "—";
  return `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

function formatPct(p: number | null): { text: string; color: string } {
  if (p === null) return { text: "—", color: "text-gray-500" };
  const sign = p >= 0 ? "+" : "";
  return {
    text: `${sign}${p.toFixed(2)}%`,
    color: p >= 0 ? "text-green-400" : "text-red-400",
  };
}

export default function ProPage() {
  const data = loadNarratives();
  const narratives = data.narratives.sort((a, b) => b.score - a.score);
  const updatedAt = new Date(data.meta.generated_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-400">
          GeniBiz <span className="text-yellow-400 text-sm ml-1">PRO</span>
        </Link>
        <div className="text-sm text-gray-500">
          Updated {updatedAt} UTC · {data.meta.posts_analysed} posts analyzed
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-500 text-xs uppercase tracking-wide">Narratives tracked</div>
            <div className="text-2xl font-bold mt-1">{narratives.length}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-500 text-xs uppercase tracking-wide">Posts analyzed</div>
            <div className="text-2xl font-bold mt-1">{data.meta.posts_analysed}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-500 text-xs uppercase tracking-wide">Trending coins</div>
            <div className="text-2xl font-bold mt-1">{data.meta.trending_coins}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-500 text-xs uppercase tracking-wide">Market coins</div>
            <div className="text-2xl font-bold mt-1">{data.meta.market_coins}</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">🔥 Narrative Deep Dive</h1>

        {/* Detailed narrative cards */}
        <div className="space-y-6">
          {narratives.map((n, idx) => {
            const sent = sentimentLabel(n.sentiment);
            return (
              <div
                key={n.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-sm font-mono">#{idx + 1}</span>
                      <h2 className="text-xl font-bold">{n.name}</h2>
                      <span className={`text-sm font-medium ${sent.color}`}>
                        {sent.text}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      Score: {n.score.toFixed(0)} · {n.mentions_24h} mentions 24h · Velocity: {n.velocity.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                      Score {n.score.toFixed(0)}
                    </div>
                    <div className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                      Sentiment {n.sentiment >= 0 ? "+" : ""}{n.sentiment.toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Coins table */}
                {n.top_coins.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                          <th className="text-left py-2 pr-4">Coin</th>
                          <th className="text-right py-2 px-4">Price</th>
                          <th className="text-right py-2 px-4">24h</th>
                          <th className="text-right py-2 px-4">7d</th>
                          <th className="text-right py-2 px-4">MCap Rank</th>
                          <th className="text-center py-2 pl-4">Trending</th>
                        </tr>
                      </thead>
                      <tbody>
                        {n.top_coins.map((c) => {
                          const change24 = formatPct(c.price_change_24h);
                          const change7d = formatPct(c.price_change_7d);
                          return (
                            <tr
                              key={c.symbol}
                              className="border-b border-gray-800/50 hover:bg-gray-800/30"
                            >
                              <td className="py-2 pr-4 font-medium">
                                {c.symbol}
                                {c.name !== c.symbol && (
                                  <span className="text-gray-500 ml-1 text-xs">{c.name}</span>
                                )}
                              </td>
                              <td className="text-right py-2 px-4 font-mono">
                                {formatPrice(c.current_price)}
                              </td>
                              <td className={`text-right py-2 px-4 font-mono ${change24.color}`}>
                                {change24.text}
                              </td>
                              <td className={`text-right py-2 px-4 font-mono ${change7d.color}`}>
                                {change7d.text}
                              </td>
                              <td className="text-right py-2 px-4 text-gray-400">
                                {c.market_cap_rank ?? "—"}
                              </td>
                              <td className="text-center py-2 pl-4">
                                {c.is_trending ? "🔥" : ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pro exclusive section */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">📊 Pro Exclusive Data</h2>
          <p className="text-gray-400 mb-4">
            You&apos;re viewing detailed narrative analysis with sentiment scores, velocity metrics,
            and coin-level breakdowns. Data refreshes every 6 hours.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>✅ Full narrative scores</span>
            <span>✅ Coin price data</span>
            <span>✅ Sentiment analysis</span>
            <span>✅ Velocity tracking</span>
          </div>
        </div>
      </div>
    </main>
  );
}
