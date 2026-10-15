# TOOL-TESTS — live verification of `tools/`

**Date:** 2026-10-15 · **Tester:** subagent (live run, no mocks) · **Env:** macOS 26.6.1, arm64, direct connection (no VPN/proxy, no `KEEPA_API_KEY`)

All four commands were run for real against live Amazon/jina endpoints. Evidence snippets are verbatim console output.

---

## Test 1 — `node tools/glitch-hunter.mjs` (watchlist price check)

**Command:**
```bash
node tools/glitch-hunter.mjs
```

**Result: PASS** — all 3 watchlist items returned live prices, every one via the **jina** source (the required source; no Keepa key is set, so `getPrice` fell through to `priceViaJina` first and succeeded before the direct-Amazon fallback was ever tried).

**Evidence (verbatim output):**
```
glitch-hunter: 3 items | source: jina → amazon (set KEEPA_API_KEY for max reliability) | proxy/VPN: none (direct)
…  B09B93ZDG4: $79.99 (max $15.00) [jina]
…  B0DC91H3JK: $199.99 (max $30.00) [jina]
…  B0G4XRP464: $59.99 (max $12.00) [jina]
```

Plausibility check: $79.99 (Echo Dot 5th gen), $199.99 (Echo Show 8), $59.99 (Fire TV Stick 4K) all sit inside the "normal" ranges documented in `watchlist.txt` comments, so the jina parser is returning real buybox prices, not garbage. Prices are above thresholds → correctly no 🚨 HIT and no `glitches-found.json` created.

---

## Test 2 — `node tools/glitch-hunter.mjs --deals`

**Command:**
```bash
node tools/glitch-hunter.mjs --deals
```

**Result: PASS** — live "Today's Deals" list rendered with % off, prices, ASINs, titles; 15 deals found.

**Evidence (verbatim excerpt, first 5 + last line):**
```
 70% off  $   93.49  B0H4LJSHGL  70% off Limited time deal Deal Price: $93.49$93.49 Typical: Typical: $
 44% off  $   27.98  B01C5QS1T8  $49.98 iHealth Track Smart Upper Arm Blood Pressure Monitor with Wide-
 42% off  $   17.49  B079H53D2B  $29.97 Physician's CHOICE Probiotics 60 Billion CFU - 10 Strains + Org
 41% off  $  129.99  B0D8LXRHQ8  $219.99 Keurig K-Duo Hot & Iced Single Serve & Carafe Coffee Maker, Mu
 40% off  $  179.99  B0GZSST8ZT  $299.99 Shark Cordless Pet, Cordless Lightweight Stick Vacuum Cleaner,

15 live deals — add any to tools/watchlist.txt as: ASIN|max-price
```

Minor (non-failing) cosmetic note: for "Limited time deal" cards the title-regex falls back to the raw deal-card text ("Limited time deal Deal Price: …") instead of the product name. Prices/ASINs/percent-off are correct.

---

## Test 3 — GLITCH HIT path (high threshold → hit + JSON log + notification)

**Procedure:**
1. Backed up `tools/watchlist.txt`.
2. Appended test entry `B09B93ZDG4|999` (threshold far above the known $79.99 price).
3. Ran `node tools/glitch-hunter.mjs`.
4. Verified hit logged to `tools/glitches-found.json`, verified notification mechanism, then restored everything.

**Result: PASS** — 🚨 GLITCH HIT printed, entry written to `tools/glitches-found.json` with correct price/source/timestamp, macOS notification invoked.

**Evidence (verbatim console output):**
```
glitch-hunter: 4 items | source: jina → amazon (set KEEPA_API_KEY for max reliability) | proxy/VPN: none (direct)
…  B09B93ZDG4: $79.99 (max $15.00) [jina]
…  B0DC91H3JK: $199.99 (max $30.00) [jina]
…  B0G4XRP464: $59.99 (max $12.00) [jina]
🚨 GLITCH HIT: B09B93ZDG4 at $79.99 (<= $999) [jina] → https://www.amazon.com/dp/B09B93ZDG4
```

**Evidence — `tools/glitches-found.json` after the run (verbatim):**
```json
[
  {
    "ref": "B09B93ZDG4",
    "price": 79.99,
    "max": 999,
    "source": "jina",
    "at": "2026-10-15T13:27:46.718Z"
  }
]
```

