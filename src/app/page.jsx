"use client";
import "@/app/globals.css";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";

export default function Home() {
  return (
    <>
      <Hero/>
      <Locations/>
      <EventsSection/>
      <Footer />
    </>
  );
}
