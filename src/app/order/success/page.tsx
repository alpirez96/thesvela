import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import { ClearBag } from "@/components/commerce/ClearBag";
import { SectionLabel } from "@/components/commerce/Primitives";
import { isOrderId } from "@/lib/order";

export const metadata: Metadata = {
  title: "Order confirmed — SVELA",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function OrderSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.order) ? sp.order[0] : sp.order;
  const order = isOrderId(raw) ? raw : null;

  return (
    <>
      <SiteChrome mode="page" />
      {order && <ClearBag />}
      <main className="order order--success" id="top">
        <div className="order__inner">
          <SectionLabel num="(✓)">ORDER CONFIRMED</SectionLabel>
          <h1 className="sv-display order__title">
            THANK YOU <span className="sv-tail">see you at sea.</span>
          </h1>
          {order && (
            <p className="order__ref">
              <span className="order__ref-k">ORDER REF</span>
              <span className="order__ref-v">{order}</span>
            </p>
          )}
          <p className="order__text">
            A confirmation from iyzico is on its way to your inbox. We dispatch within 3 working days.
          </p>
          <div className="order__actions">
            <Link href="/" className="sv-btn sv-btn--outline" data-cursor="grow">
              BACK TO SVELA
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
