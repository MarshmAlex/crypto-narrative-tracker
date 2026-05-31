"""
analyzer.py — NLP keyword analysis + narrative scoring
Uses regex/keyword matching (no heavy ML) for MVP speed.
Produces scored, ranked narrative objects.
"""

import re
import math
import logging
from datetime import datetime, timezone
from collections import defaultdict
from typing import Optional

logger = logging.getLogger(__name__)

# ── Narrative definitions ──────────────────────────────────────────────────────
# Each narrative: keywords to detect in text, plus known related coin symbols.

NARRATIVES: list[dict] = [
    {
        "id": "ai_tokens",
        "name": "AI Tokens",
        "keywords": [
            r"\bai\b", r"\bartificial intelligence\b", r"\bmachine learning\b",
            r"\bgpt\b", r"\bllm\b", r"\bfetch\.?ai\b", r"\bsingularity\b",
            r"\brender\b", r"\bnear\b", r"\bworldcoin\b", r"\bai agents?\b",
            r"\bagentfi\b", r"\bai16z\b", r"\bvirtuals\b", r"\beliza\b",
        ],
        "coins": ["FET", "AGIX", "OCEAN", "RNDR", "WLD", "NEAR", "TAO", "AI16Z"],
    },
    {
        "id": "rwa",
        "name": "Real World Assets (RWA)",
        "keywords": [
            r"\brwa\b", r"\breal.?world assets?\b", r"\btokenized?\b",
            r"\btokenization\b", r"\breal estate\b", r"\bbonds?\b",
            r"\bcredit\b", r"\bondo\b", r"\bcentrifuge\b", r"\bmapple\b",
            r"\bgoldfinch\b", r"\bbackd\b",
        ],
        "coins": ["ONDO", "CFG", "MPL", "GFI", "TRU", "POLY"],
    },
    {
        "id": "memecoins",
        "name": "Memecoins",
        "keywords": [
            r"\bmemecoin\b", r"\bmeme coin\b", r"\bdoge\b", r"\bshib\b",
            r"\bpepe\b", r"\bbonk\b", r"\bfloki\b", r"\bwif\b",
            r"\bdog.?wifhat\b", r"\bbook of meme\b", r"\bbome\b",
            r"\bpump\.fun\b", r"\bsol meme\b", r"\bcabal\b",
        ],
        "coins": ["DOGE", "SHIB", "PEPE", "BONK", "WIF", "BOME", "FLOKI"],
    },
    {
        "id": "l2",
        "name": "Layer 2 / Scaling",
        "keywords": [
            r"\bl2\b", r"\blayer.?2\b", r"\brollup\b", r"\boptimistic rollup\b",
            r"\bzk.?rollup\b", r"\bzk.?proof\b", r"\barbitrum\b", r"\boptimism\b",
            r"\bbase\b", r"\bpolygon\b", r"\bstarknet\b", r"\bscroll\b",
            r"\blinea\b", r"\bblast\b", r"\bscaling\b",
        ],
        "coins": ["ARB", "OP", "MATIC", "IMX", "STRK", "MNT"],
    },
    {
        "id": "depin",
        "name": "DePIN",
        "keywords": [
            r"\bdepin\b", r"\bdecentralized physical\b", r"\bphysical infrastructure\b",
            r"\bhelium\b", r"\brender\b", r"\bfilecoin\b", r"\blivepeer\b",
            r"\biot\b", r"\bwireless\b", r"\bhotspot\b", r"\bmining hardware\b",
            r"\bsoilx\b", r"\bworldmobile\b",
        ],
        "coins": ["HNT", "FIL", "LPT", "RNDR", "MOBILE", "IOT"],
    },
    {
        "id": "defi",
        "name": "DeFi",
        "keywords": [
            r"\bdefi\b", r"\bdecentralized finance\b", r"\byield\b",
            r"\bliquidity\b", r"\bdex\b", r"\bamm\b", r"\buniswap\b",
            r"\baave\b", r"\bcompound\b", r"\bcurve\b", r"\bsynthetix\b",
            r"\bperpetuals?\b", r"\bleverag\b", r"\bstaking\b", r"\btvl\b",
        ],
        "coins": ["UNI", "AAVE", "COMP", "CRV", "SNX", "GMX", "DYDX"],
    },
    {
        "id": "btc_ecosystem",
        "name": "Bitcoin Ecosystem",
        "keywords": [
            r"\border(i?nals?)?\b", r"\bbrc.?20\b", r"\bbitcoin l2\b",
            r"\brunes\b", r"\bstacks\b", r"\bmerlin\b", r"\bbob\b",
            r"\bbitlayer\b", r"\bbrc20\b", r"\bsatoshi\b",
            r"\bbitcoin scaling\b", r"\blightning\b",
        ],
        "coins": ["STX", "SATS", "ORDI", "RATS"],
    },
    {
        "id": "gamefi",
        "name": "GameFi / NFT Gaming",
        "keywords": [
            r"\bgamefi\b", r"\bplay.?to.?earn\b", r"\bp2e\b",
            r"\bnft game\b", r"\bblockchain game\b", r"\baxie\b",
            r"\bgods unchained\b", r"\bimmutable\b", r"\bgala\b",
            r"\bsand\b", r"\bmana\b", r"\bmetaverse\b",
        ],
        "coins": ["AXS", "IMX", "GALA", "SAND", "MANA", "ILV", "YGG"],
    },
    {
        "id": "restaking",
        "name": "Restaking / LRT",
        "keywords": [
            r"\brestaking\b", r"\beigenlayer\b", r"\blrt\b",
            r"\bliquid restaking\b", r"\beigen\b", r"\bpuffer\b",
            r"\bether\.fi\b", r"\brenzo\b", r"\bswell\b", r"\bkelp\b",
        ],
        "coins": ["EIGEN", "ETHFI", "PENDLE", "SWELL", "REZ"],
    },
    {
        "id": "solana_ecosystem",
        "name": "Solana Ecosystem",
        "keywords": [
            r"\bsolana\b", r"\bsol\b", r"\bjupiter\b", r"\braydium\b",
            r"\borca\b", r"\bphoenix\b", r"\bjito\b", r"\bsol ecosystem\b",
            r"\bsolflare\b", r"\bphantom\b", r"\bpump\.fun\b",
            r"\bsolana nft\b", r"\bmagic eden\b",
        ],
        "coins": ["SOL", "JUP", "RAY", "ORCA", "JTO", "BONK", "WIF"],
    },
]

