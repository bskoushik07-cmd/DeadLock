"use client";

import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { soundManager } from "@/lib/audio";
import { ArrowUpRight, CheckCircle2, MessageSquare, Send, Mail, Phone } from "lucide-react";

export const ContactSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState("$50k - $100k");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const vShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse;
        mouse.x *= u_resolution.x / u_resolution.y;

        float dist = length(st - mouse);
        float intensity = smoothstep(0.65, 0.0, dist);

        // Subtle electric pulse
        float pulse = sin(u_time * 2.0 - dist * 10.0) * 0.5 + 0.5;

        vec3 bg = vec3(0.027, 0.027, 0.035); // #070709
        vec3 glow = vec3(0.055, 0.231, 0.180); // #0E3B2E
        vec3 lime = vec3(0.776, 1.0, 0.239); // #C6FF3D

        vec3 color = mix(bg, glow, intensity * 0.7);
        color = mix(color, lime, intensity * pulse * 0.2);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms,
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;
      uniforms.u_time.value = clock;
      uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      mat.dispose();
      geo.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, budget, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send transmission");
      }

      soundManager.playMechanicalLock();
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting inquiry";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen bg-[#070709] border-t border-[rgba(255,255,255,0.06)] py-24 px-6 sm:px-12 select-none overflow-hidden"
    >
      {/* Interactive Proximity GLSL Canvas Shader */}
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      />

      {/* Top Header Label */}
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 mb-16 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#C6FF3D] font-bold text-sm">06/</span>
          <span className="text-[#F4F4F0] font-semibold tracking-widest uppercase">
            ENGAGE // INITIATE TRANSMISSION
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#8A8A93]">
          <span className="text-[#C6FF3D]">CONFIDENTIAL PORTAL</span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Giant Editorial Headline & Direct Channels */}
        <div className="lg:col-span-6 space-y-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] font-mono text-xs text-[#C6FF3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
            DIRECT TO PARTNERS
          </span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#F4F4F0] font-sans tracking-tight leading-[0.98]">
            LET’S BREAK THE <span className="text-[#C6FF3D]">DEADLOCK.</span>
          </h2>

          <p className="text-base sm:text-xl text-[#8A8A93] font-light max-w-xl leading-relaxed">
            Have a project that demands an uncompromised level of craft, speed, and technical ambition? Send us your brief. We respond within 24 hours.
          </p>

          {/* Direct Nodes */}
          <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] space-y-4 font-mono text-xs">
            <a
              href="mailto:ops@deadlock.studio"
              className="flex items-center gap-3 text-[#F4F4F0] hover:text-[#C6FF3D] transition-colors"
            >
              <Mail size={16} className="text-[#C6FF3D]" />
              <span>ops@deadlock.studio</span>
            </a>

            <a
              href="https://wa.me/14158905625"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#F4F4F0] hover:text-[#C6FF3D] transition-colors"
            >
              <Phone size={16} className="text-[#C6FF3D]" />
              <span>WhatsApp: +1 (415) 890-5625</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-6">
          <div className="p-8 sm:p-10 rounded-xl bg-[#0F0F13]/90 backdrop-blur-md border border-[rgba(255,255,255,0.08)] shadow-2xl relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4 font-mono">
                <div className="w-14 h-14 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D] flex items-center justify-center text-[#C6FF3D] mb-2">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-2xl font-bold font-sans text-[#F4F4F0]">
                  TRANSMISSION RECEIVED
                </h3>
                <p className="text-xs text-[#8A8A93] max-w-xs">
                  Your project brief has been logged into the DEADLOCK database. A founding partner will review your telemetry shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs text-[#C6FF3D] underline underline-offset-4"
                >
                  DISPATCH ANOTHER SIGNAL
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                {error && (
                  <div className="p-3 rounded bg-red-950/40 border border-red-500/30 text-red-300">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8A8A93] mb-1.5 uppercase">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-3 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A8A93] mb-1.5 uppercase">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-3 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8A8A93] mb-1.5 uppercase">ORGANIZATION</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Studio / Venture"
                      className="w-full px-3.5 py-3 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A8A93] mb-1.5 uppercase">BUDGET TIER</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3.5 py-3 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
                    >
                      <option value="$25k - $50k">$25k – $50k</option>
                      <option value="$50k - $100k">$50k – $100k</option>
                      <option value="$100k+">$100k+ Sovereign</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#8A8A93] mb-1.5 uppercase">PROJECT OBJECTIVES *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are building and why standard solutions fail..."
                    className="w-full px-3.5 py-3 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 rounded bg-[#C6FF3D] hover:bg-[#b2eb2b] text-[#070709] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_24px_-4px_rgba(198,255,61,0.4)] disabled:opacity-50"
                  data-cursor="TRANSMIT"
                >
                  {sending ? (
                    <span>ENCRYPTING TRANSMISSION...</span>
                  ) : (
                    <>
                      <span>TRANSMIT PROJECT BRIEF</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
