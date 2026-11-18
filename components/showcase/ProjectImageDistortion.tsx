"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ProjectImageDistortionProps {
  imageSrc: string;
  accentColor: string;
  isHovered: boolean;
  className?: string;
}

export const ProjectImageDistortion: React.FC<ProjectImageDistortionProps> = ({
  imageSrc,
  accentColor,
  isHovered,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverValueRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_hover;
      uniform vec2 u_mouse;
      uniform vec3 u_accent;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        // Wave ripple originating from mouse position on hover
        float dist = distance(uv, u_mouse);
        float wave = sin(dist * 24.0 - u_time * 5.0) * 0.02 * u_hover;
        
        vec2 distortedUv = uv + (uv - u_mouse) * wave;

        // Chromatic aberration splitting
        float rOffset = 0.008 * u_hover;
        float bOffset = -0.008 * u_hover;

        float r = texture2D(u_texture, distortedUv + vec2(rOffset, 0.0)).r;
        float g = texture2D(u_texture, distortedUv).g;
        float b = texture2D(u_texture, distortedUv + vec2(bOffset, 0.0)).b;

        vec3 color = vec3(r, g, b);

        // Accent edge illumination
        float rimGlow = smoothstep(0.48, 0.0, dist) * u_hover * 0.25;
        color = mix(color, u_accent, rimGlow);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageSrc);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const accentRGB = new THREE.Color(accentColor);

    const uniforms = {
      u_texture: { value: texture },
      u_time: { value: 0 },
      u_hover: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_accent: { value: new THREE.Vector3(accentRGB.r, accentRGB.g, accentRGB.b) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    container.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    let startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) * 0.001;
      uniforms.u_time.value = elapsed;

      // Smooth hover lerp
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverValueRef.current += (targetHover - hoverValueRef.current) * 0.1;
      uniforms.u_hover.value = hoverValueRef.current;

      uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);

      renderer.dispose();
      material.dispose();
      geo.dispose();
      texture.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc, accentColor, isHovered]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    />
  );
};
