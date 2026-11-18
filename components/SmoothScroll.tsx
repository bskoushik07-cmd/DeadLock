"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => THREE_EASE(t),
      orientation: "vertical",
      smoothWheel: true,
    });

    function THREE_EASE(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
