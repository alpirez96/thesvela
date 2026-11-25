import { getProduct, type CurrencyCode, type Product } from "@/lib/product";
import { isSaleCurrency, unitPriceIn, type RateInfo, type SaleCurrency } from "@/lib/pricing";
import { getEurTryRate } from "@/lib/rates";
import { validateBuyer, BUYER_FIELDS } from "@/lib/checkout";
import {
  formatMinor,
  initializeCheckoutForm,
  isIyzicoConfigured,
  toMinor,
  type CheckoutFormInitializeRequest,
  type CheckoutFormInitializeResponse,
  type IyzicoBasketItem,
} from "@/lib/iyzico";
import { clientIp, siteOrigin } from "@/lib/origin";
import { createOrderId } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_LINES = 20;
/** iyzico requires an identity number; this is its documented placeholder. */
const PLACEHOLDER_IDENTITY = "11111111111";

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

interface PricedLine {
  product: Product;
  qty: number;
}

/** Strictly validate and merge the bag lines. */
function parseLines(raw: unknown): { lines: PricedLine[] } | { error: string } {
  if (!Array.isArray(raw) || raw.length === 0) return { error: "Your bag is empty." };
  if (raw.length > MAX_LINES) return { error: "Too many items in the bag." };

  const merged = new Map<string, PricedLine>();
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") return { error: "Your bag could not be read." };
    const { id, qty } = entry as Record<string, unknown>;
    if (typeof id !== "string") return { error: "Your bag could not be read." };
    const product = getProduct(id);
    if (!product) return { error: "An item in your bag is no longer available." };
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > product.maxQty)
      return { error: `Choose between 1 and ${product.maxQty} of ${product.name}.` };
    const cur = merged.get(id);
    merged.set(id, { product, qty: (cur?.qty ?? 0) + qty });
  }

  const lines = [...merged.values()];
  for (const l of lines) {
    if (l.qty > l.product.maxQty) return { error: `Choose between 1 and ${l.product.maxQty} of ${l.product.name}.` };
  }
  const currencies = new Set<CurrencyCode>(lines.map((l) => l.product.currency));
  if (currencies.size !== 1) return { error: "Items in your bag are priced in different currencies." };
  return { lines };
}

export async function POST(req: Request): Promise<Response> {
  /* ── Parse ── */
  let payload: unknown;
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json(413, { error: "Request too large." });
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { error: "Request too large." });
    payload = JSON.parse(text);
  } catch {
    return json(400, { error: "Invalid request." });
  }
  if (!payload || typeof payload !== "object") return json(400, { error: "Invalid request." });
  const { lines: rawLines, buyer: rawBuyer, currency: rawCurrency } = payload as Record<string, unknown>;

  /* ── Validate ── */
  const parsed = parseLines(rawLines);
  if ("error" in parsed) return json(400, { error: parsed.error });

  if (rawCurrency !== undefined && rawCurrency !== null && !isSaleCurrency(rawCurrency))
    return json(400, { error: "Choose EUR or TRY." });
  const currency: SaleCurrency = isSaleCurrency(rawCurrency) ? rawCurrency : "EUR";

  const check = validateBuyer(rawBuyer);
  const firstError = BUYER_FIELDS.map((f) => check.errors[f]).find(Boolean);
  if (firstError || !check.gsmNumber) {
    return json(400, { error: firstError ?? "Please check your details.", fields: check.errors });
  }
  const b = check.values;

  if (!isIyzicoConfigured()) {
    console.warn("[checkout] IYZICO_API_KEY / IYZICO_SECRET_KEY are not set — refusing checkout");
    return json(503, { error: "Payments are not configured yet." });
  }

  /* ── Price (server side: lib/product.ts EUR prices, TRY at today's rate) ── */
  if (parsed.lines.some((l) => l.product.currency !== "EUR")) {
    console.error("[checkout] catalog prices must be set in EUR (the base currency)");
    return json(500, { error: "The payment could not be started. Please try again." });
  }
  let rate: RateInfo | null = null;
  if (currency === "TRY") {
    rate = await getEurTryRate().catch((err: unknown) => {
      console.error("[checkout] EUR/TRY rate lookup failed", err instanceof Error ? err.message : err);
      return null;
    });
    if (!rate) return json(503, { error: "TRY pricing is unavailable right now — please pay in EUR." });
  }

  const priced: { product: Product; qty: number; lineMinor: number }[] = [];
  for (const { product, qty } of parsed.lines) {
    const unit = unitPriceIn(product, currency, rate?.rate);
    if (unit === null || !Number.isFinite(unit) || unit <= 0) {
      console.error("[checkout] could not price item", { id: product.id, currency });
      return json(503, { error: "TRY pricing is unavailable right now — please pay in EUR." });
    }
    priced.push({ product, qty, lineMinor: toMinor(unit) * qty });
  }
  const basketItems: IyzicoBasketItem[] = priced.map(({ product, qty, lineMinor }) => ({
    id: product.id,
    name: qty > 1 ? `${product.name} × ${qty}` : product.name,
    category1: product.category,
    itemType: "PHYSICAL",
    price: formatMinor(lineMinor),
  }));
  const totalMinor = priced.reduce((sum, l) => sum + l.lineMinor, 0);
  const total = formatMinor(totalMinor);

  /* ── iyzico Checkout Form ── */
  const orderId = createOrderId();
  const origin = siteOrigin(req);
  const contactName = `${b.firstName} ${b.lastName}`;
  const address = { contactName, city: b.city, country: b.country, address: b.address, ...(b.zipCode ? { zipCode: b.zipCode } : {}) };

  const request: CheckoutFormInitializeRequest = {
    locale: "en",
    conversationId: orderId,
    price: total,
    paidPrice: total,
    currency,
    basketId: orderId,
    paymentGroup: "PRODUCT",
    callbackUrl: `${origin}/api/iyzico/callback?order=${encodeURIComponent(orderId)}`,
    enabledInstallments: [1],
    buyer: {
      id: `BY-${orderId}`,
      name: b.firstName,
      surname: b.lastName,
      gsmNumber: check.gsmNumber,
      email: b.email,
      identityNumber: b.identityNumber || PLACEHOLDER_IDENTITY,
      registrationAddress: b.address,
      ip: clientIp(req),
      city: b.city,
      country: b.country,
      ...(b.zipCode ? { zipCode: b.zipCode } : {}),
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems,
  };

  let res: CheckoutFormInitializeResponse;
  try {
    res = await initializeCheckoutForm(request);
  } catch (err) {
    console.error("[checkout] iyzico initialize failed", { orderId, error: err instanceof Error ? err.message : err });
    return json(502, { error: "We couldn't reach the payment provider. Please try again in a moment." });
  }

  let pageUrl: URL | null = null;
  try {
    pageUrl = res.paymentPageUrl ? new URL(res.paymentPageUrl) : null;
  } catch {
    pageUrl = null;
  }
  if (res.status !== "success" || !pageUrl || !/^https?:$/.test(pageUrl.protocol)) {
    console.error("[checkout] iyzico initialize rejected", {
      orderId,
      status: res.status,
      errorCode: res.errorCode,
      errorMessage: res.errorMessage,
    });
    return json(502, { error: res.errorMessage || "The payment could not be started. Please try again." });
  }

  console.info("[checkout] payment page created", {
    orderId,
    total,
    currency,
    ...(rate ? { eurTry: rate.rate, rateSource: rate.source, rateDate: rate.date } : {}),
  });
  return json(200, { paymentPageUrl: res.paymentPageUrl, orderId, amount: totalMinor / 100, currency });
}
