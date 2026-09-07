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
