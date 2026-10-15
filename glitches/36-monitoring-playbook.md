# Glitch 36 — The monitoring playbook 🟢

**Category:** Automation for catching glitches in minutes, not days
**Effort:** 30-minute setup
**Risk:** None — reading prices is legal everywhere.

Glitch windows are ~5–30 minutes (see the [trophy wall](34-glitch-history-archive.md)).
This is the stack that puts you inside the window.

## 1. Keepa alerts 🟢

Keepa tracks 2B+ products across **11 marketplaces** with ~15-minute data
refresh. Free tier: track products, price-drop alerts, browser extension
charts. Set a target price on a wishlisted item and get email/browser push —
**Telegram alerts** are the killer feature for speed. Premium adds full sales
rank history and the API (see §5). Mobile app + extension both work.

- Keepa: https://keepa.com
- Alert channels & marketplaces: https://keepa.com/
- Play Store (marketplace list): https://play.google.com/store/apps/details?id=com.keepa.mobile&hl=en_US

## 2. CamelCamelCamel watchlists 🟢

Free, no app, email-only alerts — slower than Keepa but zero cost and a
cleaner price-history view for verifying "all-time low" before you pounce. Use
CCC for history, Keepa for speed.

- Comparison (alert channels): https://www.informedrepricer.com/blog/camelcamelcamel-vs-keepa-which-is-better-for-amazon-price-tracking
- CCC: https://camelcamelcamel.com

## 3. Slickdeals + community alerts 🟢

Slickdeals **Deal Alerts** (keyword + store filter, e.g. `amazon + glitch` or
an ASIN) email/push you the moment a thread is posted — this is literally how
the $94.48 glitch spread. Slickdeals Live shows trending deals in real time.
Follow @Pricerrors on X and the deal groups ([Glitch 35](35-coupon-aggregators.md))
for 24/7 human coverage.

- Slickdeals alerts: https://slickdeals.net/
- Slickdeals Live + trending: https://slickdeals.net

## 4. Telegram / Discord glitch bots & channels 🟢

Keepa's native Telegram alerts cover watchlist items. For everything else,
Discord servers (Slickdeals runs one) and Telegram channels run by the glitch
groups and price-error accounts push deals within minutes of discovery; some
paid groups (Frugal Season, EMoney) use bots + software to snipe within the
5-minute windows. Cheapest version: X app with @Pricerrors notifications on,
plus a Discord with #amazon-glitches channels you trust.

- Keepa Telegram alerts: https://keepa.com/
- Slickdeals Discord: https://slickdeals.net
- Group/bot scene overview: https://whop.com/blog/amazon-glitch-deals

## 5. This repo's glitch-hunter.mjs 🟢

`tools/glitch-hunter.mjs` automates the ASIN-watchlist layer locally:
`ASIN|max-price` lines in `tools/watchlist.txt`, then
`node tools/glitch-hunter.mjs --loop 600`. Price sources: Keepa API (if
`KEEPA_API_KEY` is set) → r.jina.ai reader → direct scrape; hits logged to
`tools/glitches-found.json`. Use it as your *personal* long-tail monitor for
specific items you actually want, while Keepa/Telegram/Slickdeals cover the
broad market. Route it through a VPN (see [VPN-GUIDE.md](../VPN-GUIDE.md)) to
dodge bot checks and watch foreign marketplaces ([Glitch 30](30-international-stores.md)).

- Tool source: ../tools/glitch-hunter.mjs
- Keepa API: https://keepa.com

## The stack, in one line

CCC for history → Keepa (Telegram) + `glitch-hunter.mjs` for your watchlist →
Slickdeals/X/Discord alerts for market-wide glitches → buy within minutes →
if canceled, check for courtesy credits ([Glitch 02](02-cancellation-courtesy-credits.md)).
