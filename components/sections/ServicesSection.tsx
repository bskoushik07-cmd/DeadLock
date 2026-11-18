"use client";

import React, { useState, useRef } from "react";
import { soundManager } from "@/lib/audio";
import { ArrowUpRight, Cpu, Layers, Sparkles, Box } from "lucide-react";

interface ServiceItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: string[];
  shaderGradient: string;
}

export const ServicesSection: React.FC = () => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const services: ServiceItem[] = [
    {
      number: "01",
      title: "WEB & CREATIVE ARCHITECTURE",
      tagline: "Awwwards-Caliber Digital Flagships",
      description:
        "We build bespoke WebGL visual engines, fluid GLSL shaders, and ultra-smooth GSAP choreography designed to stun visitors within seconds. Zero generic templates.",
      capabilities: [
        "WebGL & Three.js",
        "Custom GLSL Shaders",
        "Next.js App Router",
        "GSAP ScrollTrigger",
        "Micro-Interactions",
      ],
      shaderGradient: "from-[#C6FF3D]/25 via-[#0E3B2E]/40 to-transparent",
    },
    {
      number: "02",
      title: "COMPLEX SOFTWARE SYSTEMS",
      tagline: "High-Frequency Real-time Telemetry",
      description:
        "Institutional-grade full-stack platforms, high-concurrency WebSocket data streaming, cryptographic proof verification, and distributed database backends.",
      capabilities: [
        "TypeScript & Node.js",
        "Prisma & PostgreSQL",
        "Sub-ms WebSockets",
        "FinTech Telemetry",
        "Sovereign Security",
      ],
      shaderGradient: "from-[#00F0FF]/25 via-[#0A1A2F]/40 to-transparent",
    },
    {
      number: "03",
      title: "3D COMPUTING & GENERATIVE MESHES",
      tagline: "GPU Physics & Spatial Product Runtime",
      description:
        "Procedural mesh synthesis, GPU compute cloth draping, real-time lighting physics, and interactive spatial interfaces engineered for modern desktop and mobile browsers.",
      capabilities: [
        "Procedural Geometry",
        "Verlet Physics Sim",
        "PBR Materials",
        "Model Optimization",
        "WebAudio Synthesis",
      ],
      shaderGradient: "from-[#FF3366]/25 via-[#2A0815]/40 to-transparent",
    },
    {
      number: "04",
      title: "PRODUCT STRATEGY & IDENTITY",
      tagline: "Disciplined Typographic Systems",
      description:
        "Full brand creation from scratch: original geometric marks, custom wordmarks, engineered design token systems, and relentless art direction.",
      capabilities: [
        "Logo & Mark Design",
        "Design Tokens",
        "Editorial Typography",
        "Interactive Guidelines",
        "Brand Governance",
      ],
      shaderGradient: "from-[#A855F7]/25 via-[#1A0A28]/40 to-transparent",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="services"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#070709] border-t border-[rgba(255,255,255,0.06)] py-24 px-6 sm:px-12 select-none"
    >
      {/* Top Header Label */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 mb-16 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#C6FF3D] font-bold text-sm">03/</span>
          <span className="text-[#F4F4F0] font-semibold tracking-widest uppercase">
            SERVICES // CREATIVE DISCIPLINES
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#8A8A93]">
          <span>FOUR SOVEREIGN OFFERINGS</span>
        </div>
      </div>

      {/* Services List Table */}
      <div className="max-w-7xl mx-auto divide-y divide-[rgba(255,255,255,0.08)]">
        {services.map((service, idx) => {
          const isHovered = activeService === idx;

          return (
            <div
              key={service.number}
              onMouseEnter={() => {
                setActiveService(idx);
                soundManager.playHoverBlip();
              }}
              onMouseLeave={() => setActiveService(null)}
              className="py-12 sm:py-16 transition-all duration-300 group cursor-pointer relative"
              data-cursor="CAPABILITY"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Number & Headline */}
                <div className="flex items-start sm:items-center gap-6 sm:gap-10">
                  <span className="font-mono text-lg sm:text-2xl font-bold text-[#56565F] group-hover:text-[#C6FF3D] transition-colors duration-200">
                    {service.number}/
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F4F0] group-hover:text-[#C6FF3D] tracking-tight transition-colors duration-200">
                      {service.title}
                    </h3>
                    <span className="block mt-2 font-mono text-xs text-[#8A8A93] uppercase tracking-wider">
                      {service.tagline}
                    </span>
                  </div>
                </div>

                {/* Arrow Action Indicator */}
                <div className="flex items-center gap-4 self-end lg:self-center">
                  <div className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] group-hover:border-[#C6FF3D] group-hover:bg-[#C6FF3D] flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight
                      size={20}
                      className="text-[#8A8A93] group-hover:text-[#070709] transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Description & Technical Capabilities */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-3 font-mono text-[11px] text-[#56565F]">
                  // CORE PROTOCOLS
                </div>
                <div className="lg:col-span-5 text-[#8A8A93] text-sm sm:text-base leading-relaxed">
                  {service.description}
                </div>
                <div className="lg:col-span-4 flex flex-wrap gap-2">
                  {service.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] font-mono text-[11px] text-[#F4F4F0] group-hover:border-[#C6FF3D]/40 transition-colors"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Interactive Shader Preview Cursor Window */}
      {activeService !== null && (
        <div
          className="pointer-events-none fixed z-30 w-72 h-44 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.2)] bg-[#070709]/95 backdrop-blur-md shadow-2xl transition-opacity duration-200 -translate-x-1/2 -translate-y-1/2 hidden md:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          <div
            className={`w-full h-full bg-gradient-to-br ${services[activeService].shaderGradient} p-5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#F4F4F0]">
              <span>ACTIVE PREVIEW // {services[activeService].number}</span>
              <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#C6FF3D] block font-bold">
                {services[activeService].capabilities[0]}
              </span>
              <span className="text-xs font-bold text-[#F4F4F0] font-sans">
                {services[activeService].tagline}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
