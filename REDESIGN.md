# Epic Millennium — Website Redesign Spec

> **Purpose of this document.** This is an implementation brief for coding agents (Sonnet).
> It describes rebranding the existing site from a *mobile-app-dev agency* into
> **Epic Millennium — an indie game studio**, whose debut title is **Project Zero**
> (working title, real name TBD). Follow the phases and per-file instructions below.
> When a detail is not specified, prefer the smallest change that satisfies the intent
> and match the existing code style.

---

## 1. Brand & Positioning

| Field | Value |
|---|---|
| Studio name | **Epic Millennium** |
| Type | Indie game studio |
| Mission (tagline) | **"Built by gamers. Made for gamers."** |
| Mission (expanded) | *Epic Millennium is an independent studio building the games we always wanted to play. No publishers dictating the vision, no compromises — just games crafted by players, for players.* |
| Debut game | **Project Zero** *(working title — real name TBD)* |
| Release date | **TBD** |
| Demo | **Demo coming soon** |
| Platform | **Steam** (Wishlist now) |
| Domain | `www.epicmillennium.com` (unchanged) |

### Copy rules
- Always show Project Zero's name with a "working title" qualifier at least once per page (e.g. a small caption under the hero title, or an asterisk footnote).
- Never invent a concrete release date or price. Use "TBD", "Coming soon", or "Wishlist to be notified".
- Voice: confident, player-first, a little rebellious. Short punchy sentences. Avoid corporate/agency language ("solutions", "leverage", "clients", "business needs") — all of that must be removed.

### Placeholder links (make these easy to swap later)
Define these once as constants (see §4.1) so a single edit updates the whole site:
- `STEAM_URL` — Steam store/wishlist page. Placeholder: `https://store.steampowered.com/` (leave a `TODO` comment).
- `DISCORD_URL`, `TWITTER_URL` (X), `YOUTUBE_URL` — social. Placeholders `#` with `TODO`.
- `TRAILER_URL` — YouTube trailer for the "Watch Trailer" CTA. Placeholder `#` with `TODO`.

---

## 2. Tech Stack (unchanged — do NOT migrate frameworks)

- Create React App (`react-scripts` 5), React 18.
- `styled-components` v6 for styling + a global stylesheet at `src/style/index.css`.
- `react-scroll` for smooth in-page anchor navigation.
- `react-helmet` for `<head>` tags.
- `emailjs-com` + `react-google-recaptcha-v3` for the contact/newsletter form.
- `react-slick` / `slick-carousel` available (used by sliders — may be reused for a screenshot carousel).
- Deployed to GitHub Pages (`npm run deploy`), custom domain via `public/CNAME`.

**Constraints:** Keep it a static single-page app. No routing library, no backend, no new heavy deps unless explicitly noted. Keep the build green (`npm run build`).

---

## 3. Visual Design System — "Dark Neon / Cyber"

Replace the current light/purple agency theme with a dark neon theme. Update the color
helper classes in `src/style/index.css` and introduce design tokens.

### 3.1 Color tokens
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0A0A0F` | Page background (near-black) |
| `--bg-elevated` | `#14141C` | Cards, elevated surfaces |
| `--bg-alt` | `#1B1B27` | Alternating section background |
| `--text` | `#F5F5FA` | Primary text on dark |
| `--text-muted` | `#A0A0B8` | Secondary/body text |
| `--accent` | `#7C3AED` | Primary accent (electric purple) |
| `--accent-2` | `#22D3EE` | Secondary accent (cyan) |
| `--accent-glow` | `rgba(124,58,237,0.45)` | Glow/box-shadow color |
| `--border` | `rgba(255,255,255,0.08)` | Hairline borders on dark |

> The existing accent `#7620FF` is close to `--accent` — you may keep purple as the primary and add cyan as the secondary highlight. Reuse the existing `.purpleColor`/`.purpleBg` helpers but repoint them to `--accent`.

