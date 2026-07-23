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
        <meta name="theme-color" content="#0A0A0F" />

        {/* Google Fonts: Orbitron (display) + Rajdhani (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

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
