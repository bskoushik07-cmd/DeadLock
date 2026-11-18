import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DEADLOCK Studio Database...');

  // 1. Clear existing records for fresh seed
  await prisma.project.deleteMany();
  await prisma.message.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('deadlock2026!', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@deadlock.studio',
      passwordHash: passwordHash,
      name: 'DEADLOCK Studio Director',
      role: 'admin',
    },
  });
  console.log('Seeded admin user:', admin.email);

  // 3. Seed 4 Flagship Projects
  const projects = [
    {
      slug: 'kinetic-labs',
      title: 'KINETIC LABS',
      client: 'Kinetic Capital Markets',
      year: '2026',
      role: 'Creative Development & WebGL Architecture',
      category: 'FinTech / WebGL',
      shortDesc: 'Sub-millisecond institutional order execution and telemetry suite powered by custom WebGL shaders and real-time streaming data matrices.',
      longDesc: `### Engineering the Fastest Financial Visual Engine
Kinetic Capital approached DEADLOCK to reimagine their institutional algorithmic execution terminal. Traditional trading software is cluttered, sluggish, and visually archaic.

#### The Challenge
Rendering over 250,000 live orderbook updates per second with zero UI frame drops on high-refresh 144Hz displays. Standard DOM and SVG rendering choked under 5,000 nodes.

#### The Architecture
- **Custom WebGL Pipeline**: Offloaded orderbook depth chart and candle generation entirely to GPU instanced vertex buffers.
- **Sub-millisecond WebSockets**: Low-overhead binary Protobuf protocol delivering microsecond-precision bid-ask changes.
- **Obsidian Dark Ergonomics**: Engineered for high-stakes traders working 12-hour shifts without ocular fatigue.

#### Outcome
Sub-0.2ms latency, consistent 120fps GPU throughput, and a 42% increase in institutional desk volume within the first quarter post-launch.`,
      coverImage: '/projects/kinetic-labs.svg',
      galleryImages: JSON.stringify([
        '/projects/kinetic-labs.svg',
        '/projects/neo-archive.svg',
      ]),
      videoUrl: '',
      liveUrl: 'https://kinetic.deadlock.studio',
      repoUrl: 'https://github.com/deadlock-studio/kinetic-terminal',
      accentColor: '#C6FF3D',
      featured: true,
      published: true,
      order: 1,
    },
    {
      slug: 'neo-archive',
      title: 'NEO ARCHIVE',
      client: 'Neo Global Editions',
      year: '2025',
      role: '3D Cloth Physics & Headless Platform',
      category: 'Generative Fashion / 3D',
      shortDesc: 'Autonomous digital fashion house platform with real-time 3D cloth draping, generative tailoring, and cryptographic garment provenance.',
      longDesc: `### Sovereign Digital Couture in Browser
NEO ARCHIVE bridges haute couture with procedural WebGL compute shaders, creating an interactive runway where physical garments can be customized in real-time.

#### The Challenge
Simulating multi-layered silk and technical nylon textiles in the browser with authentic physical gravity, drape resistance, and micro-sheen lighting.

#### The Architecture
- **Verlet Particle Simulation**: WebGL compute shaders executing garment mesh relaxation in real-time.
- **Physical Surface Shading**: Anisotropic roughness maps mimicking raw carbon fiber, organza, and brushed titanium textiles.
- **Headless Checkout**: Sovereign zero-latency checkout infrastructure connected to localized global distribution hubs.

#### Outcome
Honored with Awwwards Site of the Day, FWA of the Day, and $3.8M in direct edition drops within 72 hours.`,
      coverImage: '/projects/neo-archive.svg',
      galleryImages: JSON.stringify([
        '/projects/neo-archive.svg',
        '/projects/synapse-os.svg',
      ]),
      liveUrl: 'https://neo.deadlock.studio',
      repoUrl: 'https://github.com/deadlock-studio/neo-archive-runtime',
      accentColor: '#00F0FF',
      featured: true,
      published: true,
      order: 2,
    },
    {
      slug: 'synapse-os',
      title: 'SYNAPSE OS',
      client: 'Synapse Cognitive Systems',
      year: '2026',
      role: 'Spatial Computing Runtime & Interface',
      category: 'Spatial Software / AI',
      shortDesc: 'Spatial computing workspace blending neural graph representations with tactile node pipelines for artificial intelligence researchers.',
      longDesc: `### Spatializing Large Language Models
Synapse OS is a revolutionary computing surface for steering foundation models. Rather than static chat boxes, users manipulate multidimensional concept graphs in 3D space.

#### The Challenge
Visualizing 1,000-dimensional vector embeddings with interactive cluster clustering and seamless zoom from macro-topology down to individual neuron activations.

#### The Architecture
- **Force-Directed 3D Graphs**: Barnes-Hut gravitational algorithm computed on GPU threads to cluster related semantic vectors dynamically.
- **Tactile Sound System**: Reactive audio synthesizer signaling cluster convergence, parameter boundaries, and inference throughput.
- **Next.js & WebGPU Engine**: Next-generation web runtime with fallback to WebGL2 for universal platform access.

#### Outcome
Adopted by over 45 frontier research laboratories and venture-backed cognitive intelligence teams worldwide.`,
      coverImage: '/projects/synapse-os.svg',
      galleryImages: JSON.stringify([
        '/projects/synapse-os.svg',
        '/projects/vortex-protocol.svg',
      ]),
      liveUrl: 'https://synapse.deadlock.studio',
      repoUrl: 'https://github.com/deadlock-studio/synapse-spatial-os',
      accentColor: '#FF3366',
      featured: true,
      published: true,
      order: 3,
    },
    {
      slug: 'vortex-protocol',
      title: 'VORTEX PROTOCOL',
      client: 'Vortex Foundation',
      year: '2025',
      role: 'ZK Protocol UI & Topology Visualizer',
      category: 'Web3 / Security',
      shortDesc: 'Zero-knowledge privacy suite and decentralized liquidity router featuring interactive mathematical topology visualizers.',
      longDesc: `### Visualizing Zero-Knowledge Cryptography
Vortex Protocol required an interface that demystified complex non-interactive zero-knowledge proofs (zk-SNARKs) without compromising on sovereign privacy guarantees.

#### The Challenge
Translating multi-polynomial arithmetic circuits into an intuitive, visually stunning verification sequence that inspires institutional confidence.

#### The Architecture
- **Mathematical Topology Shader**: GLSL shader rendering Calabi-Yau manifold projections representing proof constraints.
- **Client-Side Proof Generation**: WebAssembly (WASM) cryptographic circuits generating proofs locally in under 800ms.
- **Hardened Security**: Strict CSP headers, subresource integrity verification, and air-gapped signature validation.

#### Outcome
Secured over $840M in total value locked within 6 months, receiving universal praise for setting a new benchmark in cryptographic user experience.`,
      coverImage: '/projects/vortex-protocol.svg',
      galleryImages: JSON.stringify([
        '/projects/vortex-protocol.svg',
        '/projects/kinetic-labs.svg',
      ]),
      liveUrl: 'https://vortex.deadlock.studio',
      repoUrl: 'https://github.com/deadlock-studio/vortex-privacy-ui',
      accentColor: '#A855F7',
      featured: true,
      published: true,
      order: 4,
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
    console.log(`Created project: ${p.title}`);
  }

  // 4. Seed Default Site Settings
  await prisma.siteSettings.create({
    data: {
      id: 'default',
      heroTitle: "WE BUILD WHAT OTHERS CAN'T UNLOCK.",
      heroSubtitle: 'DEADLOCK is an elite software and motion laboratory. We engineer bespoke WebGL visual engines, high-frequency web applications, and immersive digital platforms for pioneers who refuse conventional templates.',
      tagline: "We build what others can't unlock.",
      contactEmail: 'ops@deadlock.studio',
      contactPhone: '+1 (415) 890-5625',
      whatsapp: '+14158905625',
      github: 'https://github.com/deadlock-studio',
      twitter: 'https://twitter.com/deadlock_st',
      linkedin: 'https://linkedin.com/company/deadlock-studio',
      servicesJson: JSON.stringify([
        {
          id: '01',
          title: 'WEB & CREATIVE ARCHITECTURE',
          description: 'Awwwards-caliber digital flagships, bespoke Three.js / WebGL shaders, GSAP motion choreography, and high-conversion editorial layouts.',
          capabilities: ['WebGL / Three.js', 'Custom GLSL Shaders', 'Next.js App Router', 'Motion Design & GSAP', 'Micro-Interactions'],
        },
        {
          id: '02',
          title: 'COMPLEX SOFTWARE SYSTEMS',
          description: 'Institutional-grade full-stack web platforms, real-time streaming data architectures, cryptographic workflows, and high-concurrency backends.',
          capabilities: ['TypeScript & Rust', 'Real-time WebSockets', 'PostgreSQL / Prisma', 'High-Frequency Telemetry', 'Distributed Systems'],
        },
        {
          id: '03',
          title: '3D COMPUTING & SPATIAL UX',
          description: 'Procedural generative meshes, GPU compute shaders, product configurators, and spatial digital twins engineered for modern browsers.',
          capabilities: ['Procedural Geometry', 'GPU Compute', 'Physical Simulations', 'Audio-Visual Reactive Engines', '3D Asset Optimization'],
        },
        {
          id: '04',
          title: 'PRODUCT STRATEGY & IDENTITY',
          description: 'Full-spectrum brand positioning, bespoke typographic engineering, design systems, and sovereign design tokens for disruptive startups.',
          capabilities: ['Brand Identity & Mark Design', 'Design Token Architecture', 'Design Systems', 'Interactive Prototypes', 'Art Direction'],
        },
      ]),
      statsJson: JSON.stringify([
        { label: 'GLOBAL CLIENT AWARDS', value: '18+' },
        { label: 'AVERAGE LIGHTHOUSE SCORE', value: '98' },
        { label: 'AVG SHADER THROUGHPUT', value: '60 FPS' },
        { label: 'CAPITAL VALUE SECURED', value: '$1.2B+' },
      ]),
    },
  });

  console.log('Site settings seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
