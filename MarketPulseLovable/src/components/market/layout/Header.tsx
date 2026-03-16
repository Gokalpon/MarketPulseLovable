import React from "react";
import { Search } from "lucide-react";
import { APP_ASSETS } from "@/data/assets";

interface HeaderProps {
  t: Record<string, string>;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header = ({ t, isSearchActive, setIsSearchActive, setIsMenuOpen }: HeaderProps) => {
  return (
    <header className="absolute top-0 inset-x-0 z-[100] px-6 pt-12 pb-4 bg-black/15 backdrop-blur-[40px] border-b border-white/[0.03]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsMenuOpen(true)}>
          <img src={APP_ASSETS.headerLogo} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center h-10">
            <div className="flex items-baseline gap-1.5 group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] transition-all">
              <span className="text-[20px] font-thin text-white/90 tracking-tighter leading-none">{t.market}</span>
              <span className="text-[20px] font-bold text-foreground tracking-tighter leading-none">{t.pulse}</span>
            </div>
            <span className="text-[7.5px] font-medium text-white/40 tracking-[0.25em] uppercase mt-1.5 leading-none">{t.slogan}</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full border border-white/[0.05] flex items-center justify-center bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setIsSearchActive(!isSearchActive)}>
          <Search className="w-4 h-4 text-white/80" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
};
