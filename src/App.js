import React from "react";
// Screens
import Landing from "./screens/Landing.jsx";

/* There is deliberately no <Helmet> here, and no document-level markup at all.
   Every tag it used to write — title, description, Open Graph, Twitter — now
   lives in public/index.html, for two reasons that both cost us once already:

   1. Crawlers and link unfurlers read the served HTML and do not run the
      bundle, so a share card assembled by React is a share card no scraper
      ever sees.
   2. Helmet writes after mount. Anything the browser needs early — the fonts,
      the preloads, the first-light card — has to be in the document the
      parser already has.

   The static head is now the only place these are declared, so there is one
   copy to keep true rather than two that can drift. */
export default function App() {
  return <Landing />;
}
