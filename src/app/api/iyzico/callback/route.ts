import { isIyzicoConfigured, retrieveCheckoutForm } from "@/lib/iyzico";
import { isOrderId } from "@/lib/order";
import { siteOrigin } from "@/lib/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_RE = /^[A-Za-z0-9_.:-]{1,256}$/;

function cleanToken(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return TOKEN_RE.test(t) ? t : null;
}

function shortReason(v: string): string {
  return v.replace(/\s+/g, " ").trim().slice(0, 120);
}

/** 303 See Other → the browser follows with a GET. */
function seeOther(origin: string, path: string, params: Record<string, string | null>): Response {
  const url = new URL(path, origin);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  return new Response(null, { status: 303, headers: { Location: url.toString(), "Cache-Control": "no-store" } });
}

async function settle(req: Request, token: string | null): Promise<Response> {
  const origin = siteOrigin(req);
  const orderParam = new URL(req.url).searchParams.get("order");
  const order = isOrderId(orderParam) ? orderParam : null;
  const failed = (reason: string, id: string | null = order) =>
    seeOther(origin, "/order/failed", { order: id, reason: shortReason(reason) });

  if (orderParam && !order) return failed("invalid_order", null);
  if (!token) return failed("missing_token");
  if (!isIyzicoConfigured()) {
    console.error("[iyzico/callback] payment returned but iyzico keys are not set", { order });
    return failed("not_configured");
  }

  try {
    const res = await retrieveCheckoutForm({ token, ...(order ? { conversationId: order } : {}) });
    const id = order ?? (isOrderId(res.basketId) ? res.basketId : null);

    if (res.status !== "success") {
      console.error("[iyzico/callback] retrieve rejected", { order: id, errorCode: res.errorCode, errorMessage: res.errorMessage });
      return failed(res.errorMessage || res.errorCode || "retrieve_failed", id);
    }
    if (res.paymentStatus !== "SUCCESS") {
      console.warn("[iyzico/callback] payment not successful", {
        order: id,
        paymentStatus: res.paymentStatus,
        errorCode: res.errorCode,
        errorMessage: res.errorMessage,
      });
      return failed(res.errorMessage || `payment_${String(res.paymentStatus ?? "unknown").toLowerCase()}`, id);
    }
    if (order && res.basketId !== order) {
      console.error("[iyzico/callback] basketId does not match the order", { order, basketId: res.basketId });
      return failed("order_mismatch", order);
    }

    if (typeof res.fraudStatus === "number" && res.fraudStatus !== 1) {
      console.warn("[iyzico/callback] payment held for fraud review — check the iyzico panel before dispatch", {
        order: id,
        paymentId: res.paymentId,
        fraudStatus: res.fraudStatus,
      });
    }
    console.info("[iyzico/callback] payment confirmed", {
      order: id,
      paymentId: res.paymentId,
      paidPrice: res.paidPrice,
      currency: res.currency,
    });
    return seeOther(origin, "/order/success", { order: id });
  } catch (err) {
    console.error("[iyzico/callback] retrieve failed", { order, error: err instanceof Error ? err.message : err });
    return failed("error");
  }
}

/** iyzico posts `token` as application/x-www-form-urlencoded. */
export async function POST(req: Request): Promise<Response> {
  let token: string | null = null;
  try {
    const type = req.headers.get("content-type") ?? "";
    if (type.includes("application/json")) {
      const body = (await req.json()) as { token?: unknown } | null;
      token = cleanToken(body?.token);
    } else {
      token = cleanToken((await req.formData()).get("token"));
    }
  } catch {
    token = null;
  }
  token ??= cleanToken(new URL(req.url).searchParams.get("token"));
  return settle(req, token);
}

/** Fallback for a GET (e.g. a reload of the callback URL). */
export async function GET(req: Request): Promise<Response> {
  return settle(req, cleanToken(new URL(req.url).searchParams.get("token")));
}
