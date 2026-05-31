# 📡 CryptoNarrativeTracker

> Detect emerging crypto narratives before the crowd.

A full-stack MVP that aggregates Reddit posts and CoinGecko data every 2 hours, scores
crypto narratives by momentum, and displays a ranked dashboard.

---

## Architecture

```
backend/         Python data pipeline (scrape → analyze → JSON)
frontend/        Next.js 14 dashboard (static JSON served from /public/data/)
```

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# → writes backend/data/narratives.json
# → copies to frontend/public/data/narratives.json
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Cron (every 2h)

```cron
0 */2 * * * cd /path/to/backend && python main.py >> /var/log/cnt.log 2>&1
```

---

## Narratives Tracked

| ID | Name |
|----|------|
| ai_tokens | AI Tokens |
| rwa | Real World Assets (RWA) |
| memecoins | Memecoins |
| l2 | Layer 2 / Scaling |
| depin | DePIN |
| defi | DeFi |
| btc_ecosystem | Bitcoin Ecosystem |
| gamefi | GameFi / NFT Gaming |
| restaking | Restaking / LRT |
| solana_ecosystem | Solana Ecosystem |

## Scoring Formula

```
momentum_score =
  log(1 + weighted_mentions)   # engagement-weighted occurrence count
  × velocity                    # recent / older mentions ratio (>1 = accelerating)
  × (1 + max(sentiment, 0))    # bullish sentiment amplifier
  × cg_boost                   # CoinGecko trending + category performance
```

Scores are normalised to 0–100 per run.

## Output Schema

```json
{
  "meta": {
    "generated_at": "2024-01-01T12:00:00+00:00",
    "posts_analysed": 200,
    "trending_coins": 15,
    "market_coins": 100
  },
  "narratives": [
    {
      "id": "ai_tokens",
      "name": "AI Tokens",
      "score": 92.5,
      "mentions_24h": 847,
      "velocity": 2.3,
      "sentiment": 0.42,
      "top_coins": [{ "symbol": "TAO", "name": "Bittensor", "price_change_24h": 8.4, "is_trending": true }],
      "top_posts": [{ "title": "...", "url": "...", "score": 4200, "comments": 312, "subreddit": "cryptocurrency" }],
      "history_7d": [{ "date": "2024-01-01", "score": 45.2 }]
    }
  ]
}
```

## Deployment (Vercel)

```bash
cd frontend
npx vercel --prod
```

Set up a cron job (GitHub Actions, cron-job.org, Render) to run `python main.py` every 2h and commit/push `frontend/public/data/narratives.json`.

## Roadmap

- [ ] PostgreSQL persistence for real 7-day history
- [ ] Twitter/X sentiment layer
- [ ] Stripe payment for Pro tier
- [ ] Telegram alert bot
- [ ] REST API with API key auth
- [ ] Discord community integration