### 3.2 Global CSS changes (`src/style/index.css`)
- Set `body { background: var(--bg); color: var(--text); }`.
- Update the color/background helper classes:
  - `.darkBg` → `var(--bg)`, `.lightBg` → `var(--bg-alt)` (used for alternating sections), `.whiteBg` → `var(--bg-elevated)` **or** keep as page bg; audit each usage so sections still alternate visually on a dark theme.
  - `.darkColor` → `var(--text)`, `.greyColor`/body copy → `var(--text-muted)`, `.whiteColor` stays white.
  - `a` default color → `var(--text)`; `a:hover` → `var(--accent-2)`.
- Add utility classes: `.glow` (box-shadow using `--accent-glow`), `.textGradient` (background-clip gradient purple→cyan for headlines), `.neonBorder` (1px border `--border` + subtle inner glow).
- Add a subtle **cyber grid** background option: a reusable class `.gridBg` using a CSS `linear-gradient` grid over `--bg` at low opacity (for the hero). Optional: faint **scanline** overlay via `repeating-linear-gradient` at ~3–4% opacity.
- Keep the existing `.font*`, `.flex*`, `.radius*`, spacing helpers.

### 3.3 Typography
- Replace the body font. Recommended pairing (load via Google Fonts in `src/App.js` Helmet, same pattern as the current Khula link):
  - **Display / headings:** `Orbitron` or `Chakra Petch` (techy, game-poster feel) — weights 600/700.
  - **Body:** `Inter` or `Rajdhani` — weights 400/500/600.
- Update `body { font-family: ... }` and any `'Khula'` references. Remove the Khula `<link>` and the local Khula `.ttf` imports if they are no longer used.
- Headlines may use `.textGradient` + letter-spacing for a game-logo feel.

### 3.4 Buttons (`src/components/Buttons/FullButton.jsx`)
- Repaint to the neon theme: filled variant = `--accent` bg, white text, glow shadow on hover; `border` variant = transparent bg with `--accent-2` border + text.
- Add an optional `glow` prop (default on for primary CTAs) that applies the `--accent-glow` box-shadow and an intensified glow on `:hover`.
- Keep the existing prop API (`title`, `action`, `border`) backward-compatible.

### 3.5 Imagery / assets
- The site will need **placeholder game art**. Do NOT fabricate final art. Instead:
  - Add a `src/assets/img/game/` folder with clearly-named placeholder files referenced in code: `key-art.png` (hero), `screenshot-1..4.png`, `logo-project-zero.png`.
  - If placeholder image files are not provided, render a styled placeholder block (dark panel with `--accent` border + centered "Key art — TBD" label) so the layout is complete without binary assets. Leave `TODO` comments where real art should drop in.
- Update the favicon / `apple-touch-icon` / `android-chrome-*` and `manifest.json` theme colors to the dark theme (`theme_color` → `#0A0A0F` or `--accent`). Actual icon art is a follow-up; just wire the metadata.

---

## 4. Page Structure

Single page, section-scroll navigation (keep `react-scroll`). New section order in
`src/screens/Landing.jsx`:

```
<TopNavbar />
<Hero />          (was Header)
<AboutGame />     (new)
<Features />      (was Services)
<Media />         (optional screenshot/trailer strip — see §5.4)
<Studio />        (new — studio story + team)
<Newsletter />    (was Contact — email signup + demo/launch notify)
<Footer />
```

Remove/retire: `Pricing`, `Projects` (agency portfolio), `Blog` (already commented out),
`ClientSlider`, `PricingTable`, testimonials. See §6 for the deletion list.

### 4.1 Shared config
Create `src/config/links.js` (or `src/constants.js`) exporting the placeholder URLs from
§1 and the game/studio copy strings. All sections import from here so rebranding text and
links live in one place.

---

## 5. Section-by-Section Specs

