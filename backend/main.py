#!/usr/bin/env python3
"""
main.py — Orchestrator for CryptoNarrativeTracker
Run:  python main.py
Cron: */120 * * * * cd /path/to/backend && python main.py >> logs/cron.log 2>&1
"""

import json
import logging
import os
import shutil
import sys
from pathlib import Path

from scraper import fetch_all_reddit_posts, fetch_trending_coins, fetch_market_data, fetch_coin_categories
from analyzer import analyze_narratives

# ── Logging setup ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("main")

# ── Paths ──────────────────────────────────────────────────────────────────────
BACKEND_DIR = Path(__file__).parent
DATA_DIR = BACKEND_DIR / "data"
OUTPUT_FILE = DATA_DIR / "narratives.json"

# Frontend public data (copy target for Next.js static serving)
FRONTEND_PUBLIC = BACKEND_DIR.parent / "frontend" / "public" / "data" / "narratives.json"


def run():
    logger.info("=== CryptoNarrativeTracker — pipeline start ===")

    # 1. Scrape Reddit
    logger.info("Step 1/4 — Fetching Reddit posts…")
    posts = fetch_all_reddit_posts(sleep_between=2.0)
    logger.info("  → %d posts collected", len(posts))

    # 2. Fetch CoinGecko data
    logger.info("Step 2/4 — Fetching CoinGecko data…")
    trending = fetch_trending_coins()
    logger.info("  → %d trending coins", len(trending))

    market = fetch_market_data()
    logger.info("  → %d market coins", len(market))

    categories = fetch_coin_categories()
    logger.info("  → %d categories", len(categories))

    # 3. Analyse
    logger.info("Step 3/4 — Analysing narratives…")
    result = analyze_narratives(posts, trending, market, categories)
    narratives = result["narratives"]
    meta = result["meta"]
    logger.info("  → %d narratives scored", len(narratives))

    for i, n in enumerate(narratives[:5], 1):
        logger.info(
            "  #%d %-28s score=%-6.1f mentions=%d velocity=%.2f sentiment=%+.2f",
            i, n["name"], n["score"], n["mentions_24h"], n["velocity"], n["sentiment"],
        )

    # 4. Save JSON
    logger.info("Step 4/4 — Saving output…")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    payload = {"meta": meta, "narratives": narratives}

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    logger.info("  → saved %s (%d bytes)", OUTPUT_FILE, OUTPUT_FILE.stat().st_size)

    # Copy to frontend public dir if it exists
    if FRONTEND_PUBLIC.parent.exists():
        shutil.copy(OUTPUT_FILE, FRONTEND_PUBLIC)
        logger.info("  → copied to frontend: %s", FRONTEND_PUBLIC)

    logger.info("=== Pipeline complete ===")
    return payload


if __name__ == "__main__":
    result = run()
    # Print a brief summary to stdout
    print("\n── Top Narratives ──────────────────────────────")
    for i, n in enumerate(result["narratives"][:10], 1):
        trend = "↑" if n["velocity"] > 1 else "↓"
        print(
            f"  {i:2d}. {trend} {n['name']:<28} score={n['score']:5.1f}  "
            f"mentions={n['mentions_24h']:4d}  sentiment={n['sentiment']:+.2f}"
        )
    print(f"\nGenerated at: {result['meta']['generated_at']}")
    print(f"Posts analysed: {result['meta']['posts_analysed']}")
