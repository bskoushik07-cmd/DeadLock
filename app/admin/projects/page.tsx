"use client";

import React, { useEffect, useState } from "react";
import { ProjectData } from "@/components/showcase/ProjectShowcase";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<ProjectData> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTogglePublished = async (project: ProjectData) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, published: !project.published }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
        );
        showNotice("Project status updated");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (project: ProjectData) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, featured: !project.featured }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: !p.featured } : p))
        );
        showNotice("Featured priority updated");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const copy = [...projects];
    const current = copy[index];
    const target = copy[targetIndex];

    const currentOrder = current.order;
    current.order = target.order;
    target.order = currentOrder;

    copy[index] = target;
    copy[targetIndex] = current;
    setProjects(copy);

    try {
      await fetch(`/api/projects/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      await fetch(`/api/projects/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      });
      showNotice("Reordered successfully");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you certain you want to purge this project protocol from the database?")) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showNotice("Project purged from database");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const url = isNew ? "/api/projects" : `/api/projects/${editingProject.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        setEditingProject(null);
        loadProjects();
        showNotice(isNew ? "Created new project protocol" : "Project updated successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url && editingProject) {
        setEditingProject({ ...editingProject, coverImage: data.url });
        showNotice("Cover image uploaded");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const showNotice = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <span className="text-[#C6FF3D] uppercase tracking-wider block mb-1">
            02 // ARCHIVE MANAGEMENT
          </span>
          <h1 className="text-3xl font-extrabold text-[#F4F4F0] font-sans tracking-tight">
            PROJECTS CRUD & SHOWCASE
          </h1>
          <p className="text-[#8A8A93] mt-1">
            Order here directly determines the horizontal gallery sequence on the homepage.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingProject({
              title: "",
              slug: "",
              client: "",
              year: "2026",
              role: "Creative Development & Architecture",
              category: "WebGL / Web",
              shortDesc: "",
              longDesc: "### Technical Specifications\n\n#### The Challenge\n\n#### The Architecture\n\n#### Outcome",
              coverImage: "/projects/kinetic-labs.svg",
              accentColor: "#C6FF3D",
              featured: false,
              published: true,
              order: projects.length + 1,
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#C6FF3D] text-[#070709] font-bold uppercase hover:bg-[#b5ee2e] transition-colors"
        >
          <Plus size={14} />
          <span>CREATE PROJECT</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] flex items-center gap-2">
          <Check size={14} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Projects Table */}
      <div className="rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[#8A8A93] bg-[#070709]/50">
                <th className="p-4 w-12 text-center">ORDER</th>
                <th className="p-4">PROJECT & CLIENT</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4 text-center">FEATURED</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8A8A93]">
                    READING SQLITE RUNTIME...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8A8A93]">
                    NO PROJECTS IN DATABASE. INITIALIZE WITH SEED.
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr key={project.id} className="hover:bg-[#15151C] transition-colors">
                    {/* Order controls */}
                    <td className="p-4 text-center font-bold text-[#F4F4F0]">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(index, "up")}
                          disabled={index === 0}
                          className="text-[#8A8A93] hover:text-[#C6FF3D] disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <span>{index + 1}</span>
                        <button
                          onClick={() => handleMoveOrder(index, "down")}
                          disabled={index === projects.length - 1}
                          className="text-[#8A8A93] hover:text-[#C6FF3D] disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </td>

                    {/* Title & Client */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: project.accentColor }}
                        />
                        <div>
                          <span className="font-extrabold font-sans text-sm text-[#F4F4F0] block">
                            {project.title}
                          </span>
                          <span className="text-[#8A8A93] text-[11px]">
                            {project.client} // {project.year}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-[#8A8A93]">{project.category}</td>

                    {/* Featured Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded transition-colors ${
                          project.featured
                            ? "text-[#C6FF3D] bg-[#C6FF3D]/10 hover:bg-[#C6FF3D]/20"
                            : "text-[#56565F] hover:text-[#8A8A93]"
                        }`}
                        title="Toggle Showcase Featured"
                      >
                        <Star size={14} fill={project.featured ? "#C6FF3D" : "none"} />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(project)}
                        className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                          project.published
                            ? "bg-[#C6FF3D]/15 text-[#C6FF3D]"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {project.published ? <Eye size={11} /> : <EyeOff size={11} />}
                        <span>{project.published ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setIsNew(false);
                            setEditingProject(project);
                          }}
                          className="p-1.5 rounded text-[#8A8A93] hover:text-[#C6FF3D] hover:bg-[#1F1F28]"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 rounded text-[#8A8A93] hover:text-red-400 hover:bg-red-950/20"
                          title="Purge"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F13] border border-[rgba(255,255,255,0.12)] rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div>
                <span className="text-[#C6FF3D] text-[10px] tracking-widest uppercase block">
                  {isNew ? "PROTOCOL INITIATION" : "PROTOCOL MODIFICATION"}
                </span>
                <h2 className="text-xl font-bold font-sans text-[#F4F4F0]">
                  {isNew ? "Create New Project Archive" : `Edit ${editingProject.title}`}
                </h2>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="text-[#8A8A93] hover:text-[#F4F4F0]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8A8A93] mb-1">PROJECT TITLE</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8A93] mb-1">SLUG (URL KEY)</label>
                  <input
                    type="text"
                    value={editingProject.slug || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="auto-generated-if-empty"
                    className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#8A8A93] mb-1">CLIENT</label>
                  <input
                    type="text"
                    value={editingProject.client || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8A93] mb-1">YEAR</label>
                  <input
                    type="text"
                    value={editingProject.year || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8A93] mb-1">CATEGORY</label>
                  <input
                    type="text"
                    value={editingProject.category || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8A8A93] mb-1">ROLE</label>
                  <input
                    type="text"
                    value={editingProject.role || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8A93] mb-1">ACCENT HEX</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingProject.accentColor || "#C6FF3D"}
                      onChange={(e) => setEditingProject({ ...editingProject, accentColor: e.target.value })}
                      className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingProject.accentColor || "#C6FF3D"}
                      onChange={(e) => setEditingProject({ ...editingProject, accentColor: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#8A8A93] mb-1">COVER IMAGE PATH OR UPLOAD</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.coverImage || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    className="flex-1 px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                  />
                  <label className="px-3 py-2 rounded bg-[#16161F] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] hover:text-[#C6FF3D] cursor-pointer flex items-center gap-1.5">
                    <Upload size={13} />
                    <span>{uploading ? "..." : "UPLOAD"}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[#8A8A93] mb-1">SHORT SUMMARY</label>
                <textarea
                  rows={2}
                  value={editingProject.shortDesc || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8A8A93] mb-1">FULL CASE STUDY (MARKDOWN)</label>
                <textarea
                  rows={6}
                  value={editingProject.longDesc || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, longDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded border border-[rgba(255,255,255,0.1)] text-[#8A8A93] hover:text-[#F4F4F0]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#C6FF3D] text-[#070709] font-bold uppercase hover:bg-[#b2eb2b]"
                >
                  SAVE PROTOCOL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
