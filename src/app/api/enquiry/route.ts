import { cleanText } from "@/lib/checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;
const NOT_CONNECTED = "Enquiries are not connected yet — please reach us on Instagram @SVELA.";

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Keep line breaks in the message, drop other control characters. */
function cleanMessage(v: unknown): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/\r\n?/g, "\n")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: Request): Promise<Response> {
  let payload: unknown;
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json(413, { error: "Your message is too long." });
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { error: "Your message is too long." });
    payload = JSON.parse(text);
  } catch {
    return json(400, { error: "Invalid request." });
  }
  if (!payload || typeof payload !== "object") return json(400, { error: "Invalid request." });
  const raw = payload as Record<string, unknown>;

  const name = cleanText(raw.name);
  const email = cleanText(raw.email).toLowerCase();
  const phone = cleanText(raw.phone);
  const message = cleanMessage(raw.message);

  if (!name) return json(400, { error: "Please enter your name." });
  if (name.length > 100) return json(400, { error: "Please shorten your name." });
  if (!email) return json(400, { error: "Please enter your email." });
  if (email.length > 254 || !EMAIL_RE.test(email)) return json(400, { error: "Please enter a valid email." });
  if (phone.length > 30 || (phone && !/^\+?[\d\s().\-/]+$/.test(phone)))
    return json(400, { error: "Please enter a valid phone number." });
  if (message.length > 2000) return json(400, { error: "Please keep your message under 2000 characters." });

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = (process.env.ENQUIRY_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!apiKey || to.length === 0) {
    console.warn("[enquiry] RESEND_API_KEY / ENQUIRY_TO_EMAIL not set — enquiry not delivered", { email });
    return json(503, { error: NOT_CONNECTED });
  }

  const from = process.env.ENQUIRY_FROM_EMAIL?.trim() || "SVELA <onboarding@resend.dev>";
  const text = [
    "New enquiry from thesvela website",
    "",
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "—"}`,
    "",
    "Message:",
    message || "—",
    "",
    `Sent ${new Date().toISOString()}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: email, subject: `SVELA enquiry — ${name}`, text }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      console.error("[enquiry] Resend rejected the email", { status: res.status, detail });
      return json(502, { error: "We couldn't send your enquiry. Please try again, or reach us on Instagram @SVELA." });
    }
  } catch (err) {
    console.error("[enquiry] Resend request failed", { error: err instanceof Error ? err.message : err });
    return json(502, { error: "We couldn't send your enquiry. Please try again, or reach us on Instagram @SVELA." });
  }

  return json(200, { ok: true });
}
