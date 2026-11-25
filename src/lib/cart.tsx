"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "./product";
import { isSaleCurrency, unitPriceIn, type RateInfo, type SaleCurrency } from "./pricing";

/** What is stored and sent to the server: ids and quantities only. */
export interface CartLine {
  id: string;
  qty: number;
}

export interface CartItem extends CartLine {
  product: Product;
  /** Unit price in the active currency. */
  unitPrice: number;
  /** unitPrice × qty in the active currency. */
  lineTotal: number;
}

interface CartContextValue {
  /** True once the bag has been read from storage (avoids SSR flashes). */
  ready: boolean;
  lines: CartLine[];
  items: CartItem[];
  count: number;
  /** Sum of line totals in the active currency. */
  subtotal: number;
  /** Active currency (falls back to EUR while no EUR/TRY rate is known). */
  currency: SaleCurrency;
  setCurrency: (c: SaleCurrency) => void;
  /** Today's EUR/TRY rate, or null if not loaded / unavailable. */
  rate: RateInfo | null;
  /** True when TRY can be offered (a rate is known). */
  tryAvailable: boolean;
  /** Unit price of any product in the active currency. */
  priceOf: (product: Product) => number;
  add: (id: string, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const STORAGE_KEY = "svela.bag.v1";
const CURRENCY_KEY = "svela.currency.v1";
const CartContext = createContext<CartContextValue | null>(null);

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const l of raw) {
    if (!l || typeof l !== "object") continue;
    const { id, qty } = l as Record<string, unknown>;
    if (typeof id !== "string" || typeof qty !== "number") continue;
    const p = getProduct(id);
    if (!p) continue;
    const q = Math.max(1, Math.min(p.maxQty, Math.floor(qty)));
    if (!out.some((o) => o.id === id)) out.push({ id, qty: q });
  }
  return out;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [wanted, setWanted] = useState<SaleCurrency>("EUR");
  const [rate, setRate] = useState<RateInfo | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(sanitize(JSON.parse(raw)));
      const cur = window.localStorage.getItem(CURRENCY_KEY);
      if (isSaleCurrency(cur)) setWanted(cur);
    } catch {
      /* storage unavailable — start empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const ctl = new AbortController();
    fetch("/api/rates", { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { TRY?: number; source?: string; date?: string } | null) => {
        if (d && typeof d.TRY === "number" && d.TRY > 0) {
          setRate({ rate: d.TRY, source: d.source ?? "", date: d.date ?? "" });
        }
      })
      .catch(() => {
        /* no rate → EUR only */
      });
    return () => ctl.abort();
  }, []);

  const setCurrency = useCallback((c: SaleCurrency) => {
    setWanted(c);
    try {
      window.localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback((id: string, qty: number) => {
    const p = getProduct(id);
    if (!p) return;
    setLines((ls) => {
      const cur = ls.find((l) => l.id === id);
      if (cur) return ls.map((l) => (l.id === id ? { ...l, qty: Math.min(p.maxQty, l.qty + qty) } : l));
      return [...ls, { id, qty: Math.max(1, Math.min(p.maxQty, qty)) }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const p = getProduct(id);
    if (!p) return;
    setLines((ls) =>
      qty < 1 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(p.maxQty, qty) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => setLines((ls) => ls.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const tryAvailable = rate !== null;
    const currency: SaleCurrency = wanted === "TRY" && !tryAvailable ? "EUR" : wanted;
    const priceOf = (product: Product) => unitPriceIn(product, currency, rate?.rate) ?? product.unitPrice;
    const items: CartItem[] = [];
    for (const l of lines) {
      const product = getProduct(l.id);
      if (!product) continue;
      const unitPrice = priceOf(product);
      items.push({ ...l, product, unitPrice, lineTotal: unitPrice * l.qty });
    }
    return {
      ready,
      lines,
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      currency,
      setCurrency,
      rate,
      tryAvailable,
      priceOf,
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open,
      close,
    };
  }, [lines, ready, isOpen, wanted, rate, setCurrency, add, setQty, remove, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
