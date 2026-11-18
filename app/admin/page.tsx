"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FolderGit2, Mail, Eye, Activity, Plus, ArrowUpRight } from "lucide-react";
import { ProjectData } from "@/components/showcase/ProjectShowcase";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [messages, setMessages] = useState<{ id: string; name: string; message: string; createdAt: string; read: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/messages").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([projs, msgs]) => {
        if (Array.isArray(projs)) setProjects(projs);
        if (Array.isArray(msgs)) setMessages(msgs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const projectCount = projects.length;
  const publishedCount = projects.filter((p) => p.published).length;
  const messageCount = messages.length;
  const unreadMessageCount = messages.filter((m) => !m.read).length;

  const recentProjects = projects.slice(0, 5);
  const recentMessages = messages.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <span className="text-xs font-mono text-[#C6FF3D] uppercase tracking-wider block mb-1">
            01 // SYSTEM OVERVIEW
          </span>
          <h1 className="text-3xl font-extrabold text-[#F4F4F0] font-sans tracking-tight">
            STUDIO METRICS
          </h1>
        </div>

        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#C6FF3D] text-[#070709] font-mono text-xs font-bold uppercase hover:bg-[#b2eb2b] transition-colors"
        >
          <Plus size={14} />
          <span>NEW PROJECT PROTOCOL</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8A8A93] font-mono text-xs mb-3">
            <span>TOTAL ARCHIVES</span>
            <FolderGit2 size={16} className="text-[#C6FF3D]" />
          </div>
          <span className="text-3xl font-extrabold text-[#F4F4F0] font-mono">{projectCount}</span>
          <span className="text-[11px] text-[#56565F] font-mono mt-1">{publishedCount} published live</span>
        </div>

        <div className="p-5 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8A8A93] font-mono text-xs mb-3">
            <span>INQUIRIES INBOX</span>
            <Mail size={16} className="text-[#C6FF3D]" />
          </div>
          <span className="text-3xl font-extrabold text-[#F4F4F0] font-mono">{messageCount}</span>
          <span className="text-[11px] text-[#C6FF3D] font-mono mt-1">{unreadMessageCount} new pending response</span>
        </div>

        <div className="p-5 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8A8A93] font-mono text-xs mb-3">
            <span>ENGINE STATUS</span>
            <Activity size={16} className="text-[#C6FF3D]" />
          </div>
          <span className="text-2xl font-extrabold text-[#C6FF3D] font-mono">OPTIMAL</span>
          <span className="text-[11px] text-[#56565F] font-mono mt-1">60 FPS WebGL Runtime</span>
        </div>

        <div className="p-5 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8A8A93] font-mono text-xs mb-3">
            <span>DATABASE HOST</span>
            <Eye size={16} className="text-[#C6FF3D]" />
          </div>
          <span className="text-2xl font-extrabold text-[#F4F4F0] font-mono">SQLITE</span>
          <span className="text-[11px] text-[#56565F] font-mono mt-1">Local Dev // Supabase Ready</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Projects & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Preview */}
        <div className="p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <span className="font-mono text-xs text-[#C6FF3D] uppercase">ARCHIVE MANIFEST</span>
            <Link href="/admin/projects" className="text-xs font-mono text-[#8A8A93] hover:text-[#F4F4F0] flex items-center gap-1">
              <span>MANAGE ALL</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            {recentProjects.map((p, i) => (
              <div key={p.id} className="py-3 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#56565F]">0{i + 1}/</span>
                  <div>
                    <span className="text-[#F4F4F0] font-semibold block">{p.title}</span>
                    <span className="text-[10px] text-[#8A8A93]">{p.client} — {p.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      p.published ? "bg-[#C6FF3D]/10 text-[#C6FF3D]" : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiries Preview */}
        <div className="p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <span className="font-mono text-xs text-[#C6FF3D] uppercase">INCOMING SIGNALS</span>
            <Link href="/admin/messages" className="text-xs font-mono text-[#8A8A93] hover:text-[#F4F4F0] flex items-center gap-1">
              <span>VIEW INBOX</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            {recentMessages.length === 0 ? (
              <p className="py-6 text-center text-xs font-mono text-[#56565F]">
                NO INCOMING INQUIRIES LOGGED YET
              </p>
            ) : (
              recentMessages.map((m) => (
                <div key={m.id} className="py-3 font-mono text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#F4F4F0] font-semibold">{m.name}</span>
                    <span className="text-[10px] text-[#56565F]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A8A93] line-clamp-1">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
