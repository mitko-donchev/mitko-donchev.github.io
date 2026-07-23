import React from "react";
// Sections
import TopNavbar from "../components/Nav/TopNavbar";
import Hero from "../components/Sections/Hero";
import AboutGame from "../components/Sections/AboutGame";
import Features from "../components/Sections/Features";
import Studio from "../components/Sections/Studio";
import Footer from "../components/Sections/Footer";

export default function Landing() {
  return (
    <>
      <TopNavbar />
      <Hero />
      <AboutGame />
      <Features />
      <Studio />
      <Footer />
    </>
  );
}
