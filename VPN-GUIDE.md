# VPN Guide for Glitch Hunting 🛡️

Why a VPN ("von") matters for this repo, and how to use one.

## Why

1. **Bot checks.** Amazon aggressively bot-checks price scrapers. When your IP
   gets flagged, you get tiny "automated access" pages instead of product
   pages (your tool reports `no price … bot check?`). Switching VPN exit IPs
   gives you a fresh start. (*Residential* VPN endpoints work far better than
   datacenter ones for scraping.)
2. **Geo glitches.** Amazon runs separate storefronts per country; pricing
   errors are per-storefront. A VPN exit in another country lets you *see*
   those stores (e.g. amazon.co.jp, amazon.de) — and some regional promos
   (credits, welcome offers) are only visible/claimable from in-region.
3. **Multi-account separation.** If you run more than one Amazon account
   (e.g. household members), giving each its own VPN exit + browser profile
   keeps Amazon from linking them into one "abuse cluster." This is the
   gray-zone part — see the deception notes in README.
4. **Deal-flow access.** Some regional glitch groups/monitors are geo-fenced.

## How

- **System-wide VPN** (WireGuard, OpenVPN, Mullvad, Proton, etc.): just
  connect and run the tools normally — traffic follows the tunnel.
- **Per-command proxy**: if your VPN app exposes a SOCKS/HTTP port
  (e.g. `127.0.0.1:7890`), route only the glitch tools through it:

  ```bash
  GLITCH_PROXY=socks5h://127.0.0.1:7890 node tools/glitch-hunter.mjs --loop 120
  ```

- Rotate exit nodes when you see `no price [amazon] … bot check?` repeatedly.

## VPN hygiene rules

- **One account = one exit country, consistently.** Hopping countries on an
  account you *order* from looks like account takeover and can trigger
  security holds. Use the VPN for *watching* prices freely; keep the exit
  stable when *buying*.
- Don't use free VPNs with shared abuse-flagged IPs for anything that matters.
- A VPN protects the link between you and Amazon; it does **not** hide your
  logged-in Amazon account identity — that's the point of rule 3 (separate
  accounts, not hidden accounts).
