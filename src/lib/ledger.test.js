import {
  openLedger,
  markDepth,
  stageFor,
  stageName,
  forecastFor,
  shortDate,
} from "./ledger";

const KEY = "em.ledger.v1";
const MINUTE = 60 * 1000;

beforeEach(() => window.localStorage.clear());

describe("openLedger", () => {
  test("a first visit reports nothing behind them", () => {
    const now = Date.parse("2026-08-12T10:00:00Z");
    expect(openLedger(now)).toEqual({ first: now, visits: 1, deepest: 0, returning: false });
  });

  test("a reload is not a new visit", () => {
    const now = Date.parse("2026-08-12T10:00:00Z");
    openLedger(now);
    const again = openLedger(now + 5 * MINUTE);
    expect(again.visits).toBe(1);
    expect(again.returning).toBe(false);
  });

  test("coming back later is", () => {
    const now = Date.parse("2026-08-12T10:00:00Z");
    openLedger(now);
    const again = openLedger(now + 25 * MINUTE);
    expect(again.visits).toBe(2);
    expect(again.returning).toBe(true);
  });

  test("it reports the road behind them, not the road they are on", () => {
    const now = Date.parse("2026-08-12T10:00:00Z");
    openLedger(now);
    markDepth(0.7);
    // the mark is written, but this visit's own reading is what came before
    expect(openLedger(now + 25 * MINUTE).deepest).toBeCloseTo(0.7);
  });

  test("a record from a future version is ignored rather than trusted", () => {
    window.localStorage.setItem(KEY, JSON.stringify({ v: 99, visits: 400 }));
    expect(openLedger(1).visits).toBe(1);
  });

  test("unreadable storage leaves the page exactly as it was", () => {
    window.localStorage.setItem(KEY, "{not json");
    expect(() => openLedger(1)).not.toThrow();
    expect(openLedger(1).visits).toBe(1);
  });
});

describe("markDepth", () => {
  test("only ever raises the mark", () => {
    openLedger(1);
    markDepth(0.6);
    markDepth(0.2);
    expect(openLedger(1 + 25 * MINUTE).deepest).toBeCloseTo(0.6);
  });

  test("does nothing before there is a record to write on", () => {
    expect(() => markDepth(0.5)).not.toThrow();
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  test("ignores a nonsense reading", () => {
    openLedger(1);
    [0, -1, NaN, undefined].forEach((bad) => markDepth(bad));
    expect(openLedger(1 + 25 * MINUTE).deepest).toBe(0);
  });
});

describe("the road", () => {
  test("each threshold awards the stage it belongs to", () => {
    expect([0, 0.14, 0.15, 0.37, 0.38, 0.61, 0.62, 0.87, 0.88, 1].map(stageFor))
      .toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });

  test("stageName never runs off either end", () => {
    expect(stageName(-5)).toBe("the gate");
    expect(stageName(99)).toBe("the far gate");
  });

  /* This one is a rule, not a detail. The forecast is the book guessing one
     place further than you have been; at the end of the road the only place
     left to name is the one the game is saving for itself. An absence there
     is the point. */
  test("the forecast stops at the end of the road", () => {
    expect(forecastFor(0)).toBe("the wood");
    expect(forecastFor(0.62)).toBe("the far gate");
    expect(forecastFor(0.88)).toBeNull();
    expect(forecastFor(1)).toBeNull();
  });
});

describe("shortDate", () => {
  test("reads as a hand wrote it", () => {
    expect(shortDate(new Date(2026, 7, 12).getTime())).toBe("12 aug");
  });

  test("a broken timestamp prints nothing rather than 'Invalid Date'", () => {
    expect(shortDate(NaN)).toBe("");
    expect(shortDate(undefined)).toBe("");
  });
});
