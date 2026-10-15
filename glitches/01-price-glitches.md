# Glitch 01 — Price glitches ("glitch deals") 🟢/🟡

**Category:** Accidental prices far below market value, valid at checkout
**Effort:** Medium — monitoring + speed
**Risk:** Low. Buying at an offered price is fully legal; Amazon just may cancel.

## How price glitches happen

- **Repricer misconfiguration** — third-party sellers run algorithmic repricing
  software; a bad min-price rule drives the live price to the floor
  ([SellerLogic](https://www.sellerlogic.com/en/blog/amazon-price-glitch),
  [Repricer.com](https://support.repricer.com/potential-pricing-errors)).
- **Manual/decimal errors** — €0.10 instead of €10.00 typed into Seller Central.
- **Price-sync errors between channels** — multichannel listing software
  (Amazon + eBay + Shopify) overwrites a correct price; sometimes defaults to
  $0.01. Also: a third-party seller misprices, Amazon's price-match algorithm
  drops its own price to match, leaving a ~10–15 minute window before
  correction ([Blippr](https://blippr.com/blog/ultimate-guide-to-glitch-deals)).
- **Promo template bugs** — e.g. the 2019 Prime Day glitch where a flat
  **$94.48** price applied to every Prime-Day-tagged item on some accounts.
- **Coupon/promo stacking errors** — see
  [03-coupon-stacking.md](03-coupon-stacking.md).

## How to hunt them

| Tool | Notes |
|------|-------|
| **Slickdeals** | The classic public aggregator; 2019 camera glitch was posted there ~10 min after Prime Day started |
| **Reddit** (r/deals, r/amazonprime, r/Flipping) | Glitches caught within minutes; thread dead by ~100 comments |
| **Keepa / CamelCamelCamel** | Price-history graphs — a sudden cliff = error; set drop alerts |
| **Paid glitch groups** (Whop/Discord/Telegram) | Frugal Season, Bandar's Bounties, EMoney, Jigged, Freebie Frenzy, House of Resell (UK/EU), etc. — custom real-time monitors, aimed at resellers ([Whop top communities](https://whop.com/blog/finding-amazon-glitch-deals)) |
| **X/Twitter + Instagram** | @Pricerrors (268k followers), @GlitchedDeals |
| **Facebook groups / DealNews** | Slower, but DealNews archives show *when* retailers glitch |

## Notable historical glitches

- **July 2019 Prime Day camera glitch** — every Prime-Day item rang up at
  exactly **$94.48**: $548 Sony a6000 bundles, $2,799 Canon 5D Mark IV,
  ~$3,000 telescopes, even ~$13,000 pro kits. Lasted ~30 minutes; Amazon
  honored at least some orders
  ([CBS News](https://www.cbsnews.com/news/some-prime-day-glitch-thousands-of-dollars-worth-of-camera-equipment-sold-for-just-94),
  [Reddit](https://www.reddit.com/r/amazonprime/comments/cdkad6/i_somehow_got_a_3000_camera_for_94_on_prime_day)).
- **$5 HP Victus gaming laptop** ($900 retail) — EMoney group, members bought up to 10 ([Whop](https://whop.com/blog/amazon-glitch-deals/)).
- **MSI gaming laptop $279.99** (~$1,000 retail) — Frugal Season group; a Sept 2026 echo had a $109.99 MSI laptop (skeptics noted the ASIN mapped to a monitor — a classic hazard).
- **Other Whop-ecosystem examples**: Canon EOS Rebel $730→$56; diamond ring $1,166→$42.66; Intel i5 $500→$50; 2oz gold coin $5,500→$760; £2,000 massage chair for £1; thermal camera $9,000+ for **$0.10**.
- **2019 high-end camera gear for ~$94** (lenses/tripods normally $13,000+) — separate repricing error, active for hours ([Medium](https://medium.com/@docholiday4/the-wild-world-of-price-glitches-how-they-happen-and-how-to-catch-them-first-92e424e40684)).
- **Non-Amazon context** (for pattern study): Microsoft Office ¥10 Japan 2009 (cancelled), Walmart PS4 $99 (2013), United $59 Hawaii fares (2018, honored), Lenovo mispriced laptops (compensated with credits), Amazon UK air fryer £3.99 (2021, cancelled).

## What happens after you order

- **Amazon has no obligation to honor price errors.** Conditions of Use
  reserves the right to cancel; no charge until shipment, so no binding
  contract until it ships ([TermsFeed](https://www.termsfeed.com/blog/pricing-mistakes-cancel-order)).
- **Usual outcome: cancellation + refund** (3–5 business days). Amazon
  "almost never honors" catastrophic glitches but often lets minor ones ship.
- **Third-party-seller glitches**: sellers are pressured to honor the price
  (Amazon penalizes their cancellation rate), but small sellers cancel anyway.
- **Sometimes they ship anyway** — 2019 camera glitch orders were fulfilled.

## Rules of the game

1. **Buy 1–2 units only.** Bulk buys and multi-account abuse get orders
   cancelled and accounts flagged.
2. **Move fast** — windows are minutes to hours.
3. **Check the ASIN** — glitch listings sometimes map to the wrong product
   entirely (the $109.99 "MSI laptop" that was actually a monitor).
4. **After a cancellation, ask chat support for a courtesy/promo credit** —
   granted case-by-case (~$5), never guaranteed. Documented example: the
   $20-gift-card-for-$15 mistake in Aug 2022 where Amazon issued $5
   gift-card credits per account
   ([Doctor of Credit](https://www.doctorofcredit.com/price-mistake-amazon-20-amazon-giftcard-for-15)).
   See [02-cancellation-courtesy-credits.md](02-cancellation-courtesy-credits.md).
