"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { HeroCanvas } from "./HeroCanvas";
import { soundManager } from "@/lib/audio";
import { ArrowDownRight, Terminal, ShieldAlert } from "lucide-react";

interface HeroSectionProps {
  ready?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ ready = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const hudBadgeRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      if (hudBadgeRef.current) {
        tl.from(hudBadgeRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      const chars = containerRef.current?.querySelectorAll(".hero-char");
      if (chars && chars.length > 0) {
        tl.from(
          chars,
          {
            yPercent: 120,
            opacity: 0,
            duration: 0.9,
            stagger: 0.02,
            ease: "expo.out",
          },
          "-=0.4"
        );
      }

      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      if (ctaGroupRef.current) {
        tl.from(
          ctaGroupRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      if (bottomBarRef.current) {
        tl.from(
          bottomBarRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [ready]);

  const splitHeadline = "WE BUILD WHAT OTHERS CAN'T UNLOCK.";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 sm:px-10 overflow-hidden bg-[#070709] select-none"
    >
      {/* Three.js Fluid Noise Shader Canvas & 3D Extruded Clamping Emblem */}
      <HeroCanvas />

      {/* Top HUD Telemetry Row */}
      <div
        ref={hudBadgeRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#8A8A93] border-b border-[rgba(255,255,255,0.06)] pb-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#C6FF3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
            PROTOCOL // 001
          </span>
          <span className="text-[#56565F]">|</span>
          <span className="hidden sm:inline text-[#8A8A93]">ENGINEERED DIGITAL EXPERIENCES</span>
        </div>

        <div className="flex items-center gap-4 text-[#56565F]">
          <span className="flex items-center gap-1 text-[#8A8A93]">
            <Terminal size={12} className="text-[#C6FF3D]" />
            GLSL_v3.0 // SHADER CORE
          </span>
          <span className="hidden md:inline">37.7749° N, 122.4194° W</span>
          <span className="text-[#C6FF3D] bg-[#C6FF3D]/10 px-2 py-0.5 rounded-xs border border-[#C6FF3D]/20">
            60 FPS DYNAMIC
          </span>
        </div>
      </div>

      {/* Center Stage: Giant Editorial Masked Headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 sm:py-12 flex flex-col items-start justify-center">
        {/* Editorial Sub-badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-sm bg-[#0F0F13]/90 border border-[rgba(255,255,255,0.08)] text-[12px] font-mono text-[#8A8A93]">
          <ShieldAlert size={13} className="text-[#C6FF3D]" />
          <span>STUDIO FOR HIGH-STAKES DIGITAL SYSTEMS</span>
        </div>

        {/* Masked Headline with per-character stagger (Left-aligned, leaving right side for 3D Emblem) */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px] font-extrabold tracking-[-0.035em] leading-[0.96] text-[#F4F4F0] max-w-3xl overflow-hidden py-1"
        >
          {splitHeadline.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-3 sm:mr-4">
              {word.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`hero-char inline-block ${
                    word === "UNLOCK." ? "text-[#C6FF3D] drop-shadow-[0_0_24px_rgba(198,255,61,0.35)]" : ""
                  }`}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtitle & Studio Narrative */}
        <p
          ref={subtitleRef}
          className="mt-6 text-base sm:text-lg text-[#8A8A93] max-w-xl font-normal leading-relaxed"
        >
          DEADLOCK is an elite software and motion laboratory. We engineer bespoke WebGL visual engines, high-frequency web applications, and immersive digital platforms for pioneers who refuse conventional templates.
        </p>

        {/* Magnetic Interactive CTA Actions */}
        <div
          ref={ctaGroupRef}
          className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs tracking-wider"
        >
          {/* Main Lime Accent Button */}
          <a
            href="#projects"
            onClick={() => soundManager.playMechanicalLock()}
            data-cursor="UNLOCK"
            className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-[#C6FF3D] text-[#070709] font-bold uppercase rounded-sm shadow-[0_0_24px_-4px_rgba(198,255,61,0.5)] hover:shadow-[0_0_36px_0px_rgba(198,255,61,0.7)] transition-all duration-300"
          >
            <span>UNLOCK ARCHIVE</span>
            <ArrowDownRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
            />
          </a>

          {/* Secondary Raised Obsidian Button */}
          <a
            href="#contact"
            onClick={() => soundManager.playHoverBlip()}
            data-cursor="DISCUSS"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F0F13]/90 text-[#F4F4F0] hover:text-[#C6FF3D] border border-[rgba(255,255,255,0.12)] hover:border-[#C6FF3D]/50 uppercase rounded-sm transition-all duration-300"
          >
            <span>START A PROJECT</span>
          </a>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Scroll Guidance */}
      <div
        ref={bottomBarRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[rgba(255,255,255,0.06)] font-mono text-[11px] text-[#8A8A93]"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D]" />
            <span className="text-[#F4F4F0] font-semibold">Q1/2026 ARCHIVE LIVE</span>
          </div>
          <span className="text-[#56565F] hidden sm:inline">//</span>
          <span className="text-[#8A8A93] hidden md:inline">THREE.JS SHADER & CLUSTER RUNTIME</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#56565F] tracking-widest uppercase">SCROLL TO DISENGAGE SHACKLE</span>
          <div className="w-5 h-8 rounded-full border border-[rgba(255,255,255,0.2)] flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#C6FF3D] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
