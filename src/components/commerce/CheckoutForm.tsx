"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { CurrencySwitch } from "@/components/chrome/CurrencySwitch";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { BUYER_FIELDS, BUYER_MAX, validateBuyer, type BuyerField, type BuyerInput } from "@/lib/checkout";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/countries";
import { Arrow, SectionLabel } from "./Primitives";

const DRAFT_KEY = "svela.checkout.v1";

const EMPTY: BuyerInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
  country: DEFAULT_COUNTRY,
  identityNumber: "",
};

interface FieldDef {
  name: BuyerField;
  label: string;
  required: boolean;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  full?: boolean;
  hint?: string;
}

const CONTACT: FieldDef[] = [
  { name: "firstName", label: "FIRST NAME", required: true, autoComplete: "given-name" },
  { name: "lastName", label: "LAST NAME", required: true, autoComplete: "family-name" },
  { name: "email", label: "EMAIL", required: true, type: "email", autoComplete: "email", inputMode: "email" },
  { name: "phone", label: "PHONE", required: true, type: "tel", autoComplete: "tel", inputMode: "tel" },
];

const DELIVERY_BEFORE_COUNTRY: FieldDef[] = [
  { name: "address", label: "ADDRESS", required: true, autoComplete: "street-address", full: true },
  { name: "city", label: "CITY", required: true, autoComplete: "address-level2" },
  { name: "zipCode", label: "POSTAL CODE", required: false, autoComplete: "postal-code" },
];

const ID_FIELD: FieldDef = {
  name: "identityNumber",
  label: "ID NUMBER",
  required: false,
  autoComplete: "off",
  hint: "TC Kimlik No for Turkish buyers",
};

