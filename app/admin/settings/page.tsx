"use client";

import React, { useEffect, useState } from "react";
import { Sliders, Save, Check, RefreshCw } from "lucide-react";

interface SiteSettingsData {
  heroTitle: string;
  heroSubtitle: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  github: string;
  twitter: string;
  linkedin: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsData>({
    heroTitle: "WE BUILD WHAT OTHERS CAN'T UNLOCK.",
    heroSubtitle: "DEADLOCK is an elite software and motion laboratory. We engineer bespoke WebGL visual engines, high-frequency web applications, and immersive digital platforms for pioneers who refuse conventional templates.",
    tagline: "We build what others can't unlock.",
    contactEmail: "ops@deadlock.studio",
    contactPhone: "+1 (415) 890-5625",
    whatsapp: "+14158905625",
    github: "https://github.com/deadlock-studio",
    twitter: "https://twitter.com/deadlock_st",
    linkedin: "https://linkedin.com/company/deadlock-studio",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.heroTitle) {
          setSettings(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setStatusMessage("Site settings updated and live cache revalidated.");
        setTimeout(() => setStatusMessage(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <span className="text-[#C6FF3D] uppercase tracking-wider block mb-1">
            04 // SITE CONFIGURATION
          </span>
          <h1 className="text-3xl font-extrabold text-[#F4F4F0] font-sans tracking-tight">
            GLOBAL PARAMETERS
          </h1>
          <p className="text-[#8A8A93] mt-1">
            Edit brand copy, contact coordinates, and social endpoints with instant revalidation.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] flex items-center gap-2">
          <Check size={14} />
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Copy */}
        <div className="p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] space-y-4">
          <span className="text-xs font-bold text-[#F4F4F0] uppercase tracking-wider block border-b border-[rgba(255,255,255,0.06)] pb-2">
            HERO STAGE EDITORIAL COPY
          </span>

          <div>
            <label className="block text-[#8A8A93] mb-1 uppercase">HERO MAIN HEADLINE</label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8A8A93] mb-1 uppercase">HERO SUBTITLE / NARRATIVE</label>
            <textarea
              rows={3}
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8A8A93] mb-1 uppercase">BRAND TAGLINE</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="p-6 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] space-y-4">
          <span className="text-xs font-bold text-[#F4F4F0] uppercase tracking-wider block border-b border-[rgba(255,255,255,0.06)] pb-2">
            CONTACT & DISPATCH NODES
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8A8A93] mb-1 uppercase">CONTACT EMAIL</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8A8A93] mb-1 uppercase">WHATSAPP NUMBER</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8A8A93] mb-1 uppercase">GITHUB URL</label>
              <input
                type="text"
                value={settings.github}
                onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8A8A93] mb-1 uppercase">TWITTER / X</label>
              <input
                type="text"
                value={settings.twitter}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8A8A93] mb-1 uppercase">LINKEDIN URL</label>
              <input
                type="text"
                value={settings.linkedin}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.1)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-7 py-3 rounded bg-[#C6FF3D] text-[#070709] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#b2eb2b] transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? "SAVING CONFIG..." : "COMMIT SITE SETTINGS"}</span>
        </button>
      </form>
    </div>
  );
}
