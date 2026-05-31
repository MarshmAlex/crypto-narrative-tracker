"use client";

import { useState } from "react";

const FREE_FEATURES = [
  "Top 3 narratives updated every 6h",
  "Momentum score + trend direction",
  "Associated coins + 24h price change",
  "7-day historical chart",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Full top 10 narrative board",
  "Top coins avec perf 7j par narrative",
  "Coins trending CoinGecko signalés 🔥",
  "REST API access (JSON)",
  "Alertes narratives en temps réel",
  "Accès anticipé aux nouvelles features",
];

export default function PricingCTA() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création du paiement. Réessaie.");
        setLoading(false);
      }
    } catch {
      alert("Erreur réseau. Réessaie.");
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Stay ahead of the narrative
          </h2>
          <p className="text-slate-400 text-lg">
            Serious traders use data. Upgrade to Pro and catch narratives while they're still forming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="p-6 rounded-2xl bg-surface-800/60 border border-surface-600/50 glow-card">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">€0</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">Start tracking narratives, no card required.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-brand-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-surface-500 text-slate-400 font-semibold text-sm cursor-default">
              Current plan
            </button>
          </div>

          {/* Pro */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-brand-900/30 to-surface-800/60 border border-brand-500/40 shadow-lg shadow-brand-500/10">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">€9</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">Full access. Cancel anytime.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-slate-200 text-sm">
                  <span className="text-brand-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-lg shadow-brand-500/20"
            >
              {loading ? "Redirection..." : "Get Pro — €9/month →"}
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-slate-500 text-xs">
          <span>🔒 No wallet required</span>
          <span>💳 Stripe secure checkout</span>
          <span>↩️ Cancel anytime</span>
          <span>📡 Data updated every 6 hours</span>
        </div>
      </div>
    </section>
  );
}
