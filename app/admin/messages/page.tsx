"use client";

import React, { useEffect, useState } from "react";
import { Mail, CheckCircle2, Clock, Trash2, Check, RefreshCw } from "lucide-react";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleReadStatus = async (msg: MessageItem) => {
    try {
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !msg.read }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
        );
        if (selectedMessage?.id === msg.id) {
          setSelectedMessage({ ...selectedMessage, read: !msg.read });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this transmission record?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <span className="text-[#C6FF3D] uppercase tracking-wider block mb-1">
            03 // COMMUNICATIONS RADAR
          </span>
          <h1 className="text-3xl font-extrabold text-[#F4F4F0] font-sans tracking-tight">
            INQUIRIES INBOX
          </h1>
          <p className="text-[#8A8A93] mt-1">
            Review incoming project briefs, budget allocations, and contact transmissions.
          </p>
        </div>

        <button
          onClick={loadMessages}
          className="flex items-center gap-2 px-3.5 py-2 rounded bg-[#0F0F13] border border-[rgba(255,255,255,0.1)] text-[#8A8A93] hover:text-[#C6FF3D]"
        >
          <RefreshCw size={13} />
          <span>POLL DATABASE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List Table */}
        <div className="lg:col-span-5 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[#8A8A93]">
            <span>SIGNAL QUEUE</span>
            <span>{messages.length} TRANSMISSIONS</span>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.06)] max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-[#8A8A93]">SYNCING TELEMETRY...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-[#56565F]">NO TRANSMISSIONS LOGGED</div>
            ) : (
              messages.map((m) => {
                const isSelected = selectedMessage?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMessage(m)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#181822] border-l-2 border-[#C6FF3D]"
                        : "hover:bg-[#13131A]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-sans font-bold text-sm ${
                          m.read ? "text-[#8A8A93]" : "text-[#F4F4F0]"
                        }`}
                      >
                        {m.name}
                      </span>
                      <span className="text-[10px] text-[#56565F]">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#8A8A93] mb-2">
                      <span>{m.company || "Independent"}</span>
                      {m.budget && (
                        <>
                          <span className="text-[#56565F]">•</span>
                          <span className="text-[#C6FF3D]">{m.budget}</span>
                        </>
                      )}
                    </div>

                    <p className="text-[11px] text-[#56565F] line-clamp-1">{m.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Message Reader */}
        <div className="lg:col-span-7 rounded-lg bg-[#0F0F13] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
                <div>
                  <span className="text-[10px] text-[#C6FF3D] uppercase tracking-wider block mb-1">
                    TRANSMISSION DETAILS
                  </span>
                  <h3 className="text-2xl font-bold font-sans text-[#F4F4F0]">
                    {selectedMessage.name}
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-[#8A8A93] hover:text-[#C6FF3D] underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReadStatus(selectedMessage)}
                    className={`px-3 py-1.5 rounded flex items-center gap-1.5 ${
                      selectedMessage.read
                        ? "bg-[#C6FF3D]/10 text-[#C6FF3D]"
                        : "bg-[#1E1E28] text-[#8A8A93] hover:text-[#F4F4F0]"
                    }`}
                  >
                    <Check size={12} />
                    <span>{selectedMessage.read ? "Marked Read" : "Mark as Read"}</span>
                  </button>

                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-1.5 rounded text-[#8A8A93] hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Metadata matrix */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded bg-[#070709] border border-[rgba(255,255,255,0.06)]">
                <div>
                  <span className="text-[10px] text-[#56565F] uppercase block mb-0.5">
                    ORGANIZATION
                  </span>
                  <span className="text-[#F4F4F0]">{selectedMessage.company || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#56565F] uppercase block mb-0.5">
                    ESTIMATED BUDGET
                  </span>
                  <span className="text-[#C6FF3D] font-bold">
                    {selectedMessage.budget || "Unspecified"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#56565F] uppercase block tracking-wider mb-2">
                  PROJECT BRIEF / TRANSMISSION PAYLOAD:
                </span>
                <div className="p-4 rounded bg-[#070709] border border-[rgba(255,255,255,0.06)] text-[#F4F4F0] text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=DEADLOCK%20Studio%20//%20Re:%20Project%20Inquiry`}
                  className="px-5 py-2.5 rounded bg-[#C6FF3D] text-[#070709] font-bold uppercase hover:bg-[#b5ee2e] transition-colors"
                >
                  DISPATCH EMAIL REPLY
                </a>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-[#56565F] space-y-2">
              <Mail size={32} className="mx-auto opacity-30" />
              <p>SELECT A TRANSMISSION FROM THE RADAR QUEUE TO INSPECT</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
