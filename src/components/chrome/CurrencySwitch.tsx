"use client";

import { useCart } from "@/lib/cart";
import { SALE_CURRENCIES } from "@/lib/pricing";

/**
 * EUR / TRY segmented switch. TRY is indexed to the EUR price at the day's
 * rate; with `showRate` a mono note shows the rate and its source.
 */
export function CurrencySwitch({ showRate = false, className = "" }: { showRate?: boolean; className?: string }) {
  const { currency, setCurrency, tryAvailable, rate } = useCart();

  return (
    <div className={`sv-cur ${className}`.trim()}>
      <div className="sv-cur__seg" role="group" aria-label="Currency">
        {SALE_CURRENCIES.map((c) => {
          const disabled = c === "TRY" && !tryAvailable;
          return (
            <button
              key={c}
              type="button"
              className="sv-cur__btn"
              data-cursor="grow"
              aria-pressed={currency === c}
              disabled={disabled}
              title={disabled ? "TRY pricing is unavailable right now" : undefined}
              onClick={() => setCurrency(c)}
            >
              {c}
            </button>
          );
        })}
      </div>
      {showRate && currency === "TRY" && rate && (
        <span className="sv-cur__rate">
          1 EUR = {rate.rate.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} TRY ·{" "}
          {rate.source === "TCMB" ? "TCMB" : rate.source === "ECB" ? "ECB" : "REF."}
        </span>
      )}
    </div>
  );
}
