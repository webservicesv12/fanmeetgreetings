"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, RotateCcw, Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

// Converts a label to a safe type key, e.g. "Private Yacht Party" → "PRIVATE_YACHT_PARTY"
const toTypeKey = (label: string) =>
  label.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "CUSTOM";

const BLANK_EXPERIENCE = {
  type: "", label: "", icon: "", defaultPrice: 1000, defaultDuration: 30,
  description: "", isCustom: true,
};

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchExperiences = () => {
    setLoading(true);
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
      // Auto-sync type key from label for custom entries
      if (field === "label" && exp.isCustom) {
        updated.type = toTypeKey(value);
      }
      return updated;
    }));
  };

  const addNew = () => {
    setExperiences(prev => [
      ...prev,
      { ...BLANK_EXPERIENCE, type: `CUSTOM_${Date.now()}` },
    ]);
    // Scroll to bottom after render
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const remove = (index: number) => {
    if (!confirm("Remove this experience type?")) return;
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    // Validate required fields
    for (const exp of experiences) {
      if (!exp.label?.trim()) { toast.error("All experiences must have a display name"); return; }
      if (!exp.type?.trim()) { toast.error("All experiences must have a type code"); return; }
    }
    // Check for duplicate type codes
    const types = experiences.map(e => e.type);
    if (new Set(types).size !== types.length) { toast.error("Duplicate type codes found — make sure each experience has a unique name"); return; }

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

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Experience <span className="text-gradient-gold">Types</span>
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">
            Customize display names, icons, and default pricing. Add new custom experience types.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={fetchExperiences} className="btn-glass p-2.5 rounded-xl" title="Reload from server">
            <RotateCcw size={16} />
          </button>
          <button onClick={addNew}
            className="btn-glass px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border-[#D4AF37]/30 text-[#D4AF37]">
            <Plus size={16} /> Add Experience
          </button>
          <button onClick={save} disabled={saving}
            className="btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save All"}
          </button>
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
              <motion.div key={`${exp.type}-${i}`}
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
                      <p className="text-white font-semibold text-sm">{exp.label || <span className="text-[#4B5563]">New Experience</span>}</p>
                      <p className="text-[#4B5563] text-xs font-mono">{exp.type}</p>
                    </div>
                    {exp.isCustom && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-medium">
                        Custom
                      </span>
                    )}
                  </div>
                  {/* Only allow deleting custom ones */}
                  {exp.isCustom && (
                    <button onClick={() => remove(i)}
                      className="w-8 h-8 rounded-xl border border-red-400/20 bg-red-400/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors shrink-0"
                      title="Remove this experience">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Fields grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Icon — optional */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Icon <span className="text-[#4B5563] normal-case">(emoji, optional)</span>
                    </label>
                    <input value={exp.icon || ""} onChange={e => update(i, "icon", e.target.value)}
                      className="input-luxury w-full px-3 py-2 text-2xl rounded-xl text-center"
                      maxLength={4} placeholder="✨" />
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Display Name *
                    </label>
                    <input value={exp.label} onChange={e => update(i, "label", e.target.value)}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl"
                      placeholder="e.g. Private Yacht Party" />
                  </div>

                  {/* Default Price */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Default Price ($)
                    </label>
                    <input type="number" value={exp.defaultPrice}
                      onChange={e => update(i, "defaultPrice", Number(e.target.value))}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl" min={0} />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Duration (min)
                    </label>
                    <input type="number" value={exp.defaultDuration}
                      onChange={e => update(i, "defaultDuration", Number(e.target.value))}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl" min={1} />
                  </div>

                  {/* Type key — editable for custom, read-only for built-in */}
                  <div className={exp.isCustom ? "" : "hidden"}>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Type Code <span className="text-[#4B5563] normal-case">(auto-generated)</span>
                    </label>
                    <input value={exp.type} onChange={e => update(i, "type", e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
                      className="input-luxury w-full px-3 py-2 text-xs rounded-xl font-mono text-[#D4AF37]"
                      placeholder="CUSTOM_EXPERIENCE" />
                  </div>

                  {/* Description */}
                  <div className={`${exp.isCustom ? "col-span-2 md:col-span-3" : "col-span-2 md:col-span-4"}`}>
                    <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Description
                    </label>
                    <input value={exp.description || ""} onChange={e => update(i, "description", e.target.value)}
                      className="input-luxury w-full px-3 py-2 text-sm rounded-xl"
                      placeholder="Short description shown to users..." />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Add button at bottom */}
      {!loading && (
        <motion.button onClick={addNew} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full mt-4 py-4 rounded-2xl border border-dashed border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#D4AF37]/5 transition-colors">
          <Plus size={16} /> Add New Experience Type
        </motion.button>
      )}

      {/* Info note */}
      <div className="mt-6 p-4 glass rounded-xl">
        <p className="text-[#6B7280] text-xs leading-relaxed">
          💡 <strong className="text-[#9CA3AF]">Built-in types</strong> (Meet & Greet, Video Call, etc.) sync with the booking form automatically.{" "}
          <strong className="text-[#9CA3AF]">Custom types</strong> you create here will also appear in the experience selector.
          The icon emoji is optional — a "?" placeholder will show if left empty.
          Click <strong className="text-[#9CA3AF]">Save All</strong> to apply any changes.
        </p>
      </div>
    </div>
  );
}
