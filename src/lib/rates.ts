/**
 * EUR/TRY exchange rate — server only (never import from client components).
 *
 * 1. TCMB (Central Bank of Türkiye) daily rates, EUR "ForexSelling" (döviz satış).
 * 2. Fallback: Frankfurter (ECB reference rate).
 * 3. Fallback: EUR_TRY_FALLBACK_RATE env var, if set.
 *
 * Responses are cached for an hour by Next's fetch cache, plus the last good
 * value is kept in memory for when both sources fail.
 */
import type { RateInfo } from "./pricing";

const TCMB_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";
const FRANKFURTER_URL = "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=TRY";
const REVALIDATE_SECONDS = 3600;

let lastGood: RateInfo | null = null;

function plausible(rate: number): boolean {
  return Number.isFinite(rate) && rate > 1 && rate < 10000;
}

function toIsoDate(tcmbDate: string | undefined): string {
  // TCMB uses Date="11/25/2026" (MM/DD/YYYY) on the root element.
  const m = tcmbDate?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[1]}-${m[2]}` : new Date().toISOString().slice(0, 10);
}

async function fromTcmb(): Promise<RateInfo | null> {
  const res = await fetch(TCMB_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) return null;
  const xml = await res.text();
  const block = xml.match(/<Currency[^>]*\bKod="EUR"[^>]*>([\s\S]*?)<\/Currency>/)?.[1];
  const selling = block?.match(/<ForexSelling>\s*([\d.]+)\s*<\/ForexSelling>/)?.[1];
  const rate = selling ? Number(selling) : NaN;
  if (!plausible(rate)) return null;
  const date = xml.match(/<Tarih_Date[^>]*\bDate="([^"]+)"/)?.[1];
  return { rate, source: "TCMB", date: toIsoDate(date) };
}

async function fromFrankfurter(): Promise<RateInfo | null> {
  const res = await fetch(FRANKFURTER_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { date?: string; rates?: { TRY?: number } };
  const rate = Number(data.rates?.TRY);
  if (!plausible(rate)) return null;
  return { rate, source: "ECB", date: data.date ?? new Date().toISOString().slice(0, 10) };
}

export async function getEurTryRate(): Promise<RateInfo | null> {
  for (const source of [fromTcmb, fromFrankfurter]) {
    try {
      const r = await source();
      if (r) {
        lastGood = r;
        return r;
      }
    } catch (err) {
      console.warn(`[rates] ${source.name} failed:`, err instanceof Error ? err.message : err);
    }
  }
  if (lastGood) return lastGood;
  const env = Number(process.env.EUR_TRY_FALLBACK_RATE);
  if (plausible(env)) return { rate: env, source: "fallback", date: new Date().toISOString().slice(0, 10) };
  return null;
}
