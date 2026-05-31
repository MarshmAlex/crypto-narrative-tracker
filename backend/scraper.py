"""
scraper.py — Reddit + CoinGecko data fetching
Fetches posts from crypto subreddits and trending/market data from CoinGecko.
No API keys required (public endpoints only).
"""

import time
import logging
import requests
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)

# ── Headers ──────────────────────────────────────────────────────────────────
# Browser-like UA to avoid Reddit bot detection.
REDDIT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "DNT": "1",
    "Connection": "keep-alive",
}

COINGECKO_BASE = "https://api.coingecko.com/api/v3"
REDDIT_BASES = ["https://old.reddit.com", "https://www.reddit.com"]

SUBREDDITS = ["cryptocurrency", "CryptoMarkets", "defi", "altcoin"]

# ── Reddit ────────────────────────────────────────────────────────────────────

def fetch_subreddit_posts(
    subreddit: str,
    limit: int = 50,
    sort: str = "hot",
) -> list[dict]:
    """
    Fetch posts from a subreddit.
    Tries old.reddit.com then www.reddit.com (JSON), then RSS fallback.
    """
    for base in REDDIT_BASES:
        url = f"{base}/r/{subreddit}/{sort}.json"
        params = {"limit": limit, "raw_json": 1}
        try:
            resp = requests.get(url, headers=REDDIT_HEADERS, params=params, timeout=15)
            if resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 60))
                logger.warning("Rate-limit r/%s — sleeping %ds", subreddit, wait)
                time.sleep(wait)
                continue
            if resp.status_code in (403, 401):
                logger.warning("HTTP %d for r/%s via %s", resp.status_code, subreddit, base)
                time.sleep(3)
                continue
            resp.raise_for_status()
            data = resp.json()
            posts = []
            for child in data.get("data", {}).get("children", []):
                p = child.get("data", {})
                posts.append({
                    "id": p.get("id"),
                    "title": p.get("title", ""),
                    "selftext": p.get("selftext", "")[:500],
                    "score": p.get("score", 0),
                    "num_comments": p.get("num_comments", 0),
                    "upvote_ratio": p.get("upvote_ratio", 0.5),
                    "created_utc": p.get("created_utc", 0),
                    "subreddit": subreddit,
                    "url": f"https://reddit.com{p.get('permalink', '')}",
                    "flair": p.get("link_flair_text", "") or "",
                })
            logger.info("Fetched %d posts from r/%s (JSON via %s)", len(posts), subreddit, base)
            return posts
        except requests.RequestException as e:
            logger.warning("JSON failed r/%s via %s: %s", subreddit, base, e)
            time.sleep(3)

    # RSS Atom fallback
    return _fetch_subreddit_rss(subreddit, limit)


def _fetch_subreddit_rss(subreddit: str, limit: int = 25) -> list[dict]:
    """RSS Atom fallback: titles only, no vote counts."""
    import xml.etree.ElementTree as ET
    url = f"https://www.reddit.com/r/{subreddit}/hot.rss?limit={limit}"
    headers = {**REDDIT_HEADERS, "Accept": "application/rss+xml, text/xml, */*"}
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code != 200:
            logger.error("RSS fallback HTTP %d for r/%s", resp.status_code, subreddit)
            return []
        root = ET.fromstring(resp.text)
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        posts = []
        now_ts = time.time()
        for entry in root.findall("atom:entry", ns)[:limit]:
            title_el = entry.find("atom:title", ns)
            link_el  = entry.find("atom:link", ns)
            content_el = entry.find("atom:content", ns)
            posts.append({
                "id": None,
                "title": title_el.text if title_el is not None else "",
                "selftext": (content_el.text or "")[:300] if content_el is not None else "",
                "score": 100,
                "num_comments": 10,
                "upvote_ratio": 0.7,
                "created_utc": now_ts - 3600,
                "subreddit": subreddit,
                "url": link_el.get("href", "") if link_el is not None else "",
                "flair": "",
            })
        logger.info("RSS fallback: %d posts from r/%s", len(posts), subreddit)
        return posts
    except Exception as e:
        logger.error("RSS fallback failed for r/%s: %s", subreddit, e)
        return []


def fetch_all_reddit_posts(sleep_between: float = 2.0) -> list[dict]:
    """Fetch posts from all configured subreddits."""
    all_posts = []
    for sub in SUBREDDITS:
        posts = fetch_subreddit_posts(sub)
        all_posts.extend(posts)
        if posts:
            time.sleep(sleep_between)
    logger.info("Total Reddit posts fetched: %d", len(all_posts))
    return all_posts


# ── CoinGecko ─────────────────────────────────────────────────────────────────

def _cg_get(path: str, params: Optional[dict] = None, retries: int = 3) -> Optional[dict]:
    """Helper: GET a CoinGecko endpoint with retry + back-off."""
    url = f"{COINGECKO_BASE}{path}"
    for attempt in range(retries):
        try:
            resp = requests.get(url, params=params, timeout=15)
            if resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 60))
                logger.warning("CoinGecko rate-limit — sleeping %ds", wait)
                time.sleep(wait)
                continue
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            logger.warning("CoinGecko attempt %d failed (%s): %s", attempt + 1, path, e)
            time.sleep(5 * (attempt + 1))
    return None


def fetch_trending_coins() -> list[dict]:
    """Return trending coins from CoinGecko /trending."""
    data = _cg_get("/search/trending")
    if not data:
        return []
    coins = []
    for item in data.get("coins", []):
        c = item.get("item", {})
        coins.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "symbol": c.get("symbol", "").upper(),
            "market_cap_rank": c.get("market_cap_rank"),
            "price_btc": c.get("price_btc", 0),
            "score": c.get("score", 0),  # CoinGecko trending score (lower = better rank)
        })
    logger.info("Fetched %d trending coins from CoinGecko", len(coins))
    return coins


def fetch_market_data(
    vs_currency: str = "usd",
    per_page: int = 100,
) -> list[dict]:
    """Fetch top coins market data for context (price changes, volume)."""
    time.sleep(1.5)  # be polite
    data = _cg_get(
        "/coins/markets",
        params={
            "vs_currency": vs_currency,
            "order": "market_cap_desc",
            "per_page": per_page,
            "page": 1,
            "sparkline": False,
            "price_change_percentage": "24h,7d",
        },
    )
    if not data:
        return []
    coins = []
    for c in data:
        coins.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "symbol": (c.get("symbol") or "").upper(),
            "current_price": c.get("current_price"),
            "market_cap": c.get("market_cap"),
            "market_cap_rank": c.get("market_cap_rank"),
            "total_volume": c.get("total_volume"),
            "price_change_24h_pct": c.get("price_change_percentage_24h"),
            "price_change_7d_pct": c.get("price_change_percentage_7d_in_currency"),
            "categories": [],  # filled in enrichment if needed
        })
    logger.info("Fetched market data for %d coins", len(coins))
    return coins


def fetch_coin_categories() -> list[dict]:
    """Fetch CoinGecko coin categories with market data."""
    time.sleep(1.5)
    data = _cg_get("/coins/categories", params={"order": "market_cap_change_24h_desc"})
    if not data:
        return []
    categories = []
    for cat in data[:30]:  # top 30 by 24h change
        categories.append({
            "id": cat.get("id"),
            "name": cat.get("name"),
            "market_cap": cat.get("market_cap"),
            "market_cap_change_24h": cat.get("market_cap_change_24h"),
            "volume_24h": cat.get("volume_24h"),
            "top_3_coins": cat.get("top_3_coins", []),
        })
    logger.info("Fetched %d coin categories", len(categories))
    return categories