### 5.1 TopNavbar (`src/components/Nav/TopNavbar.jsx`) + Sidebar (`src/components/Nav/Sidebar.jsx`)
- Nav links → `Home`, `Game`, `Features`, `Studio`, and a right-aligned **primary CTA button "Wishlist on Steam"** (opens `STEAM_URL` in a new tab; this replaces "Check offers" which scrolled to pricing).
- Logo: keep the `Logo` component + "Epic Millennium" wordmark, restyled for dark bg (white/gradient text).
- Navbar background → `--bg` with a hairline bottom border (`--border`) and slight blur/opacity when scrolled (the existing scroll-shrink behavior stays).
- Mirror the same links/CTA in the mobile `Sidebar`.
- Update anchor `to=` targets to match new section ids: `home`, `game`, `features`, `studio`, `newsletter`.

### 5.2 Hero (rename `Header.jsx` → `Hero.jsx`, section id `home`)
- **Left:** game logo/wordmark for **Project Zero** (image or `.textGradient` headline), a short tagline, and the "working title" qualifier caption. Buttons row:
  - Primary: **"Wishlist on Steam"** → `STEAM_URL` (new tab), `glow` on.
  - Secondary (`border`): **"Watch Trailer"** → `TRAILER_URL` (new tab, or open a modal — modal optional).
  - A small **"Demo coming soon"** badge/pill near the buttons.
- **Right:** full-bleed **key art** (`key-art.png` placeholder or styled placeholder block) with the cyber-grid + subtle glow behind it. Reuse/keep the `Dots` decorative SVG if it still fits; drop the quote/testimonial block (already commented out).
- Apply `.gridBg` (+ optional scanlines) to the hero wrapper.
- Remove the old "Creating innovative mobile apps" copy entirely.

### 5.3 AboutGame (new section, id `game`)
- Heading e.g. **"Project Zero"** with working-title note, genre line (placeholder: *"Genre TBD"* or a chosen genre if you want — keep it generic/atmospheric).
- 2–3 short paragraphs of atmospheric synopsis (placeholder copy, clearly marked, player-first tone — no lorem ipsum; write evocative but generic teaser text that the owner can replace).
- Status row of pills/cards: **Release: TBD**, **Demo: Coming soon**, **Platform: Steam**.
- CTA: "Wishlist on Steam".
- Layout: reuse the two-column `Advertising`/image-beside-text pattern already present in `Services.jsx`/`Projects.jsx` so you can adapt existing styled-components rather than build from scratch.

### 5.4 Features (rename `Services.jsx` → `Features.jsx`, id `features`)
- Reframe the 4 `ServiceBox` cards as **gameplay pillars / key features** of Project Zero. Placeholder pillar ideas (owner will refine): e.g. *"Handcrafted worlds"*, *"Fluid combat"*, *"Choices that matter"*, *"Built with the community"*. Keep it to 3–4 cards.
- Swap the `ServiceBox` icons (`src/assets/svg/Services/*`) for game-appropriate ones. You may reuse existing SVGs that fit (e.g. `RollerIcon`, `MonitorIcon`) or add simple new inline SVGs. Icons should be tinted with `--accent`/`--accent-2`.
- Remove the `ClientSlider` (agency client logos) from the top of this section.
- The "Even the wildest ideas… imagined by you" advertising block → repurpose as a short **"From gamers, for gamers"** teaser OR remove; if kept, restyle to dark neon and point its CTA to Steam.
- **Optional Media strip:** if time allows, add a horizontal **screenshot carousel** (reuse `react-slick` like the removed `ClientSlider`) showing `screenshot-1..4.png` placeholders. Otherwise a simple responsive grid of 3–4 placeholder screenshot panels.

### 5.5 Studio (new section, id `studio`)
- Heading: **"Built by gamers. Made for gamers."**
- The expanded mission paragraph from §1.
- Optional: a compact "The team" row (avatars/placeholder blocks + roles) — keep generic; no fabricated names. A single "A small, independent team" blurb is acceptable if team info is TBD.
- Social row: Discord / X / YouTube icon links (placeholder URLs).

