#!/usr/bin/env node
// glitch-hunter.mjs — Amazon price-glitch monitor
//
// Watches a list of ASINs/URLs and alerts when a price drops below your
// threshold (the signature of a price glitch).
//
// Usage:
//   node tools/glitch-hunter.mjs                # one pass over the watchlist
//   node tools/glitch-hunter.mjs --loop 60      # re-check every 60s
//   node tools/glitch-hunter.mjs --deals         # list live Amazon "Today's
//                                                # Deals" with % off + ASINs
//                                                # (candidates for watchlist)
//
// Watchlist format (tools/watchlist.txt): one entry per line, `#` comments:
//   B08N5WRWNW|25.00          # ASIN | max-price (alert at/below)
//   https://amzn.to/xyz|9.99  # full URLs also fine
//
// Price sources (in order of reliability):
//   1. KEEPA_API_KEY env var  → Keepa API (clean JSON, needs key at keepa.com)
//   2. r.jina.ai reader       → renders Amazon pages off-site; immune to Amazon's
//                               bot checks (no key needed, free tier is rate-limited)
//   3. Direct amazon.com fetch (works from clean/VPN residential IPs)
//
// VPN / proxy: set GLITCH_PROXY (or HTTPS_PROXY) to route checks through
// your VPN. Example:
//   GLITCH_PROXY=http://127.0.0.1:7890 node tools/glitch-hunter.mjs
// With most VPN apps (WireGuard/OpenVPN) just connect system-wide and run
// normally — traffic goes through the tunnel automatically. A VPN also
// gives you a fresh IP when Amazon starts bot-checking yours.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const WATCHLIST = join(ROOT, "tools", "watchlist.txt");
const FOUND_LOG = join(ROOT, "tools", "glitches-found.json");

const UAS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { loop: 0, deals: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--loop") out.loop = parseInt(args[i + 1] || "60", 10);
    if (args[i] === "--deals") out.deals = true;
  }
  return out;
}

// macOS notification — best effort, ignore failures (non-mac / muted)
function notify(title, message) {
  try {
    execFileSync("osascript", ["-e",
      `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)}`]);
  } catch { /* non-mac or notifications off */ }
}

// --- Deals discovery: Amazon "Today's Deals" via the jina reader ---------
function dealsMode(env) {
  const body = fetchUrl("https://r.jina.ai/https://www.amazon.com/gp/goldbox",
    env.proxy, ["x-no-cache: true", "x-timeout: 25"]);
  if (!body || body.length < 500) { console.log("deals: fetch failed"); return; }
  const re = /\[([^\]]*Deal Price: \$([\d.,]+)[^\]]*)\]\([^)]*\/dp\/([A-Z0-9]{10})/g;
  const deals = []; const seen = new Set();
  let m;
  while ((m = re.exec(body))) {
    const pct = m[1].match(/(\d+)%\s*off/);
    // titles appear after "List: List: $XX.XX" in the deal-card text
    const title = (m[1].split(/List:\s*List:\s*\$[\d.,]+/).pop() || "").trim();
    const asin = m[3];
    if (seen.has(asin)) continue;
    seen.add(asin);
    deals.push({
      asin,
      price: parseFloat(m[2].replace(/,/g, "")),
      pctOff: pct ? parseInt(pct[1], 10) : 0,
      title: title.slice(0, 70),
    });
  }
  deals.sort((a, b) => b.pctOff - a.pctOff);
  for (const d of deals) {
    console.log(`${String(d.pctOff).padStart(3)}% off  $${d.price.toFixed(2).padStart(8)}  ${d.asin}  ${d.title}`);
  }
  console.log(`\n${deals.length} live deals — add any to tools/watchlist.txt as: ASIN|max-price`);
}

function loadWatchlist() {
  if (!existsSync(WATCHLIST)) {
    console.error(`No watchlist at ${WATCHLIST}. Create it:\n  B08N5WRWNW|25.00`);
    process.exit(1);
  }
  return readFileSync(WATCHLIST, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [ref, max] = l.split("|");
      return { ref: ref.trim(), max: parseFloat((max || "0").trim()) };
    })
    .filter((e) => e.ref && e.max > 0);
}

function refToAsin(ref) {
  const m = ref.match(/(?:\/dp\/|^)(B0[A-Z0-9]{8})/i);
  return m ? m[1].toUpperCase() : ref.toUpperCase();
}
function refToUrl(ref) {
  return ref.startsWith("http") ? ref : `https://www.amazon.com/dp/${refToAsin(ref)}`;
}

