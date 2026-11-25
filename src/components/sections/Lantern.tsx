"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CurrencySwitch } from "@/components/chrome/CurrencySwitch";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { LANTERN } from "@/lib/product";
import { Arrow } from "./Arrow";

const SHOTS = ["/svela/m/main.jpg", "/svela/m/boxes.jpg", "/svela/m/hang-quad.jpg", "/svela/m/table-coffee.jpg"];

const SPECS = [
  { k: "FINISH", v: "Brushed marine steel" },
  { k: "MATERIALS", v: "316 stainless · fluted glass · leather" },
  { k: "LIGHT", v: "2700 K · CRI > 95 · 20–260 lm" },
  { k: "BATTERY", v: "2 × 2000 mAh · up to 40 h" },
  { k: "DISPATCH", v: "Within 3 working days" },
];

/** How long the button reads "ADDED TO BAG", and when the bag drawer slides in. */
const ADDED_MS = 1600;
const OPEN_BAG_MS = 500;

/** (04) The lantern — gallery, price, specs, quantity and ADD TO BAG. */
export function Lantern() {
  const { add, open, currency, priceOf } = useCart();
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);
  const addedT = useRef<number | undefined>(undefined);
  const openT = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(addedT.current);
      window.clearTimeout(openT.current);
    },
    [],
  );

  const onAdd = () => {
    add(LANTERN.id, qty);
    setAdded(true);
    window.clearTimeout(addedT.current);
    addedT.current = window.setTimeout(() => setAdded(false), ADDED_MS);
    window.clearTimeout(openT.current);
    openT.current = window.setTimeout(open, OPEN_BAG_MS);
  };

  const [line1, ...rest] = LANTERN.name.toUpperCase().split(" ");

  return (
    <section id="buy" className="lantern" data-idx="4" data-theme="abyss" aria-labelledby="lantern-title">
      <div className="sv-label">
        <span className="sv-label__rule" aria-hidden="true" />
        <span className="sv-label__num">(04)</span>
        <span className="sv-label__text">THE LANTERN · NO. 01</span>
      </div>

      <div className="lantern__layout">
        <div className="lantern__gallery">
          <div className="lantern__stage">
            <div className="lantern__blur" aria-hidden="true">
              <Image src={SHOTS[shot]} alt="" fill sizes="240px" className="lantern__blur-img" />
            </div>
            <Image
              src={SHOTS[shot]}
              alt="SVELA lantern"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              className="lantern__shot"
            />
          </div>
          <div className="lantern__thumbs">
            {SHOTS.map((src, k) => (
              <button
                key={src}
                type="button"
                className="lantern__thumb"
                data-cursor="grow"
                onClick={() => setShot(k)}
                aria-label={`Show image ${k + 1} of ${SHOTS.length}`}
                aria-pressed={k === shot}
              >
                <Image src={src} alt="" fill sizes="(max-width: 860px) 25vw, 12vw" />
              </button>
            ))}
          </div>
        </div>

        <div className="lantern__info">
          <h2 id="lantern-title" className="sv-display lantern__title">
            {line1}
            {rest.length > 0 && (
              <>
                <br />
                {rest.join(" ")}
              </>
            )}
          </h2>
          <p className="sv-tail lantern__tail">{LANTERN.tagline}</p>

          <div className="lantern__price">
            <span className="lantern__amount">{formatPrice(priceOf(LANTERN) * qty, currency)}</span>
            <span className="lantern__vat">INCL. VAT</span>
          </div>
          <CurrencySwitch showRate className="lantern__cur" />

          <dl className="lantern__specs">
            {SPECS.map((s) => (
              <div key={s.k} className="lantern__spec">
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="lantern__actions">
            <div className="lantern__qty" role="group" aria-label="Quantity">
              <button
                type="button"
                className="lantern__step"
                data-cursor="grow"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                –
              </button>
              <span className="lantern__qty-value" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="lantern__step"
                data-cursor="grow"
                onClick={() => setQty((q) => Math.min(LANTERN.maxQty, q + 1))}
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className={`sv-btn sv-btn--primary lantern__add${added ? " is-added" : ""}`}
              data-cursor="grow"
              onClick={onAdd}
            >
              {added ? "ADDED TO BAG" : "ADD TO BAG"}
              <Arrow />
            </button>
            <a href="#contact" className="sv-btn sv-btn--outline" data-cursor="grow">
              ENQUIRE
            </a>
          </div>
          <span className="sr-only" role="status">
            {added ? `${qty} × ${LANTERN.name} added to bag` : ""}
          </span>

          <p className="lantern__batch">
            <span className="lantern__batch-dot" aria-hidden="true" />
            LIMITED BATCH — HAND-ASSEMBLED IN BODRUM
          </p>
        </div>
      </div>
    </section>
  );
}
