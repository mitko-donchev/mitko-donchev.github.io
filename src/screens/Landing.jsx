import React from "react";
// Sections
import TopNavbar from "../components/Nav/TopNavbar";
import Hero from "../components/Sections/Hero";
import AboutGame from "../components/Sections/AboutGame";
import Features from "../components/Sections/Features";
import Studio from "../components/Sections/Studio";
import Footer from "../components/Sections/Footer";
// Elements
import Atmosphere from "../components/Elements/Atmosphere";
import Horizon from "../components/Elements/Horizon";
import ScrollProgress from "../components/Elements/ScrollProgress";
// Hooks
import { useDepthRecorder } from "../hooks/useLedger";
import useAwayTitle from "../hooks/useAwayTitle";
// Config
import { AWAY_TITLE, SITE_TITLE } from "../config/links";

export default function Landing() {
  /* How far down the road they got, for the book to record. Page level, not
     inside the book — see useLedger. */
  useDepthRecorder();
  useAwayTitle(AWAY_TITLE, SITE_TITLE);

  return (
    <>
      {/* Mounted once, behind everything: the page has one sky, not one per
          section. */}
      <Atmosphere />
      <ScrollProgress />
      <TopNavbar />
      <main>
        <Hero />
        {/* The hero clips itself, so its light has to be carried across the
            seam by hand. Sits between the two on purpose — see Horizon. */}
        <Horizon />
        <AboutGame />
        <Features />
        <Studio />
      </main>
      <Footer />
    </>
  );
}