### 5.6 Newsletter (adapt `Contact.jsx` → `Newsletter.jsx`, id `newsletter`)
- Reframe as **"Get notified"** — sign up for demo drop + launch news. Keep the existing
  EmailJS + reCAPTCHA plumbing intact (env vars: `REACT_APP_RECAPTCHA_KEY`,
  `REACT_APP_SERVICE_ID`, `REACT_APP_TEMPLATE_ID`, `REACT_APP_USER_ID`).
- Simplify fields to **Email** (required) + optional **Name** and a **Message** textarea, or keep the full form — but change the heading/subcopy to newsletter/notify framing.
- **Bug to fix while here:** remove the stray `debugger;` statement in `handleSubmit` (`Contact.jsx:92`).
- Restyle inputs for dark theme: transparent bg, `--border` bottom border, `--accent-2` focus state, `--text` input color (the current `-webkit-text-fill-color:#fff` autofill rule already assumes dark-ish; verify contrast). Success/error messages restyled for dark bg.
- Primary submit button → neon CTA.
- Drop the unused commented-out contact images or replace with a small "join the Discord" cross-promo.

### 5.7 Footer (`src/components/Sections/Footer.jsx`)
- Keep logo + "Epic Millennium" + dynamic year + "Back to top".
- Update tagline to studio voice; add the social icon row (Discord/X/YouTube) and a "Wishlist on Steam" text link.
- Ensure it reads correctly on `--bg` (it already uses `darkBg`, which now maps to the page bg — give it a top border `--border` to separate from the section above).

---

## 6. File-Level Task List

### Rename / repurpose
| Current | Action |
|---|---|
| `src/components/Sections/Header.jsx` | Rename → `Hero.jsx`, rewrite per §5.2 |
| `src/components/Sections/Services.jsx` | Rename → `Features.jsx`, rewrite per §5.4 |
| `src/components/Sections/Contact.jsx` | Rename → `Newsletter.jsx`, adapt per §5.6 |
| `src/components/Elements/ServiceBox.jsx` | Reuse as feature/pillar card (restyle) |

### New files
- `src/config/links.js` — shared URLs + copy constants (§4.1)
- `src/components/Sections/AboutGame.jsx` — §5.3
- `src/components/Sections/Studio.jsx` — §5.5
- (optional) `src/components/Sections/Media.jsx` or a screenshot carousel element
- `src/assets/img/game/` — placeholder art (or styled placeholders in code)

### Delete / retire (remove imports + usage; delete file if fully unused)
- `src/components/Sections/Pricing.jsx` and `src/components/Elements/PricingTable.jsx`
- `src/components/Sections/Projects.jsx` and `src/components/Elements/ProjectBox.jsx` (agency portfolio — remove; the game gets its own About/Media sections)
- `src/components/Sections/Blog.jsx` and `src/components/Elements/BlogBox.jsx` (already unused)
- `src/components/Elements/ClientSlider.jsx`, `TestimonialSlider.jsx`, `TestimonialBox.jsx`
- Associated assets no longer referenced: `src/assets/img/clients/*`, `src/assets/img/projects/*`, `src/assets/img/add/*`, `contact-*.png`, `cross-platform.png`, `header-img.png` (verify each is unreferenced before deleting). Do a repo-wide grep for each import before removing.

> After deletions, run a search for dangling imports and remove them. `npm run build` must pass with no unused-import errors.

