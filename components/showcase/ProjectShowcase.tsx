"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectImageDistortion } from "./ProjectImageDistortion";
import { soundManager } from "@/lib/audio";
import { ArrowUpRight, Lock, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  role: string;
  category: string;
  shortDesc: string;
  longDesc?: string;
  coverImage: string;
  accentColor: string;
  featured: boolean;
  published: boolean;
  order: number;
}

interface ProjectShowcaseProps {
  projects: ProjectData[];
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx = gsap.context(() => {
      // Calculate total horizontal scroll width
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
        }),
        onUpdate: (self) => {
          // Velocity-based skew calculation
          const velocity = self.getVelocity();
          const skewAmount = Math.max(Math.min(velocity / 300, 7), -7);
          gsap.to(".project-card", {
            skewX: -skewAmount,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, [projects]);

  const handleCardHover = (index: number) => {
    setHoveredIndex(index);
    soundManager.playHoverBlip();
  };

  const handleCardLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full h-screen bg-[#070709] border-t border-[rgba(255,255,255,0.06)] overflow-hidden flex flex-col justify-between py-10 select-none"
    >
      {/* Top Section Header with 01/ ArtCraft Label */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#C6FF3D] font-bold text-sm">01/</span>
          <span className="text-[#F4F4F0] font-semibold tracking-widest uppercase">
            FLAGSHIP ARCHIVE // SELECTED WORKS
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#8A8A93]">
          <span className="flex items-center gap-1.5">
            <Lock size={12} className="text-[#C6FF3D]" />
            SOVEREIGN ARCHITECTURES
          </span>
          <span className="text-[#56565F]">|</span>
          <span>4 PROTOCOLS DEPLOYED</span>
        </div>
      </div>

      {/* Horizontal Pinned Scrolling Gallery Track */}
      <div className="relative w-full my-auto overflow-visible">
        <div
          ref={trackRef}
          className="flex items-center gap-8 sm:gap-12 px-6 sm:px-12 w-max will-change-transform"
        >
          {projects.map((project, idx) => {
            const isHovered = hoveredIndex === idx;
            const projectNumber = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <div
                key={project.id || project.slug}
                className="project-card relative w-[340px] sm:w-[500px] md:w-[620px] rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] transition-colors duration-300 overflow-hidden flex flex-col group will-change-transform shadow-2xl"
                onMouseEnter={() => handleCardHover(idx)}
                onMouseLeave={handleCardLeave}
                data-cursor="EXPAND"
              >
                {/* Card Top Metadata Bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0E]/80 font-mono text-[11px] text-[#8A8A93]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    <span className="text-[#F4F4F0] font-bold">{projectNumber}/</span>
                    <span className="text-[#8A8A93] uppercase">{project.category}</span>
                  </div>
                  <span className="text-[#56565F]">{project.year}</span>
                </div>

                {/* WebGL Image Distortion Plane */}
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() => soundManager.playMechanicalLock()}
                  className="relative w-full h-[240px] sm:h-[320px] md:h-[360px] bg-[#070709] overflow-hidden block"
                >
                  <ProjectImageDistortion
                    imageSrc={project.coverImage}
                    accentColor={project.accentColor}
                    isHovered={isHovered}
                  />

                  {/* Corner Accent Badge */}
                  <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-[#070709]/80 backdrop-blur-md border border-[rgba(255,255,255,0.12)] font-mono text-[10px] text-[#F4F4F0] flex items-center gap-1.5">
                    <Eye size={11} style={{ color: project.accentColor }} />
                    <span>VIEW CASE STUDY</span>
                  </div>
                </Link>

                {/* Card Bottom Content */}
                <div className="p-6 flex flex-col justify-between flex-grow bg-[#0F0F13]">
                  <div>
                    <div className="text-[11px] font-mono tracking-widest text-[#8A8A93] mb-1 uppercase">
                      CLIENT // {project.client}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F4F4F0] tracking-tight group-hover:text-[#C6FF3D] transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-[#8A8A93] line-clamp-2 leading-relaxed">
                      {project.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-[#56565F] uppercase">
                      ROLE: {project.role}
                    </span>

                    <Link
                      href={`/projects/${project.slug}`}
                      onClick={() => soundManager.playMechanicalLock()}
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold tracking-wider text-[#F4F4F0] group-hover:text-[#C6FF3D] transition-colors duration-200"
                    >
                      <span>INSPECT CASE</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Guidance */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4 font-mono text-[11px] text-[#8A8A93]">
        <span className="text-[#56565F]">DRAG OR SCROLL HORIZONTALLY TO NAVIGATE ARCHIVE</span>
        <span className="text-[#C6FF3D] tabular-nums">01 — 04 / 04</span>
      </div>
    </section>
  );
};
