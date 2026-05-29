"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

const FIELD_LABELS: Record<string, string> = {
  label: "Display Name", icon: "Icon (Emoji)", defaultPrice: "Default Price ($)",
  defaultDuration: "Duration (min)", description: "Short Description",
};

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchExperiences = () => {
    fetch("/api/admin/experiences")
      .then(r => r.json())
      .then(d => { setExperiences(d.experiences || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchExperiences(); }, []);

  const update = (index: number, field: string, value: any) => {
    setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, [field]: value } : exp));
  };

  const save = async () => {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            Experience <span className="text-gradient-gold">Types</span>
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">
            Customize display names, icons, and default pricing for each experience type
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchExperiences} className="btn-glass p-2.5 rounded-xl" title="Reset">
            <RotateCcw size={16} />
          </button>
          <button onClick={save} disabled={saving}
            className="btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <motion.div key={exp.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-luxury p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-xl">{exp.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{exp.label}</p>
                  <p className="text-[#4B5563] text-xs font-mono">{exp.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Icon (Emoji)</label>
                  <input value={exp.icon} onChange={e => update(i, "icon", e.target.value)}
                    className="input-luxury w-full px-3 py-2 text-2xl rounded-xl text-center" maxLength={4} />
                </div>
                <div>
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Display Name</label>
                  <input value={exp.label} onChange={e => update(i, "label", e.target.value)}
                    className="input-luxury w-full px-3 py-2 text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Default Price ($)</label>
                  <input type="number" value={exp.defaultPrice} onChange={e => update(i, "defaultPrice", Number(e.target.value))}
                    className="input-luxury w-full px-3 py-2 text-sm rounded-xl" min={0} />
                </div>
                <div>
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Duration (min)</label>
                  <input type="number" value={exp.defaultDuration} onChange={e => update(i, "defaultDuration", Number(e.target.value))}
                    className="input-luxury w-full px-3 py-2 text-sm rounded-xl" min={1} />
                </div>
                <div className="col-span-2 md:col-span-4">
                  <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Description</label>
                  <input value={exp.description} onChange={e => update(i, "description", e.target.value)}
                    className="input-luxury w-full px-3 py-2 text-sm rounded-xl" placeholder="Short description shown to users..." />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 glass rounded-xl">
        <p className="text-[#6B7280] text-xs">
          💡 Changes here update the labels and defaults shown in the booking form. 
          The internal type codes (e.g. MEET_AND_GREET) remain unchanged in the database.
        </p>
      </div>
    </div>
  );
}
