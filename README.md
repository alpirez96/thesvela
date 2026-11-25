# SVELA — thesvela-ten.vercel.app

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
| `NEXT_PUBLIC_SITE_URL` | `https://thesvela-ten.vercel.app` (iyzico dönüş adresi bundan üretilir; özel alan adına geçince güncelleyin) |
| `EUR_TRY_FALLBACK_RATE` | (opsiyonel) TCMB ve ECB'ye ulaşılamazsa kullanılacak kur, ör. `55.30` |
| `RESEND_API_KEY` | (opsiyonel) iletişim formu e-postaları için |
| `ENQUIRY_TO_EMAIL` | (opsiyonel) iletişim formunun gideceği adres |
| `ENQUIRY_FROM_EMAIL` | (opsiyonel) gönderici, ör. `SVELA <hello@thesvela.com>` |

Anahtarlar olmadan site açılır; ödeme adımı "Payments are not configured yet." der.

## Fiyat / para birimi

Fiyat **EUR** olarak `src/lib/product.ts` → `unitPrice` alanında tutulur (tasarımdaki gibi **€ 1.480**).
Ziyaretçi fiyatın yanındaki **EUR / TRY** anahtarıyla TL'ye geçebilir: TL fiyatı EUR fiyata
endekslidir — TCMB günlük EUR **döviz satış** kuru × EUR fiyat, tam liraya yukarı yuvarlanır
(TCMB'ye ulaşılamazsa ECB kuru, o da yoksa `EUR_TRY_FALLBACK_RATE`). Kur 1 saat önbelleğe alınır;
ödeme tutarı sunucuda yeniden hesaplanır ve iyzico'ya seçilen para biriminde gönderilir.

EUR ile tahsilat için iyzico üye işyeri hesabınızda yabancı para birimi (EUR) açık olmalıdır.

## Vercel

Proje `alpirez96/thesvela` reposuna bağlı (https://thesvela-ten.vercel.app). Production,
repodaki **varsayılan branch**'ten (Settings → Git → Production Branch) yayınlanır; o branch'e
her push otomatik deploy tetikler. Framework preset: **Next.js** (otomatik algılanır).

Ortam değişkenlerini ekledikten / değiştirdikten sonra **Deployments → Redeploy** yapın.
