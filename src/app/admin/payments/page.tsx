"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Bitcoin, Copy, Building2, Edit2, X, Save,
  Loader2, ToggleLeft, ToggleRight, CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const COINS = ["BITCOIN", "ETHEREUM", "USDT_TRC20", "LITECOIN", "BUSD", "BANK_TRANSFER"] as const;

const COIN_ICONS: Record<string, string> = {
  BITCOIN: "₿", ETHEREUM: "Ξ", USDT_TRC20: "₮", LITECOIN: "Ł", BUSD: "$",
};
const COIN_COLORS: Record<string, string> = {
  BITCOIN: "#F7931A", ETHEREUM: "#627EEA", USDT_TRC20: "#26A17B",
  LITECOIN: "#345D9D", BUSD: "#F0B90B",
};

const EMPTY_WALLET = { coin: "BITCOIN", label: "", address: "", network: "" };
const EMPTY_BANK = {
  bankName: "", accountName: "", accountNumber: "",
  routingNumber: "", swiftCode: "", iban: "", currency: "USD", country: "",
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function Modal({ title, onClose, onSave, saving, children }: {
  title: string; onClose: () => void; onSave: () => void; saving: boolean; children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="card-luxury p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={onSave} disabled={saving}
            className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">{label}</label>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPaymentsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Wallet modal state
  const [walletModal, setWalletModal] = useState<{ mode: "add" | "edit"; data: any } | null>(null);

  // Bank modal state
  const [bankModal, setBankModal] = useState<{ mode: "add" | "edit"; data: any } | null>(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/wallets").then(r => r.json()),
      fetch("/api/admin/banks").then(r => r.json()),
    ]).then(([w, b]) => {
      setWallets(w.wallets || []);
      setBanks(b.banks || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  // ── Wallet Actions ─────────────────────────────────────────────────────────

  const saveWallet = async () => {
    if (!walletModal) return;
    setSaving(true);
    try {
      const { mode, data } = walletModal;
      const url = mode === "add" ? "/api/admin/wallets" : `/api/admin/wallets/${data.id}`;
      const method = mode === "add" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "add" ? data : {
          label: data.label, address: data.address, network: data.network, coin: data.coin,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(mode === "add" ? "Wallet added!" : "Wallet updated!");
      setWalletModal(null);
      fetchAll();
    } catch { toast.error("Failed to save wallet"); }
    finally { setSaving(false); }
  };

  const toggleWallet = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/wallets/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setWallets(prev => prev.map(w => w.id === id ? { ...w, isActive: !isActive } : w));
      toast.success(`Wallet ${!isActive ? "activated" : "deactivated"}!`);
    } catch { toast.error("Update failed"); }
  };

  const deleteWallet = async (id: string) => {
    if (!confirm("Delete this wallet? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/wallets/${id}`, { method: "DELETE" });
      setWallets(prev => prev.filter(w => w.id !== id));
      toast.success("Wallet deleted!");
    } catch { toast.error("Delete failed"); }
  };

  // ── Bank Actions ───────────────────────────────────────────────────────────

  const saveBank = async () => {
    if (!bankModal) return;
    setSaving(true);
    try {
      const { mode, data } = bankModal;
      const url = mode === "add" ? "/api/admin/banks" : `/api/admin/banks/${data.id}`;
      const method = mode === "add" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(mode === "add" ? "Bank account added!" : "Bank account updated!");
      setBankModal(null);
      fetchAll();
    } catch { toast.error("Failed to save bank account"); }
    finally { setSaving(false); }
  };

  const toggleBank = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/banks/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setBanks(prev => prev.map(b => b.id === id ? { ...b, isActive: !isActive } : b));
      toast.success(`Bank account ${!isActive ? "activated" : "deactivated"}!`);
    } catch { toast.error("Update failed"); }
  };

  const deleteBank = async (id: string) => {
    if (!confirm("Delete this bank account? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/banks/${id}`, { method: "DELETE" });
      setBanks(prev => prev.filter(b => b.id !== id));
      toast.success("Bank account deleted!");
    } catch { toast.error("Delete failed"); }
  };

  const setWallet = (field: string, value: any) =>
    setWalletModal(prev => prev ? { ...prev, data: { ...prev.data, [field]: value } } : prev);

  const setBank = (field: string, value: any) =>
    setBankModal(prev => prev ? { ...prev, data: { ...prev.data, [field]: value } } : prev);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Payment <span className="text-gradient-gold">Management</span>
        </h1>
        <p className="text-[#6B7280] mt-1 text-sm">Manage crypto wallets and bank account details</p>
      </div>

      {/* ── Crypto Wallets ──────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Bitcoin size={18} className="text-[#D4AF37]" /> Crypto Wallets
            <span className="text-[#4B5563] text-xs font-normal">({wallets.length})</span>
          </h2>
          <button onClick={() => setWalletModal({ mode: "add", data: { ...EMPTY_WALLET } })}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Plus size={14} /> Add Wallet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />) :
            wallets.length === 0 ? (
              <div className="col-span-2 card-luxury p-10 text-center text-[#4B5563]">
                No wallets configured yet. Click "Add Wallet" to get started.
              </div>
            ) : wallets.map((wallet, i) => (
              <motion.div key={wallet.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`card-luxury p-5 ${!wallet.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ background: `${COIN_COLORS[wallet.coin]}20`, color: COIN_COLORS[wallet.coin] }}>
                      {COIN_ICONS[wallet.coin] || "?"}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{wallet.label}</p>
                      <p className="text-[#6B7280] text-xs">
                        {wallet.coin}{wallet.network ? ` • ${wallet.network}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Edit */}
                    <button onClick={() => setWalletModal({ mode: "edit", data: { ...wallet } })}
                      className="w-7 h-7 rounded-lg border border-blue-400/20 bg-blue-400/10 flex items-center justify-center text-blue-400 hover:bg-blue-400/20 transition-colors"
                      title="Edit wallet">
                      <Edit2 size={13} />
                    </button>
                    {/* Toggle */}
                    <button onClick={() => toggleWallet(wallet.id, wallet.isActive)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                        wallet.isActive
                          ? "text-green-400 border-green-400/20 bg-green-400/10 hover:bg-green-400/20"
                          : "text-red-400 border-red-400/20 bg-red-400/10 hover:bg-red-400/20"
                      }`} title={wallet.isActive ? "Deactivate" : "Activate"}>
                      {wallet.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    </button>
                    {/* Delete */}
                    <button onClick={() => deleteWallet(wallet.id)}
                      className="w-7 h-7 rounded-lg border border-red-400/20 bg-red-400/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors"
                      title="Delete wallet">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#080808] rounded-lg p-2.5 flex items-center gap-2">
                  <code className="text-[#D4AF37] text-xs font-mono flex-1 truncate">{wallet.address}</code>
                  <button onClick={() => copy(wallet.address)} className="shrink-0 text-[#4B5563] hover:text-[#D4AF37] transition-colors">
                    <Copy size={12} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    wallet.isActive ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-red-400 border-red-400/20 bg-red-400/10"
                  }`}>{wallet.isActive ? "● Active" : "● Inactive"}</span>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      {/* ── Bank Accounts ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Building2 size={18} className="text-[#D4AF37]" /> Bank Accounts
            <span className="text-[#4B5563] text-xs font-normal">({banks.length})</span>
          </h2>
          <button onClick={() => setBankModal({ mode: "add", data: { ...EMPTY_BANK } })}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Plus size={14} /> Add Bank Account
          </button>
        </div>

        <div className="space-y-4">
          {loading ? <div className="skeleton h-40 rounded-2xl" /> :
            banks.length === 0 ? (
              <div className="card-luxury p-10 text-center text-[#4B5563]">
                No bank accounts configured. Click "Add Bank Account" to get started.
              </div>
            ) : banks.map((bank: any, i: number) => (
              <motion.div key={bank.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card-luxury p-5 ${!bank.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                      <Building2 size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{bank.bankName}</h3>
                      <p className="text-[#6B7280] text-xs">{bank.currency}{bank.country ? ` • ${bank.country}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Edit */}
                    <button onClick={() => setBankModal({ mode: "edit", data: { ...bank } })}
                      className="w-7 h-7 rounded-lg border border-blue-400/20 bg-blue-400/10 flex items-center justify-center text-blue-400 hover:bg-blue-400/20 transition-colors"
                      title="Edit bank account">
                      <Edit2 size={13} />
                    </button>
                    {/* Toggle */}
                    <button onClick={() => toggleBank(bank.id, bank.isActive)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                        bank.isActive
                          ? "text-green-400 border-green-400/20 bg-green-400/10 hover:bg-green-400/20"
                          : "text-red-400 border-red-400/20 bg-red-400/10 hover:bg-red-400/20"
                      }`} title={bank.isActive ? "Deactivate" : "Activate"}>
                      {bank.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    </button>
                    {/* Delete */}
                    <button onClick={() => deleteBank(bank.id)}
                      className="w-7 h-7 rounded-lg border border-red-400/20 bg-red-400/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-colors"
                      title="Delete bank account">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    ["Account Name", bank.accountName],
                    ["Account Number", bank.accountNumber],
                    ["Routing Number", bank.routingNumber || "—"],
                    ["SWIFT/BIC", bank.swiftCode || "—"],
                    ["IBAN", bank.iban || "—"],
                    ["Currency", bank.currency],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[#6B7280] text-xs mb-0.5">{label}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-white text-sm font-medium">{value}</p>
                        {value !== "—" && (
                          <button onClick={() => copy(value as string)} className="text-[#4B5563] hover:text-[#D4AF37]">
                            <Copy size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    bank.isActive ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-red-400 border-red-400/20 bg-red-400/10"
                  }`}>{bank.isActive ? "● Active" : "● Inactive"}</span>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      {/* ── Wallet Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {walletModal && (
          <Modal
            title={walletModal.mode === "add" ? "Add Crypto Wallet" : "Edit Crypto Wallet"}
            onClose={() => setWalletModal(null)}
            onSave={saveWallet}
            saving={saving}
          >
            <Field label="Coin / Currency">
              <select value={walletModal.data.coin} onChange={e => setWallet("coin", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl appearance-none" style={{ background: "#111118" }}>
                {["BITCOIN","ETHEREUM","USDT_TRC20","LITECOIN","BUSD"].map(c => (
                  <option key={c} value={c} style={{ background: "#111118" }}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Label (display name)">
              <input value={walletModal.data.label} onChange={e => setWallet("label", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl"
                placeholder="e.g. Bitcoin Main Wallet" />
            </Field>
            <Field label="Wallet Address">
              <input value={walletModal.data.address} onChange={e => setWallet("address", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl font-mono"
                placeholder="bc1q..." />
            </Field>
            <Field label="Network (optional)">
              <input value={walletModal.data.network || ""} onChange={e => setWallet("network", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl"
                placeholder="e.g. ERC-20, TRC-20, Mainnet" />
            </Field>
            {walletModal.mode === "edit" && (
              <Field label="Status">
                <div className="flex items-center gap-3 mt-1">
                  <button onClick={() => setWallet("isActive", !walletModal.data.isActive)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${walletModal.data.isActive ? "bg-[#D4AF37]" : "bg-[#1a1a2e]"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${walletModal.data.isActive ? "left-7" : "left-1"}`} />
                  </button>
                  <span className="text-sm text-[#C9C9D4]">{walletModal.data.isActive ? "Active" : "Inactive"}</span>
                </div>
              </Field>
            )}
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Bank Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {bankModal && (
          <Modal
            title={bankModal.mode === "add" ? "Add Bank Account" : "Edit Bank Account"}
            onClose={() => setBankModal(null)}
            onSave={saveBank}
            saving={saving}
          >
            <Field label="Bank Name *">
              <input value={bankModal.data.bankName} onChange={e => setBank("bankName", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="Chase Bank" />
            </Field>
            <Field label="Account Name *">
              <input value={bankModal.data.accountName} onChange={e => setBank("accountName", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="MeetGreetings LLC" />
            </Field>
            <Field label="Account Number *">
              <input value={bankModal.data.accountNumber} onChange={e => setBank("accountNumber", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl font-mono" placeholder="1234567890" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Routing Number">
                <input value={bankModal.data.routingNumber || ""} onChange={e => setBank("routingNumber", e.target.value)}
                  className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="021000021" />
              </Field>
              <Field label="SWIFT / BIC">
                <input value={bankModal.data.swiftCode || ""} onChange={e => setBank("swiftCode", e.target.value)}
                  className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="CHASUS33" />
              </Field>
            </div>
            <Field label="IBAN (optional)">
              <input value={bankModal.data.iban || ""} onChange={e => setBank("iban", e.target.value)}
                className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl font-mono" placeholder="GB29 NWBK 6016 1331 9268 19" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Currency">
                <select value={bankModal.data.currency} onChange={e => setBank("currency", e.target.value)}
                  className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" style={{ background: "#111118" }}>
                  {["USD","EUR","GBP","NGN","GHS","KES","ZAR","CAD","AUD"].map(c => (
                    <option key={c} value={c} style={{ background: "#111118" }}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Country (optional)">
                <input value={bankModal.data.country || ""} onChange={e => setBank("country", e.target.value)}
                  className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" placeholder="United States" />
              </Field>
            </div>
            {bankModal.mode === "edit" && (
              <Field label="Status">
                <div className="flex items-center gap-3 mt-1">
                  <button onClick={() => setBank("isActive", !bankModal.data.isActive)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${bankModal.data.isActive ? "bg-[#D4AF37]" : "bg-[#1a1a2e]"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${bankModal.data.isActive ? "left-7" : "left-1"}`} />
                  </button>
                  <span className="text-sm text-[#C9C9D4]">{bankModal.data.isActive ? "Active" : "Inactive"}</span>
                </div>
              </Field>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
