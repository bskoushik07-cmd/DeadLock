"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DeadlockIcon } from "../logo/DeadlockIcon";
import { soundManager } from "@/lib/audio";
import { ArrowUp, Terminal, Shield } from "lucide-react";

export const Footer: React.FC = () => {
  const [times, setTimes] = useState({
    tokyo: "--:--:--",
    london: "--:--:--",
    newYork: "--:--:--",
    sanFrancisco: "--:--:--",
  });
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        tokyo: now.toLocaleTimeString("en-GB", { timeZone: "Asia/Tokyo", hour12: false }),
        london: now.toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour12: false }),
        newYork: now.toLocaleTimeString("en-GB", { timeZone: "America/New_York", hour12: false }),
        sanFrancisco: now.toLocaleTimeString("en-GB", { timeZone: "America/Los_Angeles", hour12: false }),
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundManager.playMechanicalLock();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#070709] border-t border-[rgba(255,255,255,0.08)] pt-20 pb-12 px-6 sm:px-12 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* International Clocks Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.06)] font-mono text-xs">
          <div>
            <span className="text-[#56565F] text-[10px] uppercase block tracking-wider mb-1">
              TOKYO // JST
            </span>
            <span className="text-[#F4F4F0] font-bold text-sm tabular-nums">{times.tokyo}</span>
          </div>
          <div>
            <span className="text-[#56565F] text-[10px] uppercase block tracking-wider mb-1">
              LONDON // GMT
            </span>
            <span className="text-[#F4F4F0] font-bold text-sm tabular-nums">{times.london}</span>
          </div>
          <div>
            <span className="text-[#56565F] text-[10px] uppercase block tracking-wider mb-1">
              NEW YORK // EST
            </span>
            <span className="text-[#F4F4F0] font-bold text-sm tabular-nums">{times.newYork}</span>
          </div>
          <div>
            <span className="text-[#56565F] text-[10px] uppercase block tracking-wider mb-1">
              SAN FRANCISCO // PST
            </span>
            <span className="text-[#C6FF3D] font-bold text-sm tabular-nums">{times.sanFrancisco}</span>
          </div>
        </div>

        {/* Monolithic Giant DEADLOCK Wordmark with Glitch Hover */}
        <div
          className="relative w-full py-8 text-center cursor-pointer overflow-hidden"
          onMouseEnter={() => {
            setIsGlitching(true);
            soundManager.playHoverBlip();
          }}
          onMouseLeave={() => setIsGlitching(false)}
          onClick={scrollToTop}
          data-cursor="TOP"
        >
          <h2
            className={`text-6xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[170px] font-extrabold tracking-tight font-sans transition-all duration-150 leading-none ${
              isGlitching
                ? "text-[#C6FF3D] translate-x-1 skew-x-2 drop-shadow-[0_0_32px_rgba(198,255,61,0.5)]"
                : "text-[#15151C] hover:text-[#F4F4F0]"
            }`}
          >
            DEADLOCK
          </h2>
          <span className="block mt-2 font-mono text-[11px] text-[#56565F] uppercase tracking-widest">
            CLICK TO DISENGAGE & ASCEND TO TOP
          </span>
        </div>

        {/* Bottom Metadata & Credits Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#8A8A93]">
          <div className="flex items-center gap-3">
            <DeadlockIcon size={20} variant="default" />
            <span className="text-[#F4F4F0] font-semibold">DEADLOCK STUDIO</span>
            <span className="text-[#56565F] hidden sm:inline">|</span>
            <span className="text-[#8A8A93] hidden md:inline">WE BUILD WHAT OTHERS CAN’T UNLOCK</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/deadlock-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6FF3D] transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://twitter.com/deadlock_st"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6FF3D] transition-colors"
            >
              TWITTER
            </a>
            <a
              href="https://linkedin.com/company/deadlock-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6FF3D] transition-colors"
            >
              LINKEDIN
            </a>
            <Link href="/admin" className="hover:text-[#C6FF3D] transition-colors">
              ADMIN
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[#56565F]">
            <span>© 2026 // ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
