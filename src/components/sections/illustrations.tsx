/* Ways-to-use illustrations and spec icons, converted from SVELA Lantern v6.
 * Fills reference the shared gradients in <IllustrationDefs />, whose stops use
 * currentColor (brass-light) from the defs <svg>. Keep the gradient ids stable. */

/** Shared gradient defs — render once, before the illustrations. */
export function IllustrationDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="ways__defs">
      <defs>
        <linearGradient id="brushed-steel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="18%" stopColor="currentColor" stopOpacity="0.62" />
          <stop offset="34%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="58%" stopColor="currentColor" stopOpacity="0.76" />
          <stop offset="78%" stopColor="currentColor" stopOpacity="0.20" />
          <stop offset="91%" stopColor="currentColor" stopOpacity="0.52" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="steel-deep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="22%" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="74%" stopColor="currentColor" stopOpacity="0.40" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="fluted-glass-glow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.48" />
          <stop offset="32%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="75%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id="rail-steel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.20" />
          <stop offset="28%" stopColor="currentColor" stopOpacity="0.78" />
          <stop offset="56%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="84%" stopColor="currentColor" stopOpacity="0.52" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="leather-strap" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.44" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="wood-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.20" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.24" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WinchArt() {
  return (
    <svg viewBox="0 0 220 260" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Winch mounting illustration">
      <path d="M66 144 Q110 135 154 144 L154 152 Q110 161 66 152 Z" fill="url(#brushed-steel)" strokeWidth="1.5" />
      <path d="M68 145 Q110 153 152 145" strokeWidth="1.1" opacity="0.85" />
      <path d="M72 153 L77 160 Q110 167 143 160 L148 153" fill="url(#steel-deep)" strokeWidth="1.3" />
      <path d="M77 160 Q84 185 75 211 Q110 220 145 211 Q136 185 143 160 Q110 167 77 160 Z" fill="url(#steel-deep)" strokeWidth="1.6" />
      <g strokeWidth="0.85" opacity="0.5">
        <path d="M86 163 Q90 186 84 210" />
        <path d="M92 164 Q95 186 90 212" />
        <path d="M128 164 Q125 186 130 212" />
        <path d="M134 163 Q130 186 136 210" />
      </g>
      <path d="M75 211 L62 222 Q110 235 158 222 L145 211 Q110 220 75 211 Z" fill="url(#brushed-steel)" strokeWidth="1.5" />
      <path d="M62 222 L62 232 Q110 245 158 232 L158 222" fill="url(#steel-deep)" strokeWidth="1.6" />
      <path d="M65 227 Q110 239 155 227" strokeWidth="1.05" opacity="0.78" />
      <g transform="translate(110, 16) scale(0.86)">
        <path d="M-35 136 L-24 148 Q0 152 24 148 L35 136 Z" fill="url(#steel-deep)" strokeWidth="1.6" />
        <path d="M-36 102 Q0 106.5 36 102 L36 136 Q0 141 -36 136 Z" fill="url(#brushed-steel)" strokeWidth="1.75" />
        <path d="M-30 97.5 Q-35.5 99 -36 102 Q0 106.5 36 102 Q35.5 99 30 97.5" fill="url(#steel-deep)" strokeWidth="1.5" />
        <path d="M-30 85 Q0 88.5 30 85 L30 98.5 Q0 102 -30 98.5 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <path d="M-28 17.5 L-28 85 Q0 88.5 28 85 L28 17.5 Q0 21 -28 17.5 Z" fill="url(#fluted-glass-glow)" strokeWidth="1.55" />
        <g strokeWidth="1.05" opacity="0.9">
          <line x1="-25" y1="18.2" x2="-25" y2="85.4" />
          <line x1="-21.5" y1="18.8" x2="-21.5" y2="86" />
          <line x1="-17.5" y1="19.4" x2="-17.5" y2="86.6" />
          <line x1="-13" y1="19.8" x2="-13" y2="87" />
          <line x1="-8" y1="20.2" x2="-8" y2="87.4" />
          <line x1="-2.7" y1="20.4" x2="-2.7" y2="87.6" />
          <line x1="2.7" y1="20.4" x2="2.7" y2="87.6" />
          <line x1="8" y1="20.2" x2="8" y2="87.4" />
          <line x1="13" y1="19.8" x2="13" y2="87" />
          <line x1="17.5" y1="19.4" x2="17.5" y2="86.6" />
          <line x1="21.5" y1="18.8" x2="21.5" y2="86" />
          <line x1="25" y1="18.2" x2="25" y2="85.4" />
        </g>
        <path d="M-30 2.5 L-30 17 Q0 20.5 30 17 L30 2.5 Q0 6 -30 2.5 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <ellipse cx="0" cy="2.5" rx="30" ry="3.5" fill="url(#steel-deep)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function DeckArt() {
  return (
    <svg viewBox="0 0 240 260" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Deck mounting illustration">
      <defs>
        <path id="deck-water-top" d="M 145 101 A 34 24 0 0 1 211 101" />
        <path id="deck-water-bot" d="M 145 117 A 34 24 0 0 0 211 117" />
        <path id="deck-waste-top" d="M 145 190 A 34 24 0 0 1 211 190" />
        <path id="deck-waste-bot" d="M 145 206 A 34 24 0 0 0 211 206" />
      </defs>
      <ellipse cx="64" cy="212" rx="47" ry="20" fill="url(#steel-deep)" strokeWidth="1.6" />
      <ellipse cx="64" cy="208" rx="46" ry="18.5" fill="url(#brushed-steel)" strokeWidth="1.4" />
      <ellipse cx="64" cy="206" rx="35" ry="13.5" strokeWidth="1" opacity="0.65" />
      <g strokeWidth="1.1">
        <circle cx="26" cy="208" r="2.5" />
        <circle cx="102" cy="208" r="2.5" />
        <circle cx="41" cy="220" r="2.5" />
        <circle cx="87" cy="220" r="2.5" />
        <circle cx="41" cy="195" r="2.2" />
        <circle cx="87" cy="195" r="2.2" />
      </g>
      <g transform="translate(64, 72) scale(0.85)">
        <path d="M-35 136 L-24 149 Q0 154 24 149 L35 136 Z" fill="url(#steel-deep)" strokeWidth="1.6" />
        <path d="M-36 102 Q0 108 36 102 L36 136 Q0 142 -36 136 Z" fill="url(#brushed-steel)" strokeWidth="1.75" />
        <path d="M-30 97 Q-35.5 99 -36 102 Q0 108 36 102 Q35.5 99 30 97" fill="url(#steel-deep)" strokeWidth="1.5" />
        <path d="M-30 85 Q0 90 30 85 L30 98.5 Q0 103.5 -30 98.5 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <path d="M-28 17.5 L-28 85 Q0 90 28 85 L28 17.5 Q0 22.5 -28 17.5 Z" fill="url(#fluted-glass-glow)" strokeWidth="1.55" />
        <g strokeWidth="1.05" opacity="0.9">
          <line x1="-25" y1="18.6" x2="-25" y2="85.8" />
          <line x1="-21.5" y1="19.5" x2="-21.5" y2="86.7" />
          <line x1="-17.5" y1="20.3" x2="-17.5" y2="87.5" />
          <line x1="-13" y1="21" x2="-13" y2="88.2" />
          <line x1="-8" y1="21.6" x2="-8" y2="88.8" />
          <line x1="-2.7" y1="21.9" x2="-2.7" y2="89.1" />
          <line x1="2.7" y1="21.9" x2="2.7" y2="89.1" />
          <line x1="8" y1="21.6" x2="8" y2="88.8" />
          <line x1="13" y1="21" x2="13" y2="88.2" />
          <line x1="17.5" y1="20.3" x2="17.5" y2="87.5" />
          <line x1="21.5" y1="19.5" x2="21.5" y2="86.7" />
          <line x1="25" y1="18.6" x2="25" y2="85.8" />
        </g>
        <path d="M-30 3 L-30 17.5 Q0 22.5 30 17.5 L30 3 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <ellipse cx="0" cy="3" rx="30" ry="6.5" fill="url(#steel-deep)" strokeWidth="1.6" />
        <ellipse cx="0" cy="3" rx="22" ry="4.4" strokeWidth="1" opacity="0.7" />
      </g>
      <g>
        <ellipse cx="178" cy="110" rx="47" ry="35" fill="url(#steel-deep)" strokeWidth="1.5" />
        <ellipse cx="178" cy="107" rx="46" ry="33.5" fill="url(#brushed-steel)" strokeWidth="1.4" />
        <ellipse cx="178" cy="107" rx="41.5" ry="29.5" strokeWidth="0.9" opacity="0.65" />
        <ellipse cx="178" cy="107" rx="21" ry="15" fill="url(#steel-deep)" strokeWidth="1.3" />
        <ellipse cx="178" cy="107" rx="11" ry="7.8" strokeWidth="1.3" />
        <circle cx="143" cy="107" r="2.7" strokeWidth="1.1" />
        <circle cx="213" cy="107" r="2.7" strokeWidth="1.1" />
        <circle cx="155" cy="85" r="2.2" strokeWidth="1" opacity="0.8" />
        <circle cx="201" cy="85" r="2.2" strokeWidth="1" opacity="0.8" />
        <circle cx="155" cy="129" r="2.2" strokeWidth="1" opacity="0.8" />
        <circle cx="201" cy="129" r="2.2" strokeWidth="1" opacity="0.8" />
        <text fontSize="8.2" fontWeight="600" letterSpacing="1.4">
          <textPath href="#deck-water-top" startOffset="50%" textAnchor="middle">WATER</textPath>
        </text>
        <text fontSize="8.2" fontWeight="600" letterSpacing="1.4">
          <textPath href="#deck-water-bot" startOffset="50%" textAnchor="middle">WATER</textPath>
        </text>
      </g>
      <g>
        <ellipse cx="178" cy="199" rx="47" ry="35" fill="url(#steel-deep)" strokeWidth="1.5" />
        <ellipse cx="178" cy="196" rx="46" ry="33.5" fill="url(#brushed-steel)" strokeWidth="1.4" />
        <ellipse cx="178" cy="196" rx="41.5" ry="29.5" strokeWidth="0.9" opacity="0.65" />
        <ellipse cx="178" cy="196" rx="21" ry="15" fill="url(#steel-deep)" strokeWidth="1.3" />
        <ellipse cx="178" cy="196" rx="11" ry="7.8" strokeWidth="1.3" />
        <circle cx="143" cy="196" r="2.7" strokeWidth="1.1" />
        <circle cx="213" cy="196" r="2.7" strokeWidth="1.1" />
        <circle cx="155" cy="174" r="2.2" strokeWidth="1" opacity="0.8" />
        <circle cx="201" cy="174" r="2.2" strokeWidth="1" opacity="0.8" />
        <circle cx="155" cy="218" r="2.2" strokeWidth="1" opacity="0.8" />
        <circle cx="201" cy="218" r="2.2" strokeWidth="1" opacity="0.8" />
        <text fontSize="8.2" fontWeight="600" letterSpacing="1.4">
          <textPath href="#deck-waste-top" startOffset="50%" textAnchor="middle">WASTE</textPath>
        </text>
        <text fontSize="8.2" fontWeight="600" letterSpacing="1.4">
          <textPath href="#deck-waste-bot" startOffset="50%" textAnchor="middle">WASTE</textPath>
        </text>
      </g>
    </svg>
  );
}

export function HangArt() {
  return (
    <svg viewBox="0 0 220 260" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Hanging leather strap illustration">
      <path d="M38 45 L38 56 M44 44 L44 56" strokeWidth="1.4" />
      <ellipse cx="41" cy="57" rx="9" ry="3" fill="url(#steel-deep)" strokeWidth="1.3" />
      <path d="M10 35 L210 12 L210 27 L10 50 Z" fill="url(#rail-steel)" strokeWidth="1.6" />
      <line x1="12" y1="40" x2="208" y2="17" strokeWidth="0.95" opacity="0.7" />
      <line x1="12" y1="46" x2="208" y2="23" strokeWidth="0.85" opacity="0.5" />
      <path d="M108 38 C100 56 97 78 103 102 L109 102 C104 79 107 57 114 38 Z" fill="url(#steel-deep)" strokeWidth="1.25" />
      <path d="M106 23 Q115 15 123 23 C129 44 127 74 120 102 L113 102 C120 74 122 44 116 25 Q113 21 108 25 Z" fill="url(#leather-strap)" strokeWidth="1.45" />
      <path d="M119 25 C124 46 122 74 116.5 100" strokeWidth="0.75" strokeDasharray="2.5 2.5" opacity="0.7" />
      <g transform="translate(112, 100) scale(0.90)">
        <path d="M-35 136 L-24 148.5 Q0 152.5 24 148.5 L35 136 Z" fill="url(#steel-deep)" strokeWidth="1.6" />
        <path d="M-36 102 Q0 106.5 36 102 L36 136 Q0 141 -36 136 Z" fill="url(#brushed-steel)" strokeWidth="1.75" />
        <path d="M-30 97.5 Q-35.5 99 -36 102 Q0 106.5 36 102 Q35.5 99 30 97.5" fill="url(#steel-deep)" strokeWidth="1.5" />
        <path d="M-30 85 Q0 88.5 30 85 L30 98.5 Q0 102 -30 98.5 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <path d="M-28 17.5 L-28 85 Q0 88.5 28 85 L28 17.5 Q0 21 -28 17.5 Z" fill="url(#fluted-glass-glow)" strokeWidth="1.55" />
        <g strokeWidth="1.05" opacity="0.9">
          <line x1="-25" y1="18.2" x2="-25" y2="85.4" />
          <line x1="-21.5" y1="18.8" x2="-21.5" y2="86" />
          <line x1="-17.5" y1="19.4" x2="-17.5" y2="86.6" />
          <line x1="-13" y1="19.8" x2="-13" y2="87" />
          <line x1="-8" y1="20.2" x2="-8" y2="87.4" />
          <line x1="-2.7" y1="20.4" x2="-2.7" y2="87.6" />
          <line x1="2.7" y1="20.4" x2="2.7" y2="87.6" />
          <line x1="8" y1="20.2" x2="8" y2="87.4" />
          <line x1="13" y1="19.8" x2="13" y2="87" />
          <line x1="17.5" y1="19.4" x2="17.5" y2="86.6" />
          <line x1="21.5" y1="18.8" x2="21.5" y2="86" />
          <line x1="25" y1="18.2" x2="25" y2="85.4" />
        </g>
        <path d="M-30 2.5 L-30 17 Q0 20.5 30 17 L30 2.5 Q0 6 -30 2.5 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <ellipse cx="0" cy="2.5" rx="30" ry="3.8" fill="url(#steel-deep)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function TableArt() {
  return (
    <svg viewBox="0 0 230 260" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Tabletop placement illustration">
      <path d="M20 174 Q10 179 18 189 L54 221 Q66 229 86 226 L228 203 L228 149 L20 174 Z" fill="url(#wood-top)" strokeWidth="1.6" />
      <path d="M14 181 L14 193 Q14 198 20 203 L54 233 Q66 241 86 238 L228 215 L228 203 L86 226 Q66 229 54 221 L18 189 Q14 185 14 181 Z" fill="url(#steel-deep)" strokeWidth="1.5" />
      <path d="M16 193 L54 227 Q66 235 86 232 L228 209" strokeWidth="0.9" opacity="0.65" />
      <g strokeWidth="0.85" opacity="0.45">
        <path d="M32 180 Q118 174 224 157" />
        <path d="M42 190 Q128 184 224 167" />
        <path d="M52 200 Q138 194 224 177" />
        <path d="M64 210 Q148 204 224 187" />
        <path d="M76 220 Q158 214 224 196" />
      </g>
      <ellipse cx="96" cy="186" rx="34" ry="9.5" fill="currentColor" fillOpacity="0.16" stroke="none" />
      <g transform="translate(96, 35)">
        <path d="M-2 -2 Q22 -14 34 8 C44 34 50 92 54 134 C55 145 48 150 40 144 C36 122 36 52 28 14 Q20 -2 4 0" fill="url(#steel-deep)" strokeWidth="1.25" opacity="0.85" />
        <path d="M-4 1 Q20 -11 32 10 C42 36 47 94 45 143 L38 144 C40 94 35 38 25 14 Q16 -3 2 1 Z" fill="url(#leather-strap)" strokeWidth="1.4" />
        <path d="M29 12 C38 38 43 92 41.5 140" strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.65" />
        <path d="M-35 136 L-24 148.5 Q0 152.5 24 148.5 L35 136 Z" fill="url(#steel-deep)" strokeWidth="1.55" />
        <path d="M-36 102 Q0 106.5 36 102 L36 136 Q0 141 -36 136 Z" fill="url(#brushed-steel)" strokeWidth="1.65" />
        <path d="M-30 97.5 Q-35.5 99 -36 102 Q0 106.5 36 102 Q35.5 99 30 97.5" fill="url(#steel-deep)" strokeWidth="1.4" />
        <path d="M-30 85 Q0 88.5 30 85 L30 98.5 Q0 102 -30 98.5 Z" fill="url(#brushed-steel)" strokeWidth="1.55" />
        <path d="M-28 17.5 L-28 85 Q0 88.5 28 85 L28 17.5 Q0 21 -28 17.5 Z" fill="url(#fluted-glass-glow)" strokeWidth="1.45" />
        <g strokeWidth="1" opacity="0.92">
          <line x1="-25" y1="18.2" x2="-25" y2="85.4" />
          <line x1="-21.5" y1="18.8" x2="-21.5" y2="86" />
          <line x1="-17.5" y1="19.4" x2="-17.5" y2="86.6" />
          <line x1="-13" y1="19.8" x2="-13" y2="87" />
          <line x1="-8" y1="20.2" x2="-8" y2="87.4" />
          <line x1="-2.7" y1="20.4" x2="-2.7" y2="87.6" />
          <line x1="2.7" y1="20.4" x2="2.7" y2="87.6" />
          <line x1="8" y1="20.2" x2="8" y2="87.4" />
          <line x1="13" y1="19.8" x2="13" y2="87" />
          <line x1="17.5" y1="19.4" x2="17.5" y2="86.6" />
          <line x1="21.5" y1="18.8" x2="21.5" y2="86" />
          <line x1="25" y1="18.2" x2="25" y2="85.4" />
        </g>
        <path d="M-30 2.5 L-30 17 Q0 20.5 30 17 L30 2.5 Q0 6 -30 2.5 Z" fill="url(#brushed-steel)" strokeWidth="1.55" />
        <ellipse cx="0" cy="2.5" rx="30" ry="3.5" fill="url(#steel-deep)" strokeWidth="1.45" />
      </g>
    </svg>
  );
}

export function BatteryIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19.5 8.5V6.5C19.5 5.67 20.17 5 21 5H27C27.83 5 28.5 5.67 28.5 6.5V8.5" />
      <rect x="13.5" y="8.5" width="21" height="33" rx="2.5" />
      <path d="M25.5 16.5L20 26H27.5L22.5 35" />
    </svg>
  );
}

export function BrightnessIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="6.5" />
      <line x1="24" y1="8.5" x2="24" y2="13" />
      <line x1="24" y1="35" x2="24" y2="39.5" />
      <line x1="8.5" y1="24" x2="13" y2="24" />
      <line x1="35" y1="24" x2="39.5" y2="24" />
      <line x1="13.04" y1="13.04" x2="16.22" y2="16.22" />
      <line x1="34.96" y1="13.04" x2="31.78" y2="16.22" />
      <line x1="13.04" y1="34.96" x2="16.22" y2="31.78" />
      <line x1="34.96" y1="34.96" x2="31.78" y2="31.78" />
    </svg>
  );
}

export function RuntimeIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="14.5" />
      <path d="M24 14.5V24L30.5 28" />
    </svg>
  );
}

export function ChargingIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="16" width="38" height="16" rx="8" />
      <rect x="12.5" y="22.25" width="23" height="3.5" rx="1.75" />
    </svg>
  );
}

