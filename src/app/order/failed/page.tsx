import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import { Arrow, SectionLabel } from "@/components/commerce/Primitives";
import { isOrderId } from "@/lib/order";

export const metadata: Metadata = {
  title: "Payment not completed — SVELA",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Short codes set by /api/iyzico/callback. */
const REASONS: Record<string, string> = {
  missing_token: "The payment page did not return a result.",
  invalid_order: "The order reference was not recognised.",
  order_mismatch: "The payment could not be matched to your order.",
  not_configured: "Payments are not configured yet.",
  retrieve_failed: "We could not confirm the payment with iyzico.",
  error: "We could not confirm the payment with iyzico.",
  payment_failure: "The payment was declined.",
};

const GENERIC = "The payment was cancelled or declined.";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Map a reason code to copy, or pass through a short, cleaned provider message. */
function describe(raw: string | undefined): string {
  if (!raw) return GENERIC;
  const code = raw.trim().toLowerCase();
  if (Object.prototype.hasOwnProperty.call(REASONS, code)) return REASONS[code];
  if (/^payment_[a-z_]+$/.test(code)) return "The payment was not completed.";
  const text = raw
    .replace(/[^\p{L}\p{N}\s.,:;'’()!?/-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
  return text.length >= 3 ? text : GENERIC;
}

export default async function OrderFailedPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const rawOrder = first(sp.order);
  const order = isOrderId(rawOrder) ? rawOrder : null;
  const reason = describe(first(sp.reason));

  return (
    <>
      <SiteChrome mode="page" />
      <main className="order order--failed" id="top">
        <div className="order__inner">
          <SectionLabel num="(×)">CHECKOUT</SectionLabel>
          <h1 className="sv-display order__title">
            PAYMENT <span className="sv-tail">not completed.</span>
          </h1>
          <p className="order__reason">{reason}</p>
          {order && (
            <p className="order__ref">
              <span className="order__ref-k">ORDER REF</span>
              <span className="order__ref-v">{order}</span>
            </p>
          )}
          <p className="order__text">
            Your bag is still here, so you can try again. If you think the payment went through, contact us
            {order ? " with your order reference" : ""} before trying again.
          </p>
          <div className="order__actions">
            <Link href="/checkout" className="sv-btn sv-btn--primary" data-cursor="grow">
              TRY AGAIN
              <Arrow />
            </Link>
            <Link href="/#contact" className="sv-btn sv-btn--outline" data-cursor="grow">
              CONTACT US
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
