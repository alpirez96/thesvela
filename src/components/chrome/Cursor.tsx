"use client";

import { useEffect, useRef, useState } from "react";

const LERP = 0.22;
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Mode = "grow" | "view" | null;

/**
 * Follower cursor: a 12px brass dot with lamp glow that trails the pointer
 * (lerp 0.22). ×3 over `[data-cursor="grow"]`, "DRAG / VIEW" tag over
 * `[data-cursor="view"]`. The native cursor stays. Only on devices with a fine,
 * hovering pointer and when reduced motion is not requested.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const m = { x: -100, y: -100, cx: -100, cy: -100 };
    let mode: Mode = null;
    let raf = 0;

    const frame = () => {
      m.cx += (m.x - m.cx) * LERP;
      m.cy += (m.y - m.cy) * LERP;
      root.style.transform = `translate3d(${m.cx.toFixed(2)}px,${m.cy.toFixed(2)}px,0)`;
      // Idle once settled; the next pointer move restarts the loop.
      raf = Math.abs(m.x - m.cx) + Math.abs(m.y - m.cy) > 0.1 ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      m.x = e.clientX;
      m.y = e.clientY;
      if (root.dataset.hidden !== "false") {
        // First move, or back in the window: start at the pointer instead of trailing in from afar.
        m.cx = m.x;
        m.cy = m.y;
        root.dataset.hidden = "false";
      }
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      const next = (t?.getAttribute("data-cursor") as Mode) ?? null;
      if (next !== mode) {
        mode = next;
        if (mode) root.dataset.mode = mode;
        else delete root.dataset.mode;
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      root.dataset.hidden = "true";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="sv-cursor" aria-hidden="true">
      <div className="sv-cursor__dot" />
      <div className="sv-cursor__tag">DRAG / VIEW</div>
    </div>
  );
}