// Fetch URL via curl (honors GLITCH_PROXY/HTTPS_PROXY). Curl is chosen over
// node fetch because node's fetch ignores proxy env vars.
function fetchUrl(url, proxy, extraHeaders = []) {
  const ua = UAS[Math.floor(Math.random() * UAS.length)];
  const args = ["-sL", "--max-time", "25", "--compressed",
    "-A", ua,
    "-H", "Accept: text/html,application/json;q=0.9,*/*;q=0.8",
    "-H", "Accept-Language: en-US,en;q=0.9",
    ...extraHeaders.map((h) => ["-H", h]).flat(),
    url];
  if (proxy) args.push("-x", proxy);
  try {
    return execFileSync("curl", args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  } catch {
    return "";
  }
}

// --- Price source 1: Keepa API (clean JSON) -------------------------------
function priceViaKeepa(asin, key, proxy) {
  const url = `https://api.keepa.com/product?key=${encodeURIComponent(key)}&domain=1&asin=${asin}&stats=current&buybox=1`;
  const body = fetchUrl(url, proxy);
  if (!body) return null;
  try {
    const json = JSON.parse(body);
    const cur = json?.products?.[0]?.stats?.current;
    // csv index 0 = Amazon price, 1 = new (marketplace) — in cents, -1 = n/a
    const candidates = [];
    if (Array.isArray(cur)) candidates.push(cur[0], cur[1]);
    const buybox = json?.products?.[0]?.buyBoxPrice;
    if (typeof buybox === "number") candidates.push(buybox);
    const cents = candidates.filter((v) => typeof v === "number" && v > 0);
    if (!cents.length) return null;
    return Math.min(...cents) / 100;
  } catch {
    return null;
  }
}

// --- Price source 2: r.jina.ai reader (bot-check-proof) -------------------
function priceViaJina(url, proxy) {
  // x-no-cache: Jina caches pages; a cached bot-check snapshot would poison us.
  const body = fetchUrl(`https://r.jina.ai/${url}`, proxy,
    ["x-no-cache: true", "x-timeout: 25"]);
  if (!body || body.length < 500) return null;
  // Buybox price renders as "Price ($79.99" in the markdown; fall back to
  // the first currency amount on the page.
  const m =
    body.match(/Price \(\s*\$\s*([\d.,]+)/) ||
    body.match(/\$\s*([\d,]+\.\d{2})/);
  if (m) {
    const val = parseFloat(m[1].replace(/,/g, ""));
    if (!Number.isNaN(val) && val > 0) return val;
  }
  return null;
}

// --- Price source 3: direct Amazon page scrape -----------------------------
function priceViaAmazon(url, proxy) {
  const html = fetchUrl(url, proxy, [
    "Sec-Fetch-Dest: document",
    "Sec-Fetch-Mode: navigate",
    "Sec-Fetch-Site: none",
    "Upgrade-Insecure-Requests: 1",
  ]);
  if (!html || html.length < 5000) return null; // bot-check pages are tiny
  const patterns = [
    /"priceAmount"\s*:\s*([\d.]+)/,
    /"displayPrice"\s*:\s*"\$?([\d.,]+)"/,
    /class="a-price-whole">\s*([\d,]+)/,
    /a-offscreen">\s*\$\s*([\d,]+\.?\d*)\s*</,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ""));
      if (!Number.isNaN(val) && val >= 0) return val;
    }
  }
  return null;
}

function getPrice(entry, env) {
  const asin = refToAsin(entry.ref);
  if (env.KEEPA_API_KEY) {
    const p = priceViaKeepa(asin, env.KEEPA_API_KEY, env.proxy);
    if (p != null) return { price: p, source: "keepa" };
  }
  const pj = priceViaJina(refToUrl(entry.ref), env.proxy);
  if (pj != null) return { price: pj, source: "jina" };
  const p = priceViaAmazon(refToUrl(entry.ref), env.proxy);
  if (p != null) return { price: p, source: "amazon" };
  return { price: null, source: "none" };
}

function loadFound() {
  try { return JSON.parse(readFileSync(FOUND_LOG, "utf8")); } catch { return []; }
}

function checkAll(env) {
  const entries = loadWatchlist();
  if (!entries.length) { console.log("Watchlist is empty."); return; }
  const found = loadFound();
  const seen = new Set(found.map((f) => `${f.ref}|${f.price}`));

  for (const entry of entries) {
    const { price, source } = getPrice(entry, env);
    const max = entry.max;
    if (price != null && price <= max) {
      if (!seen.has(`${entry.ref}|${price}`)) {
        const msg = `${entry.ref} at $${price.toFixed(2)} (<= $${max}) [${source}]`;
        console.log(`🚨 GLITCH HIT: ${msg} → ${refToUrl(entry.ref)}`);
        notify("🚨 GLITCH HIT", msg);
        found.push({ ref: entry.ref, price, max, source, at: new Date().toISOString() });
        writeFileSync(FOUND_LOG, JSON.stringify(found, null, 2));
      } else {
        console.log(`🚨 (already logged) ${entry.ref} at $${price.toFixed(2)} [${source}]`);
      }
    } else if (price != null) {
      console.log(`…  ${entry.ref}: $${price.toFixed(2)} (max $${max.toFixed(2)}) [${source}]`);
    } else {
      console.log(`…  ${entry.ref}: no price [${source}] — bot check? try VPN / GLITCH_PROXY / KEEPA_API_KEY`);
    }
    // polite delay to look less bot-like
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500 + Math.random() * 2500);
  }
}

function main() {
  const { loop, deals } = parseArgs();
  const env = {
    proxy: process.env.GLITCH_PROXY || process.env.HTTPS_PROXY || "",
    KEEPA_API_KEY: process.env.KEEPA_API_KEY || "",
  };
  if (deals) { dealsMode(env); return; }
  console.log(`glitch-hunter: ${loadWatchlist().length} items | source: ${env.KEEPA_API_KEY ? "keepa → jina → amazon" : "jina → amazon (set KEEPA_API_KEY for max reliability)"} | proxy/VPN: ${env.proxy || "none (direct)"}`);
  if (loop > 0) console.log(`looping every ${loop}s — Ctrl-C to stop`);
  const run = () => checkAll(env);
  run();
  if (loop > 0) setInterval(run, loop * 1000);
}

main();
