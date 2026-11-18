"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DeadlockWordmark } from "./logo/DeadlockWordmark";
import { soundManager } from "@/lib/audio";
import { Volume2, VolumeX } from "lucide-react";

export const Header: React.FC = () => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsAudioActive(soundManager.isEnabled());

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const newState = soundManager.toggle();
    setIsAudioActive(newState);
  };

  const handleLinkHover = () => {
    soundManager.playHoverBlip();
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#070709]/85 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark & Icon */}
        <Link
          href="/"
          className="group flex items-center gap-2 cursor-pointer focus:outline-none"
          onClick={() => soundManager.playMechanicalLock()}
          onMouseEnter={handleLinkHover}
          data-cursor="DEADLOCK"
        >
          <DeadlockWordmark
            height={22}
            variant="default"
            withIcon={true}
            className="transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Technical Nav Links (01/ 02/ 03/ 04/ ArtCraft Reference System) */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[12px] tracking-wider">
          <Link
            href="#projects"
            onMouseEnter={handleLinkHover}
            className="text-[#8A8A93] hover:text-[#C6FF3D] transition-colors duration-200 flex items-center gap-1.5"
            data-cursor="VIEW"
          >
            <span className="text-[#56565F] text-[10px]">01/</span> WORK
          </Link>
          <Link
            href="#services"
            onMouseEnter={handleLinkHover}
            className="text-[#8A8A93] hover:text-[#C6FF3D] transition-colors duration-200 flex items-center gap-1.5"
            data-cursor="EXPLORE"
          >
            <span className="text-[#56565F] text-[10px]">02/</span> SERVICES
          </Link>
          <Link
            href="#process"
            onMouseEnter={handleLinkHover}
            className="text-[#8A8A93] hover:text-[#C6FF3D] transition-colors duration-200 flex items-center gap-1.5"
            data-cursor="INSPECT"
          >
            <span className="text-[#56565F] text-[10px]">03/</span> PROCESS
          </Link>
          <Link
            href="#manifesto"
            onMouseEnter={handleLinkHover}
            className="text-[#8A8A93] hover:text-[#C6FF3D] transition-colors duration-200 flex items-center gap-1.5"
            data-cursor="READ"
          >
            <span className="text-[#56565F] text-[10px]">04/</span> MANIFESTO
          </Link>
        </nav>

        {/* Right HUD Controls: Audio toggle & Contact Action */}
        <div className="flex items-center gap-4">
          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            onMouseEnter={handleLinkHover}
            data-cursor="AUDIO"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0F0F13]/70 hover:border-[#C6FF3D]/40 text-[11px] font-mono transition-all duration-200 text-[#8A8A93] hover:text-[#F4F4F0]"
            title="Toggle synthesized tactile audio"
          >
            {isAudioActive ? (
              <>
                <Volume2 size={13} className="text-[#C6FF3D]" />
                <span className="text-[#C6FF3D] hidden sm:inline">SOUND: ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-[#56565F]" />
                <span className="text-[#56565F] hidden sm:inline">SOUND: OFF</span>
              </>
            )}
          </button>

          {/* Primary Magnetic CTA */}
          <Link
            href="#contact"
            onMouseEnter={handleLinkHover}
            data-cursor="CONTACT"
            className="relative group inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#0F0F13] border border-[rgba(255,255,255,0.12)] hover:border-[#C6FF3D] transition-all duration-300 font-mono text-[11px] tracking-widest uppercase overflow-hidden"
          >
            <span className="absolute inset-0 bg-[#C6FF3D] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 text-[#F4F4F0] group-hover:text-[#070709] font-medium transition-colors duration-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] group-hover:bg-[#070709] transition-colors" />
              INITIATE
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
