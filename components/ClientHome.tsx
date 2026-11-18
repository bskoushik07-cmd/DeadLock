"use client";

import React, { useState } from "react";
import { Preloader } from "@/components/preloader/Preloader";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectShowcase, ProjectData } from "@/components/showcase/ProjectShowcase";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

interface ClientHomeProps {
  initialProjects: ProjectData[];
}

export const ClientHome: React.FC<ClientHomeProps> = ({ initialProjects }) => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#070709] text-[#F4F4F0] overflow-hidden">
      {/* Cinematic Logo Preloader */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Persistent Navigation Header */}
      <Header />

      {/* Hero Section with WebGL Noise Shader & 3D Shackle Emblem */}
      <HeroSection ready={preloaderDone} />

      {/* 01/ Horizontal Pinned WebGL Showcase Gallery */}
      <ProjectShowcase projects={initialProjects} />

      {/* 02/ Pinned Scroll Manifesto with Morphing 3D Particles */}
      <ManifestoSection />

      {/* 03/ Numbered Editorial Services with Floating WebGL Previews */}
      <ServicesSection />

      {/* 04/ Scroll-Driven 3D Process Timeline */}
      <ProcessSection />

      {/* 05/ Orbiting 3D Tech Ring & Telemetry Counters */}
      <StatsSection />

      {/* 06/ Monolithic Contact Section with Proximity Shader & DB Form */}
      <ContactSection />

      {/* Footer with Glitch Wordmark & International Clocks */}
      <Footer />
    </main>
  );
};
