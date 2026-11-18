"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/audio";
import { Search, Compass, Code, Rocket, CheckCircle2 } from "lucide-react";

interface ProcessStep {
  phase: string;
  title: string;
  subtitle: string;
  deliverables: string[];
  metrics: string;
}

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: ProcessStep[] = [
    {
      phase: "01",
      title: "DISCOVER & DECONSTRUCT",
      subtitle: "Reverse-engineering the deadlock.",
      deliverables: [
        "Architecture Bottleneck Audit",
        "Technical Constraint Mapping",
        "Competitive Visual Differentiation",
        "Target Persona Telemetry",
      ],
      metrics: "WEEK 01 // DISCOVERY RUNTIME",
    },
    {
      phase: "02",
      title: "DESIGN & SPATIAL UX",
      subtitle: "From geometric mark to WebGL prototypes.",
      deliverables: [
        "Brand Identity & Bespoke Lock Geometry",
        "High-Fidelity Figma Systems",
        "Custom GLSL Shader Prototypes",
        "Motion Curves & Audio Palette",
      ],
      metrics: "WEEKS 02 - 03 // VISUAL FOUNDATION",
    },
    {
      phase: "03",
      title: "BUILD & HARDEN",
      subtitle: "60fps WebGL execution & low-latency backends.",
      deliverables: [
        "Next.js App Router & TypeScript",
        "Three.js R3F Shaders & Postprocessing",
        "Prisma Database & Storage Bridges",
        "Sub-millisecond API Benchmarking",
      ],
      metrics: "WEEKS 04 - 06 // PRODUCTION SPRINT",
    },
    {
      phase: "04",
      title: "LAUNCH & DOMINATE",
      subtitle: "Awwwards-level polish and edge delivery.",
      deliverables: [
        "Lighthouse 95+ Optimization",
        "Mobile Fallback & Reduced-Motion Handlers",
        "Global Edge CDN Invalidation",
        "Production Handoff & Governance",
      ],
      metrics: "WEEK 07 // DEPLOYMENT",
    },
  ];

  const icons = [Search, Compass, Code, Rocket];

  return (
    <section
      id="process"
      className="relative w-full min-h-screen bg-[#070709] border-t border-[rgba(255,255,255,0.06)] py-24 px-6 sm:px-12 select-none"
    >
      {/* Top Header Label */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 mb-16 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#C6FF3D] font-bold text-sm">04/</span>
          <span className="text-[#F4F4F0] font-semibold tracking-widest uppercase">
            ENGINEERING PROTOCOL // PROCESS TIMELINE
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#8A8A93]">
          <span>4-STAGE EXECUTION LIFECYCLE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stage Timeline Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {steps.map((step, idx) => {
            const Icon = icons[idx];
            const isActive = activeStep === idx;

            return (
              <button
                key={step.phase}
                onClick={() => {
                  setActiveStep(idx);
                  soundManager.playHoverBlip();
                }}
                className={`p-5 rounded-lg border text-left transition-all duration-300 font-mono ${
                  isActive
                    ? "bg-[#0F0F13] border-[#C6FF3D] shadow-[0_0_24px_-4px_rgba(198,255,61,0.25)]"
                    : "bg-[#0A0A0E] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
                data-cursor="SELECT"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold ${
                      isActive ? "text-[#C6FF3D]" : "text-[#56565F]"
                    }`}
                  >
                    PHASE {step.phase}/
                  </span>
                  <Icon
                    size={18}
                    className={isActive ? "text-[#C6FF3D]" : "text-[#56565F]"}
                  />
                </div>
                <h4
                  className={`text-sm sm:text-base font-extrabold font-sans tracking-tight ${
                    isActive ? "text-[#F4F4F0]" : "text-[#8A8A93]"
                  }`}
                >
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Display */}
        <div className="p-8 sm:p-12 rounded-xl bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6FF3D]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-xs font-mono text-[#C6FF3D] uppercase tracking-wider block mb-2">
                ACTIVE STAGE // {steps[activeStep].phase}
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold text-[#F4F4F0] font-sans tracking-tight">
                {steps[activeStep].title}
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[#8A8A93]">
                {steps[activeStep].subtitle}
              </p>
            </div>

            <div className="px-4 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.08)] font-mono text-xs text-[#C6FF3D] self-start lg:self-center">
              {steps[activeStep].metrics}
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="mt-8">
            <span className="text-xs font-mono text-[#56565F] uppercase tracking-widest block mb-4">
              STAGE DELIVERABLES:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps[activeStep].deliverables.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded bg-[#070709]/80 border border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#F4F4F0]"
                >
                  <CheckCircle2 size={16} className="text-[#C6FF3D] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
