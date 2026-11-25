import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — SVELA",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <SiteChrome mode="page" />
      <main className="checkout" id="top">
        <div className="checkout__inner">
          <Link href="/#buy" className="checkout__back" data-cursor="grow">
            <svg width="22" height="14" viewBox="0 0 34 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M34 10H2M11 1l-9 9 9 9" />
            </svg>
            THE LANTERN
          </Link>
          <h1 className="sv-display checkout__title">
            CHECKOUT <span className="sv-tail">almost aboard.</span>
          </h1>
          <CheckoutForm />
        </div>
      </main>
    </>
  );
}
