"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Case {
  cat: string;
  t: string;
  d: string;
  img: string;
  pos: string;
  color: string;
  alt: string;
}

const CASES: Case[] = [
  {
    cat: "WINCH",
    t: "ON THE\nWINCH",
    d: "Seated on the drum, out of the walkway.",
    img: "/svela/m/winch.jpg",
    pos: "50% 35%",
    color: "#4A3527",
    alt: "Lantern lit on a teak winch at sunset",
  },
  {
    cat: "TABLE",
    t: "COCKPIT\nTABLE",
    d: "Coffee after dark, three light levels.",
    img: "/svela/m/table-night.jpg",
    pos: "45% 50%",
    color: "#1E2A3A",
    alt: "Lantern on a varnished cockpit table at night",
  },
  {
    cat: "HANG",
    t: "UNDER THE\nBIMINI",
    d: "Hung by the leather strap above the deck.",
    img: "/svela/m/hang-boom.jpg",
    pos: "50% 42%",
    color: "#A07C4B",
    alt: "Lantern hanging from the boom by its leather strap at dusk",
  },
  {
    cat: "HELM",
    t: "AT THE\nHELM",
    d: "A pair either side of the wheel.",
    img: "/svela/m/helm.jpg",
    pos: "50% 50%",
    color: "#151E2B",
    alt: "Two lanterns lit beside the helm at night",
  },
  {
    cat: "DECK",
    t: "BLUE\nHOUR",
    d: "Threaded to the deck plate, still lit at midnight.",
    img: "/svela/m/deck.jpg",
    pos: "50% 70%",
    color: "#24313D",
    alt: "Lantern on deck at blue hour",
  },
];

const N = CASES.length;
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

/** "idle" = server render / no JS (cards visible); "armed" = waiting off-screen; "in" = entered. */
type Reveal = "idle" | "armed" | "in";

interface Drag {
  x: number;
  sl: number;
  moved: boolean;
  last: number;
  t: number;
  v: number;
}

