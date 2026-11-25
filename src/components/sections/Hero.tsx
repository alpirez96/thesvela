import { Arrow } from "./Arrow";
import { HeroFilm } from "./HeroFilm";

const GRID_COLUMNS = 8;

/** (01) Hero — yacht film, scrims, grid lines and the opening copy. */
export function Hero() {
  return (
    <section id="top" className="hero" data-idx="1" data-theme="abyss" aria-labelledby="hero-title">
      <HeroFilm />
      <span className="hero__scrim" aria-hidden="true" />

      <div className="hero__caption">
        <span className="hero__caption-dot" aria-hidden="true" />
        LIT · 2700 K · SEA-TRIALLED, BODRUM
      </div>

      <div className="hero__grid" aria-hidden="true">
        {Array.from({ length: GRID_COLUMNS }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="hero__copy">
        <div className="hero__eyebrow">PORTABLE MARINE LANTERN · 2700 K</div>
        <h1 id="hero-title" className="sv-display hero__title">
          ENGINEERED
          <br />
          FOR OPEN
          <br />
          WATERS
        </h1>
        <p className="sv-tail hero__tail">Crafted for timeless evenings.</p>
        <p className="hero__body">
          Brushed marine steel, fluted glass, saddle leather. Dimmable to candlelight, sealed to IP67, up to forty
          hours from a single charge.
        </p>
        <div className="hero__ctas">
          <a href="#buy" className="sv-btn sv-btn--primary" data-cursor="grow">
            RESERVE THE LANTERN
            <Arrow />
          </a>
          <a href="#use" className="hero__more" data-cursor="grow">
            WAYS TO USE ↓
          </a>
        </div>
      </div>
    </section>
  );
}
