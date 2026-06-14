# portfolio

single-file portfolio page. no framework, no build step, no node_modules folder I have to remember to gitignore.

live: [https://0xtrvkc.github.io](https://0xtrvkc.github.io/Portfolio/)

---

## what it is

static `portfolio.html` that lists my github pages tools and two instagram accounts. meant to be viewed on mobile in portrait. works on desktop too, it just looks a bit sparse because I didn't bother with a multi-column layout.

aesthetic is terminal + cute game mashup because that's apparently my personality now.

---

## stack

literally nothing. one html file.

- fonts pulled from google fonts at runtime (VT323, Press Start 2P, Nunito)
- sparkle/particle animation is vanilla canvas, ~80 particles
- zero dependencies, zero npm, zero webpack, zero regrets

if google fonts is down your font fallbacks are `monospace` and `sans-serif`. it'll look fine.

---

## file structure

```
/
├── portfolio.html    ← the whole thing
└── README.md
```

that's it.

---

## deploy

1. put `portfolio.html` in repo root
2. repo settings → pages → deploy from branch → main → / (root)
3. wait ~60 seconds
4. done

if you want it at `https://0xtrvkc.github.io` specifically (no `/repo-name`), the repo has to be named `0xtrvkc.github.io`. you probably already knew that.

---

## adding a new tool card

open `portfolio.html`, find the comment block that says `TEMPLATE — copy & uncomment to add a new tool card`. copy the commented-out `<a>` block, paste below the last card inside `#tools-list`, fill in the url/title/desc/tags/icon.

available card color classes: `card-green` `card-blue` `card-yellow` `card-pink` `card-purple` `card-orange`

pick whichever one isn't visually cluttering the card above it. no deeper logic than that.

animation delay for the new card is handled automatically by nth-child selectors up to 8 cards. if you're adding a 9th+, throw a new line in the css:

```css
.card:nth-child(9) { animation-delay: 0.72s; }
```

---

## color tokens (css variables)

| var | hex | used for |
|---|---|---|
| `--green` | `#00ff41` | primary terminal green |
| `--pink` | `#ff2d78` | accent, dot indicator |
| `--blue` | `#00cfff` | card variant |
| `--yellow` | `#ffe400` | bio tag, card variant |
| `--purple` | `#c77dff` | card variant, creative section |
| `--orange` | `#ff7b00` | card variant, videography |
| `--bg` | `#0d0d0d` | page background |
| `--card-bg` | `#131813` | card background |

if you want to change a color, change the variable at the top of the `<style>` block. it propagates everywhere.

---

## things I didn't bother with

- **dark mode toggle** — it's already dark. done.
- **analytics** — don't care about the numbers
- **SEO meta tags** — not trying to rank for anything
- **favicon** — added it to the list of things I'll do later
- **accessibility audit** — reduced motion is respected via `prefers-reduced-motion`. keyboard focus works. that's probably enough for a personal page nobody is legally required to use.
- **service worker / offline mode** — it's a portfolio page

---

## known issues

none that bother me enough to fix right now. the particle canvas resets on resize which causes a brief flicker, I know, it's fine.

---

## license

do whatever you want with the code. the links obviously go to my stuff so don't copy those. (just kidding, do what you want 😛)
