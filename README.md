# DEADLOCK — Creative Engineering & Motion Studio Portfolio

> *"We build what others can't unlock."*

DEADLOCK is an Awwwards Site of the Day caliber digital flagship portfolio and sovereign software studio platform. Engineered with dark brutalist minimalism, fluid GLSL shaders, 3D interactive mechanics, and tactile sound design.

---

## ✦ Brand Foundation & Design Tokens

- **Obsidian Core**: `#070709` (Primary background)
- **Raised Surfaces**: `#0F0F13` (Cards, panels, modals)
- **Subtle Borders**: `rgba(255, 255, 255, 0.08)`
- **Primary Text**: `#F4F4F0`
- **Secondary Text**: `#8A8A93`
- **Accent**: Acid Lime `#C6FF3D` (<10% screen space for maximum punch)
- **Shader Glow**: Deep Green-Teal `#0E3B2E` blended into GLSL noise filaments
- **Typography**: Space Grotesk / Display Grotesk (Headlines) & JetBrains Mono (Technical telemetry, coordinates, and numbering)

---

## ✦ Architecture & Tech Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, Server & Client Components)
- **Language & Styles**: TypeScript, Tailwind CSS, Lucide React
- **3D & Creative Development**: Three.js, Custom GLSL shaders, procedural mesh geometry, particle morphing
- **Motion Choreography**: GSAP (ScrollTrigger), Lenis smooth scroll, Framer Motion
- **Database & ORM**: Prisma ORM with SQLite for local development (structured for 1-click migration to PostgreSQL / Supabase)
- **Security & Admin Auth**: BCrypt password hashing, JWT session cookies, protected admin routes

---

## ✦ Site Sections & Signature Interactions

1. **Preloader**: Architectural dual "D" lock halves slide together, clamp with a mechanical shockwave, and execute a cinematic split-shutter wipe into the hero.
2. **Hero Scene**: Full-screen simplex noise GLSL shader reacting to cursor velocity, featuring a floating 3D extruded brushed titanium emblem. Tilts toward mouse with smooth damping; shackle halves separate and re-lock dynamically as the user scrolls.
3. **01/ Projects Showcase**: Horizontal pinned-scroll gallery with velocity-based card skew and WebGL liquid ripple distortion shaders on image hover.
4. **02/ Manifesto**: Pinned scroll narrative where words light up synchronously as an ambient 3D particle field morphs through 3 topologies: **Padlock → Code Brackets `{ }` → Geodesic Globe**.
5. **03/ Numbered Services**: ArtCraft-inspired technical hierarchy (`01/` to `04/`) with floating magnetic shader preview windows.
6. **04/ Process Timeline**: 4-stage engineering protocol timeline (Discover, Design, Build, Launch) with active deliverable matrices.
7. **05/ Telemetry & Tech Ring**: Orbiting 3D dual-ring simulation with revolving satellite tech nodes and animated benchmark counters.
8. **06/ Contact Transmission**: Giant *"Let's break the deadlock."* headline, mouse-proximity glowing GLSL canvas, and fully-functional contact form persisting submissions to SQLite.
9. **Brutalist Footer**: Monolithic DEADLOCK wordmark with hover glitch chromatic aberration and real-time atomic clocks for Tokyo, London, New York, and San Francisco.

---

## ✦ Quick Start & Local Setup

### 1. Prerequisites
- Node.js `v18.18+` or `v20+` (tested on Node `v22.17`)
- npm `v9+` or `v10+`

### 2. Installation
```bash
git clone https://github.com/deadlock-studio/deadlock.git
cd deadlock
npm install --legacy-peer-deps
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@deadlock.studio"
ADMIN_PASSWORD="deadlock2026!"
JWT_SECRET="deadlock_super_secret_jwt_key_2026_unbreakable_shackle"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
Push the schema and seed the 4 flagship projects and default admin user:
```bash
npx prisma db push
node prisma/seed.mjs
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live site.

---

## ✦ Studio Admin Control Center (`/admin`)

- **URL**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@deadlock.studio`
- **Default Password**: `deadlock2026!`

### Admin Capabilities:
- **Projects CRUD (`/admin/projects`)**: Create, edit, reorder, delete, and upload cover images. Order here immediately determines the homepage horizontal gallery sequence.
- **Inquiries Inbox (`/admin/messages`)**: View transmissions sent via the public contact form, inspect budgets, mark as read/unread, or dispatch email replies.
- **Site Settings (`/admin/settings`)**: Edit hero headline, narrative, tagline, contact emails, WhatsApp, and social links with instant revalidation.

---

## ✦ Production Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into **Vercel**.
3. Configure the Environment Variables in the Vercel dashboard:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - For persistent cloud production databases, provide a PostgreSQL connection string in `DATABASE_URL` (Supabase, Neon, or Prisma Postgres).
4. Deploy!