/** Checkout: buyer + delivery details → /api/checkout → iyzico hosted page. */
export function CheckoutForm() {
  const { ready, items, lines, subtotal, currency, rate, open } = useCart();
  const [values, setValues] = useState<BuyerInput>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<BuyerField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  /** A server total the buyer has been shown after a rate change. */
  const [quoted, setQuoted] = useState<number | null>(null);
  const dirty = useRef(false);

  // Restore a draft from this tab (e.g. after "TRY AGAIN"); the ID number is never stored.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<Record<BuyerField, unknown>>;
        setValues((v) => {
          const next = { ...v };
          for (const f of BUYER_FIELDS) {
            if (f !== "identityNumber" && typeof draft[f] === "string") next[f] = (draft[f] as string).slice(0, BUYER_MAX[f]);
          }
          if (!COUNTRIES.some((c) => c.name === next.country)) next.country = DEFAULT_COUNTRY;
          return next;
        });
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Save the draft after the visitor edits it.
  useEffect(() => {
    if (!dirty.current) return;
    try {
      const { identityNumber: _omit, ...draft } = values;
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [values]);

  // Coming back from iyzico with the browser's back button restores this page
  // from the bfcache with the button still busy — release it.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // A new bag or currency invalidates a quoted total.
  useEffect(() => setQuoted(null), [subtotal, currency]);

  const check = useMemo(() => validateBuyer(values), [values]);
  const errorFor = (f: BuyerField) => (submitted || touched[f] ? check.errors[f] : undefined);

  const set = (f: BuyerField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.value;
    dirty.current = true;
    setValues((cur) => ({ ...cur, [f]: v }));
    if (formError) setFormError("");
  };
  const blur = (f: BuyerField) => () => {
    if (values[f].trim() || submitted) setTouched((t) => (t[f] ? t : { ...t, [f]: true }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitted(true);
    const first = BUYER_FIELDS.find((f) => check.errors[f]);
    if (first) {
      setFormError("Please check the highlighted fields.");
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    if (lines.length === 0) return;

    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ lines, currency, buyer: check.values }),
      });
      const data = (await res.json().catch(() => null)) as {
        paymentPageUrl?: unknown;
        amount?: unknown;
        currency?: unknown;
        error?: unknown;
      } | null;
      const url = typeof data?.paymentPageUrl === "string" ? data.paymentPageUrl : "";
      if (res.ok && /^https?:\/\//i.test(url)) {
        // The server prices the order itself. If that differs from what is on
        // screen (e.g. the day's TRY rate changed), show it before charging.
        const amount = typeof data?.amount === "number" ? data.amount : null;
        const shown = quoted ?? subtotal;
        if (amount !== null && data?.currency === currency && Math.abs(amount - shown) >= 0.01) {
          setQuoted(amount);
          setFormError(
            `The exchange rate has just been updated — your total is now ${formatPrice(amount, currency)}. Press PROCEED TO PAYMENT again to continue.`,
          );
          setSubmitting(false);
          return;
        }
        window.location.assign(url);
        return; // stay busy while the browser leaves
      }
      setFormError(typeof data?.error === "string" && data.error ? data.error : "Something went wrong. Please try again.");
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    }
    setSubmitting(false);
  };

  if (!ready) return <div className="checkout__loading" aria-hidden="true" />;

  if (items.length === 0) {
    return (
      <div className="checkout__empty">
        <p className="checkout__empty-text">Your bag is empty.</p>
        <p className="checkout__empty-sub">Add the lantern to your bag, then come back to check out.</p>
        <Link href="/#buy" className="sv-btn sv-btn--outline" data-cursor="grow">
          SEE THE LANTERN
        </Link>
      </div>
    );
  }

  const rateSource = rate?.source === "TCMB" ? "TCMB" : rate?.source === "ECB" ? "ECB reference" : "reference";
  const isTurkey = values.country === "Turkey";

  const renderField = (d: FieldDef) => {
    const id = `co-${d.name}`;
    const err = errorFor(d.name);
    const describedBy = [d.hint ? `${id}-hint` : "", err ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
    const inputMode = d.name === "identityNumber" && isTurkey ? "numeric" : d.inputMode;
    return (
      <div key={d.name} className={d.full ? "checkout__field checkout__full" : "checkout__field"}>
        <label className="sv-field" htmlFor={id}>
          <span>
            {d.label}
            {d.required ? (
              <span className="sv-field__req" aria-hidden="true">
                {" "}
                *
              </span>
            ) : (
              <span className="checkout__opt"> · OPTIONAL</span>
            )}
          </span>
        </label>
        <input
          id={id}
          name={d.name}
          type={d.type ?? "text"}
          className="sv-in"
          value={values[d.name]}
          onChange={set(d.name)}
          onBlur={blur(d.name)}
          autoComplete={d.autoComplete}
          inputMode={inputMode}
          maxLength={BUYER_MAX[d.name]}
          required={d.required}
          aria-required={d.required || undefined}
          aria-invalid={err ? true : undefined}
          aria-describedby={describedBy}
          spellCheck={false}
          disabled={submitting}
        />
        {d.hint && (
          <p id={`${id}-hint`} className="checkout__hint">
            {d.hint}
          </p>
        )}
        {err && (
          <p id={`${id}-err`} className="checkout__err">
            {err}
          </p>
        )}
      </div>
    );
  };

  const countryErr = errorFor("country");

  return (
    <form className="checkout__grid" onSubmit={onSubmit} noValidate aria-busy={submitting || undefined}>
      <div className="checkout__form">
        <div className="checkout__group" role="group" aria-labelledby="co-contact">
          <SectionLabel as="h2" num="(01)" id="co-contact">
            CONTACT
          </SectionLabel>
          <div className="checkout__fields">{CONTACT.map(renderField)}</div>
        </div>

        <div className="checkout__group" role="group" aria-labelledby="co-delivery">
          <SectionLabel as="h2" num="(02)" id="co-delivery">
            DELIVERY
          </SectionLabel>
          <div className="checkout__fields">
            {DELIVERY_BEFORE_COUNTRY.map(renderField)}
            <div className="checkout__field">
              <label className="sv-field" htmlFor="co-country">
                <span>
                  COUNTRY
                  <span className="sv-field__req" aria-hidden="true">
                    {" "}
                    *
                  </span>
                </span>
              </label>
              <select
                id="co-country"
                name="country"
                className="sv-in"
                value={values.country}
                onChange={set("country")}
                onBlur={blur("country")}
                autoComplete="country-name"
                required
                aria-required
                aria-invalid={countryErr ? true : undefined}
                aria-describedby={countryErr ? "co-country-err" : undefined}
                disabled={submitting}
              >
                {COUNTRIES.map((c, i) => (
                  <Fragment key={c.name}>
                    <option value={c.name}>{c.name}</option>
                    {i === 0 && (
                      <option value="" disabled>
                        ──────────
                      </option>
                    )}
                  </Fragment>
                ))}
              </select>
              {countryErr && (
                <p id="co-country-err" className="checkout__err">
                  {countryErr}
                </p>
              )}
            </div>
            {renderField(ID_FIELD)}
          </div>
        </div>
      </div>

      <aside className="checkout__summary" aria-labelledby="co-summary">
        <SectionLabel as="h2" num="(03)" id="co-summary">
          YOUR ORDER
        </SectionLabel>

        <ul className="checkout__items">
          {items.map((item) => (
            <li key={item.id} className="checkout__item">
              <div className="checkout__thumb">
                <Image src={item.product.image} alt="" width={128} height={160} sizes="64px" />
              </div>
              <div className="checkout__item-info">
                <p className="checkout__item-name">{item.product.name}</p>
                <p className="checkout__item-tagline">{item.product.tagline}</p>
                <p className="checkout__item-meta">
                  QTY <span className="mono">{item.qty}</span>
                  {item.qty > 1 && (
                    <>
                      {" "}
                      × <span className="mono">{formatPrice(item.unitPrice, currency)}</span>
                    </>
                  )}
                </p>
              </div>
              <span className="checkout__item-total">{formatPrice(item.lineTotal, currency)}</span>
            </li>
          ))}
        </ul>

        <button type="button" className="checkout__edit" onClick={open} disabled={submitting} data-cursor="grow">
          EDIT BAG
        </button>

        <CurrencySwitch showRate className="checkout__cur" />

        <div className="checkout__total">
          <span className="checkout__total-label">TOTAL</span>
          <span className="checkout__total-value">{formatPrice(quoted ?? subtotal, currency)}</span>
        </div>
        <p className="checkout__vat">INCL. VAT</p>
        {currency === "TRY" && (
          <p className="checkout__fx">TRY price indexed to EUR at today&rsquo;s {rateSource} rate.</p>
        )}

        <button type="submit" className="sv-btn sv-btn--primary checkout__pay" disabled={submitting} data-cursor="grow">
          {submitting ? "REDIRECTING…" : "PROCEED TO PAYMENT"}
          <Arrow />
        </button>
        <p className="checkout__alert" role="alert">
          {formError}
        </p>
        <p className="checkout__note">You will be redirected to iyzico&rsquo;s secure payment page.</p>
      </aside>
    </form>
  );
}
