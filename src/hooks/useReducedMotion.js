import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/* True when the visitor has asked their OS to reduce motion. A hook rather than
   a CSS-only guard so animated components can render a meaningful still frame
   instead of an empty one. */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
