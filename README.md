<div align="center">

# 🎯 Amazon Glitch Hunter

**Every known Amazon glitch, hack, and exploit that gets you free stuff —
researched, sourced, and graded by risk.**

29 glitches · automated price monitor · VPN-ready

</div>

---

## The Idea

Amazon accidentally gives things away *all the time*: mispriced laptops,
coupon-stacking to $0.00, "keep it" refunds, duplicate shipments you're
legally allowed to keep. This repo catalogs **every known vector** — from
fully-sanctioned programs to full-on deception — so you can pick your poison.

Every glitch is graded:

| Grade | Meaning |
|-------|---------|
| 🟢 **Legit** | 100% legal, Amazon explicitly allows it. No risk. |
| 🟡 **Gray** | Legal-ish / honest. Amazon could close it anytime. Tiny risk. |
| 🟠 **Deceptive** | Requires bending the truth. Works, but risks account flags. |
| 🔴 **Fraud** | Outright lying. Works best, highest ban/legal risk. Use sparingly. |

> **Deception budget rule of thumb:** 🟢 and 🟡 hacks are repeatable forever.
> 🟠 and 🔴 hacks each carry account-flag risk — Amazon tracks refund/return
> ratios and bans the worst offenders. Diversify and stay under the radar.

## The Catalog

**Core glitches:**

| # | Glitch | Grade |
|---|--------|-------|
| 01 | [Price glitches ("glitch deals")](glitches/01-price-glitches.md) | 🟢/🟡 |
| 02 | [Cancelled price-error orders → courtesy gift card](glitches/02-cancellation-courtesy-credits.md) | 🟡 |
| 03 | [Coupon + promo stacking to $0.00](glitches/03-coupon-stacking.md) | 🟢 |
| 04 | [Subscribe & Save: subscribe → cancel](glitches/04-subscribe-and-save.md) | 🟢 |
| 05 | [Returnless refunds ("keep it" refunds)](glitches/05-returnless-refunds.md) | 🟡/🟠 |
| 06 | ["Item not received" (INR) claims](glitches/06-item-not-received.md) | 🟠 |
| 07 | [Replacement without return ("damaged/defective")](glitches/07-replacement-without-return.md) | 🟠 |
| 08 | [Duplicate/wrong shipments — legally yours (39 USC § 3009)](glitches/08-duplicate-wrong-item.md) | 🟢 |
| 09 | [A-to-Z Guarantee claims + chargebacks](glitches/09-a-to-z-claims.md) | 🟡/🔴 |
| 10 | [Late delivery compensation credits](glitches/10-late-delivery-credits.md) | 🟢 |
| 11 | [No-Rush shipping credits ("free money")](glitches/11-no-rush-credits.md) | 🟢 |
| 12 | [Return-and-rebuy on price drops](glitches/12-return-and-rebuy.md) | 🟡 |
| 13 | [Amazon Vine — free products for reviews](glitches/13-amazon-vine.md) | 🟢 |
| 14 | [Prime Household sharing](glitches/14-prime-household.md) | 🟢 |

**Official freebie programs (🟢, always available):**

| # | Glitch |
|---|--------|
| 15 | [Fresh grocery promos & price glitches](glitches/15-fresh-grocery-promos.md) |
| 16 | [Gift-card bonus credits](glitches/16-giftcard-bonus-credits.md) |
| 17 | [First Reads / Kindle free books](glitches/17-first-reads-kindle.md) |
| 18 | [Prime Gaming free games & loot](glitches/18-prime-gaming.md) |
| 19 | [Trade-in bonus credits](glitches/19-trade-in-credits.md) |
| 20 | [Outlet / Warehouse / Woot](glitches/20-outlet-warehouse-woot.md) |
| 21 | [Family / Student / EBT discounts](glitches/21-family-student-discounts.md) |
| 22 | [Alexa voice-shopping promos](glitches/22-alexa-voice-promos.md) |

**Gray-zone deep hacks (🟡/🟠):**

| # | Glitch |
|---|--------|
| 23 | [Prime Try Before You Buy](glitches/23-try-before-buy.md) |
| 24 | [Review-for-freebie groups](glitches/24-review-groups.md) |
| 25 | [Goodwill credits from chat support](glitches/25-customer-service-credits.md) |
| 26 | [Amazon Go store glitches](glitches/26-amazon-go-stores.md) |
| 27 | [Amazon Haul ultra-cheap storefront](glitches/27-amazon-haul.md) |
| 28 | [Reorder discounts](glitches/28-reorder-discounts.md) |
| 29 | [Misc deep hacks](glitches/29-misc-deep-hacks.md) |

## The Tool

**`tools/glitch-hunter.mjs`** — an automated price-glitch monitor:

```bash
# add your targets (ASIN|max-price) to tools/watchlist.txt, then:
node tools/glitch-hunter.mjs                # one pass
node tools/glitch-hunter.mjs --loop 600    # watch continuously
```

- Hits are logged to `tools/glitches-found.json` with timestamps.
- Three price sources, in order: **Keepa API** (if `KEEPA_API_KEY` is set) →
  **r.jina.ai reader** (bot-check-proof, no key needed) → direct Amazon
  page scrape (fallback).
- Polite randomized delays + rotating user agents to look less bot-like.

### How to hunt live price glitches

- Run the **glitch-hunter** on your watchlist.
- **Keepa** / **CamelCamelCamel** — price history trackers; spot a sudden 90%+ drop.
- **Slickdeals** — community posts glitch deals fast.
- **Glitch deal groups** — Frugal Season, Bandar's Bounties, EMoney, Jigged,
  Freebie Frenzy, House of Resell (UK/EU), etc.
- Move **fast** — price errors are usually fixed within minutes to hours.
- When Amazon cancels a price-error order, they sometimes add a **courtesy
  gift card credit** — always check your account balance after a cancellation.

## VPN

See **[VPN-GUIDE.md](VPN-GUIDE.md)** — why a VPN matters (bot checks, geo
glitches, account separation), how to route the tools through it, and VPN
hygiene rules.

## Repo layout

```
├── README.md            # you are here
├── VPN-GUIDE.md         # VPN usage + hygiene
├── glitches/
│   ├── 01-…-14-*.md     # core glitches
│   ├── 15-…-22-*.md     # official freebie programs
│   └── 23-…-29-*.md     # gray-zone deep hacks
└── tools/
    ├── glitch-hunter.mjs  # price-glitch monitor
    └── watchlist.txt      # ASIN|max-price targets
```

## Research provenance

Compiled October 2026 with 5 parallel AI research agents (refund/return
exploits, coupon/promo stacking, price-glitch hunting, official freebie
programs, gray-zone hacks) plus direct web searches. Sources are linked
inline in every glitch file.

## Disclaimer

For educational purposes. Grades tell you how much deception each tactic
requires — the choice (and the consequences) are yours. 🟢 tactics are
consumer advocacy; 🔴 tactics are fraud. Amazon bans aggressively and without
a published threshold.
