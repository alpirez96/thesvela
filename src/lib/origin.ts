/**
 * Request helpers for route handlers (server side).
 */

const HOST_RE = /^(\[[0-9a-f:.]+\]|[a-z0-9.-]+)(:\d{1,5})?$/i;
const IP_RE = /^[0-9a-f:.]{3,45}$/i;
/** iyzico's documented placeholder IP, used when the client IP is unknown. */
const FALLBACK_IP = "85.34.78.112";

function firstHeader(req: Request, name: string): string {
  return (req.headers.get(name) ?? "").split(",")[0].trim();
}

/**
 * Public origin of the site: NEXT_PUBLIC_SITE_URL when set, otherwise the
 * request's own origin (honouring x-forwarded-proto / x-forwarded-host, as
 * set by Vercel and most proxies).
 */
export function siteOrigin(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      console.error("[origin] NEXT_PUBLIC_SITE_URL is not a valid URL; falling back to the request origin");
    }
  }
  const url = new URL(req.url);
  const host = firstHeader(req, "x-forwarded-host") || firstHeader(req, "host");
  const fwdProto = firstHeader(req, "x-forwarded-proto").toLowerCase();
  const proto = fwdProto === "http" || fwdProto === "https" ? fwdProto : url.protocol.replace(":", "");
  if (host && HOST_RE.test(host)) return `${proto}://${host}`;
  return url.origin;
}

/** Best-effort client IP (first x-forwarded-for hop, then x-real-ip). */
export function clientIp(req: Request): string {
  for (const name of ["x-forwarded-for", "x-real-ip"]) {
    const v = firstHeader(req, name);
    if (v && IP_RE.test(v)) return v;
  }
  return FALLBACK_IP;
}
