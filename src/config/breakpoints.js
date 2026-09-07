/* The one breakpoint that is structural rather than cosmetic.

   Below it the map and the bestiary stop being wide drawings and become
   vertical ones — a change in what is rendered, not how it looks, so it has
   to be readable from JS as well as from CSS. It was written down twice
   before this file existed, as `(max-width: 860px)` in two components and as
   `max-width: 859px` in index.css, which meant a viewport of exactly 860px
   got the stacked SVGs and the desktop gutters at the same time.

   The other breakpoints in the codebase — 960, 760, 720, 640, 620, 560, 420,
   400 — deliberately stay where they are used. Each marks the width at which
   one component's own content breaks, each is used once or twice, and each is
   explained where it sits. Collecting them here would make them look like a
   scale they are not.

   That claim is only worth as much as its last check, though. The top bar used
   to collapse at 760 on the strength of this comment, and 760 was not where
   its content broke — it needed 788.8px, so 761-788 rendered a two-line navbar
   with iPad portrait sat in the middle of the band. Measure before trusting. */
export const STACK_BREAKPOINT = 860;

export const STACKED = `(max-width: ${STACK_BREAKPOINT}px)`;
