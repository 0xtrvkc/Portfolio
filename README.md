# TRVKC Portfolio

Personal portfolio and launchpad for browser-based research tools, trading/quant experiments, utilities, and creative work.

[Live site](https://0xtrvkc.github.io/Portfolio/) · [GitHub](https://github.com/0xtrvkc)

![Static site check](https://github.com/0xtrvkc/Portfolio/actions/workflows/static-site-check.yml/badge.svg)

## Overview

This repo is intentionally simple: a static GitHub Pages site with no framework, package manager, bundler, or build step.

The portfolio has two personalities in one `index.html`:

- **Normal mode** — editorial / terminal-inspired portfolio layout
- **Fun mode** — an embedded high-energy alternate UI with interactive effects and animation

The tool list is auto-numbered in the browser, so adding, removing, or reordering project cards does not require manually fixing card numbers or the sidebar project count.

## Featured tools

| Project | What it does |
| --- | --- |
| [BTC-MVRV Analytics](https://0xtrvkc.github.io/dynamic-btc-analytics-dashboard/) | Dynamic BTC dashboard with MVRV visualisation and analytics |
| [BTC-MVRV Analytics — Mobile](https://0xtrvkc.github.io/dynamic-btc-analytics-dashboard_mobile/) | Mobile-focused version of the BTC-MVRV dashboard |
| [BTC-DXY Analytics](https://0xtrvkc.github.io/dynamic-btc-dxy-analytics-dashboard/) | BTC analytics with DXY visualisation |
| [BTC 0DTE Signal](https://0xtrvkc.github.io/BTC-Daily-Short-Call-Premium-Income-Checklist/) | Daily short-call premium checklist and indicator suite |
| [BTC Loan Analyzer](https://0xtrvkc.github.io/btcLoanAnalyzer/) | BTC-collateral loan modelling for LTV, liquidation, and cash flow |
| [Gold SD Visualizer](https://0xtrvkc.github.io/Gold-OG-GC-intraday-oi-SD-Visualizer/) | Intraday Gold OI standard-deviation visualiser — under maintenance |
| [Gold SD Visualizer — Mobile](https://0xtrvkc.github.io/Gold-OG-GC-intraday-oi-SD-Visualizer_mobile/) | Mobile version of the Gold OI visualiser — under maintenance |
| [Vol2Vol Gold DB](https://0xtrvkc.github.io/itd-oi-db/) | Gold OG/GC volatility-to-volatility open-interest database |
| [PVD vs Investment](https://0xtrvkc.github.io/pvd-vs-investment/) | Provident-fund vs investment-growth comparison |
| [BTC EMA Cross Backtest](https://0xtrvkc.github.io/btcEmaCrossBacktest/) | Dual-EMA crossover backtest on historical BTC/USD data |
| [Prop Challenge Sim](https://0xtrvkc.github.io/prop_challenge_simulator/) | Prop-challenge pass-probability simulator |
| [FADE](https://0xtrvkc.github.io/Fade-self-erasing-clipboard/) | Cross-device clipboard that self-erases |
| [BTC Options Sandbox](https://0xtrvkc.github.io/btc-options-sandbox/) | Browser-based BTC range-risk and options research terminal |

## Creative work

- [Videography — @expsr.v](https://instagram.com/expsr.v)
- [Loop animation / 3D — @contrvkc](https://instagram.com/contrvkc)

## Stack

- HTML, CSS, and vanilla JavaScript
- Google Fonts loaded at runtime
- Canvas / DOM-based visual effects in fun mode
- Web app manifest with 192×192 and 512×512 icons
- GitHub Pages for hosting
- GitHub Actions for lightweight static-site validation

No Node.js runtime, npm dependencies, framework, or compilation step is required.

## Repository structure

```text
/
├── .github/
│   └── workflows/
│       └── static-site-check.yml
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── index.html
├── manifest.json
└── README.md
```

## Run locally

Because the site is static, you can open `index.html` directly. A local HTTP server is better for testing browser behaviour that depends on normal web origins.

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Add a new tool

Open `index.html`, find the **CARD BLANK TEMPLATE** inside `#tools-list`, and copy the template below the existing cards.

```html
<a class="card" href="YOUR_LINK_HERE" target="_blank" rel="noopener">
  <span class="card-idx"></span>
  <div class="card-main">
    <div class="card-title">Tool Name Here</div>
    <div class="card-desc">Short description of what this tool does</div>
  </div>
  <span class="card-tag">TAG · TAG · TAG</span>
  <span class="card-arrow">↗</span>
</a>
```

Leave `.card-idx` empty. `autoNumberCards()` assigns the display number and updates the sidebar project count automatically.

## PWA / home-screen metadata

`manifest.json` defines the app name, theme/background colour, portrait orientation, start URL, scope, and icon metadata. The page also includes Apple touch-icon and theme-colour metadata.

This repo does **not** use a service worker, so it should be treated as a static portfolio with install/home-screen metadata rather than an offline-first app.

## Deployment

The site is designed to be served directly from the repository root with GitHub Pages:

1. Open **Settings → Pages** in the repository.
2. Choose **Deploy from a branch**.
3. Select `main` and `/ (root)`.
4. Save.

The live URL is:

https://0xtrvkc.github.io/Portfolio/

No build workflow is required because the deployed source is already static HTML/CSS/JS.

## CI

`.github/workflows/static-site-check.yml` runs on pushes to `main` and on pull requests. It intentionally stays dependency-free and checks that:

- required site files exist
- `manifest.json` is valid JSON
- manifest icon files exist
- local `href` / `src` references in `index.html` resolve to files in the repo
- essential document metadata such as the doctype, viewport, title, and manifest link is present

The workflow validates the source; GitHub Pages remains responsible for deployment.

## Notes

- The main page is responsive and includes mobile-specific performance adjustments in fun mode.
- External fonts require network access; system fallbacks are used if they are unavailable.
- Financial tools linked from this portfolio are research / informational projects, not investment advice.

## License

No explicit open-source license is currently included in this repository. Unless a license is added, normal copyright rules apply to the source code and assets.
