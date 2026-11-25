"use client";

import { useEffect, useRef } from "react";

/**
 * Hero yacht film. Muted, looping, inline. Visitors who ask for reduced
 * motion get the still poster frame instead of the moving film.
 */
export function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) {
        v.pause();
      } else if (v.paused) {
        v.play().catch(() => {
          /* autoplay refused — the poster stays */
        });
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className="hero__film"
      src="/svela/yachtfilm.mp4"
      poster="/svela/m/deck.jpg"
      aria-label="SVELA lantern aboard a yacht at dusk"
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
    />
  );
}
