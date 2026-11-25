"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";

/** Empties the bag (and the checkout draft) once, after a confirmed payment. */
export function ClearBag() {
  const { ready, clear } = useCart();
  const done = useRef(false);

  useEffect(() => {
    // Wait for the bag to load from storage, or the load would refill it.
    if (!ready || done.current) return;
    done.current = true;
    clear();
    try {
      window.sessionStorage.removeItem("svela.checkout.v1");
    } catch {
      /* ignore */
    }
  }, [ready, clear]);

  return null;
}
