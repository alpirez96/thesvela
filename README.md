# SVELA — thesvela.vercel.app

SVELA Portable marine lantern sitesi. Next.js 16 (App Router) + TypeScript, Vercel'de yayınlanır.
Ödeme: **iyzico Checkout Form** (iyzico'nun barındırdığı güvenli ödeme sayfası).

Mimari ve tasarım kuralları için: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Satın alma akışı

1. **ADD TO BAG** → ürün sepete eklenir, sepet çekmecesi açılır.
2. **BUY NOW** → `/checkout` (iletişim + teslimat bilgileri).
3. **PROCEED TO PAYMENT** → sunucu fiyatı `src/lib/product.ts`'ten yeniden hesaplar, iyzico'da ödeme
   formunu başlatır ve tarayıcıyı iyzico ödeme sayfasına yönlendirir.
4. iyzico ödeme sonucunu `/api/iyzico/callback`'e gönderir → sonuç doğrulanır →
   `/order/success` veya `/order/failed`.

Siparişler iyzico üye işyeri panelinde görünür (sitede veritabanı yok).

## Yerelde çalıştırma

```bash
npm install
cp .env.example .env.local   # anahtarları doldurun
npm run dev                  # http://localhost:3000
```

## Ortam değişkenleri (Vercel → Project → Settings → Environment Variables)

| Değişken | Açıklama |
| --- | --- |
| `IYZICO_API_KEY` | iyzico API anahtarı |
| `IYZICO_SECRET_KEY` | iyzico güvenlik anahtarı |
| `IYZICO_BASE_URL` | Test: `https://sandbox-api.iyzipay.com` · Canlı: `https://api.iyzipay.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://thesvela.vercel.app` (iyzico dönüş adresi bundan üretilir) |
| `RESEND_API_KEY` | (opsiyonel) iletişim formu e-postaları için |
| `ENQUIRY_TO_EMAIL` | (opsiyonel) iletişim formunun gideceği adres |
| `ENQUIRY_FROM_EMAIL` | (opsiyonel) gönderici, ör. `SVELA <hello@thesvela.com>` |

Anahtarlar olmadan site açılır; ödeme adımı "Payments are not configured yet." der.

## Fiyat / para birimi

`src/lib/product.ts` → `unitPrice` ve `currency`. Varsayılan tasarımdaki gibi **€ 1.480**.
iyzico hesabınızda EUR tahsilat açık değilse `currency: "TRY"` ve TL fiyatı girin.

## Vercel'e bağlama (thesvela.vercel.app)

1. Vercel → mevcut **thesvela** projesi → **Settings → Git → Connect Git Repository** →
   `alpirez96/thesvela`.
2. **Settings → Git → Production Branch**: `main`.
3. Ortam değişkenlerini ekleyin, ardından **Deployments → Redeploy**.

Framework preset otomatik olarak **Next.js** algılanır; ek ayar gerekmez.
