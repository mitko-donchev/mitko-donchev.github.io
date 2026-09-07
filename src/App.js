import React from "react";
import { Helmet } from "react-helmet";
// Screens
import Landing from "./screens/Landing.jsx";
// Config
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "./config/links";

export default function App() {
  return (
    <>
      <Helmet>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="theme-color" content="#0B0E14" />

        {/* The fonts are NOT here. Helmet writes its tags after React mounts,
            so a stylesheet declared in this file cannot begin downloading
            until the whole bundle has arrived and run — measured at ~2s into
            a cold load, with the preconnect hints arriving too late to have
            warmed anything. Cormorant Garamond and Inter are requested from
            public/index.html instead, where the parser finds them in the
            first packet. Anything else render-blocking belongs there too. */}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Helmet>
      <Landing />
    </>
  );
}
