import { Router } from "express";

const router = Router();

interface PriceTick {
  pair: string;
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  up: boolean;
}

interface CachedData {
  ticks: PriceTick[];
  fetchedAt: number;
}

const ASSETS = [
  { pair: "BTC/USDT", symbol: "BTC-USD" },
  { pair: "XAU/USD", symbol: "GC=F" },
  { pair: "XAG/USD", symbol: "SI=F" },
  { pair: "WTI/USD", symbol: "CL=F", fallback: "BZ=F" },
];

const CACHE_TTL_MS = 15_000;
let cache: CachedData | null = null;

async function fetchYahooPrice(symbol: string): Promise<{ price: number; change: number; changePct: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as {
      chart?: {
        result?: Array<{
          meta?: {
            regularMarketPrice?: number;
            previousClose?: number;
            chartPreviousClose?: number;
          };
        }>;
      };
    };

    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta || meta.regularMarketPrice == null) return null;

    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return { price, change, changePct };
  } catch {
    return null;
  }
}

async function fetchAllPrices(): Promise<PriceTick[]> {
  const results = await Promise.all(
    ASSETS.map(async ({ pair, symbol, ...rest }) => {
      const fallback = (rest as { fallback?: string }).fallback;
      let data = await fetchYahooPrice(symbol);
      if (!data && fallback) {
        data = await fetchYahooPrice(fallback);
      }
      if (!data) return null;
      return {
        pair,
        symbol,
        price: data.price,
        change: data.change,
        changePct: data.changePct,
        up: data.change >= 0,
      } satisfies PriceTick;
    })
  );

  return results.filter((r): r is PriceTick => r !== null);
}

router.get("/prices", async (_req, res) => {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    res.json({ ticks: cache.ticks, cachedAt: cache.fetchedAt });
    return;
  }

  const ticks = await fetchAllPrices();

  if (ticks.length > 0) {
    cache = { ticks, fetchedAt: now };
  }

  res.json({ ticks: cache?.ticks ?? [], cachedAt: cache?.fetchedAt ?? now });
});

export default router;
