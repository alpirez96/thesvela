/**
 * Product catalog — the single source of truth for what can be bought and
 * at what price. The server recomputes every total from this file; prices
 * sent by the browser are never trusted.
 *
 * Prices are set in EUR (the base currency). Buyers can also pay in TRY:
 * the TRY price is indexed to the EUR price at the day's EUR/TRY rate
 * (see lib/pricing.ts and lib/rates.ts). EUR collection must be enabled on
 * the iyzico merchant account.
 */

export type CurrencyCode = "TRY" | "EUR" | "USD" | "GBP";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  /** Unit price in EUR, VAT included. */
  unitPrice: number;
  /** Base currency of unitPrice — always EUR (TRY is derived). */
  currency: CurrencyCode;
  image: string;
  /** iyzico basket category. */
  category: string;
  maxQty: number;
}

export const LANTERN: Product = {
  id: "svela-portable",
  name: "SVELA Portable",
  tagline: "Marine lantern, one finish.",
  unitPrice: 1480,
  currency: "EUR",
  image: "/svela/m/main.jpg",
  category: "Lighting",
  maxQty: 9,
};

export const CATALOG: Record<string, Product> = {
  [LANTERN.id]: LANTERN,
};

export function getProduct(id: string): Product | undefined {
  return Object.prototype.hasOwnProperty.call(CATALOG, id) ? CATALOG[id] : undefined;
}
