"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface DeadlockIconProps {
  size?: number | string;
  variant?: "default" | "monochrome" | "lime" | "animated";
  className?: string;
  animateOnMount?: boolean;
  onAnimationComplete?: () => void;
}

export const DeadlockIcon: React.FC<DeadlockIconProps> = ({
  size = 48,
  variant = "default",
  className = "",
  animateOnMount = false,
  onAnimationComplete,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const leftHalfRef = useRef<SVGGElement>(null);
  const rightHalfRef = useRef<SVGGElement>(null);
  const coreKeyholeRef = useRef<SVGGElement>(null);
  const shockwaveRef = useRef<SVGCircleElement>(null);
  const glowFilterRef = useRef<SVGFilterElement>(null);

  useEffect(() => {
    if (!animateOnMount || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onAnimationComplete) onAnimationComplete();
        },
      });

      // Initial state: parted halves, hidden shockwave
      gsap.set(leftHalfRef.current, { x: -35, y: -15, opacity: 0 });
      gsap.set(rightHalfRef.current, { x: 35, y: 15, opacity: 0 });
      gsap.set(coreKeyholeRef.current, { scale: 0, transformOrigin: "center center", opacity: 0 });
      gsap.set(shockwaveRef.current, { scale: 0.2, transformOrigin: "center center", opacity: 0 });

      // Step 1: Draw in and slide halves together
      tl.to([leftHalfRef.current, rightHalfRef.current], {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(leftHalfRef.current, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "expo.out",
      }, "-=0.2")
      .to(rightHalfRef.current, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "expo.out",
      }, "<")
      // Step 2: The "CLICK" impact shockwave
      .to(shockwaveRef.current, {
        opacity: 0.9,
        scale: 1,
        duration: 0.05,
      })
      .to(shockwaveRef.current, {
        opacity: 0,
        scale: 2.2,
        duration: 0.45,
        ease: "power3.out",
      })
      // Step 3: Keyhole core ignition
      .to(coreKeyholeRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "back.out(2)",
      }, "-=0.4")
      // Step 4: Subtle chromatic flicker
      .to(containerRef.current, {
        x: 1.5,
        duration: 0.04,
        yoyo: true,
        repeat: 3,
        ease: "rough",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animateOnMount, onAnimationComplete]);

  // Color schemes based on variant
  const isLime = variant === "lime";
  const isMono = variant === "monochrome";

  const primaryStroke = isLime ? "#C6FF3D" : isMono ? "#F4F4F0" : "#F4F4F0";
  const secondaryStroke = isLime ? "rgba(198, 255, 61, 0.7)" : isMono ? "#8A8A93" : "rgba(244, 244, 240, 0.65)";
  const accentFill = isMono ? "#F4F4F0" : "#C6FF3D";
  const accentGlow = isMono ? "none" : "url(#deadlock-glow)";

  return (
    <svg
      ref={containerRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none overflow-visible ${className}`}
    >
      <defs>
        <filter id="deadlock-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="shackle-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#9C9CA4" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="shackle-grad-right" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#9C9CA4" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Dynamic Shockwave Ring */}
      <circle
        ref={shockwaveRef}
        cx="50"
        cy="50"
        r="28"
        stroke="#C6FF3D"
        strokeWidth="1.5"
        fill="none"
        opacity="0"
      />

      {/* Left Form: Geometric "D" Hook & Clamping Jaw */}
      <g ref={leftHalfRef} id="deadlock-half-left">
        {/* Outer spine and top shackle loop */}
        <path
          d="M 28 20 
             H 48 
             C 62 20, 68 28, 68 38 
             C 68 44, 65 47, 59 48 
             L 51 48 
             L 51 37 
             C 51 33, 47 30, 42 30 
             H 38 
             V 70 
             H 28 
             Z"
          fill={isLime ? "#C6FF3D" : "url(#shackle-grad-left)"}
          stroke={primaryStroke}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Left inner grip notch */}
        <path
          d="M 28 42 H 23 V 58 H 28 Z"
          fill={secondaryStroke}
          opacity="0.4"
        />
      </g>

      {/* Right Form: Inverted Complementary "D" Clamping Lock Jaw */}
      <g ref={rightHalfRef} id="deadlock-half-right">
        {/* Lower spine and bottom interlocking shackle clasp */}
        <path
          d="M 72 80 
             H 52 
             C 38 80, 32 72, 32 62 
             C 32 56, 35 53, 41 52 
             L 49 52 
             L 49 63 
             C 49 67, 53 70, 58 70 
             H 62 
             V 30 
             H 72 
             Z"
          fill={isLime ? "#C6FF3D" : "url(#shackle-grad-right)"}
          stroke={primaryStroke}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Right inner grip notch */}
        <path
          d="M 72 58 H 77 V 42 H 72 Z"
          fill={secondaryStroke}
          opacity="0.4"
        />
      </g>

      {/* Negative Space Precision Keyhole Core */}
      <g ref={coreKeyholeRef} id="deadlock-keyhole-core">
        {/* Keyhole head aperture */}
        <circle
          cx="50"
          cy="46"
          r="4.5"
          fill={accentFill}
          filter={accentGlow}
        />
        {/* Keyhole tapering slot */}
        <path
          d="M 47.8 47.5 L 52.2 47.5 L 53.5 56.5 L 46.5 56.5 Z"
          fill={accentFill}
          filter={accentGlow}
        />
        {/* Micro coordinate crosshair marks */}
        <line x1="43" y1="50" x2="40" y2="50" stroke={accentFill} strokeWidth="0.8" opacity="0.6" />
        <line x1="57" y1="50" x2="60" y2="50" stroke={accentFill} strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  );
};
