"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface StatItem {
  value: string;
  label: string;
  subtitle: string;
}

export const StatsSection: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Orbiting 3D Ring Geometry
    const ringGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#22222E"),
      emissive: new THREE.Color("#0E3B2E"),
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Secondary inner wireframe orbit
    const innerRingGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#C6FF3D"),
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 4;
    scene.add(innerRing);

    // Orbiting Satellites / Nodes
    const NODE_COUNT = 8;
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const geo = new THREE.IcosahedronGeometry(0.12, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(i % 2 === 0 ? "#C6FF3D" : "#F4F4F0"),
        emissive: new THREE.Color(i % 2 === 0 ? "#C6FF3D" : "#22222E"),
        emissiveIntensity: i % 2 === 0 ? 1.5 : 0.3,
        roughness: 0.1,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Lighting
    const light = new THREE.PointLight(new THREE.Color("#C6FF3D"), 4, 10);
    light.position.set(0, 0, 3);
    scene.add(light);

    const ambLight = new THREE.AmbientLight(new THREE.Color("#111118"), 1.2);
    scene.add(ambLight);

    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.012;

      ringMesh.rotation.z = clock * 0.4;
      innerRing.rotation.z = -clock * 0.6;
      innerRing.rotation.y = Math.sin(clock * 0.5) * 0.3;

      // Position nodes in circular orbit
      for (let i = 0; i < NODE_COUNT; i++) {
        const angle = (i / NODE_COUNT) * Math.PI * 2 + clock * 0.5;
        const x = Math.cos(angle) * 2.4;
        const y = Math.sin(angle) * 2.4 * Math.cos(Math.PI / 3);
        const z = Math.sin(angle) * 2.4 * Math.sin(Math.PI / 3);

        nodeMeshes[i].position.set(x, y, z);
        nodeMeshes[i].rotation.x = clock * 2;
        nodeMeshes[i].rotation.y = clock * 2;
      }

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
      renderer.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const stats: StatItem[] = [
    {
      value: "18+",
      label: "GLOBAL AWARDS",
      subtitle: "Awwwards SOTD, FWA, CSSDA recognitions",
    },
    {
      value: "98",
      label: "AVG LIGHTHOUSE SCORE",
      subtitle: "Zero latency penalties on production builds",
    },
    {
      value: "60 FPS",
      label: "SHADER THROUGHPUT",
      subtitle: "Continuous hardware-accelerated WebGL frames",
    },
    {
      value: "$1.2B+",
      label: "VALUE SECURED",
      subtitle: "In institutional FinTech & Web3 protocols",
    },
  ];

  const techStack = [
    "Next.js App Router",
    "Three.js / WebGL",
    "GLSL Shaders",
    "GSAP ScrollTrigger",
    "TypeScript",
    "Prisma ORM",
    "WebAudio API",
    "Tailwind CSS",
  ];

  return (
    <section
      id="stats"
      className="relative w-full min-h-screen bg-[#070709] border-t border-[rgba(255,255,255,0.06)] py-24 px-6 sm:px-12 select-none overflow-hidden"
    >
      {/* Top Header Label */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 mb-16 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#C6FF3D] font-bold text-sm">05/</span>
          <span className="text-[#F4F4F0] font-semibold tracking-widest uppercase">
            TELEMETRY & TECH MATRIX // BENCHMARKS
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#8A8A93]">
          <span>HARD-CODED STANDARDS</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Stats Numbers */}
        <div className="lg:col-span-6 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] hover:border-[#C6FF3D]/40 transition-colors duration-300"
              >
                <div className="text-4xl sm:text-5xl font-extrabold text-[#F4F4F0] font-mono tracking-tight mb-2">
                  <span className="text-[#C6FF3D]">{stat.value.charAt(0)}</span>
                  <span>{stat.value.slice(1)}</span>
                </div>
                <h4 className="text-xs font-mono font-bold text-[#F4F4F0] uppercase tracking-wider mb-1">
                  {stat.label}
                </h4>
                <p className="text-[11px] font-mono text-[#8A8A93]">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Tech Stack Matrix Tags */}
          <div>
            <span className="text-[10px] font-mono text-[#56565F] uppercase tracking-widest block mb-3">
              PRIMARY SOVEREIGN STACK:
            </span>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-sm bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] font-mono text-xs text-[#8A8A93] hover:text-[#C6FF3D] hover:border-[#C6FF3D]/40 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Orbiting 3D Tech Ring Canvas */}
        <div className="lg:col-span-6 h-[420px] sm:h-[500px] relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0A0A0E]">
          <div
            ref={canvasContainerRef}
            className="w-full h-full pointer-events-none select-none"
          />

          <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-[#8A8A93] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
            <span>REAL-TIME 3D ORBITAL SIMULATION</span>
          </div>
        </div>
      </div>
    </section>
  );
};