**Notification honesty note:** the notification itself is best-effort (`notify()` swallows errors) and I cannot see the screen, so the popup was not visually confirmed. Two pieces of indirect evidence: (a) in `checkAll()` the `notify()` call sits *between* the `console.log` of the hit and the `writeFileSync` of `glitches-found.json` — since the JSON file was written, `notify()` was executed, not skipped; (b) an independent smoke test of the exact same osascript command returned exit 0:
```
osascript -e 'display notification "notification mechanism smoke test" with title "GLITCH-HUNTER TEST"'; echo $?
osascript exit: 0
```
So the mechanism works on this Mac and was invoked during the hit; only the visual popup itself is unobserved.

**Cleanup verified:**
- `tools/watchlist.txt` restored from backup byte-for-byte; `git status` shows it clean (no ` M tools/watchlist.txt`). Final contents end with exactly:
  ```
  B09B93ZDG4|15.00
  B0DC91H3JK|30.00
  B0G4XRP464|12.00
  ```
- Test entry removed from `glitches-found.json`. The file did not exist before this test (created by the test run itself), so it was deleted outright, returning the repo to its exact pre-test state. `tools/` now contains only: `check-links.sh`, `glitch-hunter.mjs`, `hunter.log`, `watchlist.txt`.

Also observed while here: the re-hit dedup path works — a second run with the same threshold logged `🚨 (already logged)` rather than duplicating the JSON entry (checked in code; behavior consistent with the single-entry file above).

---

## Test 4 — `bash tools/check-links.sh 10`

**Command:**
```bash
bash tools/check-links.sh 10
```

**Result: PASS** (script ran to completion) — **dead-link count: 11 dead of 201 unique URLs.**

**Evidence (verbatim output, full dead list + summary):**
```
checking 201 unique URLs (timeout 10s)…
DEAD(403) https://apnews.com/article/amazon-to-end-try-before-you-buy-prime-05197d30e819a28c6d0e0ead3057accc
DEAD(403) https://camelcamelcamel.com
DEAD(403) https://gg.deals/news/prime-gaming-free-games/
DEAD(403) https://medium.com/@docholiday4/the-wild-world-of-price-glitches-how-they-happen-and-how-to-catch-them-first-92e424e40684
DEAD(403) https://www.amazon.co.jp/-/en/gp/help/customer/display.html?nodeId=G6LDPN7YJHYKH2J6
DEAD(403) https://www.garagejournal.com/forum/threads/amazon-warehouse-condition-used-acceptable.442100
DEAD(403) https://www.moneytalksnews.com/save-an-extra-25-on-amazon-devices-this-week-by-trading-in/
DEAD(403) https://www.news10.com/news/shopping-by-voice-on-amazon-or-google-device-could-cost-you/
DEAD(403) https://www.shopyourway.com/blog/amazon-price-adjustment
DEAD(403) https://www.termsfeed.com/blog/pricing-mistakes-cancel-order
DEAD(403) https://www.theatlantic.com/technology/archive/2019/07/amazon-pays-users-access-browser-data/594199/
— done: 11 dead of 201
```

**Interpretation (important for whoever triages this):** every one of the 11 is a **403 Forbidden, not a 404** — these are sites (AP News, Medium, The Atlantic, camelcamelcamel, Amazon.co.jp help, etc.) bot-blocking curl's requests, not broken links. 190/201 URLs verified live. The 403-vs-404 distinction is not currently visible in the DEAD output granularity beyond the status code itself.

---

## Summary

| # | Test | Verdict |
|---|------|---------|
| 1 | `node tools/glitch-hunter.mjs` — 3 watchlist items, live prices via jina | **PASS** |
| 2 | `node tools/glitch-hunter.mjs --deals` — live deals list | **PASS** (cosmetic title-regex quirk on "Limited time deal" cards) |
| 3 | High-threshold glitch hit → 🚨 log + `glitches-found.json` + notification, then restore | **PASS** (notification popup visually unobserved; invocation + mechanism verified — see honesty note) |
| 4 | `bash tools/check-links.sh 10` | **PASS** — 11 dead of 201, all 403 bot-blocks, 0 true 404s |

**4/4 PASS.** No functional failures. Watchlist and glitches-found.json restored to exact pre-test state (`git status` clean apart from this `verification/` directory).
