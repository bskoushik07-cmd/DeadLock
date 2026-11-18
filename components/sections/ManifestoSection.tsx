"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Shield, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLParagraphElement>(null);
  const currentShapeRef = useRef<string>("LOCK");

  useEffect(() => {
    const container = canvasContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    // 1. Setup Three.js Particle Morph Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const PARTICLE_COUNT = 600;

    // Target Shape 1: Lock Silhouette
    const lockPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (i < 300) {
        // Shackle arch
        const angle = (i / 300) * Math.PI;
        lockPositions[i * 3] = Math.cos(angle) * 1.5;
        lockPositions[i * 3 + 1] = Math.sin(angle) * 1.5 + 0.5;
        lockPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      } else {
        // Body rectangle
        lockPositions[i * 3] = (Math.random() - 0.5) * 3.2;
        lockPositions[i * 3 + 1] = (Math.random() - 0.5) * 2.2 - 0.8;
        lockPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }

    // Target Shape 2: Code Brackets { }
    const bracketPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isLeft = i < PARTICLE_COUNT / 2;
      const t = (i % (PARTICLE_COUNT / 2)) / (PARTICLE_COUNT / 2);
      const y = (t - 0.5) * 4.0;
      const xOffset = isLeft ? -1.8 : 1.8;
      const curve = (isLeft ? -1 : 1) * Math.sin(t * Math.PI) * 0.8;
      bracketPositions[i * 3] = xOffset + curve + (Math.random() - 0.5) * 0.2;
      bracketPositions[i * 3 + 1] = y;
      bracketPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }

    // Target Shape 3: Geodesic Globe Sphere
    const globePositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      globePositions[i * 3] = 2.2 * Math.cos(theta) * Math.sin(phi);
      globePositions[i * 3 + 1] = 2.2 * Math.sin(theta) * Math.sin(phi);
      globePositions[i * 3 + 2] = 2.2 * Math.cos(phi);
    }

    // Current positions buffer
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    currentPositions.set(lockPositions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#C6FF3D"),
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Dynamic morph progress tracker
    let targetMorph = 0.0;
    let currentMorph = 0.0;

    // GSAP ScrollTrigger for pinned scroll and word lighting
    const ctx = gsap.context(() => {
      const wordElements = wordsContainerRef.current?.querySelectorAll(".manifesto-word");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            targetMorph = self.progress;
          },
        },
      });

      if (wordElements && wordElements.length > 0) {
        tl.to(wordElements, {
          color: "#F4F4F0",
          opacity: 1,
          stagger: 0.05,
          ease: "none",
        });
      }
    }, section);

    // Animation loop
    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.015;

      // Smooth morph progress interpolation
      currentMorph += (targetMorph - currentMorph) * 0.08;

      points.rotation.y = clock * 0.3;
      points.rotation.x = Math.sin(clock * 0.2) * 0.15;

      const pos = geometry.attributes.position.array as Float32Array;

      // Determine interpolation between Shape 1 -> Shape 2 -> Shape 3
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        if (currentMorph < 0.5) {
          // Morph Lock -> Brackets
          const t = currentMorph * 2.0;
          pos[i] = lockPositions[i] * (1 - t) + bracketPositions[i] * t;
        } else {
          // Morph Brackets -> Globe
          const t = (currentMorph - 0.5) * 2.0;
          pos[i] = bracketPositions[i] * (1 - t) + globePositions[i] * t;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      ctx.revert();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const manifestoText =
    "We do not build generic websites. We engineer sovereign digital platforms. In an internet saturated with derivative templates, DEADLOCK is the counter-force. We treat code as architectural steel, WebGL shaders as raw cinema, and high performance as non-negotiable. If your ambition is ordinary, do not call us. We build what others can't unlock.";

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative w-full h-screen bg-[#070709] border-t border-[rgba(255,255,255,0.06)] overflow-hidden flex flex-col justify-between py-12 px-6 sm:px-12 select-none"
    >
      {/* 3D Morphing Particle Field Canvas Background */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      {/* Top Header Label */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#C6FF3D] font-bold text-sm">02/</span>
          <span className="text-[#F4F4F0] font-semibold tracking-widest uppercase">
            THE MANIFESTO // SOVEREIGN STANDARDS
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#8A8A93]">
          <span className="flex items-center gap-1.5">
            <Shield size={12} className="text-[#C6FF3D]" />
            NO DERIVATIVE TEMPLATES
          </span>
        </div>
      </div>

      {/* Center Stage: Pinned Word-by-Word Scroll Reveal */}
      <div className="relative z-10 max-w-5xl mx-auto my-auto w-full text-center">
        <p
          ref={wordsContainerRef}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.18] max-w-5xl"
        >
          {manifestoText.split(" ").map((word, idx) => {
            const isHighlight =
              word === "sovereign" ||
              word === "DEADLOCK" ||
              word === "steel," ||
              word === "cinema," ||
              word === "unlock.";
            return (
              <span
                key={idx}
                className={`manifesto-word inline-block mr-2.5 sm:mr-3.5 transition-colors ${
                  isHighlight ? "font-black" : ""
                }`}
                style={{ color: "#22222B", opacity: 0.6 }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4 font-mono text-[11px] text-[#8A8A93]">
        <div className="flex items-center gap-3">
          <Terminal size={12} className="text-[#C6FF3D]" />
          <span>PARTICLE COMPUTATION // 600 NODES ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 text-[#56565F]">
          <span>SCROLL TO MORPH TOPOLOGY: LOCK → CODE → GLOBE</span>
        </div>
      </div>
    </section>
  );
};
