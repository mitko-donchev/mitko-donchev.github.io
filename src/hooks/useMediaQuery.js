import { useEffect, useState } from "react";

/* True while the given media query matches.

   Most of the site's responsive work belongs in CSS and stays there. This is
   for the two places where a breakpoint has to change what is *rendered*
   rather than how it looks: the map and the bestiary both draw a different
   geometry on a phone — down the page instead of across it — and no amount of
   CSS turns a horizontal SVG into a vertical one.

   Mirrors useReducedMotion so both read the same way at the call site. */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    // Sync once on mount: the query can have changed between the initial
    // state and the effect running, and on the server it started false.
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
