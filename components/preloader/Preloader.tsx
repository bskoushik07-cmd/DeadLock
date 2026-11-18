"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { DeadlockIcon } from "../logo/DeadlockIcon";
import { soundManager } from "@/lib/audio";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING ENGINE");
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const lineGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("deadlock_preloader_done")) {
      setIsDone(true);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { val: 0 };

      // Number progression
      gsap.to(obj, {
        val: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const p = Math.floor(obj.val);
          setProgress(p);

          if (p < 30) {
            setStatusText("01/ COMPILING GLSL SHADERS");
          } else if (p < 65) {
            setStatusText("02/ MOUNTING 3D MESH GEOMETRY");
          } else if (p < 90) {
            setStatusText("03/ SYNCHRONIZING TELEMETRY");
          } else {
            setStatusText("04/ ENGAGING DEADLOCK PROTOCOL");
          }
        },
        onComplete: () => {
          triggerExitSequence();
        },
      });

      if (lineGlowRef.current) {
        gsap.to(lineGlowRef.current, {
          opacity: 0.9,
          duration: 0.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    const triggerExitSequence = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("deadlock_preloader_done", "true");
      }
      soundManager.playMechanicalLock();
      onComplete(); // Notify Hero to start reveal immediately

      const exitTl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
        },
      });

      // Fade center content out
      exitTl.to(centerContentRef.current, {
        scale: 1.05,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
      })
      // Split shutter wipe
      .to(topCurtainRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: "expo.inOut",
      }, "-=0.1")
      .to(bottomCurtainRef.current, {
        yPercent: 100,
        duration: 0.75,
        ease: "expo.inOut",
      }, "<");
    };

    return () => ctx.revert();
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden"
    >
      {/* Top Half Curtain */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#070709] border-b border-[rgba(255,255,255,0.08)] z-10"
      />

      {/* Bottom Half Curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#070709] border-t border-[rgba(255,255,255,0.08)] z-10"
      />

      {/* Center Animated Stage */}
      <div
        ref={centerContentRef}
        className="relative z-20 flex flex-col items-center justify-center max-w-md w-full px-8 text-center"
      >
        {/* Top HUD Coordinates */}
        <div className="flex items-center justify-between w-full text-[11px] font-mono tracking-widest text-[#8A8A93] mb-8">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-[#C6FF3D] rounded-full animate-ping" />
            SYS_ONLINE
          </span>
          <span className="text-[#56565F]">37.7749° N, 122.4194° W</span>
        </div>

        {/* Animated Logo Clamping */}
        <div className="relative mb-6">
          <DeadlockIcon
            size={90}
            variant="default"
            animateOnMount={true}
          />
        </div>

        {/* Studio Identifier */}
        <h2 className="text-xl font-bold tracking-[0.25em] text-[#F4F4F0] uppercase mb-2">
          DEADLOCK
        </h2>

        {/* Dynamic Status Text */}
        <p className="text-[12px] font-mono tracking-wider text-[#8A8A93] mb-6 h-5">
          {statusText}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full relative h-[2px] bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden mb-4">
          <div
            ref={lineGlowRef}
            className="absolute top-0 left-0 h-full bg-[#C6FF3D] transition-all duration-75 ease-out shadow-[0_0_12px_#C6FF3D]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-[#8A8A93]">
          <span className="text-[10px] tracking-widest text-[#56565F]">EST. 2026 // STUDIO ARCHIVE</span>
          <span className="text-sm font-semibold text-[#C6FF3D] tabular-nums">
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