# ── Sentiment keywords ─────────────────────────────────────────────────────────

POSITIVE_WORDS = re.compile(
    r"\b(bull|bullish|moon|mooning|pump|pumping|breakout|surge|rally|ath|all.?time.?high"
    r"|buy|accumulate|gem|undervalued|potential|explosive|parabolic|gains?|profit"
    r"|alpha|narrative|hot|trending|hype|launch|partnership|adoption|integration"
    r"|scaling|upgrade|mainnet|outperform|recovery|bounce)\b",
    re.IGNORECASE,
)

NEGATIVE_WORDS = re.compile(
    r"\b(bear|bearish|dump|dumping|crash|collapse|scam|rug|rugpull|fraud|ponzi"
    r"|overvalued|bubble|dead|dying|sell|short|avoid|warning|hack|exploit"
    r"|decline|drop|fall|loss|rekt|exit|fud|manipulation|whale dump)\b",
    re.IGNORECASE,
)


# ── Core analysis helpers ──────────────────────────────────────────────────────

def _compile_patterns(keywords: list[str]) -> re.Pattern:
    return re.compile("|".join(keywords), re.IGNORECASE)


def _count_matches(text: str, pattern: re.Pattern) -> int:
    return len(pattern.findall(text))


def _sentiment_score(text: str) -> float:
    """Returns a score in [-1, 1]; positive = bullish."""
    pos = _count_matches(text, POSITIVE_WORDS)
    neg = _count_matches(text, NEGATIVE_WORDS)
    total = pos + neg
    if total == 0:
        return 0.0
    return (pos - neg) / total


