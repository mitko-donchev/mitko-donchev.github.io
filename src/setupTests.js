import "@testing-library/jest-dom";

/* jsdom implements neither of these, and the site leans on both: every section
   reveals on an IntersectionObserver and several components ask for the
   reduced-motion preference before they decide what to animate. Without these
   a render throws before a single assertion runs. */
class NoopObserver {
  constructor(callback) { this.callback = callback; }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
global.IntersectionObserver = NoopObserver;
global.ResizeObserver = NoopObserver;

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return false; },
  });
}

// Ambience builds one of these on a click. Nothing in the tests clicks it, but
// a component that touches the constructor at module scope should not explode.
if (!window.AudioContext) {
  window.AudioContext = class { constructor() { throw new Error("no audio in jsdom"); } };
}

window.scrollTo = () => {};

/* jsdom has no SVG geometry engine. CursedPath measures the drawn road with
   getTotalLength to derive its own scale, and Book asks for a bounding box.
   Neither exists here, so stand in for them — the numbers only need to be
   finite for the components to survive a render. */
if (window.SVGElement) {
  window.SVGElement.prototype.getTotalLength = function () { return 1000; };
  window.SVGElement.prototype.getPointAtLength = function () { return { x: 0, y: 0 }; };
  window.SVGElement.prototype.getBBox = function () {
    return { x: 0, y: 0, width: 100, height: 100 };
  };
}

/* jsdom ships no canvas, and calling getContext logs a "not implemented"
   error. Motes and EmberField both guard against a null context already, so
   returning null here would be honest — but it would also mean their drawing
   code never runs in a test. A no-op context exercises it instead, which is
   how a mistyped canvas call gets caught. */
if (window.HTMLCanvasElement) {
  const gradient = { addColorStop() {} };
  const context2d = {
    canvas: null,
    fillStyle: "",
    strokeStyle: "",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    arc() {}, beginPath() {}, closePath() {}, clearRect() {}, fill() {},
    fillRect() {}, stroke() {}, drawImage() {}, save() {}, restore() {},
    translate() {}, scale() {}, setTransform() {}, moveTo() {}, lineTo() {},
    createRadialGradient: () => gradient,
    createLinearGradient: () => gradient,
  };
  window.HTMLCanvasElement.prototype.getContext = function () {
    return { ...context2d, canvas: this };
  };
}
