import React from "react";
import { motion } from "motion/react";
import { List, Activity } from "lucide-react";
import { ASSETS } from "@/data/assets";
import { Sparkline } from "@/components/market/Sparkline";

interface WatchlistTabProps {
  t: Record<string, string>;
  watchlistLayout: "list" | "grid";
  setWatchlistLayout: (layout: "list" | "grid") => void;
  watchlistAssets: string[];
  setSelectedAssetId: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const WatchlistTab = ({
  t,
  watchlistLayout,
  setWatchlistLayout,
  watchlistAssets,
  setSelectedAssetId,
  setActiveTab
}: WatchlistTabProps) => {
  return (
    <motion.div key="watchlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-6 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8 mt-2">
        <h2 className="text-2xl font-black tracking-tight uppercase">{t.watchlist}</h2>
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/[0.05]">
          <button onClick={() => setWatchlistLayout("list")} className={`p-2 rounded-lg transition-colors ${watchlistLayout === "list" ? "bg-white/10 text-foreground" : "text-[var(--mp-text-secondary)]"}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setWatchlistLayout("grid")} className={`p-2 rounded-lg transition-colors ${watchlistLayout === "grid" ? "bg-white/10 text-foreground" : "text-[var(--mp-text-secondary)]"}`}><Activity className="w-4 h-4" /></button>
        </div>
      </div>
      {watchlistLayout === "list" ? (
        <div className="flex flex-col gap-3">
          {ASSETS.filter((a) => watchlistAssets.includes(a.id)).map((asset) => (
            <div key={asset.id} onClick={() => { setSelectedAssetId(asset.id); setActiveTab("dashboard"); }} className="mp-glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-black/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-sm border border-white/[0.05]">{asset.id[0]}</div>
                <div><div className="font-bold text-[15px]">{asset.name}</div><div className="text-[11px] text-[var(--mp-text-secondary)] font-medium uppercase tracking-wider">{asset.symbol}</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Sparkline data={asset.data["1D"].slice(-20)} color={asset.isUp ? "#39FF14" : "#E50000"} />
                <div className="text-right min-w-[70px]">
                  <div className="font-bold text-[15px]">${asset.price.toLocaleString()}</div>
                  <div className={`text-[9px] font-bold px-1 py-0.5 rounded inline-block ${asset.change.startsWith("+") ? "mp-positive-badge" : asset.change.startsWith("-") ? "mp-negative-badge" : "bg-white/10 text-foreground"}`}>{asset.change}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {ASSETS.filter((a) => watchlistAssets.includes(a.id)).map((asset) => (
            <div key={asset.id} onClick={() => { setSelectedAssetId(asset.id); setActiveTab("dashboard"); }} className="mp-glass-card rounded-[24px] p-5 flex flex-col hover:bg-black/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-sm border border-white/[0.05]">{asset.id[0]}</div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${asset.isUp ? "mp-positive-badge" : "mp-negative-badge"}`}>{asset.change}</div>
              </div>
              <div className="mb-4"><div className="font-bold text-[16px] leading-tight">{asset.name}</div><div className="text-[10px] text-[var(--mp-text-secondary)] uppercase tracking-widest">{asset.symbol}</div></div>
              <div className="mt-auto">
                <div className="font-black text-[18px] mb-2">${asset.price.toLocaleString()}</div>
                <div className="flex items-center justify-between"><Sparkline data={asset.data["1D"].slice(-20)} color={asset.isUp ? "#39FF14" : "#E50000"} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
