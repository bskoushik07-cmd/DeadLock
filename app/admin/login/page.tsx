"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DeadlockIcon } from "@/components/logo/DeadlockIcon";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { soundManager } from "@/lib/audio";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@deadlock.studio");
  const [password, setPassword] = useState("deadlock2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      soundManager.playMechanicalLock();
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Access Denied";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070709] flex flex-col items-center justify-center px-6 selection:bg-[#C6FF3D] selection:text-[#070709]">
      <div className="w-full max-w-md p-8 rounded-xl bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] shadow-2xl relative">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <DeadlockIcon size={56} variant="default" animateOnMount={true} />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#C6FF3D] uppercase mb-1">
            TERMINAL ACCESS // DEADLOCK
          </span>
          <h1 className="text-2xl font-extrabold text-[#F4F4F0] tracking-tight">
            STUDIO CONTROL CENTER
          </h1>
          <p className="text-xs text-[#8A8A93] mt-1 font-mono">
            AUTHENTICATE SOVEREIGN CREDENTIALS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 font-mono">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#8A8A93] mb-1.5 uppercase tracking-wider">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.12)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#8A8A93] mb-1.5 uppercase tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded bg-[#070709] border border-[rgba(255,255,255,0.12)] text-[#F4F4F0] focus:border-[#C6FF3D] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded bg-[#C6FF3D] hover:bg-[#b5ee2e] text-[#070709] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span>VERIFYING RUNTIME...</span>
            ) : (
              <>
                <span>UNLOCK CONSOLE</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] font-mono text-[#56565F]">
          <span>PROTECTED BY BCrypt + JWT</span>
          <span className="flex items-center gap-1 text-[#8A8A93]">
            <Lock size={10} className="text-[#C6FF3D]" />
            SECURE PORT
          </span>
        </div>
      </div>
    </main>
  );
}