export function MaterialIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 6.5C20.5 9.2 15.5 9.8 11.5 9.8V24C11.5 32.5 16.8 38.2 24 41.5C31.2 38.2 36.5 32.5 36.5 24V9.8C32.5 9.8 27.5 9.2 24 6.5Z" />
      <path d="M15 20.5Q17.25 17.5 19.5 20.5Q21.75 23.5 24 20.5Q26.25 17.5 28.5 20.5Q30.75 23.5 33 20.5" />
      <path d="M15 27.5Q17.25 24.5 19.5 27.5Q21.75 30.5 24 27.5Q26.25 24.5 28.5 27.5Q30.75 30.5 33 27.5" />
    </svg>
  );
}

export function WeightIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="12" r="3.5" />
      <path d="M16 15.5H32L36.5 39.5H11.5L16 15.5Z" />
    </svg>
  );
}

export function WarrantyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 4.5C19.8 7.8 14.2 8.6 9.5 8.6V24.5C9.5 34.2 15.6 40.5 24 44C32.4 40.5 38.5 34.2 38.5 24.5V8.6C33.8 8.6 28.2 7.8 24 4.5Z" />
      <text x="24" y="25.5" textAnchor="middle" fontSize="16" fontWeight="600">2</text>
      <text x="24" y="34" textAnchor="middle" fontSize="5.8" fontWeight="600" letterSpacing="0.8">YEAR</text>
    </svg>
  );
}
