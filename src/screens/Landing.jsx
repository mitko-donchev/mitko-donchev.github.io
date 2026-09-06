import React from "react";
// Sections
import TopNavbar from "../components/Nav/TopNavbar";
import Hero from "../components/Sections/Hero";
import Threshold from "../components/Sections/Threshold";
import AboutGame from "../components/Sections/AboutGame";
import Features from "../components/Sections/Features";
import Studio from "../components/Sections/Studio";
import Footer from "../components/Sections/Footer";
// Elements
import Atmosphere from "../components/Elements/Atmosphere";
import ScrollProgress from "../components/Elements/ScrollProgress";

export default function Landing() {
  return (
    <>
      {/* Mounted once, behind everything: the page has one sky, not one per
          section. */}
      <Atmosphere />
      <ScrollProgress />
      <TopNavbar />
      <main>
        <Hero />
        {/* The gate, and walking through it. Between the cold open and the
            section that starts explaining things. */}
        <Threshold />
        <AboutGame />
        <Features />
        <Studio />
      </main>
      <Footer />
    </>
  );
}
