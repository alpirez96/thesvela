# SVELA — site architecture

Next.js 16 (App Router, TypeScript), deployed on Vercel. No database: orders
live in the iyzico merchant panel.

## Layout

```
src/
  app/
    layout.tsx            fonts (next/font), CartProvider, CartDrawer, Cursor
    globals.css           design tokens + shared primitives (.sv-label, .sv-btn, .sv-in, chrome)
    page.tsx              landing page — composes the five sections
    checkout/page.tsx     buyer + delivery form → POST /api/checkout → iyzico
    order/success/        payment confirmed (clears the bag)
    order/failed/         payment failed / cancelled
    api/checkout/         initialise iyzico Checkout Form, return paymentPageUrl
    api/iyzico/callback/  iyzico POSTs the token here → retrieve result → 303 redirect
    api/enquiry/          contact form (email via Resend when configured)
  components/
    chrome/               SiteChrome (header, rail, counter), Cursor
    sections/             Hero, WaysToUse, Aboard, Lantern, Close
    commerce/             CartDrawer, CheckoutForm, ...
  lib/
    product.ts            catalog — the only source of prices
    cart.tsx              bag state (localStorage), drawer open/close
    format.ts             "€ 1.480" price formatting
    iyzico.ts             IYZWSv2-signed client (initialize / retrieve)
  styles/
    landing.css           section styles
    commerce.css          drawer / checkout / order styles
```

## Purchase flow

1. **ADD TO BAG** (Lantern section) → `cart.add()` → header pill shows `RESERVE (n)` and the bag drawer opens.
2. **BUY NOW** in the drawer → `/checkout`.
3. Checkout form → `POST /api/checkout` with `{ lines: [{id, qty}], buyer: {...} }`.
   The server re-prices from `lib/product.ts`, calls iyzico
   `/payment/iyzipos/checkoutform/initialize/auth/ecom` and returns `paymentPageUrl`.
4. Browser goes to iyzico's hosted payment page.
5. iyzico POSTs `token` to `/api/iyzico/callback?order=<id>`; the server calls
   `/payment/iyzipos/checkoutform/auth/ecom/detail`, checks `paymentStatus === "SUCCESS"`
   and that `basketId` matches, then redirects to `/order/success` or `/order/failed`.

## Design rules (from SVELA Design System v6)

- Two themes only: abyss (`#0B1117`, fg linen, accent brass) and linen (fg ink, accent brass-deep).
- Brass marks action and the italic tail. Figures are always mono (IBM Plex Mono).
- Display type: Jost 200, uppercase, +0.04em. Italic tail: Cormorant Garamond 300 italic, brass.
- Motion: ease-out `cubic-bezier(.22,1,.36,1)`, 250–300ms hover, 900ms intro. No springs.
- Under 900px the centre nav is hidden.

## Environment variables

See `.env.example`.
