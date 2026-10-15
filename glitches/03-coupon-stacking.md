# Glitch 03 — Coupon + promo stacking to $0.00 🟢

**Category:** Checkout math + seller misconfiguration
**Effort:** Low — clip, enter, subscribe
**Risk:** None. Clipping public coupons is not a ToS violation.

## How it works

Amazon applies discounts **sequentially**, each layer taking its cut of what's
left:

```
list price → sale/deal price → clippable coupon → promo code → Subscribe & Save
```

The "glitch" happens when a seller configures a big coupon (say 40% off)
expecting it to apply to list price — but the item is already on a deep sale.
The coupon takes 40% off the **already-reduced** price. Allowed combos:
sale + coupon + S&S; sale + promo code (one only). **Not** allowed: two
promo codes, two clippable coupons.

## Worked examples

- $49.99 earbuds → 40% sale ($29.99) → 25% coupon ($22.49) → 15% S&S
  (**$19.12**, 62% off)
- A **3D wooden puzzle hit $0.00** (coupon stacked on a promotion — orders shipped)
- Diamond ring $1,166 → **$42.66** (coupon discounted the inflated list price)
- Clippable 50% coupon on a 60%-off item + 15% S&S brought a $45 product
  under $2
- A "$5 off $15" promo that applied **multiple times across smaller
  purchases**, driving totals to $0 (misconfigured "Multiple Item Discount")
- A "Buy 2 Get 1 Free" misconfigured so you could **buy only one and still
  get one free** — or the buy-1-get-4-free bug (Xbox consoles/iPads for $0.99)

## Reliability rules (community-verified)

1. **S&S-ordered glitches ship most often** — fewer pricing checkpoints in the
   Subscribe & Save pipeline.
2. **Sold-by-Amazon (FBA) items are honored at a much higher rate** than
   third-party-seller items.
3. Deals over ~70–80% total discount, or viral deals, get cancelled —
   correction window is **30 min – 4 h**.
4. Amazon Warehouse/Renewed items (sold by Amazon) with glitch prices are
   honored at a high rate (see
   [04-subscribe-and-save.md](04-subscribe-and-save.md) notes).
5. Buy 1–2 units. Reseller quantities trigger cancellations + account flags.

## Sources

- Coupon stacking mechanics: https://errorempire.com/us/guides/coupon-stacking-glitch-deals-how-they-work
- 100%-off coupon errors: https://errorempire.com/us/guides/coupon-glitches-100-percent-off-errors
- Stacking how-to: https://scanandsaveit.com/blog/stack-amazon-coupons-subscribe-save
- Whop glitch guide (free 3D puzzle example): https://whop.com/blog/amazon-glitch-deals
- BOGO/multi-item promo bugs (CTOL): https://www.ctol.digital/news/amazon-promo-glitches-free-products-system-complexity/
- Free product offer claim flow (official): https://www.amazon.com/gp/help/customer/display.html?nodeId=GJSUKJQAGWD9G9DB
- Multiple item discount T&Cs: https://www.amazon.com/gp/help/customer/display.html?nodeId=201895200
