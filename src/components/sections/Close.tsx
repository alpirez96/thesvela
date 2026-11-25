"use client";

import { useRef, useState } from "react";
import { Arrow } from "./Arrow";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR = "Could not send right now — please reach us on Instagram @SVELA.";

type Field = "name" | "email";

/** (05) Close — sign-off, Instagram and the enquiry form. */
export function Close() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Field | null>(null);
  const [sending, setSending] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);

  const fail = (field: Field, message: string) => {
    setError(message);
    setInvalid(field);
    const el = formRef.current?.elements.namedItem(field);
    if (el instanceof HTMLElement) el.focus();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const payload = { name: get("name"), email: get("email"), phone: get("phone"), message: get("message") };

    if (!payload.name) return fail("name", "Please enter your full name.");
    if (!EMAIL_RE.test(payload.email)) return fail("email", "Please enter a valid email.");

    setInvalid(null);
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json().catch(() => null);
      const body = (data && typeof data === "object" ? data : {}) as { ok?: unknown; error?: unknown };
      if (res.ok && body.ok === true) {
        setSentName(payload.name.split(/\s+/)[0]);
        return;
      }
      setError(typeof body.error === "string" && body.error ? body.error : GENERIC_ERROR);
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="close" data-idx="5" data-theme="abyss" aria-labelledby="close-title">
      <div className="sv-label sv-label--center">
        <span className="sv-label__rule" aria-hidden="true" />
        <span className="sv-label__num">(05)</span>
        <span className="sv-label__text">ONE LANTERN, ONE FINISH</span>
        <span className="sv-label__rule" aria-hidden="true" />
      </div>

      <div className="close__head">
        <h2 id="close-title" className="sv-display close__title">
          SEE YOU <span className="sv-tail">at sea.</span>
        </h2>
        <a
          href="https://www.instagram.com/svela"
          target="_blank"
          rel="noopener"
          className="sv-btn sv-btn--outline close__insta"
          data-cursor="grow"
          aria-label="SVELA on Instagram"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
            <circle cx="12" cy="12" r="4.4" />
            <circle cx="17.6" cy="6.4" r="0.9" fill="currentColor" stroke="none" />
          </svg>
          @SVELA
        </a>
      </div>

      <div className="close__form-wrap">
        <div className="close__form-box">
          {sentName !== null ? (
            <div className="close__sent" role="status">
              <p className="sv-tail close__thanks">Thank you, {sentName}.</p>
              <p className="close__reply">The atelier will be in touch within two working days.</p>
            </div>
          ) : (
            <form ref={formRef} className="close__form" onSubmit={onSubmit} noValidate aria-label="Enquiry">
              <div className="close__fields">
                <label htmlFor="cf-name" className="sv-field">
                  <span>
                    FULL NAME<span className="sv-field__req"> *</span>
                  </span>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="sv-in"
                    required
                    maxLength={100}
                    aria-invalid={invalid === "name" || undefined}
                    aria-describedby={invalid === "name" ? "cf-error" : undefined}
                    onInput={() => invalid === "name" && setInvalid(null)}
                  />
                </label>
                <label htmlFor="cf-email" className="sv-field">
                  <span>
                    EMAIL<span className="sv-field__req"> *</span>
                  </span>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="sv-in"
                    required
                    maxLength={254}
                    aria-invalid={invalid === "email" || undefined}
                    aria-describedby={invalid === "email" ? "cf-error" : undefined}
                    onInput={() => invalid === "email" && setInvalid(null)}
                  />
                </label>
                <label htmlFor="cf-phone" className="sv-field close__full">
                  PHONE
                  <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className="sv-in" maxLength={30} />
                </label>
                <label htmlFor="cf-msg" className="sv-field close__full">
                  MESSAGE
                  <textarea id="cf-msg" name="message" rows={2} className="sv-in close__msg" maxLength={2000} />
                </label>
              </div>
              <div className="close__submit">
                <button
                  type="submit"
                  className="sv-btn sv-btn--primary close__send"
                  data-cursor="grow"
                  disabled={sending}
                  aria-busy={sending || undefined}
                >
                  SEND ENQUIRY
                  <Arrow width={22} height={14} />
                </button>
                <span id="cf-error" role="alert" className="close__error">
                  {error}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      <footer className="close__foot">
        <span>IP67 · CE · ROHS · MARINE INGRESS STANDARD</span>
        <span>© 2026 SVELA · THESVELA.COM</span>
      </footer>
    </section>
  );
}
