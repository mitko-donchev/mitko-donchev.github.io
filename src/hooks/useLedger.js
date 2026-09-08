import { useEffect, useState } from "react";
import { openLedger, markDepth } from "../lib/ledger";

/* Reads the book's record of this visitor, once, on mount.
 *
 * Returns null on the first render and for anyone whose storage is
 * unavailable, so every consumer has to render sensibly without it — which
 * is also what makes this safe: with no record the book looks exactly as it
 * did before the feature existed. */
export function useLedger() {
  const [record, setRecord] = useState(null);
  useEffect(() => {
    setRecord(openLedger());
  }, []);
  return record;
}

/* Notes how far down the page they got. Lives at the page level rather than
   inside the book, because the book is a drawing three screens down and the
   road behind you is not its business to measure — and if the sections are
   ever lazily mounted, a recorder living in one of them would start late.
 *
 * The listener does arithmetic and a comparison, nothing else: no state, no
 * DOM write, no layout read. scrollHeight is cached and refreshed on resize
 * rather than read per event, so a scroll cannot force a layout.
 *
 * The write happens on the way out. pagehide is the one that fires reliably
 * on mobile, where tabs are frozen rather than unloaded and `unload` never
 * comes; visibilitychange covers switching away without closing. */
export function useDepthRecorder() {
  useEffect(() => {
    let height = document.documentElement.scrollHeight;
    let deepest = 0;

    const sample = () => {
      if (height <= 0) return;
      const seen = (window.scrollY + window.innerHeight) / height;
      if (seen > deepest) deepest = seen;
    };

    const onResize = () => {
      height = document.documentElement.scrollHeight;
      sample();
    };

    const commit = () => markDepth(deepest);
    const onHide = () => { if (document.hidden) commit(); };

    sample();
    window.addEventListener("scroll", sample, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pagehide", commit);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      commit();
      window.removeEventListener("scroll", sample);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pagehide", commit);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);
}
