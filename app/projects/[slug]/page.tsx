import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ExternalLink, Code2, Terminal, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found // DEADLOCK" };

  return {
    title: `${project.title} — Case Study // DEADLOCK`,
    description: project.shortDesc,
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  // Get next project for bottom footer transition
  const allProjects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <article className="min-h-screen bg-[#070709] text-[#F4F4F0] pt-28 pb-20 selection:bg-[#C6FF3D] selection:text-[#070709]">
      {/* Top Floating Navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-6 font-mono text-xs">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-[#8A8A93] hover:text-[#C6FF3D] transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO ARCHIVE</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.accentColor }} />
          <span className="text-[#8A8A93]">{project.category}</span>
          <span className="text-[#56565F]">|</span>
          <span className="text-[#C6FF3D]">CONFIDENTIAL CASE // {project.year}</span>
        </div>
      </div>

      {/* Case Study Header & Giant Typography */}
      <header className="max-w-7xl mx-auto px-6 sm:px-10 mb-12">
        <div className="flex items-center gap-3 font-mono text-xs text-[#8A8A93] mb-4">
          <span className="text-[#C6FF3D]">0{currentIndex + 1}/</span>
          <span className="uppercase tracking-widest">{project.client}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#F4F4F0] max-w-5xl leading-[0.98]">
          {project.title}
        </h1>

        <p className="mt-6 text-lg sm:text-2xl text-[#8A8A93] max-w-3xl font-light leading-relaxed">
          {project.shortDesc}
        </p>

        {/* Technical Metadata Matrix */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#56565F] uppercase block tracking-wider mb-1">CLIENT</span>
            <span className="text-[#F4F4F0] font-semibold">{project.client}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#56565F] uppercase block tracking-wider mb-1">YEAR</span>
            <span className="text-[#F4F4F0] font-semibold">{project.year}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#56565F] uppercase block tracking-wider mb-1">ROLE</span>
            <span className="text-[#F4F4F0] font-semibold">{project.role}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#56565F] uppercase block tracking-wider mb-1">CATEGORY</span>
            <span className="text-[#C6FF3D] font-semibold">{project.category}</span>
          </div>
        </div>

        {/* Live Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-[#C6FF3D] text-[#070709] font-bold uppercase hover:shadow-[0_0_24px_rgba(198,255,61,0.5)] transition-all duration-300"
            >
              <span>LAUNCH DEPLOYMENT</span>
              <ExternalLink size={14} />
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-[#0F0F13] border border-[rgba(255,255,255,0.12)] text-[#F4F4F0] hover:text-[#C6FF3D] hover:border-[#C6FF3D]/50 uppercase transition-all duration-300"
            >
              <Code2 size={14} />
              <span>SOURCE AUDIT</span>
            </a>
          )}
        </div>
      </header>

      {/* Hero Visual Imagery */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 mb-16">
        <div className="relative w-full h-[360px] sm:h-[540px] lg:h-[650px] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#0A0A0E] shadow-2xl">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Narrative & Case Study Content */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 mb-24">
        <div className="prose prose-invert prose-headings:font-display prose-headings:font-extrabold prose-p:text-[#8A8A93] prose-p:text-lg prose-p:leading-relaxed prose-strong:text-[#F4F4F0] prose-li:text-[#8A8A93] max-w-none">
          <div className="space-y-6">
            {project.longDesc.split("\n\n").map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h2 key={idx} className="text-3xl font-extrabold text-[#F4F4F0] mt-10 mb-4 tracking-tight">
                    {block.replace("### ", "")}
                  </h2>
                );
              }
              if (block.startsWith("#### ")) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-[#C6FF3D] mt-8 mb-3 tracking-wide font-mono uppercase">
                    {block.replace("#### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n- ").map((item) => item.replace("- ", ""));
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 font-mono text-sm text-[#8A8A93]">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-[#8A8A93] text-base sm:text-lg leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>
        </div>

        {/* Key Metrics Callout Matrix */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)]">
          <div className="border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.08)] pb-4 sm:pb-0 sm:pr-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#C6FF3D] font-mono">0.18ms</span>
            <span className="block mt-1 text-xs font-mono text-[#8A8A93] uppercase">Avg Latency Benchmark</span>
          </div>
          <div className="border-b sm:border-b-0 sm:border-r border-[rgba(255,255,255,0.08)] pb-4 sm:pb-0 sm:pr-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#F4F4F0] font-mono">120 FPS</span>
            <span className="block mt-1 text-xs font-mono text-[#8A8A93] uppercase">Sustained WebGL Rendering</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#C6FF3D] font-mono">100%</span>
            <span className="block mt-1 text-xs font-mono text-[#8A8A93] uppercase">Sovereign Architecture</span>
          </div>
        </div>
      </section>

      {/* Next Project Footer Switcher */}
      {nextProject && (
        <section className="max-w-7xl mx-auto px-6 sm:px-10 border-t border-[rgba(255,255,255,0.08)] pt-16">
          <span className="text-xs font-mono text-[#56565F] uppercase tracking-widest block mb-4">
            NEXT ARCHIVE PROTOCOL //
          </span>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] hover:border-[#C6FF3D]/50 transition-all duration-300"
          >
            <div>
              <span className="text-xs font-mono text-[#8A8A93] uppercase">{nextProject.category}</span>
              <h4 className="text-3xl sm:text-5xl font-extrabold text-[#F4F4F0] group-hover:text-[#C6FF3D] transition-colors duration-200 mt-1">
                {nextProject.title}
              </h4>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-[#C6FF3D]">
              <span>EXPLORE CASE</span>
              <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </section>
      )}
    </article>
  );
}
