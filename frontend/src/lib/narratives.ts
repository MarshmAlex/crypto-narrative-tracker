import fs from "fs";
import path from "path";

export interface CoinData {
  symbol: string;
  name: string;
  price_change_24h: number | null;
  price_change_7d: number | null;
  current_price: number | null;
  market_cap_rank: number | null;
  is_trending: boolean;
}

export interface Narrative {
  id: string;
  name: string;
  score: number;
  mentions_24h: number;
  velocity: number;
  sentiment: number;
  top_coins: CoinData[];
}

export interface NarrativesData {
  meta: {
    generated_at: string;
    posts_analysed: number;
    trending_coins: number;
    market_coins: number;
  };
  narratives: Narrative[];
}

export function loadNarratives(): NarrativesData {
  const filePath = path.join(process.cwd(), "public", "data", "narratives.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as NarrativesData;
}
