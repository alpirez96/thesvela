"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "./product";

/** What is stored and sent to the server: ids and quantities only. */
export interface CartLine {
  id: string;
  qty: number;
}

export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  /** True once the bag has been read from storage (avoids SSR flashes). */
  ready: boolean;
  lines: CartLine[];
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (id: string, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const STORAGE_KEY = "svela.bag.v1";
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

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(sanitize(JSON.parse(raw)));
    } catch {
      /* storage unavailable — start empty */
    }
    setReady(true);
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
    const items: CartItem[] = [];
    for (const l of lines) {
      const product = getProduct(l.id);
      if (product) items.push({ ...l, product, lineTotal: product.unitPrice * l.qty });
    }
    return {
      ready,
      lines,
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open,
      close,
    };
  }, [lines, ready, isOpen, add, setQty, remove, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
