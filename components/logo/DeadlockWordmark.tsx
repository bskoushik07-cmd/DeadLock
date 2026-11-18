"use client";

import React from "react";
import { DeadlockIcon } from "./DeadlockIcon";

interface DeadlockWordmarkProps {
  height?: number;
  variant?: "default" | "monochrome" | "lime";
  withIcon?: boolean;
  className?: string;
}

export const DeadlockWordmark: React.FC<DeadlockWordmarkProps> = ({
  height = 28,
  variant = "default",
  withIcon = false,
  className = "",
}) => {
  const isLime = variant === "lime";
  const isMono = variant === "monochrome";

  const textColor = isLime ? "#C6FF3D" : isMono ? "#F4F4F0" : "#F4F4F0";
  const accentColor = isMono ? "#F4F4F0" : "#C6FF3D";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {withIcon && (
        <DeadlockIcon
          size={height * 1.25}
          variant={variant}
          className="shrink-0"
        />
      )}
      <svg
        height={height}
        viewBox="0 0 280 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="DEADLOCK"
      >
        <g fill={textColor} style={{ letterSpacing: "0.18em" }}>
          {/* D */}
          <path d="M 0 4 H 14 C 23 4, 28 9, 28 18 C 28 27, 23 32, 14 32 H 0 V 4 Z M 6 10 V 26 H 13 C 18 26, 21 23, 21 18 C 21 13, 18 10, 13 10 H 6 Z" />

          {/* E */}
          <path d="M 37 4 H 59 V 10 H 43 V 15 H 56 V 21 H 43 V 26 H 59 V 32 H 37 V 4 Z" />

          {/* A */}
          <path d="M 77 4 H 85 L 97 32 H 90 L 87.5 26 H 74.5 L 72 32 H 65 L 77 4 Z M 76.5 21 H 85.5 L 81 10 L 76.5 21 Z" />

          {/* D */}
          <path d="M 106 4 H 120 C 129 4, 134 9, 134 18 C 134 27, 129 32, 120 32 H 106 V 4 Z M 112 10 V 26 H 119 C 124 26, 127 23, 127 18 C 127 13, 124 10, 119 10 H 112 Z" />

          {/* L */}
          <path d="M 144 4 H 150 V 26 H 166 V 32 H 144 V 4 Z" />

          {/* O - Custom Keyhole Geometry echoing the Deadlock Core */}
          <g transform="translate(174, 4)">
            {/* Outer Hexagonal-Grotesk O Ring */}
            <path
              d="M 6 0 H 22 L 28 6 V 22 L 22 28 H 6 L 0 22 V 6 L 6 0 Z"
              fill={textColor}
            />
            {/* Inner Counter with Keyhole Cutout */}
            <rect x="5.5" y="5.5" width="17" height="17" fill="#070709" rx="2" />
            
            {/* Deadlock Keyhole Silhouette inside the O */}
            <circle cx="14" cy="12" r="2.8" fill={accentColor} />
            <path d="M 12.8 13 L 15.2 13 L 16 19 L 12 19 Z" fill={accentColor} />
          </g>

          {/* C */}
          <path d="M 235 9 L 230.5 13.5 C 227.5 10.5, 224 9.5, 220 9.5 C 213 9.5, 208 14.5, 208 21.5 C 208 28.5, 213 33.5, 220 33.5 C 224 33.5, 227.5 32.5, 230.5 29.5 L 235 34 C 230.5 38.5, 225.5 40, 220 40 C 209 40, 201 32, 201 21.5 C 201 11, 209 3, 220 3 C 225.5 3, 230.5 4.5, 235 9 Z" transform="translate(11, -3)" />

          {/* K */}
          <path d="M 256 4 H 262 V 15.5 L 273.5 4 H 281 L 268 17.5 L 281.5 32 H 273.5 L 262 19.5 V 32 H 256 V 4 Z" />
        </g>
      </svg>
    </div>
  );
};
