"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CurrencySwitch } from "@/components/chrome/CurrencySwitch";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Arrow, SectionLabel } from "./Primitives";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Bag drawer — right-side panel, mounted once in the root layout and opened
 * through `useCart().open()`. Modal: scrim, Escape and × close it, focus is
 * kept inside while open and returned to the opener on close.
 */
export function CartDrawer() {
  const { ready, items, subtotal, currency, setQty, remove, isOpen, close } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const open = ready && isOpen;

  // Any navigation closes the bag.
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    returnRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Scroll lock (with scrollbar compensation so the page doesn't jump).
    const html = document.documentElement;
    const body = document.body;
    const prev = { overflow: html.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const raf = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.getClientRects().length > 0);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      const back = returnRef.current;
      returnRef.current = null;
      if (back && back.isConnected) back.focus({ preventScroll: true });
    };
  }, [open, close]);

  if (!ready) return null;

  const handleRemove = (id: string) => {
    remove(id);
    // The focused REMOVE button is gone — keep focus inside the dialog.
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div className="bag" data-open={open ? "true" : "false"} inert={!open}>
      <div className="bag__scrim" onClick={close} aria-hidden="true" />

      <div ref={panelRef} className="bag__panel" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <div className="bag__head">
          <SectionLabel as="h2" num="(BAG)" id="bag-title" className="bag__title">
            YOUR BAG
          </SectionLabel>
          <button ref={closeRef} type="button" className="bag__close" onClick={close} aria-label="Close bag" data-cursor="grow">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bag__empty">
            <p className="bag__empty-text">Your bag is empty.</p>
            <Link href="/#buy" className="sv-btn sv-btn--outline" onClick={close} data-cursor="grow">
              SEE THE LANTERN
            </Link>
          </div>
        ) : (
          <>
            <ul className="bag__items" aria-label="Items in your bag">
              {items.map((item) => {
                const { product, qty } = item;
                const atMin = qty <= 1;
                const atMax = qty >= product.maxQty;
                return (
                  <li key={item.id} className="bag__item">
                    <div className="bag__thumb">
                      <Image src={product.image} alt="" width={176} height={220} sizes="88px" />
                    </div>
                    <div className="bag__info">
                      <p className="bag__name">{product.name}</p>
                      <p className="bag__tagline">{product.tagline}</p>
                      <div className="bag__row">
                        <div className="bag__stepper" role="group" aria-label={`Quantity, ${product.name}`}>
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            aria-disabled={atMin}
                            onClick={() => !atMin && setQty(item.id, qty - 1)}
                            data-cursor="grow"
                          >
                            –
                          </button>
                          <span className="bag__qty" aria-live="polite" aria-atomic="true">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            aria-disabled={atMax}
                            onClick={() => !atMax && setQty(item.id, qty + 1)}
                            data-cursor="grow"
                          >
                            +
                          </button>
                        </div>
                        <span className="bag__line">{formatPrice(item.lineTotal, currency)}</span>
                      </div>
                      {qty > 1 && (
                        <p className="bag__each">
                          <span className="mono">{formatPrice(item.unitPrice, currency)}</span> EACH
                        </p>
                      )}
                      <button
                        type="button"
                        className="bag__remove"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${product.name}`}
                        data-cursor="grow"
                      >
                        REMOVE
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="bag__foot">
              <CurrencySwitch showRate className="bag__cur" />
              <div className="bag__total">
                <span className="bag__total-label">TOTAL</span>
                <span className="bag__total-value">{formatPrice(subtotal, currency)}</span>
              </div>
              <p className="bag__vat">INCL. VAT</p>
              <Link href="/checkout" className="sv-btn sv-btn--primary bag__buy" onClick={close} data-cursor="grow">
                BUY NOW
                <Arrow />
              </Link>
              <p className="bag__secure">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                  <rect x="0.5" y="5.5" width="9" height="6" rx="1" />
                  <path d="M2.5 5.5V3.5a2.5 2.5 0 0 1 5 0v2" />
                </svg>
                SECURE PAYMENT · IYZICO
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
