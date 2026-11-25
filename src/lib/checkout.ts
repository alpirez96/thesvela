/**
 * Buyer details for checkout — shared by the checkout form (inline errors)
 * and /api/checkout (the authoritative check). Pure: no Node or DOM APIs.
 */
import { getCountry } from "./countries";

export interface BuyerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  identityNumber: string;
}

export type BuyerField = keyof BuyerInput;
export type BuyerErrors = Partial<Record<BuyerField, string>>;

export const BUYER_FIELDS: readonly BuyerField[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "city",
  "zipCode",
  "country",
  "identityNumber",
];

export const BUYER_MAX: Record<BuyerField, number> = {
  firstName: 50,
  lastName: 50,
  email: 254,
  phone: 24,
  address: 250,
  city: 60,
  zipCode: 12,
  country: 60,
  identityNumber: 20,
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u001f\u007f]/g;

/** Trim, drop control characters and collapse runs of whitespace. */
export function cleanText(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(CONTROL_RE, " ").replace(/\s+/g, " ").trim();
}

/**
 * Normalise a phone number to "+<digits>" (E.164-ish). Local numbers get the
 * delivery country's calling code (and lose a leading trunk 0, except Italy).
 * Returns null when it cannot be a phone number.
 */
export function normalizePhone(raw: string, country: string): string | null {
  const s = raw.trim();
  if (!/^\+?[\d\s().\-/]+$/.test(s)) return null;
  const digits = s.replace(/\D/g, "");
  let intl: string;
  if (s.startsWith("+")) {
    intl = digits;
  } else if (digits.startsWith("00")) {
    intl = digits.slice(2);
  } else {
    const dial = getCountry(country)?.dial;
    if (!dial) intl = digits;
    else if (!digits.startsWith("0") && digits.startsWith(dial) && digits.length >= dial.length + 8) intl = digits;
    else intl = dial + (dial === "39" ? digits : digits.replace(/^0/, ""));
  }
  if (intl.length < 8 || intl.length > 15 || intl.startsWith("0")) return null;
  return `+${intl}`;
}

export interface BuyerCheck {
  values: BuyerInput;
  errors: BuyerErrors;
  /** Normalised phone when valid. */
  gsmNumber: string | null;
}

/** Validate raw buyer input (any shape). `errors` is empty when it passes. */
export function validateBuyer(raw: unknown): BuyerCheck {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const values = {} as BuyerInput;
  for (const f of BUYER_FIELDS) values[f] = cleanText(src[f]);
  values.email = values.email.toLowerCase();
  values.identityNumber = values.identityNumber.replace(/\s/g, "");

  const errors: BuyerErrors = {};
  const tooLong = (f: BuyerField) => {
    if (values[f].length > BUYER_MAX[f]) {
      errors[f] = `Keep this under ${BUYER_MAX[f]} characters.`;
      return true;
    }
    return false;
  };

  if (!values.firstName) errors.firstName = "Enter your first name.";
  else tooLong("firstName");

  if (!values.lastName) errors.lastName = "Enter your last name.";
  else tooLong("lastName");

  if (!values.email) errors.email = "Enter your email address.";
  else if (!tooLong("email") && !EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";

  if (!values.address) errors.address = "Enter your street address.";
  else if (!tooLong("address") && values.address.length < 5) errors.address = "Enter your full street address.";

  if (!values.city) errors.city = "Enter your city.";
  else tooLong("city");

  if (values.zipCode && !tooLong("zipCode") && !/^[A-Za-z0-9][A-Za-z0-9 -]*$/.test(values.zipCode))
    errors.zipCode = "Enter a valid postal code.";

  const country = getCountry(values.country);
  if (!country) errors.country = "Choose a country from the list.";

  let gsmNumber: string | null = null;
  if (!values.phone) errors.phone = "Enter your phone number.";
  else if (!tooLong("phone")) {
    gsmNumber = normalizePhone(values.phone, values.country);
    if (!gsmNumber) errors.phone = "Enter a valid phone number, ideally with country code.";
  }

  if (values.identityNumber && !tooLong("identityNumber")) {
    if (values.country === "Turkey") {
      if (!/^[1-9]\d{10}$/.test(values.identityNumber)) errors.identityNumber = "TC Kimlik No has 11 digits.";
    } else if (!/^[A-Za-z0-9]{5,20}$/.test(values.identityNumber)) {
      errors.identityNumber = "Enter a valid ID number, or leave it blank.";
    }
  }

  return { values, errors, gsmNumber: errors.phone ? null : gsmNumber };
}
