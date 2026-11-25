/**
 * Order references: "SV-<yyMMdd>-<6 base36>", e.g. "SV-261125-4K9QZ2".
 * The date is the Bodrum (Europe/Istanbul) calendar day.
 */

export const ORDER_ID_RE = /^SV-\d{6}-[0-9A-Z]{6}$/;

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function isOrderId(v: unknown): v is string {
  return typeof v === "string" && ORDER_ID_RE.test(v);
}

function yymmdd(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}${get("month")}${get("day")}`;
}

function randomSuffix(len = 6): string {
  let out = "";
  const buf = new Uint8Array(16);
  while (out.length < len) {
    globalThis.crypto.getRandomValues(buf);
    for (const b of buf) {
      // 252 = 36 × 7: reject the tail so every symbol is equally likely.
      if (b < 252 && out.length < len) out += ALPHABET[b % 36];
    }
  }
  return out;
}

export function createOrderId(now = new Date()): string {
  return `SV-${yymmdd(now)}-${randomSuffix()}`;
}
