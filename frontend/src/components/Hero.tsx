"use client";

interface HeroProps {
  meta: {
    generated_at: string;
    posts_analysed: number;
    trending_coins: number;
    market_coins: number;
  };
}

export default function Hero({ meta }: HeroProps) {
  const generatedAt = new Date(meta.generated_at);
  const timeAgo = Math.round((Date.now() - generatedAt.getTime()) / 60000);
  const timeLabel =
    timeAgo < 60
      ? `${timeAgo}m ago`
      : `${Math.round(timeAgo / 60)}h ago`;

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <span className="text-brand-400 text-2xl font-black tracking-tight">
              📡 CNT
            </span>
            <span className="text-slate-300 font-semibold text-lg hidden sm:block">
              CryptoNarrativeTracker
            </span>
          </div>
          <a
            href="#pricing"
            className="px-4 py-2 rounded-lg border border-brand-500/40 text-brand-400 hover:bg-brand-500/10 text-sm font-medium transition-colors"
          >
            Get Pro →
          </a>
        </div>

        {/* Hero copy */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Live · Updated every 2 hours
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Spot crypto narratives{" "}
            <span className="text-brand-400">before the crowd</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8">
            We track 10,000+ Reddit posts and CoinGecko signals every 2 hours to surface
            emerging narratives — AI tokens, RWA, DePIN, memecoins and more — ranked by
            real momentum, not hype.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#dashboard"
              className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg transition-colors shadow-lg shadow-brand-500/25"
            >
              View Dashboard
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-xl border border-surface-500 hover:border-brand-500/50 text-slate-300 hover:text-white font-semibold text-lg transition-colors"
            >
              See Pro Features
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: "Posts analysed", value: meta.posts_analysed > 0 ? meta.posts_analysed.toLocaleString() : "200+" },
            { label: "Narratives tracked", value: "10" },
            { label: "Trending coins", value: meta.trending_coins > 0 ? meta.trending_coins.toString() : "15" },
            { label: "Last update", value: meta.posts_analysed > 0 ? timeLabel : "live" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-surface-800/60 border border-surface-600/50"
            >
              <div className="text-2xl font-black text-brand-400">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
