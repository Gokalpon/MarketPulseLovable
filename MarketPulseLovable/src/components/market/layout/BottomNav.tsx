import React from "react";
import { motion } from "motion/react";
import { Activity, List, Globe, Users, Settings } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setProfilePage: (page: string | null) => void;
}

export const BottomNav = ({ activeTab, setActiveTab, setProfilePage }: BottomNavProps) => {
  return (
    <nav className="absolute bottom-0 inset-x-0 z-[140] bg-[#0D0E14]/80 backdrop-blur-2xl border-t border-white/[0.03] px-6 py-6">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {[
          { id: "dashboard", icon: Activity },
          { id: "watchlist", icon: List },
          { id: "markets", icon: Globe },
          { id: "community", icon: Users },
          { id: "profile", icon: Settings },
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id); setProfilePage(null); }} 
            className="flex flex-col items-center relative py-1"
          >
            <div className={`transition-all duration-300 ${activeTab === tab.id ? "text-white" : "text-[#525263] hover:text-white/40"}`}>
              <tab.icon className="w-6 h-6" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeNavDot"
                className="absolute -bottom-2 w-1 h-1 bg-[var(--mp-cyan)] rounded-full shadow-[0_0_8px_var(--mp-cyan)]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
