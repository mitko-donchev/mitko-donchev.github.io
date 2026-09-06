import useMediaQuery from "./useMediaQuery";

/* True when the visitor has asked their OS to reduce motion. A hook rather than
   a CSS-only guard so animated components can render a meaningful still frame
   instead of an empty one.

   This was its own copy of the matchMedia subscription until useMediaQuery
   arrived wanting exactly the same fifteen lines. */
export default function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
