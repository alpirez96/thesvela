"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";

type Theme = "abyss" | "linen";

const THEMES: Record<Theme, { fg: string; accent: string; rail: string }> = {
  abyss: { fg: "#F9F7F2", accent: "#C9992F", rail: "rgba(249,247,242,0.16)" },
  linen: { fg: "#0E141B", accent: "#A97B2E", rail: "rgba(14,20,27,0.14)" },
};

const NAV = [
  { t: "USE", href: "#use", idx: 2 },
  { t: "ABOARD", href: "#aboard", idx: 3 },
  { t: "LANTERN", href: "#buy", idx: 4 },
  { t: "CONTACT", href: "#contact", idx: 5 },
];

const SECTION_COUNT = 5;

/**
 * Fixed chrome: header (logo · nav · bag pill), progress rail and section
 * counter. On the home page it re-themes to the section under the header
 * (`section[data-idx][data-theme]`). On other pages (`mode="page"`) it stays
 * abyss and only shows the logo and the bag pill.
 */
export function SiteChrome({ mode = "home" }: { mode?: "home" | "page" }) {
  const { count, ready, open } = useCart();
  const [theme, setTheme] = useState<Theme>("abyss");
  const [idx, setIdx] = useState(1);
  const railRef = useRef<HTMLDivElement>(null);
  const home = mode === "home";

  useEffect(() => {
    if (!home) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const secs = document.querySelectorAll<HTMLElement>("section[data-idx]");
      let cur: HTMLElement | undefined = secs[0];
      secs.forEach((s) => {
        if (s.getBoundingClientRect().top <= 60) cur = s;
      });
      if (cur) {
        setTheme((cur.dataset.theme as Theme) || "abyss");
        setIdx(Number(cur.dataset.idx) || 1);
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (railRef.current) railRef.current.style.height = `${10 + p * 90}%`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [home]);

  const th = THEMES[theme];
  const vars = {
    "--chrome-fg": th.fg,
    "--chrome-accent": th.accent,
    "--chrome-rail": th.rail,
  } as React.CSSProperties;

  const hasBag = ready && count > 0;
  const buyHref = home ? "#buy" : "/#buy";

  return (
    <div style={vars} data-chrome-theme={theme}>
      <header className="sv-header">
        <Link href={home ? "#top" : "/"} className="sv-header__logo" data-cursor="grow" aria-label="SVELA — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/svela/logo-wordmark.png" alt="SVELA" width={701} height={110} />
        </Link>

        {home && (
          <nav className="sv-nav" aria-label="Sections">
            {NAV.map((n) => (
              <a key={n.t} href={n.href} data-cursor="grow" aria-current={idx === n.idx ? "true" : undefined}>
                {n.t}
              </a>
            ))}
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, pointerEvents: "auto" }}>
          {hasBag ? (
            <button
              type="button"
              className="sv-pill"
              data-cursor="grow"
              onClick={open}
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <span style={{ marginRight: "-0.14em" }}>RESERVE</span>
              <span className="sv-pill__count">({count})</span>
            </button>
          ) : (
            <a href={buyHref} className="sv-pill" data-cursor="grow">
              <span style={{ marginRight: "-0.14em" }}>RESERVE</span>
            </a>
          )}
        </div>
      </header>

      {home && (
        <>
          <div className="sv-rail" aria-hidden="true">
            <div ref={railRef} className="sv-rail__fill" />
          </div>
          <div className="sv-counter" aria-hidden="true">
            0{idx} / 0{SECTION_COUNT}
          </div>
        </>
      )}
    </div>
  );
}