### Edit
- `src/screens/Landing.jsx` — new section composition (§4)
- `src/components/Nav/TopNavbar.jsx` + `Sidebar.jsx` — new nav + Steam CTA (§5.1)
- `src/components/Buttons/FullButton.jsx` — neon restyle + `glow` prop (§3.4)
- `src/style/index.css` — tokens, dark theme, utilities (§3.2)
- `src/App.js` — swap Google Fonts link to new typeface(s) (§3.3)
- `public/index.html` — `<title>` (already "Epic Millennium"; refine to e.g. `Epic Millennium — Project Zero`), `meta name="description"` (replace the CRA default with a real game/studio description), `theme-color` → `#0A0A0F`
- `public/manifest.json` — `name`/`short_name` (drop "Producing innovative mobile applications"; use studio/game tagline), `theme_color`/`background_color` to dark
- `package.json` — `name` is already `epic-millennium-web` (fine); no version bump required unless you choose to.

---

## 7. SEO / Metadata / Social

- `<title>`: `Epic Millennium — Project Zero (Working Title)`
- `meta description`: e.g. *"Epic Millennium is an indie game studio. Our debut game, Project Zero, is coming to Steam — wishlist now and get notified when the demo drops."*
- Add Open Graph + Twitter Card tags (via `react-helmet` in `App.js` or `index.html`): `og:title`, `og:description`, `og:image` (point to a `public/og-image.png` placeholder), `og:type=website`, `og:url=https://www.epicmillennium.com`, `twitter:card=summary_large_image`.
- Keep `public/CNAME` (`www.epicmillennium.com`) and `public/robots.txt` as-is.

---

## 8. Accessibility & Quality Bar

- Maintain WCAG AA contrast on the dark theme (`--text` on `--bg` passes; check `--text-muted` and accent-on-dark for body-size text).
- All interactive elements keyboard-focusable with a visible `:focus-visible` outline (use `--accent-2`).
- All `<img>` need meaningful `alt` (placeholders: `"Project Zero key art (placeholder)"` etc.).
- External links (`STEAM_URL`, socials, trailer): `target="_blank"` + `rel="noopener noreferrer"`.
- Respect `prefers-reduced-motion`: gate any glow pulse / scanline animation behind it.
- Responsive: verify hero, feature grid, and forms at 360px, 768px, 1200px (existing breakpoints are 860px/760px/560px — reuse them).

---

## 9. Suggested Implementation Order (for agents)

1. **Foundation:** `src/style/index.css` tokens + dark theme, `src/config/links.js`, fonts in `App.js`, `FullButton` restyle. (Build stays green.)
2. **Navigation:** `TopNavbar` + `Sidebar` with new links + Steam CTA.
3. **Hero:** rewrite `Header.jsx` → `Hero.jsx`.
4. **New content sections:** `AboutGame`, `Features` (from `Services`), `Studio`.
5. **Newsletter:** adapt `Contact.jsx`, fix `debugger;`, restyle.
6. **Footer** + metadata (`index.html`, `manifest.json`, OG tags).
7. **Cleanup:** delete retired files/assets, remove dangling imports, `npm run build`.
8. **QA pass:** responsive + a11y + contrast + external-link attrs.

## 10. Definition of Done

- [ ] No agency language ("solutions", "clients", "pricing", "mobile apps") anywhere in rendered copy.
- [ ] Hero leads with Project Zero + "Wishlist on Steam" + "Demo coming soon".
- [ ] Dark neon theme applied consistently; no leftover light backgrounds.
- [ ] All placeholder links/copy centralized in `src/config/links.js` with `TODO`s.
- [ ] `Pricing`, `Projects`, `Blog`, testimonial/client components removed; no dead imports.
- [ ] `debugger;` removed from the form handler.
- [ ] `npm run build` passes clean.
- [ ] Metadata (title/description/OG/manifest/theme-color) reflects the game studio.
- [ ] Responsive + keyboard-accessible + AA contrast verified.

---

### Notes for the owner (fill in later — not agent work)
- Replace all `TODO` placeholder URLs (Steam, Discord, X, YouTube, trailer).
- Drop in real key art, screenshots, Project Zero logo, favicon set, and `og-image.png`.
- Finalize Project Zero's real name, genre, synopsis, release/demo timing.
- Confirm final font pairing.
