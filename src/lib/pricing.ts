import type { Product } from "./product";

/**
 * Currencies a buyer can choose. EUR is the base price (set in product.ts);
 * TRY is indexed to it at the day's EUR/TRY rate.
 */
export type SaleCurrency = "EUR" | "TRY";
export const SALE_CURRENCIES: readonly SaleCurrency[] = ["EUR", "TRY"];

export function isSaleCurrency(v: unknown): v is SaleCurrency {
  return v === "EUR" || v === "TRY";
}

export interface RateInfo {
  /** TRY per 1 EUR. */
  rate: number;
  /** Where the rate came from, e.g. "TCMB" (Central Bank of Türkiye, forex selling) or "ECB". */
  source: string;
  /** Rate date, YYYY-MM-DD. */
  date: string;
}

/**
 * Unit price of a product in the chosen currency.
 * TRY = EUR price × EUR/TRY rate, rounded up to the whole lira.
 * Returns null when TRY is asked for but no rate is available.
 */
export function unitPriceIn(product: Product, currency: SaleCurrency, eurTry: number | null | undefined): number | null {
  if (currency === "EUR") return product.unitPrice;
  if (!eurTry || !Number.isFinite(eurTry) || eurTry <= 0) return null;
  return Math.ceil(product.unitPrice * eurTry);
}
