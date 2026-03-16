import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Brain, Globe, Heart, TrendingUp, TrendingDown, Trash2, Send } from "lucide-react";
import { MarketPoint, Comment } from "@/types/market";

interface DetailedPointSheetProps {
  detailedPoint: MarketPoint | null;
  setDetailedPoint: (point: MarketPoint | null) => void;
  setSelectedPoint: (point: MarketPoint | null) => void;
  t: Record<string, string>;
  sentimentFilter: string;
  setSentimentFilter: (filter: string) => void;
  activeUserComments: Comment[];
  deleteComment: (id: string) => void;
}

export const DetailedPointSheet = ({
  detailedPoint,
  setDetailedPoint,
  setSelectedPoint,
  t,
  sentimentFilter,
  setSentimentFilter,
  activeUserComments,
  deleteComment
}: DetailedPointSheetProps) => {
  if (!detailedPoint) return null;

  const allComments = detailedPoint.comments || [];
  const total = allComments.length;
  const pos = allComments.filter((c) => c.sentiment === "Positive").length;
  const neg = allComments.filter((c) => c.sentiment === "Negative").length;
  const neu = allComments.filter((c) => c.sentiment === "Neutral").length;
  const posPct = total > 0 ? Math.round((pos / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neu / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((neg / total) * 100) : 0;

  return (
    <AnimatePresence>
      {detailedPoint && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setDetailedPoint(null); setSelectedPoint(null); }} className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[130]" />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute bottom-0 inset-x-0 z-[135] bg-[#0D0E14]/95 backdrop-blur-3xl border-t border-white/[0.08] rounded-t-[36px] p-6 pb-10 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] max-h-[70vh] overflow-y-auto scrollbar-hide">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-[13px] font-black text-foreground uppercase tracking-wider">{detailedPoint.type === "news" ? t.newsAlert : "Community Pulse"}</div>
                <div className="text-[11px] text-[var(--mp-text-secondary)]">{detailedPoint.translation}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {detailedPoint.type === "news" && (
                  <a href={detailedPoint.newsUrl || "https://www.reuters.com/markets/"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--mp-cyan)]/10 border border-[var(--mp-cyan)]/20 text-[var(--mp-cyan)] text-[9px] font-black uppercase tracking-wider hover:bg-[var(--mp-cyan)]/20 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Source
                  </a>
                )}
                <button onClick={() => { setDetailedPoint(null); setSelectedPoint(null); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-4 h-4 text-white/70" /></button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-[var(--mp-cyan)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--mp-cyan)]">AI Sentiment Summary</span>
              </div>
              
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 mb-6">
                <p className="text-[14px] font-bold text-foreground text-center leading-relaxed opacity-90">
                  "{detailedPoint.translation || "Resistance level being tested."}"
                </p>
              </div>

              {total >= 5 && (
                <div className="px-5 py-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl mb-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--mp-green)" strokeWidth="3" strokeDasharray={`${posPct * 0.88} 88`} strokeDashoffset="0" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${neuPct * 0.88} 88`} strokeDashoffset={`${-posPct * 0.88}`} strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--mp-red)" strokeWidth="3" strokeDasharray={`${negPct * 0.88} 88`} strokeDashoffset={`${-(posPct + neuPct) * 0.88}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <div className="text-[12px] font-black text-foreground leading-none">{total}</div>
                          <div className="text-[5px] font-bold text-white/30 uppercase tracking-widest">votes</div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[
                        { label: "Positive", pct: posPct, color: "var(--mp-green)" },
                        { label: "Neutral", pct: neuPct, color: "white" },
                        { label: "Negative", pct: negPct, color: "var(--mp-red)" },
                      ].map(s => (
                        <div key={s.label} className="flex items-center justify-between text-[10px]">
                          <span className="text-white/40 font-bold uppercase tracking-wider">{s.label}</span>
                          <span className="font-black" style={{ color: s.color }}>{s.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-[12px] font-black text-foreground">{total} Comments</div>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                {["All", "Positive", "Neutral", "Negative"].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSentimentFilter(s)} 
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                      sentimentFilter === s ? "bg-white text-black border-white" : "bg-white/[0.03] text-white/40 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {activeUserComments.filter(uc => Math.abs(uc.chartIndex - detailedPoint.idx) <= 2).map((uc) => (
                <div key={`own-${uc.id}`} className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--mp-purple)]/10 border border-[var(--mp-purple)]/20">
                  <div className="w-5 h-5 rounded-full mp-gradient-badge-purple flex items-center justify-center text-[8px] font-black text-background flex-shrink-0 mt-0.5">Y</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-foreground">@You</span>
                      <span className={`text-[7px] font-black uppercase px-1 py-0.5 rounded ${uc.sentiment === "Positive" ? "bg-[var(--mp-green)]/20 text-[var(--mp-green)]" : uc.sentiment === "Negative" ? "bg-[var(--mp-red)]/20 text-[var(--mp-red)]" : "bg-[var(--mp-cyan)]/20 text-[var(--mp-cyan)]"}`}>{uc.sentiment}</span>
                    </div>
                    <p className="text-[11px] text-white/70 leading-snug">{uc.text}</p>
                  </div>
                  <button onClick={() => deleteComment(uc.id)} className="p-1 hover:bg-white/10 rounded flex-shrink-0"><Trash2 className="w-3 h-3 text-white/20" /></button>
                </div>
              ))}

              <div className="space-y-3 mb-24">
                {(detailedPoint.comments || [])
                  .filter((c) => sentimentFilter === "All" || c.sentiment === sentimentFilter)
                  .slice(0, 30)
                  .map((comment, i) => {
                    return (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-[20px] p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/60">
                              {comment.user[1].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-bold text-foreground/90">{comment.user}</span>
                                <span className="text-[9px] text-white/20 font-bold flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" /> {comment.likes || 0}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-[5px] ${
                            comment.sentiment === "Positive" ? "bg-[var(--mp-green)] text-black" : 
                            comment.sentiment === "Negative" ? "bg-[var(--mp-red)] text-white" : 
                            "bg-white text-black"
                          }`}>
                            {comment.sentiment}
                          </span>
                        </div>
                        
                        <p className="text-[13px] text-white/90 leading-relaxed mb-3 pr-2 font-medium">
                          {comment.text}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-white/20 hover:text-white/40 transition-colors">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-[9px] font-bold">{comment.likes || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 text-white/20 hover:text-white/40 transition-colors">
                              <TrendingDown className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-30">
                            <Globe className="w-2.5 h-2.5" />
                            <span className="text-[7px] font-black uppercase tracking-wider">Translated</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0D0E14] via-[#0D0E14] to-transparent">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Write your comment..." 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-foreground focus:outline-none focus:border-[var(--mp-cyan)]/50 transition-all shadow-2xl"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[var(--mp-cyan)]/10 flex items-center justify-center text-[var(--mp-cyan)] hover:bg-[var(--mp-cyan)]/20 transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
