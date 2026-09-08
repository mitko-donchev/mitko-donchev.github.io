import { useEffect } from "react";

/* One line while you are looking somewhere else, and the real title back the
   moment you return. Cheap — a single visibilitychange listener, no timers,
   no work while hidden — and for a game about a road you keep ending up on,
   the tab noticing you left is the right kind of small.
 *
 * Deliberately singular: it says one thing, once, and never escalates. The
 * version of this trick that cycles messages or begs you to come back is the
 * reason people hate the version of this trick that cycles messages. */
export default function useAwayTitle(away, home) {
  useEffect(() => {
    if (!away || !home) return undefined;
    const onChange = () => {
      document.title = document.hidden ? away : home;
    };
    document.addEventListener("visibilitychange", onChange);
    return () => {
      document.removeEventListener("visibilitychange", onChange);
      document.title = home;
    };
  }, [away, home]);
}