def _post_weight(post: dict) -> float:
    """Engagement weight: upvotes + comments, amplified by ratio."""
    score = max(post.get("score", 0), 0)
    comments = max(post.get("num_comments", 0), 0)
    ratio = post.get("upvote_ratio", 0.5)
    return (score * ratio + comments * 2) + 1  # +1 floor


def _post_text(post: dict) -> str:
    return f"{post.get('title', '')} {post.get('selftext', '')} {post.get('flair', '')}"


def _age_hours(post: dict) -> float:
    """How many hours ago was the post created?"""
    now = datetime.now(timezone.utc).timestamp()
    created = post.get("created_utc", now)
    return max((now - created) / 3600, 0.01)


# ── Main analysis function ─────────────────────────────────────────────────────

def analyze_narratives(
    posts: list[dict],
    trending_coins: list[dict],
    market_data: list[dict],
    categories: list[dict],
) -> list[dict]:
    """
    Analyse Reddit posts + CoinGecko data to produce scored narrative objects.
    """
    now_iso = datetime.now(timezone.utc).isoformat()

    # Build market lookup: symbol → market info
    market_lookup = {c["symbol"]: c for c in market_data}
    trending_symbols = {c["symbol"] for c in trending_coins}

    # Pre-compile patterns
    compiled = [
        {"meta": n, "pattern": _compile_patterns(n["keywords"])}
        for n in NARRATIVES
    ]

    # Per-narrative accumulators
    results = {}
    for n in NARRATIVES:
        results[n["id"]] = {
            "id": n["id"],
            "name": n["name"],
            "raw_mentions": 0,
            "weighted_mentions": 0.0,
            "recent_mentions": 0,    # < 6h
            "older_mentions": 0,     # 6-24h
            "sentiment_sum": 0.0,
            "sentiment_count": 0,
            "top_posts": [],
            "coins": n["coins"],
        }

    # Analyse each post
    for post in posts:
        text = _post_text(post)
        age = _age_hours(post)
        weight = _post_weight(post)
        sentiment = _sentiment_score(text)

        for item in compiled:
            nid = item["meta"]["id"]
            matches = _count_matches(text, item["pattern"])
            if matches == 0:
                continue

            r = results[nid]
            r["raw_mentions"] += matches
            r["weighted_mentions"] += matches * weight

            if age <= 6:
                r["recent_mentions"] += matches
            elif age <= 24:
                r["older_mentions"] += matches

            r["sentiment_sum"] += sentiment * weight
            r["sentiment_count"] += weight

            # Keep top 3 posts by engagement
            r["top_posts"].append({
                "title": post["title"][:120],
                "url": post["url"],
                "score": post["score"],
                "comments": post["num_comments"],
                "subreddit": post["subreddit"],
            })

    # ── Boost from CoinGecko category data ────────────────────────────────────
    category_boost = _build_category_boost(categories)

    # ── Score computation ──────────────────────────────────────────────────────
    scored = []
    for nid, r in results.items():
        mentions_24h = r["raw_mentions"]
        if mentions_24h == 0:
            # Still include with zero score for completeness
            pass

        # Velocity: ratio of recent (0-6h) vs older (6-24h) mentions
        recent = r["recent_mentions"]
        older = max(r["older_mentions"], 1)
        velocity = recent / older  # > 1 = accelerating

        # Sentiment: weighted average in [-1, 1]
        sentiment = (
            r["sentiment_sum"] / r["sentiment_count"]
            if r["sentiment_count"] > 0 else 0.0
        )

        # CoinGecko boost: trending + category performance
        cg_boost = 1.0
        for sym in r["coins"]:
            if sym in trending_symbols:
                cg_boost += 0.3
            if sym in market_lookup:
                chg = market_lookup[sym].get("price_change_24h_pct") or 0
                if chg > 10:
                    cg_boost += 0.2
                elif chg > 5:
                    cg_boost += 0.1
        # Category boost
        cg_boost += category_boost.get(nid, 0)

        # Final momentum score (0–100 range, log-normalised)
        raw_score = (
            math.log1p(r["weighted_mentions"]) *
            max(velocity, 0.1) *
            (1 + max(sentiment, 0)) *
            cg_boost
        )

        # Top posts: deduplicate by URL and take best 3
        seen_urls: set = set()
        top_posts = []
        for p in sorted(r["top_posts"], key=lambda x: x["score"], reverse=True):
            if p["url"] not in seen_urls:
                seen_urls.add(p["url"])
                top_posts.append(p)
            if len(top_posts) >= 3:
                break

        # Top coins enriched with market data — sorted by 7d performance
        top_coins = []
        for sym in r["coins"]:
            info = market_lookup.get(sym, {})
            top_coins.append({
                "symbol": sym,
                "name": info.get("name", sym),
                "price_change_24h": info.get("price_change_24h_pct"),
                "price_change_7d": info.get("price_change_7d_pct"),
                "current_price": info.get("current_price"),
                "market_cap_rank": info.get("market_cap_rank"),
                "is_trending": sym in trending_symbols,
            })
        # Sort by 7d perf desc, put trending first
        top_coins.sort(key=lambda x: (
            not x["is_trending"],
            -(x["price_change_7d"] or 0)
        ))

        scored.append({
            "id": nid,
            "name": r["name"],
            "score": round(raw_score, 2),
            "mentions_24h": mentions_24h,
            "velocity": round(velocity, 3),
            "sentiment": round(sentiment, 3),
            "top_coins": top_coins,
            "top_posts": top_posts,
        })

    # Normalise scores to 0–100
    max_score = max((s["score"] for s in scored), default=1) or 1
    for s in scored:
        s["score"] = round((s["score"] / max_score) * 100, 1)

    # Sort descending by score
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Add trend history (mock 7-day data for MVP — real version would persist daily runs)
    for s in scored:
        s["history_7d"] = _mock_history(s["score"])

    logger.info(
        "Top narratives: %s",
        ", ".join(f"{s['name']}({s['score']})" for s in scored[:5]),
    )

    return {
        "narratives": scored,
        "meta": {
            "generated_at": now_iso,
            "posts_analysed": len(posts),
            "trending_coins": len(trending_coins),
            "market_coins": len(market_data),
        },
    }


