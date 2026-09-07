/* The book's record of this visitor.
 *
 * BOOK_BODY promises a book that "keeps a record — of the days, of the road
 * behind you", and GAME_SUBTITLE says something out here is keeping count.
 * This is the only thing on the site that actually does either. It writes on
 * the three ruled lines Book.jsx already draws empty and calls "waiting".
 *
 * Everything is local. Nothing is sent anywhere, there is no identifier, and
 * a visitor who clears their site data is a first-time visitor again — which
 * is the correct behaviour for a record kept in a book rather than by us.
 *
 * Every entry point is total: storage throws outright in some privacy modes
 * (not "returns null" — throws on access), so a failed read has to leave the
 * page exactly as it was before this file existed.
 */

const KEY = "em.ledger.v1";

/* What counts as arriving again. A reload is not a new visit — otherwise the
   record is just a refresh counter and means nothing — but coming back after
   lunch is. */
const RETURN_AFTER_MS = 20 * 60 * 1000;

/* The road behind you, in the arena's own words. Short forms: the full
   waypoint names are up to 17 characters and the ruled line is 154 units
   wide, which "the skeleton camp" overflows. */
const STAGES = ["the gate", "the wood", "the narrows", "the camp", "the far gate"];

const read = () => {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || value.v !== 1) return null;
    return value;
  } catch (error) {
    return null;
  }
};

const write = (value) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch (error) {
    /* Full, disabled, or blocked. The page does not depend on this. */
  }
};

/* Read the record, note that someone is here, and hand back what the book
   knew *before* this visit — the road behind you, not the road you are on.
   On a first visit that is an empty record, which is the honest answer. */
export function openLedger(now = Date.now()) {
  const previous = read();

  if (!previous) {
    write({ v: 1, first: now, last: now, visits: 1, deepest: 0 });
    return { first: now, visits: 1, deepest: 0, returning: false };
  }

  const returning = now - (previous.last || 0) > RETURN_AFTER_MS;
  const visits = previous.visits + (returning ? 1 : 0);
  write({ ...previous, last: now, visits });

  return {
    first: previous.first,
    visits,
    deepest: previous.deepest || 0,
    returning,
  };
}

/* Called with how far down the page they got, 0..1. Only ever raises the
   mark, and only writes when it has actually moved — this is invoked from a
   pagehide handler, which is not a place to be doing extra work. */
export function markDepth(fraction) {
  if (!(fraction > 0)) return;
  const current = read();
  if (!current) return;
  const next = Math.min(1, fraction);
  if (next <= (current.deepest || 0) + 0.01) return;
  write({ ...current, deepest: next });
}

/* Scroll depth as a place on the road. Deliberately generous at the bottom:
   the footer is unreachable in the sense that nobody scrolls to 1.0, so the
   last stage has to start well before the end or it is never awarded. */
export function stageFor(fraction) {
  if (fraction >= 0.88) return 4;
  if (fraction >= 0.62) return 3;
  if (fraction >= 0.38) return 2;
  if (fraction >= 0.15) return 1;
  return 0;
}

export function stageName(index) {
  return STAGES[Math.max(0, Math.min(STAGES.length - 1, index))];
}

/* The forecast BOOK_BODY mentions: one place further than they have been.
   Returns null at the end of the road on purpose — an absence where the
   forecast should be says more than any line could, and the alternative
   reads as an answer to a question the game has not asked yet. */
export function forecastFor(fraction) {
  const stage = stageFor(fraction);
  if (stage >= STAGES.length - 1) return null;
  return STAGES[stage + 1];
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun",
                "jul", "aug", "sep", "oct", "nov", "dec"];

export function shortDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}
