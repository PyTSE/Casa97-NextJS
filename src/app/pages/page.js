"use client";
import "@/app/globals.css";
import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";

export default function Home() {
  return (
    <>
      <Hero/>
      <Locations/>
      <EventsSection/>
    </>
  );
}
