/**
 * Product catalog — the single source of truth for what can be bought and
 * at what price. The server recomputes every total from this file; prices
 * sent by the browser are never trusted.
 *
 * To change the price or currency, edit it here. iyzico accepts TRY by
 * default; EUR/USD/GBP must be enabled on the merchant account.
 */

export type CurrencyCode = "TRY" | "EUR" | "USD" | "GBP";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  /** Unit price, VAT included. */
  unitPrice: number;
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
