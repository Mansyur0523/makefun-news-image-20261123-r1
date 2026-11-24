# Monday 23 November 2026 — The World in One Day: 36 verified stories, one front page

[![make.fun · news-image-20261123](https://make.fun/badge/news-image-20261123.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![rank](https://make.fun/badge/news-image-20261123/Mansyur0523/makefun-news-image-20261123-r1/rank.svg)](https://make.fun/bounty/news-image-20261123/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![reward](https://make.fun/badge/news-image-20261123/Mansyur0523/makefun-news-image-20261123-r1/reward.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)

One front page for Monday 23 November 2026: **36 verified stories** across 7 regions — Americas 7, Europe 7, Middle East 3, Asia 7, Africa 1, Sport 8, Climate 3.

[Enter the competition — news-image-20261123](https://make.fun/competitions/news-image-20261123?utm_source=github&utm_medium=readme)

## What is on the page

- **Masthead** — the date, Monday 23 November 2026, set large in red.
- **Number strip** — six labelled figures from the day: +31% NVIDIA shares rise on Monday; 153 Russian drones sent at Ukraine overnight; $43.9 billion CrowdStrike deal for Zscaler; 429 flights scheduled at Brussels Airport on Monday; 450 German schools sent bomb threats on Monday; $1 billion+ crypto theft claimed by the US Justice Department.
- **3 lead stories** — NVIDIA brings back Jensen Huang (shares up 31%); Ukraine sea drones sink a ship off Libya, confirmed by Zelenskyy on Monday; CrowdStrike buys Zscaler for $43.9 billion.
- **10 feature stories** — Binance hack $1 billion claim; 153 drones hit Ukraine; Dymer toll rises to 11; Belgium strike grounds flights; 450 schools get threats; Puigdemont free to return home; Trump pauses the Iowa blast; Iran vows to fight back; US wants a Sudan arms ban; Tata Steel $1.67 billion deal.
- **World map** — 13 numbered pins for the lead and feature stories, with a legend.
- **23 briefs** — NFL results, NBA, baseball, FIFA 2031 World Cup hosts, markets, and more, each with its source.
- **DATE CHECK** — a six-line box that pins every story to Monday 23 November 2026, including the ones whose events happened on 21–22 November and were confirmed or reacted to on Monday.

## Sources

Every story is verified against Reuters, AP, BBC, or the named source printed next to it (FIFA, Ukrainian Air Force, World Bank, Bild via Reuters, and others). No unverified figure is printed.

## How this entry is built

`entry.png` is a 1024×1024 RGB PNG drawn programmatically from verified facts: a fixed layout, a 5×7 bitmap font, and small illustrated panels for each lead and feature story. The generator lives outside this repo; this repo holds only the finished poster and the code that delivers it.

`main.ts` is a standard-library-only copier and validator. It reads `entry.png` from this repo, checks the PNG magic, size (≤ 1 MiB), dimensions (≤ 1024), IHDR/IDAT/IEND chunks and CRC-32 of every chunk, then copies it byte-for-byte to `$MAKEFUN_OUTPUT_DIR/entry.png` and verifies the SHA-256 of the copy.

## Run

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
```

It prints `OK entry.png 1024x1024 <bytes> sha256=<hex>` on success and exits non-zero on any validation failure.

## License

MIT — see [LICENSE](LICENSE).