# ── Helpers ────────────────────────────────────────────────────────────────────

def _build_category_boost(categories: list[dict]) -> dict[str, float]:
    """Map narrative IDs to a small boost from CoinGecko category performance."""
    boosts: dict[str, float] = defaultdict(float)
    name_map = {
        "artificial-intelligence": "ai_tokens",
        "real-world-assets-rwa": "rwa",
        "meme-token": "memecoins",
        "layer-2": "l2",
        "decentralized-finance-defi": "defi",
        "gaming": "gamefi",
        "decentralized-physical-infrastructure-network-depin": "depin",
        "liquid-staking-tokens": "restaking",
        "solana-ecosystem": "solana_ecosystem",
    }
    for cat in categories:
        nid = name_map.get(cat.get("id", ""))
        if not nid:
            continue
        chg = cat.get("market_cap_change_24h") or 0
        if chg > 5:
            boosts[nid] += 0.5
        elif chg > 2:
            boosts[nid] += 0.2
        elif chg < -5:
            boosts[nid] -= 0.2
    return dict(boosts)


def _mock_history(current_score: float) -> list[dict]:
    """
    Generate plausible 7-day history ending at current_score.
    In production, this would read from persisted daily snapshots.
    """
    import random
    random.seed(int(current_score * 100))  # deterministic per score
    history = []
    score = max(current_score * random.uniform(0.3, 0.7), 1)
    dates = []
    from datetime import timedelta
    today = datetime.now(timezone.utc).date()
    for i in range(6, -1, -1):
        dates.append((today - timedelta(days=i)).isoformat())

    for i, d in enumerate(dates):
        if i < 6:
            delta = (current_score - score) / (6 - i + 1)
            score += delta * random.uniform(0.5, 1.5)
            score = max(score, 0)
        else:
            score = current_score
        history.append({"date": d, "score": round(score, 1)})
    return history