/** (03) Five places aboard — drag / snap carousel with per-card parallax. */
export function Aboard() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const txtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideRaf = useRef(0);
  const fxRaf = useRef(0);
  const reduced = useRef(false);
  const progress = useRef({ idx: 1, p: 0 });

  const [caseIdx, setCaseIdx] = useState(1);
  const [trackP, setTrackP] = useState(0);
  const [reveal, setReveal] = useState<Reveal>("idle");

  /** Distance between two card starts (card width + gap). */
  const trackStep = useCallback(() => {
    const a = cardRefs.current;
    if (a[0] && a[1]) return a[1].offsetLeft - a[0].offsetLeft;
    return a[0] ? a[0].getBoundingClientRect().width : 0;
  }, []);

  /** Parallax: photo drifts and dims, text panel slides, relative to the card's distance from the snap line. */
  const cardFx = useCallback(() => {
    fxRaf.current = 0;
    const tr = trackRef.current;
    if (!tr || reduced.current) return;
    const w = trackStep();
    if (!w) return;
    const cards = cardRefs.current;
    const base = cards[0]?.offsetLeft ?? 0;
    cards.forEach((a, i) => {
      if (!a) return;
      const d = clamp((a.offsetLeft - base - tr.scrollLeft) / w, -1.5, 1.5);
      const img = imgRefs.current[i];
      const txt = txtRefs.current[i];
      if (img) {
        img.style.transform = `translate3d(${(-d * 7).toFixed(2)}%,0,0) scale(1.14)`;
        img.style.filter = `brightness(${(1 - Math.min(1, Math.abs(d)) * 0.35).toFixed(3)})`;
      }
      if (txt) txt.style.transform = `translate3d(${(d * 36).toFixed(1)}px,0,0)`;
    });
  }, [trackStep]);

  const scheduleFx = useCallback(() => {
    if (!fxRaf.current) fxRaf.current = requestAnimationFrame(cardFx);
  }, [cardFx]);

  /** Eased slide to card i (ease-out quart, 650–1100ms), snapping off while it runs. */
  const snapTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      const w = trackStep();
      if (!el || !w) return;
      const k = clamp(i, 0, N - 1);
      const from = el.scrollLeft;
      const to = Math.min(k * w, el.scrollWidth - el.clientWidth);
      const dist = to - from;
      cancelAnimationFrame(slideRaf.current);
      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";
      if (Math.abs(dist) < 1 || reduced.current) {
        el.scrollLeft = to;
        el.style.scrollSnapType = "";
        return;
      }
      const dur = Math.min(1100, 650 + Math.abs(dist) * 0.25);
      const t0 = performance.now();
      const step = (now: number) => {
        const x = Math.min(1, (now - t0) / dur);
        el.scrollLeft = from + dist * easeOutQuart(x);
        if (x < 1) slideRaf.current = requestAnimationFrame(step);
        else el.style.scrollSnapType = "";
      };
      slideRaf.current = requestAnimationFrame(step);
    },
    [trackStep],
  );

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    const w = trackStep();
    if (!el || !w) return;
    snapTo(Math.round(el.scrollLeft / w) + dir);
  };

  const onTrackScroll = () => {
    const el = trackRef.current;
    const w = trackStep();
    scheduleFx();
    if (!el || !w) return;
    const max = el.scrollWidth - el.clientWidth;
    const ci = Math.min(N, Math.round(el.scrollLeft / w) + 1);
    const tp = max > 0 ? clamp(el.scrollLeft / max, 0, 1) : 0;
    const cur = progress.current;
    if (ci !== cur.idx) {
      cur.idx = ci;
      setCaseIdx(ci);
    }
    if (Math.abs(tp - cur.p) > 0.02 || ((tp === 0 || tp === 1) && tp !== cur.p)) {
      cur.p = tp;
      setTrackP(tp);
    }
  };

  // Reduced motion, parallax on resize, entrance observer.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    cardFx();
    window.addEventListener("resize", scheduleFx);

    const tr = trackRef.current;
    let io: IntersectionObserver | undefined;
    if (!tr || reduced.current || !("IntersectionObserver" in window)) {
      setReveal("in");
    } else {
      setReveal("armed");
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setReveal("in");
            io?.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      io.observe(tr);
    }

    return () => {
      window.removeEventListener("resize", scheduleFx);
      io?.disconnect();
      cancelAnimationFrame(fxRaf.current);
      cancelAnimationFrame(slideRaf.current);
      fxRaf.current = 0;
    };
  }, [cardFx, scheduleFx]);

  // Mouse drag with fling, then an eased snap. Touch and trackpads use native scroll-snap.
  useEffect(() => {
    const tr = trackRef.current;
    if (!tr) return;
    let drag: Drag | null = null;
    let dragged = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.("button")) return;
      dragged = false;
      cancelAnimationFrame(slideRaf.current);
      drag = { x: e.clientX, sl: tr.scrollLeft, moved: false, last: e.clientX, t: performance.now(), v: 0 };
      tr.style.scrollSnapType = "none";
      tr.style.scrollBehavior = "auto";
      tr.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      const d = drag;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (Math.abs(dx) > 5) d.moved = true;
      const now = performance.now();
      d.v = (e.clientX - d.last) / Math.max(1, now - d.t);
      d.last = e.clientX;
      d.t = now;
      tr.scrollLeft = d.sl - dx;
      if (d.moved) e.preventDefault();
    };
    const up = () => {
      const d = drag;
      if (!d) return;
      drag = null;
      tr.style.cursor = "";
      dragged = d.moved;
      const w = trackStep();
      if (w) {
        const fling = clamp(-d.v * 1.2, -1, 1);
        const base = tr.scrollLeft / w;
        const i = Math.abs(fling) > 0.3 ? (fling > 0 ? Math.ceil(base) : Math.floor(base)) : Math.round(base);
        snapTo(i);
      } else {
        tr.style.scrollSnapType = "";
      }
    };
    const click = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    const dragStart = (e: DragEvent) => e.preventDefault();

    tr.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    tr.addEventListener("click", click, true);
    tr.addEventListener("dragstart", dragStart);
    return () => {
      tr.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      tr.removeEventListener("click", click, true);
      tr.removeEventListener("dragstart", dragStart);
    };
  }, [snapTo, trackStep]);

  return (
    <section id="aboard" className="aboard" data-idx="3" data-theme="linen" aria-labelledby="aboard-title">
      <div className="aboard__head">
        <div className="sv-label">
          <span className="sv-label__rule" aria-hidden="true" />
          <span className="sv-label__num">(03)</span>
          <span className="sv-label__text">WHERE IT BELONGS</span>
        </div>
        <div className="aboard__controls">
          <span className="aboard__count" aria-live="polite">
            <span className="sr-only">Place </span>
            {pad(caseIdx)} / {pad(N)}
          </span>
          <button
            type="button"
            className="aboard__nav"
            data-cursor="grow"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            aria-controls="aboard-track"
          >
            ‹
          </button>
          <button
            type="button"
            className="aboard__nav"
            data-cursor="grow"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            aria-controls="aboard-track"
          >
            ›
          </button>
        </div>
      </div>

      <h2 id="aboard-title" className="sv-display aboard__title">
        FIVE PLACES <span className="sv-tail">aboard</span>
      </h2>

      <div
        id="aboard-track"
        ref={trackRef}
        className="aboard__track"
        data-reveal={reveal}
        onScroll={onTrackScroll}
        role="region"
        aria-label="Five places aboard"
      >
        {CASES.map((c, k) => (
          <article
            key={c.cat}
            ref={(el) => {
              cardRefs.current[k] = el;
            }}
            className="aboard__card"
            data-cursor="view"
            style={{ background: c.color, "--d": `${k * 120}ms` } as React.CSSProperties}
            aria-label={`${pad(k + 1)} of ${pad(N)}: ${c.t.replace("\n", " ")}`}
          >
            <div
              ref={(el) => {
                txtRefs.current[k] = el;
              }}
              className="aboard__panel"
              style={{ background: c.color }}
            >
              <span className="aboard__rule" aria-hidden="true" />
              <span className="aboard__cat">
                {pad(k + 1)} · {c.cat}
              </span>
              <h3 className="aboard__name">{c.t}</h3>
              <p className="aboard__desc">{c.d}</p>
              <a href="#buy" className="sv-btn sv-btn--outline aboard__reserve" data-cursor="grow">
                RESERVE<span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="aboard__media">
              <Image
                ref={(el) => {
                  imgRefs.current[k] = el;
                }}
                src={c.img}
                alt={c.alt}
                fill
                sizes="(max-width: 640px) 90vw, 66vw"
                draggable={false}
                className="aboard__img"
                style={{ objectPosition: c.pos }}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="aboard__progress" aria-hidden="true">
        <div className="aboard__progress-fill" style={{ width: `${Math.round(20 + trackP * 80)}%` }} />
      </div>
    </section>
  );
}
