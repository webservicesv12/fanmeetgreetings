"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, RotateCcw, Plus, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";

// Converts a label to a safe type key, e.g. "Private Yacht Party" → "PRIVATE_YACHT_PARTY"
const toTypeKey = (label: string) =>
  label.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "CUSTOM";

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Stable ID map: ensures React never remounts a card while the admin is typing
  const stableIds = useRef<Map<number, string>>(new Map());

  const getStableId = (index: number) => {
    if (!stableIds.current.has(index)) {
      stableIds.current.set(index, `exp-${Date.now()}-${index}`);
    }
    return stableIds.current.get(index)!;
  };

  const fetchExperiences = () => {
    setLoading(true);
    stableIds.current.clear();
    fetch("/api/admin/experiences")
      .then(r => r.json())
      .then(d => { setExperiences(d.experiences || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchExperiences(); }, []);

  const update = (index: number, field: string, value: any) => {
    setExperiences(prev => prev.map((exp, i) => {
      if (i !== index) return exp;
      const updated = { ...exp, [field]: value };
      // Auto-sync type key only when label changes AND the admin hasn't manually edited type
      if (field === "label" && exp.isCustom && !exp._typeEdited) {
        updated.type = toTypeKey(value);
      }
      return updated;
    }));
  };

  const updateType = (index: number, value: string) => {
    setExperiences(prev => prev.map((exp, i) =>
      i !== index ? exp : { ...exp, type: value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"), _typeEdited: true }
    ));
  };

  const addNew = () => {
    const newIndex = experiences.length;
    stableIds.current.set(newIndex, `exp-new-${Date.now()}`);
    setExperiences(prev => [
      ...prev,
      { type: `CUSTOM_${Date.now()}`, label: "", icon: "", defaultPrice: 1000, defaultDuration: 30, description: "", isCustom: true },
    ]);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const remove = (index: number) => {
    if (!confirm("Remove this experience type?")) return;
    stableIds.current.delete(index);
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    for (const exp of experiences) {
      if (!exp.label?.trim()) { toast.error("All experiences must have a display name"); return; }
      if (!exp.type?.trim()) { toast.error("All experiences must have a type code"); return; }
    }
    const types = experiences.map(e => e.type);
    if (new Set(types).size !== types.length) {
      toast.error("Duplicate type codes — each experience must have a unique name");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/experiences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiences }),
      });
      if (!res.ok) throw new Error();
      toast.success("Experience types saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving}
      className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      {saving ? "Saving..." : "Save All"}
    </button>
  );

  return (
    <div className="p-4 md:p-8 pb-28">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Experience <span className="text-gradient-gold">Types</span>
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">
            Customize display names, icons, and default pricing. Add new custom types.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={fetchExperiences} className="btn-glass p-2.5 rounded-xl" title="Reload">
            <RotateCcw size={16} />
          </button>
          <button onClick={addNew}
            className="btn-glass px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border-[#D4AF37]/30 text-[#D4AF37]">
            <Plus size={16} /> Add
          </button>
          <SaveBtn />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <motion.div
                // Use a stable key that NEVER changes while typing — only assigned once per slot
                key={getStableId(i)}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`card-luxury p-5 ${exp.isCustom ? "border border-[#D4AF37]/20" : ""}`}>

                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-xl shrink-0">
                      {exp.icon || <span className="text-[#4B5563] text-sm">?</span>}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {exp.label || <span className="text-[#4B5563]">New Experience</span>}
                      </p>
                      <p className="text-[#4B5563] text-xs font-mono">{exp.type}</p>
                    </div>
                    {exp.isCustom && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                  {exp.isCustom && (
                    <button onClick={() => remove(i)}
                      className="w-8 h-8 rounded-xl border border-red-400/20 bg-red-400/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors shrink-0"
                      title="Remove">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Icon */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Icon <span className="text-[#4B5563] normal-case">(emoji, optional)</span>
                    </label>
                    <input
                      value={exp.icon || ""}
                      onChange={e => update(i, "icon", e.target.value)}
                      className="input-luxury w-full px-3 py-2 text-2xl rounded-xl text-center"
                      maxLength={4}
                      placeholder="✨"
                    />
                  </div>

                  {/* Display Name — uses uncontrolled-style to avoid remount */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Display Name *
                    </label>
                    <input
                      value={exp.label}
                      onChange={e => update(i, "label", e.target.value)}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl"
                      placeholder="e.g. Private Yacht Party"
                      autoComplete="off"
                    />
                  </div>

                  {/* Default Price */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Default Price ($)
                    </label>
                    <input
                      type="number"
                      value={exp.defaultPrice}
                      onChange={e => update(i, "defaultPrice", Number(e.target.value))}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl"
                      min={0}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={exp.defaultDuration}
                      onChange={e => update(i, "defaultDuration", Number(e.target.value))}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl"
                      min={1}
                    />
                  </div>

                  {/* Type Code — custom only */}
                  {exp.isCustom && (
                    <div>
                      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                        Type Code <span className="text-[#4B5563] normal-case">(auto-generated)</span>
                      </label>
                      <input
                        value={exp.type}
                        onChange={e => updateType(i, e.target.value)}
                        className="input-luxury w-full px-3 py-2 text-xs rounded-xl font-mono text-[#D4AF37]"
                        placeholder="CUSTOM_EXPERIENCE"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className={exp.isCustom ? "col-span-2 md:col-span-3" : "col-span-2 md:col-span-4"}>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Description
                    </label>
                    <input
                      value={exp.description || ""}
                      onChange={e => update(i, "description", e.target.value)}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl"
                      placeholder="Short description shown to users..."
                    />
                  </div>
                </div>

                {/* ── Timed Event Toggle ───────────────────────────── */}
                <div className={`mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4 flex-wrap`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Timed Event</p>
                      <p className="text-[#6B7280] text-xs mt-0.5 leading-relaxed">
                        Enable if this experience happens at a pre-set schedule (e.g. Live Concert, Live Appearance).
                        When selected for an event, the date &amp; time fields will be <strong className="text-[#9CA3AF]">hidden</strong> — no scheduling needed.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => update(i, "isTimedEvent", !exp.isTimedEvent)}
                    className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                      exp.isTimedEvent ? "bg-blue-500" : "bg-[#1a1a2e] border border-white/10"
                    }`}
                    aria-label="Toggle timed event"
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      exp.isTimedEvent ? "left-7" : "left-1"
                    }`} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Bottom Add button */}
      {!loading && (
        <motion.button onClick={addNew} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full mt-4 py-4 rounded-2xl border border-dashed border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#D4AF37]/5 transition-colors">
          <Plus size={16} /> Add New Experience Type
        </motion.button>
      )}

      {/* Info */}
      <div className="mt-6 p-4 glass rounded-xl">
        <p className="text-[#6B7280] text-xs leading-relaxed">
          💡 <strong className="text-[#9CA3AF]">Built-in types</strong> (Meet & Greet, Video Call, etc.) sync with the booking form.{" "}
          <strong className="text-[#9CA3AF]">Custom types</strong> you add here also appear in the experience selector.
          Icon is optional — leave blank for a "?" placeholder. Click <strong className="text-[#9CA3AF]">Save All</strong> to apply.
        </p>
      </div>

      {/* ── Sticky floating save bar at the bottom ────────────────────── */}
      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#080808]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-[#6B7280] text-xs hidden sm:block">
            {experiences.length} experience type{experiences.length !== 1 ? "s" : ""} — remember to save!
          </p>
          <div className="flex gap-2 ml-auto">
            <button onClick={addNew}
              className="btn-glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 text-[#D4AF37] border-[#D4AF37]/20">
              <Plus size={14} /> Add
            </button>
            <SaveBtn />
          </div>
        </div>
      )}
    </div>
  );
}
