# Noora Candles — Website Setup Guide

## Folder Structure

```
noora-site/
├── index.html          ← Home page (hero + quick links)
├── shop.html           ← Product grid with filters
├── about.html          ← Our Story + testimonials
├── process.html        ← Process steps + ingredients
├── contact.html        ← Contact form
│
├── css/
│   ├── global.css      ← Shared styles (nav, footer, cart, animations)
│   └── pages.css       ← Page-specific styles
│
├── js/
│   ├── products.js     ← ★ EDIT THIS: product data + image paths
│   ├── cart.js         ← Cart logic (uses localStorage)
│   ├── checkout.js     ← ★ EDIT THIS: Stripe key + UPI details
│   └── main.js         ← Initialisation, rendering
│
└── images/
    ├── hero/
    │   └── hero.jpg          ← Hero section photo
    ├── products/
    │   ├── rose-oud.jpg
    │   ├── sage-sea-salt.jpg
    │   ├── vanilla-dusk.jpg
    │   ├── marble-pillar.jpg
    │   ├── blush-garden.jpg
    │   ├── calm-gift-set.jpg
    │   ├── cedar-amber.jpg
    │   └── ivory-pillar.jpg
    ├── about/
    │   ├── about1.jpg        ← Large banner image
    │   ├── about2.jpg        ← Bottom-left image
    │   └── about3.jpg        ← Bottom-right image
    └── upi-qr.png            ← Your UPI QR code image
```

---

## Step 1 — Add Your Images

1. Put your product photos in `images/products/`
2. Put your hero photo in `images/hero/hero.jpg`
3. Put your about photos in `images/about/`
4. Put your UPI QR code in `images/upi-qr.png`

Open `js/products.js` and update the `image` path for each product:

```js
{
  id:    1,
  name:  'Rose & Oud',
  image: 'images/products/rose-oud.jpg',   // ← change filename if different
  ...
}
```

Also update the hero and about image paths at the bottom of `products.js`:

```js
const siteImages = {
  hero:   'images/hero/hero.jpg',
  about1: 'images/about/about1.jpg',
  about2: 'images/about/about2.jpg',
  about3: 'images/about/about3.jpg',
};
```

> If an image file is missing, the site automatically shows a styled emoji placeholder — no broken images.

---

## Step 2 — Update Your UPI Details

Open `js/checkout.js` and edit the `UPI_CONFIG` object at the top:

```js
const UPI_CONFIG = {
  upiId:   'yourname@upi',       // ← Your actual UPI ID
  name:    'Your Business Name', // ← Name shown to customers
  qrImage: 'images/upi-qr.png', // ← Path to your QR code image
};
```

That's it — UPI details update everywhere automatically.

---

## Step 3 — Update Product Details

Open `js/products.js` to:
- Change product names, prices, scents
- Add or remove products (copy/paste a product block)
- Update categories: `'scented'` | `'pillar'` | `'jar'` | `'gift'`

---

## Step 4 — Go Live with Stripe (Optional)

If you want real card payments:

1. Create an account at [stripe.com](https://stripe.com)
2. Go to Dashboard → Developers → API Keys
3. Copy your **Publishable Key** (`pk_live_...`)
4. Open `js/checkout.js` and replace:
   ```js
   const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE';
   ```
   with your real key.
5. Set up a backend server to create PaymentIntents (see `server.js` in the previous build, or use Stripe's hosted checkout).

> **Without a Stripe key**, the card payment runs in demo mode and simulates a successful payment — safe for testing.

---

## Step 5 — Open in Browser

Just open `index.html` in any browser. No server required for the core site.

For Stripe card payments to work fully, you'll need a local server:
```bash
# With Node.js installed:
npx serve .

# Or with Python:
python -m http.server 3000
```
Then open `http://localhost:3000`

---

## Customise Text / Colours

- **Brand colours** → `css/global.css` → `:root { }` section at the top
- **Page text** → Edit directly in each `.html` file
- **Contact email / social links** → Search for `hello@nooracandles.com` in the HTML files and replace
- **Copyright year** → Search for `© 2025` in the HTML files

---

## Cart Persistence

The cart is saved in the browser's `localStorage` — items persist across page navigation automatically.
