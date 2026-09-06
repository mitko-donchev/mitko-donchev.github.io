/* The one breakpoint that is structural rather than cosmetic.

   Below it the map and the bestiary stop being wide drawings and become
   vertical ones — a change in what is rendered, not how it looks, so it has
   to be readable from JS as well as from CSS. It was written down twice
   before this file existed, as `(max-width: 860px)` in two components and as
   `max-width: 859px` in index.css, which meant a viewport of exactly 860px
   got the stacked SVGs and the desktop gutters at the same time.

   The other breakpoints in the codebase — 760, 720, 620, 560, 460, 420, 400 —
   deliberately stay where they are used. Each marks the width at which one
   component's own content breaks, each is used once or twice, and each is
   explained where it sits. Collecting them here would make them look like a
   scale they are not. */
export const STACK_BREAKPOINT = 860;

export const STACKED = `(max-width: ${STACK_BREAKPOINT}px)`;
