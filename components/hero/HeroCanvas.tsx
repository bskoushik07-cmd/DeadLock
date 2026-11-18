"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroCanvasProps {
  scrollProgress?: number;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5.8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Custom GLSL Background Plane
    const bgVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const bgFragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                            0.366025403784439,
                           -0.577350269189626,
                            0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse * 0.5 + 0.5;
        mouse.x *= u_resolution.x / u_resolution.y;

        float distToMouse = length(st - mouse);
        float mouseInfluence = smoothstep(0.75, 0.0, distToMouse) * 0.35;

        float t = u_time * 0.16;
        vec2 q = vec2(0.0);
        q.x = snoise(st + vec2(t * 0.2, t * 0.25));
        q.y = snoise(st + vec2(t * 0.35, -t * 0.18));

        vec2 r = vec2(0.0);
        r.x = snoise(st + 1.1 * q + vec2(1.7, 9.2) + 0.12 * t + mouseInfluence);
        r.y = snoise(st + 1.1 * q + vec2(8.3, 2.8) + 0.11 * t);

        float f = snoise(st + r * 1.4);

        // Palette specification:
        // Obsidian background: #070709
        // Deep Green-Teal glow: #0E3B2E
        // Acid Lime accent: #C6FF3D (<10%)
        vec3 obsidian = vec3(0.027, 0.027, 0.035);
        vec3 deepTeal = vec3(0.055, 0.231, 0.180);
        vec3 acidLime = vec3(0.776, 1.0, 0.239);

        // Blending logic: dark obsidian with deep teal atmospheric clouds
        vec3 color = mix(obsidian, deepTeal, clamp((f*f*3.5), 0.0, 0.8));

        // Subtle electric lime filaments
        float limeRidge = smoothstep(0.78, 0.96, f) * (0.28 + mouseInfluence * 0.7);
        color = mix(color, acidLime, clamp(limeRidge, 0.0, 0.22));

        // Atmospheric vignette
        vec2 uvCenter = vUv - 0.5;
        float vignette = 1.0 - dot(uvCenter, uvCenter) * 1.35;
        color *= clamp(vignette, 0.18, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const bgUniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    };

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: bgUniforms,
      depthWrite: false,
      depthTest: false,
    });

    const bgGeo = new THREE.PlaneGeometry(2, 2);
    const bgMesh = new THREE.Mesh(bgGeo, bgMaterial);
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.Camera();
    bgScene.add(bgMesh);

    // 3. 3D DEADLOCK Extruded Emblem
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // Create Left Interlocking "D" half
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-1.2, 0.7);
    leftShape.lineTo(-0.1, 0.7);
    leftShape.bezierCurveTo(0.6, 0.7, 0.8, 0.35, 0.8, -0.1);
    leftShape.bezierCurveTo(0.8, -0.35, 0.65, -0.45, 0.45, -0.5);
    leftShape.lineTo(0.1, -0.5);
    leftShape.lineTo(0.1, 0.0);
    leftShape.bezierCurveTo(0.1, 0.25, -0.05, 0.35, -0.25, 0.35);
    leftShape.lineTo(-0.7, 0.35);
    leftShape.lineTo(-0.7, -1.2);
    leftShape.lineTo(-1.2, -1.2);
    leftShape.closePath();

    // Create Right Interlocking "D" half
    const rightShape = new THREE.Shape();
    rightShape.moveTo(1.2, -0.7);
    rightShape.lineTo(0.1, -0.7);
    rightShape.bezierCurveTo(-0.6, -0.7, -0.8, -0.35, -0.8, 0.1);
    rightShape.bezierCurveTo(-0.8, 0.35, -0.65, 0.45, -0.45, 0.5);
    rightShape.lineTo(-0.1, 0.5);
    rightShape.lineTo(-0.1, 0.0);
    rightShape.bezierCurveTo(-0.1, -0.25, 0.05, -0.35, 0.25, -0.35);
    rightShape.lineTo(0.7, -0.35);
    rightShape.lineTo(0.7, 1.2);
    rightShape.lineTo(1.2, 1.2);
    rightShape.closePath();

    const extrudeSettings = {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    };

    const leftGeo = new THREE.ExtrudeGeometry(leftShape, extrudeSettings);
    leftGeo.center();
    const rightGeo = new THREE.ExtrudeGeometry(rightShape, extrudeSettings);
    rightGeo.center();

    // Material: Obsidian Brushed Titanium with Lime Sheen
    const titaniumMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#181820"),
      emissive: new THREE.Color("#0A140F"),
      metalness: 0.92,
      roughness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      reflectivity: 0.98,
    });

    const leftMesh = new THREE.Mesh(leftGeo, titaniumMaterial);
    const rightMesh = new THREE.Mesh(rightGeo, titaniumMaterial);

    leftMesh.position.set(-0.25, 0.25, 0);
    rightMesh.position.set(0.25, -0.25, 0);

    emblemGroup.add(leftMesh);
    emblemGroup.add(rightMesh);

    // Glowing Keyhole Core in the center
    const coreGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.42, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C6FF3D"),
      emissive: new THREE.Color("#C6FF3D"),
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.rotation.x = Math.PI / 2;
    emblemGroup.add(coreMesh);

    // Responsive position setup: Right side on desktop, center on mobile
    const updateEmblemPosition = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        emblemGroup.position.set(1.5, 0, 0);
        emblemGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        emblemGroup.position.set(0, 0.4, 0);
        emblemGroup.scale.set(0.65, 0.65, 0.65);
      }
    };
    updateEmblemPosition();

    // Subtle Particle Dust Field
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 4;

      particleVel[i * 3] = (Math.random() - 0.5) * 0.002;
      particleVel[i * 3 + 1] = Math.random() * 0.003 + 0.001;
      particleVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color("#C6FF3D"),
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Dynamic Lighting
    const keyLight = new THREE.DirectionalLight(new THREE.Color("#FFFFFF"), 3.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(new THREE.Color("#C6FF3D"), 4.5, 12);
    rimLight.position.set(-2, -3, 3);
    scene.add(rimLight);

    const tealLight = new THREE.PointLight(new THREE.Color("#0E3B2E"), 3.5, 14);
    tealLight.position.set(4, -3, 2);
    scene.add(tealLight);

    const ambientLight = new THREE.AmbientLight(new THREE.Color("#181822"), 1.0);
    scene.add(ambientLight);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      bgUniforms.u_resolution.value.set(w, h);
      updateEmblemPosition();
    };
    window.addEventListener("resize", onResize);

    // Scroll tracking
    let currentScroll = 0;
    const onScroll = () => {
      currentScroll = window.scrollY || window.pageYOffset;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Render Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      bgUniforms.u_time.value = elapsedTime;

      // Mouse smoothing
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;
      bgUniforms.u_mouse.value.set(m.x, m.y);

      // Emblem tilt & floating animation
      emblemGroup.rotation.y = m.x * 0.45;
      emblemGroup.rotation.x = -m.y * 0.45;

      const isDesktop = window.innerWidth >= 1024;
      const baseY = isDesktop ? 0 : 0.4;
      emblemGroup.position.y = baseY + Math.sin(elapsedTime * 1.3) * 0.08;

      // Scroll separation: as user scrolls down, halves slide apart along locking track
      const scrollFactor = Math.min(currentScroll / 500, 1.0);
      const separationDistance = scrollFactor * 0.75;

      leftMesh.position.x = -0.25 - separationDistance;
      leftMesh.position.y = 0.25 + separationDistance * 0.25;
      rightMesh.position.x = 0.25 + separationDistance;
      rightMesh.position.y = -0.25 - separationDistance * 0.25;

      coreMat.emissiveIntensity = 2.0 + separationDistance * 3.5;

      // Floating data particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVel[i * 3 + 1];
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3 + 1] = -3;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render passes
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      bgMaterial.dispose();
      bgGeo.dispose();
      leftGeo.dispose();
      rightGeo.dispose();
      coreGeo.dispose();
      titaniumMaterial.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
};
