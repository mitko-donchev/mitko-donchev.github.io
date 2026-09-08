/* Takes down the title card in public/index.html.
 *
 * Called from a mount effect rather than from index.js, because that runs
 * before React has committed anything: removing the card there would show a
 * blank page for however long the first render takes, which is the problem
 * the card exists to solve.
 *
 * Fades rather than cuts, and removes the node afterwards so nothing is left
 * holding a full-viewport layer. Idempotent — the class guard means a second
 * call during a fast refresh cannot start a second timer. */
const FADE_MS = 620;

export default function dismissFirstLight() {
  const card = document.getElementById("firstlight");
  if (!card || card.classList.contains("is-gone")) return;
  card.classList.add("is-gone");
  window.setTimeout(() => card.remove(), FADE_MS + 60);
}
