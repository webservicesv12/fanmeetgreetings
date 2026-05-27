"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Bitcoin, Copy, CheckCircle, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const COIN_ICONS: Record<string, string> = {
  BITCOIN: "₿",
  ETHEREUM: "Ξ",
  USDT_TRC20: "₮",
  LITECOIN: "Ł",
  BUSD: "$",
};

const COIN_COLORS: Record<string, string> = {
  BITCOIN: "#F7931A",
  ETHEREUM: "#627EEA",
  USDT_TRC20: "#26A17B",
  LITECOIN: "#345D9D",
  BUSD: "#F0B90B",
};

export default function AdminPaymentsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [walletForm, setWalletForm] = useState({ coin: "BITCOIN", label: "", address: "", network: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/wallets").then((r) => r.json()),
      fetch("/api/admin/banks").then((r) => r.json()),
    ]).then(([walletData, bankData]) => {
      setWallets(walletData.wallets || []);
      setBanks(bankData.banks || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const handleAddWallet = async () => {
    try {
      const res = await fetch("/api/admin/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walletForm),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWallets((prev) => [data.wallet, ...prev]);
      setShowWalletForm(false);
      setWalletForm({ coin: "BITCOIN", label: "", address: "", network: "" });
      toast.success("Wallet added!");
    } catch { toast.error("Failed to add wallet"); }
  };

  const handleToggleWallet = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/wallets/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
      setWallets((prev) => prev.map((w) => w.id === id ? { ...w, isActive: !isActive } : w));
      toast.success("Updated!");
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Payment <span className="text-gradient-gold">Management</span></h1>
        <p className="text-[#6B7280] mt-1">Manage crypto wallets and bank account details</p>
      </div>

      {/* Crypto Wallets */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2"><Bitcoin size={18} className="text-[#D4AF37]" /> Crypto Wallets</h2>
          <button onClick={() => setShowWalletForm(!showWalletForm)} className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Plus size={14} /> Add Wallet
          </button>
        </div>

        {showWalletForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-luxury p-5 mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Coin</label>
                <select value={walletForm.coin} onChange={(e) => setWalletForm({ ...walletForm, coin: e.target.value })}
                  className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl appearance-none" style={{ background: "#111118" }}>
                  {Object.keys(COIN_ICONS).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Label</label>
                <input type="text" value={walletForm.label} onChange={(e) => setWalletForm({ ...walletForm, label: e.target.value })} placeholder="e.g. Bitcoin Main" className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Wallet Address</label>
                <input type="text" value={walletForm.address} onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })} placeholder="Enter wallet address" className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl font-mono" />
              </div>
              <div>
                <label className="text-[#9CA3AF] text-xs uppercase tracking-wider font-medium mb-2 block">Network</label>
                <input type="text" value={walletForm.network} onChange={(e) => setWalletForm({ ...walletForm, network: e.target.value })} placeholder="e.g. ERC-20" className="input-luxury w-full px-3 py-2.5 text-sm rounded-xl" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddWallet} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold">Save Wallet</button>
              <button onClick={() => setShowWalletForm(false)} className="btn-glass px-5 py-2.5 rounded-xl text-sm">Cancel</button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            [1,2,3,4].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
          ) : wallets.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-[#4B5563]">No wallets configured yet. Add one above.</div>
          ) : (
            wallets.map((wallet, i) => (
              <motion.div key={wallet.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className={`card-luxury p-5 ${!wallet.isActive ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ background: `${COIN_COLORS[wallet.coin]}20`, color: COIN_COLORS[wallet.coin] }}>
                      {COIN_ICONS[wallet.coin]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{wallet.label}</p>
                      <p className="text-[#6B7280] text-xs">{wallet.coin}{wallet.network ? ` • ${wallet.network}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleWallet(wallet.id, wallet.isActive)}
                      className={`text-[10px] px-2 py-1 rounded-full border font-medium ${ wallet.isActive ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-red-400 border-red-400/20 bg-red-400/10" }`}>
                      {wallet.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
                <div className="bg-[#080808] rounded-lg p-2.5 flex items-center gap-2">
                  <code className="text-[#D4AF37] text-xs font-mono flex-1 truncate">{wallet.address}</code>
                  <button onClick={() => copyToClipboard(wallet.address)} className="shrink-0 text-[#4B5563] hover:text-[#D4AF37] transition-colors">
                    <Copy size={12} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Bank Accounts */}
      <div>
        <h2 className="font-semibold text-white flex items-center gap-2 mb-5"><Building2 size={18} className="text-[#D4AF37]" /> Bank Accounts</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="skeleton h-40 rounded-2xl" />
          ) : banks.length === 0 ? (
            <div className="text-center py-10 text-[#4B5563] card-luxury">No bank accounts configured.</div>
          ) : (
            banks.map((bank: any) => (
              <div key={bank.id} className="card-luxury p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{bank.bankName}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${ bank.isActive ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-red-400 border-red-400/20 bg-red-400/10" }`}>
                    {bank.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["Account Name", bank.accountName], ["Account Number", bank.accountNumber], ["Routing Number", bank.routingNumber || "—"], ["SWIFT/BIC", bank.swiftCode || "—"]].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[#6B7280] text-xs mb-0.5">{label}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-white text-sm font-medium">{value}</p>
                        {value !== "—" && <button onClick={() => copyToClipboard(value as string)} className="text-[#4B5563] hover:text-[#D4AF37]"><Copy size={11} /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
