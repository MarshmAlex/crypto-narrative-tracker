"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Narrative } from "@/app/page";

const MomentumChart = dynamic(() => import("./MomentumChart"), { ssr: false });

interface NarrativeTableProps {
  narratives: Narrative[];
  isPro: boolean;
}

const RANK_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];

function SentimentBadge({ value }: { value: number }) {
  if (value > 0.2) return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Bullish</span>;
  if (value < -0.1) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Bearish</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">Neutral</span>;
}

function VelocityArrow({ velocity }: { velocity: number }) {
  if (velocity > 1.5) return <span className="text-brand-400 font-bold">↑↑</span>;
  if (velocity > 1.0) return <span className="text-brand-400">↑</span>;
  if (velocity < 0.5) return <span className="text-red-400">↓↓</span>;
  return <span className="text-yellow-400">→</span>;
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-white font-bold text-sm w-10 text-right tabular-nums">
        {score.toFixed(0)}
      </span>
    </div>
  );
}

export default function NarrativeTable({ narratives, isPro }: NarrativeTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {narratives.map((n, idx) => {
        const isOpen = expanded === n.id;
        const rankColor = RANK_COLORS[idx] ?? "text-slate-500";

        return (
          <div
            key={n.id}
            className="glow-card rounded-xl bg-surface-800/70 border border-surface-600/60 overflow-hidden transition-all"
          >
            {/* Main row */}
            <button
              onClick={() => setExpanded(isOpen ? null : n.id)}
              className="w-full text-left px-5 py-4"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank + name */}
                <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
                  <span className={`font-black text-lg w-6 ${rankColor}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-white font-semibold text-sm">{n.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <VelocityArrow velocity={n.velocity} />
                      <SentimentBadge value={n.sentiment} />
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="col-span-12 sm:col-span-3">
                  <div className="text-xs text-slate-500 mb-1">Score</div>
                  <ScoreBar score={n.score} />
                </div>

                {/* Stats */}
                <div className="col-span-6 sm:col-span-2">
                  <div className="text-xs text-slate-500 mb-1">Mentions/24h</div>
                  <div className="text-white font-semibold tabular-nums">
                    {n.mentions_24h.toLocaleString()}
                  </div>
                </div>

                {/* Coins */}
                <div className="col-span-6 sm:col-span-3">
                  <div className="text-xs text-slate-500 mb-1">Top coins</div>
                  <div className="flex flex-wrap gap-1">
                    {n.top_coins.slice(0, 3).map((c) => (
                      <span
                        key={c.symbol}
                        className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold border ${
                          c.is_trending
                            ? "bg-brand-500/20 text-brand-300 border-brand-500/40"
                            : "bg-surface-600/50 text-slate-400 border-surface-500/50"
                        }`}
                      >
                        {c.symbol}
                        {c.price_change_24h !== null && (
                          <span className={`ml-1 ${c.price_change_24h > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {c.price_change_24h > 0 ? "+" : ""}
                            {c.price_change_24h?.toFixed(1)}%
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand */}
                <div className="col-span-12 sm:col-span-1 text-right">
                  <span className="text-slate-500 text-xs">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="border-t border-surface-600/60 px-5 py-4 bg-surface-900/40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart */}
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
                      7-Day Momentum
                    </h4>
                    <MomentumChart history={n.history_7d} />
                  </div>

                  {/* Top posts */}
                  <div>
                    <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
                      Top Posts
                    </h4>
                    {n.top_posts.length > 0 ? (
                      <div className="space-y-2">
                        {n.top_posts.map((post, i) => (
                          <a
                            key={i}
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg bg-surface-700/50 hover:bg-surface-700 border border-surface-600/40 transition-colors"
                          >
                            <p className="text-slate-300 text-xs leading-snug mb-1 line-clamp-2">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>r/{post.subreddit}</span>
                              <span>↑ {post.score.toLocaleString()}</span>
                              <span>💬 {post.comments}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 text-xs italic">No posts available yet</p>
                    )}
                  </div>
                </div>

                {/* All coins */}
                <div className="mt-4">
                  <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                    Associated Coins
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {n.top_coins.map((c) => (
                      <div
                        key={c.symbol}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-700/50 border border-surface-600/40"
                      >
                        <div className="flex items-center gap-2">
                          {c.is_trending && <span className="text-xs">🔥</span>}
                          <span className="font-mono font-bold text-xs text-slate-200">{c.symbol}</span>
                          {c.market_cap_rank && (
                            <span className="text-xs text-slate-600">#{c.market_cap_rank}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-semibold ${
                            (c.price_change_7d ?? 0) > 0 ? "text-emerald-400" : "text-red-400"
                          }`}>
                            {(c.price_change_7d ?? 0) > 0 ? "+" : ""}{c.price_change_7d?.toFixed(1) ?? "—"}% 7j
                          </div>
                          {c.price_change_24h !== null && (
                            <div className={`text-xs ${
                              (c.price_change_24h ?? 0) > 0 ? "text-emerald-600" : "text-red-600"
                            }`}>
                              {(c.price_change_24h ?? 0) > 0 ? "+" : ""}{c.price_change_24h?.toFixed(1)}% 24h
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
