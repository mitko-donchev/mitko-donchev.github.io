# Handover — Waybound marketing site

Working tree: `C:\Users\35987\Documents\GitHub\mitko-donchev.github.io`
Branch: `website-improvements` (branched off `main`, **nothing pushed, no PR opened**)
Stack: React 18 + CRA (`react-scripts` 5.0.1), styled-components **v6**, react-scroll, react-helmet.
Dev server: `npm start` (was running on http://localhost:3001).
Build check: `CI=true npx react-scripts build` — last run compiled clean (104.18 kB gz JS / 8.64 kB gz CSS).

---

## 1. THE OPEN TASK (do this first)

The user's last instruction, verbatim, in two parts:

> "Make the door more like an entrance of a medival village not this portal shape and make it cooler"

> "btw the entrance of the vilage should be made only by wood and have a sign "Waybound" a big one on top its a small vilage not a town"

**File: `src/components/Elements/Gate.jsx`** — this is the only uncommitted change in the tree
(`git status` shows ` M src/components/Elements/Gate.jsx`).

### State of that file right now: WRONG, needs replacing

The version currently on disk is a **stone gatehouse** — towers, crenellations/merlons, a
portcullis, arrow slits, a keystone. It was written against the first half of the request
("medieval village entrance, not a portal") **before** the second half arrived. It is a town
fortification, and it is stone. It contradicts the new spec on both counts. Do not patch it;
rebuild it.

### What it must become

- **Timber only.** No stone, no masonry courses, no merlons, no arrow slits, no keystone, no
  portcullis. Drop the `gateStone` gradient entirely; everything is `gateTimber`
  (`#33251A` to `#1A130D`, `gradientUnits="userSpaceOnUse"`) or darker.
- **A small village, not a town.** Two heavy posts and a lintel/crossbeam — a trestle gate, the
  kind a dozen families put up in an afternoon. Rough-hewn, slightly irregular, braced with
  diagonal struts, iron straps and nails at the joints. Low, wide, humble. Not imposing.
- **A big "Waybound" sign on top.** This is the focal point. A board hung from or mounted across
  the crossbeam, carved or burned lettering, **big** — it should be the first thing you read.
  Use the display face (Cormorant Garamond — see `.displayFont` and the font tokens in
  `src/style/index.css`) so it matches the wordmark used elsewhere. A lantern or ember glow
  lighting it from below would sell it.
- **Keep** these, they already work and the user has not objected:
  - the road running *toward* the viewer with the pulsing `VanishingPoint` at the far end (that
    is the site's one permitted "something is out there" hint — see §2a);
  - the two braziers and their offset two-cycle `Flame` / `FlameCore` flicker;
  - `EmberField` inside `Embers` — note the `@media (max-width: 960px)` inset reset, it exists
    because the ±12% bleed caused 19px of horizontal overflow on phones. Keep it.
  - `useReducedMotion()` feeding a `$still` prop that kills every animation;
  - the `gateFalloff` radial, so nothing ends on a hard silhouette edge;
  - the timber doors standing open, if they still suit the simpler massing.
- **Palisade**: keep the stakes running off both sides and fading into the dark — that is what
  makes it read as a village boundary rather than a freestanding arch. Already wood, so it now
  matches the rest.
- The file is currently `viewBox="0 0 440 500"` with `const GROUND = 470`, and `Frame` is
  `max-width: 460px`. A wide, low gate probably wants a wider and shorter box — change freely.

### Where it renders

`Gate` is consumed by one of the components in `src/components/Sections/` — grep for it. Review it
in place rather than in isolation; it sits in a column and the surrounding copy sets the tone.

---

## 2. STANDING CONSTRAINTS — read before touching any copy

### 2a. Do not spoil the game (user's words, still in force)

> "One very imporant thing - do not spoil the mechanics of the game - do not spoil that the user
> will be in a magical loop we can put small hints or something confusing but not share that as it
> is a aha mmoment"

The loop is the game's reveal. Hints, unease, déjà vu, unanswered questions: yes. Naming or
explaining the mechanic: never. This covers alt text, aria-labels, meta descriptions, the OG image,
and any code comment that could end up in a shipped bundle.

### 2b. The COPY RULE

It lives at the top of `src/config/links.js` and governs **every string in that file**:

> The site sells the road, the fight and the craft. It does not tell the story. No opening scene,
> no how-you-got-here, no what-the-book-turns-out-to-be: those are the game's to spend and it only
> gets to spend them once.
>
> In bounds: mechanics we have actually built, real numbers from the design docs, atmosphere,
> unease, deja vu, and questions left unanswered.
> Out of bounds: anything a player would rather have found out themselves.

`src/config/links.js` is the single source of copy — change text there, not in components.
Current key values: `GAME_SUBTITLE` = "Something out here is keeping count.",
`BOOK_TITLE` = "Bound in something that is not quite leather.",
`BOOK_QUESTION` = "Nobody has explained the handwriting.",
`STUDIO_TAGLINE` = "Built by gamers. Made for gamers." — the user asked for this to appear
**once**, and it now appears only in the studio section. Do not reintroduce it in the footer.

---

## 3. Gotchas that already cost time — do not rediscover them

### styled-components v6 does NOT imply the parent selector

v6 ships stylis 4. A bare `:hover` compiles to `.cls :hover` — a **descendant** selector that
matches nothing. Every pseudo-class and pseudo-element must be written `&:hover`, `&::before`.

A sweep fixed **36 broken selectors across 11 files** (commit `69fbbd9`). Several hover effects had
only *appeared* to work because they happened to land on a child. The one surviving bare pseudo in
the codebase is the intentional `*, ::before, ::after` reset in `src/style/index.css`. Before
committing any new CSS, check:

```bash
grep -rn --include=*.jsx -E '^[[:space:]]*::?[a-z-]+.*\{' src | grep -v '&'
```

### Nested-block ordering

Plain declarations must come **before** any nested block in a styled component. Anything written
after a nested rule gets swallowed into it. See the comment on `TopLink` in `Footer.jsx`.

### TDZ with `styled(X)`

`const NavList = styled(UlStyle)` requires `UlStyle` to be declared first — it is a `const`, not
hoisted. This threw a runtime error in `Sidebar.jsx` once.

### Browser testing: `resize_window` does not work here

It kept reporting a 2550px viewport regardless. Responsive checks were done by injecting an
`<iframe>` of a fixed pixel size into the page with `javascript_tool` and reading inside it.

### Other one-line traps

- Transient props must be `$`-prefixed (`$still`, `$corner`, `$sidebarOpen`) or React warns about
  unknown DOM attributes.
- A running `animation` on a property beats a `:hover` declaration on that same property. The
  `WishlistButton` halo breathes on `transform: scale()` precisely so hover can own `opacity`.
- SVG gradients spanning separate elements need `gradientUnits="userSpaceOnUse"`, or each element
  gets its own object-box gradient and you get seams.
- Genuine holes in an SVG shape need `fillRule="evenodd"` on a single path — not a second shape
  painted over the first.
- Social scrapers do not run JS. OG/Twitter tags must live in the **static** `public/index.html`,
  not be injected by react-helmet. They are already there; keep them in sync with `links.js`.

---

## 4. What is already done (5 commits on this branch)

| commit | what |
|---|---|
| `3da0041` | Rework the site around Waybound's art direction |
| `06f6aae` | Pull the story back out of the copy, and forge the Steam button |
| `f17cf55` | Polish: share metadata, the gate, the footer, document structure |
| `2cc2689` | Polish: make the site usable from the keyboard |
| `69fbbd9` | Polish: fix 36 selectors that were never matching their own element |

Worth knowing:

- **`src/components/Buttons/WishlistButton.jsx`** — the gold CTA the user asked for. Structure:
  `Frame > (Halo, Plate > (Tick x4, Sheen, Content > (SteamMark, Label)))`. It is an `<a>`, not a
  `<button>`, so middle-click and "copy link address" behave. The face is a 250%-wide gradient
  walked from `12% 50%` to `88% 50%` on hover, which reads as light travelling across metal.
  `SteamMark` is exported and reused by the navbar and the drawer.
- **`src/components/Sections/Footer.jsx`** — rewritten as a closing bar only (logo left, © and
  BACK TO TOP right). Its old duplicate socials, wishlist link and third tagline were removed
  deliberately.
- **`scripts/make-og-image.py`** — generates `public/og-image.png` (1200x630, ~105 kB) with Pillow
  in the site palette; caches Google fonts under `.cache/fonts/`. Re-run
  `python scripts/make-og-image.py` after any change to the wordmark or the share copy. Its text is
  bound by the COPY RULE too.
- **Accessibility already landed**: `--bone-faint` lifted to `#827E73` for 4.5:1 contrast; the
  sidebar CTA is ink-on-ember (white-on-amber measured 2.16:1); 44px touch targets via `::before`
  overlays; the drawer takes `visibility: hidden` + `aria-hidden` when closed so its links leave
  the tab order; Escape closes it; `prefers-reduced-motion` is honoured in both CSS and the
  `useReducedMotion()` hook.
- **Map (`CursedPath.jsx`) and `Bestiary.jsx`** are pinned to `720px` below an 860px breakpoint and
  scroll horizontally inside a masked parent — they were unreadable squeezed to 414px.

---

## 5. Suggested order of work

1. Rebuild `src/components/Elements/Gate.jsx` per §1. Check it at 1440px wide, at a 900px-tall
   viewport, and at 414px wide.
2. `CI=true npx react-scripts build` — must compile clean.
3. Commit. The gate is currently the only dirty file, so the commit stays focused.
4. Ask before pushing or opening a PR. The user was offered this and has not answered yet.
5. Delete this file once the handover is spent.
