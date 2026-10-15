#!/bin/bash
# check-links.sh — verify every source URL in glitches/*.md is alive.
# Usage: bash tools/check-links.sh [timeout]
set -u
T="${1:-15}"
cd "$(dirname "$0")/.."
grep -hoE 'https://[^ )">]+' glitches/*.md README.md VPN-GUIDE.md 2>/dev/null \
  | sed 's/[).,]*$//' | sort -u > /tmp/links.txt
total=$(wc -l < /tmp/links.txt | tr -d ' ')
echo "checking $total unique URLs (timeout ${T}s)…"
dead=0
while read -r url; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time "$T" \
    -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    "$url" 2>/dev/null)
  if [ "$code" = "000" ] || [ "$code" = "404" ] || [ "$code" = "410" ] || [ "$code" = "403" ]; then
    echo "DEAD($code) $url"
    dead=$((dead+1))
  fi
done < /tmp/links.txt
echo "— done: $dead dead of $total"
