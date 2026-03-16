import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";

interface SearchDropdownProps {
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
}

export const SearchDropdown = ({ isSearchActive, setIsSearchActive }: SearchDropdownProps) => {
  return (
    <AnimatePresence>
      {isSearchActive && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsSearchActive(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140]" 
          />
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="absolute top-[110px] inset-x-0 px-6 py-6 z-[145] bg-black/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-2xl"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--mp-text-secondary)]" />
              <input 
                type="text" 
                placeholder="Search assets, profiles..." 
                className="w-full bg-white/5 border border-white/[0.05] rounded-2xl pl-12 pr-4 py-4 text-base text-foreground focus:outline-none focus:border-[var(--mp-cyan)]/50 transition-colors shadow-inner" 
                autoFocus 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
