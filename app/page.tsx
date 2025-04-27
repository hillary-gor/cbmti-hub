"use client";

import LandingPageHero from "@/components/LandingPageHero";
import Navbar from "@/components/Navbar";
// import Features from './LandingPageFeatures'
// import Testimonials from './LandingPageTestimonials'
// import Footer from './LandingPageFooter'

export default function LandingPageContainer() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <LandingPageHero />

      {/* Future sections */}
      {/* <Features /> */}
      {/* <Testimonials /> */}
      {/* <Footer /> */}
    </main>
  );
}
