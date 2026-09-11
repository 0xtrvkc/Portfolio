# TRVKC Portfolio

Personal portfolio and launchpad for browser-based research tools, trading/quant experiments, utilities, and creative work.

[Live site](https://0xtrvkc.github.io/Portfolio/) · [GitHub](https://github.com/0xtrvkc)

![Static site check](https://github.com/0xtrvkc/Portfolio/actions/workflows/static-site-check.yml/badge.svg)

## Overview

This repo is intentionally simple: a static GitHub Pages site with no framework, package manager, bundler, or build step.

The portfolio has two personalities in one `index.html`:

- **Normal mode** — editorial / terminal-inspired portfolio layout
- **Fun mode** — an embedded high-energy alternate UI with interactive effects and animation

Both personalities render from one normalized content model. `portfolio-data.js` provides the repository fallback, while Cloud Firestore is the live source of truth. Changes made with the hidden editor are reflected in Normal and Fun mode without duplicate editing and persist across browsers and devices.

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
- Firebase Authentication with Google sign-in
- Cloud Firestore for global portfolio content and real-time sync
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
├── firebase-sync.js
├── firestore.rules
├── portfolio-data.js
├── portfolio-store.js
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

## Hidden editor

Open **Normal mode**, then type `iii` within roughly one second. On a touch device, triple-tap the greeting in the top bar. No editor button or hint is shown to ordinary visitors. The hidden gesture opens Google sign-in; Edit mode is unlocked only for the verified `cryptotrvkc@gmail.com` account.

The editor supports:

- adding, editing, and deleting projects and creative links
- drag-and-drop ordering on desktop
- accessible up/down ordering controls on desktop and mobile
- project title, URL, description, tags, Fun-mode filename, status, and command
- Fun-mode card accent selection: volt green, cyan, magenta, or amber
- automatic global Firestore saving, JSON backup, and JSON import
- one shared result across Normal and Fun mode
- a sign-out control for ending the authenticated edit session

Press `Esc` or use the editor's `ESC` button to close it.

### Global content and security

Public visitors read the single Firestore document at `portfolio/public`. The site caches the last valid content locally for fast startup and temporary offline fallback, but Firestore replaces that cache as soon as the live document loads.

The `iii` gesture is only the hidden entrance. Actual authorization is enforced twice:

- the browser unlocks Edit mode only after Google verifies `cryptotrvkc@gmail.com`
- Firestore Security Rules allow public reads of `portfolio/public`, deny every other document, and allow writes only when the same verified email is present in the Firebase authentication token

The Firebase web configuration in `firebase-sync.js` is intentionally public, as required for browser Firebase apps. Security comes from Authentication and Firestore Security Rules, not from hiding the API key.

Every editor action writes the complete normalized portfolio to Firestore. Other browsers receive the updated data automatically. Normal mode and Fun mode both read that shared content, including each card's Fun-mode accent.

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

Firebase must have Cloud Firestore and Google Authentication enabled. The GitHub Pages host `0xtrvkc.github.io` must remain in **Authentication → Settings → Authorized domains**, and the deployed Firestore rules must continue restricting writes to the approved email.

`firestore.rules` is the version-controlled copy of the production rules. If the file changes later, publish the same rules in **Firebase Console → Firestore Database → Rules** (or deploy them with the Firebase CLI).

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
- `portfolio-store.js` validates imported/editor data, restricts URLs to HTTP(S), normalizes Fun-mode accent values, and maintains the local fallback cache.
- `firebase-sync.js` owns authentication, real-time Firestore reads, and serialized global writes.
- External fonts require network access; system fallbacks are used if they are unavailable.
- Financial tools linked from this portfolio are research / informational projects, not investment advice.

## License

No explicit open-source license is currently included in this repository. Unless a license is added, normal copyright rules apply to the source code and assets.
