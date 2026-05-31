"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const CATEGORIES = [
  "MUSIC", "ACTOR", "INFLUENCER", "ATHLETE", "COMEDIAN",
  "DJ", "PRESENTER", "POLITICIAN", "ENTREPRENEUR",
];

const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function NewCelebrityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", category: "MUSIC", bio: "", location: "", nationality: "",
    yearsActive: "", basePrice: "", verified: false, featured: false, active: true,
    image: "", tags: "",
  });

  const set = (field: string, value: any) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === "name" && !prev.slug) updated.slug = toSlug(value);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    if (!form.basePrice) { toast.error("Base price is required"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/celebrities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          basePrice: Number(form.basePrice),
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create celebrity");
      toast.success("Celebrity created successfully!");
      router.push("/admin/celebrities");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/celebrities" className="btn-glass w-10 h-10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Star size={22} className="text-[#D4AF37]" /> Add New Celebrity
          </h1>
          <p className="text-[#6B7280] text-sm mt-0.5">Create a new celebrity profile</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Basic Info */}
        <div className="card-luxury p-6">
          <h2 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="Celebrity name" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Slug *</label>
              <input value={form.slug}
                onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm font-mono" placeholder="url-slug" />
              <p className="text-[#4B5563] text-xs mt-1">Auto-filled from name. Used in URLs.</p>
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" style={{ background: "#111118" }}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#111118" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Base Price ($) *</label>
              <input type="number" value={form.basePrice} onChange={e => set("basePrice", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="5000" min={0} />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Location</label>
              <input value={form.location} onChange={e => set("location", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="Los Angeles, CA" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Nationality</label>
              <input value={form.nationality} onChange={e => set("nationality", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="American" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Years Active</label>
              <input value={form.yearsActive} onChange={e => set("yearsActive", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="2010–present" />
            </div>
            <div>
              <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Image URL</label>
              <input value={form.image} onChange={e => set("image", e.target.value)}
                className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="https://..." />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Bio *</label>
            <textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={5}
              className="input-luxury w-full px-4 py-3 rounded-xl text-sm resize-none"
              placeholder="Celebrity biography..." />
          </div>

          <div className="mt-4">
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)}
              className="input-luxury w-full px-4 py-3 rounded-xl text-sm" placeholder="grammy, pop, music" />
          </div>
        </div>

        {/* Status Toggles */}
        <div className="card-luxury p-6">
          <h2 className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-5">Status & Visibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "verified", label: "Verified", desc: "Show verified badge" },
              { key: "featured", label: "Featured", desc: "Show on homepage" },
              { key: "active",   label: "Active",   desc: "Visible to users" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between glass rounded-xl p-4">
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-[#6B7280] text-xs">{desc}</p>
                </div>
                <button
                  onClick={() => set(key, !(form as any)[key])}
                  className={`w-12 h-6 rounded-full transition-colors relative ${(form as any)[key] ? "bg-[#D4AF37]" : "bg-[#1a1a2e]"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${(form as any)[key] ? "left-7" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href="/admin/celebrities" className="btn-glass px-6 py-3 rounded-xl font-medium flex-1 text-center">
            Cancel
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="btn-gold px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 flex-1">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Creating..." : "Create Celebrity"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
