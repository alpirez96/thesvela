import type { ComponentType } from "react";
import {
  BatteryIcon,
  BrightnessIcon,
  ChargingIcon,
  DeckArt,
  HangArt,
  IllustrationDefs,
  MaterialIcon,
  RuntimeIcon,
  TableArt,
  WarrantyIcon,
  WeightIcon,
  WinchArt,
} from "./illustrations";

const WAYS: { n: string; t: string; Art: ComponentType }[] = [
  { n: "01", t: "WINCH", Art: WinchArt },
  { n: "02", t: "DECK", Art: DeckArt },
  { n: "03", t: "HANG", Art: HangArt },
  { n: "04", t: "TABLE", Art: TableArt },
];

const SPECS: { t: string; v: string[]; Icon: ComponentType }[] = [
  { t: "BATTERY", v: ["2 × 2000 mAh", "Li-ion", "3.7 V"], Icon: BatteryIcon },
  { t: "BRIGHTNESS", v: ["3 Light Levels"], Icon: BrightnessIcon },
  { t: "RUNTIME", v: ["40 h (Low)", "20 h (Medium)", "12 h (High)"], Icon: RuntimeIcon },
  { t: "CHARGING", v: ["USB-C", "Rechargeable"], Icon: ChargingIcon },
  { t: "MATERIAL", v: ["316", "Stainless"], Icon: MaterialIcon },
  { t: "WEIGHT", v: ["800 g"], Icon: WeightIcon },
  { t: "WARRANTY", v: ["2 Year"], Icon: WarrantyIcon },
];

/** (02) Ways to use — four mounting illustrations and the technical specifications. */
export function WaysToUse() {
  return (
    <section id="use" className="ways" data-idx="2" data-theme="abyss" aria-labelledby="ways-title">
      <IllustrationDefs />

      <div className="sv-label sv-label--center">
        <span className="sv-label__rule" aria-hidden="true" />
        <span className="sv-label__num">(02)</span>
        <span className="sv-label__text">WAYS TO USE</span>
        <span className="sv-label__rule" aria-hidden="true" />
      </div>
      <h2 id="ways-title" className="sv-display ways__title">
        FOUR WAYS <span className="sv-tail">to carry it</span>
      </h2>

      <div className="ways__grid">
        {WAYS.map(({ n, t, Art }) => (
          <article key={t} className="ways__card">
            <div className="ways__art">
              <Art />
            </div>
            <h3 className="ways__name">
              <span className="ways__num">{n}</span>
              {t}
            </h3>
          </article>
        ))}
      </div>

      <div className="sv-label sv-label--center ways__specs-label">
        <span className="sv-label__rule" aria-hidden="true" />
        <span className="sv-label__text">TECHNICAL SPECIFICATIONS</span>
        <span className="sv-label__rule" aria-hidden="true" />
      </div>
      <div className="ways__specs">
        {SPECS.map(({ t, v, Icon }) => (
          <article key={t} className="ways__spec">
            <div className="ways__icon">
              <Icon />
            </div>
            <h4 className="ways__spec-title">{t}</h4>
            <ul className="ways__spec-list">
              {v.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
