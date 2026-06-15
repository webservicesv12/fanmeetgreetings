"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit2, X, Save, Loader2, Calendar, MapPin,
  Users, DollarSign, Star, CheckCircle, ToggleLeft, ToggleRight, Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";


const EMPTY_EVENT = {
  title: "", description: "", celebrityId: "", eventType: "",
  date: "", duration: 60, location: "", isOnline: false,
  capacity: 20, price: 5000, image: "", active: true,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">{label}</label>
      {children}
    </div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [celebrities, setCelebrities] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data: any } | null>(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/events").then(r => r.json()),
      fetch("/api/celebrities").then(r => r.json()),
      fetch("/api/admin/experiences").then(r => r.json()),
    ]).then(([evData, celData, expData]) => {
      setEvents(evData.events || []);
      setCelebrities(celData.celebrities || []);
      setExperiences(expData.experiences || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const set = (field: string, value: any) =>
    setModal(prev => prev ? { ...prev, data: { ...prev.data, [field]: value } } : prev);

  const save = async () => {
    if (!modal) return;
    const { mode, data } = modal;

    // Client-side validation
    if (!data.title?.trim())    { toast.error("Event title is required"); return; }
    if (!data.celebrityId)      { toast.error("Please select a celebrity"); return; }
    if (!data.eventType)        { toast.error("Please select an experience type"); return; }
    const selectedExp = experiences.find((e: any) => e.type === data.eventType);
    const isTimed = selectedExp?.isTimedEvent ?? false;
    if (isTimed && !data.date) { toast.error("Date & time is required"); return; }
    if (!data.price && data.price !== 0) { toast.error("Price is required"); return; }

    setSaving(true);
    try {
      const url = mode === "add" ? "/api/admin/events" : `/api/admin/events/${data.id}`;
      const method = mode === "add" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success(mode === "add" ? "Event created!" : "Event updated!");
      setModal(null);
      fetchAll();
    } catch (e: any) { toast.error(e.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted!");
    } catch { toast.error("Delete failed"); }
  };

  const toggle = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/admin/events/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      setEvents(prev => prev.map(e => e.id === id ? { ...e, active: !active } : e));
      toast.success(`Event ${!active ? "activated" : "deactivated"}!`);
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Events <span className="text-gradient-gold">Management</span>
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">Create and manage public events</p>
        </div>
        <button onClick={() => setModal({ mode: "add", data: { ...EMPTY_EVENT, eventType: experiences[0]?.type || "" } })}
          className="btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="card-luxury p-16 text-center">
          <Calendar size={48} className="text-[#4B5563] mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No events yet</p>
          <p className="text-[#6B7280] text-sm mb-6">Create your first event to get started</p>
          <button onClick={() => setModal({ mode: "add", data: { ...EMPTY_EVENT, eventType: experiences[0]?.type || "" } })}
            className="btn-gold px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto">
            <Plus size={16} /> Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card-luxury overflow-hidden ${!event.active ? "opacity-60" : ""}`}>
              {/* Top bar */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{event.title}</h3>
                    <p className="text-[#D4AF37] text-xs mt-0.5">{event.celebrity?.name}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    event.active ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-red-400 border-red-400/20 bg-red-400/10"
                  }`}>{event.active ? "Active" : "Inactive"}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                  <Calendar size={12} />
                  <span>
                    {event.date
                      ? format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")
                      : <span className="text-blue-400 flex items-center gap-1"><Clock size={11} /> Timed Event</span>
                    }
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                    <MapPin size={12} /><span className="truncate">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs">
                    <Users size={12} /><span>{event.booked || 0}/{event.capacity} booked</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-bold">
                    <DollarSign size={12} /><span>${Number(event.price).toLocaleString()}</span>
                  </div>
                </div>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-purple-400">
                  {experiences.find(e => e.type === event.eventType)?.label || event.eventType}
                </span>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center gap-2">
                <button onClick={() => setModal({ mode: "edit", data: {
                  ...event,
                  date: event.date ? new Date(event.date).toISOString().slice(0,16) : "",
                }})}
                  className="flex-1 py-2 rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-400 text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-400/20 transition-colors">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => toggle(event.id, event.active)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors ${
                    event.active
                      ? "border-amber-400/20 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
                      : "border-green-400/20 bg-green-400/10 text-green-400 hover:bg-green-400/20"
                  }`}>
                  {event.active ? <ToggleLeft size={12} /> : <ToggleRight size={12} />}
                </button>
                <button onClick={() => deleteEvent(event.id)}
                  className="py-2 px-3 rounded-xl border border-red-400/20 bg-red-400/10 text-red-400 text-xs font-medium flex items-center gap-1 hover:bg-red-400/20 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card-luxury p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-white">
                  {modal.mode === "add" ? "Create New Event" : "Edit Event"}
                </h2>
                <button onClick={() => setModal(null)} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="Event Title *">
                      <input value={modal.data.title} onChange={e => set("title", e.target.value)}
                        className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="VIP Meet & Greet with..." />
                    </Field>
                  </div>

                  <Field label="Celebrity *">
                    <select value={modal.data.celebrityId} onChange={e => set("celebrityId", e.target.value)}
                      className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: "#111118" }}>
                      <option value="">Select a celebrity</option>
                      {celebrities.map((c: any) => (
                        <option key={c.id} value={c.id} style={{ background: "#111118" }}>{c.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Experience Type *">
                    <select value={modal.data.eventType} onChange={e => {
                      const newType = e.target.value;
                      const exp = experiences.find((x: any) => x.type === newType);
                      // Clear date when switching to a non-timed event type
                      set("eventType", newType);
                      if (!exp?.isTimedEvent) set("date", "");
                    }}
                      className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: "#111118" }}>
                      {experiences.length === 0 && (
                        <option value="" disabled>Loading experiences...</option>
                      )}
                      {experiences.map(exp => (
                        <option key={exp.type} value={exp.type} style={{ background: "#111118" }}>
                          {exp.icon ? `${exp.icon} ` : ""}{exp.label}{exp.isTimedEvent ? " 🕐" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Timed event banner / date field */}
                  {(() => {
                    const selExp = experiences.find((e: any) => e.type === modal.data.eventType);
                    if (!selExp?.isTimedEvent) {
                      return (
                        <div className="md:col-span-2 flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-400/5 border border-blue-400/20">
                          <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-blue-300 text-xs leading-relaxed">
                            <strong>Not a Timed Event</strong> — this experience type is not tied to a specific schedule.
                            Date &amp; time fields are <strong>not required</strong>.
                          </p>
                        </div>
                      );
                    }
                    return (
                      <Field label="Date & Time *">
                        <input type="datetime-local" value={modal.data.date} onChange={e => set("date", e.target.value)}
                          className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" />
                      </Field>
                    );
                  })()}

                  <Field label="Duration (minutes) *">
                    <input type="number" value={modal.data.duration} onChange={e => set("duration", e.target.value)}
                      className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" min={5} step={5} />
                  </Field>

                  <Field label="Price ($) *">
                    <input type="number" value={modal.data.price} onChange={e => set("price", e.target.value)}
                      className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" min={0} />
                  </Field>

                  <Field label="Capacity (max guests) *">
                    <input type="number" value={modal.data.capacity} onChange={e => set("capacity", e.target.value)}
                      className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" min={1} />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Location">
                      <input value={modal.data.location || ""} onChange={e => set("location", e.target.value)}
                        className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="Venue name, city..." />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea value={modal.data.description || ""} onChange={e => set("description", e.target.value)}
                        rows={3} className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl resize-none"
                        placeholder="Describe the event experience..." />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Image URL (optional)">
                      <input value={modal.data.image || ""} onChange={e => set("image", e.target.value)}
                        className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="https://..." />
                    </Field>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button onClick={() => set("isOnline", !modal.data.isOnline)}
                        className={`w-10 h-6 rounded-full transition-colors relative ${modal.data.isOnline ? "bg-[#D4AF37]" : "bg-[#1a1a2e]"}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${modal.data.isOnline ? "left-5" : "left-1"}`} />
                      </button>
                      <span className="text-sm text-[#C9C9D4]">Online Event</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <button onClick={() => set("active", !modal.data.active)}
                        className={`w-10 h-6 rounded-full transition-colors relative ${modal.data.active ? "bg-[#D4AF37]" : "bg-[#1a1a2e]"}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${modal.data.active ? "left-5" : "left-1"}`} />
                      </button>
                      <span className="text-sm text-[#C9C9D4]">Active / Visible</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                  <button onClick={save} disabled={saving}
                    className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Saving..." : modal.mode === "add" ? "Create Event" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
