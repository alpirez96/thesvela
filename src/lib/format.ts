import type { CurrencyCode } from "./product";

const SYMBOL: Record<CurrencyCode, string> = {
  EUR: "€",
  TRY: "₺",
  USD: "$",
  GBP: "£",
};

/** Display price the SVELA way: "€ 1.480" (always set in mono). */
export function formatPrice(amount: number, currency: CurrencyCode): string {
  const n = amount.toLocaleString("de-DE", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${SYMBOL[currency] ?? currency} ${n}`;
}
