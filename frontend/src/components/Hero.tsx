"use client";

interface HeroProps {
  meta: {
    generated_at: string;
    posts_analysed: number;
    trending_coins: number;
    market_coins: number;
  };
}

const FAQ_ITEMS = [
  {
    question: "What is a crypto narrative?",
    answer:
      "A crypto narrative is a thematic story or trend that drives attention and capital flows within the cryptocurrency market. Examples include DeFi, AI tokens, Real World Assets (RWA), and the Solana ecosystem. Narratives often precede price movements as communities and investors rally around a shared idea.",
  },
  {
    question: "How does Crypto Narrative Tracker detect emerging narratives?",
    answer:
      "Crypto Narrative Tracker analyses 10,000+ Reddit posts every 2 hours and cross-references them with CoinGecko market signals. We score each narrative by mention velocity, sentiment, and on-chain momentum to surface what's gaining traction before it becomes mainstream news.",
  },
  {
    question: "Which narratives are currently trending?",
    answer:
      "As of our latest update, the top trending crypto narratives are DeFi (score 100), AI Tokens (score 54), Real World Assets — RWA (score 27.5), and the Solana Ecosystem (score 27.3). These are updated every 2 hours based on real-time Reddit and market data.",
  },
  {
    question: "What is the difference between free and Pro access?",
    answer:
      "The free tier shows top narratives with delayed data. Pro subscribers get real-time updates every 2 hours, full coin-level breakdown per narrative, 7-day trend history, velocity alerts, and API access to integrate narrative data into their own tools.",
  },
  {
    question: "Can I track AI tokens, DeFi, and Solana narratives specifically?",
    answer:
      "Yes. Crypto Narrative Tracker provides dedicated tracking for AI tokens, DeFi protocols, Solana ecosystem projects, RWA, memecoins, Layer 2 scaling solutions, DePIN, and more. Each narrative card shows top coins, momentum score, and recent posts driving the trend.",
  },
];

export default function Hero({ meta }: HeroProps) {
  const generatedAt = new Date(meta.generated_at);
  const timeAgo = Math.round((Date.now() - generatedAt.getTime()) / 60000);
  const timeLabel =
    timeAgo < 60
      ? `${timeAgo}m ago`
      : `${Math.round(timeAgo / 60)}h ago`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Crypto Narrative Tracker —{" "}
              <span className="text-brand-400">Trending Crypto Narratives & Market Sentiment in Real Time</span>
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8">
              The #1 <strong className="text-slate-300">crypto narrative tracker</strong> for spotting{" "}
              <strong className="text-slate-300">trending crypto narratives</strong> and reading{" "}
              <strong className="text-slate-300">crypto market sentiment</strong> before the crowd. From{" "}
              <strong className="text-slate-300">DeFi</strong> and{" "}
              <strong className="text-slate-300">AI tokens</strong> to{" "}
              <strong className="text-slate-300">Solana</strong> ecosystem plays — we analyse
              10,000+ Reddit posts and CoinGecko signals every 2 hours to surface what's
              gaining momentum.
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

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-900/40" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-4">
            How Our Crypto Narrative Tracker Works
          </h2>
          <p className="text-slate-400 text-center mb-14 max-w-xl mx-auto">
            Three simple steps to read crypto market sentiment and catch trending crypto narratives early.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "We scrape Reddit & markets",
                description:
                  "Every 2 hours, our engine scans 10,000+ Reddit posts across r/CryptoCurrency, r/defi, r/altcoin and more. Market data from CoinGecko is layered in for price context.",
              },
              {
                step: "02",
                title: "Narratives are scored & ranked",
                description:
                  "Each narrative — DeFi, AI tokens, Solana, RWA, memecoins — gets a momentum score based on mention velocity, sentiment, and trading volume. No noise, just signal.",
              },
              {
                step: "03",
                title: "You act before the crowd",
                description:
                  "Browse the live dashboard to see which narratives are heating up and which coins are leading them. Pro users get alerts the moment a narrative starts accelerating.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-surface-800/50 border border-surface-600/40 hover:border-brand-500/40 transition-colors"
              >
                <div className="text-5xl font-black text-brand-500/20 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-4">
            Frequently Asked Questions About Crypto Narratives
          </h2>
          <p className="text-slate-400 text-center mb-14">
            Everything you need to know about trending crypto narratives, crypto market sentiment, and how our tracker works.
          </p>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl bg-surface-800/50 border border-surface-600/40 hover:border-brand-500/30 transition-colors open:border-brand-500/40"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-white text-sm sm:text-base">
                  {item.question}
                  <span className="ml-4 text-brand-400 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
