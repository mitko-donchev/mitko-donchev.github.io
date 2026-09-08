import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { STUDIO_TAGLINE, SITE_TITLE } from "./config/links";

/* A smoke test, not a snapshot. Snapshots of a page this decorative churn on
   every visual change and get regenerated without being read, which makes
   them worse than nothing. These assert things that are supposed to stay
   true no matter how the page looks. */

let errors;
beforeEach(() => {
  window.localStorage.clear();
  errors = [];
  jest.spyOn(console, "error").mockImplementation((...args) => errors.push(args.join(" ")));
  jest.spyOn(console, "warn").mockImplementation((...args) => errors.push(args.join(" ")));
});
afterEach(() => jest.restoreAllMocks());

test("the page renders without React complaining", () => {
  render(<App />);
  expect(errors).toEqual([]);
});

test("there is exactly one first-level heading", () => {
  render(<App />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
});

/* The tagline is the studio's one line. It reads as a promise the first time
   and as filler the second, so it appears once — in Studio, and nowhere else. */
test("the studio tagline appears exactly once", () => {
  const { container } = render(<App />);
  const hits = container.textContent.split(STUDIO_TAGLINE).length - 1;
  expect(hits).toBe(1);
});

test("the site name is on the page", () => {
  const { container } = render(<App />);
  expect(container.textContent).toContain("Waybound");
  expect(SITE_TITLE).toContain("Waybound");
});

/* Every one of these opens a tab we do not control. Without noopener the new
   tab gets a handle on ours and can navigate it somewhere else. */
test("every link that opens a new tab is safe to open", () => {
  const { container } = render(<App />);
  const blank = [...container.querySelectorAll('a[target="_blank"]')];
  expect(blank.length).toBeGreaterThan(0);
  blank.forEach((a) => expect(a.getAttribute("rel") || "").toMatch(/noopener/));
});

/* Decorative images carry alt="", meaningful ones carry words. An image with
   no alt attribute at all is the only wrong answer. */
test("no image is missing an alt attribute", () => {
  const { container } = render(<App />);
  const images = [...container.querySelectorAll("img")];
  expect(images.length).toBeGreaterThan(0);
  images.forEach((img) => expect(img.hasAttribute("alt")).toBe(true));
});

/* The site sells the road, the fight and the craft. It does not tell the
   story. This guards the one thing a player should get to find out for
   themselves — including in alt text and aria-labels, which is where it would
   slip in unnoticed. "Deja vu" is deliberately not on this list: unease is in
   bounds, the explanation is not. */
test("nothing on the page gives the game away", () => {
  const { container } = render(<App />);
  const visible = container.textContent;
  const hidden = [...container.querySelectorAll("[aria-label], img[alt], [title]")]
    .map((el) => `${el.getAttribute("aria-label") || ""} ${el.getAttribute("alt") || ""} ${el.getAttribute("title") || ""}`)
    .join(" ");
  const everything = `${visible} ${hidden}`.toLowerCase();

  ["time loop", "loops", "looping", "reincarnat", "groundhog", "start over again",
   "same day", "relive"].forEach((giveaway) => {
    expect(everything).not.toContain(giveaway);
  });
});
