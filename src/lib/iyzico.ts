/**
 * iyzico client — SERVER ONLY (reads the secret key). Never import this from
 * a client component.
 *
 * Dependency-free implementation of the two Checkout Form calls SVELA needs,
 * authenticated with IYZWSv2:
 *
 *   signature     = hex(HMAC-SHA256(secretKey, randomKey + uriPath + body))
 *   Authorization = "IYZWSv2 " + base64("apiKey:" + apiKey + "&randomKey:" + randomKey + "&signature:" + signature)
 *   x-iyzi-rnd    = randomKey
 *
 * The exact JSON string that is signed is the one sent.
 *
 * Env: IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL
 * (sandbox https://sandbox-api.iyzipay.com — the default — or production
 * https://api.iyzipay.com).
 */
import { createHmac, randomBytes } from "node:crypto";

export const IYZICO_SANDBOX_URL = "https://sandbox-api.iyzipay.com";
export const IYZICO_PRODUCTION_URL = "https://api.iyzipay.com";

const INITIALIZE_PATH = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
const RETRIEVE_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail";
const TIMEOUT_MS = 15_000;

/* ── Types ─────────────────────────────────────────────────── */

export type IyzicoLocale = "en" | "tr";
export type IyzicoCurrency = "TRY" | "EUR" | "USD" | "GBP" | "IRR" | "NOK" | "RUB" | "CHF";

export interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  gsmNumber?: string;
  email: string;
  identityNumber: string;
  lastLoginDate?: string;
  registrationDate?: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
  zipCode?: string;
}

export interface IyzicoAddress {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: "PHYSICAL" | "VIRTUAL";
  /** Line price as a decimal string, e.g. "2960.00". */
  price: string;
}

export interface CheckoutFormInitializeRequest {
  locale?: IyzicoLocale;
  conversationId?: string;
  /** Sum of basketItems prices, decimal string. */
  price: string;
  /** Amount charged (equal to price unless installments add interest). */
  paidPrice: string;
  currency: IyzicoCurrency;
  basketId: string;
  paymentGroup: "PRODUCT" | "LISTING" | "SUBSCRIPTION";
  callbackUrl: string;
  enabledInstallments?: number[];
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
}

export interface CheckoutFormRetrieveRequest {
  locale?: IyzicoLocale;
  conversationId?: string;
  token: string;
}

export interface IyzicoResponseBase {
  status: "success" | "failure" | (string & {});
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  locale?: string;
  systemTime?: number;
  conversationId?: string;
}

export interface CheckoutFormInitializeResponse extends IyzicoResponseBase {
  token?: string;
  checkoutFormContent?: string;
  tokenExpireTime?: number;
  paymentPageUrl?: string;
}

export type IyzicoPaymentStatus =
  | "SUCCESS"
  | "FAILURE"
  | "INIT_THREEDS"
  | "CALLBACK_THREEDS"
  | "BKM_POS_SELECTED"
  | "CALLBACK_PECCO"
  | (string & {});

export interface IyzicoItemTransaction {
  itemId?: string;
  paymentTransactionId?: string;
  transactionStatus?: number;
  price?: number;
  paidPrice?: number;
}

export interface CheckoutFormRetrieveResponse extends IyzicoResponseBase {
  token?: string;
  callbackUrl?: string;
  paymentStatus?: IyzicoPaymentStatus;
  paymentId?: string;
  basketId?: string;
  price?: number;
  paidPrice?: number;
  currency?: string;
  installment?: number;
  fraudStatus?: number;
  mdStatus?: number;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  binNumber?: string;
  lastFourDigits?: string;
  itemTransactions?: IyzicoItemTransaction[];
}

/* ── Config ────────────────────────────────────────────────── */

interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

function readConfig(): IyzicoConfig | null {
  const apiKey = process.env.IYZICO_API_KEY?.trim();
  const secretKey = process.env.IYZICO_SECRET_KEY?.trim();
  if (!apiKey || !secretKey) return null;
  const baseUrl = (process.env.IYZICO_BASE_URL?.trim() || IYZICO_SANDBOX_URL).replace(/\/+$/, "");
  return { apiKey, secretKey, baseUrl };
}

/** True when both API keys are present. */
export function isIyzicoConfigured(): boolean {
  return readConfig() !== null;
}

/* ── Signing ───────────────────────────────────────────────── */

export function createRandomKey(): string {
  return `${Date.now()}${randomBytes(6).toString("hex")}`;
}

/** IYZWSv2 Authorization header value for one request. */
export function buildAuthorization(
  apiKey: string,
  secretKey: string,
  randomKey: string,
  uriPath: string,
  body: string,
): string {
  const signature = createHmac("sha256", secretKey).update(randomKey + uriPath + body).digest("hex");
  const auth = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  return `IYZWSv2 ${Buffer.from(auth, "utf8").toString("base64")}`;
}

/* ── Money ─────────────────────────────────────────────────── */

/** Integer minor units (cents/kuruş) for a decimal amount. */
export function toMinor(amount: number): number {
  return Math.round(amount * 100);
}

/** iyzico price string from minor units: 148000 → "1480.00". */
export function formatMinor(minor: number): string {
  if (!Number.isSafeInteger(minor) || minor < 0) throw new RangeError("Invalid amount");
  const whole = Math.floor(minor / 100);
  const frac = String(minor % 100).padStart(2, "0");
  return `${whole}.${frac}`;
}

/* ── Transport ─────────────────────────────────────────────── */

export class IyzicoError extends Error {
  readonly httpStatus: number | undefined;
  constructor(message: string, httpStatus?: number) {
    super(message);
    this.name = "IyzicoError";
    this.httpStatus = httpStatus;
  }
}

async function post<T extends IyzicoResponseBase>(path: string, payload: object): Promise<T> {
  const cfg = readConfig();
  if (!cfg) throw new IyzicoError("iyzico is not configured");

  const body = JSON.stringify(payload);
  const randomKey = createRandomKey();

  let res: Response;
  try {
    res = await fetch(cfg.baseUrl + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: buildAuthorization(cfg.apiKey, cfg.secretKey, randomKey, path, body),
        "x-iyzi-rnd": randomKey,
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const reason = err instanceof Error ? `${err.name}: ${err.message}` : "network error";
    throw new IyzicoError(`iyzico request failed (${reason})`);
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new IyzicoError(`iyzico returned a non-JSON response (HTTP ${res.status})`, res.status);
  }
  if (!data || typeof data !== "object" || typeof (data as IyzicoResponseBase).status !== "string") {
    throw new IyzicoError(`iyzico returned an unexpected response (HTTP ${res.status})`, res.status);
  }
  return data as T;
}

/* ── API ───────────────────────────────────────────────────── */

/** Start a hosted Checkout Form session; returns token + paymentPageUrl. */
export function initializeCheckoutForm(req: CheckoutFormInitializeRequest): Promise<CheckoutFormInitializeResponse> {
  return post<CheckoutFormInitializeResponse>(INITIALIZE_PATH, req);
}

/** Read the result of a Checkout Form session from the callback token. */
export function retrieveCheckoutForm(req: CheckoutFormRetrieveRequest): Promise<CheckoutFormRetrieveResponse> {
  return post<CheckoutFormRetrieveResponse>(RETRIEVE_PATH, { locale: "en", ...req });
}
