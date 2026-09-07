# Handover — Waybound marketing site

Working tree: `/Users/md/development/mitko-donchev.github.io` (macOS)
Branch: `website-improvements` → **PR #27**, open, 22 commits ahead of `origin/main`, everything pushed
Stack: React 18 + CRA (`react-scripts` 5.0.1), styled-components **v6**, react-scroll, react-helmet
Dev server: `npm start` (has been running on http://localhost:3001)
Build: `CI=false npx react-scripts build` — last run compiled clean, 114.71 kB gz JS / **2.73 kB gz CSS**

> Note: local `main` is 3 commits behind `origin/main`. Compare against `origin/main`, not `main`.

---

## 1. There is no open task

The last request — soften the colour transition between the landing screen and the rest of
the page — is finished, committed and pushed. The tree is clean. Nothing is half-done, and
nothing is waiting on a decision except the items in §6, none of which have been assigned.

If the next request is more visual polish, read §4 first: the rhythm was just rebuilt on
measured evidence, and the numbers look "too small" if you only read them on paper.

**Start by asking the user what they want next.** Do not pick something from §6 and begin.

---

## 2. STANDING CONSTRAINTS — read before touching any copy

### 2a. Do not spoil the game (user's words, still in force)

> "do not spoil the mechanics of the game - do not spoil that the user will be in a magical
> loop we can put small hints or something confusing but not share that as it is a aha
> mmoment"

The loop is the game's reveal. Hints, unease, déjà vu, unanswered questions: yes. Naming or
explaining the mechanic: never. This covers alt text, aria-labels, meta descriptions, the OG
image, and any code comment that could end up in a shipped bundle.

### 2b. The COPY RULE

Lives at the top of `src/config/links.js` and governs **every string in that file**:

> The site sells the road, the fight and the craft. It does not tell the story. No opening
> scene, no how-you-got-here, no what-the-book-turns-out-to-be: those are the game's to spend
> and it only gets to spend them once.
>
> In bounds: mechanics we have actually built, real numbers from the design docs, atmosphere,
> unease, deja vu, and questions left unanswered.
> Out of bounds: anything a player would rather have found out themselves.

`src/config/links.js` is the single source of copy — change text there, not in components.
Current key values:

| constant | value |
|---|---|
| `GAME_NAME` | "Waybound" |
| `GAME_SUBTITLE` | "Something out here is keeping count." |
| `GAME_GENRE` | "Action RPG · Roguelike" |
| `BOOK_TITLE` | "Bound in something that is not quite leather." |
| `BOOK_QUESTION` | "Nobody has explained the handwriting." |
| `STUDIO_TAGLINE` | "Built by gamers. Made for gamers." |

`STUDIO_TAGLINE` must appear **once** — it renders only at `Studio.jsx:52`. The user asked for
this explicitly. Do not reintroduce it in the footer.

### 2c. `REDESIGN.md` is stale — do not follow it

It still describes the game as "Project Zero" and the theme as "Dark Neon / Cyber". Both were
superseded: the game is **Waybound** and the art direction is medieval-fantasy arcane
(mysterious and slightly uncanny, explicitly **not** grimdark and **not** horror). The live
design system is the token block at the top of `src/style/index.css`. Treat `REDESIGN.md` as
history.

---

## 3. Gotchas that already cost time — do not rediscover them

### styled-components v6 does NOT imply the parent selector

v6 ships stylis 4. A bare `:hover` compiles to `.cls :hover` — a **descendant** selector that
matches nothing. Every pseudo-class and pseudo-element must be written `&:hover`, `&::before`.
A sweep once fixed 36 broken selectors across 11 files. Before committing new CSS:

```bash
grep -rn -E '^[[:space:]]*::?[a-z-]+.*\{' --include='*.jsx' src | grep -v '&'
```

Currently returns nothing. The only intentional bare pseudo is the `*, ::before, ::after` reset
in `src/style/index.css`.

### Nested-block ordering

Plain declarations must come **before** any nested block in a styled component. Anything after
a nested rule gets swallowed into it. See the comment on `TopLink` in `Footer.jsx`.

### Shorthand `margin` in styled-components beats longhand in `index.css`

styled-components injects **after** the stylesheet. A component setting `margin: 20px 0 10px`
will win over anything in `index.css`. This is why `.textGradient` compensates with
`padding-bottom` and deliberately does **not** use a negative margin — the compensation would
apply to some headings and silently not to others.

### `background-clip: text` cannot paint outside the element's box

This is what clipped the tails off "gamers." and "Waybound". Cormorant's content area is
1.22em but headings are set at 1.12 and the display title at 1.0, so on the last line the
descenders of g, y and p hang below the box — and gradient text simply is not drawn there.
`background-size` does **not** help (the clip is the box, not the gradient's extent). Only a
bigger box does. Fixed with `padding-bottom: 0.16em` on `.textGradient`.

### A CSS `transform` on an SVG element replaces its `transform` attribute outright

They are the same property, not two layers. If an element gets a CSS transform (an animation,
say), its geometry must be authored at absolute coordinates. This ate the banner placement on
the gate once. Related: `transform-box` defaults to `view-box` for inner SVG elements (user
units), but the outer `<svg>` transforms in CSS px of its layout box.

### `overflow-x: hidden` makes an element a scroll container

And a scroll container between the viewport and a `position: sticky` element is what the
sticky sticks to. Use `overflow-x: clip` when you only want clipping (declare `hidden` first,
then `clip`, as progressive enhancement). `html, body` currently carry
`overflow-x: hidden !important`.

### react-scroll renders a bare `<a>` with no `href` unless you pass one

And an `<a>` without `href` is not keyboard-focusable. Every react-scroll `Link` in the
codebase passes `href={"#" + target}` for this reason. If you add one, pass it.

### Measuring tap targets: hit-test, don't read boxes

Several links get their 44px touch area from a `::before` overlay, which does **not** appear in
`getBoundingClientRect()`. Probing with `document.elementFromPoint` is the only honest check. I
raised three false "small tap target" findings before switching methods.

### Performance

- **A rAF loop that reschedules unconditionally runs for the life of the page.** Both pointer
  parallaxes did — `Atmosphere` and `Hero` — writing identical transforms 60 times a second
  forever, and on a touch device, where `pointermove` never fires, doing it for nothing from the
  first frame. Both now idle out when the lerp has caught up and wake on input; `Hero` also
  suspends on an IntersectionObserver, because its parallax is invisible once the hero scrolls
  away. Idle went from three continuous loops to two at the top of the page and one at the
  bottom. Measure this by wrapping `requestAnimationFrame` in an init script and counting.
- **Do not put a scroll position in React state.** `TopNavbar` held raw `scrollY` and used it
  only as `y > 100`, so every scroll event re-rendered the bar, the drawer, the backdrop, the
  logo, four links and the CTA. Over one read of the page that measured 105 updates producing
  1 change — 99% waste. It now stores the boolean and coalesces into a rAF.
- **A resize handler that rebuilds state fires constantly on mobile.** The URL bar collapsing
  during scroll changes `innerHeight` by ~60px. `Motes` rebuilt its whole field on that, which
  scrambled every mote mid-scroll; it now adjusts the population and keeps the field.
- **The CSS bundle was 69% dead template.** `src/index.js` imported slick-carousel's two
  stylesheets and `flexboxgrid.min.css` — ~15.6kB of raw CSS for a carousel that does not exist
  and a grid whose class names appear nowhere outside its own file. Removing them took the CSS
  bundle from 8.82kB gz to **2.73kB gz**. `emailjs-com`, `react-google-recaptcha-v3`,
  `react-slick` and `slick-carousel` were also uninstalled — they had no imports, so this is
  install weight only, not bundle. Note it did **not** move the advisory count: all 11 come from
  `react-scripts` and its dev-server chain (`webpack-dev-server`, `resolve-url-loader`,
  `postcss`, `express`), none from the packages removed.
- A canvas whose CSS size can change without the window resizing needs a **ResizeObserver**, not
  just a `window.resize` listener. `EmberField` had only the latter, and the hero grows ~100px
  taller after mount once the display face loads — so its backing store stayed measured against
  the old height and the canvas was stretched to fit, rendering the hero's embers 11.7% too tall.
  Guard the resize handler against no-op calls or the observer re-seeds the field on every tick.
- Scaling a ~200-element SVG re-rasterises all of it every frame, and sibling animations
  (flames, windows) defeat any raster cache. A scroll-driven gate that scaled the whole drawing
  was built and then **reverted for lag** — see `c2c4847`. Do not reintroduce a per-frame
  transform on the whole gate.
- A root `filter: drop-shadow()` re-runs over the entire drawing whenever anything inside
  moves. The gate's glow is a radial gradient on a wrapper `div` instead.
- `feGaussianBlur` inside a `<mask>` is re-rasterised whenever what it filters changes;
  gradient-strip feathers are painted once. The gate mask uses strips.
- **Headless Chromium has no GPU and its frame-time tail is not trustworthy** for this kind of
  comparison. I twice reported a perf win the evidence did not support and had to retract one
  in an amended commit message. If the question is "does this feel smooth", it has to be
  measured on the user's machine — the browser extension is the right tool, not Playwright.

### CSS comments inside a styled template are shipped to every visitor

Terser strips JS comments. It does **not** strip comments inside a styled-components
template literal, because that is string data, not code. Verified by grepping the built
bundle: prose written inside `styled.div\`…\`` was present, the same prose moved above the
component was gone. Moving the explanations for one small component out of its template
took 812 B off `main.js`.

This matters here because the house style is long explanatory comments. Keep them — just
put them **above** the styled component, not inside the backticks. Leave only short
pointers inline. Nobody has swept the existing components for this; it is not assigned,
but it is probably worth a few kB.

### A percentage inset cannot cover a pixel-sized parallax

Anything that leans on the pointer moves by a fixed number of pixels while its inset is
usually written in percent, so the slack runs out as the viewport narrows and the layer
slides clear of its own container. `Hero`'s `Ridge` had this on three edges at once:
travel is `currentX * -46` (bounded at 23px) and `currentY * -10` (bounded at 5px), against
a `-3%` side inset that is only 9.6px at 320 wide and `bottom: 0`, which is no slack at all.
It exposed 13.1px of bare sky beside the skyline under 768px, and 4.9px under it whenever
the pointer sat in the lower half of the screen.

The fix is a pixel floor — `left: min(-3%, -26px)` — and a negative `bottom`. Both are free
inside `overflow: hidden`. **If you add a parallax, work out its pixel bound from the
formula and check the inset beats it at 320px wide**, rather than at the width you happen to
have the window open at.

Related: a section whose height lands on a fraction (779.50 at 320×720, 986.94 at 1440×900 —
most sizes, in practice) leaves its last device-pixel row half-covered, and whatever is
behind shows through as a hairline. It disappears at exactly the sizes where the height
comes out whole, which is what makes it look like a phantom. Overhang, do not butt-join.

### Other one-line traps

- Transient props must be `$`-prefixed or React warns about unknown DOM attributes.
- `const A = styled(B)` requires `B` declared first — `const` is not hoisted (TDZ).
- A running `animation` on a property beats a `:hover` declaration on that same property.
- SVG gradients spanning separate elements need `gradientUnits="userSpaceOnUse"` or you get seams.
- Radial gradients need `cx/cy 0.5, r 0.5` or they clip mid-falloff and show a hard arc.
- Genuine holes in an SVG shape need `fillRule="evenodd"` on one path, not a shape painted over.
- Social scrapers do not run JS. OG/Twitter tags live in the **static** `public/index.html`, not
  react-helmet. Keep them in sync with `links.js`.

---

## 4. Layout system — the current shape of things

### Breakpoints

`src/config/breakpoints.js` holds `STACK_BREAKPOINT = 860`, the one **structural** breakpoint:
below it the map and bestiary stop being wide drawings and become vertical ones, the gutters
narrow, and the top bar collapses to a burger. It is readable from JS (`STACKED` +
`useMediaQuery`) and from CSS (`@media (max-width: ${STACK_BREAKPOINT}px)`).

Other breakpoints — 960, 760, 720, 640, 620, 560, 420, 400 — stay where they are used, each
marking where one component's own content breaks. **Verify that claim before trusting it**: the
navbar's 760 turned out not to be where its content broke, which is exactly the bug fixed in
`f30ccd6`. To list them:

```bash
grep -rhoE "@media[^{]*max-width: *[0-9]+px" src/ | grep -oE "[0-9]+px" | sort -un
```

(That misses uses written as `${STACK_BREAKPOINT}px`, which is the point — those are the ones
that are meant to move together.)

### Gutters and rhythm

`.container` is max-width 1240 with padding 32 / 24 (≤860) / 18 (≤400). Vertical rhythm is
three fluid steps, no breakpoint jump:

```
--space-section: clamp(40px, 4.8vw, 58px)   HALF the gap between numbered sections
--space-block:   clamp(40px, 5.6vw, 72px)   between blocks inside a section
--space-group:   clamp(26px, 3.6vw, 44px)   between a heading and what it introduces
--space-rule:    clamp(24px, 3.2vw, 38px)   below a separating hairline
```

On desktop that gives group 44, block 72, ruled boundary 82, seam 116. Read `--space-section`
carefully: sections abut and all three set it as *both* `padding-top` and `padding-bottom`, so a
seam is worth **twice** the token. That doubling is deliberate now and documented at the
declaration; it was not before, which is how seams ended up at 220px.

**The reasoning is in `index.css` and is worth reading before changing any of these.** The short
version: a fixed gap is not a fixed amount of air, because air is judged against what it
separates. The gaps were constant while the blocks got shorter down the page, so the empty share
of each section climbed — game 16%, features 25%, studio 35%. The end of the page was twice as
empty as the middle with no value having changed. Tightening the tokens costs nothing between a
1166px map and an 805px line-up and fixes the tail, which is where it was needed. After the
change: game 12%, features 22%, studio 26%, and the page is 1100px shorter.

Two traps that follow from this:

- **Floors are higher than the vw ramp wants at phone widths, on purpose.** On a phone the blocks
  invert — the map is 1429px tall at 390px wide — so the natural ramp value put 34px between
  thousand-pixel blocks. Do not "fix" the floors to match the ceilings' ratio.
- **A ruled boundary is not a block gap plus a rule.** Six blocks across four sections close
  themselves with `margin-top / padding-top / border-top`. The padding below the rule used to be
  a literal, and a different one each time (30, 34, 36, 46×3), stacked on top of a full block
  step — 118px in the studio. It is now `--space-group` above and `--space-rule` below. The rule
  does the dividing, so the whitespace does not have to.

### Note: the map and bestiary no longer scroll sideways

An older handover said they were pinned to 720px and scrolled horizontally behind a mask. That
is **no longer true** — both now stack into one-per-row vertical forms below 860. The mask and
the sideways scroll are gone. `Bestiary.jsx` renders `<Stack>`; `CursedPath.jsx` renders a
vertical road.

---

## 5. What is on this branch

Full list: `git log --oneline origin/main..HEAD` (22 commits). The recent ones:

| commit | what |
|---|---|
| `59cceba` | Stop the page working when nothing is happening |
| `7c22c91` | Tighten the rhythm where the page had gone hollow |
| `2d8814b` | Let ash fall down the whole page |
| `f30ccd6` | Collapse the top bar before it runs out of room |
| `8d2806d` | Give the gilded headings room for their descenders |
| `c2c4847` | Put the gate back beside the copy, and stop scaling it |
| `cf9585c` | Polish: share the scroll cue, and make it reachable |
| `034485d` | Give the gate the second screen, and open it as you walk in |
| `80d95d9` | Polish: finish the migrations the last four commits started |
| `a85f19c` | Give the phone its own layout instead of a squeezed desktop one |

Worth knowing:

- **`src/components/Elements/Gate.jsx`** — a timber village gate under a shingled roof, with a
  hanging "Waybound" sign, lanterns, banners, palisade and a lit village down the road. It sits
  in a column beside the synopsis in `AboutGame.jsx`. It opens itself once on entering view
  (`RESTING_OPEN`, `OPEN_MS`) — no scroll driving, no scaling, deliberately (see §3
  Performance). The doors are a true perspective projection (`doorPoint` / `doorPaths`), not a
  `scaleX`, so they form a real trapezoid.
- **`src/components/Elements/ScrollCue.jsx`** — the shared scroll cue used by the hero. Passes
  `href` so it is focusable.
- **`src/components/Elements/Horizon.jsx`** — carries the hero's light across the seam into
  section 01. The hero has to clip itself, so everything it paints used to stop on one straight
  line the full width of the page (measured `#03050A` → `#0B0E14` in a single pixel row, with the
  village bloom at its brightest right on the cut). This is a **zero-height marker rendered
  between `<Hero />` and `<AboutGame />` in `Landing.jsx`** — not a band inside either section —
  so it stays welded to the seam whatever the hero's height resolves to, with nothing to keep in
  sync. It sits at `z-index: -2`, under the ash rather than over it. Worst step across the
  boundary is now 2.2–3.7/255 at every width from 320 to 1920, down from 25.2.
- **`src/components/Elements/Motes.jsx`** — ash falling down the whole page, mounted by
  `Atmosphere.jsx` as its fourth layer (mist, grain, motes, vignette). Fixed to the viewport, so
  its cost does not grow with the document; scroll-coupled through a decaying gust. It is
  deliberately **not** `EmberField` and not worth merging with it — that one is element-scoped,
  rises, and suspends off-screen. Each mote is one pre-rendered sprite drawn with `drawImage`,
  **not** a `createRadialGradient` per mote per frame, and the backing store is capped at 1.5x.
  Verified: same-session A/B over a full-page scroll shows no steady-state frame cost at 1440 or
  390; the only long frames are the first sweep's warm-up.
- **`src/components/Buttons/WishlistButton.jsx`** — the gold CTA. An `<a>`, not a `<button>`, so
  middle-click and "copy link address" work. `SteamMark` is exported and reused by the navbar
  and drawer.
- **`src/components/Sections/Footer.jsx`** — a closing bar only. Its old duplicate socials,
  wishlist link and third tagline were removed deliberately.
- **`scripts/make-og-image.py`** — generates `public/og-image.png` with Pillow. Re-run after any
  change to the wordmark or share copy. Its text is bound by the COPY RULE too.
- **Accessibility already landed**: `--bone-faint` at `#827E73` for contrast; 44px touch targets
  via `::before` overlays (verified by hit-testing); the drawer takes `visibility: hidden` +
  `aria-hidden` when closed so its links leave the tab order; Escape closes it;
  `prefers-reduced-motion` honoured in CSS and via `useReducedMotion()`.

---

## 6. Known outstanding — none of these are assigned

Surfaced to the user; each is waiting on their word. Ask before starting any of them.

1. **The `.font11`–`.font60` ladder** in `src/style/index.css` is the last stepped type scale,
   still snapping at 860 while everything around it eases via `clamp()`. Flagged repeatedly,
   never assigned.
2. **14 dependabot vulnerabilities** on the default branch (12 high, 2 moderate). Pre-existing,
   not introduced by this branch.
3. **Map waypoint labels have an 18.7px ragged left edge** on mobile (118.0 → 136.7), because
   each label hangs off a node that follows the curving road. Arguably intentional.
4. **`.divider` is very faint at wide viewports** — a gradient that is transparent at both ends
   and never stronger than 0.34 alpha. It reads as almost nothing at 1440px, which is part of
   why the space around it used to look like void rather than punctuation. The spacing pass
   left it alone deliberately; nudging its opacity is a separate aesthetic call.

---

## 7. How the responsive audit was done

Worth repeating rather than eyeballing, and it takes minutes to rebuild. Playwright against
the dev server, at 320 / 360 / 390 / 430 / 768 / 860 / 1024 / 1280 / 1440 / 1920, walking the
full page at each width first so every `Reveal` fires. Per width, measure in the page:

- `document.documentElement.scrollWidth` vs viewport width → horizontal overflow
- each `.container`'s content left/right edge → gutter symmetry
- every pair of leaf text boxes for a genuine intersection → overlaps (not adjacency)
- `document.elementFromPoint` probes around each link's centre → real tap area
- computed padding/margin between sections and their children → vertical rhythm
- console + pageerror listeners → runtime errors

Last full run: no overflow, no errors, symmetric gutters, zero overlaps, rhythm exact at all
ten widths.

---

## 8. Before you finish

1. `CI=false npx react-scripts build` must compile clean.
2. Check the widths that matter for what you touched — at minimum 1440, 860, 768 and 390.
3. Commit with a message that says *why*, in the style of the existing log.
4. Push to `website-improvements`; PR #27 updates itself.
5. Update this file if you change anything it describes, and delete it once it is spent.
