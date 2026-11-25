import { NextResponse } from "next/server";
import { getEurTryRate } from "@/lib/rates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/rates → { base: "EUR", TRY: 55.3185, source: "TCMB", date: "2026-11-25" } */
export async function GET() {
  const r = await getEurTryRate();
  if (!r) {
    return NextResponse.json({ error: "Exchange rate unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(
    { base: "EUR", TRY: r.rate, source: r.source, date: r.date },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } },
  );
}
